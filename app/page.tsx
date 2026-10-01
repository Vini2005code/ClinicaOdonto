import AuraExperience from "@/components/aura-experience";

const schema = { "@context": "https://schema.org", "@type": "WebSite", name: "AURA Odontologia Avançada", description: "Projeto demonstrativo fictício de uma experiência digital premium para odontologia.", url: "https://aura-odontologia-avancada.riosvini42.chatgpt.site", inLanguage: "pt-BR" };

export default function Home() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><AuraExperience /></>; }
