import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollTriggerModule from "gsap/ScrollTrigger";
const { ScrollTrigger } = ScrollTriggerModule;

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Bodas de Ensueño",
    description: "Celebra el día más importante de tu vida en un ambiente elegante y romántico",
    icon: "💍",
    features: ["Decoración personalizada", "Menú gourmet", "Coordinación completa"]
  },
  {
    title: "Eventos Corporativos",
    description: "Espacios profesionales para conferencias, lanzamientos y celebraciones empresariales",
    icon: "🏢",
    features: ["Equipos audiovisuales", "Catering ejecutivo", "Servicio de valet"]
  },
  {
    title: "Celebraciones Privadas",
    description: "Cumpleaños, aniversarios y ocasiones especiales en un marco incomparable",
    icon: "🎉",
    features: ["Ambientación temática", "Entretenimiento", "Fotografía profesional"]
  }
];

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "bottom 20%",
        }
      }
    );

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
            }
          }
        );
      }
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
        >
          Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Servicios</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-6xl mb-6 text-center">{service.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <span className="text-purple-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Más Información
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}