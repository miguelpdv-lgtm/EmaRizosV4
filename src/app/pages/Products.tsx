import { useState } from "react";
import { Link } from "react-router";
import { products, Product } from "../data/products";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Star, Sparkles, ArrowRight } from "lucide-react";

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Todos los Productos" },
    { id: "shampoo", label: "Shampoo" },
    { id: "conditioner", label: "Acondicionador" },
    { id: "styling", label: "Peinado" },
    { id: "treatment", label: "Tratamiento" },
    { id: "tools", label: "Herramientas" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header with Test Banner */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl mb-4 font-bold text-primary">Nuestros Productos</h1>
              <p className="text-muted-foreground text-lg">
                Productos profesionales premium para resultados de salón en casa
              </p>
            </div>
          </div>
          
          {/* Routine Test Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 text-primary/10 rotate-12">
              <Sparkles className="size-40" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                <Sparkles className="size-6 text-primary" />
                ¿No sabes qué productos necesita tu cabello?
              </h2>
              <p className="text-foreground/80 text-lg">
                Descubre tu rutina perfecta en menos de 2 minutos. Responde unas sencillas preguntas sobre tu tipo de cabello y te recomendaremos los productos ideales para ti.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto shrink-0">
              <Link to="/test-rutina">
                <Button size="lg" className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 rounded-full font-semibold px-8 shadow-md group">
                  Hacer Test de Rutina
                  <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground uppercase mb-1">
                    {product.category === 'shampoo' ? 'Shampoo' :
                     product.category === 'conditioner' ? 'Acondicionador' :
                     product.category === 'styling' ? 'Peinado' :
                     product.category === 'treatment' ? 'Tratamiento' :
                     'Herramientas'}
                  </div>
                  <h3 className="mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl">${product.price}</p>
                    {product.inStock ? (
                      <span className="text-xs text-green-600">En Stock</span>
                    ) : (
                      <span className="text-xs text-red-600">Agotado</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
