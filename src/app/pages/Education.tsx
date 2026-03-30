import { Card, CardContent } from "../components/ui/card";
import { BookOpen, CheckCircle2, GraduationCap, Users, Target, Sparkles, Scissors } from "lucide-react";

export function Education() {
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
    "Conocer una introducción a cortes en tendencia."
  ];

  const targetAudience = [
    {
      title: "Principiantes",
      description: "Quieres iniciar desde cero y formarte como estilista profesional en rizos.",
      icon: GraduationCap
    },
    {
      title: "Estilistas",
      description: "Ya eres estilista pero buscas especializarte en corte para cabello ondulado, rizado y afro.",
      icon: Scissors
    },
    {
      title: "Emprendedores",
      description: "Quieres emprender o emplearte en el sector capilar con conocimientos que te permitan diferenciarte.",
      icon: Target
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/img/mentoria/mentoriaheader.jpeg"
            alt="Training Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary font-semibold text-sm tracking-wider uppercase mb-6 border border-secondary/50">
              Método Ema Rizos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Formación Profesional en Cabello Rizado
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Empieza a construir tu camino como profesional en rizos
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Si este año tu objetivo es emprender, especializarte y convertir el cabello rizado en tu oportunidad profesional, esta formación fue creada para ti.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-foreground/80 leading-relaxed mb-12">
              La Formación Profesional en Cabello Rizado – Método Ema Rizos es una experiencia presencial diseñada para personas que desean comenzar desde cero en el mundo de los rizos o dejar de trabajar desde la improvisación y formarse con bases reales, técnicas y seguras.
            </p>
          </div>

          {/* Target Audience Cards */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-10">¿Para quién es esta formación?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {targetAudience.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                        <Icon className="size-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-12 bg-secondary/10 rounded-2xl p-8 max-w-3xl mx-auto text-center border border-secondary/20">
              <Sparkles className="size-8 text-secondary mx-auto mb-4" />
              <p className="text-lg font-medium text-primary">
                No necesitas experiencia previa.<br/>
                <span className="text-muted-foreground font-normal mt-2 block">
                  Sí necesitas disposición para aprender, practicar y tomarte este camino en serio.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Method Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src="/img/mentoria/mentoria1.jpg"
                alt="Ema Rizos Method"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">¿Por qué nace el Método Ema Rizos?</h2>
              <div className="space-y-6 text-lg text-foreground/80">
                <p>
                  Durante años, en el trabajo diario de salón, se repite el mismo patrón:
                </p>
                <blockquote className="border-l-4 border-secondary pl-6 italic font-medium text-primary/80">
                  "Cabellos rizados mal diagnosticados. Productos mal elegidos. Técnicas que no respetan la textura natural del rizo."
                </blockquote>
                <p>
                  El problema no es la falta de talento. <strong className="text-primary">Es la falta de formación especializada.</strong>
                </p>
                <p>
                  El Método Ema Rizos nace de la experiencia real, de errores, aprendizajes y resultados comprobados, con el objetivo de formar profesionales capaces de trabajar el cabello rizado con criterio, respeto y seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Contenido de la formación</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Durante la formación aprenderás a trabajar el cabello afro-rizado desde la base, luego profundizaremos en técnicas corte básico, cuidados y técnicas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* List */}
            <div className="lg:col-span-7">
              <h3 className="text-2xl font-semibold text-primary mb-8 flex items-center gap-3">
                <BookOpen className="text-secondary" />
                Aprenderás a:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {contentModules.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:border-secondary/30 transition-colors">
                    <CheckCircle2 className="size-6 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 bg-primary text-white rounded-xl flex items-center gap-4">
                <Users className="size-8 text-secondary shrink-0" />
                <p className="text-lg font-medium">
                  La formación incluye práctica teórico demostrativo con <span className="text-secondary">modelos reales</span>.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-8">
                <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] relative">
                  <img
                    src="/img/mentoria/mentoria3.jpg"
                    alt="Training Content"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-8">
                    <p className="text-white text-xl font-bold">Inicia tu camino profesional hoy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Estás lista para transformar tu carrera?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Reserva tu cupo en nuestra próxima formación y comienza a construir tu futuro como especialista en rizos.
          </p>
          <a href="https://wa.me/message/XXXXXX" target="_blank" rel="noopener noreferrer">
            <button className="bg-secondary text-primary font-bold text-lg py-4 px-10 rounded-full hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Inscribirme a la Formación
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}