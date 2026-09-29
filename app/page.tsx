import AuraExperience from "@/components/aura-experience";

const schema = { "@context": "https://schema.org", "@type": "Dentist", name: "AURA Odontologia Avançada", description: "Clínica odontológica fictícia de alta precisão — projeto demonstrativo.", url: "https://aura-odontologia-avancada.briny-raven-6812.chatgpt.site", telephone: "+55 11 4000-2028", address: { "@type": "PostalAddress", streetAddress: "Alameda dos Ipês, 280", addressLocality: "São Paulo", addressRegion: "SP", postalCode: "01414-000", addressCountry: "BR" }, medicalSpecialty: ["Implant Dentistry", "Cosmetic Dentistry", "Orthodontics"] };

export default function Home() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><AuraExperience /></>; }
