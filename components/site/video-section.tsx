"use client";

import { KeyboardEvent, PointerEvent, useEffect, useRef } from "react";

const FRAMES = Array.from(
  { length: 16 },
  (_, index) => `/images/orthodontic-sequence/frame-${String(index + 1).padStart(2, "0")}.webp`,
);

const phases = [
  { until: 0.28, label: "Diagnóstico digital" },
  { until: 0.72, label: "Planejamento ortodôntico" },
  { until: 1, label: "Projeção final" },
];

export function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const frameIndexRef = useRef(0);
  const draggingRef = useRef(false);
  const preloadedFramesRef = useRef<HTMLImageElement[]>([]);

  const renderProgress = (value: number) => {
    const progress = Math.min(1, Math.max(0, value));
    const frameIndex = Math.round(progress * (FRAMES.length - 1));
    const phase = phases.find((item) => progress <= item.until) ?? phases[2];
    progressRef.current = progress;
    frameRef.current?.style.setProperty("--scrub-progress", String(progress));
    frameRef.current?.setAttribute("aria-valuenow", String(frameIndex));
    frameRef.current?.setAttribute("aria-valuetext", `Etapa ${frameIndex + 1} de ${FRAMES.length}: ${phase.label}`);

    if (frameIndex !== frameIndexRef.current && imageRef.current) {
      frameIndexRef.current = frameIndex;
      imageRef.current.src = FRAMES[frameIndex];
    }

    if (phaseRef.current) phaseRef.current.textContent = phase.label;
  };

  const progressFromPointer = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return progressRef.current;
    const rect = frame.getBoundingClientRect();
    return (clientX - rect.left) / Math.max(1, rect.width);
  };

  const startScrubbing = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-scrubbing");
    event.currentTarget.focus({ preventScroll: true });
    renderProgress(progressFromPointer(event.clientX));
  };

  const moveScrubber = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    renderProgress(progressFromPointer(event.clientX));
  };

  const stopScrubbing = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove("is-scrubbing");
  };

  const controlWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = 1 / (FRAMES.length - 1);
    const directions: Record<string, number> = {
      ArrowLeft: -step,
      ArrowDown: -step,
      ArrowRight: step,
      ArrowUp: step,
      PageDown: -step * 4,
      PageUp: step * 4,
    };
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      renderProgress(event.key === "Home" ? 0 : 1);
      return;
    }
    if (directions[event.key] === undefined) return;
    event.preventDefault();
    renderProgress(progressRef.current + directions[event.key]);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      FRAMES.slice(1).forEach((src) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;
        preloadedFramesRef.current.push(image);
      });
      loadObserver.disconnect();
    }, { rootMargin: "600px 0px" });

    const hintObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      hintObserver.disconnect();
      if (!reducedMotion) {
        hintTimer = setTimeout(() => {
          frame.classList.add("is-hinting");
          frame.addEventListener("animationend", () => frame.classList.remove("is-hinting"), { once: true });
        }, 240);
      }
    }, { threshold: 0.35 });

    loadObserver.observe(section);
    hintObserver.observe(section);
    return () => {
      loadObserver.disconnect();
      hintObserver.disconnect();
      if (hintTimer) clearTimeout(hintTimer);
      preloadedFramesRef.current = [];
    };
  }, []);

  return <section className="precision-film section-dark" id="precisao" ref={sectionRef} data-reveal>
    <div className="film-copy"><p className="eyebrow light">Ortodontia de alta precisão</p><h2>Precisão em<br /><em>cada detalhe.</em></h2><p>Explore uma simulação visual do planejamento ortodôntico. Cada etapa traduz como pequenas decisões constroem um resultado mais previsível.</p><span>Planejamento digital · acompanhamento contínuo</span></div>
    <div className="film-experience">
      <div
        className="film-frame"
        ref={frameRef}
        role="slider"
        tabIndex={0}
        aria-label="Explorar as etapas de uma simulação ortodôntica"
        aria-valuemin={0}
        aria-valuemax={FRAMES.length - 1}
        aria-valuenow={0}
        aria-valuetext={`Etapa 1 de ${FRAMES.length}: ${phases[0].label}`}
        style={{ "--scrub-progress": 0 } as React.CSSProperties}
        onPointerDown={startScrubbing}
        onPointerMove={moveScrubber}
        onPointerUp={stopScrubbing}
        onPointerCancel={stopScrubbing}
        onLostPointerCapture={() => {
          draggingRef.current = false;
          frameRef.current?.classList.remove("is-scrubbing");
        }}
        onKeyDown={controlWithKeyboard}
      >
        <div className="film-index"><small>Simulação visual / 02</small><span ref={phaseRef}>{phases[0].label}</span></div>
        <img ref={imageRef} src={FRAMES[0]} width={864} height={480} loading="lazy" decoding="async" draggable={false} alt="Simulação demonstrativa da evolução de um planejamento ortodôntico" />
        <div className="film-mask" />
        <div className="film-scrubber" aria-hidden="true"><span /></div>
        <div className="film-drag-cue" aria-hidden="true"><i>←</i> Arraste para explorar <i>→</i></div>
      </div>
      <div className="film-scrub-meta" aria-hidden="true"><span>Diagnóstico</span><small>Simulação interativa</small><span>Projeção</span></div>
    </div>
  </section>;
}
