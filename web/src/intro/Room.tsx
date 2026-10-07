import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Object3D, type Group, type Mesh, type PointLight } from "three";
import { Dust, LampBeam, RainGlass, Steam, Traffic } from "./Atmosphere";
import { Character } from "./Character";
import { Laptop } from "./Laptop";
import { scene } from "./sceneState";
import { makeCityTexture, makeNeonTexture, makeWoodTexture, PhoneScreen } from "./textures";

const WIN = { x: 0.05, y: 1.62, w: 2.0, h: 1.2 };
const WALL_Z = -1.3;

const MESSAGES = [
  { app: "WhatsApp · New client", text: "Hey Mohamed! Can you build us a CRM?" },
  { app: "Rouh · Production", text: "Deploy succeeded. 0 errors in the last 24h." },
  { app: "Dream Day", text: "186 people registered. Leaderboard is live." },
  { app: "WhatsApp · Client", text: "The dashboard is amazing, the team loves it." },
];

function Desk() {
  const wood = useMemo(() => makeWoodTexture(), []);
  useEffect(() => () => wood.dispose(), [wood]);
  return (
    <group>
      <RoundedBox args={[1.7, 0.04, 0.8]} radius={0.008} position={[0, 0.73, -0.75]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} roughness={0.42} metalness={0.05} color="#d9b99a" />
      </RoundedBox>
      {[
        [-0.8, -0.4],
        [0.8, -0.4],
        [-0.8, -1.1],
        [0.8, -1.1],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.355, z]} castShadow>
          <boxGeometry args={[0.035, 0.71, 0.035]} />
          <meshStandardMaterial color="#121216" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <RoundedBox args={[0.82, 0.004, 0.4]} radius={0.002} position={[0.02, 0.751, -0.6]} receiveShadow>
        <meshStandardMaterial color="#17151f" roughness={0.95} />
      </RoundedBox>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, -0.06]}>
      <RoundedBox args={[0.52, 0.08, 0.5]} radius={0.035} position={[0, 0.43, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1c1b24" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.62, 0.08]} radius={0.04} position={[0, 0.82, 0.27]} rotation={[0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#1c1b24" roughness={0.8} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.17, 0.82, 0.315]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.03, 0.56, 0.005]} />
          <meshStandardMaterial color="#d7263d" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.36, 14]} />
        <meshStandardMaterial color="#2a2a33" metalness={0.8} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <mesh position={[0.15, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.015, 0.28, 4, 8]} />
            <meshStandardMaterial color="#1a1a20" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0.3, 0.025, 0]}>
            <sphereGeometry args={[0.025, 12, 10]} />
            <meshStandardMaterial color="#0c0c10" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lamp() {
  const [target] = useState(() => new Object3D());
  const metal = <meshStandardMaterial color="#1b1b20" metalness={0.8} roughness={0.3} />;
  return (
    <group position={[-0.62, 0.75, -0.95]}>
      <mesh position={[0, 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.024, 28]} />
        {metal}
      </mesh>
      <mesh position={[0.03, 0.17, 0.02]} rotation={[0.15, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.32, 10]} />
        {metal}
      </mesh>
      <mesh position={[0.15, 0.35, 0.1]} rotation={[0.6, 0, -1.0]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.3, 10]} />
        {metal}
      </mesh>
      <group position={[0.28, 0.38, 0.2]}>
        <mesh rotation={[0.25, 0, -0.2]} castShadow>
          <coneGeometry args={[0.075, 0.1, 28, 1, true]} />
          <meshStandardMaterial color="#1b1b20" metalness={0.75} roughness={0.35} side={2} />
        </mesh>
        <mesh position={[0, -0.03, 0]}>
          <sphereGeometry args={[0.022, 14, 10]} />
          <meshBasicMaterial color="#fff1d6" toneMapped={false} />
        </mesh>
        <group rotation={[0.25, 0, -0.2]}>
          <LampBeam />
          <group position={[0, -0.05, 0]}>
            <Dust />
          </group>
        </group>
        <primitive object={target} position={[0.12, -0.9, 0.35]} />
        <spotLight
          target={target}
          angle={0.62}
          penumbra={0.75}
          intensity={9}
          distance={3}
          decay={1.6}
          color="#ffb46b"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />
      </group>
    </group>
  );
}

