"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { needs } from "@/data/content";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
    <p className="form-disclaimer">Demonstração de interface — nenhum dado é enviado ou armazenado.</p>
    <div className="field-row">
      <label>Nome<input required name="name" autoComplete="name" placeholder="Como podemos chamar você?" /></label>
      <label>WhatsApp<input required name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" /></label>
    </div>
    <label>Como podemos ajudar?
      <select required name="interest" defaultValue="">
        <option value="" disabled>Selecione uma necessidade</option>
        {needs.map((need) => <option key={need.label}>{need.label}</option>)}
      </select>
    </label>
    <label>Mensagem <span>opcional</span><textarea name="message" rows={3} placeholder="Conte-nos brevemente o que você busca." /></label>
    <button className="button button-light" type="submit">Solicitar contato <ArrowRight size={17} /></button>
    {sent && <p className="form-success" role="status"><Check size={16} /> Simulação concluída. Em um site real, a equipe entraria em contato.</p>}
  </form>;
}
