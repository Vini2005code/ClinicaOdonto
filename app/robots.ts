import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://aura-odontologia-avancada.briny-raven-6812.chatgpt.site/sitemap.xml" }; }
