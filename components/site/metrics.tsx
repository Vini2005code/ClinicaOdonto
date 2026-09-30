import { metrics } from "@/data/content";

export function Metrics() {
  return <section className="metrics" aria-label="Indicadores demonstrativos da AURA"><div className="metrics-intro"><span>AURA em números</span><small>Conteúdo demonstrativo</small></div>{metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</section>;
}

export function WhyAura() {
  const pillars = [["01", "Diagnóstico preciso", "Tecnologia para compreender cada detalhe."], ["02", "Planejamento personalizado", "Cada tratamento começa antes da primeira intervenção."], ["03", "Acompanhamento próximo", "Do primeiro contato ao resultado."]];
  return <section className="why-aura section" data-reveal><div className="why-heading"><p className="eyebrow">Por que AURA</p><h2>Não é apenas sobre<br />o tratamento.</h2><p>É sobre como ele é planejado.</p></div><div className="why-pillars">{pillars.map(([n,title,text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
