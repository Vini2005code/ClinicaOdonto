import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL("https://aura-odontologia-avancada.briny-raven-6812.chatgpt.site"), title: { default: "AURA Odontologia Avançada", template: "%s · AURA" }, description: "Odontologia de alta precisão para quem busca saúde, estética e confiança em cada detalhe.", keywords: ["odontologia avançada", "implantes dentários", "odontologia estética", "ortodontia digital", "São Paulo"], openGraph: { title: "AURA Odontologia Avançada", description: "Um novo padrão em odontologia.", type: "website", locale: "pt_BR", siteName: "AURA" }, robots: { index: true, follow: true }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" }, other: { "theme-color": "#123b34" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
