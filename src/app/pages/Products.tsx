import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sparkles, ArrowRight, Loader2, Search, X } from "lucide-react";
import { fetchProducts, productImage, type ProductWithExtras } from "../data/products";

const CATEGORIES = [
  { id: "all",            label: "Todos" },
  { id: "Limpieza",       label: "Shampoo" },
  { id: "Acondionador",   label: "Acondicionador" },
  { id: "Mascarilla",     label: "Tratamientos" },
  { id: "Cremas",         label: "Cremas de peinar" },
  { id: "Fijacion",       label: "Geles · Fijación" },
  { id: "Aceites",        label: "Aceites · Serums" },
  { id: "Termoprotector", label: "Termoprotectores" },
  { id: "Tonico",         label: "Tónicos" },
  { id: "Cepillos",       label: "Cepillos" },
  { id: "Accesorios",     label: "Accesorios" },
];

// IDs de los scrunchies
const SCRUNCHIE_IDS = [899928, 801856, 899925];

// Categorías que no se muestran en el catálogo público
const HIDDEN_CATEGORIES = ["Uso del Salón"];

type ScrunchiVariant = { label: string; productId: number; precio: number; stock: number; image: string };

function getPrecioFinal(precio: number, discount_pct?: number, discount_active?: boolean) {
  if (discount_active && discount_pct && discount_pct > 0) {
    return Math.round(precio * (1 - discount_pct / 100));
  }
  return null;
}

