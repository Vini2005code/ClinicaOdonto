import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://aura-odontologia-avancada.riosvini42.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AURA Odontologia Avançada · Projeto conceito", template: "%s · AURA" },
  description: "Projeto demonstrativo de uma experiência digital premium para clínicas odontológicas. AURA é uma marca fictícia.",
  keywords: ["odontologia avançada", "implantes dentários", "odontologia estética", "ortodontia digital", "design de clínica odontológica"],
  alternates: { canonical: siteUrl },
  openGraph: { title: "AURA Odontologia Avançada · Projeto conceito", description: "Experiência digital demonstrativa para clínicas odontológicas. AURA é uma marca fictícia.", type: "website", locale: "pt_BR", siteName: "AURA", url: siteUrl, images: [{ url: "/images/hero-aura.webp", width: 1774, height: 887, alt: "Conceito visual da AURA Odontologia Avançada" }] },
  twitter: { card: "summary_large_image", title: "AURA Odontologia Avançada · Projeto conceito", description: "Experiência digital demonstrativa para clínicas odontológicas." },
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  other: { "theme-color": "#123b34" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
