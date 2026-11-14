import { Card, CardContent } from "../components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Users,
  Target,
  Sparkles,
  Scissors,
  Star,
  Clock,
  UserCheck,
  MessageCircle,
  Map,
  CalendarCheck,
  Zap,
  ArrowRight,
  Quote,
} from "lucide-react";

const contentModules = [
  "Identificar los diferentes tipos de cabello ondulado, rizado y afro.",
  "Ángulos, elevaciones y particiones.",
  "Mecha guía y desplazamientos.",
  "Construcción e interpretación de cortes en tendencia.",
  "Capas largas y capas cortas.",
  "Cortes redondos y en forma U.",
  "Flequillos conectados al diseño del corte.",
  "Crear cronogramas capilares personalizados.",
  "Ejecutar corte en capas base para rizos.",
  "Conocer una introducción a cortes en tendencia.",
  "Aprendes haciendo: práctica teórico-demostrativa en cabezal y sobre modelos reales.",
];

const targetAudience = [
  {
    title: "Profesionales de la belleza",
    description:
      "Peluqueros, barberos y colaboradores de salón que quieren sumar el cabello rizado a sus servicios con bases sólidas.",
    icon: GraduationCap,
  },
  {
    title: "Estilistas",
    description:
      "Ya trabajas en el mundo del cabello y buscas especializarte en corte para ondulado, rizado y afro con técnica propia.",
    icon: Scissors,
  },
  {
    title: "Dueñas de salón",
    description:
      "Tienes tu propio salón o emprendimiento capilar y quieres ofrecer cortes para rizos con criterio y técnica que te diferencien.",
    icon: Target,
  },
];

const oneOnOneBenefits = [
  {
    icon: UserCheck,
    title: "Acompañamiento directo de Ema",
    description: "Aprendes con quien creó el método, desde la experiencia real de salón.",
  },
  {
    icon: Star,
    title: "Enfoque profesional",
    description: "Contenido pensado para quienes ya trabajan con cabello y quieren especializarse.",
  },
  {
    icon: Sparkles,
    title: "Corrección en tiempo real",
    description:
      "Ema revisa tu técnica mientras practicas, para que corrijas en el momento y no después.",
  },
  {
    icon: Clock,
    title: "16 horas de formación en 2 días",
    description:
      "Tiempo real de aprendizaje, sin contenido diluido, las 16 horas son tuyas.",
  },
  {
    icon: Scissors,
    title: "Práctica completa: cabezal y modelos reales",
    description:
      "Trabajas ángulos, elevaciones y particiones en cabezal, y aplicas cada técnica sobre modelos reales. No te formas solo en teoría, te formas haciendo.",
  },
];

const processSteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Nos escribes por WhatsApp",
    description:
      "Te contamos las próximas fechas, el contenido y resolvemos tus dudas.",
  },
  {
    number: "02",
    icon: Map,
    title: "Reservas tu cupo",
    description:
      "Separas tu lugar con el 50% de la inversión.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Completas tu inscripción",
    description:
      "Pagas el 50% restante 3 días antes de la fecha del curso.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Vives tu curso",
    description:
      "2 días y 16 horas presenciales con Ema, en el salón, con práctica en cabezal y modelos reales.",
  },
];

const highlights = [
  "Curso para profesionales",
  "2 días",
  "16 horas",
  "Presencial",
  "Cabezal + modelos reales",
];

