import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines, RoundedBox } from "@react-three/drei";
import { MathUtils, Quaternion, Vector2, Vector3, type Group, type Mesh } from "three";
import { LAPTOP_POS } from "./layout";
import { scene } from "./sceneState";
import { makeHairBump } from "./textures";
import { typing } from "./typing";

/** The whole figure sits this far forward so the elbows bend naturally at the desk. */
const BODY_Z = -0.18;
const UP = new Vector3(0, 1, 0);
const INK = "#07050d";

const HOODIE = "#b0122c";
const HOODIE_SHADE = "#7e0a1e";
const SKIN = "#c08560";
const HAIR = "#211510";

function Ink({ px = 2.2 }: { px?: number }) {
  return <Outlines thickness={px} color={INK} />;
}
function Hoodie({ color = HOODIE }: { color?: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.88} sheen={0.6} sheenColor="#ff5a78" sheenRoughness={0.7} />;
}
function Skin() {
  return <meshPhysicalMaterial color={SKIN} roughness={0.5} sheen={0.5} sheenColor="#ffb08a" />;
}
function Hair() {
  return <meshPhysicalMaterial color={HAIR} roughness={0.55} sheen={0.7} sheenColor="#7a5444" />;
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** 0..1 weight of the occasional "lean back and stretch" break. */
function stretchWeight(t: number) {
  const c = (t + 6) % 19;
  return smooth(13, 13.8, c) * (1 - smooth(16.2, 17.2, c));
}

/** Hoodie torso as a lathe: rounded shoulders, slight taper, flattened front to back. */
function useTorsoProfile() {
  return useMemo(
    () =>
      [
        [0.0, 0.0],
        [0.165, 0.005],
        [0.185, 0.05],
        [0.19, 0.16],
        [0.198, 0.3],
        [0.208, 0.4],
        [0.2, 0.455],
        [0.17, 0.5],
        [0.11, 0.53],
        [0.05, 0.54],
        [0.0, 0.542],
      ].map(([x, y]) => new Vector2(x, y)),
    [],
  );
}

/** Places a unit cylinder between two points every frame. */
function place(m: Mesh | null, a: Vector3, b: Vector3, tmp: { mid: Vector3; dir: Vector3; q: Quaternion }) {
  if (!m) return;
  tmp.dir.subVectors(b, a);
  const len = tmp.dir.length();
  tmp.q.setFromUnitVectors(UP, tmp.dir.normalize());
  m.position.copy(tmp.mid.addVectors(a, b).multiplyScalar(0.5));
  m.quaternion.copy(tmp.q);
  m.scale.set(1, len, 1);
}

/** Two-bone IK: the elbow sits on the circle allowed by both bone lengths, pushed toward the pole. */
function solveElbow(
  s: Vector3,
  w: Vector3,
  l1: number,
  l2: number,
  pole: Vector3,
  out: Vector3,
  dir: Vector3,
  perp: Vector3,
) {
  const d = Math.min(s.distanceTo(w), l1 + l2 - 1e-4);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  dir.subVectors(w, s).normalize();
  perp.copy(pole).addScaledVector(dir, -pole.dot(dir)).normalize();
  out.copy(s).addScaledVector(dir, a).addScaledVector(perp, h);
}

function Hand({ side, fingers }: { side: 1 | -1; fingers: RefObject<(Group | null)[]> }) {
  return (
    <group>
      {/* ribbed cuff */}
      <mesh position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.04, 0.035, 18]} />
        <Hoodie color={HOODIE_SHADE} />
        <Ink px={1.6} />
      </mesh>
      {/* back of the hand */}
      <mesh position={[0, 0, 0.012]} scale={[1, 0.42, 1.2]}>
        <sphereGeometry args={[0.036, 18, 12]} />
        <Skin />
        <Ink px={1.6} />
      </mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((f, i) => (
        <group
          key={f}
          ref={(el) => {
            fingers.current[i] = el;
          }}
          position={[f * 0.0135, -0.004, 0.045]}
        >
          <mesh position={[0, -0.006, 0.014]} rotation={[Math.PI / 2 + 0.55, 0, 0]}>
            <capsuleGeometry args={[0.0062, 0.026 - Math.abs(f) * 0.003, 4, 8]} />
            <Skin />
          </mesh>
        </group>
      ))}
      {/* thumb on the inside edge */}
      <mesh position={[-side * 0.03, -0.006, 0.022]} rotation={[Math.PI / 2 + 0.3, 0, side * 0.7]}>
        <capsuleGeometry args={[0.0075, 0.022, 4, 8]} />
        <Skin />
      </mesh>
    </group>
  );
}

