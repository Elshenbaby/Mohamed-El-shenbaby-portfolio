import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, DoubleSide, type Mesh, type Points, type ShaderMaterial } from "three";

const rainVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Droplets beading on the glass, a few running down, and fine rain falling behind.
const rainFragment = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  float a = 0.0;

  vec2 g = vUv * vec2(70.0, 44.0);
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float n = hash(id);
  vec2 o = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6;
  float d = length((f - o) * vec2(1.0, 0.8));
  a += smoothstep(0.09 * n, 0.0, d) * step(0.8, n) * 0.35;

  float cols = 26.0;
  float cx = vUv.x * cols;
  float col = floor(cx);
  float ch = hash(vec2(col, 4.0));
  float y = fract(vUv.y + uTime * (0.05 + ch * 0.12) + ch * 9.0);
  float lane = 1.0 - smoothstep(0.0, 0.08, abs(fract(cx) - 0.5 - (ch - 0.5) * 0.3));
  float head = smoothstep(0.06, 0.0, abs(y - 0.08));
  float trail = smoothstep(0.08, 0.5, y) * smoothstep(0.7, 0.5, y) * 0.35;
  a += lane * (head + trail) * step(0.78, ch) * 0.45;

  vec2 rg = vUv * vec2(120.0, 3.0);
  float rc = floor(rg.x);
  float rh = hash(vec2(rc, 9.0));
  float ry = fract(rg.y + uTime * (1.6 + rh) + rh * 13.0);
  a += smoothstep(0.012, 0.0, abs(fract(rg.x) - 0.5) - 0.02) * smoothstep(0.0, 0.1, ry) * smoothstep(0.25, 0.1, ry) * 0.05;

  gl_FragColor = vec4(vec3(0.78, 0.86, 1.0), a);
}
`;

export function RainGlass({ width, height }: { width: number; height: number }) {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={rainVertex}
        fragmentShader={rainFragment}
      />
    </mesh>
  );
}

/** Headlights and tail lights sliding along the street far below. */
export function Traffic() {
  const cars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        y: 0.66 + (i % 3) * 0.035,
        speed: (0.25 + ((i * 37) % 10) / 20) * (i % 2 ? 1 : -1),
        offset: (i * 0.73) % 1,
        color: i % 2 ? "#ffe6b3" : "#ff3348",
      })),
    [],
  );
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    cars.forEach((c, i) => {
      const m = refs.current[i];
      if (!m) return;
      const span = 5;
      m.position.x = ((((c.offset + clock.elapsedTime * c.speed * 0.12) % 1) + 1) % 1) * span - span / 2;
    });
  });
  return (
    <group position={[0, 0, -2.85]}>
      {cars.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[0, c.y, 0]}
        >
          <boxGeometry args={[0.05, 0.008, 0.01]} />
          <meshBasicMaterial color={c.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

const beamFragment = /* glsl */ `
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float along = smoothstep(0.0, 0.25, vUv.y) * (1.0 - vUv.y);
  float edge = sin(vUv.x * 3.14159 * 2.0) * 0.5 + 0.5;
  gl_FragColor = vec4(uColor, along * 0.16 * (0.55 + 0.45 * edge));
}
`;

/** Visible cone of light under the desk lamp, with dust drifting through it. */
export function LampBeam() {
  const uniforms = useMemo(() => ({ uColor: { value: new Color("#ffb46b") } }), []);
  return (
    <mesh position={[0, -0.27, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.28, 0.55, 40, 1, true]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={rainVertex}
        fragmentShader={beamFragment}
      />
    </mesh>
  );
}

export function Dust({ count = 260 }: { count?: number }) {
  const points = useRef<Points>(null);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(rnd()) * 0.32;
      const a = rnd() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -rnd() * 0.6;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame(({ clock }, dt) => {
    const attr = points.current?.geometry.getAttribute("position") as BufferAttribute | undefined;
    if (!attr) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + dt * (0.008 + (i % 7) * 0.002);
      if (y > 0) y = -0.6;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.4 + i) * dt * 0.004);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial size={0.0035} color="#ffd9a8" transparent opacity={0.75} depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

const steamFragment = /* glsl */ `
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
void main() {
  vec2 uv = vUv;
  float t = uTime * 0.35 + uSeed;
  float wob = (noise(vec2(uv.y * 3.0 - t * 2.0, uSeed)) - 0.5) * 0.5 * uv.y;
  float x = abs(uv.x - 0.5 - wob) * 2.0;
  float body = smoothstep(0.55, 0.0, x);
  float n = noise(vec2(uv.x * 4.0, uv.y * 5.0 - t * 3.0));
  float fade = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.45, uv.y);
  gl_FragColor = vec4(vec3(0.95), body * n * fade * 0.28);
}
`;

export function Steam() {
  const mats = useRef<(ShaderMaterial | null)[]>([]);
  const uniforms = useMemo(
    () => [0, 1, 2].map((i) => ({ uTime: { value: 0 }, uSeed: { value: i * 3.7 } })),
    [],
  );
  useFrame(({ clock }) => {
    mats.current.forEach((m) => {
      if (m) m.uniforms.uTime.value = clock.elapsedTime;
    });
  });
  return (
    <group>
      {uniforms.map((u, i) => (
        <mesh key={i} position={[0, 0.11, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          <planeGeometry args={[0.07, 0.18]} />
          <shaderMaterial
            ref={(el) => {
              mats.current[i] = el;
            }}
            transparent
            depthWrite={false}
            side={DoubleSide}
            uniforms={u}
            vertexShader={rainVertex}
            fragmentShader={steamFragment}
          />
        </mesh>
      ))}
    </group>
  );
}