export function Education() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-14 md:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/img/mentoria/mentoriaheader.webp"
            alt="Curso para profesionales Ema Rizos"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center text-white">
            <span className="mb-4 inline-block rounded-full border border-secondary/50 bg-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary md:mb-6 md:text-sm">
              Método Ema Rizos · Curso para profesionales
            </span>

            <h1 className="mb-3 text-3xl font-bold leading-tight md:mb-5 md:text-5xl lg:text-6xl">
              Formación Profesional en Cabello Rizado
            </h1>

            <p className="mb-4 text-lg font-light italic text-white/90 md:mb-8 md:text-2xl">
              Técnica, criterio y práctica real en cabello rizado.
            </p>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              Si este año decidiste especializarte, emprender o dar el salto
              profesional en el mundo de los rizos, esta formación está pensada
              exactamente para ti. Una formación práctica, enseñada
              directamente por Ema.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:grid-cols-3 lg:grid-cols-5">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center text-sm font-medium text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Formación profesional
              </div>

              <p className="mb-4 text-base leading-relaxed text-foreground/80 md:text-xl">
                La Formación Profesional en Cabello Rizado — Método Ema Rizos es
                un curso para profesionales, presencial y práctico.
              </p>

              <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                No es una clase teórica más. Es una formación para llevar tu
                trabajo con rizos a otro nivel. Ema te acompaña directamente en{" "}
                <strong className="text-primary">
                  2 días y 16 horas de formación
                </strong>
                , practicando en cabezal y con modelos reales: primero construyes
                la técnica, después la aplicas sobre cabello vivo.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-[28px] shadow-xl">
                <img
                  src="/img/mentoria/mentoria2.webp"
                  alt="Curso para profesionales"
                  className="h-[320px] w-full object-cover md:h-[420px]"
                />
              </div>

              <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-border/50 bg-white p-4 shadow-lg md:left-6 md:right-6 md:p-5">
                <p className="text-sm font-medium text-primary md:text-base">
                  Práctica real y acompañamiento directo de Ema durante todo
                  el proceso.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 mt-14 md:mb-16 md:mt-20">
            <h2 className="mb-6 text-center text-2xl font-bold text-primary md:mb-10 md:text-3xl">
              ¿Para quién es esta formación?
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
              {targetAudience.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={index}
                    className="h-full border-border/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <CardContent className="p-5 text-center md:p-8">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 md:mb-6 md:h-16 md:w-16">
                        <Icon className="size-6 text-primary md:size-8" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-primary md:mb-4 md:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-secondary/20 bg-secondary/10 p-5 text-center md:mt-12 md:p-8">
              <Sparkles className="mx-auto mb-3 size-6 text-secondary md:mb-4 md:size-8" />
              <p className="text-base font-medium text-primary md:text-lg">
                Pensado para quienes ya trabajan con cabello.
                <br />
                <span className="mt-1 block text-sm font-normal text-muted-foreground md:text-base">
                  Necesitas disposición para aprender, practicar y tomarte
                  este camino en serio.{" "}
                  <strong className="text-primary">
                    2 días. 16 horas. Práctica real.
                  </strong>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué este curso */}
      <section className="bg-muted/50 py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center md:mb-12">
              <h2 className="mb-3 text-2xl font-bold text-primary md:mb-4 md:text-4xl">
                ¿Por qué este curso?
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-xl">
                Porque cada rizo es distinto y merece técnica especializada.
              </p>
            </div>

            <div className="mb-8 grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] md:mb-10">
              <div className="rounded-2xl border border-border/50 bg-card p-5 text-sm leading-relaxed text-foreground/70 shadow-sm md:p-8 md:text-base">
                Aquí no solo ves la técnica:{" "}
                <strong className="text-primary">
                  la practicas, la corriges con Ema en el momento y la aplicas
                  sobre modelos reales.
                </strong>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary p-6 text-white shadow-lg">
                <Quote className="mb-4 size-8 text-secondary" />
                <p className="text-base leading-relaxed md:text-lg">
                  Este curso te permite aprender con profundidad, corregir en
                  tiempo real y salir con técnica que puedes aplicar en tu
                  salón desde el primer día.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {oneOnOneBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/50 shadow-sm transition-all hover:border-secondary/30 hover:shadow-md"
                  >
                    <CardContent className="p-5 md:p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 md:mb-4 md:h-12 md:w-12">
                        <Icon className="size-5 text-primary md:size-6" />
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-primary md:mb-2 md:text-base">
                        {benefit.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Método */}
      <section className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 md:gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl sm:aspect-[3/4] lg:order-1">
              <img
                src="/img/mentoria/mentoria1.webp"
                alt="Método Ema Rizos"
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-white/85 p-4 shadow-lg backdrop-blur-md md:bottom-6 md:left-6 md:p-5">
                <p className="text-sm font-semibold text-primary md:text-base">
                  Método construido desde experiencia real de salón.
                </p>
              </div>
            </div>

            <div className="lg:order-2">
              <div className="mb-4 inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Método Ema Rizos
              </div>

              <h2 className="mb-4 text-2xl font-bold text-primary md:mb-6 md:text-4xl">
                ¿Por qué nace el Método Ema Rizos?
              </h2>

              <div className="space-y-4 text-base text-foreground/80 md:space-y-6 md:text-lg">
                <p>
                  Durante años, en el trabajo diario de salón, se repite el
                  mismo patrón:
                </p>

                <blockquote className="rounded-2xl border-l-4 border-secondary bg-secondary/10 px-4 py-4 text-sm font-medium italic text-primary/80 md:px-6 md:text-base">
                  "Cabellos rizados mal diagnosticados. Productos mal elegidos.
                  Técnicas que no respetan la textura natural del rizo."
                </blockquote>

                <p>
                  El problema no es la falta de talento.{" "}
                  <strong className="text-primary">
                    Es la falta de formación especializada.
                  </strong>
                </p>

                <p>
                  El Método Ema Rizos nace de la experiencia real, de errores,
                  aprendizajes y resultados comprobados, con el objetivo de
                  formar profesionales capaces de trabajar el cabello rizado con
                  criterio, respeto y seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-muted/50 py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center md:mb-12">
              <h2 className="mb-3 text-2xl font-bold text-primary md:mb-4 md:text-4xl">
                Así es tu proceso
              </h2>
              <p className="text-base text-muted-foreground md:text-lg">
                Cuatro pasos simples para empezar tu curso.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-secondary/30 hover:shadow-md md:gap-5 md:p-7"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary md:h-12 md:w-12">
                      <span className="text-xs font-bold text-white md:text-sm">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="size-4 text-secondary md:size-5" />
                        <h3 className="text-sm font-bold text-primary md:text-base">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-primary md:mb-6 md:text-4xl">
              Contenido de la formación
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-xl">
              Durante la formación aprenderás a trabajar el cabello afro-rizado
              desde la base, luego profundizaremos en técnicas corte básico,
              cuidados y técnicas.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-primary md:mb-8 md:text-2xl">
                <BookOpen className="shrink-0 text-secondary" />
                Aprenderás a:
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-x-6 md:gap-y-4">
                {contentModules.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:border-secondary/30 md:p-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary md:size-6" />
                    <span className="text-sm font-medium text-foreground/80 md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-primary p-4 text-white shadow-lg md:mt-10 md:p-6">
                <Users className="size-6 shrink-0 text-secondary md:size-8" />
                <p className="text-sm font-medium md:text-lg">
                  La formación incluye práctica teórico-demostrativa en cabezal
                  y con <span className="text-secondary">modelos reales</span>.
                  Sales del curso con horas reales de tijera en mano.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-8">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src="/img/mentoria/mentoria3.webp"
                    alt="Contenido del curso"
                    className="h-[340px] w-full object-cover md:h-[520px]"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/85 via-transparent to-transparent p-6 md:p-8">
                    <div>
                      <p className="mb-2 text-lg font-bold text-white md:text-xl">
                        Inicia tu camino profesional hoy.
                      </p>
                      <p className="text-sm text-white/85 md:text-base">
                        Aprende con criterio, práctica real y una ruta enfocada
                        en tu crecimiento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-primary shadow-sm md:p-5 md:text-base">
                  Formación pensada para que no solo entiendas la técnica, sino
                  que también sepas aplicarla con seguridad.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm md:gap-10 md:p-10 lg:p-12">
            
            {/* 1. TEXTO INTRODUCTORIO (Arriba en móvil, Columna Izquierda en escritorio) */}
            <div className="text-center lg:text-left lg:col-start-1 lg:row-start-1">
              <span className="mb-4 inline-flex rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Curso para profesionales · Método Ema Rizos
              </span>

              <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
                ¿Estás lista para transformar tu carrera?
              </h2>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/85 md:text-lg lg:mx-0">
                Reserva tu cupo en el curso para profesionales y comienza a construir tu
                futuro como especialista en rizos. Tendrás formación práctica,
                modelos reales y acompañamiento directo de Ema.
              </p>
            </div>

            {/* 2. IMAGEN DEL SALÓN (Centro en móvil, Columna Derecha en escritorio) */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
              <div className="overflow-hidden rounded-[28px] bg-white/10 shadow-2xl">
                <img
                  src="/img/mentoria/mentoria4.webp"
                  alt="Curso para profesionales en cabello rizado"
                  className="h-[320px] w-full object-cover md:h-[420px] lg:h-[460px]"
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-primary/70 p-4 backdrop-blur-md md:bottom-6 md:left-6 md:right-6 md:p-5">
                <p className="text-sm font-medium text-white md:text-base">
                  Formación práctica, modelos reales y acompañamiento directo
                  para construir una carrera con criterio y técnica.
                </p>
              </div>
            </div>

            {/* 3. BLOQUE DE INVERSIÓN Y BOTÓN (Debajo de la imagen en móvil, Columna Izquierda abajo en escritorio) */}
            <div className="text-center lg:text-left lg:col-start-1 lg:row-start-2 border-t border-white/10 pt-6 lg:border-none lg:pt-0">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white md:text-2xl mb-1">
                  ¿Lista para especializarte?
                </h3>
                <p className="text-2xl font-extrabold text-secondary md:text-3xl tracking-tight mb-1">
                  Inversión: $1.800.000
                </p>
                <p className="text-xs text-white/80 font-medium md:text-sm">
                  (50% para reservar · 50% restante 3 días antes de tu fecha)
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B573007633755"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="rounded-full bg-secondary px-8 py-3 text-base font-bold text-primary shadow-lg transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl md:px-10 md:py-4 md:text-lg flex items-center gap-2">
                    Quiero mi cupo <ArrowRight className="size-4 md:size-5" /> WhatsApp
                  </button>
                </a>

                <div className="inline-flex items-center gap-2 text-sm text-white/75">
                  <ArrowRight className="size-4 text-secondary" />
                  2 días · 16 horas · Presencial
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}