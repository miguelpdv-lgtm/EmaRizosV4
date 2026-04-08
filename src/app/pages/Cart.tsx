import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, ShoppingBag, MapPin } from "lucide-react";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="size-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos o servicios para comenzar.
        </p>
        <Link to="/products">
          <Button className="bg-primary text-white rounded-full px-8">
            Ver productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Tu carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
                <CardContent className="p-4 flex gap-4 items-start">
                  {item.image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "img/logo.png";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase mb-0.5">
                      {item.type === "product" ? "Producto" : "Servicio"}
                    </p>
                    <h3 className="font-semibold text-base leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold mt-1">
                      {formatCOP(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    {item.type === "product" && (
                      <div className="flex items-center gap-2 border rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                          className="size-6 flex items-center justify-center text-lg leading-none text-muted-foreground hover:text-primary transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                          className="size-6 flex items-center justify-center text-lg leading-none text-muted-foreground hover:text-primary transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold">Resumen del pedido</h2>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCOP(totalPrice)}</span>
                </div>

                {/* Envío: se calcula en el checkout por barrio */}
                <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-primary/80">
                  <MapPin className="size-4 shrink-0 mt-0.5" />
                  <span>
                    El costo de envío se calcula en el siguiente paso según
                    tu barrio en Barranquilla.
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total (sin envío)</span>
                  <span className="text-primary">{formatCOP(totalPrice)}</span>
                </div>

                <Link to="/checkout" className="block">
                  <Button className="w-full bg-primary text-white rounded-full py-5 font-semibold">
                    Proceder al pago
                  </Button>
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Seguir comprando
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}