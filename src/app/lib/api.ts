// Cliente de la API PHP (public/api/*.php) que reemplaza a Supabase.
const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) || "/api").replace(/\/$/, "");

export type Product = {
  id: number;
  sku: string | null;
  nombre: string;
  display_name: string;
  categoria: string | null;
  marca: string | null;
  formato: string | null;
  precio: number;
  stock: number;
  descripcion: string | null;
  descripcion_corta: string | null;
  tipo_producto: string | null;
  paso_rutina: string | null;
  linea: string | null;
  estado_stock: string | null;
  peso_formula: string | null;
  featured: boolean;
  preocupaciones: string[] | null;
  preocupaciones_secundarias: string[] | null;
  score_base: number | null;
  tipo_cabello: string;
  nivel_fijacion: string;
  discount_pct: number;
  discount_active: boolean;
  imagen_url: string | null;
};

/** Imagen del producto: la subida desde el panel o, si no hay, la del catálogo original. */
export function productImage(p: { id: number; imagen_url?: string | null }): string {
  return p.imagen_url || `/img/products/${p.id}.png`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.method && init.method !== "GET") {
    headers.set("X-Requested-With", "emarizos-admin");
    if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}/${path}`, { credentials: "include", ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error || `Error ${res.status}`, res.status);
  return data as T;
}

// ─── Público ─────────────────────────────────────────────────────────────────
export function getProducts(opts: { categoria?: string; limit?: number } = {}): Promise<Product[]> {
  const q = new URLSearchParams();
  if (opts.categoria) q.set("categoria", opts.categoria);
  if (opts.limit) q.set("limit", String(opts.limit));
  const qs = q.toString();
  return request<Product[]>(`products.php${qs ? `?${qs}` : ""}`);
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    return await request<Product>(`products.php?id=${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// ─── Admin ───────────────────────────────────────────────────────────────────
const admin = (action: string) => `admin.php?action=${action}`;
const post = <T>(action: string, body: unknown) =>
  request<T>(admin(action), { method: "POST", body: JSON.stringify(body) });

export type AdminSession = { authed: boolean; email: string | null; needsSetup: boolean };
export type ProductFields = Partial<Omit<Product, "id" | "imagen_url">>;

export const adminApi = {
  session: () => request<AdminSession>(admin("session")),
  setup: (email: string, password: string, setupKey: string) =>
    post<{ ok: true }>("setup", { email, password, setup_key: setupKey }),
  login: (email: string, password: string) => post<{ ok: true; email: string }>("login", { email, password }),
  logout: () => post<{ ok: true }>("logout", {}),
  changePassword: (current: string, next: string) => post<{ ok: true }>("change_password", { current, new: next }),
  products: () => request<Product[]>(admin("products")),
  createProduct: (fields: ProductFields & { id?: number | null }) => post<Product>("create_product", fields),
  updateProduct: (id: number, fields: ProductFields) => post<Product>("update_product", { id, fields }),
  deleteProduct: (id: number) => post<{ ok: true }>("delete_product", { id }),
  bulkDiscount: (ids: number[], pct: number) => post<{ ok: true; updated: number }>("bulk_discount", { ids, pct }),
  uploadImage: (id: number, file: File) => {
    const form = new FormData();
    form.append("id", String(id));
    form.append("image", file);
    return request<Product>(admin("upload_image"), { method: "POST", body: form });
  },
};
