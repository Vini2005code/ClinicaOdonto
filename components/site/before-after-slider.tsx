"use client";

import { useEffect, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider() {
  const [value, setValue] = useState(52);
  const [hint, setHint] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setHint(false), 1800); return () => window.clearTimeout(timer); }, []);
  return <div className={`comparison ${hint ? "show-hint" : ""}`} style={{ "--split": `${value}%` } as React.CSSProperties} role="img" aria-label="Comparação demonstrativa de um sorriso antes e depois do tratamento">
    <div className="compare-photo compare-before" />
    <div className="after-layer"><div className="compare-photo compare-after" /></div>
    <span className="compare-label before-label">Antes</span><span className="compare-label after-label">Depois</span>
    <div className="compare-line" aria-hidden="true"><span><MoveHorizontal size={20} /></span></div>
    <input aria-label="Posição da comparação antes e depois" aria-valuetext={`${value}% da imagem depois`} type="range" min="4" max="96" step="1" value={value} onChange={event => { setValue(Number(event.target.value)); setHint(false); }} />
  </div>;
}
