"use client";

import { KeyboardEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { needs } from "@/data/content";

function PatientNeedCard({ index, active, label, onSelect, onKeyDown }: { index: number; active: boolean; label: string; onSelect: () => void; onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void }) {
  return <button id={`need-tab-${index}`} role="tab" aria-selected={active} aria-controls="need-panel" tabIndex={active ? 0 : -1} onClick={onSelect} onKeyDown={onKeyDown}><span>0{index + 1}</span>{label}<ArrowRight size={18} /></button>;
}

export function PatientNeeds() {
  const [activeNeed, setActiveNeed] = useState(0);
  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = needs.length - 1;
    else next = (current + (event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1) + needs.length) % needs.length;
    setActiveNeed(next);
    const tabs = event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next]?.focus();
  };
  return <section className="needs section" id="especialidades" data-reveal><div className="section-head"><div><p className="eyebrow">Comece pela sua necessidade</p><h2>O que você deseja<br />transformar?</h2></div><p>Você não precisa saber o nome do tratamento. Conte-nos o que sente ou deseja — nós encontramos o caminho mais adequado.</p></div><div className="needs-grid"><div className="needs-list" role="tablist" aria-label="Necessidades odontológicas" aria-orientation="vertical">{needs.map((need, i) => <PatientNeedCard key={need.label} index={i} active={activeNeed === i} label={need.label} onSelect={() => setActiveNeed(i)} onKeyDown={(event) => moveFocus(event, i)} />)}</div><aside id="need-panel" className="need-result" role="tabpanel" aria-labelledby={`need-tab-${activeNeed}`}><span>Recomendação inicial</span><strong>{needs[activeNeed].treatment}</strong><p>Uma avaliação cuidadosa define as possibilidades, prioridades e o tempo de cada etapa.</p><a href="#contato" className="text-link">Conversar com um especialista <ArrowRight size={16} /></a></aside></div></section>;
}
