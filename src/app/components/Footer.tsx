import { Link } from "react-router";
import { Facebook, Instagram, MapPin, Phone} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ImageWithFallback
                src="img/logo.png"
                alt="Ema Rizos Logo"
                className="h-10 w-auto object-contain rounded-md"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Productos para el cuidado del cabello y
              servicios profesionales de salón.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">
              Enlaces Rápidos
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Inicio
              </Link>
              
              <Link
                to="/products"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Productos
              </Link>

              <Link
                to="/educacion"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Mentoria
              </Link>
              <a
                href="https://emarizos.site.agendapro.com/co/sucursal/235348"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Agendar cita
              </a>
            </div>
          </div>

{/* Contact & Location */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">
              Contacto y Ubicación
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://maps.app.goo.gl/H1PxmhnRgZckabkn8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 shrink-0 text-primary mt-0.5 group-hover:-translate-y-1 transition-transform" />
                  <span className="leading-relaxed">
                    <strong>Ema Rizos Salón</strong><br/>
                    Barranquilla, Atlántico
                  </span>
                </div>
                <div className="relative w-full h-28 rounded-xl overflow-hidden border border-border shadow-sm group-hover:border-primary/50 transition-colors">
                  <img 
                    src="https://images.unsplash.com/photo-1617505907947-9cb31eb80183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc3RyZWV0JTIwbWFwJTIwZ3JhcGhpY3xlbnwxfHx8fDE3NzQ4OTg0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Mapa de la ubicación de Ema Rizos" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/95 backdrop-blur-md p-2 rounded-full shadow-md group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300">
                      <MapPin className="size-5 text-primary drop-shadow-sm" />
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=%2B573007633755&text=%C2%A1Hola%21+vi+tu+p%C3%A1gina+de+AgendaPro+y+me+gustar%C3%ADa+resolver+algunas+dudas&type=phone_number&app_absent=0"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone className="size-5 shrink-0 text-primary group-hover:rotate-12 transition-transform" />
                <span>WhatsApp Ema Rizos</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/emarizos/"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.facebook.com/erikaemarizos"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2026 Ema Rizos. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}