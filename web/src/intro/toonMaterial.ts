import { Color, DataTexture, MeshToonMaterial, NearestFilter, RedFormat, type Texture } from "three";

/** Three hard light bands: core shadow, mid tone, lit. */
const GRADIENT = (() => {
  const t = new DataTexture(new Uint8Array([60, 150, 255]), 3, 1, RedFormat);
  t.minFilter = NearestFilter;
  t.magFilter = NearestFilter;
  t.needsUpdate = true;
  return t;
})();

// Injected after lighting: halftone dots in the mid tones, cross-hatching in the core
// shadow, and a two-colour rim (cyan on screen-right, magenta on screen-left).
const HELPERS = /* glsl */ `
uniform float uDotSize;
uniform vec3 uRimA;
uniform vec3 uRimB;
uniform float uRim;
float toonLuma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float toonDots(vec2 px, float size, float amount) {
  float s = 0.7071;
  vec2 p = mat2(s, -s, s, s) * px;
  vec2 cell = mod(p, size) - size * 0.5;
  float r = size * 0.5 * sqrt(clamp(amount, 0.0, 1.0)) * 1.3;
  return 1.0 - smoothstep(r - 0.6, r + 0.6, length(cell));
}
`;

const STYLE = /* glsl */ `
  {
    float base = max(toonLuma(diffuseColor.rgb), 0.02);
    float lit = toonLuma(outgoingLight) / base;
    vec2 px = gl_FragCoord.xy;

    float mid = 1.0 - smoothstep(0.35, 0.8, lit);
    outgoingLight = mix(outgoingLight, outgoingLight * 0.35, toonDots(px, uDotSize, mid * 0.75) * 0.8);

    float core = 1.0 - smoothstep(0.08, 0.3, lit);
    float hatch = step(0.62, fract((px.x + px.y) / 5.0));
    outgoingLight = mix(outgoingLight, outgoingLight * 0.25 + diffuseColor.rgb * 0.02, hatch * core * 0.7);

    vec3 viewDir = normalize(vViewPosition);
    float fres = 1.0 - clamp(dot(normal, viewDir), 0.0, 1.0);
    float rim = smoothstep(0.6, 0.7, fres);
    vec3 rimColor = normal.x > 0.0 ? uRimA : uRimB;
    outgoingLight += rimColor * rim * uRim;
  }
`;

type Options = { bumpMap?: Texture; bumpScale?: number; rim?: number };

const cache = new Map<string, MeshToonMaterial>();

/** Spider-Verse style toon material, shared per colour. */
export function toon(color: string, opts: Options = {}) {
  const key = `${color}|${opts.bumpMap?.uuid ?? ""}|${opts.rim ?? 1}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const mat = new MeshToonMaterial({
    color,
    gradientMap: GRADIENT,
    bumpMap: opts.bumpMap ?? null,
    bumpScale: opts.bumpScale ?? 1,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDotSize = { value: 5.0 };
    shader.uniforms.uRimA = { value: new Color("#38e8ff") };
    shader.uniforms.uRimB = { value: new Color("#ff2a6d") };
    shader.uniforms.uRim = { value: 0.55 * (opts.rim ?? 1) };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        `${HELPERS}\nvoid main() {`,
      )
      .replace("#include <opaque_fragment>", `${STYLE}\n#include <opaque_fragment>`);
  };
  mat.customProgramCacheKey = () => "spiderverse-toon";
  cache.set(key, mat);
  return mat;
}
