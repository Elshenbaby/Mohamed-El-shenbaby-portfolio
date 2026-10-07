import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Object3D, type Group, type Mesh, type MeshBasicMaterial } from "three";
import { Character } from "./Character";
import { ScreenCanvas } from "./ScreenCanvas";
import { makeCityTexture, makePosterTexture } from "./textures";
import { Ink, Limb, Toon } from "./toon";

const LID_TILT = -0.26;
const HINGE: [number, number, number] = [0, 0.766, -0.73];

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function Laptop({ progress }: { progress: MutableRefObject<number> }) {
  const screen = useMemo(() => new ScreenCanvas(), []);
  useEffect(() => () => screen.dispose(), [screen]);

  useFrame(({ clock }) => {
    screen.draw(clock.elapsedTime, smooth(0.62, 0.9, progress.current));
  });

  return (
    <group>
      {/* base */}
      <RoundedBox args={[0.31, 0.016, 0.22]} radius={0.006} position={[0, 0.758, -0.62]}>
        <Toon color="#9a9cb0" />
        <Ink t={0.004} />
      </RoundedBox>
      <mesh position={[0, 0.7665, -0.645]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.27, 0.1]} />
        <meshBasicMaterial color="#1c1a2b" />
      </mesh>
      {/* lid hinged at the back edge, leaning away from the user */}
      <group position={HINGE} rotation={[LID_TILT, 0, 0]}>
        <RoundedBox args={[0.31, 0.205, 0.008]} radius={0.004} position={[0, 0.1025, -0.002]}>
          <Toon color="#8d8fa3" />
          <Ink t={0.004} />
        </RoundedBox>
        <mesh position={[0, 0.105, 0.0025]}>
          <planeGeometry args={[0.285, 0.185]} />
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Chair() {
  return (
    <group>
      <RoundedBox args={[0.5, 0.07, 0.48]} radius={0.03} position={[0, 0.43, 0.1]}>
        <Toon color="#40355f" />
        <Ink />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.34, 0.07]} radius={0.035} position={[0, 0.72, 0.37]} rotation={[0.08, 0, 0]}>
        <Toon color="#40355f" />
        <Ink />
      </RoundedBox>
      <Limb from={[0, 0.5, 0.36]} to={[0, 0.58, 0.39]} radius={0.02} color="#151225" />
      <mesh position={[0, 0.21, 0.1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.38, 12]} />
        <Toon color="#151225" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <Limb
            key={i}
            from={[0, 0.04, 0.1]}
            to={[Math.cos(a) * 0.3, 0.03, 0.1 + Math.sin(a) * 0.3]}
            radius={0.018}
            color="#151225"
          />
        );
      })}
    </group>
  );
}

function Desk() {
  return (
    <group>
      <RoundedBox args={[1.7, 0.04, 0.8]} radius={0.01} position={[0, 0.73, -0.75]}>
        <Toon color="#6a4a8c" />
        <Ink />
      </RoundedBox>
      {[
        [-0.8, -0.4],
        [0.8, -0.4],
        [-0.8, -1.1],
        [0.8, -1.1],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.355, z]}>
          <boxGeometry args={[0.04, 0.71, 0.04]} />
          <Toon color="#1e1630" />
        </mesh>
      ))}
    </group>
  );
}

function Lamp() {
  const [lampTarget] = useState(() => new Object3D());
  return (
    <group position={[-0.6, 0.75, -0.98]}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.02, 20]} />
        <Toon color="#ff2a6d" />
        <Ink t={0.005} />
      </mesh>
      <Limb from={[0, 0.02, 0]} to={[0.06, 0.32, 0.05]} radius={0.012} color="#ff2a6d" />
      <Limb from={[0.06, 0.32, 0.05]} to={[0.22, 0.38, 0.2]} radius={0.012} color="#ff2a6d" />
      <mesh position={[0.24, 0.36, 0.22]} rotation={[0.9, 0, -0.5]}>
        <coneGeometry args={[0.07, 0.11, 18, 1, true]} />
        <Toon color="#ff2a6d" />
        <Ink t={0.005} />
      </mesh>
      <mesh position={[0.25, 0.33, 0.23]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshBasicMaterial color="#fff1c4" toneMapped={false} />
      </mesh>
      <primitive object={lampTarget} position={[0.45, -0.75, 0.55]} />
      <spotLight
        position={[0.25, 0.33, 0.23]}
        target={lampTarget}
        angle={0.75}
        penumbra={0.6}
        intensity={5}
        distance={2.5}
        color="#ffb35c"
      />
    </group>
  );
}

