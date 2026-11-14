import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { compressImage, validateImage } from "../../lib/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { adminApi, productImage, type Product, type ProductFields } from "../../lib/api";

export const PESO_FORMULA_OPTIONS = [
  { value: "no_aplica", label: "No aplica" },
  { value: "ligero", label: "Ligero" },
  { value: "medio", label: "Medio" },
  { value: "medio-rico", label: "Medio-rico" },
  { value: "rico", label: "Rico" },
];

export const ALL_PREOCUPACIONES = [
  "accesorios", "acidificación del cabello", "afro", "antifrizz", "brillo", "cabello fragilizado",
  "cabello poroso", "control", "control de frizz", "crecimiento y fortalecimiento",
  "cuero cabelludo graso", "cuidado capilar general", "definición", "definición afro",
  "definición de ondas", "definición de rizos", "definición de rizos afro", "desenredo",
  "desenredo y suavidad", "detox capilar", "estimulación del cuero cabelludo",
  "fijación y definición", "fortalecimiento", "hidratación", "hidronutrición",
  "limpieza de cuero cabelludo", "limpieza profunda de cuero cabelludo", "limpieza suave", "niños",
  "nutrición", "nutrición profunda", "onduladas", "pelo fino", "perfume capilar",
  "post decoloración", "post químico", "protección térmica", "proteína",
  "reducción de encogimiento", "refrescante next-day", "reparación", "reparación intensa",
  "repolarización", "restructuración", "sellado de cutícula", "sellado de puntas y brillo",
  "suavidad", "transición capilar", "tratamiento capilar",
];

const TIPO_CABELLO = ["todos", "rizado", "afro", "ondulado", "niños"];
const NIVEL_FIJACION = ["no_aplica", "ninguna", "baja", "media", "media_alta", "alta"];
const ESTADO_STOCK = ["", "disponible", "bajo", "agotado"];
const TIPO_PRODUCTO = [
  "shampoo", "co_wash", "mascarilla", "acondicionador", "crema_de_peinar", "gel", "gel_en_crema",
  "gelatina", "espuma_fijadora", "aceite_serum", "termoprotector", "cepillo", "accesorio", "tonico_capilar",
];
const PASO_RUTINA = [
  "lavado", "tratamiento", "acondicionado", "finalizacion", "sellado", "proteccion",
  "herramienta", "accesorio", "prelavado", "cuero_cabelludo",
];

type FormState = {
  id: string;
  display_name: string;
  nombre: string;
  sku: string;
  categoria: string;
  marca: string;
  formato: string;
  precio: string;
  stock: string;
  descripcion_corta: string;
  descripcion: string;
  tipo_producto: string;
  paso_rutina: string;
  linea: string;
  estado_stock: string;
  peso_formula: string;
  tipo_cabello: string;
  nivel_fijacion: string;
  discount_pct: string;
  preocupaciones: string[];
  preocupaciones_secundarias: string[];
};

function toForm(p?: Product | null): FormState {
  return {
    id: p ? String(p.id) : "",
    display_name: p?.display_name ?? "",
    nombre: p?.nombre ?? "",
    sku: p?.sku ?? "",
    categoria: p?.categoria ?? "",
    marca: p?.marca ?? "",
    formato: p?.formato ?? "",
    precio: p ? String(p.precio) : "",
    stock: p ? String(p.stock) : "0",
    descripcion_corta: p?.descripcion_corta ?? "",
    descripcion: p?.descripcion ?? "",
    tipo_producto: p?.tipo_producto ?? "",
    paso_rutina: p?.paso_rutina ?? "",
    linea: p?.linea ?? "",
    estado_stock: p?.estado_stock ?? "",
    peso_formula: p?.peso_formula ?? "no_aplica",
    tipo_cabello: p?.tipo_cabello ?? "todos",
    nivel_fijacion: p?.nivel_fijacion ?? "no_aplica",
    discount_pct: p && p.discount_active ? String(p.discount_pct) : "0",
    preocupaciones: p?.preocupaciones ?? [],
    preocupaciones_secundarias: p?.preocupaciones_secundarias ?? [],
  };
}

