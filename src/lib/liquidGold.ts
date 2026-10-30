import { liquidClock, liquidPattern } from "@/shaders";
import type { ResolvedTheme } from "./theme";

// The theme change grows out of the dark hero's liquid: a temporary full-screen canvas
// uses that same pattern as an animated mask, so the two themes meet along its curves.

const SPREAD_MS = 1450;
const HOLD_MS = 120;
const FADE_MS = 420;

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
  uniform float uProgress;
  uniform float uFade;
  uniform float uTime;
  uniform float uToDark;
  uniform vec2 uOrigin;
  uniform float uReach;
  uniform vec2 uResolution;
  varying vec2 vUv;

  const vec3 OBSIDIAN = vec3(0.039, 0.039, 0.043);
  const vec3 GOLD = vec3(0.788, 0.659, 0.416);
  const vec3 IVORY = vec3(0.957, 0.937, 0.902);
  const vec3 PAPER = vec3(0.984, 0.98, 0.973);

  ${liquidPattern}

  vec3 metal(float v) {
    vec3 color = mix(vec3(0.16, 0.09, 0.03), vec3(0.62, 0.42, 0.15), smoothstep(0.0, 0.45, v));
    color = mix(color, vec3(0.9, 0.7, 0.34), smoothstep(0.42, 0.82, v));
    return mix(color, vec3(1.0, 0.93, 0.74), smoothstep(0.88, 1.0, v));
  }

  void main() {
    vec2 p = (vUv * 2.0 - 1.0) * uResolution / min(uResolution.x, uResolution.y) * 0.5;
    vec2 none = vec2(0.0);
    float band = liquidBand(p, uTime, none, 0.0);
    float h = liquidHeight(p, uTime, none, 0.0);

    // Travels outward from the click, with the liquid's curves bending the front.
    float liquid = 1.0 - (pow(band, 0.32) * 0.72 + clamp(h * 0.5, 0.0, 1.0) * 0.28);
    vec2 away = p - uOrigin;
    float reach = length(away) / uReach * 0.72 + liquid * 0.28;
    float behind = uProgress * 1.42 - 0.05 - reach;

    float filled = smoothstep(0.0, 0.012, behind);
    float width = 0.085;
    float rim = smoothstep(-0.004, 0.006, behind) * (1.0 - smoothstep(width * 0.7, width * 1.5, behind));

    // The molten band: its surface rolls over the front, lit like the hero's metal.
    float e = 0.02;
    vec3 normal = vec3(
      liquidHeight(p + vec2(e, 0.0), uTime, none, 0.0) - h,
      liquidHeight(p + vec2(0.0, e), uTime, none, 0.0) - h,
      e * 1.2
    );
    normal.xy += normalize(away + 0.0001) * (0.5 - behind / (width * 1.5)) * 0.05;
    normal = normalize(normal);
    vec3 reflected = reflect(vec3(0.0, 0.0, -1.0), normal);
    vec3 molten = metal(0.5 + 0.5 * sin(reflected.y * 2.6 + reflected.x * 1.5 + uTime * 1.4));
    float glint = pow(max(dot(normal, normalize(vec3(0.35, 0.55, 0.76))), 0.0), 36.0);
    molten += vec3(1.0, 0.94, 0.8) * glint * 0.6;

    // The new theme glows just behind the front, then calms down.
    float settle = (1.0 - smoothstep(0.0, 0.4, behind)) * filled;
    vec3 dark = mix(OBSIDIAN, GOLD * 0.62, band) + IVORY * pow(band, 12.0) * 0.4;
    dark += GOLD * settle * 0.2;
    vec3 paper = mix(PAPER, vec3(1.0, 0.95, 0.84), settle * 0.7);
    vec3 target = mix(paper, dark, uToDark);

    // Ahead of the front: a soft shadow on the light page, a warm glow on the dark one.
    float ahead = (1.0 - smoothstep(0.0, 0.06, -behind)) * (1.0 - filled);
    vec3 aura = mix(GOLD, vec3(0.0), uToDark);
    float auraAlpha = ahead * mix(0.5, 0.26, uToDark);

    float alpha = max(max(filled, rim), auraAlpha);
    vec3 color = mix(aura, target, filled);
    color = mix(color, molten, rim);
    gl_FragColor = vec4(color, alpha * uFade);
  }
`;

// A quick burst that slows as it spreads, like heavy liquid losing momentum.
const ease = (t: number) => 1 - (1 - t) ** 2.4;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Returns false when WebGL is unavailable, so the caller can change theme instantly.
export function pourGold(
  target: ResolvedTheme,
  origin: { x: number; y: number },
  onCovered: () => void,
  onDone: () => void,
) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return false;

  const vertexShader = compile(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return false;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
  gl.useProgram(program);

  const dpr = Math.min(window.devicePixelRatio, 1.5);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.className = "liquid-gold";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;z-index:100;width:100%;height:100%;pointer-events:none";
  document.body.append(canvas);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(program, "uResolution"), canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(program, "uToDark"), target === "dark" ? 1 : 0);
  const short = Math.min(window.innerWidth, window.innerHeight);
  const toLiquid = (x: number, y: number) => [
    (x * 2 - window.innerWidth) / short / 2,
    (window.innerHeight - y * 2) / short / 2,
  ];
  const [originX, originY] = toLiquid(origin.x, origin.y);
  const reach = Math.max(
    ...[
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ].map(([x, y]) => {
      const [cornerX, cornerY] = toLiquid(x, y);
      return Math.hypot(cornerX - originX, cornerY - originY);
    }),
  );
  gl.uniform2f(gl.getUniformLocation(program, "uOrigin"), originX, originY);
  gl.uniform1f(gl.getUniformLocation(program, "uReach"), reach);
  const progress = gl.getUniformLocation(program, "uProgress");
  const fade = gl.getUniformLocation(program, "uFade");
  const time = gl.getUniformLocation(program, "uTime");

  const start = performance.now();
  const clockStart = liquidClock.time;
  let covered = false;

  const draw = (now: number) => {
    const elapsed = now - start;
    // Keeps the hero in step, so its liquid matches this one when the canvas fades away.
    liquidClock.time = clockStart + elapsed / 1000;

    if (!covered && elapsed >= SPREAD_MS) {
      covered = true;
      onCovered();
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(progress, ease(Math.min(elapsed / SPREAD_MS, 1)));
    gl.uniform1f(fade, 1 - Math.max(0, Math.min((elapsed - SPREAD_MS - HOLD_MS) / FADE_MS, 1)));
    gl.uniform1f(time, liquidClock.time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (elapsed < SPREAD_MS + HOLD_MS + FADE_MS) {
      requestAnimationFrame(draw);
      return;
    }
    canvas.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    onDone();
  };
  requestAnimationFrame(draw);
  return true;
}
