import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { Ink, Limb, Toon } from "./toon";

const HOODIE = "#d7263d";
const HOODIE_DARK = "#a3182c";
const SKIN = "#b9825f";
const HAIR = "#3a2620";
const PANTS = "#17142a";
const PHONES = "#121018";

/** Seated figure seen from behind, facing -Z toward the laptop. */
export function Character() {
  const upper = useRef<Group>(null);
  const head = useRef<Group>(null);
  const handL = useRef<Group>(null);
  const handR = useRef<Group>(null);

  useFrame(({ clock }) => {
    // animate on twos: pose updates 12x per second, like hand-drawn frames
    const t = Math.floor(clock.elapsedTime * 12) / 12;
    if (upper.current) upper.current.position.y = Math.sin(t * 1.6) * 0.004;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.45) * 0.08;
      head.current.rotation.x = 0.12 + Math.sin(t * 0.9) * 0.025;
    }
    const typing = (n: number) => Math.max(0, Math.sin(t * 17 + n)) * 0.012;
    if (handL.current) handL.current.position.y = typing(0);
    if (handR.current) handR.current.position.y = typing(2.1);
  });

  return (
    <group>
      {/* legs under the desk */}
      <Limb from={[-0.1, 0.5, 0.08]} to={[-0.11, 0.52, -0.32]} radius={0.075} color={PANTS} />
      <Limb from={[0.1, 0.5, 0.08]} to={[0.12, 0.52, -0.32]} radius={0.075} color={PANTS} />
      <Limb from={[-0.11, 0.52, -0.32]} to={[-0.12, 0.1, -0.36]} radius={0.06} color={PANTS} />
      <Limb from={[0.12, 0.52, -0.32]} to={[0.13, 0.1, -0.36]} radius={0.06} color={PANTS} />
      {[-0.12, 0.13].map((x) => (
        <RoundedBox key={x} args={[0.1, 0.07, 0.24]} radius={0.03} position={[x, 0.04, -0.42]}>
          <Toon color="#f2efe8" />
          <Ink t={0.005} />
        </RoundedBox>
      ))}

      <group ref={upper}>
        {/* torso, leaning in toward the screen */}
        <RoundedBox args={[0.42, 0.5, 0.26]} radius={0.1} position={[0, 0.79, 0.08]} rotation={[-0.14, 0, 0]}>
          <Toon color={HOODIE} />
          <Ink t={0.008} />
        </RoundedBox>
        {/* hoodie pocket seam and hem band for silhouette detail */}
        <RoundedBox args={[0.43, 0.06, 0.27]} radius={0.025} position={[0, 0.57, 0.11]} rotation={[-0.14, 0, 0]}>
          <Toon color={HOODIE_DARK} />
        </RoundedBox>
        {/* bunched hood behind the neck */}
        <mesh position={[0, 1.03, 0.15]} rotation={[-1.15, 0, 0]}>
          <torusGeometry args={[0.085, 0.045, 10, 22]} />
          <Toon color={HOODIE_DARK} />
          <Ink t={0.006} />
        </mesh>
        <mesh position={[0, 1.0, 0.17]} scale={[0.95, 0.7, 0.45]}>
          <sphereGeometry args={[0.115, 20, 14]} />
          <Toon color={HOODIE} />
          <Ink t={0.006} />
        </mesh>

        {/* arms reaching for the keyboard */}
        <Limb from={[-0.215, 0.98, 0.07]} to={[-0.25, 0.8, -0.15]} radius={0.058} color={HOODIE} />
        <Limb from={[0.215, 0.98, 0.07]} to={[0.25, 0.8, -0.15]} radius={0.058} color={HOODIE} />
        <Limb from={[-0.25, 0.8, -0.15]} to={[-0.12, 0.79, -0.5]} radius={0.05} color={HOODIE} />
        <Limb from={[0.25, 0.8, -0.15]} to={[0.12, 0.79, -0.5]} radius={0.05} color={HOODIE} />
        <group ref={handL}>
          <mesh position={[-0.11, 0.785, -0.55]} scale={[0.9, 0.55, 1.2]}>
            <sphereGeometry args={[0.038, 14, 10]} />
            <Toon color={SKIN} />
            <Ink t={0.004} />
          </mesh>
        </group>
        <group ref={handR}>
          <mesh position={[0.11, 0.785, -0.55]} scale={[0.9, 0.55, 1.2]}>
            <sphereGeometry args={[0.038, 14, 10]} />
            <Toon color={SKIN} />
            <Ink t={0.004} />
          </mesh>
        </group>

        {/* neck */}
        <mesh position={[0, 1.08, 0.03]}>
          <cylinderGeometry args={[0.045, 0.05, 0.09, 14]} />
          <Toon color={SKIN} />
        </mesh>

        <group ref={head} position={[0, 1.18, 0.0]}>
          <mesh>
            <sphereGeometry args={[0.105, 28, 20]} />
            <Toon color={SKIN} />
            <Ink t={0.006} />
          </mesh>
          {/* short dark hair, fuller on top */}
          <mesh position={[0, 0.022, 0.012]} rotation={[0.42, 0, 0]} scale={[1.04, 1, 1.05]}>
            <sphereGeometry args={[0.11, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <Toon color={HAIR} />
            <Ink t={0.006} />
          </mesh>
          <mesh position={[0, 0.07, -0.025]} scale={[0.95, 0.4, 0.95]}>
            <sphereGeometry args={[0.085, 20, 12]} />
            <Toon color={HAIR} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.103, -0.005, 0.0]} scale={[0.45, 1, 0.75]}>
              <sphereGeometry args={[0.024, 10, 8]} />
              <Toon color={SKIN} />
            </mesh>
          ))}
          {/* over-ear headphones */}
          <mesh position={[0, 0.0, 0.0]}>
            <torusGeometry args={[0.14, 0.013, 8, 40, Math.PI]} />
            <Toon color={PHONES} />
            <Ink t={0.004} />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.126, -0.012, 0.0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[0.048, 0.048, 0.034, 22]} />
                <Toon color={PHONES} />
                <Ink t={0.005} />
              </mesh>
              <mesh position={[0, -s * 0.0175, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.032, 0.0035, 6, 24]} />
                <meshBasicMaterial color="#05d9e8" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
