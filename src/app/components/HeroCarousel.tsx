import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeroImage {
  url: string;
  alt: string;
}

const heroImages: HeroImage[] = [
  {
     url: "img/Hero/hero1.jpg",
     alt: "Cuidado especializado para rizos",
  },
  {
    url: "img/Hero/hero2.jpg",
    alt: "Mujer feliz con rizos hermosos",
  },
  {
    url: "img/Hero/hero3.jpg",
    alt: "Nuestro salón Ema Rizos",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            duration: 2.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(123, 34, 64, 0.4), rgba(123, 34, 64, 0.7)), url('${heroImages[currentIndex].url}')`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
