import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { BookOpen, UserCheck, Calendar, Loader2 } from "lucide-react";
import { getProducts, productImage, type Product } from "../lib/api";
import { HeroCarousel } from "../components/HeroCarousel";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Catálogo destacado ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        setFeaturedProducts(await getProducts({ limit: 4 }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <HeroCarousel />

        {/* MÓVIL */}
        <div className="md:hidden absolute inset-0 z-10 flex flex-col px-5 pt-6 pb-6 bg-black/40">
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase drop-shadow-md mb-2">
              Barranquilla · Rizos · Afros
            </span>
            <h1 className="text-4xl font-script text-white mb-3 leading-tight drop-shadow-lg">
              Cada rizo es único como tú
            </h1>
            <p className="text-sm text-white/90 mb-5 max-w-xs drop-shadow-md">
              Productos especializados y consejos para mantener tu cabello natural, fuerte y radiante.
            </p>
            <div className="flex gap-3 flex-wrap mb-4">
              <Link to="/products">
                <Button size="sm" className="bg-white text-primary hover:bg-secondary hover:text-primary text-xs">
                  Ver Productos
                </Button>
              </Link>
              <a href="https://emarizos.site.agendapro.com/co/sucursal/235348" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-white text-primary hover:bg-secondary hover:text-primary text-xs">
                  Agendar Cita
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Especialistas en rizos", "Cuidado consciente"].map((text) => (
                <span key={text} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/30">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex absolute inset-0 z-10 items-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-12 lg:gap-20">
              <div className="text-white max-w-xl">
                <span className="text-sm font-bold tracking-[0.2em] text-secondary uppercase block drop-shadow-md mb-4">
                  Barranquilla · Rizos · Afros
                </span>
                <h1 className="text-5xl mb-6 font-script">Cada rizo es único como tú</h1>
                <p className="text-xl mb-8 opacity-90">
                  Descubre en Ema Rizos nuestra línea de productos especializados y los mejores consejos para mantener tu cabello natural, fuerte y radiante.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Link to="/products">
                    <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:text-primary">
                      Ver Productos
                    </Button>
                  </Link>
                  <a href="https://emarizos.site.agendapro.com/co/sucursal/235348" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:text-primary">
                      Agendar Cita
                    </Button>
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Especialistas en rizos", "Atención personalizada", "Cuidado consciente", "Confianza y esencia"].map((text) => (
                    <span key={text} className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/30">
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[100dvh] md:h-[720px]" />
      </section>

      {/* ── CATÁLOGO ────────────────────────────────────────────────── */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-semibold text-primary">Catálogo de Productos</h2>
            <Link to="/products">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-sm">
                Ver Todos
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Móvil: scroll horizontal */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {featuredProducts.map((product) => {
                  const precioFinal =
                    product.discount_active && product.discount_pct > 0
                      ? Math.round(product.precio * (1 - product.discount_pct / 100))
                      : null;
                  return (
                    <Link key={product.id} to={`/products/${product.id}`} className="shrink-0 w-[180px] snap-start">
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-white">
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={productImage(product)}
                            loading="lazy"
                            decoding="async"
                            alt={product.display_name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/img/logo.webp"; }}
                          />
                        </div>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground uppercase mb-1">{product.marca}</div>
                          <h3 className="mb-1 font-medium text-foreground text-sm leading-tight line-clamp-2">
                            {product.display_name}
                          </h3>
                          {precioFinal ? (
                            <>
                              <p className="text-xs line-through text-muted-foreground">
                                ${product.precio.toLocaleString("es-CO")}
                              </p>
                              <p className="text-base font-semibold text-red-600">
                                ${precioFinal.toLocaleString("es-CO")}
                              </p>
                            </>
                          ) : (
                            <p className="text-base font-semibold text-primary">
                              ${product.precio.toLocaleString("es-CO")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop: grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const precioFinal =
                    product.discount_active && product.discount_pct > 0
                      ? Math.round(product.precio * (1 - product.discount_pct / 100))
                      : null;
                  return (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-white">
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={productImage(product)}
                            loading="lazy"
                            decoding="async"
                            alt={product.display_name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/img/logo.webp"; }}
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground uppercase mb-1">
                            {product.categoria} · {product.marca}
                          </div>
                          <h3 className="mb-2 font-medium text-foreground">{product.display_name}</h3>
                          {precioFinal ? (
                            <>
                              <p className="text-sm line-through text-muted-foreground">
                                ${product.precio.toLocaleString("es-CO")}
                              </p>
                              <p className="text-xl font-semibold text-red-600">
                                ${precioFinal.toLocaleString("es-CO")}
                              </p>
                            </>
                          ) : (
                            <p className="text-xl font-semibold text-primary">
                              ${product.precio.toLocaleString("es-CO")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── TEST / CURSO ─────────────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:gap-12">
            <div className="bg-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <UserCheck className="size-7 md:size-12 mb-3 md:mb-6 text-secondary" />
              <h3 className="text-sm md:text-2xl font-semibold mb-2 md:mb-4 leading-tight">Encuentra tu Rutina Ideal</h3>
              <p className="hidden md:block mb-8 text-white/90 text-lg">
                Realiza nuestro test y obtén una recomendación personalizada.
              </p>
              <Link to="/test-rutina">
                <Button size="sm" className="bg-secondary text-primary hover:bg-white text-xs md:text-sm">
                  Hacer el test
                </Button>
              </Link>
            </div>
            <div className="bg-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <BookOpen className="size-7 md:size-12 mb-3 md:mb-6 text-secondary" />
              <h3 className="text-sm md:text-2xl font-semibold mb-2 md:mb-4 leading-tight">Curso para profesionales</h3>
              <p className="hidden md:block mb-8 text-white/90 text-lg">
                Formación práctica en cabello rizado.
              </p>
              <Link to="/educacion">
                <Button size="sm" className="bg-secondary text-primary hover:bg-white text-xs md:text-sm">
                  Más info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-20 bg-muted text-center">
        <div className="container mx-auto px-4">
          <Calendar className="size-10 md:size-16 mx-auto mb-4 md:mb-6 text-primary" />
          <h2 className="text-2xl md:text-4xl font-semibold mb-3 md:mb-4 text-primary">Visita nuestro Salón</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-foreground/80 max-w-2xl mx-auto">
            Reserva tu cita y dale a tus rizos el trato profesional que merecen.
          </p>
          <a href="https://emarizos.site.agendapro.com/co/sucursal/235348" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-6 md:px-8 py-4 md:py-6 text-sm md:text-base rounded-full">
              Agendar Cita
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}