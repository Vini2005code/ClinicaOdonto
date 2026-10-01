import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://aura-odontologia-avancada.riosvini42.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AURA Odontologia Avançada", template: "%s · AURA" },
  description: "Conceito de clínica odontológica premium: diagnóstico cuidadoso, planejamento digital e tratamentos integrados.",
  keywords: ["odontologia avançada", "implantes dentários", "odontologia estética", "ortodontia digital", "design de clínica odontológica"],
  alternates: { canonical: siteUrl },
  openGraph: { title: "AURA Odontologia Avançada", description: "Precisão clínica. Naturalidade em cada resultado.", type: "website", locale: "pt_BR", siteName: "AURA", url: siteUrl },
  twitter: { card: "summary", title: "AURA Odontologia Avançada", description: "Precisão clínica. Naturalidade em cada resultado." },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  other: { "theme-color": "#123b34" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
