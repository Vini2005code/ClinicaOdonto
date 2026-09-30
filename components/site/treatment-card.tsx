import { ArrowRight } from "lucide-react";

type Treatment = { n: string; title: string; text: string };

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return <article><span>{treatment.n}</span><h3>{treatment.title}</h3><p>{treatment.text}</p><a href="#contato" aria-label={`Conhecer ${treatment.title}`}><ArrowRight /></a></article>;
}
