"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, ReactNode, useEffect, useMemo, useRef } from "react";
import { ShaderMaterial, Vector2, Vector3 } from "three";
import { ResolvedTheme } from "@/lib/theme";
import { palettes, ShaderName, shaders, vertex } from "@/shaders";

function Surface({ name, theme, still }: { name: ShaderName; theme: ResolvedTheme; still: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const element = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 8 },
      uResolution: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2(0, 0) },
      uPresence: { value: 0 },
      uCanvas: { value: new Vector3() },
      uAccent: { value: new Vector3() },
      uHighlight: { value: new Vector3() },
    }),
    [],
  );
  const target = useRef({ x: 0, y: 0, presence: 0 });

  useEffect(() => {
    const { canvas, accent, highlight } = palettes[theme];
    uniforms.uCanvas.value.set(...canvas);
    uniforms.uAccent.value.set(...accent);
    uniforms.uHighlight.value.set(...highlight);
    invalidate();
  }, [theme, uniforms, invalidate]);

  useEffect(() => {
    if (still || theme === "light") return;
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 2 - 1;
      const y = 1 - ((event.clientY - box.top) / box.height) * 2;
      target.current = { x, y, presence: Math.abs(x) < 1 && Math.abs(y) < 1 ? 1 : 0 };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [element, still, theme]);

  useFrame((state, delta) => {
    if (!material.current) return;
    const { uTime, uResolution, uPointer, uPresence } = material.current.uniforms;
    uResolution.value.set(state.size.width, state.size.height);
    if (still) return;
    uTime.value += delta * palettes[theme].speed;
    uPointer.value.lerp(target.current, 0.08);
    uPresence.value += (target.current.presence - uPresence.value) * 0.06;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={shaders[name]}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// When WebGL is unavailable the parent's CSS gradient simply stays visible.
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ShaderCanvas({
  name,
  theme,
  still,
}: {
  name: ShaderName;
  theme: ResolvedTheme;
  still: boolean;
}) {
  return (
    <WebGLBoundary>
      <Canvas
        dpr={[1, 1.5]}
        flat
        frameloop={still ? "demand" : "always"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Surface name={name} theme={theme} still={still} />
      </Canvas>
    </WebGLBoundary>
  );
}
