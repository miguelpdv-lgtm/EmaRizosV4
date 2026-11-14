import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Palette,
  RefreshCcw,
  Scissors,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type MediaItem = {
  src: string;
  type: "image" | "video";
};

type ServiceItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  media: MediaItem[];
};

// ─── Datos ───────────────────────────────────────────────────────────────────

const heroMedia: MediaItem[] = [
  { src: "/img/services/hero-1.webp", type: "image" },
  { src: "/img/services/hero-2.webp", type: "image" },
  { src: "/img/services/hero-3.webp", type: "image" },
];

const services: ServiceItem[] = [
  {
    id: "reconstructivos",
    title: "Tratamientos reconstructivos",
    icon: Droplets,
    description:
      "No todos los cabellos están dañados por lo mismo, y no todos necesitan lo mismo para recuperarse. Trabajamos con protocolos de hidratación, nutrición, reparación y reestructuración según lo que tu cabello necesita: si viene de procesos químicos, de coloración, de resequedad extrema o simplemente necesita recuperar fuerza y elasticidad. Cada tratamiento parte de un diagnóstico real, no de un paquete genérico.",
    media: [
      { src: "/img/services/reconstructivos.webp", type: "image" },
      { src: "/img/services/reconstructivos-2.webp", type: "image" },
      { src: "/img/services/reconstructivos-3.webp", type: "image" },
    ],
  },
  {
    id: "cortes",
    title: "Cortes de diseño",
    icon: Scissors,
    description:
      "Cortamos en seco, trabajando directamente con tu patrón de rizo, tu densidad y la caída natural de tu cabello. No es un corte adaptado de técnicas para cabello liso — es un corte pensado desde el rizo. Forma, estructura y un resultado que se mantiene en tu día a día.",
    media: [
      { src: "/img/services/cortes.webp", type: "image" },
      { src: "/img/services/cortes-2.webp", type: "image" },
      { src: "/img/services/cortes-3.webp", type: "image" },
    ],
  },
  {
    id: "definicion",
    title: "Definición y estilizado",
    icon: Sparkles,
    description:
      "Te definimos y te enseñamos. Cada sesión de estilizado es también una clase práctica: qué productos usar, cuánto producto aplicar, cómo distribuirlo según tu tipo de rizo y cómo secar para que el resultado que ves en el salón sea el que puedas replicar en casa.",
    media: [
      { src: "/img/services/definicion.webp", type: "image" },
      { src: "/img/services/definicion-2.webp", type: "image" },
      { src: "/img/services/definicion-3.webp", type: "image" },
    ],
  },
  {
    id: "color",
    title: "EmaCurlsLight — Color",
    icon: Palette,
    description:
      "Hacemos color de una forma distinta: sin decoloración. Tonos completos, highlights y balayage diseñados para aportar luz y dimensión sin comprometer la estructura de tu rizo. No hacemos platinados ni procesos que sacrifiquen la salud del cabello para conseguir un tono. Todos los servicios de color requieren diagnóstico previo.",
    media: [
      { src: "/img/services/color.webp", type: "image" },
      { src: "/img/services/color-2.webp", type: "image" },
      { src: "/img/services/color-3.webp", type: "image" },
    ],
  },
  {
    id: "transicion",
    title: "Transición capilar",
    icon: RefreshCcw,
    description:
      "Acompañamos tu proceso con servicios diseñados para cada etapa — desde el retiro progresivo del cabello dañado por procesos químicos hasta el gran corte final. No hacemos definiciones completas en cabello en transición porque sería forzar un resultado que la textura mixta aún no permite. Lo que sí hacemos es trabajar con lo que tienes: fortalecer lo que crece, retirar lo que ya no sirve y enseñarte a manejar ambas texturas mientras avanzas.",
    media: [
      { src: "/img/services/transicion.webp", type: "image" },
      { src: "/img/services/transicion-2.webp", type: "image" },
      { src: "/img/services/transicion-3.webp", type: "image" },
    ],
  },
];

const noHacemos = [
  "No realizamos alisados, keratinas, permanentes ni bajones de onda.",
  "No modificamos tu textura natural.",
  "No realizamos definiciones completas en cabellos en transición. Trabajamos con servicios específicos para cada fase de ese proceso.",
  "No realizamos servicios de color sin diagnóstico previo.",
  "No prometemos resultados que no podemos garantizar. Nuestro compromiso es con la salud de tu cabello, no con expectativas irreales.",
];

const antesCita = [
  "Para servicios de corte, es necesario que asistas con el cabello limpio, seco y completamente desenredado.",
  "Esto es indispensable para la precisión del corte en seco.",
  "Trabajamos únicamente con cita previa y anticipo para garantizar tu espacio.",
];

// ─── Carrusel de Servicios con soporte de video ──────────────────────────────

