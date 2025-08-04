import type { Route } from "./+types/home";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Salón de Eventos Exclusivo - El Lugar Perfecto para tu Celebración" },
    { name: "description", content: "Descubre nuestro elegante salón de eventos. Bodas, celebraciones corporativas y eventos privados en un espacio único con servicios de primera clase." },
  ];
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <div id="servicios">
          <Services />
        </div>
        <div id="galeria">
          <Gallery />
        </div>
        <div id="contacto">
          <Contact />
        </div>
      </main>
    </>
  );
}