function Props() {
  return (
    <group>
      {/* mug */}
      <mesh position={[0.42, 0.8, -0.55]}>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 18]} />
        <Toon color="#f5f0ff" />
        <Ink t={0.005} />
      </mesh>
      <mesh position={[0.467, 0.8, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.008, 8, 14]} />
        <Toon color="#f5f0ff" />
      </mesh>
      {/* phone */}
      <RoundedBox args={[0.075, 0.008, 0.15]} radius={0.003} position={[0.3, 0.755, -0.42]} rotation={[0, 0.3, 0]}>
        <Toon color="#15121f" />
        <Ink t={0.003} />
      </RoundedBox>
      {/* notebooks */}
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[0.22, 0.025, 0.28]}
          radius={0.004}
          position={[-0.42, 0.765 + i * 0.026, -0.6]}
          rotation={[0, 0.15 - i * 0.12, 0]}
        >
          <Toon color={["#05d9e8", "#ffe14d", "#7b2cff"][i]} />
          <Ink t={0.004} />
        </RoundedBox>
      ))}
      {/* plant */}
      <group position={[0.66, 0.75, -1.0]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.12, 16]} />
          <Toon color="#ffe14d" />
          <Ink t={0.005} />
        </mesh>
        {[
          [0, 0.2, 0, 0],
          [0.05, 0.17, 0.02, -0.6],
          [-0.05, 0.18, 0.01, 0.6],
          [0.02, 0.24, -0.03, 0.2],
        ].map(([x, y, z, rz], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, rz]} scale={[0.5, 1.4, 0.5]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <Toon color="#2ad17f" />
            <Ink t={0.004} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function StringLights() {
  const group = useRef<Group>(null);
  const colors = ["#ff2a6d", "#05d9e8", "#ffe14d", "#7b2cff"];
  useFrame(({ clock }) => {
    const t = Math.floor(clock.elapsedTime * 6);
    group.current?.children.forEach((child, i) => {
      const mat = (child as Mesh).material as MeshBasicMaterial;
      mat.opacity = (i + t) % 3 === 0 ? 0.35 : 1;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 22 }, (_, i) => {
        const x = -0.95 + i * 0.1;
        const y = 2.17 - Math.sin((i / 21) * Math.PI) * 0.09;
        return (
          <mesh key={i} position={[x, y, -1.27]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshBasicMaterial color={colors[i % 4]} transparent toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function Walls() {
  const city = useMemo(() => makeCityTexture(), []);
  const ship = useMemo(() => makePosterTexture("ship"), []);
  const beck = useMemo(() => makePosterTexture("beck"), []);
  useEffect(
    () => () => {
      city.dispose();
      ship.dispose();
      beck.dispose();
    },
    [city, ship, beck],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <Toon color="#2c2152" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -0.1]}>
        <circleGeometry args={[0.95, 40]} />
        <Toon color="#3d1d5c" />
      </mesh>
      <mesh position={[0, 1.75, -1.3]}>
        <planeGeometry args={[12, 3.5]} />
        <Toon color="#3a2a6e" />
      </mesh>

      {/* window */}
      <mesh position={[0.05, 1.6, -1.285]}>
        <planeGeometry args={[1.9, 1.15]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>
      {[
        [0.05, 2.19, 2.0, 0.05],
        [0.05, 1.01, 2.0, 0.05],
        [0.05, 1.6, 0.04, 1.15],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -1.27]}>
          <boxGeometry args={[w, h, 0.04]} />
          <Toon color="#120d22" />
        </mesh>
      ))}
      {[-0.95, 1.05].map((x) => (
        <mesh key={x} position={[x, 1.6, -1.27]}>
          <boxGeometry args={[0.05, 1.23, 0.04]} />
          <Toon color="#120d22" />
        </mesh>
      ))}
      <mesh position={[0.05, 1.01, -1.22]}>
        <boxGeometry args={[2.1, 0.03, 0.12]} />
        <Toon color="#120d22" />
      </mesh>

      {/* posters */}
      <mesh position={[-1.55, 1.62, -1.285]} rotation={[0, 0, 0.04]}>
        <planeGeometry args={[0.52, 0.73]} />
        <meshBasicMaterial map={ship} toneMapped={false} />
      </mesh>
      <mesh position={[1.62, 1.58, -1.285]} rotation={[0, 0, -0.03]}>
        <planeGeometry args={[0.52, 0.73]} />
        <meshBasicMaterial map={beck} toneMapped={false} />
      </mesh>

      <StringLights />
    </group>
  );
}

export function Room({ progress }: { progress: MutableRefObject<number> }) {
  return (
    <group>
      <ambientLight intensity={1.15} color="#8b7cf0" />
      <directionalLight position={[2.5, 3.2, 3.5]} intensity={1.5} color="#b9adff" />
      {/* screen glow lights the figure's front and rims the silhouette */}
      <pointLight position={[0, 0.95, -0.62]} intensity={1.6} distance={2.2} decay={1.4} color="#46e3ff" />
      {/* magenta rim from the window side: the signature two-tone split */}
      <directionalLight position={[-2.5, 2.4, -3]} intensity={2.2} color="#ff2a6d" />
      <directionalLight position={[2.2, 2.6, -2.6]} intensity={1.2} color="#05d9e8" />

      <Walls />
      <Desk />
      <Laptop progress={progress} />
      <Chair />
      <Character />
      <Lamp />
      <Props />
    </group>
  );
}
