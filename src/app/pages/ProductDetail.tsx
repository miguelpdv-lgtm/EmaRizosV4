import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { Check, ShoppingCart, ArrowLeft, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  fetchProductById,
  productImage,
  type ProductWithExtras,
  getProductDescription,
} from "../data/products";

type ProductUI = {
  id: number;
  name: string;
  category: string;
  brand: string;
  format: string;
  price: number;
  originalPrice?: number;   // ✅ precio sin descuento
  discountPct?: number;     // ✅ porcentaje de descuento
  image: string;
  description: string;
  inStock: boolean;
  stock: number;
};

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Producto no encontrado.");
      return;
    }
    loadProduct(Number(id));
  }, [id]);

  async function loadProduct(productId: number) {
    setLoading(true);
    setError("");
    setQuantity(1);

    try {
      const item = await fetchProductById(productId);

      if (!item) {
        setError("Producto no encontrado.");
        return;
      }

      const productData = item as ProductWithExtras;

      // ✅ Calcular precio final con descuento
      const hasDiscount = item.discount_active && item.discount_pct > 0;
      const finalPrice = hasDiscount
        ? Math.round(item.precio * (1 - item.discount_pct / 100))
        : item.precio;

      setProduct({
        id: item.id,
        name: item.display_name,
        category: item.categoria ?? "Sin categoría",
        brand: item.marca ?? "",
        format: item.formato ?? "",
        price: finalPrice,
        originalPrice: hasDiscount ? item.precio : undefined,
        discountPct: hasDiscount ? item.discount_pct : undefined,
        image: productImage(item),
        description: getProductDescription(productData),
        stock: item.stock,
        inStock: item.stock > 0,
      });
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el producto.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice, // ✅ pasa el precio original
        image: product.image,
        type: "product",
      });
    }

    toast.success(`${quantity} × ${product.name} agregado al carrito`);
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-primary mb-2">Producto No Encontrado</h2>
        <p className="text-muted-foreground mb-6">
          {error || "No se encontró el producto solicitado."}
        </p>
        <Link to="/products">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Volver a Productos
          </Button>
        </Link>
      </div>
    );
  }

  // ── Vista principal ──────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">

      {/* Breadcrumb */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        Volver a Productos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* ── Imagen ────────────────────────────────────────────────── */}
        <Card className="overflow-hidden border-border/50">
          <div className="relative aspect-square bg-muted">
            {/* Badge descuento sobre la imagen */}
            {product.discountPct && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <Tag className="size-3" />
                -{product.discountPct}% OFF
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/img/logo.webp";
              }}
            />
          </div>
        </Card>

        {/* ── Info ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Categoría */}
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {product.category}
          </span>

          {/* Nombre */}
          <h1 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
            {product.name}
          </h1>

          {/* Marca · Formato */}
          <p className="text-sm text-muted-foreground">
            {[product.brand, product.format].filter(Boolean).join(" · ")}
          </p>

          {/* Precio */}
          <div className="flex items-end gap-3 flex-wrap">
            {product.originalPrice ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-red-600">
                  ${product.price.toLocaleString("es-CO")}
                </span>
                <span className="text-base line-through text-muted-foreground mb-0.5">
                  ${product.originalPrice.toLocaleString("es-CO")}
                </span>
                <span className="text-sm font-semibold text-red-600 bg-red-50 rounded-full px-2.5 py-0.5">
                  Ahorras ${(product.originalPrice - product.price).toLocaleString("es-CO")}
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-primary">
                ${product.price.toLocaleString("es-CO")}
              </span>
            )}
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">Descripción</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cantidad */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Cantidad</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock || quantity <= 1}
                  className="px-4 py-2 text-muted-foreground hover:bg-muted transition-colors text-lg leading-none disabled:opacity-40"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-border min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={!product.inStock || quantity >= product.stock}
                  className="px-4 py-2 text-muted-foreground hover:bg-muted transition-colors text-lg leading-none disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {product.stock} disponibles
              </span>
            </div>
          </div>

          {/* Botón agregar */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            size="lg"
            className="w-full rounded-xl py-6 text-base font-semibold mt-2"
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="size-5 mr-2" />
                Agregar al Carrito
              </>
            ) : (
              "Agotado"
            )}
          </Button>

          {/* Estado stock */}
          {product.inStock ? (
            <p className="flex items-center gap-1.5 text-xs text-green-600">
              <Check className="size-3.5" />
              En stock · {product.stock} unidades disponibles
            </p>
          ) : (
            <p className="text-xs text-red-500">Actualmente agotado</p>
          )}
        </div>
      </div>
    </div>
  );
}