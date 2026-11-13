import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Root } from "./pages/Root";
import { AboutUs } from "./pages/AboutUs";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import RoutineTest from "./pages/RoutineTest";
import { Education } from "./pages/Education";
import { AdminPanel } from "./pages/AdminPanel";
import { ServicesPage } from "./pages/ServicesPage.tsx";
import { NotFound } from "./pages/NotFound"; // 🔥 IMPORTA TU COMPONENTE AQUÍ

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <NotFound />, 
    children: [
      { index: true, Component: Home },
      { path: "quienes-somos", Component: AboutUs },
      { path: "servicios", Component: ServicesPage },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "order-confirmation", Component: OrderConfirmation },
      { path: "test-rutina", Component: RoutineTest },
      { path: "educacion", Component: Education },
      { path: "-bb1mzxhb-admin-yuyh2mxw887128102910=+", Component: AdminPanel },
      
      { path: "*", Component: NotFound }, 
    ],
  },
]);