import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://aura-odontologia-avancada.riosvini42.chatgpt.site/sitemap.xml" }; }
