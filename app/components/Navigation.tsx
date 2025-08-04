import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SE</span>
            </div>
            <span className="text-white font-bold text-xl">Salón Exclusivo</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#servicios" className="text-white hover:text-purple-300 transition-colors duration-300">
              Servicios
            </a>
            <a href="#galeria" className="text-white hover:text-purple-300 transition-colors duration-300">
              Galería
            </a>
            <a href="#contacto" className="text-white hover:text-purple-300 transition-colors duration-300">
              Contacto
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white hover:text-purple-300 transition-colors duration-300 font-medium">
                  Iniciar Sesión
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Registrarse
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700",
                    userButtonPopoverActions: "text-gray-700 dark:text-gray-300",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}