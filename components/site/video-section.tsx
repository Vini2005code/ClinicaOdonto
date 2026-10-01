"use client";

import { KeyboardEvent, PointerEvent, useEffect, useRef } from "react";

const EDGE_INSET = 24;

export function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pendingRef = useRef(0);
  const frameRequestRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const grabOffsetRef = useRef(0);

  const renderProgress = (value: number) => {
    const progress = Math.min(1, Math.max(0, value));
    progressRef.current = progress;
    pendingRef.current = progress;
    frameRef.current?.style.setProperty("--scrub-progress", String(progress));
    scrubberRef.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    scrubberRef.current?.setAttribute("aria-valuetext", `${Math.round(progress * 100)}% da transformação`);

    if (frameRequestRef.current !== null) return;
    frameRequestRef.current = requestAnimationFrame(() => {
      frameRequestRef.current = null;
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      video.pause();
      const target = Math.min(video.duration, video.duration * pendingRef.current);
      try {
        if (Math.abs(video.currentTime - target) > 0.008) video.currentTime = target;
      } catch {
        // The pending position is applied as soon as metadata becomes available.
      }
    });
  };

  const progressFromPointer = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return progressRef.current;
    const rect = frame.getBoundingClientRect();
    const inset = Math.min(EDGE_INSET, rect.width * 0.06);
    const usableWidth = Math.max(1, rect.width - inset * 2);
    return (clientX - grabOffsetRef.current - rect.left - inset) / usableWidth;
  };

  const startScrubbing = (event: PointerEvent<HTMLDivElement>) => {
    const handleRect = event.currentTarget.getBoundingClientRect();
    grabOffsetRef.current = event.clientX - (handleRect.left + handleRect.width / 2);
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    frameRef.current?.classList.add("is-scrubbing");
    event.currentTarget.focus({ preventScroll: true });
  };

  const moveScrubber = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    event.preventDefault();
    renderProgress(progressFromPointer(event.clientX));
  };

  const stopScrubbing = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove("is-dragging");
    frameRef.current?.classList.remove("is-scrubbing");
    renderProgress(progressRef.current);
  };

  const controlWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = { ArrowLeft: -.02, ArrowDown: -.02, ArrowRight: .02, ArrowUp: .02, PageDown: -.1, PageUp: .1 };
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      renderProgress(event.key === "Home" ? 0 : 1);
      return;
    }
    if (steps[event.key] === undefined) return;
    event.preventDefault();
    renderProgress(progressRef.current + steps[event.key]);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const scrubber = scrubberRef.current;
    const video = videoRef.current;
    if (!section || !scrubber || !video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      video.src = "/media/aura-protese.mp4";
      video.load();
      loadObserver.disconnect();
    }, { rootMargin: "400px 0px" });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!reducedMotion) {
        timer = setTimeout(() => {
          scrubber.classList.add("is-hinting");
          scrubber.addEventListener("animationend", () => scrubber.classList.remove("is-hinting"), { once: true });
        }, 280);
      }
    }, { threshold: .35 });
    loadObserver.observe(section);
    observer.observe(section);
    return () => {
      loadObserver.disconnect();
      observer.disconnect();
      if (timer) clearTimeout(timer);
      if (frameRequestRef.current !== null) cancelAnimationFrame(frameRequestRef.current);
    };
  }, []);

  return <section className="precision-film section-dark" id="precisao" ref={sectionRef} data-reveal>
    <div className="film-copy"><p className="eyebrow light">Ortodontia de alta precisão</p><h2>Precisão em<br /><em>cada detalhe.</em></h2><p>Movimentos pequenos exigem decisões exatas. Planejamos cada etapa para alinhar função, estética e previsibilidade.</p><span>Planejamento digital · acompanhamento contínuo</span></div>
    <div className="film-experience">
      <div className="film-frame" ref={frameRef} style={{ "--scrub-progress": 0 } as React.CSSProperties}>
        <div className="film-index">Transformação clínica / 02</div>
        <video ref={videoRef} muted playsInline preload="none" disablePictureInPicture aria-label="Transformação ortodôntica controlada pelo usuário" onLoadedMetadata={() => renderProgress(pendingRef.current)} />
        <div className="film-mask" />
        <div className="film-scrub-track">
          <div
            ref={scrubberRef}
            className="film-scrubber"
            role="slider"
            tabIndex={0}
            aria-label="Controlar transformação ortodôntica"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            aria-valuetext="0% da transformação"
            onPointerDown={startScrubbing}
            onPointerMove={moveScrubber}
            onPointerUp={stopScrubbing}
            onPointerCancel={stopScrubbing}
            onLostPointerCapture={() => {
              draggingRef.current = false;
              scrubberRef.current?.classList.remove("is-dragging");
              frameRef.current?.classList.remove("is-scrubbing");
            }}
            onKeyDown={controlWithKeyboard}
          ><span /></div>
        </div>
      </div>
      <div className="film-scrub-meta" aria-hidden="true"><span>Início</span><small>Explore a transformação</small><span>Resultado</span></div>
    </div>
  </section>;
}
