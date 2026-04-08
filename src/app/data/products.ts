import { supabase } from "../lib/supabase";

export type Product = {
  ID: number;
  SKU: string | null;
  Categoría: string | null;
  Marca: string | null;
  Nombre: string | null;
  Formato: string | null;
  Costo: number | null;
  "Precio venta externa": number | null;
  "Precio venta interna": number | null;
  "Comisión": number | null;
  "Tipo de comisión (0: %, 1: $)": string | null;
  "Descripción": string | null;
  Estado: string | null;
  "Precio contiene IVA": string | null;
  "% IVA (vacio por defecto)": number | null;
  "Stock Ema Rizos": number | null;
};

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("Estado", "Activo")
    .gt("Stock Ema Rizos", 0)
    .order("Nombre", { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("ID", id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("Estado", "Activo")
    .gt("Stock Ema Rizos", 0)
    .eq("Categoría", category)
    .order("Nombre", { ascending: true });

  if (error) throw error;
  return data as Product[];
}