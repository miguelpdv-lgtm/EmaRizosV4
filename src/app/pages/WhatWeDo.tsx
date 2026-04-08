import { Scissors, ShoppingBag, BookOpen, GraduationCap } from "lucide-react";

export function WhatWeDo() {
  return (
    <div className="py-16 bg-background min-h-[calc(100vh-140px)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Qué Hacemos</h1>
          <p className="text-xl text-foreground/80 leading-relaxed">
            Ofrecemos un enfoque integral para el cuidado de tus rizos, abarcando desde el salón hasta tu rutina diaria en casa.
          </p>
        </div>

        {/* Servicios y Enfoques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
          {/* Card 1 */}
          <div className="flex flex-col sm:flex-row gap-6 bg-card p-6 rounded-2xl shadow-sm border border-border items-start hover:shadow-md transition-shadow">
            <div className="bg-secondary p-4 rounded-xl shrink-0">
              <Scissors className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Servicios de Salón Especializados</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nuestras estilistas son expertas en corte en seco para rizos, técnicas de definición "Plopping", hidratación profunda y transiciones capilares (Big Chop). Cada servicio comienza con un diagnóstico capilar exhaustivo.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col sm:flex-row gap-6 bg-card p-6 rounded-2xl shadow-sm border border-border items-start hover:shadow-md transition-shadow">
            <div className="bg-secondary p-4 rounded-xl shrink-0">
              <ShoppingBag className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Productos Libres de Tóxicos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comercializamos y desarrollamos productos aptos para el "Curly Girl Method" (Libres de sulfatos fuertes, siliconas y parabenos). Todo lo que necesitas: co-wash, leave-in, geles y aceites botánicos puros.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col sm:flex-row gap-6 bg-card p-6 rounded-2xl shadow-sm border border-border items-start hover:shadow-md transition-shadow">
            <div className="bg-secondary p-4 rounded-xl shrink-0">
              <GraduationCap className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Asesoría Personalizada</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada rizo es un mundo diferente. Te acompañamos a entender tu porosidad, densidad y tipo de rizo para armar tu rutina ideal. Ofrecemos tests interactivos y consultas para guiarte.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col sm:flex-row gap-6 bg-card p-6 rounded-2xl shadow-sm border border-border items-start hover:shadow-md transition-shadow">
            <div className="bg-secondary p-4 rounded-xl shrink-0">
              <BookOpen className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Educación Continua</h3>
              <p className="text-muted-foreground leading-relaxed">
                Creemos que el mejor aliado para un cabello hermoso es el conocimiento. A través de nuestra sección educativa y nuestro salón, enseñamos técnicas de cuidado que te empoderan para mantener resultados de salón en casa.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