function Phone() {
  const phone = useMemo(() => new PhoneScreen(), []);
  useEffect(() => () => phone.dispose(), [phone]);
  const screen = useRef<Mesh>(null);
  const body = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const shown = useRef(-1);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const period = 9;
    const n = Math.floor((t - 2.5) / period);
    const since = t - 2.5 - n * period;
    if (n >= 0 && n !== shown.current) {
      shown.current = n;
      scene.phoneAt = t;
      phone.show(MESSAGES[n % MESSAGES.length]);
    }
    const on = n >= 0 && since < 3.6;
    const level = on ? Math.min(1, since * 6) * (since > 3.1 ? (3.6 - since) * 2 : 1) : 0;
    if (screen.current) screen.current.visible = level > 0.01;
    if (light.current) light.current.intensity = level * 0.35;
    if (body.current) body.current.position.x = 0.36 + (on && since < 0.5 ? Math.sin(t * 160) * 0.0018 : 0);
  });

  return (
    <group ref={body} position={[0.36, 0.756, -0.42]} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.075, 0.008, 0.155]} radius={0.003} castShadow>
        <meshStandardMaterial color="#0d0d12" metalness={0.5} roughness={0.25} />
      </RoundedBox>
      <mesh ref={screen} position={[0, 0.0042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.068, 0.146]} />
        <meshBasicMaterial map={phone.texture} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.05, 0]} distance={0.5} decay={2} color="#8fb4ff" intensity={0} />
    </group>
  );
}

function Mug() {
  const ceramic = <meshPhysicalMaterial color="#f3efe6" roughness={0.25} clearcoat={0.6} />;
  return (
    <group position={[0.5, 0.752, -0.68]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 28]} />
        {ceramic}
      </mesh>
      <mesh position={[0, 0.098, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.036, 24]} />
        <meshStandardMaterial color="#2a160b" roughness={0.2} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.024, 0.007, 10, 20]} />
        {ceramic}
      </mesh>
      <Steam />
    </group>
  );
}