function Arm({
  side,
  progress,
  torso,
}: {
  side: 1 | -1;
  progress: MutableRefObject<number>;
  torso: RefObject<Group | null>;
}) {
  const shoulderBall = useRef<Mesh>(null);
  const upper = useRef<Mesh>(null);
  const lower = useRef<Mesh>(null);
  const elbowBall = useRef<Mesh>(null);
  const hand = useRef<Group>(null);
  const fingers = useRef<(Group | null)[]>([]);
  const lastKey = useRef(-1);
  const tap = useRef(0);

  const v = useMemo(
    () => ({
      shoulder: new Vector3(side * 0.185, 0.94, -0.03),
      wrist: new Vector3(side * 0.08, 0.79, -0.4),
      target: new Vector3(),
      elbow: new Vector3(),
      pole: new Vector3(),
      look: new Vector3(),
      dir: new Vector3(),
      perp: new Vector3(),
      seg: { mid: new Vector3(), dir: new Vector3(), q: new Quaternion() },
    }),
    [side],
  );
  // keyboard home row, in this body's local space
  const kb = useMemo(() => new Vector3(LAPTOP_POS[0], LAPTOP_POS[1] + 0.03, LAPTOP_POS[2] - 0.018 - BODY_Z), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const p = progress.current;
    const browsing = p > 0.58 && p < 0.76;
    const stretch = stretchWeight(t);
    // shoulders ride on the torso as it leans and breathes
    const body = torso.current;
    if (body) {
      v.shoulder.set(side * 0.178, 0.445, -0.005).applyEuler(body.rotation).add(body.position);
      shoulderBall.current?.position.copy(v.shoulder);
    }

    v.target.set(kb.x + side * 0.078, kb.y, kb.z + 0.03);
    const sinceKey = t - typing.at;
    const mine = Math.sign(typing.x || side) === side;
    if (typing.active && mine && sinceKey < 0.14) {
      // each hand stays on its own half of the keyboard
      const x = side * Math.max(0.045, Math.abs(typing.x) * 0.95);
      v.target.set(kb.x + x, kb.y - 0.004, kb.z + typing.z + 0.03);
      if (typing.at !== lastKey.current) {
        lastKey.current = typing.at;
        tap.current = Math.floor(Math.random() * 4);
      }
    }
    if (browsing && side === 1) {
      v.target.set(
        kb.x + 0.012 + Math.sin(t * 1.3) * 0.012,
        kb.y - 0.012,
        LAPTOP_POS[2] + 0.075 - BODY_Z + Math.sin(t * 2.1) * 0.01,
      );
    }
    // hands meet behind the head during a stretch
    if (stretch > 0) {
      v.look.set(side * 0.07, 1.3, -0.02);
      v.target.lerp(v.look, stretch);
    }

    v.wrist.lerp(v.target, 1 - Math.exp(-dt * (stretch > 0 ? 6 : 20)));
    // elbows hang down and out while typing, swing up and out when stretching
    v.pole.set(side * 0.55, -1, 0.35).lerp(v.look.set(side * 1, 0.4, 0.4), stretch);
    solveElbow(v.shoulder, v.wrist, 0.285, 0.275, v.pole, v.elbow, v.dir, v.perp);

    place(upper.current, v.shoulder, v.elbow, v.seg);
    place(lower.current, v.elbow, v.wrist, v.seg);
    elbowBall.current?.position.copy(v.elbow);

    const h = hand.current;
    if (h) {
      h.position.copy(v.wrist);
      // fingers point mostly forward at the keys, not along the angled forearm
      v.look.subVectors(v.wrist, v.elbow).normalize();
      v.look.set(v.look.x * 0.35, v.look.y, -1).normalize().add(v.wrist);
      h.lookAt(v.look);
    }
    // the finger that hit the key dips, the rest relax
    fingers.current.forEach((f, i) => {
      if (!f) return;
      const down = typing.active && mine && i === tap.current ? Math.max(0, 1 - sinceKey / 0.12) : 0;
      f.rotation.x = MathUtils.lerp(f.rotation.x, down * 0.45 + stretch * -0.6, 1 - Math.exp(-dt * 30));
    });
  });

  return (
    <group>
      <mesh ref={shoulderBall} position={v.shoulder} castShadow>
        <sphereGeometry args={[0.064, 22, 16]} />
        <Hoodie />
      </mesh>
      <mesh ref={upper} castShadow>
        <cylinderGeometry args={[0.048, 0.06, 1, 18, 1, true]} />
        <Hoodie />
        <Ink />
      </mesh>
      <mesh ref={elbowBall} castShadow>
        <sphereGeometry args={[0.049, 18, 12]} />
        <Hoodie />
      </mesh>
      <mesh ref={lower} castShadow>
        <cylinderGeometry args={[0.04, 0.048, 1, 18, 1, true]} />
        <Hoodie />
        <Ink />
      </mesh>
      <group ref={hand}>
        <Hand side={side} fingers={fingers} />
      </group>
    </group>
  );
}

