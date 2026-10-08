"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { needs } from "@/data/content";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return <form className="contact-form" autoComplete="off" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
    <p className="form-disclaimer">Formulário demonstrativo. Use dados de exemplo; nada será enviado ou armazenado.</p>
    <div className="field-row">
      <label>Nome<input required name="name" autoComplete="off" placeholder="Nome de exemplo" /></label>
      <label>WhatsApp<input required name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder="(11) 99999-9999" /></label>
    </div>
    <label>Como podemos ajudar?
      <select required name="interest" defaultValue="">
        <option value="" disabled>Selecione uma necessidade</option>
        {needs.map((need) => <option key={need.label}>{need.label}</option>)}
      </select>
    </label>
    <label>Mensagem <span>opcional</span><textarea name="message" rows={3} placeholder="Conte-nos brevemente o que você busca." /></label>
    <button className="button button-light" type="submit">Testar formulário <ArrowRight size={17} /></button>
    <div className="form-feedback" aria-live="polite">
      {sent && <p className="form-success" role="status"><Check size={16} /> Simulação concluída. Nenhum dado foi enviado.</p>}
    </div>
  </form>;
}
