import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MathUtils, Quaternion, Vector3, type Group, type Mesh } from "three";
import { LAPTOP_POS } from "./layout";
import { typing } from "./typing";
import { scene } from "./sceneState";

const UP = new Vector3(0, 1, 0);

function Hoodie({ color = "#a3102a" }: { color?: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.9} sheen={0.5} sheenColor="#ff4d6d" sheenRoughness={0.7} />;
}
function Skin() {
  return <meshPhysicalMaterial color="#c08560" roughness={0.5} sheen={0.4} sheenColor="#ffb08a" />;
}
function Hair() {
  return <meshPhysicalMaterial color="#2a1a12" roughness={0.5} sheen={0.6} sheenColor="#6b4a3a" />;
}

/** Capsule whose ends are placed every frame. */
function useSegment() {
  const ref = useRef<Mesh>(null);
  const tmp = useMemo(() => ({ mid: new Vector3(), dir: new Vector3(), q: new Quaternion() }), []);
  const place = (a: Vector3, b: Vector3) => {
    const m = ref.current;
    if (!m) return;
    tmp.dir.subVectors(b, a);
    const len = tmp.dir.length();
    tmp.q.setFromUnitVectors(UP, tmp.dir.normalize());
    m.position.copy(tmp.mid.addVectors(a, b).multiplyScalar(0.5));
    m.quaternion.copy(tmp.q);
    m.scale.set(1, len, 1);
  };
  return [ref, place] as const;
}

/** Two-bone IK: elbow bends outward and down, like resting arms on a desk. */
function solveElbow(s: Vector3, w: Vector3, l1: number, l2: number, side: number, out: Vector3) {
  const d = Math.min(s.distanceTo(w), l1 + l2 - 1e-4);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const dir = new Vector3().subVectors(w, s).normalize();
  const pole = new Vector3(side * 0.85, -1, 0.15).normalize();
  const perp = pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
  out.copy(s).addScaledVector(dir, a).addScaledVector(perp, h);
}

