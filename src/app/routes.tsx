import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

// Inicio carga de inmediato; el resto de páginas se descarga solo cuando se visita.
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <NotFound />,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: "quienes-somos", lazy: async () => ({ Component: (await import("./pages/AboutUs")).AboutUs }) },
      { path: "servicios", lazy: async () => ({ Component: (await import("./pages/ServicesPage")).ServicesPage }) },
      { path: "products", lazy: async () => ({ Component: (await import("./pages/Products")).Products }) },
      { path: "products/:id", lazy: async () => ({ Component: (await import("./pages/ProductDetail")).ProductDetail }) },
      { path: "cart", lazy: async () => ({ Component: (await import("./pages/Cart")).Cart }) },
      { path: "checkout", lazy: async () => ({ Component: (await import("./pages/Checkout")).Checkout }) },
      { path: "order-confirmation", lazy: async () => ({ Component: (await import("./pages/OrderConfirmation")).OrderConfirmation }) },
      { path: "test-rutina", lazy: async () => ({ Component: (await import("./pages/RoutineTest")).default }) },
      { path: "educacion", lazy: async () => ({ Component: (await import("./pages/Education")).Education }) },
      { path: "-bb1mzxhb-admin-yuyh2mxw887128102910=+", lazy: async () => ({ Component: (await import("./pages/AdminPanel")).AdminPanel }) },
      { path: "*", Component: NotFound },
    ],
  },
]);