function Head() {
  const hairBump = useMemo(() => makeHairBump(), []);
  useEffect(() => () => hairBump.dispose(), [hairBump]);
  return (
    <group>
      {/* skull, jaw and short beard */}
      <mesh scale={[0.95, 1.06, 1.02]} castShadow>
        <sphereGeometry args={[0.1, 32, 24]} />
        <Skin />
        <Ink />
      </mesh>
      <mesh position={[0, -0.052, -0.03]} scale={[0.92, 0.8, 1]}>
        <sphereGeometry args={[0.075, 24, 16]} />
        <Skin />
      </mesh>
      <mesh position={[0, -0.05, -0.028]} scale={[0.97, 0.86, 1.05]}>
        <sphereGeometry args={[0.078, 24, 16, Math.PI, Math.PI, Math.PI * 0.42, Math.PI * 0.58]} />
        <Hair />
      </mesh>
      {/* moustache */}
      <mesh position={[0, -0.042, -0.094]} rotation={[0, 0, Math.PI / 2]} scale={[0.35, 1, 0.5]}>
        <capsuleGeometry args={[0.012, 0.03, 4, 10]} />
        <Hair />
      </mesh>
      {/* nose */}
      <mesh position={[0, -0.012, -0.102]} scale={[0.7, 1, 1]}>
        <sphereGeometry args={[0.018, 14, 10]} />
        <Skin />
        <Ink px={1.4} />
      </mesh>
      {/* eyes and brows, seen when he glances over */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.036, 0.016, -0.091]}>
          <mesh scale={[1, 0.75, 0.5]}>
            <sphereGeometry args={[0.012, 12, 10]} />
            <meshStandardMaterial color="#120c0a" roughness={0.2} />
          </mesh>
          <mesh position={[s * -0.003, 0.004, -0.004]}>
            <sphereGeometry args={[0.0028, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.022, -0.002]} rotation={[0, 0, s * -0.12]}>
            <boxGeometry args={[0.03, 0.006, 0.008]} />
            <Hair />
          </mesh>
        </group>
      ))}
      {/* ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.094, -0.005, 0.004]} scale={[0.42, 1, 0.72]}>
          <sphereGeometry args={[0.026, 14, 10]} />
          <Skin />
          <Ink px={1.4} />
        </mesh>
      ))}

      {/* hair: a close cap down to the nape with a curly bump texture, and volume on top */}
      <mesh position={[0, 0.006, 0.012]} rotation={[0.62, 0, 0]} scale={[1.02, 1.05, 1.07]} castShadow>
        <sphereGeometry args={[0.104, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={HAIR} roughness={0.82} bumpMap={hairBump} bumpScale={2.2} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.072, 0.004]} scale={[0.9, 0.42, 0.98]} castShadow>
        <sphereGeometry args={[0.1, 40, 24]} />
        <meshStandardMaterial color={HAIR} roughness={0.82} bumpMap={hairBump} bumpScale={2.2} />
      </mesh>
      {/* over-ear headphones */}
      <mesh position={[0, 0.006, 0.006]}>
        <torusGeometry args={[0.122, 0.012, 10, 48, Math.PI]} />
        <meshStandardMaterial color="#111116" roughness={0.4} metalness={0.3} />
        <Ink px={1.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.116, -0.008, 0.006]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.046, 0.046, 0.032, 28]} />
            <meshStandardMaterial color="#141418" roughness={0.45} metalness={0.25} />
            <Ink px={1.8} />
          </mesh>
          <mesh position={[0, -s * 0.0168, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.032, 0.003, 8, 32]} />
            <meshBasicMaterial color="#38f0ff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Character({ progress }: { progress: MutableRefObject<number> }) {
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const look = useRef(0);
  const profile = useTorsoProfile();

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const stretch = stretchWeight(t);
    scene.handsBusy = stretch > 0.05;
    if (torso.current) {
      const breath = Math.sin(t * 1.4);
      torso.current.scale.set(1 + breath * 0.008, 1 + breath * 0.01, 1 + breath * 0.012);
      // lean in while typing, sit back for the stretch
      torso.current.rotation.x = MathUtils.lerp(-0.14 + Math.sin(t * 0.37) * 0.012, 0.06, stretch);
      torso.current.rotation.y = Math.sin(t * 0.23) * 0.025;
    }
    if (head.current) {
      const sincePhone = t - scene.phoneAt;
      const glance = sincePhone > 0.2 && sincePhone < 2.4 ? 1 : 0;
      look.current = MathUtils.lerp(look.current, glance, 1 - Math.exp(-dt * 5));
      const nod = Math.max(0, Math.sin(t * Math.PI * 1.8)) * 0.04 * (1 - stretch);
      head.current.rotation.set(
        -0.24 - nod - look.current * 0.3 + stretch * 0.45,
        -look.current * 0.8 + Math.sin(t * 0.3) * 0.05,
        Math.sin(t * 0.9) * 0.02 + stretch * 0.08,
      );
      head.current.position.z = -0.065 + stretch * 0.04;
      head.current.position.y = 0.665;
    }
  });

  return (
    <group position={[0, 0, BODY_Z]}>
      {/* coloured rim lights carve the silhouette out of the dark room */}
      <pointLight position={[0.45, 1.55, -0.05]} intensity={0.9} distance={1.2} decay={2} color="#a9dcff" />
      <pointLight position={[-0.55, 1.35, 0.3]} intensity={1.1} distance={1.3} decay={2} color="#ff2a6d" />
      {/* legs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.1, 0.5, -0.14]} rotation={[Math.PI / 2 - 0.05, 0, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.3, 6, 14]} />
            <meshStandardMaterial color="#15141d" roughness={0.85} />
          </mesh>
          <mesh position={[s * 0.11, 0.27, -0.33]} rotation={[0.08, 0, 0]} castShadow>
            <capsuleGeometry args={[0.056, 0.36, 6, 14]} />
            <meshStandardMaterial color="#15141d" roughness={0.85} />
          </mesh>
          <RoundedBox args={[0.1, 0.06, 0.24]} radius={0.028} position={[s * 0.115, 0.05, -0.39]} castShadow>
            <meshStandardMaterial color="#f1efe9" roughness={0.6} />
          </RoundedBox>
          <mesh position={[s * 0.115, 0.012, -0.39]}>
            <boxGeometry args={[0.104, 0.02, 0.25]} />
            <meshStandardMaterial color="#d7263d" roughness={0.7} />
          </mesh>
        </group>
      ))}

      <group ref={torso} position={[0, 0.5, 0.04]}>
        <mesh scale={[1, 1, 0.66]} castShadow receiveShadow>
          <latheGeometry args={[profile, 40]} />
          <Hoodie />
          <Ink />
        </mesh>
        {/* ribbed hem */}
        <mesh position={[0, 0.03, 0]} scale={[1, 1, 0.66]}>
          <cylinderGeometry args={[0.172, 0.168, 0.06, 40, 1, true]} />
          <Hoodie color={HOODIE_SHADE} />
        </mesh>
        {/* hood folded on the upper back, with its dark inside showing */}
        <mesh position={[0, 0.47, 0.08]} rotation={[-0.5, 0, 0]} scale={[1.08, 0.72, 0.62]} castShadow>
          <sphereGeometry args={[0.125, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <Hoodie color="#9a1027" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.5, 0.06]} rotation={[-0.2, 0, 0]} scale={[1, 0.55, 0.7]}>
          <sphereGeometry args={[0.1, 22, 14]} />
          <meshStandardMaterial color="#3a0610" roughness={1} />
        </mesh>
        {/* collar around the neck, and drawstrings at the front */}
        <mesh position={[0, 0.552, -0.025]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <torusGeometry args={[0.07, 0.02, 14, 36]} />
          <Hoodie color="#9a1027" />
          <Ink px={1.6} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.035, 0.44, -0.13]} rotation={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.15, 6]} />
            <meshStandardMaterial color="#f1efe9" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.27, 0.128]}>
          <boxGeometry args={[0.003, 0.32, 0.002]} />
          <meshStandardMaterial color="#5e0716" roughness={1} />
        </mesh>

        <mesh position={[0, 0.575, -0.04]} castShadow>
          <cylinderGeometry args={[0.048, 0.054, 0.07, 16]} />
          <meshPhysicalMaterial color="#9a6648" roughness={0.6} />
        </mesh>
        <group ref={head} position={[0, 0.665, -0.065]}>
          <Head />
        </group>
      </group>

      <Arm side={-1} progress={progress} torso={torso} />
      <Arm side={1} progress={progress} torso={torso} />
    </group>
  );
}
