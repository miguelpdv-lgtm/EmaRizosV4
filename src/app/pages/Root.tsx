import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { prefetchCatalog } from "../lib/api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartProvider } from "../context/CartContext";

export function Root() {
  // Empieza a descargar el catálogo apenas abre la web (lo comparten todas las páginas)
  useEffect(() => { prefetchCatalog(); }, []);

  return (
    <CartProvider>
      <ScrollRestoration />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
