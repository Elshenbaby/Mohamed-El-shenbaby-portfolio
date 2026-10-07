import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Color, Matrix4, Object3D, type InstancedMesh, type RectAreaLight } from "three";
import { ScreenCanvas } from "./ScreenCanvas";
import { LAPTOP_POS, LID_TILT } from "./layout";
import { scene } from "./sceneState";
import { typing } from "./typing";

const DEPTH = 0.22;
const WIDTH = 0.312;

type Key = { x: number; z: number; w: number };

function buildKeys(): Key[] {
  const keys: Key[] = [];
  const u = 0.0186;
  const gap = 0.0021;
  const rows: number[][] = [
    Array(14).fill(1),
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7],
    [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
    [1, 1, 1, 1.25, 5.3, 1.25, 1, 1, 1],
  ];
  rows.forEach((row, ri) => {
    const total = row.reduce((a, b) => a + b, 0) * u;
    let x = -total / 2;
    const z = -0.052 + ri * (u + gap * 0.6) - (ri === 0 ? 0.002 : 0);
    row.forEach((w) => {
      const width = w * u - gap;
      keys.push({ x: x + (w * u) / 2, z, w: width });
      x += w * u;
    });
  });
  return keys;
}

const KEYS = buildKeys();

function Keyboard() {
  const mesh = useRef<InstancedMesh>(null);
  const pressed = useRef(new Float32Array(KEYS.length));
  const next = useRef(0);
  const geo = useMemo(() => new RoundedBoxGeometry(1, 0.0016, 1, 2, 0.0006), []);
  const tmp = useMemo(() => new Object3D(), []);
  const m = useMemo(() => new Matrix4(), []);

  useEffect(() => () => geo.dispose(), [geo]);

  useLayoutEffect(() => {
    const im = mesh.current;
    if (!im) return;
    KEYS.forEach((k, i) => {
      tmp.position.set(k.x, 0, k.z);
      tmp.scale.set(k.w, 1, 0.0165);
      tmp.updateMatrix();
      im.setMatrixAt(i, tmp.matrix);
      im.setColorAt(i, new Color("#121216"));
    });
    im.instanceMatrix.needsUpdate = true;
  }, [tmp]);

  useFrame(({ clock }, dt) => {
    const im = mesh.current;
    if (!im) return;
    const t = clock.elapsedTime;
    const p = pressed.current;
    if (typing.active && !scene.handsBusy && t >= next.current) {
      // the space bar and home row get hit more often, like real typing
      const r = Math.random();
      const i = r < 0.16 ? KEYS.length - 5 : 15 + Math.floor(Math.random() * (KEYS.length - 26));
      p[i] = 1;
      typing.x = KEYS[i].x;
      typing.z = KEYS[i].z;
      typing.at = t;
      next.current = t + 0.06 + Math.random() * 0.11;
    }
    for (let i = 0; i < KEYS.length; i++) {
      if (p[i] <= 0) continue;
      p[i] = Math.max(0, p[i] - dt * 9);
      im.getMatrixAt(i, m);
      tmp.position.set(KEYS[i].x, -0.0009 * p[i], KEYS[i].z);
      tmp.scale.set(KEYS[i].w, 1, 0.0165);
      tmp.updateMatrix();
      im.setMatrixAt(i, tmp.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, KEYS.length]} position={[0, 0.0094, 0]} castShadow>
      <meshStandardMaterial color="#141418" roughness={0.55} metalness={0.1} />
    </instancedMesh>
  );
}

export function Laptop({ progress }: { progress: MutableRefObject<number> }) {
  const screen = useMemo(() => new ScreenCanvas(), []);
  const glow = useRef<RectAreaLight>(null);

  useEffect(() => () => screen.dispose(), [screen]);

  useFrame(({ clock }) => {
    screen.draw(clock.elapsedTime, progress.current);
    typing.active = screen.typing;
    if (glow.current) {
      // the screen light warms up when the browser (white page) is showing
      const p = progress.current;
      const light = p > 0.58 && p < 0.76;
      glow.current.color.set(light ? "#fff4ec" : p >= 0.76 ? "#c58bff" : "#9fd6ff");
      glow.current.intensity = light ? 7 : 4.2;
    }
  });

  return (
    <group position={LAPTOP_POS}>
      {/* aluminium base */}
      <RoundedBox args={[WIDTH, 0.0155, DEPTH]} radius={0.006} smoothness={4} position={[0, 0.00775, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#b8bcc6" metalness={0.92} roughness={0.32} />
      </RoundedBox>
      {/* keyboard well */}
      <mesh position={[0, 0.0157, -0.018]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.285, 0.122]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.8} />
      </mesh>
      <group position={[0, 0.0065, -0.018]}>
        <Keyboard />
      </group>
      {/* trackpad */}
      <mesh position={[0, 0.0157, 0.068]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.13, 0.072]} />
        <meshStandardMaterial color="#a9adb7" metalness={0.6} roughness={0.22} />
      </mesh>

      {/* lid, hinged at the back edge */}
      <group position={[0, 0.0155, -DEPTH / 2 + 0.004]} rotation={[LID_TILT, 0, 0]}>
        <RoundedBox args={[WIDTH, 0.212, 0.0058]} radius={0.005} smoothness={4} position={[0, 0.106, -0.003]} castShadow>
          <meshStandardMaterial color="#b8bcc6" metalness={0.92} roughness={0.3} />
        </RoundedBox>
        {/* black glass bezel */}
        <mesh position={[0, 0.106, 0.0002]}>
          <planeGeometry args={[0.304, 0.204]} />
          <meshPhysicalMaterial color="#020203" roughness={0.08} metalness={0} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        {/* display */}
        <mesh position={[0, 0.107, 0.0006]}>
          <planeGeometry args={[0.288, 0.187]} />
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>
        {/* camera notch */}
        <mesh position={[0, 0.2045, 0.0007]}>
          <planeGeometry args={[0.03, 0.0075]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <rectAreaLight ref={glow} position={[0, 0.107, 0.003]} rotation={[0, Math.PI, 0]} width={0.288} height={0.187} intensity={4.2} color="#9fd6ff" />
      </group>
    </group>
  );
}
