import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type ChromaticAberrationEffect, type DepthOfFieldEffect } from "postprocessing";
import { PerspectiveCamera, Vector2, Vector3 } from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { LAPTOP_POS, LID_TILT } from "./layout";
import { Room } from "./Room";

RectAreaLightUniformsLib.init();

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

// screen centre and facing direction, derived from the lid hinge and tilt
const HINGE = v(LAPTOP_POS[0], LAPTOP_POS[1] + 0.0155, LAPTOP_POS[2] - 0.106);
const SCREEN = HINGE.clone().add(v(0, 0.107 * Math.cos(LID_TILT), 0.107 * Math.sin(LID_TILT)));
const NORMAL = v(0, -Math.sin(LID_TILT), Math.cos(LID_TILT));
const alongNormal = (d: number) => SCREEN.clone().addScaledVector(NORMAL, d);

/** Camera beats, each landing at a scroll position. */
const KEYS: { t: number; pos: Vector3; look: Vector3 }[] = [
  { t: 0.0, pos: v(0.95, 1.9, 2.75), look: v(0, 1.05, -0.75) },
  { t: 0.16, pos: v(0.1, 1.52, 1.2), look: v(0, 1.0, -0.72) },
  { t: 0.32, pos: v(0.95, 1.42, 0.6), look: v(-0.05, 1.0, -0.6) },
  { t: 0.48, pos: v(0.3, 1.33, -0.1), look: SCREEN.clone().add(v(0, -0.01, 0)) },
  { t: 0.66, pos: alongNormal(0.36), look: SCREEN.clone() },
  { t: 0.8, pos: alongNormal(0.2), look: SCREEN.clone() },
  { t: 1.0, pos: alongNormal(0.006), look: SCREEN.clone() },
];

function ease(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function sample(p: number, outPos: Vector3, outLook: Vector3) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (p - a.t) / (b.t - a.t))));
  outPos.lerpVectors(a.pos, b.pos, k);
  outLook.lerpVectors(a.look, b.look, k);
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const target = useRef(new Vector3());
  const look = useRef(KEYS[0].look.clone());
  const lookTarget = useRef(new Vector3());

  useFrame(({ camera, size, pointer, clock }, dt) => {
    const cam = camera as PerspectiveCamera;
    const fov = size.width / size.height < 0.9 ? 60 : 38;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    const p = progress.current;
    const t = target.current;
    sample(p, t, lookTarget.current);
    // a slow hand-held drift plus mouse parallax, locked off once we dive at the screen
    const free = 1 - smooth(0.55, 0.72, p);
    const time = clock.elapsedTime;
    t.x += (pointer.x * 0.1 + Math.sin(time * 0.31) * 0.02) * free;
    t.y += (pointer.y * 0.05 + Math.sin(time * 0.47) * 0.012) * free;
    const k = 1 - Math.exp(-dt * 5);
    camera.position.lerp(t, k);
    look.current.lerp(lookTarget.current, k);
    camera.lookAt(look.current);
  });
  return null;
}

function Effects({ progress, light }: { progress: MutableRefObject<number>; light: boolean }) {
  const ca = useRef<ChromaticAberrationEffect>(null);
  const dof = useRef<DepthOfFieldEffect>(null);
  const caOffset = useMemo(() => new Vector2(0.0004, 0.0004), []);

  useFrame(() => {
    const p = progress.current;
    if (ca.current) {
      const s = 0.0004 + smooth(0.78, 1, p) * 0.012;
      ca.current.offset.set(s, s * 0.6);
    }
    if (dof.current) {
      dof.current.target?.copy(p < 0.45 ? KEYS[1].look : SCREEN);
      dof.current.bokehScale = 2.6 * (1 - smooth(0.4, 0.52, p));
    }
  });

  return (
    <EffectComposer multisampling={light ? 0 : 4}>
      <Bloom mipmapBlur intensity={0.8} luminanceThreshold={0.86} luminanceSmoothing={0.2} radius={0.7} />
      {light ? null : <DepthOfField ref={dof} target={SCREEN} worldFocusRange={0.9} bokehScale={2.6} />}
      <ChromaticAberration ref={ca} offset={caOffset} radialModulation modulationOffset={0.2} />
      <Vignette offset={0.28} darkness={0.78} />
      <Noise opacity={0.05} blendFunction={BlendFunction.SOFT_LIGHT} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

export default function IntroCanvas({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  const light = typeof window !== "undefined" && window.innerWidth < 760;
  return (
    <Canvas
      shadows
      frameloop={active ? "always" : "never"}
      dpr={[1, light ? 1.5 : 1.75]}
      camera={{ position: KEYS[0].pos.toArray(), fov: 38, near: 0.004, far: 30 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#05040a"]} />
      <fog attach="fog" args={["#05040a", 3.5, 9]} />
      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#7f9dff" position={[0, 1.6, -3]} scale={[3, 1.4, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#ffb46b" position={[-0.6, 1.4, -0.6]} scale={[0.4, 0.4, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#ff2a6d" position={[-2, 1.8, -1]} rotation-y={Math.PI / 2} scale={[1, 0.4, 1]} />
          <Lightformer form="rect" intensity={0.5} color="#ffffff" position={[0, 3, 1]} rotation-x={Math.PI / 2} scale={[4, 4, 1]} />
        </Environment>
        <Room progress={progress} />
        <CameraRig progress={progress} />
        <Effects progress={progress} light={light} />
      </Suspense>
    </Canvas>
  );
}