function ServiceCarousel({
  media,
  title,
}: {
  media: MediaItem[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media[current].type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, media]);

  useEffect(() => {
    if (media.length <= 1) return;
    if (media[current].type === "video") return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % media.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [media.length, current]);

  const handleVideoEnded = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + media.length) % media.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  const item = media[current];

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-full">
      <div className="relative overflow-hidden rounded-[24px] border border-border/50 bg-white p-3 shadow-lg">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[18px] bg-muted/30">
          {item.type === "video" ? (
            <video
              ref={videoRef}
              src={item.src}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop={false}
              playsInline
              controls
              onEnded={handleVideoEnded}
            />
          ) : (
            <ImageWithFallback
              src={item.src}
              alt={`${title} ${current + 1}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-primary shadow-md whitespace-nowrap">
          Diagnóstico + asesoría
        </div>

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white md:size-9"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white md:size-9"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {media.map((mediaItem, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-7 bg-primary" : "w-2 bg-primary/30"
              }`}
              aria-label={`Ir a ${mediaItem.type === "video" ? "video" : `imagen ${index + 1}`}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tarjeta de servicio ──────────────────────────────────────────────────────

function ServiceCard({
  service,
  reverse,
}: {
  service: ServiceItem;
  reverse?: boolean;
}) {
  const Icon = service.icon;

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-white shadow-sm">
      <CardContent className="p-0">
        <div
          className={`grid items-center md:grid-cols-2 ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold leading-tight text-primary md:text-2xl">
                {service.title}
              </h3>
            </div>
            <p className="text-sm leading-7 text-foreground/75 md:text-base">
              {service.description}
            </p>
          </div>
          <div className="bg-muted/40 p-5 md:p-6 lg:p-8">
            <ServiceCarousel media={service.media} title={service.title} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function ServicesPage() {
  return (
    <div className="bg-background text-foreground">
{/* INTRODUCCIÓN CON CARRUSEL UNIFICADO */}
<section className="bg-primary text-white overflow-hidden">
  <div className="container mx-auto px-4 py-10 md:py-14 lg:py-16">
    <div className="grid gap-6 md:grid-cols-2 md:gap-2 items-center">
            
            {/* Carrusel Visual (Izquierda en Desktop) */}
            <div className="order-2 md:order-1 mt-3 md:mt-0 w-full flex justify-center">
              <div className="w-full">
                <ServiceCarousel media={heroMedia} title="Servicios Ema Rizos" />
              </div>
            </div>

            {/* Texto Centrado internamente, pero ubicado a la derecha en Desktop */}
            <div className="text-center space-y-6 order-1 md:order-2 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary backdrop-blur-sm">
                  Servicios — Ema Rizos
                </span>
                <h1 className="max-w-xl text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
                  El espacio donde tu cabello natural es la prioridad, no la excepción
                </h1>
              </div>

              <div className="max-w-lg space-y-4 text-sm leading-7 text-white/90 md:text-base lg:text-lg lg:leading-8">
                <p>
                  Diagnosticamos, educamos y trabajamos con tu textura real. Cada cita incluye asesoría personalizada: vienes por un servicio, pero te vas entendiendo tu cabello.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NUESTROS SERVICIOS */}
      <section className="py-10 md:py-14 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center md:mb-10">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Nuestros servicios
            </span>
            <h2 className="mx-auto max-w-4xl text-2xl font-semibold text-primary md:text-3xl lg:text-4xl">
              Servicios diseñados desde el conocimiento técnico y el respeto por tu textura
            </h2>
          </div>
          <div className="space-y-6 md:space-y-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* LO QUE NO HACEMOS */}
      <section className="bg-primary py-10 text-white md:py-14 lg:py-16">
        <div className="container mx-auto px-4">
          <Card className="border-white/15 bg-white/10 text-white backdrop-blur-sm">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="mb-5 flex items-center justify-center gap-3 text-center">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-secondary">
                  <AlertCircle className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  Lo que NO hacemos
                </h2>
              </div>
              <p className="mb-5 text-center text-sm leading-7 text-white/85 md:text-base">
                Somos claras con esto porque define quiénes somos:
              </p>
              <div className="grid gap-3">
                {noHacemos.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-secondary" />
                    <p className="text-sm leading-6 text-white/90 md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ANTES DE TU CITA */}
      <section className="py-10 md:py-14 lg:py-16">
        <div className="container mx-auto px-4">
          <Card className="border-border/60 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="mb-5 flex items-center justify-center gap-3 text-center">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/20 text-primary">
                  <CalendarCheck2 className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold text-primary md:text-3xl">
                  Antes de tu cita
                </h2>
              </div>
              <div className="grid gap-3">
                {antesCita.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-foreground/80 md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AGENDA TU CITA */}
      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 text-center shadow-xl md:p-12">
            <span className="mb-3 inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Agenda tu cita
            </span>
            <h2 className="mb-4 text-2xl font-semibold leading-tight text-primary md:text-3xl lg:text-4xl">
              Este es un espacio para quienes quieren entender su cabello y cuidarlo con conocimiento.
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm leading-7 text-foreground/75 md:text-base lg:text-lg">
              Si eso resuena contigo, agenda y empecemos.
            </p>
            <a
              href="https://emarizos.site.agendapro.com/co/sucursal/235348"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-primary px-6 text-white hover:bg-primary/90"
              >
                Agendar cita
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}