import { useEffect, useState, useRef, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { MapPin, User, ShoppingBag } from "lucide-react";

// ─── Tipos Bold (window global) ────────────────────────────────────────────────
declare global {
  interface Window {
    BoldCheckout: new (config: BoldCheckoutConfig) => { open: () => void };
  }
}
interface BoldCheckoutConfig {
  orderId: string;
  currency: string;
  amount: string;
  apiKey: string;
  integritySignature: string;
  description: string;
  redirectionUrl: string;
  renderMode?: string;
  customerData?: string;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const BOLD_API_KEY = import.meta.env.VITE_BOLD_API_KEY as string;
// La firma de integridad debe generarse en el backend para producción.
// En desarrollo se lee desde la variable de entorno.
const BOLD_INTEGRITY_SECRET = import.meta.env.VITE_BOLD_INTEGRITY_SECRET as string;

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

// ─── Zonas de envío por barrio (Barranquilla) ──────────────────────────────────
// Zona 1 = cerca (Norte/Centro): $4.000
// Zona 2 = media (Sur/Occidente): $6.000
// Zona 3 = alejada (Soledad, Malambo, afueras): $9.000

const BARRIOS_BARRANQUILLA: { label: string; zona: 1 | 2 | 3 }[] = [
  // Zona 1 — Norte y Centro
  { label: "El Prado", zona: 1 },
  { label: "Altos del Prado", zona: 1 },
  { label: "Ciudad Jardín", zona: 1 },
  { label: "Manga", zona: 1 },
  { label: "Riomar", zona: 1 },
  { label: "Los Alpes", zona: 1 },
  { label: "Villa Country", zona: 1 },
  { label: "El Golf", zona: 1 },
  { label: "Buenavista", zona: 1 },
  { label: "La Cumbre", zona: 1 },
  { label: "Recreo", zona: 1 },
  { label: "Alto Prado", zona: 1 },
  { label: "Granadillo", zona: 1 },
  { label: "La Floresta", zona: 1 },
  { label: "Miramar", zona: 1 },
  { label: "Los Nogales", zona: 1 },
  { label: "Barranquillita", zona: 1 },
  { label: "El Centro", zona: 1 },
  { label: "San Isidro", zona: 1 },
  { label: "Boston", zona: 1 },
  { label: "Bellavista", zona: 1 },
  { label: "La Victoria", zona: 1 },
  { label: "Paraíso", zona: 1 },
  { label: "Las Delicias", zona: 1 },
  { label: "El Tabor", zona: 1 },
  { label: "La Luz", zona: 1 },
  // Zona 2 — Suroccidente y otras zonas
  { label: "Simón Bolívar", zona: 2 },
  { label: "El Silencio", zona: 2 },
  { label: "Villate", zona: 2 },
  { label: "Rebolo", zona: 2 },
  { label: "San Roque", zona: 2 },
  { label: "La Chinita", zona: 2 },
  { label: "Ciudadela 20 de Julio", zona: 2 },
  { label: "Los Pinos", zona: 2 },
  { label: "La Magdalena", zona: 2 },
  { label: "Santo Domingo de Guzmán", zona: 2 },
  { label: "Lipaya", zona: 2 },
  { label: "Cuchilla de Villate", zona: 2 },
  { label: "El Valle", zona: 2 },
  { label: "Los Olivos", zona: 2 },
  { label: "El Bosque", zona: 2 },
  { label: "Nuevo Horizonte", zona: 2 },
  { label: "San José", zona: 2 },
  { label: "Las Malvinas", zona: 2 },
  { label: "La Ceiba", zona: 2 },
  { label: "Me Quejo", zona: 2 },
  { label: "El Ferry", zona: 2 },
  // Zona 3 — Soledad, Malambo y periferias
  { label: "Soledad (centro)", zona: 3 },
  { label: "Soledad 2000", zona: 3 },
  { label: "La Paz (Soledad)", zona: 3 },
  { label: "Malambo", zona: 3 },
  { label: "Puerto Colombia", zona: 3 },
  { label: "Galapa", zona: 3 },
  { label: "Juan Mina", zona: 3 },
];

const SHIPPING_BY_ZONE: Record<1 | 2 | 3, number> = {
  1: 4000,
  2: 6000,
  3: 9000,
};

const ZONE_LABEL: Record<1 | 2 | 3, string> = {
  1: "Zona Norte / Centro",
  2: "Zona Sur / Occidente",
  3: "Zona Periférica / Municipios",
};

// ─── Generador de firma SHA-256 (solo para desarrollo) ─────────────────────────
async function generateIntegrityHash(
  orderId: string,
  amount: number,
  currency: string,
  secret: string
): Promise<string> {
  const message = `${orderId}${amount}${currency}${secret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Componente ────────────────────────────────────────────────────────────────

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    barrio: "",
  });
  const [boldReady, setBoldReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const boldInstanceRef = useRef<{ open: () => void } | null>(null);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items.length, navigate]);

  // Cargar script de Bold
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.bold.co/library/boldPaymentButton.js"]')) {
      setBoldReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
    script.onload = () => setBoldReady(true);
    script.onerror = () => toast.error("No se pudo cargar el módulo de pagos.");
    document.head.appendChild(script);
  }, []);

  if (items.length === 0) return null;

  const hasProducts = items.some((i) => i.type === "product");

  const selectedBarrio = BARRIOS_BARRANQUILLA.find((b) => b.label === form.barrio);
  const zona = selectedBarrio?.zona ?? null;
  const shippingCost = hasProducts && zona ? SHIPPING_BY_ZONE[zona] : 0;
  const total = totalPrice + shippingCost;

  const isFormValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.barrio;

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    if (!boldReady) {
      toast.error("El módulo de pagos aún no ha cargado. Espera un momento.");
      return;
    }

    setProcessing(true);

    try {
      const orderId = `EMAR-${Date.now()}`;
      const currency = "COP";
      const description = `Pedido Ema Rizos — ${items.length} item(s) — ${form.barrio}`;
      const integrityHash = await generateIntegrityHash(orderId, total, currency, BOLD_INTEGRITY_SECRET);

      boldInstanceRef.current = new window.BoldCheckout({
        orderId,
        currency,
        amount: String(total),
        apiKey: BOLD_API_KEY,
        integritySignature: integrityHash,
        description,
        redirectionUrl: `${window.location.origin}/order-confirmation`,
        renderMode: "embedded",
        customerData: JSON.stringify({
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
          dialCode: "+57",
        }),
      });

      boldInstanceRef.current.open();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al iniciar el pago. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Finalizar pedido</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">

              {/* Datos personales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="size-4" /> Datos de contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="María García"
                      value={form.fullName}
                      onChange={handleField}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={form.email}
                        onChange={handleField}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="300 000 0000"
                        value={form.phone}
                        onChange={handleField}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dirección y barrio */}
              {hasProducts && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="size-4" /> Dirección de entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="barrio">Barrio en Barranquilla</Label>
                      <select
                        id="barrio"
                        name="barrio"
                        value={form.barrio}
                        onChange={handleField}
                        required
                        className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Selecciona tu barrio</option>
                        {[1, 2, 3].map((z) => (
                          <optgroup key={z} label={`${ZONE_LABEL[z as 1|2|3]} — Envío ${formatCOP(SHIPPING_BY_ZONE[z as 1|2|3])}`}>
                            {BARRIOS_BARRANQUILLA.filter((b) => b.zona === z).map((b) => (
                              <option key={b.label} value={b.label}>{b.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {zona && (
                        <p className="text-xs text-primary mt-1.5 font-medium">
                          Costo de envío para {ZONE_LABEL[zona]}: {formatCOP(SHIPPING_BY_ZONE[zona])}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección exacta</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Calle 72 # 54 - 12, Apto 301"
                        value={form.address}
                        onChange={handleField}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingBag className="size-4" /> Tu pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[170px]">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="ml-1 text-xs">×{item.quantity}</span>
                        )}
                      </span>
                      <span className="font-medium shrink-0">
                        {formatCOP(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCOP(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>
                        {zona
                          ? formatCOP(shippingCost)
                          : <span className="text-muted-foreground italic">Selecciona barrio</span>}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatCOP(total)}</span>
                  </div>

                  {/* Botón de pago Bold */}
                  <Button
                    type="submit"
                    className="w-full bg-primary text-white rounded-full py-5 font-semibold mt-2"
                    disabled={!isFormValid || !boldReady || processing}
                  >
                    {processing
                      ? "Preparando pago..."
                      : !boldReady
                      ? "Cargando pasarela..."
                      : "Pagar con Bold"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Tarjeta, PSE, Nequi y Bancolombia — procesado por Bold
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}