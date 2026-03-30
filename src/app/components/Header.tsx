import { Link } from "react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Header() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ImageWithFallback 
              src="img/logo.png"
              alt="Ema Rizos Logo"
              className="h-10 w-auto object-contain rounded-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/quienes-somos" className="text-sm font-medium hover:text-primary transition-colors">
              Quiénes somos
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Productos
            </Link>

            <Link to="/educacion" className="text-sm font-medium hover:text-primary transition-colors">
              Mentoria
            </Link>
            <a 
              href="https://emarizos.site.agendapro.com/co/sucursal/235348" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Agendar Cita
            </a>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="size-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full size-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/quienes-somos"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quiénes somos
              </Link>
              <Link
                to="/que-hacemos"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Qué hacemos
              </Link>
              <Link
                to="/products"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/test-rutina"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Test de Rutina
              </Link>
              <Link
                to="/educacion"
                className="hover:text-primary transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Educación
              </Link>
              <a
                href="https://agendapro.com/ema-rizos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-primary text-center py-2 rounded-md mx-2 hover:bg-primary/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agendar Cita
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}