"use client";

import { ArrowUpRight } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

export function BookingButton() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.a
        className="booking-button"
        href="#contato"
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <span>Explorar contato</span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </m.a>
    </LazyMotion>
  );
}
