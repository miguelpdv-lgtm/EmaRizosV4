import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, ShoppingBag } from "lucide-react";

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-12">
            <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl mb-4">Tu Carrito está Vacío</h1>
            <p className="text-muted-foreground mb-6">
              Agrega algunos productos o reserva un servicio para comenzar
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/products">
                <Button>Ver Productos</Button>
              </Link>
              <a href="https://agendapro.com/ema-rizos" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">Agendar Cita</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="size-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 capitalize">
                        {item.type === 'product' ? 'Producto' : 'Servicio'}
                      </p>
                      <p className="text-lg">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      {item.type === "product" && (
                        <div className="flex items-center border rounded">
                          <button
                            className="px-3 py-1 hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x">{item.quantity}</span>
                          <button
                            className="px-3 py-1 hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                      {item.type === "service" && (
                        <div className="px-3 py-1">Cant: {item.quantity}</div>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="size-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl mb-6">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-600">
                      {totalPrice > 50 ? "GRATIS" : "$5.99"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          totalPrice +
                          (totalPrice > 50 ? 0 : 5.99) +
                          totalPrice * 0.08
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {totalPrice < 50 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
                  </p>
                )}

                <Link to="/checkout">
                  <Button size="lg" className="w-full mb-3">
                    Proceder al Pago
                  </Button>
                </Link>

                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
