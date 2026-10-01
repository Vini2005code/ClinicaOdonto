"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const specialties = [
  { title: "Implantes", text: "Reabilitação com planejamento digital.", href: "#tratamentos" },
  { title: "Odontologia estética", text: "Forma, proporção e harmonia com naturalidade.", href: "#tratamentos" },
  { title: "Ortodontia", text: "Alinhamento personalizado e fluxo digital.", href: "#precisao" },
  { title: "Reabilitação oral", text: "Função e estética em um plano integrado.", href: "#tratamentos" },
];

export function Brand({ light = false }: { light?: boolean }) {
  return <a href="#inicio" className={`brand ${light ? "brand-light" : ""}`} aria-label="AURA — início"><span>AURA</span><small>Odontologia Avançada</small></a>;
}

export function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [specialtiesOpen, setSpecialtiesOpen] = useState(false);
  useEffect(() => {
    let compactState = window.scrollY > 42;
    let frame = 0;
    setCompact(compactState);
    const update = () => {
      frame = 0;
      const next = window.scrollY > 42;
      if (next === compactState) return;
      compactState = next;
      setCompact(next);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setSpecialtiesOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const links = [["A clínica", "#clinica"], ["Especialistas", "#especialistas"], ["Resultados", "#resultados"], ["Contato", "#contato"]];
  return <header className={`site-header ${compact ? "is-compact" : ""}`}>
    <Brand light={!compact} />
    <nav aria-label="Navegação principal">
      <div className="specialties-nav" onMouseEnter={() => setSpecialtiesOpen(true)} onMouseLeave={() => setSpecialtiesOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpecialtiesOpen(false); }}>
        <button aria-expanded={specialtiesOpen} aria-controls="specialties-menu" aria-haspopup="true" onClick={() => setSpecialtiesOpen(true)}>Especialidades</button>
        {specialtiesOpen && <div id="specialties-menu" className="mega-menu is-open">
          <div className="mega-intro"><span>Especialidades</span><strong>Precisão clínica.<br />Visão integrada.</strong><a href="#especialidades">Encontre seu cuidado <ArrowRight size={16} /></a></div>
          <div className="mega-grid">{specialties.map((item, index) => <a href={item.href} key={item.title} onClick={() => setSpecialtiesOpen(false)}><span className="mega-number">0{index + 1}</span><span><strong>{item.title}</strong><small>{item.text}</small></span></a>)}</div>
        </div>}
      </div>
      {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
    </nav>
    <a className="nav-cta" href="#contato">Agendar conversa</a>
    <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
    {open && <div className="mobile-menu" id="mobile-menu"><details><summary>Especialidades</summary>{specialties.map(item => <a href={item.href} key={item.title} onClick={() => setOpen(false)}>{item.title}</a>)}</details>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="button" href="#contato" onClick={() => setOpen(false)}>Agendar conversa</a></div>}
  </header>;
}
