import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { Check, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchProductById } from "../data/products";

type ProductUI = {
  id: number;
  name: string;
  category: string;
  brand: string;
  format: string;
  price: number;
  description: string;
  image: string;
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
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  async function loadProduct(productId: number) {
    setLoading(true);
    setError("");

    try {
      const item = await fetchProductById(productId);

      if (!item) {
        setError("Producto no encontrado.");
        return;
      }

      const mappedProduct: ProductUI = {
        id: item.ID,
        name: item.Nombre ?? "Producto sin nombre",
        category: item["Categoría"] ?? "Sin categoría",
        brand: item.Marca ?? "",
        format: item.Formato ?? "",
        price: item["Precio venta externa"] ?? item["Precio venta interna"] ?? 0,
        description: item["Descripción"] ?? "Sin descripción disponible.",
        image: `/img/products/${item.ID}.png`,  
        stock: item["Stock Ema Rizos"] ?? 0,
        inStock:
          (item["Stock Ema Rizos"] ?? 0) > 0 &&
          item.Estado === "Activo",
      };

      setProduct(mappedProduct);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el producto.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
        type: "product",
      });
    }

    toast.success(`${quantity} × ${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Producto No Encontrado</h1>
          <p className="text-muted-foreground mb-6">
            {error || "No se encontró el producto solicitado."}
          </p>
          <Link to="/products">
            <Button>Volver a Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a Productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div>
            <Card className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/logo.png";
                }}
              />
            </Card>
          </div>

          {/* Info */}
          <div>
            <div className="text-sm text-muted-foreground uppercase mb-2">
              {product.category}
            </div>

            <h1 className="text-4xl mb-4">{product.name}</h1>

            <p className="text-sm text-muted-foreground mb-4">
              {product.brand}
              {product.format ? ` · ${product.format}` : ""}
            </p>

            <p className="text-3xl font-semibold mb-6">
              ${product.price.toLocaleString("es-CO")}
            </p>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Cantidad */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Cantidad</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button
                    className="px-4 py-2 hover:bg-muted"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    className="px-4 py-2 hover:bg-muted"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* Botón */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="size-5 mr-2" />
                {product.inStock ? "Agregar al Carrito" : "Agotado"}
              </Button>
            </div>

            <div className="mt-6">
              {product.inStock ? (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <Check className="size-4" />
                  En stock · {product.stock} unidades disponibles
                </p>
              ) : (
                <p className="text-sm text-red-600">Actualmente agotado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}