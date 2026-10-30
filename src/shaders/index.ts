export const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const noiseChunk = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
`;

const liquidField = /* glsl */ `
  float liquidHeight(vec2 p, float time, vec2 hand, float presence) {
    float t = time * 0.07;
    vec2 q = vec2(noise(p + t), noise(p + vec2(5.2, 1.3) - t));
    float swell = exp(-dot(p - hand * 0.5, p - hand * 0.5) * 7.0) * presence;
    return noise(p * 1.3 + 1.6 * q) + 0.22 * noise(p * 2.6 - q) + swell * 0.3;
  }

  float liquidBand(vec2 p, float time, vec2 hand, float presence) {
    float e = 0.02;
    float h = liquidHeight(p, time, hand, presence);
    vec3 n = normalize(vec3(
      liquidHeight(p + vec2(e, 0.0), time, hand, presence) - h,
      liquidHeight(p + vec2(0.0, e), time, hand, presence) - h,
      e * 1.1
    ));
    vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
    return pow(0.5 + 0.5 * sin(r.x * 3.0 + r.y * 2.0 + h * 3.0), 4.0);
  }
`;

// Shared with the theme change, so its mask has exactly the hero's shapes.
export const liquidPattern = noiseChunk + liquidField;

// One running time for the hero and the theme change, so their liquid stays in step.
export const liquidClock = { time: 8 };

const common = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPresence;
  varying vec2 vUv;

  uniform vec3 uCanvas;
  uniform vec3 uAccent;
  uniform vec3 uHighlight;

  ${noiseChunk}

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + vec2(17.1, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  vec2 centered() {
    return (vUv * 2.0 - 1.0) * uResolution / min(uResolution.x, uResolution.y);
  }

  vec2 pointer() {
    return uPointer * uResolution / min(uResolution.x, uResolution.y);
  }
`;

const liquid = /* glsl */ `
  ${common}
  ${liquidField}

  void main() {
    float band = liquidBand(centered() * 0.5, uTime, pointer(), uPresence);
    vec3 color = mix(uCanvas, uAccent * 0.62, band);
    color += uHighlight * pow(band, 12.0) * 0.4;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const contour = /* glsl */ `
  ${common}

  void main() {
    vec2 p = centered();
    float lift = exp(-dot(p - pointer(), p - pointer()) * 2.4) * uPresence;
    float value = (fbm(p * 1.1 + uTime * 0.035) + lift * 0.35) * 16.0;
    float width = fwidth(value);
    float line = 1.0 - smoothstep(0.0, 1.3, abs(fract(value) - 0.5) / max(width, 0.0001));
    vec3 color = mix(uCanvas, uAccent, line * (0.38 + lift * 0.62));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const silk = /* glsl */ `
  ${common}

  void main() {
    vec2 p = centered();
    p += (pointer() - p) * 0.14 * uPresence;
    float t = uTime * 0.14;
    float fold = sin(p.x * 2.4 + 2.2 * fbm(p * 1.2 + t) + t);
    fold += 0.5 * sin(p.y * 3.1 - 2.8 * fbm(p * 0.9 - t));
    float light = pow(0.5 + 0.25 * fold, 3.0);
    vec3 color = mix(uCanvas, uAccent * 0.85, light * 1.5);
    color += uHighlight * pow(light, 5.0) * 0.5;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const cells = /* glsl */ `
  ${common}

  void main() {
    vec2 p = centered() * 3.2;
    vec2 cell = floor(p);
    float first = 8.0;
    float second = 8.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(float(x), float(y));
        vec2 seed = vec2(hash(cell + offset), hash(cell + offset + 7.7));
        vec2 point = offset + 0.5 + 0.42 * sin(uTime * 0.4 + 6.283 * seed) - (p - cell);
        float d = dot(point, point);
        if (d < first) {
          second = first;
          first = d;
        } else if (d < second) {
          second = d;
        }
      }
    }
    float edge = 1.0 - smoothstep(0.0, 0.16, sqrt(second) - sqrt(first));
    float glow = exp(-dot(p - pointer() * 3.2, p - pointer() * 3.2) * 0.32) * uPresence;
    vec3 color = mix(uCanvas, uAccent, edge * (0.28 + glow * 0.72));
    color += uHighlight * edge * glow * 0.25;
    gl_FragColor = vec4(color, 1.0);
  }
`;

type Rgb = [number, number, number];
type Palette = { canvas: Rgb; accent: Rgb; highlight: Rgb; speed: number };

export const palettes: Record<"dark" | "light", Palette> = {
  dark: { canvas: [0.039, 0.039, 0.043], accent: [0.788, 0.659, 0.416], highlight: [0.957, 0.937, 0.902], speed: 1 },
  light: { canvas: [0.984, 0.98, 0.973], accent: [0.9, 0.885, 0.855], highlight: [0.9, 0.885, 0.855], speed: 0.35 },
};

export const shaders = { liquid, contour, silk, cells };
export type ShaderName = keyof typeof shaders;
