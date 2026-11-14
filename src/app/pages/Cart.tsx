import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, ShoppingBag, MapPin, Tag } from "lucide-react";

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-primary mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos o servicios para comenzar.
        </p>
        <Link to="/products">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Ver Productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">Tu Carrito</h1>

      <div className="flex flex-col gap-4 mb-6">
        {items.map((item) => {
          const hasDiscount = !!item.originalPrice && item.originalPrice > item.price;
          const discountPct = hasDiscount
            ? Math.round((1 - item.price / item.originalPrice!) * 100)
            : 0;

          return (
            <Card key={`${item.type}-${item.id}`} className="border-border/50">
              <CardContent className="p-4 flex gap-4 items-start">

                {/* Imagen */}
                {item.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/img/logo.webp";
                      }}
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.type === "product" ? "Producto" : "Servicio"}
                      </p>
                    </div>
                    {/* Badge descuento */}
                    {hasDiscount && (
                      <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                        <Tag className="size-3" />
                        -{discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {hasDiscount && (
                      <span className="text-xs line-through text-muted-foreground">
                        {formatCOP(item.originalPrice!)}
                      </span>
                    )}
                    <span className={`text-base font-semibold ${hasDiscount ? "text-red-600" : "text-primary"}`}>
                      {formatCOP(item.price)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-muted-foreground">
                        × {item.quantity} = {formatCOP(item.price * item.quantity)}
                      </span>
                    )}
                  </div>

                  {/* Cantidad + Eliminar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="px-3 py-1 text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-border min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="px-3 py-1 text-muted-foreground hover:bg-muted transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumen */}
      <Card className="border-border/50">
        <CardContent className="p-5 flex flex-col gap-3">

          {/* Ahorro total */}
          {totalSavings > 0 && (
            <div className="flex justify-between text-sm text-red-600 font-medium bg-red-50 rounded-lg px-3 py-2">
              <span className="flex items-center gap-1.5">
                <Tag className="size-3.5" /> Ahorro total
              </span>
              <span>- {formatCOP(totalSavings)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCOP(totalPrice)}</span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> Envío
            </span>
            <span className="text-xs italic">Se confirma por WhatsApp</span>
          </div>

          <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg text-primary">
            <span>Total productos</span>
            <span>{formatCOP(totalPrice)}</span>
          </div>

          <Link to="/checkout" className="w-full mt-1">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl py-5 text-base font-semibold">
              <ShoppingBag className="size-5 mr-2" /> Finalizar pedido
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}