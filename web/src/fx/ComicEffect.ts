import { Effect, EffectAttribute } from "postprocessing";
import { Uniform } from "three";

const fragment = /* glsl */ `
uniform float uDot;
uniform float uShift;
uniform float uGrain;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float halftone(vec2 px, float angle, float size, float value) {
  float s = sin(angle), c = cos(angle);
  vec2 p = mat2(c, -s, s, c) * px;
  vec2 cell = mod(p, size) - size * 0.5;
  float r = size * 0.5 * sqrt(clamp(value, 0.0, 1.0)) * 1.2;
  return 1.0 - smoothstep(r - 0.8, r + 0.8, length(cell));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 px = uv * resolution;
  vec2 off = vec2(uShift * texelSize.x, uShift * 0.35 * texelSize.y);

  // CMY print misregistration: red and blue plates land slightly off
  float r = texture2D(inputBuffer, uv + off).r;
  float b = texture2D(inputBuffer, uv - off).b;
  vec3 col = vec3(r, inputColor.g, b);

  float l = luma(col);

  // shadows break into ink dots instead of smooth gradients
  float shade = 1.0 - smoothstep(0.04, 0.42, l);
  float dots = halftone(px, 0.785, uDot, shade);
  col = mix(col, col * vec3(0.22, 0.12, 0.38), dots * 0.62);

  // light areas pick up a faint magenta Ben-Day screen
  float lit = smoothstep(0.45, 0.9, l);
  float bd = halftone(px + 3.0, 0.26, uDot * 0.8, lit * 0.35);
  col = mix(col, col * vec3(1.0, 0.82, 0.95), bd * 0.35);

  // paper grain that changes on twos (12 fps), like the film
  float tq = floor(time * 12.0);
  float n = hash(floor(px * 0.5) + tq);
  col += (n - 0.5) * uGrain;

  outputColor = vec4(col, inputColor.a);
}
`;

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export class ComicEffect extends Effect {
  private progress?: { current: number };
  private baseShift: number;

  /** progress: optional scroll ref; misregistration ramps up as the camera dives into the screen. */
  constructor({
    dot = 6,
    shift = 2.2,
    grain = 0.04,
    progress,
  }: { dot?: number; shift?: number; grain?: number; progress?: { current: number } } = {}) {
    super("ComicEffect", fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform>([
        ["uDot", new Uniform(dot)],
        ["uShift", new Uniform(shift)],
        ["uGrain", new Uniform(grain)],
      ]),
    });
    this.progress = progress;
    this.baseShift = shift;
  }

  update() {
    if (!this.progress) return;
    this.uniforms.get("uShift")!.value = this.baseShift + smooth(0.72, 1, this.progress.current) * 16;
  }
}
