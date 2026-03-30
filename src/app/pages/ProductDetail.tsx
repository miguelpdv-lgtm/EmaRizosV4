import { useState } from "react";
import { useParams, Link } from "react-router";
import { products } from "../data/products";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { Star, Check, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Producto No Encontrado</h1>
          <Link to="/products">
            <Button>Volver a Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: "product",
      });
    }
    toast.success(`${quantity} ${product.name} agregado al carrito`);
  };

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
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-muted-foreground uppercase mb-2">
              {product.category === 'shampoo' ? 'Shampoo' :
               product.category === 'conditioner' ? 'Acondicionador' :
               product.category === 'styling' ? 'Peinado' :
               product.category === 'treatment' ? 'Tratamiento' :
               'Herramientas'}
            </div>
            <h1 className="text-4xl mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
            </div>

            <p className="text-3xl mb-6">${product.price}</p>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Features */}
            {product.features && (
              <div className="mb-6">
                <h3 className="text-lg mb-3">Características Principales</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-5 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
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
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
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

            {/* Stock Status */}
            <div className="mt-6">
              {product.inStock ? (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <Check className="size-4" />
                  En stock y listo para enviar
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
