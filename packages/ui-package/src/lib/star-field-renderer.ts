/**
 * Dependency-free WebGL2 starfield. Runs in a Web Worker (OffscreenCanvas) or on the
 * main thread. Star positions are computed on the GPU from gl_VertexID, so there is
 * no vertex buffer and no per-frame CPU work besides one uniform update.
 */

export type RGB = [number, number, number];

export type StarFieldSettings = {
  /** Number of stars. */
  count: number;
  /** Point size in scene units (0.0025 matches the original). */
  size: number;
  /** Base opacity of the nearest stars (0–1). */
  opacity: number;
  /** Frame cap. The drift is slow, so 30 looks identical and halves the GPU work. */
  fps: number;
  /** false = draw a single still frame (prefers-reduced-motion). */
  animate: boolean;
  /** Star color as 0–1 sRGB. */
  color: RGB;
  /** Called once after the first frame is drawn (used to fade the canvas in). */
  onReady?: () => void;
};

export type StarFieldRenderer = {
  /** Size in device pixels. */
  resize(width: number, height: number): void;
  /** Theme change: new color and opacity. */
  setAppearance(color: RGB, opacity: number): void;
  destroy(): void;
};

const VERTEX_SHADER = `#version 300 es
uniform float uTime;
uniform float uAspect;
uniform float uScale;
uniform float uSize;
uniform float uOpacity;
out float vAlpha;

// PCG hash: stable pseudo-random numbers per star, computed on the GPU.
uint pcg(uint v) {
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}
float rand(uint v) { return float(pcg(v)) / 4294967295.0; }

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }

const float TILT_C = 0.70710678;                 // cos(PI/4) = sin(PI/4)
const mat3 TILT = mat3(TILT_C, TILT_C, 0.0, -TILT_C, TILT_C, 0.0, 0.0, 0.0, 1.0);
const float FOCAL = 1.30322537;                  // 1 / tan(75deg / 2): three.js default camera FOV

void main() {
  uint id = uint(gl_VertexID) * 3u;
  float theta = 6.28318531 * rand(id);
  float phi = acos(2.0 * rand(id + 1u) - 1.0);
  float depth = rand(id + 2u);                   // 0 = inner shell, 1 = outer shell
  vec3 p = (1.2 + depth) * vec3(sin(phi) * cos(theta), sin(phi) * sin(theta), cos(phi));
  p = TILT * rotX(-uTime / 10.0) * rotY(-uTime / 15.0) * p;

  vec3 view = p - vec3(0.0, 0.0, 1.0);           // camera at z = 1, looking down -z
  gl_Position = vec4(view.x * FOCAL / uAspect, view.y * FOCAL, 0.0, -view.z);
  gl_PointSize = max(1.0, uSize * uScale / -view.z);
  vAlpha = uOpacity * (1.0 - 0.5 * depth);       // farther stars are dimmer
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
uniform vec3 uColor;
in float vAlpha;
out vec4 outColor;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;                          // round, soft-edged dots
  float a = vAlpha * smoothstep(0.5, 0.3, d);
  outColor = vec4(uColor * a, a);                // premultiplied alpha
}`;

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  powerPreference: "low-power",
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[star-field]", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createStarFieldRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  settings: StarFieldSettings,
): StarFieldRenderer | null {
  // Both canvas types share this getContext signature; the cast only helps TypeScript.
  const gl = (canvas as OffscreenCanvas).getContext("webgl2", CONTEXT_OPTIONS) as WebGL2RenderingContext | null;
  if (!gl) return null;

  let uniforms: Record<"time" | "aspect" | "scale" | "size" | "opacity" | "color", WebGLUniformLocation | null> | null =
    null;
  let width = canvas.width;
  let height = canvas.height;
  let color = settings.color;
  let opacity = settings.opacity;
  let readyFired = false;

  function init(): boolean {
    const vs = compile(gl!, gl!.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl!, gl!.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return false;
    const program = gl!.createProgram();
    if (!program) return false;
    gl!.attachShader(program, vs);
    gl!.attachShader(program, fs);
    gl!.linkProgram(program);
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
      console.warn("[star-field]", gl!.getProgramInfoLog(program));
      return false;
    }
    gl!.useProgram(program);
    gl!.bindVertexArray(gl!.createVertexArray()); // no attributes: positions come from gl_VertexID
    gl!.enable(gl!.BLEND);
    gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
    gl!.clearColor(0, 0, 0, 0);

    const loc = (name: string) => gl!.getUniformLocation(program, name);
    uniforms = {
      time: loc("uTime"),
      aspect: loc("uAspect"),
      scale: loc("uScale"),
      size: loc("uSize"),
      opacity: loc("uOpacity"),
      color: loc("uColor"),
    };
    gl!.uniform1f(uniforms.size, settings.size);
    gl!.uniform1f(uniforms.opacity, opacity);
    gl!.uniform3f(uniforms.color, color[0], color[1], color[2]);
    applySize();
    return true;
  }

  function applySize() {
    if (!uniforms || width === 0 || height === 0) return;
    gl!.viewport(0, 0, width, height);
    gl!.uniform1f(uniforms.aspect, width / height);
    gl!.uniform1f(uniforms.scale, height * 0.5);
  }

  let time = 0;
  function draw() {
    if (!uniforms || width === 0 || height === 0) return;
    gl!.uniform1f(uniforms.time, time);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.POINTS, 0, settings.count);
    if (!readyFired) {
      readyFired = true;
      settings.onReady?.();
    }
  }

  // Frame loop: capped fps; time advances in clamped steps so returning to the tab doesn't jump.
  let raf = 0;
  let last = 0;
  let sinceDraw = 0;
  const frameMs = 1000 / settings.fps;
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(now - last, 100);
    last = now;
    time += dt / 1000;
    sinceDraw += dt;
    if (sinceDraw < frameMs - 2) return;
    sinceDraw = 0;
    draw();
  }
  function start() {
    if (!settings.animate || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  // The GPU can drop the context (driver reset, too many tabs): stop, then rebuild when it's back.
  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    uniforms = null;
  };
  const onRestored = () => {
    if (init()) {
      draw();
      start();
    }
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  if (!init()) return null;
  start();

  return {
    resize(w, h) {
      if (w === width && h === height) return;
      width = canvas.width = w;
      height = canvas.height = h;
      applySize();
      draw(); // redraw at once so resizing never shows a blank frame
    },
    setAppearance(nextColor, nextOpacity) {
      color = nextColor;
      opacity = nextOpacity;
      if (uniforms) {
        gl!.uniform3f(uniforms.color, nextColor[0], nextColor[1], nextColor[2]);
        gl!.uniform1f(uniforms.opacity, nextOpacity);
      }
      if (!settings.animate) draw();
    },
    destroy() {
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      gl!.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
