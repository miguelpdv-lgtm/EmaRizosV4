import { useState, useEffect } from "react";

interface HeroImage {
  url: string;
  alt: string;
}

const heroImages: HeroImage[] = [
  {
    url: "/img/Hero/hero1.webp",
    alt: "Cuidado especializado para rizos",
  },
  {
    url: "/img/Hero/hero2.webp",
    alt: "Mujer feliz con rizos hermosos",
  },
  {
    url: "/img/Hero/hero3.webp",
    alt: "Nuestro salón Ema Rizos",
  },
];

const INTERVAL_MS = 4600;
const SLIDE_TRANSITION = "transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)";

// Carrusel con transiciones CSS (sin librerías de animación, para que el inicio cargue más rápido).
export function HeroCarousel() {
  const [{ current, previous }, setState] = useState<{ current: number; previous: number | null }>({
    current: 0,
    previous: null,
  });
  // Solo se descargan la imagen visible y la siguiente
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const preload = setTimeout(() => setLoaded((s) => new Set(s).add(1 % heroImages.length)), 1500);
    const interval = setInterval(() => {
      setState((s) => {
        const next = (s.current + 1) % heroImages.length;
        setLoaded((l) => new Set(l).add(next).add((next + 1) % heroImages.length));
        return { current: next, previous: s.current };
      });
    }, INTERVAL_MS);
    return () => {
      clearTimeout(preload);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden" aria-hidden="true">
      {heroImages.map((img, i) => {
        const isCurrent = i === current;
        const isPrevious = i === previous;
        const offset = isCurrent ? "0%" : isPrevious ? "-100%" : "100%";
        return (
          <div
            key={img.url}
            className="absolute inset-0 h-full w-full bg-cover bg-center will-change-transform"
            style={{
              transform: `translateX(${offset})`,
              transition: isCurrent || isPrevious ? SLIDE_TRANSITION : "none",
              backgroundImage: loaded.has(i)
                ? `linear-gradient(rgba(123, 34, 64, 0.4), rgba(123, 34, 64, 0.7)), url('${img.url}')`
                : "linear-gradient(rgba(123, 34, 64, 0.4), rgba(123, 34, 64, 0.7))",
            }}
          />
        );
      })}
    </div>
  );
}
