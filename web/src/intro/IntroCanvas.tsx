import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from "three";
import { ComicEffect } from "../fx/ComicEffect";
import { Room } from "./Room";
import { ToonProvider } from "./toon";

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

// screen centre and normal follow from the lid hinge (0, .766, -.73) tilted back .26 rad
const SCREEN = v(0, 0.8686, -0.7526);
const NORMAL = v(0, 0.2571, 0.9664);
const alongNormal = (d: number) => SCREEN.clone().addScaledVector(NORMAL, d);

const PATH = new CatmullRomCurve3([
  v(1.9, 1.85, 2.9),
  v(0.95, 1.6, 1.75),
  v(0.45, 1.42, 0.9),
  v(0.3, 1.4, 0.3),
  v(0.26, 1.4, -0.14),
  alongNormal(0.3),
  alongNormal(0.012),
]);
const LOOK = new CatmullRomCurve3([
  v(0, 1.0, -0.7),
  v(0, 1.0, -0.75),
  v(0, 0.95, -0.75),
  v(0, 0.9, -0.76),
  SCREEN.clone(),
  SCREEN.clone(),
  SCREEN.clone(),
]);

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const target = useRef(new Vector3());
  const look = useRef(LOOK.getPoint(0));
  const lookTarget = useRef(new Vector3());

  useFrame(({ camera, size, pointer }, dt) => {
    const cam = camera as PerspectiveCamera;
    const fov = size.width / size.height < 0.9 ? 62 : 40;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    const p = progress.current;
    const t = PATH.getPoint(p, target.current);
    LOOK.getPoint(p, lookTarget.current);
    // hand-held parallax early on, locked steady once we dive at the screen
    const sway = (1 - smooth(0.45, 0.7, p)) * 0.12;
    t.x += pointer.x * sway;
    t.y += pointer.y * sway * 0.5;
    const k = 1 - Math.exp(-dt * 7);
    camera.position.lerp(t, k);
    look.current.lerp(lookTarget.current, k);
    camera.lookAt(look.current);
  });
  return null;
}

function Effects({ progress }: { progress: MutableRefObject<number> }) {
  const comic = useMemo(() => new ComicEffect({ dot: 5, shift: 2.2, grain: 0.014, progress }), [progress]);
  return (
    <EffectComposer multisampling={0}>
      <primitive object={comic} dispose={null} />
    </EffectComposer>
  );
}

export default function IntroCanvas({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [1.9, 1.85, 2.9], fov: 40, near: 0.005, far: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0d0a1c"]} />
      <fog attach="fog" args={["#0d0a1c", 4, 11]} />
      <Suspense fallback={null}>
        <ToonProvider>
          <Room progress={progress} />
        </ToonProvider>
        <CameraRig progress={progress} />
        <Effects progress={progress} />
      </Suspense>
    </Canvas>
  );
}
