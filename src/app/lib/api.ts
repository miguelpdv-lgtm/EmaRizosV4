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
  return p.imagen_url || `/img/products/${p.id}.webp`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}, timeoutMs = 30000): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.method && init.method !== "GET") {
    headers.set("X-Requested-With", "emarizos-admin");
    if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  }
  // Tiempo límite: nunca dejar la pantalla "cargando" para siempre
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/${path}`, { credentials: "include", ...init, headers, signal: controller.signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      throw new ApiError("El servidor tardó demasiado en responder. Revisa tu conexión e intenta de nuevo.", 0);
    }
    throw new ApiError("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.", 0);
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Sesión del panel vencida: avisar al panel para pedir login sin perder lo que se edita
    if (res.status === 401 && path.startsWith("admin.php") && !/action=(login|setup|session)/.test(path)) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      throw new ApiError("Tu sesión expiró. Vuelve a entrar y guarda de nuevo.", 401);
    }
    throw new ApiError((data as { error?: string }).error || `Error ${res.status}`, res.status);
  }
  return data as T;
}

/** Evento que se dispara cuando el servidor dice que la sesión del panel ya no existe. */
export const AUTH_EXPIRED_EVENT = "emarizos:auth-expired";

// ─── Público (con caché en memoria compartida entre páginas) ────────────────
const CACHE_MS = 2 * 60 * 1000;
let catalog: { at: number; promise: Promise<Product[]> } | null = null;

/** Catálogo completo con stock. Una sola petición sirve a Inicio, Productos, Detalle y Test. */
function getCatalog(): Promise<Product[]> {
  if (!catalog || Date.now() - catalog.at > CACHE_MS) {
    const promise = request<Product[]>("products.php");
    catalog = { at: Date.now(), promise };
    promise.catch(() => { if (catalog?.promise === promise) catalog = null; });
  }
  return catalog.promise;
}

export async function getProducts(opts: { categoria?: string; limit?: number } = {}): Promise<Product[]> {
  let list = await getCatalog();
  if (opts.categoria) list = list.filter((p) => p.categoria === opts.categoria);
  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}

export async function getProduct(id: number): Promise<Product | null> {
  // Si ya se cargó el catálogo, el detalle es instantáneo
  if (catalog && Date.now() - catalog.at <= CACHE_MS) {
    const found = (await catalog.promise.catch(() => [] as Product[])).find((p) => p.id === id);
    if (found) return found;
  }
  try {
    return await request<Product>(`products.php?id=${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** Precarga el catálogo en segundo plano (por ejemplo, al abrir la web). */
export function prefetchCatalog(): void {
  getCatalog().catch(() => {});
}

// ─── Admin ───────────────────────────────────────────────────────────────────
const admin = (action: string) => `admin.php?action=${action}`;
const post = <T>(action: string, body: unknown) =>
  request<T>(admin(action), { method: "POST", body: JSON.stringify(body) });

export type AdminSession = { authed: boolean; username: string | null; needsSetup: boolean };
export type ProductFields = Partial<Omit<Product, "id" | "imagen_url">>;

export const adminApi = {
  session: () => request<AdminSession>(admin("session")),
  setup: (username: string, password: string, setupKey: string) =>
    post<{ ok: true; username: string }>("setup", { username, password, setup_key: setupKey }),
  login: (username: string, password: string) => post<{ ok: true; username: string }>("login", { username, password }),
  changeUsername: (username: string, password: string) =>
    post<{ ok: true; username: string }>("change_username", { username, password }),
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
    return request<Product>(admin("upload_image"), { method: "POST", body: form }, 120000);
  },
};
