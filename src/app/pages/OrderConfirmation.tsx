import { useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";

export function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const waUrl = (location.state as { waUrl?: string } | null)?.waUrl;

  return (
    <div className="py-20 md:py-24 bg-[#fafafa] min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <CheckCircle2 className="size-20 mx-auto mb-6 text-green-600" />

        <h1 className="text-3xl font-bold text-[#61180b] mb-4 tracking-tight">
          ¡Ya casi está!
        </h1>

        <div className="bg-white p-6 rounded-xl border border-[#e8d5d1] shadow-sm mb-8 text-[15px] leading-relaxed text-gray-700">
          <p>
            Abrimos WhatsApp con tu pedido. Solo toca <strong>Enviar</strong> en
            el chat y te confirmaremos el valor del envío, el total y la forma de
            pago.
          </p>
          {waUrl && (
            <p className="mt-3 text-sm text-gray-500">
              ¿No se abrió WhatsApp? Usa el botón de abajo.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <Button className="h-11 w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white">
                <IoLogoWhatsapp className="size-5 mr-2" /> Abrir WhatsApp
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            className="h-11 border-[#61180b] text-[#61180b] hover:bg-[#fdf5f3]"
            onClick={() => navigate("/products")}
          >
            Seguir comprando
          </Button>
        </div>
      </div>
    </div>
  );
}
