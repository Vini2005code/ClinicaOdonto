"use client";

import { useEffect, useRef } from "react";

export type DitherVeilProps = {
  src: string;
  pixelSize: number;
  levels: number;
  inkColor: string;
  paperColor: string;
  contrast: number;
  revealRadius: number;
  softness: number;
  linger: number;
  rimColor: string;
  rim: number;
  fullyRevealed: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const vertex = `#version 300 es
void main() {
  vec2 position = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uPointer;
uniform float uPixelSize;
uniform float uLevels;
uniform float uContrast;
uniform float uRadius;
uniform float uSoftness;
uniform float uPointerVisible;
uniform float uFullyRevealed;
uniform float uRim;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uRimColor;
out vec4 fragColor;

float noise(vec2 cell) {
  return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float screenAspect = uResolution.x / uResolution.y;
  float imageAspect = uImageSize.x / uImageSize.y;
  vec2 cover = screenAspect > imageAspect
    ? vec2(1.0, imageAspect / screenAspect)
    : vec2(screenAspect / imageAspect, 1.0);
  vec3 photo = texture(uImage, (uv - 0.5) * cover + 0.5).rgb;

  float light = dot(photo, vec3(0.2126, 0.7152, 0.0722));
  light = clamp((light - 0.5) * uContrast + 0.5, 0.0, 1.0);
  float steps = max(1.0, uLevels - 1.0);
  float level = clamp(floor(light * steps + noise(floor(gl_FragCoord.xy / uPixelSize))) / steps, 0.0, 1.0);
  vec3 warmPhoto = mix(photo, vec3(light) * vec3(1.02, 0.84, 0.64), 0.68);
  vec3 veil = mix(warmPhoto, mix(uInk, uPaper, level), 0.12);

  float distanceToPointer = distance(gl_FragCoord.xy, uPointer);
  float inner = uRadius * (1.0 - uSoftness * 0.45);
  float reveal = max(uFullyRevealed,
    uPointerVisible * (1.0 - smoothstep(inner, uRadius, distanceToPointer)));
  float rim = uPointerVisible * (1.0 - uFullyRevealed) *
    (smoothstep(inner, uRadius, distanceToPointer) - smoothstep(uRadius, uRadius * 1.08, distanceToPointer));
  vec3 color = mix(veil, photo, reveal);
  color = mix(color, uRimColor, rim * uRim);
  fragColor = vec4(color, 1.0);
}`;

function rgb(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export default function DitherVeil({
  src,
  pixelSize,
  levels,
  inkColor,
  paperColor,
  contrast,
  revealRadius,
  softness,
  linger,
  rimColor,
  rim,
  fullyRevealed,
  onReady,
  onFailure,
}: DitherVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<(() => void) | null>(null);
  const fullRef = useRef(fullyRevealed);
  const readyRef = useRef(onReady);
  const failureRef = useRef(onFailure);

  useEffect(() => {
    readyRef.current = onReady;
    failureRef.current = onFailure;
  }, [onReady, onFailure]);

  useEffect(() => {
    fullRef.current = fullyRevealed;
    drawRef.current?.();
  }, [fullyRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const gl = canvas?.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!canvas || !host || !gl) {
      failureRef.current();
      return;
    }

    const vertexShader = compile(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      failureRef.current();
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      failureRef.current();
      return;
    }

    const texture = gl.createTexture();
    const vertexArray = gl.createVertexArray();
    if (!texture || !vertexArray) {
      gl.deleteProgram(program);
      failureRef.current();
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const uniforms = Object.fromEntries(
      ["uImage", "uResolution", "uImageSize", "uPointer", "uPixelSize", "uLevels", "uContrast", "uRadius", "uSoftness", "uPointerVisible", "uFullyRevealed", "uRim", "uInk", "uPaper", "uRimColor"]
        .map((name) => [name, gl.getUniformLocation(program, name)]),
    );
    const pointer = { x: 0, y: 0, visible: false };
    let imageWidth = 0;
    let imageHeight = 0;
    let lingerTimer: number | null = null;
    let disposed = false;

    const draw = () => {
      if (!imageWidth || disposed) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindVertexArray(vertexArray);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.uImage, 0);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uImageSize, imageWidth, imageHeight);
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      const scale = canvas.width / Math.max(1, canvas.clientWidth);
      gl.uniform1f(uniforms.uPixelSize, Math.max(1, pixelSize * scale));
      gl.uniform1f(uniforms.uLevels, levels);
      gl.uniform1f(uniforms.uContrast, contrast);
      gl.uniform1f(uniforms.uRadius, revealRadius * scale);
      gl.uniform1f(uniforms.uSoftness, softness);
      gl.uniform1f(uniforms.uPointerVisible, pointer.visible ? 1 : 0);
      gl.uniform1f(uniforms.uFullyRevealed, fullRef.current ? 1 : 0);
      gl.uniform1f(uniforms.uRim, rim);
      gl.uniform3fv(uniforms.uInk, rgb(inkColor));
      gl.uniform3fv(uniforms.uPaper, rgb(paperColor));
      gl.uniform3fv(uniforms.uRimColor, rgb(rimColor));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      draw();
    };
    const onMove = (event: PointerEvent) => {
      if (lingerTimer !== null) window.clearTimeout(lingerTimer);
      const bounds = host.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) * canvas.width / bounds.width;
      pointer.y = (bounds.bottom - event.clientY) * canvas.height / bounds.height;
      pointer.visible = true;
      draw();
    };
    const onLeave = () => {
      if (lingerTimer !== null) window.clearTimeout(lingerTimer);
      lingerTimer = window.setTimeout(() => {
        pointer.visible = false;
        draw();
      }, linger * 1000);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    host.addEventListener("pointercancel", onLeave, { passive: true });

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      imageWidth = image.naturalWidth;
      imageHeight = image.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      resize();
      readyRef.current();
    };
    image.onerror = () => failureRef.current();
    image.src = src;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      failureRef.current();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      drawRef.current = null;
      image.onload = null;
      image.onerror = null;
      if (lingerTimer !== null) window.clearTimeout(lingerTimer);
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    };
  }, [src, pixelSize, levels, inkColor, paperColor, contrast, revealRadius, softness, linger, rimColor, rim]);

  return <canvas ref={canvasRef} className="smile-veil-canvas" aria-hidden="true" />;
}
