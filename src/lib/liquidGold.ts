import { liquidClock, liquidPattern } from "@/shaders";
import type { ResolvedTheme } from "./theme";

// The theme change is a ring of molten gold shaped by the dark hero's liquid. The real new page
// runs behind it, and a picture of the old page is cut away under the ring, so nothing is blank.
// It is prepared once and reused, because compiling on a click makes the page stall.

const DURATION_MS = 750;
const RENDER_SCALE = 0.6;
// All in units of the screen's short side. The band must cover twice the wobble,
// or the cut in the old page would show past the gold.
const WOBBLE = 0.05;
const CUT_MARGIN = 0.008;
const BAND = WOBBLE * 2 + CUT_MARGIN * 2.5;
const OVERSHOOT = BAND + WOBBLE + 0.1;

const vertex = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uFront;
  uniform float uTime;
  uniform float uToDark;
  uniform vec2 uOrigin;
  uniform vec2 uResolution;
  varying vec2 vUv;

  const vec3 GOLD = vec3(0.788, 0.659, 0.416);

  ${liquidPattern}

  vec3 metal(float v) {
    vec3 color = mix(vec3(0.16, 0.09, 0.03), vec3(0.62, 0.42, 0.15), smoothstep(0.0, 0.45, v));
    color = mix(color, vec3(0.9, 0.7, 0.34), smoothstep(0.42, 0.82, v));
    return mix(color, vec3(1.0, 0.93, 0.74), smoothstep(0.88, 1.0, v));
  }

  void main() {
    vec2 p = (vUv * 2.0 - 1.0) * uResolution / min(uResolution.x, uResolution.y) * 0.5;
    vec2 none = vec2(0.0);
    float e = 0.02;
    float h = liquidHeight(p, uTime, none, 0.0);
    float slopeX = liquidHeight(p + vec2(e, 0.0), uTime, none, 0.0) - h;
    float slopeY = liquidHeight(p + vec2(0.0, e), uTime, none, 0.0) - h;

    // The hero's own band, calculated from the surface above so it is only measured once.
    vec3 bandNormal = normalize(vec3(slopeX, slopeY, e * 1.1));
    vec3 bandRay = reflect(vec3(0.0, 0.0, -1.0), bandNormal);
    float band = pow(0.5 + 0.5 * sin(bandRay.x * 3.0 + bandRay.y * 2.0 + h * 3.0), 4.0);

    // Travels outward from the click, with the liquid's curves bending the front.
    float liquid = pow(band, 0.32) * 0.72 + clamp(h * 0.5, 0.0, 1.0) * 0.28;
    vec2 away = p - uOrigin;
    float behind = uFront + (liquid * 2.0 - 1.0) * ${WOBBLE.toFixed(3)} - length(away);

    float solid = ${BAND.toFixed(3)};
    float edge = smoothstep(-0.003, 0.003, behind);
    float rim = edge * (1.0 - smoothstep(solid, solid + 0.06, behind));

    // The molten band: its surface rolls over the front, lit like the hero's metal.
    vec3 normal = vec3(slopeX, slopeY, e * 1.2);
    normal.xy += normalize(away + 0.0001) * (0.5 - behind / solid) * 0.05;
    normal = normalize(normal);
    vec3 reflected = reflect(vec3(0.0, 0.0, -1.0), normal);
    vec3 molten = metal(0.5 + 0.5 * sin(reflected.y * 2.6 + reflected.x * 1.5 + uTime * 1.4));
    float glint = pow(max(dot(normal, normalize(vec3(0.35, 0.55, 0.76))), 0.0), 36.0);
    molten += vec3(1.0, 0.94, 0.8) * glint * 0.6;

    // Ahead of the front: a soft shadow on a light page, a warm glow on a dark one.
    float ahead = (1.0 - smoothstep(0.0, 0.06, -behind)) * (1.0 - edge);
    vec3 aura = mix(GOLD, vec3(0.0), uToDark);
    float auraAlpha = ahead * mix(0.5, 0.26, uToDark);

    gl_FragColor = vec4(mix(aura, molten, edge), max(rim, auraAlpha));
  }
`;

// A quick burst that slows as it spreads, like heavy liquid losing momentum.
const ease = (t: number) => 1 - (1 - t) ** 2.2;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

type Pour = ReturnType<typeof build>;

function build() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const vertexShader = compile(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  canvas.className = "liquid-gold";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:100;width:100%;height:100%;pointer-events:none;view-transition-name:liquid-gold";

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    resolution: uniform("uResolution"),
    toDark: uniform("uToDark"),
    origin: uniform("uOrigin"),
    front: uniform("uFront"),
    time: uniform("uTime"),
  };

  // Drivers often finish compiling on first use, so that cost is paid here rather than on a click.
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return { canvas, gl, uniforms };
}

let prepared: Pour = null;

const ready = () => {
  if (!prepared || prepared.gl.isContextLost()) prepared = build();
  return prepared;
};

// Run in idle time, so the first click has no setup to wait for.
export const prepareGold = () => void ready();

// Returns false when the effect cannot run, so the caller can change theme instantly.
export function pourGold(
  target: ResolvedTheme,
  origin: { x: number; y: number },
  swap: () => void,
  onDone: () => void,
) {
  const pour = ready();
  if (!pour || !document.startViewTransition) return false;
  const { canvas, gl, uniforms } = pour;

  // Liquid is soft, so it upscales well and frees the graphics card to hold its frame rate.
  const scale = Math.min(window.devicePixelRatio, 1.5) * RENDER_SCALE;
  canvas.width = Math.round(window.innerWidth * scale);
  canvas.height = Math.round(window.innerHeight * scale);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  gl.uniform1f(uniforms.toDark, target === "dark" ? 1 : 0);

  const short = Math.min(window.innerWidth, window.innerHeight);
  const originX = (origin.x * 2 - window.innerWidth) / short / 2;
  const originY = (window.innerHeight - origin.y * 2) / short / 2;
  gl.uniform2f(uniforms.origin, originX, originY);

  const farthest = Math.max(
    ...[
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ].map(([x, y]) => Math.hypot(x - origin.x, y - origin.y) / short),
  );

  const { style } = document.documentElement;
  const setCut = (radius: number) => style.setProperty("--reveal-r", `${radius}px`);
  style.setProperty("--reveal-x", `${origin.x}px`);
  style.setProperty("--reveal-y", `${origin.y}px`);
  setCut(0);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const transition = document.startViewTransition(() => {
    swap();
    document.body.append(canvas);
  });

  const clockStart = liquidClock.time;
  let start: number | undefined;

  const draw = (now: number) => {
    // Timed from the first drawn frame, so the opening burst is never skipped.
    start ??= now;
    const progress = Math.min((now - start) / DURATION_MS, 1);
    const front = ease(progress) * (farthest + OVERSHOOT);

    setCut(Math.max(0, (front - WOBBLE - CUT_MARGIN) * short));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.front, front);
    gl.uniform1f(uniforms.time, clockStart + (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (progress < 1) requestAnimationFrame(draw);
    else transition.skipTransition();
  };

  transition.ready.then(() => requestAnimationFrame(draw)).catch(() => undefined);
  transition.finished
    .catch(() => undefined)
    .finally(() => {
      canvas.remove();
      ["--reveal-x", "--reveal-y", "--reveal-r"].forEach((name) => style.removeProperty(name));
      onDone();
    });
  return true;
}
