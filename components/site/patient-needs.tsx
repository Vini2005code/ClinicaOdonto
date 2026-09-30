"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { needs } from "@/data/content";

function PatientNeedCard({ index, active, label, onSelect }: { index: number; active: boolean; label: string; onSelect: () => void }) {
  return <button role="tab" aria-selected={active} onClick={onSelect}><span>0{index + 1}</span>{label}<ArrowRight size={18} /></button>;
}

export function PatientNeeds() {
  const [activeNeed, setActiveNeed] = useState(0);
  return <section className="needs section" id="especialidades" data-reveal><div className="section-head"><div><p className="eyebrow">Comece pela sua necessidade</p><h2>O que você deseja<br />transformar?</h2></div><p>Você não precisa saber o nome do tratamento. Conte-nos o que sente ou deseja — nós encontramos o caminho mais adequado.</p></div><div className="needs-grid"><div className="needs-list" role="tablist" aria-label="Necessidades odontológicas">{needs.map((need, i) => <PatientNeedCard key={need.label} index={i} active={activeNeed === i} label={need.label} onSelect={() => setActiveNeed(i)} />)}</div><aside className="need-result" aria-live="polite"><span>Recomendação inicial</span><strong>{needs[activeNeed].treatment}</strong><p>Uma avaliação cuidadosa define as possibilidades, prioridades e o tempo de cada etapa.</p><a href="#contato" className="text-link">Conversar com um especialista <ArrowRight size={16} /></a></aside></div></section>;
}
