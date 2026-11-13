import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { IoLogoWhatsapp } from "react-icons/io5";
import { MapPin, User, ShoppingBag, Tag, Truck } from "lucide-react";

// Número de WhatsApp de Ema Rizos (formato internacional, sin +)
const WHATSAPP_NUMBER = "573007633755";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(v);

// Ciudades con cobertura de envío
const CIUDADES = ["Barranquilla", "Soledad", "Puerto Colombia", "Malambo"];

function validateAddress(address: string): { valid: boolean; error?: string } {
  const trimmed = address.trim();
  if (trimmed.length < 8) {
    return {
      valid: false,
      error: "Escribe la dirección completa (calle/carrera y número).",
    };
  }
  if (!/\d/.test(trimmed)) {
    return {
      valid: false,
      error: "La dirección debe incluir al menos un número (ej: Cra 53 # 79-04).",
    };
  }
  return { valid: true };
}

function validatePhone(phone: string): { valid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return { valid: false, error: "El teléfono debe tener 10 dígitos." };
  }
  if (!digits.startsWith("3")) {
    return { valid: false, error: "El número debe empezar con 3 (celular colombiano)." };
  }
  return { valid: true };
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    ciudad: "Barranquilla",
    barrio: "",
    address: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !sent) navigate("/cart");
  }, [items.length, navigate, sent]);

  if (items.length === 0) return null;

  const hasProducts = items.some((i) => i.type === "product");

  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      errors.fullName = "Escribe tu nombre completo.";
    }

    const phoneCheck = validatePhone(form.phone);
    if (!phoneCheck.valid) errors.phone = phoneCheck.error!;

    if (hasProducts) {
      if (!CIUDADES.includes(form.ciudad)) {
        errors.ciudad = "Selecciona tu ciudad.";
      }
      if (form.barrio.trim().length < 3) {
        errors.barrio = "Escribe tu barrio.";
      }
      const addrCheck = validateAddress(form.address);
      if (!addrCheck.valid) errors.address = addrCheck.error!;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push("¡Hola Ema Rizos! 👋 Quiero hacer este pedido:");
    lines.push("");
    items.forEach((item) => {
      lines.push(
        `• ${item.quantity} x ${item.name} — ${formatCOP(item.price * item.quantity)}`
      );
    });
    lines.push("");
    lines.push(`*Subtotal:* ${formatCOP(totalPrice)}`);
    if (hasProducts) lines.push("*Envío:* por confirmar");
    lines.push("");
    lines.push("*Mis datos:*");
    lines.push(`Nombre: ${form.fullName.trim()}`);
    lines.push(`Teléfono: ${form.phone.trim()}`);
    if (hasProducts) {
      lines.push(`Ciudad: ${form.ciudad} (Atlántico)`);
      lines.push(`Barrio: ${form.barrio.trim()}`);
      lines.push(`Dirección: ${form.address.trim()}`);
    }
    if (form.notes.trim()) {
      lines.push(`Notas: ${form.notes.trim()}`);
    }
    lines.push("");
    lines.push("Quedo atenta a la confirmación del envío y el total. ¡Gracias!");
    return lines.join("\n");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Corrige los errores del formulario antes de continuar.");
      return;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    const win = window.open(url, "_blank");
    if (!win) window.location.href = url;

    setSent(true);
    clearCart();
    navigate("/order-confirmation", { state: { waUrl: url } });
  };

  const errorClass = (field: string) =>
    fieldErrors[field] ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6 flex items-center gap-2">
        <ShoppingBag className="size-6" /> Finalizar pedido
      </h1>

      {hasProducts && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Truck className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Envíos solo en Barranquilla y su área metropolitana
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Hacemos domicilios en{" "}
              <strong>Barranquilla, Soledad, Puerto Colombia y Malambo</strong>.
              El valor del envío y el pago te los confirmamos por WhatsApp.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Columna izquierda: formulario ── */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4" /> Datos de contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label htmlFor="fullName" className="mb-1.5 block text-sm">
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleField}
                  placeholder="Tu nombre completo"
                  className={errorClass("fullName")}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 block text-sm">
                  Teléfono / WhatsApp
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleField}
                  placeholder="300 000 0000"
                  className={errorClass("phone")}
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {hasProducts && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-4" /> Dirección de entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="ciudad" className="mb-1.5 block text-sm">
                    ¿En qué ciudad vives?
                  </Label>
                  <select
                    id="ciudad"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleField}
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      fieldErrors.ciudad ? "border-red-500" : "border-input"
                    }`}
                  >
                    {CIUDADES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.ciudad && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.ciudad}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="barrio" className="mb-1.5 block text-sm">
                    Barrio
                  </Label>
                  <Input
                    id="barrio"
                    name="barrio"
                    value={form.barrio}
                    onChange={handleField}
                    placeholder="Ej: El Prado"
                    className={errorClass("barrio")}
                  />
                  {fieldErrors.barrio && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.barrio}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address" className="mb-1.5 block text-sm">
                    Dirección exacta
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleField}
                    placeholder="Ej: Cra 53 # 79-04, apto 301"
                    className={errorClass("address")}
                  />
                  {fieldErrors.address ? (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.address}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Incluye calle/carrera, número, apto/piso.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="notes" className="mb-1.5 block text-sm">
                Notas (opcional)
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleField}
                placeholder="Punto de referencia, horario de entrega, etc."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Columna derecha: resumen ── */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="size-4" /> Tu pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {items.map((item) => {
                const hasDiscount = !!item.originalPrice && item.originalPrice > item.price;
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground leading-tight line-clamp-2">
                        {item.name}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {hasDiscount && (
                        <p className="text-xs line-through text-muted-foreground">
                          {formatCOP(item.originalPrice! * item.quantity)}
                        </p>
                      )}
                      <p
                        className={`font-semibold ${
                          hasDiscount ? "text-red-600" : "text-foreground"
                        }`}
                      >
                        {formatCOP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-border my-1" />

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-red-600 font-medium bg-red-50 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-1.5">
                    <Tag className="size-3.5" /> Ahorro
                  </span>
                  <span>- {formatCOP(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCOP(totalPrice)}</span>
              </div>

              {hasProducts && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Envío
                  </span>
                  <span className="text-xs italic">Se confirma por WhatsApp</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg text-primary border-t border-border pt-2 mt-1">
                <span>Total productos</span>
                <span>{formatCOP(totalPrice)}</span>
              </div>

              <Button
                type="submit"
                className="w-full mt-1 rounded-xl py-5 text-base font-semibold bg-[#25D366] hover:bg-[#1ebe5b] text-white"
              >
                <IoLogoWhatsapp className="size-5 mr-2" />
                Enviar pedido por WhatsApp
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-1">
                Te abriremos WhatsApp con tu pedido listo para enviar. Allí te
                confirmamos el envío y la forma de pago.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
