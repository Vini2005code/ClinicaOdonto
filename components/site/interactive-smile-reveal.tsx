"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export function InteractiveSmileReveal() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fullyRevealed, setFullyRevealed] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const frameRef = useRef<HTMLButtonElement>(null);
  const lingerTimer = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  useEffect(() => () => {
    if (lingerTimer.current !== null) window.clearTimeout(lingerTimer.current);
  }, []);

  const revealAt = (event: PointerEvent<HTMLButtonElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    if (pointerStart.current && Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 8) {
      dragged.current = true;
    }
    const bounds = frame.getBoundingClientRect();
    frame.style.setProperty("--reveal-x", `${event.clientX - bounds.left}px`);
    frame.style.setProperty("--reveal-y", `${event.clientY - bounds.top}px`);
    if (lingerTimer.current !== null) window.clearTimeout(lingerTimer.current);
    if (!hasInteracted) setHasInteracted(true);
    if (!peeking) setPeeking(true);
  };

  const linger = () => {
    if (lingerTimer.current !== null) window.clearTimeout(lingerTimer.current);
    lingerTimer.current = window.setTimeout(() => setPeeking(false), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-[#f3eee5] py-24 md:py-32" id="resultados" aria-labelledby="smile-reveal-title">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-[22px] md:px-[5vw] lg:grid-cols-[0.82fr_1.18fr] lg:gap-[7vw]">
        <div className="max-w-[570px]">
          <p className="eyebrow">Estudo visual</p>
          <h2 id="smile-reveal-title" className="mt-6 font-[family-name:var(--serif)] text-[clamp(3rem,5vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-[#102b26]">
            Revele a naturalidade do <em className="font-normal text-[#667d70]">seu sorriso.</em>
          </h2>
          <p className="mt-7 max-w-[480px] text-[1.05rem] leading-[1.7] text-[#4d5a53]">
            Compare duas versões ilustrativas do mesmo sorriso: com manchas e sem manchas. Na prática, cada cuidado começa com uma avaliação individual.
          </p>
          <a href="#contato" className="mt-9 inline-flex min-h-12 items-center gap-3 border-b border-[#123b34] text-[0.78rem] font-semibold tracking-[0.04em] text-[#123b34] transition-colors hover:text-[#38705f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            Conversar sobre possibilidades <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="min-w-0">
          <button
            ref={frameRef}
            type="button"
            className={`smile-veil-frame group relative block w-full overflow-hidden rounded-2xl border border-[#123b34]/10 bg-[#b9a184] text-left shadow-[0_28px_70px_rgba(16,43,38,0.16)] ${peeking ? "is-peeking" : ""} ${fullyRevealed ? "is-full" : ""}`}
            aria-label={fullyRevealed ? "Mostrar sorriso ilustrativo com manchas" : "Revelar sorriso ilustrativo sem manchas"}
            aria-pressed={fullyRevealed}
            onPointerEnter={revealAt}
            onPointerMove={revealAt}
            onPointerDown={(event) => {
              pointerStart.current = { x: event.clientX, y: event.clientY };
              dragged.current = false;
              revealAt(event);
            }}
            onPointerUp={() => {
              pointerStart.current = null;
              linger();
            }}
            onPointerLeave={linger}
            onPointerCancel={linger}
            onClick={() => {
              if (dragged.current) {
                dragged.current = false;
                return;
              }
              if (!hasInteracted) setHasInteracted(true);
              setFullyRevealed((value) => !value);
            }}
          >
            <span className="smile-veil-before" aria-hidden="true" />
            <span className="smile-veil-clean" aria-hidden="true" />
            {!hasInteracted && (
              <span className="smile-veil-hint pointer-events-none absolute left-1/2 top-1/2 z-10 w-max max-w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-[#102b26]/85 px-5 py-3 text-center text-xs font-medium tracking-[0.06em] text-white shadow-lg">
                Passe o cursor ou deslize o dedo
              </span>
            )}
            <span className="smile-veil-before-label pointer-events-none absolute bottom-5 left-5 z-10 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-white drop-shadow-md">Antes · com manchas</span>
            <span className="smile-veil-after-label pointer-events-none absolute bottom-5 right-5 z-10 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-white drop-shadow-md">Depois · sem manchas</span>
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-[#65716a]">Imagem ilustrativa. Não representa resultado clínico real.</p>
        </div>
      </div>
    </section>
  );
}
