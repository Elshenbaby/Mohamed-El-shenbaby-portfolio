import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, Vector2, type Mesh, type ShaderMaterial } from "three";

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Turns a real photo into an inked comic panel: posterized colour,
// Sobel ink lines, halftone shadows and CMY plate misregistration.
const fragment = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uTime;
uniform float uDot;
uniform vec2 uFace;
uniform float uAspect;
varying vec2 vUv;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(float n) { return fract(sin(n) * 43758.5453); }

float lumAt(vec2 uv) { return luma(texture2D(uTex, uv).rgb); }

float sobel(vec2 uv, vec2 t) {
  float tl = lumAt(uv + t * vec2(-1.0, 1.0));
  float  l = lumAt(uv + t * vec2(-1.0, 0.0));
  float bl = lumAt(uv + t * vec2(-1.0, -1.0));
  float  b = lumAt(uv + t * vec2(0.0, -1.0));
  float br = lumAt(uv + t * vec2(1.0, -1.0));
  float  r = lumAt(uv + t * vec2(1.0, 0.0));
  float tr = lumAt(uv + t * vec2(1.0, 1.0));
  float  u = lumAt(uv + t * vec2(0.0, 1.0));
  float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
  float gy = -bl - 2.0 * b - br + tl + 2.0 * u + tr;
  return length(vec2(gx, gy));
}

float halftone(vec2 px, float angle, float size, float value) {
  float s = sin(angle), c = cos(angle);
  vec2 p = mat2(c, -s, s, c) * px;
  vec2 cell = mod(p, size) - size * 0.5;
  float r = size * 0.5 * sqrt(clamp(value, 0.0, 1.0)) * 1.25;
  return 1.0 - smoothstep(r - 0.7, r + 0.7, length(cell));
}

void main() {
  // line boil: the drawing re-inks itself 8 times a second
  float tq = floor(uTime * 8.0);
  vec2 jitter = (vec2(hash(tq), hash(tq + 4.7)) - 0.5) * uTexel * 1.4;
  vec2 uv = vUv + jitter;

  vec2 shift = uTexel * vec2(3.0, 1.0);
  vec3 col = vec3(
    texture2D(uTex, uv + shift).r,
    texture2D(uTex, uv).g,
    texture2D(uTex, uv - shift).b
  );

  // key light on the face: the photo is backlit, so lift it like a colourist would
  vec2 d = (vUv - uFace) * vec2(uAspect, 1.0);
  float key = 1.0 - smoothstep(0.06, 0.16, length(d));
  col = pow(col, vec3(mix(0.8, 0.6, key)));
  vec3 photo = col;
  float l = luma(col);
  col = mix(vec3(l), col, mix(1.35, 1.05, key));
  col = floor(col * 5.0 + 0.5) / 5.0;

  vec2 px = gl_FragCoord.xy;
  float shade = 1.0 - smoothstep(0.08, 0.45, l);
  float dots = halftone(px, 0.785, uDot, shade);
  col = mix(col, col * vec3(0.32, 0.12, 0.42), dots * 0.5 * (1.0 - key * 0.8));

  float bright = smoothstep(0.62, 0.95, l);
  float bd = halftone(px + 2.0, 0.26, uDot * 0.75, bright * 0.5);
  col = mix(col, vec3(1.0, 0.86, 0.3), bd * 0.35);

  float edge = sobel(uv, uTexel * 1.6);
  float ink = smoothstep(mix(0.3, 0.42, key), mix(0.55, 0.7, key), edge) * 0.9;
  col = mix(col, vec3(0.04, 0.03, 0.08), ink);
  // keep the face close to the real photo so it stays recognisable
  col = mix(col, photo * 1.04, key * 0.78);

  gl_FragColor = vec4(col, 1.0);
}
`;

function Portrait({ src, aspect, face }: { src: string; aspect: number; face: [number, number] }) {
  const tex = useTexture(src, (t) => {
    t.colorSpace = SRGBColorSpace;
  });
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const viewport = useThree((s) => s.viewport);

  const uniforms = useMemo(() => {
    const img = tex.image as { width: number; height: number };
    return {
      uTex: { value: tex },
      uTexel: { value: new Vector2(1 / img.width, 1 / img.height) },
      uTime: { value: 0 },
      uDot: { value: 6 },
      uFace: { value: new Vector2(...face) },
      uAspect: { value: aspect },
    };
  }, [tex, aspect, face]);

  useFrame(({ clock, pointer }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y += (pointer.x * 0.12 - mesh.current.rotation.y) * 0.08;
      mesh.current.rotation.x += (-pointer.y * 0.08 - mesh.current.rotation.x) * 0.08;
    }
  });

  const h = viewport.height * 0.96;
  const w = Math.min(viewport.width * 0.96, h * aspect);
  return (
    <mesh ref={mesh}>
      <planeGeometry args={[w, w / aspect]} />
      <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

/** face: centre of the face in UV space (0..1, origin bottom-left), gets a softer key light. */
export default function ComicPortrait({
  src,
  aspect,
  alt,
  face,
}: {
  src: string;
  aspect: number;
  alt: string;
  face: [number, number];
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="relative h-full w-full" role="img" aria-label={alt}>
      <Canvas
        flat
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Portrait src={src} aspect={aspect} face={face} />
        </Suspense>
      </Canvas>
    </div>
  );
}
