import { liquidClock, liquidPattern } from "@/shaders";
import type { ResolvedTheme } from "./theme";

// The theme change grows out of the dark hero's liquid: a temporary full-screen canvas
// uses that same pattern as an animated mask, so the two themes meet along its curves.

const SPREAD_MS = 1150;
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
  uniform vec2 uResolution;
  varying vec2 vUv;

  const vec3 OBSIDIAN = vec3(0.039, 0.039, 0.043);
  const vec3 GOLD = vec3(0.788, 0.659, 0.416);
  const vec3 IVORY = vec3(0.957, 0.937, 0.902);
  const vec3 PAPER = vec3(0.984, 0.98, 0.973);

  ${liquidPattern}

  void main() {
    vec2 p = (vUv * 2.0 - 1.0) * uResolution / min(uResolution.x, uResolution.y) * 0.5;
    vec2 none = vec2(0.0);
    float band = liquidBand(p, uTime, none, 0.0);
    float h = liquidHeight(p, uTime, none, 0.0);

    // The bright lines are reached first, then the theme spreads outward along the liquid.
    float reach = 1.0 - (pow(band, 0.32) * 0.72 + clamp(h * 0.5, 0.0, 1.0) * 0.28);
    float edge = uProgress * 1.3 - 0.15;
    float filled = 1.0 - smoothstep(edge - 0.05, edge, reach);
    float rim = (1.0 - smoothstep(0.0, 0.075, abs(reach - edge))) * step(uProgress, 0.995);

    vec3 dark = mix(OBSIDIAN, GOLD * 0.62, band) + IVORY * pow(band, 12.0) * 0.4;
    vec3 color = mix(PAPER, dark, uToDark);
    color = mix(color, GOLD, rim);
    color += vec3(1.0, 0.93, 0.76) * rim * rim * rim * 0.55;

    gl_FragColor = vec4(color, max(filled, rim) * uFade);
  }
`;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Returns false when WebGL is unavailable, so the caller can change theme instantly.
export function pourGold(target: ResolvedTheme, onCovered: () => void, onDone: () => void) {
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
