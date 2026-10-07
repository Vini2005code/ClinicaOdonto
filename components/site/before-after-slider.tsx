"use client";

import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider() {
  const [hint, setHint] = useState(true);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const timer = window.setTimeout(() => setHint(false), 1800); return () => window.clearTimeout(timer); }, []);
  const update = (value: number) => {
    comparisonRef.current?.style.setProperty("--split", `${value}%`);
    inputRef.current?.setAttribute("aria-valuetext", `${value}% da imagem antes`);
    if (hint) setHint(false);
  };
  return <div ref={comparisonRef} className={`comparison ${hint ? "show-hint" : ""}`} style={{ "--split": "52%" } as React.CSSProperties} role="group" aria-label="Comparação demonstrativa de um sorriso antes e depois do tratamento">
    <div className="compare-photo compare-after" />
    <div className="before-layer"><div className="compare-photo compare-before" /></div>
    <span className="compare-label before-label">Antes</span><span className="compare-label after-label">Depois</span>
    <div className="compare-line" aria-hidden="true"><span><MoveHorizontal size={20} /></span></div>
    <input ref={inputRef} aria-label="Posição da comparação antes e depois" aria-valuetext="52% da imagem antes" type="range" min="4" max="96" step="1" defaultValue="52" onInput={event => update(Number(event.currentTarget.value))} />
  </div>;
}
