import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Outlines } from "@react-three/drei";
import { DataTexture, NearestFilter, RedFormat, Quaternion, Vector3 } from "three";

const GradientCtx = createContext<DataTexture | null>(null);

export function ToonProvider({ children }: { children: ReactNode }) {
  const gradient = useMemo(() => {
    const tex = new DataTexture(new Uint8Array([70, 150, 255]), 3, 1, RedFormat);
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
  return <GradientCtx.Provider value={gradient}>{children}</GradientCtx.Provider>;
}

export function Toon({ color, emissive, emissiveIntensity = 0 }: { color: string; emissive?: string; emissiveIntensity?: number }) {
  const gradient = useContext(GradientCtx);
  return (
    <meshToonMaterial
      color={color}
      gradientMap={gradient}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

export const INK = "#0b0816";

/** Ink line around a mesh. drei's Outlines measures thickness in screen pixels,
 *  so lines keep a constant pen weight as the camera dives in. */
export function Ink({ t = 0.008 }: { t?: number }) {
  return <Outlines thickness={Math.max(1.4, t * 380)} color={INK} />;
}

const UP = new Vector3(0, 1, 0);

/** Capsule stretched between two points: arms, legs, lamp arms. */
export function Limb({
  from,
  to,
  radius,
  color,
  ink = 0.006,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius: number;
  color: string;
  ink?: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
    return { position: a.add(b).multiplyScalar(0.5), quaternion: q, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <capsuleGeometry args={[radius, Math.max(0.001, length), 6, 14]} />
      <Toon color={color} />
      <Ink t={ink} />
    </mesh>
  );
}
