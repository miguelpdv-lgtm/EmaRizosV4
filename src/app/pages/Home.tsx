import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Star, ShoppingBag, BookOpen, UserCheck, Calendar } from "lucide-react";
import { products } from "../data/products";

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[800px] py-16 bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(123, 34, 64, 0.4), rgba(123, 34, 64, 0.7)), url('img/header.JPG')`,
        }}
      >
        <div className="container mx-auto px-4 w-full mt-10 md:mt-0">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
            <div className="text-white max-w-xl">
              {/* Added mini-title */}
              <div className="mb-4">
                <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-secondary uppercase block drop-shadow-md">
                  Barranquilla · Rizos & Afros
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl mb-6 font-bold">
                Cada rizo es único como tú
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Descubre en Ema Rizos nuestra línea de productos
                especializados y los mejores consejos para
                mantener tu cabello natural, fuerte y radiante.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Ver Productos
                  </Button>
                </Link>
                <a
                  href="https://emarizos.site.agendapro.com/co/sucursal/235348"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Agendar Cita
                  </Button>
                </a>
              </div>

              {/* Bubbles features moved below buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Especialistas en rizos",
                  "Atención personalizada",
                  "Cuidado consciente",
                  "Confianza y esencia",
                ].map((text) => (
                  <span
                    key={text}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/30"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Producto Estrella */}
            <div className="w-full max-w-sm shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Producto Estrella
                  </span>
                  <Star className="text-secondary size-5 fill-secondary" />
                </div>
                <Link
                  to={`/products/${featuredProducts[0].id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl overflow-hidden mb-4 relative aspect-square">
                    <img
                      src={featuredProducts[0].image}
                      alt={featuredProducts[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-1 group-hover:text-secondary transition-colors">
                    {featuredProducts[0].name}
                  </h3>
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">
                    {featuredProducts[0].description ||
                      "El cuidado perfecto para mantener tus rizos definidos, hidratados y llenos de vida."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ${featuredProducts[0].price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-white text-primary hover:bg-secondary hover:text-primary"
                    >
                      <ShoppingBag className="size-4 mr-2" />{" "}
                      Comprar
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-primary">Catálogo de Productos</h2>
            <Link to="/products">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Ver Todos</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-white">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 font-medium text-foreground">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                    </div>
                    <p className="text-xl font-semibold text-primary">${product.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Test de Rutina & Educacion */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <UserCheck className="size-12 mb-6 text-secondary" />
              <h3 className="text-2xl font-semibold mb-4 text-white">Encuentra tu Rutina Ideal</h3>
              <p className="mb-8 text-white/90 text-lg">
                ¿No sabes qué productos necesita tu cabello? Realiza nuestro test rápido y obtén una recomendación personalizada para tu rutina.
              </p>
              <Link to="/test-rutina">
                <Button className="bg-secondary text-primary hover:bg-white w-full sm:w-auto">
                  Hacer el test ahora
                </Button>
              </Link>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <BookOpen className="size-12 mb-6 text-secondary" />
              <h3 className="text-2xl font-semibold mb-4 text-white">Mentorías</h3>
              <p className="mb-8 text-white/90 text-lg">
                Empieza tu camino profesional en el cabello rizado con una formación presencial, práctica y especializada.
              </p>
              <Link to="/educacion">
                  <Button className="bg-secondary text-primary hover:bg-white w-full sm:w-auto">
                  Más sobre mentorías
                </Button>

              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Agendar Cita */}
      <section className="py-20 bg-muted text-center">
        <div className="container mx-auto px-4">
          <Calendar className="size-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-semibold mb-4 text-primary">Visita nuestro Salón</h2>
          <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
            Déjate consentir por expertas en cabello rizado. Reserva tu cita a través de AgendaPro y dale a tus rizos el trato profesional que merecen.
          </p>
          <a href="https://emarizos.site.agendapro.com/co/sucursal/235348" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 rounded-full">
              Agendar Cita en AgendaPro
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
