import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { CheckCircle, Mail, Package, ArrowRight } from "lucide-react";

export function OrderConfirmation() {
  return (
    <div className="py-20 bg-background min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-lg border border-border p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center size-20 bg-secondary/50 rounded-full mb-6">
            <CheckCircle className="size-10 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">¡Compra Confirmada!</h1>
          <p className="text-lg text-foreground/80 mb-8">
            Tu pedido ha sido procesado exitosamente y ya estamos trabajando en prepararlo.
          </p>
          
          <div className="bg-muted p-6 rounded-xl mb-8 flex flex-col items-center">
            <Mail className="size-8 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-foreground">Detalles enviados al correo</h3>
            <p className="text-muted-foreground">
              Hemos enviado tu recibo, los detalles de envío y un resumen de tu compra al correo electrónico que proporcionaste durante el pago.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Número de orden: <span className="font-bold text-primary">#EM-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                  <Package className="mr-2 size-4" />
                  Seguir Comprando
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-secondary">
                  Volver al Inicio
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