function ScrunchiCard({ variants }: { variants: ScrunchiVariant[] }) {
  const [selected, setSelected] = useState<ScrunchiVariant>(variants[0]);
  return (
    <Link to={`/products/${selected.productId}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={selected.image}
            alt="Scrunchie"
            className="h-full w-full object-cover object-[50%_70%] transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/img/logo.png"; }}
          />
        </div>
        <CardContent className="flex flex-col p-2 md:p-4">
          <div className="mb-1 text-xs uppercase text-muted-foreground truncate">Accesorios · Otros</div>
          <h3 className="mb-2 text-xs md:text-sm font-medium leading-tight">Scrunchie</h3>
          <div className="mb-2 flex gap-1 flex-wrap" onClick={(e) => e.preventDefault()}>
            {variants.map((v) => (
              <button
                key={v.productId}
                onClick={(e) => { e.preventDefault(); setSelected(v); }}
                className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                  selected.productId === v.productId
                    ? "border-primary bg-primary text-white"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-1">
            <p className="text-sm md:text-xl font-semibold text-primary">
              ${selected.precio.toLocaleString("es-CO")}
            </p>
            <span className={`text-xs shrink-0 ${selected.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {selected.stock > 0 ? "En Stock" : "Agotado"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data as ProductWithExtras[]);
      } catch (e) {
        setError("No se pudieron cargar los productos. Intenta de nuevo.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const { filteredProducts, scrunchiVariants } = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // Variantes del scrunchie
    const scrunchiProducts = products.filter((p) => SCRUNCHIE_IDS.includes(p.id));
    const variants: ScrunchiVariant[] = scrunchiProducts
      .sort((a, b) => a.precio - b.precio)
      .map((p) => ({
        label:
          p.display_name.replace(/Scrunchii?/i, "").trim() ||
          ["Pequeña", "Mediana", "Grande"][SCRUNCHIE_IDS.indexOf(p.id)] ||
          p.display_name,
        productId: p.id,
        precio: p.precio,
        stock: p.stock,
        image: productImage(p),
      }));

    // Productos normales: sin scrunchies y sin categorías ocultas
    const filtered = products.filter((product) => {
      if (SCRUNCHIE_IDS.includes(product.id)) return false;
      if (HIDDEN_CATEGORIES.includes(product.categoria ?? "")) return false;

      const matchesCategory =
        selectedCategory === "all" || product.categoria === selectedCategory;

      const searchableText = [product.display_name, product.categoria, product.marca, product.formato]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !term || searchableText.includes(term);

      return matchesCategory && matchesSearch;
    });

    const showScrunchie =
      (selectedCategory === "all" || selectedCategory === "Accesorios") &&
      (!term || "scrunchie".includes(term) || "accesorios".includes(term)) &&
      variants.length > 0;

    return {
      filteredProducts: filtered,
      scrunchiVariants: showScrunchie ? variants : [],
    };
  }, [products, selectedCategory, searchTerm]);

  const totalCount = filteredProducts.length + (scrunchiVariants.length > 0 ? 1 : 0);
  const hasResults = scrunchiVariants.length > 0 || filteredProducts.length > 0;

  return (
    <div className="py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-6 md:mb-12">
          <div className="mb-4 md:mb-8">
            <h1 className="mb-2 text-2xl md:text-4xl font-bold text-primary">Nuestros Productos</h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Productos profesionales premium para resultados de salón en casa
            </p>
          </div>

          {/* Banner test rutina */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-8">
            <div className="absolute -right-10 -top-10 rotate-12 text-primary/10">
              <Sparkles className="size-28 md:size-40" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
              <div className="max-w-2xl">
                <h2 className="mb-1 md:mb-2 flex items-center gap-2 text-base md:text-2xl font-bold text-primary">
                  <Sparkles className="size-4 md:size-6 text-primary shrink-0" />
                  ¿No sabes qué productos necesita tu cabello?
                </h2>
                <p className="text-sm md:text-lg text-foreground/80 hidden md:block">
                  Descubre tu rutina perfecta en menos de 2 minutos. Responde unas sencillas preguntas sobre tu tipo de cabello y te recomendaremos los productos ideales para ti.
                </p>
              </div>
              <div className="relative z-10 w-full md:w-auto shrink-0">
                <Link to="/test-rutina">
                  <Button size="sm" className="group w-full md:w-auto rounded-full bg-primary px-6 md:px-8 font-semibold text-white shadow-md hover:bg-primary/90 text-sm md:text-base">
                    Hacer Test <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-4 md:mb-6">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="h-10 md:h-12 w-full rounded-full border border-border bg-background pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full shrink-0 text-xs md:text-sm px-3 md:px-4 h-8 md:h-10"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Contador */}
        {!loading && !error && (
          <div className="mb-4 md:mb-8 text-xs md:text-sm text-muted-foreground">
            {totalCount} producto{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && hasResults && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {filteredProducts.map((product) => {
              const precioFinal = getPrecioFinal(product.precio, product.discount_pct, product.discount_active);
              // Línea de subtítulo: solo muestra marca si tiene proveedor, nunca la categoría oculta
              const subtitleParts = [product.categoria, product.marca ?? ""].filter(Boolean);
              return (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={productImage(product)}
                        alt={product.display_name}
                        className="h-full w-full object-cover object-[50%_70%] transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/img/logo.png"; }}
                      />
                      {precioFinal && (
                        <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          -{product.discount_pct}%
                        </span>
                      )}
                    </div>
                    <CardContent className="flex flex-col p-2 md:p-4">
                      <div className="mb-1 text-xs uppercase text-muted-foreground truncate">
                        {subtitleParts.join(" · ")}
                      </div>
                      <h3 className="mb-1 line-clamp-2 text-xs md:text-sm font-medium leading-tight">
                        {product.display_name}
                      </h3>
                      <p className="mb-2 md:mb-4 text-xs text-muted-foreground hidden md:block">
                        {product.formato}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-1">
                        {precioFinal ? (
                          <div className="flex flex-col">
                            <span className="text-xs line-through text-muted-foreground">
                              ${product.precio.toLocaleString("es-CO")}
                            </span>
                            <span className="text-sm md:text-xl font-semibold text-red-600">
                              ${precioFinal.toLocaleString("es-CO")}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm md:text-xl font-semibold text-primary">
                            ${product.precio.toLocaleString("es-CO")}
                          </p>
                        )}
                        <span className={`text-xs shrink-0 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                          {product.stock > 0 ? "En Stock" : "Agotado"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            {/* Card agrupado de Scrunchies */}
            {scrunchiVariants.length > 0 && (
              <ScrunchiCard variants={scrunchiVariants} />
            )}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && !hasResults && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-sm">No se encontraron productos con esos filtros.</p>
            {(searchTerm || selectedCategory !== "all") && (
              <div className="mt-4 flex justify-center gap-3 flex-wrap">
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")} className="rounded-full text-sm">
                    Limpiar búsqueda
                  </Button>
                )}
                {selectedCategory !== "all" && (
                  <Button variant="outline" onClick={() => setSelectedCategory("all")} className="rounded-full text-sm">
                    Ver todas las categorías
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