function Arm({ side, progress }: { side: 1 | -1; progress: MutableRefObject<number> }) {
  const [upper, placeUpper] = useSegment();
  const [lower, placeLower] = useSegment();
  const hand = useRef<Group>(null);
  const v = useMemo(
    () => ({
      shoulder: new Vector3(side * 0.185, 0.985, -0.03),
      wrist: new Vector3(),
      target: new Vector3(),
      elbow: new Vector3(),
    }),
    [side],
  );
  const kb = useMemo(() => new Vector3(LAPTOP_POS[0], LAPTOP_POS[1] + 0.03, LAPTOP_POS[2] - 0.018), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const p = progress.current;
    const browsing = p > 0.58 && p < 0.76;
    // resting on the home row by default
    v.target.set(kb.x + side * 0.065, kb.y, kb.z + 0.02);
    const sinceKey = t - typing.at;
    if (typing.active && Math.sign(typing.x || side) === side && sinceKey < 0.12) {
      v.target.set(kb.x + typing.x, kb.y - 0.006 * (1 - sinceKey / 0.12), kb.z + typing.z + 0.012);
    }
    if (browsing && side === 1) {
      // right hand drifts to the trackpad and scrolls
      v.target.set(kb.x + 0.01 + Math.sin(t * 1.3) * 0.012, kb.y - 0.012, LAPTOP_POS[2] + 0.07 + Math.sin(t * 2.1) * 0.01);
    }
    v.wrist.lerp(v.target, 1 - Math.exp(-dt * 22));
    solveElbow(v.shoulder, v.wrist, 0.3, 0.31, side, v.elbow);
    placeUpper(v.shoulder, v.elbow);
    placeLower(v.elbow, v.wrist);
    if (hand.current) {
      hand.current.position.copy(v.wrist);
      hand.current.rotation.set(0.15, side * -0.25, 0);
    }
  });

  return (
    <group>
      <mesh ref={upper} castShadow>
        <capsuleGeometry args={[0.048, 1, 6, 14]} />
        <Hoodie />
      </mesh>
      <mesh ref={lower} castShadow>
        <capsuleGeometry args={[0.038, 1, 6, 14]} />
        <Hoodie />
      </mesh>
      <group ref={hand}>
        {/* cuff */}
        <mesh position={[0, 0.004, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.042, 0.03, 16]} />
          <Hoodie color="#8f1023" />
        </mesh>
        <mesh scale={[1, 0.45, 1.3]} castShadow>
          <sphereGeometry args={[0.04, 18, 12]} />
          <Skin />
        </mesh>
        {[-1.5, -0.5, 0.5, 1.5].map((f) => (
          <mesh key={f} position={[f * 0.014, -0.006, -0.04]} rotation={[0.5, 0, 0]}>
            <capsuleGeometry args={[0.0065, 0.022, 4, 8]} />
            <Skin />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Character({ progress }: { progress: MutableRefObject<number> }) {
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const look = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (torso.current) {
      const breath = Math.sin(t * 1.4);
      torso.current.scale.set(1 + breath * 0.008, 1 + breath * 0.012, 1 + breath * 0.012);
      torso.current.rotation.x = -0.2 + Math.sin(t * 0.37) * 0.015;
    }
    if (head.current) {
      // glance at the phone for a moment when it lights up
      const sincePhone = t - scene.phoneAt;
      const glance = sincePhone > 0.2 && sincePhone < 2.2 ? 1 : 0;
      look.current = MathUtils.lerp(look.current, glance, 1 - Math.exp(-dt * 5));
      const nod = Math.max(0, Math.sin(t * Math.PI * 1.8)) * 0.035;
      head.current.rotation.set(0.22 + nod + look.current * 0.15, look.current * -0.75 + Math.sin(t * 0.3) * 0.05, 0);
    }
  });

  return (
    <group>
      {/* legs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.1, 0.5, -0.12]} rotation={[Math.PI / 2 - 0.05, 0, 0]} castShadow>
            <capsuleGeometry args={[0.072, 0.34, 6, 14]} />
            <meshStandardMaterial color="#14131c" roughness={0.85} />
          </mesh>
          <mesh position={[s * 0.11, 0.27, -0.33]} rotation={[0.08, 0, 0]} castShadow>
            <capsuleGeometry args={[0.058, 0.38, 6, 14]} />
            <meshStandardMaterial color="#14131c" roughness={0.85} />
          </mesh>
          <RoundedBox args={[0.1, 0.07, 0.25]} radius={0.03} position={[s * 0.115, 0.04, -0.39]} castShadow>
            <meshStandardMaterial color="#f1efe9" roughness={0.6} />
          </RoundedBox>
        </group>
      ))}

      <group ref={torso} position={[0, 0.5, 0.06]}>
        {/* back and chest: a tapered capsule reads as a body, not a box */}
        <mesh position={[0, 0.27, 0]} scale={[1.12, 1, 0.66]} castShadow receiveShadow>
          <capsuleGeometry args={[0.17, 0.24, 10, 28]} />
          <Hoodie />
        </mesh>
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * 0.15, 0.43, -0.02]} scale={[1, 0.75, 0.85]} castShadow>
            <sphereGeometry args={[0.068, 22, 16]} />
            <Hoodie />
          </mesh>
        ))}
        {/* ribbed hem */}
        <mesh position={[0, 0.06, 0]} scale={[1.1, 1, 0.66]}>
          <cylinderGeometry args={[0.172, 0.17, 0.05, 32]} />
          <Hoodie color="#7d0b1f" />
        </mesh>
        {/* hood folded down over the upper back */}
        <mesh position={[0, 0.47, 0.085]} rotation={[-0.35, 0, 0]} scale={[1.05, 0.75, 0.55]} castShadow>
          <sphereGeometry args={[0.13, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <Hoodie color="#8c0c22" />
        </mesh>
        <mesh position={[0, 0.43, 0.11]} rotation={[0.6, 0, 0]} scale={[1, 0.5, 0.35]}>
          <sphereGeometry args={[0.11, 22, 14]} />
          <meshStandardMaterial color="#3b0610" roughness={1} />
        </mesh>
        {/* centre back seam and side seams */}
        <mesh position={[0, 0.27, 0.113]}>
          <boxGeometry args={[0.003, 0.3, 0.002]} />
          <meshStandardMaterial color="#5e0716" roughness={1} />
        </mesh>
      </group>

      <Arm side={-1} progress={progress} />
      <Arm side={1} progress={progress} />

      {/* neck */}
      <mesh position={[0, 1.07, -0.02]} castShadow>
        <cylinderGeometry args={[0.045, 0.052, 0.09, 16]} />
        <Skin />
      </mesh>

      <group ref={head} position={[0, 1.13, -0.03]}>
        <group position={[0, 0.06, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 32, 24]} />
            <Skin />
          </mesh>
          {/* hair: cap, crown volume and short tufts */}
          <mesh position={[0, 0.02, 0.008]} rotation={[0.35, 0, 0]} scale={[1.05, 1, 1.07]} castShadow>
            <sphereGeometry args={[0.103, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
            <Hair />
          </mesh>
          <mesh position={[0, 0.07, -0.01]} scale={[0.95, 0.45, 1]}>
            <sphereGeometry args={[0.09, 24, 14]} />
            <Hair />
          </mesh>
          {Array.from({ length: 26 }, (_, i) => {
            const a = i * 2.39996;
            const r = 0.03 + (i / 26) * 0.055;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * r, 0.088 - (r - 0.03) * 0.55, Math.sin(a) * r + 0.004]}
                scale={[1, 0.6, 1]}
              >
                <sphereGeometry args={[0.024, 10, 8]} />
                <Hair />
              </mesh>
            );
          })}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.099, -0.008, 0.005]} scale={[0.4, 1, 0.7]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <Skin />
            </mesh>
          ))}
          {/* over-ear headphones */}
          <mesh>
            <torusGeometry args={[0.122, 0.012, 10, 48, Math.PI]} />
            <meshStandardMaterial color="#111116" roughness={0.4} metalness={0.3} />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.118, -0.012, 0.0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.048, 0.048, 0.034, 28]} />
                <meshStandardMaterial color="#141418" roughness={0.45} metalness={0.25} />
              </mesh>
              <mesh position={[0, -s * 0.0172, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.034, 0.0032, 8, 32]} />
                <meshBasicMaterial color="#38f0ff" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
