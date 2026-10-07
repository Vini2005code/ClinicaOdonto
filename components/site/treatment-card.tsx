"use client";

import { ArrowRight } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

type Treatment = { n: string; title: string; text: string };

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const reduceMotion = useReducedMotion();
  return <LazyMotion features={domAnimation} strict><m.article className="specialty-card" whileHover={reduceMotion ? undefined : { rotateX: 1.5, rotateY: -1.5, y: -3 }} transition={{ type: "spring", stiffness: 250, damping: 26 }}>
    <span>{treatment.n}</span><h3>{treatment.title}</h3><p>{treatment.text}</p><a href="#contato" aria-label={`Conversar sobre ${treatment.title}`}><ArrowRight size={19} aria-hidden="true" /></a>
  </m.article></LazyMotion>;
}
