// A temporary full-screen pour of molten gold, drawn with raw WebGL so the theme
// switch does not need to load Three.js.

const RISE_MS = 650;
const HOLD_MS = 110;
const DRAIN_MS = 740;
const LEVEL_EMPTY = -0.2;
const LEVEL_FULL = 1.25;

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
  uniform float uLevel;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

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

  // Layered sine folds, warped into each other, so forms stay smooth with no noise grid.
  float height(vec2 p) {
    float t = uTime * 0.45;
    vec2 q = p + 0.32 * vec2(sin(p.y * 1.7 + t), cos(p.x * 1.4 - t * 0.8));
    float folds = sin(q.x * 2.1 + t) + 0.8 * sin(q.y * 2.6 - t * 0.7);
    folds += 0.45 * sin((q.x + q.y) * 3.4 + t * 0.6);
    return folds * 0.32;
  }

  vec3 metal(float v) {
    vec3 color = mix(vec3(0.16, 0.09, 0.03), vec3(0.62, 0.42, 0.15), smoothstep(0.0, 0.45, v));
    color = mix(color, vec3(0.9, 0.7, 0.34), smoothstep(0.42, 0.82, v));
    return mix(color, vec3(1.0, 0.93, 0.74), smoothstep(0.88, 1.0, v));
  }

  void main() {
    vec2 p = vUv * uResolution / min(uResolution.x, uResolution.y);
    float surface = uLevel
      + sin(p.x * 3.0 + uTime * 2.2) * 0.035
      + sin(p.x * 7.0 - uTime * 3.0) * 0.016
      + (noise(vec2(p.x * 2.5, uTime * 0.9)) - 0.5) * 0.09;
    float depth = surface - vUv.y;
    float alpha = smoothstep(0.0, 0.0035, depth);
    if (alpha <= 0.0) discard;

    float e = 0.02;
    float h = height(p);
    vec3 normal = vec3(height(p + vec2(e, 0.0)) - h, height(p + vec2(0.0, e)) - h, e * 1.6);
    // The leading edge rolls over like a heavy liquid held by surface tension.
    float lip = exp(-depth * 22.0);
    normal.y += lip * 0.05;
    normal = normalize(normal);

    vec3 reflected = reflect(vec3(0.0, 0.0, -1.0), normal);
    float sky = 0.5 + 0.5 * sin(reflected.y * 2.6 + reflected.x * 1.5 + 0.8);
    vec3 color = metal(sky);
    float glint = pow(max(dot(normal, normalize(vec3(0.35, 0.55, 0.76))), 0.0), 36.0);
    color += vec3(1.0, 0.94, 0.8) * glint * 0.55;
    color += vec3(1.0, 0.88, 0.62) * lip * 0.28;
    gl_FragColor = vec4(color, alpha);
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
export function pourGold(onCovered: () => void, onDone: () => void) {
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
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(program, "uResolution"), canvas.width, canvas.height);
  const level = gl.getUniformLocation(program, "uLevel");
  const time = gl.getUniformLocation(program, "uTime");

  const start = performance.now();
  let covered = false;

  const draw = (now: number) => {
    const elapsed = now - start;
    let fill = 1;
    if (elapsed < RISE_MS) fill = ease(elapsed / RISE_MS);
    else if (elapsed > RISE_MS + HOLD_MS) fill = 1 - ease((elapsed - RISE_MS - HOLD_MS) / DRAIN_MS);

    if (!covered && elapsed >= RISE_MS) {
      covered = true;
      onCovered();
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(level, LEVEL_EMPTY + (LEVEL_FULL - LEVEL_EMPTY) * fill);
    gl.uniform1f(time, elapsed / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (elapsed < RISE_MS + HOLD_MS + DRAIN_MS) {
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
