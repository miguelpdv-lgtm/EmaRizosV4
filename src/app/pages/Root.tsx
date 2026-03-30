import { Outlet, ScrollRestoration } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartProvider } from "../context/CartContext";

export function Root() {
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
