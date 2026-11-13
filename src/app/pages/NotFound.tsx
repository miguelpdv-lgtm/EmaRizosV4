import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { AlertTriangle, Home, ShoppingBag } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="bg-white border border-[#e8d5d1] rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#efd3d0] px-8 py-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/80">
              <AlertTriangle className="size-10 text-[#61180b]" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#61180b]">
              Error 404
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#61180b]">
              Página no encontrada
            </h1>
            <p className="mt-3 text-sm text-[#6b4b46] max-w-md mx-auto">
              La página que intentas abrir no existe, fue movida o el enlace está incompleto.
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="rounded-xl border border-[#efd3d0] bg-[#fdf5f3] p-5 mb-6">
              <p className="text-sm text-[#5f4a46]">
                Puedes volver al inicio, explorar los productos o agendar tu cita desde las opciones de abajo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-[#61180b] hover:bg-[#4d1309] text-white"
                onClick={() => navigate("/")}
              >
                <Home className="size-4 mr-2" />
                Ir al inicio
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-[#61180b] text-[#61180b] hover:bg-[#fdf5f3]"
                onClick={() => navigate("/products")}
              >
                <ShoppingBag className="size-4 mr-2" />
                Ver productos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}