const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const selectCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function ProductFormDialog({
  product,
  allProducts,
  onClose,
  onSaved,
}: {
  product: Product | null; // null = nuevo
  allProducts: Product[];
  onClose: () => void;
  onSaved: (p: Product, isNew: boolean) => void;
}) {
  const isNew = !product;
  const [form, setForm] = useState<FormState>(() => toForm(product));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const distinct = (key: "categoria" | "marca" | "linea" | "formato") =>
    [...new Set(allProducts.map((p) => p[key]).filter(Boolean) as string[])].sort();
  const categorias = useMemo(() => distinct("categoria"), [allProducts]);
  const marcas = useMemo(() => distinct("marca"), [allProducts]);
  const lineas = useMemo(() => distinct("linea"), [allProducts]);

  const set = (k: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleTag = (field: "preocupaciones" | "preocupaciones_secundarias", tag: string) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(tag) ? f[field].filter((t) => t !== tag) : [...f[field], tag],
    }));

  const pickFile = async (f: File | undefined) => {
    setError("");
    if (!f) return;
    const invalid = validateImage(f);
    if (invalid) return setError(invalid);
    setCompressing(true);
    try {
      setFile(await compressImage(f));
    } catch {
      setFile(f); // si no se puede comprimir, se sube tal cual (el servidor la reduce)
    } finally {
      setCompressing(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.display_name.trim()) return setError("El nombre es obligatorio.");
    const precio = Number(form.precio);
    if (!form.precio || !Number.isFinite(precio) || precio < 0) return setError("Escribe un precio válido.");
    const stock = Number(form.stock || 0);
    if (!Number.isFinite(stock) || stock < 0) return setError("Escribe un stock válido.");
    if (isNew && form.id && !/^\d+$/.test(form.id)) return setError("El ID debe ser solo números.");

    const fields: ProductFields = {
      display_name: form.display_name.trim(),
      nombre: form.nombre.trim() || form.display_name.trim(),
      sku: form.sku,
      categoria: form.categoria,
      marca: form.marca,
      formato: form.formato,
      precio: Math.round(precio),
      stock: Math.round(stock),
      descripcion_corta: form.descripcion_corta,
      descripcion: form.descripcion,
      tipo_producto: form.tipo_producto,
      paso_rutina: form.paso_rutina,
      linea: form.linea,
      estado_stock: form.estado_stock,
      peso_formula: form.peso_formula,
      tipo_cabello: form.tipo_cabello,
      nivel_fijacion: form.nivel_fijacion,
      discount_pct: Math.max(0, Math.min(99, Number(form.discount_pct) || 0)),
      preocupaciones: form.preocupaciones,
      preocupaciones_secundarias: form.preocupaciones_secundarias,
    };

    setSaving(true);
    setStatus("Guardando…");
    try {
      let saved = isNew
        ? await adminApi.createProduct({ ...fields, id: form.id ? Number(form.id) : null })
        : await adminApi.updateProduct(product!.id, fields);
      if (file) {
        setStatus("Subiendo imagen…");
        try {
          saved = await adminApi.uploadImage(saved.id, file);
        } catch (err) {
          // El producto ya quedó guardado: cerramos para no duplicarlo si se reintenta
          onSaved(saved, isNew);
          onClose();
          toast.error(`Producto guardado, pero la imagen falló: ${(err as Error).message}`);
          return;
        }
      }
      onSaved(saved, isNew);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
      setStatus("");
    }
  };

  const currentImage = preview ?? (product ? productImage(product) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 md:p-8">
      <form
        onSubmit={submit}
        className="relative w-full max-w-3xl rounded-2xl border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-primary">
            {isNew ? "Nuevo producto" : `Editar: ${product!.display_name}`}
          </h2>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5 md:grid-cols-[200px_1fr]">
          {/* Imagen */}
          <div>
            <span className={labelCls}>Imagen</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
              className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary"
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/img/logo.webp"; }}
                />
              ) : (
                <ImagePlus className="size-10 text-muted-foreground" />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {currentImage ? "Cambiar imagen" : "Subir imagen"}
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG o WebP. Se optimiza sola antes de subirla. Ideal cuadrada (1:1).
              {compressing && <span className="block font-medium text-primary">Optimizando imagen…</span>}
              {file && !compressing && (
                <span className="block font-medium text-primary">Lista: {Math.max(1, Math.round(file.size / 1024))} KB</span>
              )}
            </p>
          </div>

          {/* Datos */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-name">Nombre visible *</label>
              <Input id="pf-name" value={form.display_name} onChange={set("display_name")} placeholder="Ej: Crema de peinar Nutrición" autoFocus />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-precio">Precio (COP) *</label>
              <Input id="pf-precio" type="number" min={0} step={100} value={form.precio} onChange={set("precio")} placeholder="45000" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-stock">Stock</label>
              <Input id="pf-stock" type="number" min={0} value={form.stock} onChange={set("stock")} />
              <p className="mt-1 text-[11px] text-muted-foreground">Con stock 0 no aparece en la tienda.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-cat">Categoría</label>
              <Input id="pf-cat" list="pf-cats" value={form.categoria} onChange={set("categoria")} placeholder="Cremas" />
              <datalist id="pf-cats">{categorias.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-marca">Marca</label>
              <Input id="pf-marca" list="pf-marcas" value={form.marca} onChange={set("marca")} />
              <datalist id="pf-marcas">{marcas.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-formato">Formato</label>
              <Input id="pf-formato" value={form.formato} onChange={set("formato")} placeholder="300ml" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-desc-pct">Descuento %</label>
              <Input id="pf-desc-pct" type="number" min={0} max={99} value={form.discount_pct} onChange={set("discount_pct")} />
            </div>
            {isNew && (
              <div>
                <label className={labelCls} htmlFor="pf-id">ID / código POS (opcional)</label>
                <Input id="pf-id" inputMode="numeric" value={form.id} onChange={set("id")} placeholder="Se asigna solo" />
              </div>
            )}
            <div>
              <label className={labelCls} htmlFor="pf-sku">SKU (opcional)</label>
              <Input id="pf-sku" value={form.sku} onChange={set("sku")} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-dc">Descripción corta</label>
              <Input id="pf-dc" value={form.descripcion_corta} onChange={set("descripcion_corta")} maxLength={500} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-d">Descripción</label>
              <textarea id="pf-d" rows={3} value={form.descripcion} onChange={set("descripcion")} className={`${selectCls} resize-y`} />
            </div>
          </div>
        </div>

        {/* Test de rutina */}
        <details className="border-t px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            Datos para el test de rutina (opcional)
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="pf-tp">Tipo de producto</label>
              <Input id="pf-tp" list="pf-tps" value={form.tipo_producto} onChange={set("tipo_producto")} />
              <datalist id="pf-tps">{TIPO_PRODUCTO.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-pr">Paso de rutina</label>
              <Input id="pf-pr" list="pf-prs" value={form.paso_rutina} onChange={set("paso_rutina")} />
              <datalist id="pf-prs">{PASO_RUTINA.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-linea">Línea</label>
              <Input id="pf-linea" list="pf-lineas" value={form.linea} onChange={set("linea")} placeholder="general" />
              <datalist id="pf-lineas">{lineas.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-tc">Tipo de cabello</label>
              <select id="pf-tc" className={selectCls} value={form.tipo_cabello} onChange={set("tipo_cabello")}>
                {TIPO_CABELLO.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-nf">Nivel de fijación</label>
              <select id="pf-nf" className={selectCls} value={form.nivel_fijacion} onChange={set("nivel_fijacion")}>
                {NIVEL_FIJACION.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-es">Estado de stock</label>
              <select id="pf-es" className={selectCls} value={form.estado_stock} onChange={set("estado_stock")}>
                {ESTADO_STOCK.map((v) => <option key={v} value={v}>{v || "—"}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <span className={labelCls}>Peso de la fórmula</span>
              <div className="flex flex-wrap gap-1.5">
                {PESO_FORMULA_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, peso_formula: opt.value }))}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${form.peso_formula === opt.value ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {(["preocupaciones", "preocupaciones_secundarias"] as const).map((field) => (
              <div key={field} className="sm:col-span-2 lg:col-span-3">
                <span className={labelCls}>
                  {field === "preocupaciones" ? "Preocupaciones principales" : "Preocupaciones secundarias"}
                </span>
                <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto pr-1">
                  {ALL_PREOCUPACIONES.map((tag) => {
                    const on = form[field].includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(field, tag)}
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${on
                          ? field === "preocupaciones" ? "border-primary bg-primary/10 font-medium text-primary" : "border-blue-500 bg-blue-50 font-medium text-blue-700"
                          : "border-border text-muted-foreground hover:border-primary/50"}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </details>

        <div className="flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          {error && <p className="text-sm text-destructive sm:mr-auto">{error}</p>}
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button type="submit" disabled={saving || compressing}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving && status ? status : isNew ? "Crear producto" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
