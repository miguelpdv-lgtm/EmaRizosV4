import { getProduct, getProducts, productImage, type Product } from "../lib/api";

export type { Product };
export { productImage };

export async function fetchProducts(): Promise<Product[]> {
  return getProducts();
}

export async function fetchProductById(id: number): Promise<Product | null> {
  return getProduct(id);
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ categoria: category });
}

export type ProductWithExtras = Product;

export function getProductImage(product: Product): string {
  return productImage(product);
}

export function getProductDescription(product: Product): string {
  if (product.descripcion?.trim()) return product.descripcion;
  if (product.descripcion_corta?.trim()) return product.descripcion_corta;

  const parts = [product.categoria, product.marca, product.formato].filter(Boolean);

  if (parts.length) {
    return `${parts.join(" · ")}. Producto recomendado para el cuidado del cabello.`;
  }

  return "Producto recomendado para el cuidado del cabello.";
}
