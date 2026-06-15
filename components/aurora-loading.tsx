"use client";

import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const VERTEX_SHADER = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 colorRamp(float factor) {
  vec3 first = mix(uColorStops[0], uColorStops[1], smoothstep(0.0, 0.5, factor));
  vec3 second = mix(uColorStops[1], uColorStops[2], smoothstep(0.5, 1.0, factor));
  return mix(first, second, step(0.5, factor));
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
  vec3 rampColor = colorRamp(uv.x);

  float wave = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25));
  float height = exp(wave * 0.5 * uAmplitude);
  float intensity = 0.6 * ((uv.y * 2.0) - height + 0.2);
  float alpha = smoothstep(0.2 - uBlend * 0.5, 0.2 + uBlend * 0.5, intensity);

  fragColor = vec4(intensity * rampColor * alpha, alpha);
}
`;

type AuroraLoadingProps = HTMLMotionProps<"div"> & {
  amplitude?: number;
  blend?: number;
  colorStops?: [string, string, string];
  label?: string;
  speed?: number;
  subtitle?: string;
};

function colorStopsToRgb(stops: [string, string, string]) {
  return stops.map((hex) => {
    const color = new Color(hex);
    return [color.r, color.g, color.b] as [number, number, number];
  });
}

export function AuroraLoading({
  amplitude = 0.9,
  blend = 0.5,
  className,
  colorStops = ["#2b5876", "#4e4376", "#2b5876"],
  label = "Generating project files",
  speed = 1.8,
  subtitle = "Preparing the sandbox preview",
  ...props
}: AuroraLoadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ amplitude, blend, colorStops, speed });

  propsRef.current = { amplitude, blend, colorStops, speed };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.className = "absolute inset-0 h-full w-full";

    const geometry = new Triangle(gl);
    delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uColorStops: { value: colorStopsToRgb(colorStops) },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uTime: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.appendChild(gl.canvas);
    resize();

    let frameId = requestAnimationFrame(function update(time) {
      const current = propsRef.current;
      program.uniforms.uTime.value = time * 0.001 * current.speed;
      program.uniforms.uAmplitude.value = current.amplitude;
      program.uniforms.uBlend.value = current.blend;
      program.uniforms.uColorStops.value = colorStopsToRgb(current.colorStops);
      renderer.render({ scene: mesh });
      frameId = requestAnimationFrame(update);
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "bg-background relative isolate h-full min-h-[320px] w-full overflow-hidden",
        className,
      )}
      {...props}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)] opacity-90"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--background)_0%,transparent_54%)] opacity-35" />
      {/* <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] [background-size:42px_42px] opacity-30" /> */}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="relative size-16">
          <div className="border-primary/20 bg-background/70 absolute inset-0 rounded-full border shadow-lg backdrop-blur-md" />
          <div className="border-t-primary absolute inset-2 animate-spin rounded-full border-2 border-transparent border-r-cyan-400 motion-reduce:animate-none" />
          <div className="bg-primary/80 absolute inset-5 animate-pulse rounded-full shadow-[0_0_24px_var(--primary)] motion-reduce:animate-none" />
        </div>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">{label}</p>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