function Plant() {
  const leaves = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.03;
  });
  return (
    <group position={[0.7, 0.75, -1.0]}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.055, 0.14, 24]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.7} />
      </mesh>
      <group ref={leaves} position={[0, 0.14, 0]}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.03, 0.09, Math.sin(a) * 0.03]} rotation={[Math.sin(a) * 0.5, a, Math.cos(a) * 0.5]}>
              <mesh scale={[0.6, 2.2, 0.25]} castShadow>
                <sphereGeometry args={[0.035, 12, 8]} />
                <meshStandardMaterial color="#2f8f4e" roughness={0.6} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function Books() {
  const colors = ["#2f3b8f", "#c9a227", "#7a1d2b", "#1f6b5c"];
  return (
    <group position={[-0.45, 0.752, -0.62]}>
      {colors.map((c, i) => (
        <RoundedBox
          key={c}
          args={[0.2, 0.028, 0.27]}
          radius={0.004}
          position={[0, 0.014 + i * 0.029, 0]}
          rotation={[0, 0.12 - i * 0.09, 0]}
          castShadow
        >
          <meshStandardMaterial color={c} roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  );
}

/** Wall clock showing the visitor's real local time. */
function Clock() {
  const hour = useRef<Group>(null);
  const minute = useRef<Group>(null);
  const second = useRef<Group>(null);
  useFrame(() => {
    const d = new Date();
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
  });
  return (
    <group position={[1.55, 2.0, WALL_Z + 0.045]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.025, 48]} />
        <meshStandardMaterial color="#e9e5dc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.0135]}>
        <torusGeometry args={[0.16, 0.012, 10, 48]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.135, Math.cos(a) * 0.135, 0.014]} rotation={[0, 0, -a]}>
            <boxGeometry args={[0.006, i % 3 === 0 ? 0.026 : 0.014, 0.002]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        );
      })}
      {(
        [
          [hour, 0.08, 0.01, "#111", 0.018],
          [minute, 0.12, 0.006, "#111", 0.022],
          [second, 0.13, 0.0025, "#d7263d", 0.026],
        ] as const
      ).map(([ref, len, w, color, z], i) => (
        <group key={i} ref={ref} position={[0, 0, z]}>
          <mesh position={[0, len / 2 - 0.015, 0]}>
            <boxGeometry args={[w, len, 0.004]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Walls() {
  const city = useMemo(() => makeCityTexture(), []);
  const neon = useMemo(() => makeNeonTexture("SHIP IT", "#ff2a6d"), []);
  const neon2 = useMemo(() => makeNeonTexture("</>", "#05d9e8"), []);
  useEffect(
    () => () => {
      city.dispose();
      neon.dispose();
      neon2.dispose();
    },
    [city, neon, neon2],
  );

  const left = WIN.x - WIN.w / 2;
  const right = WIN.x + WIN.w / 2;
  const bottom = WIN.y - WIN.h / 2;
  const top = WIN.y + WIN.h / 2;
  const wall = <meshStandardMaterial color="#1a1726" roughness={0.92} />;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#141219" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.15]} receiveShadow>
        <circleGeometry args={[1.05, 64]} />
        <meshStandardMaterial color="#2a1830" roughness={1} />
      </mesh>

      {/* back wall built around the window opening */}
      <mesh position={[(left - 6) / 2, 1.75, WALL_Z]} receiveShadow>
        <boxGeometry args={[6 + left, 3.5, 0.06]} />
        {wall}
      </mesh>
      <mesh position={[(right + 6) / 2, 1.75, WALL_Z]} receiveShadow>
        <boxGeometry args={[6 - right, 3.5, 0.06]} />
        {wall}
      </mesh>
      <mesh position={[WIN.x, bottom / 2, WALL_Z]} receiveShadow>
        <boxGeometry args={[WIN.w, bottom, 0.06]} />
        {wall}
      </mesh>
      <mesh position={[WIN.x, (top + 3.5) / 2, WALL_Z]} receiveShadow>
        <boxGeometry args={[WIN.w, 3.5 - top, 0.06]} />
        {wall}
      </mesh>
      <mesh position={[-2.1, 1.75, 0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4, 3.5]} />
        {wall}
      </mesh>

      {/* the city, far enough back to parallax as the camera moves */}
      <mesh position={[0.2, 1.65, -3.1]}>
        <planeGeometry args={[7.2, 3.6]} />
        <meshBasicMaterial map={city} toneMapped={false} fog={false} />
      </mesh>
      <Traffic />

      <group position={[WIN.x, WIN.y, WALL_Z]}>
        {[
          [0, WIN.h / 2, WIN.w + 0.08, 0.05],
          [0, -WIN.h / 2, WIN.w + 0.08, 0.05],
          [-WIN.w / 2, 0, 0.05, WIN.h],
          [WIN.w / 2, 0, 0.05, WIN.h],
          [0, 0, 0.035, WIN.h],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.01]} castShadow>
            <boxGeometry args={[w, h, 0.07]} />
            <meshStandardMaterial color="#0b0a10" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, -WIN.h / 2 - 0.02, 0.07]}>
          <boxGeometry args={[WIN.w + 0.16, 0.025, 0.16]} />
          <meshStandardMaterial color="#0b0a10" metalness={0.4} roughness={0.5} />
        </mesh>
        <group position={[0, 0, -0.005]}>
          <RainGlass width={WIN.w} height={WIN.h} />
        </group>
      </group>

      {/* LED strip behind the desk */}
      <mesh position={[0, 0.79, WALL_Z + 0.035]}>
        <boxGeometry args={[1.6, 0.012, 0.01]} />
        <meshBasicMaterial color="#c43cff" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.82, WALL_Z + 0.15]} intensity={0.9} distance={1.6} decay={2} color="#b03cff" />

      <mesh position={[-1.55, 1.85, WALL_Z + 0.04]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[0.85, 0.27]} />
        <meshBasicMaterial map={neon} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight position={[-1.55, 1.85, WALL_Z + 0.35]} intensity={1.6} distance={2.4} decay={2} color="#ff2a6d" />
      <mesh position={[-1.55, 1.35, WALL_Z + 0.04]}>
        <planeGeometry args={[0.5, 0.16]} />
        <meshBasicMaterial map={neon2} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight position={[-1.55, 1.35, WALL_Z + 0.3]} intensity={0.7} distance={1.6} decay={2} color="#05d9e8" />

      <Clock />
    </group>
  );
}

export function Room({ progress }: { progress: MutableRefObject<number> }) {
  return (
    <group>
      <ambientLight intensity={0.12} color="#6a6cff" />
      {/* cool moonlight through the window rims the silhouette */}
      <directionalLight position={[0.4, 2.4, -3.5]} intensity={1.6} color="#7f9dff" />
      <directionalLight position={[2.5, 3, 3]} intensity={0.4} color="#8a7dff" />

      <Walls />
      <Desk />
      <Laptop progress={progress} />
      <Chair />
      <Character progress={progress} />
      <Lamp />
      <Phone />
      <Mug />
      <Plant />
      <Books />
    </group>
  );
}
