import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  Search, Pencil, Check, X, Loader2, ShieldCheck, LogOut, Tag, ChevronDown, ChevronUp,
  Plus, Trash2, KeyRound, RefreshCw, ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { adminApi, productImage, AUTH_EXPIRED_EVENT, type Product } from "../lib/api";
import { compressImage, validateImage } from "../lib/image";
import { ProductFormDialog, PESO_FORMULA_OPTIONS } from "../components/admin/ProductFormDialog";

const formatCOP = (v: number) => `$${v.toLocaleString("es-CO")}`;

// ─── Pantalla de acceso (login o creación del primer admin) ─────────────────
function AuthScreen({ needsSetup, onAuthed }: { needsSetup: boolean; onAuthed: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (needsSetup) {
      if (pw.length < 10) return setError("La contraseña debe tener al menos 10 caracteres.");
      if (pw !== pw2) return setError("Las contraseñas no coinciden.");
    }
    setLoading(true);
    try {
      const r = needsSetup
        ? await adminApi.setup(username.trim(), pw, setupKey.trim())
        : await adminApi.login(username.trim(), pw);
      onAuthed(r.username);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="size-10 text-primary" />
          <h1 className="text-xl font-bold text-primary">
            {needsSetup ? "Crear administrador" : "Panel de Administración"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {needsSetup
              ? "Primera vez: crea el usuario con el que vas a entrar al panel."
              : "Ingresa tus credenciales para continuar"}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {needsSetup && (
            <Input placeholder="Código de instalación" value={setupKey} onChange={(e) => { setSetupKey(e.target.value); setError(""); }} autoComplete="off" required />
          )}
          <Input placeholder="Usuario" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          <Input
            type="password"
            placeholder={needsSetup ? "Contraseña (mín. 10 caracteres)" : "Contraseña"}
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            autoComplete={needsSetup ? "new-password" : "current-password"}
            required
          />
          {needsSetup && (
            <Input type="password" placeholder="Repite la contraseña" value={pw2} onChange={(e) => { setPw2(e.target.value); setError(""); }} autoComplete="new-password" required />
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {needsSetup ? "Crear y entrar" : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Cuenta: cambiar usuario o contraseña ───────────────────────────────────
function AccountDialog({ username, onClose, onUsernameChanged }: {
  username: string | null;
  onClose: () => void;
  onUsernameChanged: (u: string) => void;
}) {
  const [tab, setTab] = useState<"password" | "username">("password");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");
  const [newUser, setNewUser] = useState(username ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "password") {
      if (next.length < 10) return setError("Mínimo 10 caracteres.");
      if (next !== next2) return setError("Las contraseñas no coinciden.");
    } else if (!/^[a-zA-Z0-9._-]{3,40}$/.test(newUser.trim())) {
      return setError("De 3 a 40 caracteres: letras, números, punto, guion o guion bajo.");
    }
    setSaving(true);
    try {
      if (tab === "password") {
        await adminApi.changePassword(current, next);
        toast.success("Contraseña actualizada");
      } else {
        const r = await adminApi.changeUsername(newUser.trim(), current);
        onUsernameChanged(r.username);
        toast.success(`Ahora entras con el usuario "${r.username}"`);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const tabCls = (t: typeof tab) =>
    `flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${tab === t ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-primary">Mi cuenta</h2>
        <div className="mb-4 flex gap-1 rounded-full border p-1">
          <button type="button" className={tabCls("password")} onClick={() => { setTab("password"); setError(""); }}>Contraseña</button>
          <button type="button" className={tabCls("username")} onClick={() => { setTab("username"); setError(""); }}>Usuario</button>
        </div>
        <div className="flex flex-col gap-3">
          {tab === "username" && (
            <Input placeholder="Nuevo usuario" value={newUser} onChange={(e) => setNewUser(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          )}
          <Input type="password" placeholder="Contraseña actual" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          {tab === "password" && (
            <>
              <Input type="password" placeholder="Nueva contraseña (mín. 10)" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
              <Input type="password" placeholder="Repite la nueva" value={next2} onChange={(e) => setNext2(e.target.value)} autoComplete="new-password" required />
            </>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 size-4 animate-spin" />}Guardar</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Sesión vencida: volver a entrar sin cerrar lo que se está editando ──────
function ReloginDialog({ username, onDone }: { username: string | null; onDone: (username: string) => void }) {
  const [user, setUser] = useState(username ?? "");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await adminApi.login(user.trim(), pw);
      onDone(r.username);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="size-7 shrink-0 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-primary">Tu sesión expiró</h2>
            <p className="text-xs text-muted-foreground">Vuelve a entrar. Lo que estabas editando sigue abierto.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Input placeholder="Usuario" value={user} onChange={(e) => { setUser(e.target.value); setError(""); }} autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          <Input type="password" placeholder="Contraseña" value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }} autoComplete="current-password" autoFocus required />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────
export function AdminPanel() {
  const [session, setSession] = useState<{ checked: boolean; authed: boolean; needsSetup: boolean; username: string | null }>(
    { checked: false, authed: false, needsSetup: false, username: null }
  );
  const [sessionError, setSessionError] = useState("");

  const checkSession = useCallback(async () => {
    try {
      const s = await adminApi.session();
      setSession({ checked: true, ...s });
    } catch (err) {
      setSessionError((err as Error).message);
      setSession((s) => ({ ...s, checked: true }));
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [showPw, setShowPw] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Descuento individual
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(null);
  const [discountPctValue, setDiscountPctValue] = useState<number>(0);
  const [savingDiscountId, setSavingDiscountId] = useState<number | null>(null);

  // Descuento masivo
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkPct, setBulkPct] = useState<number>(0);
  const [bulkTarget, setBulkTarget] = useState<"all" | "categoria" | "marca">("all");
  const [bulkValue, setBulkValue] = useState<string>("");
  const [bulkSaving, setBulkSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await adminApi.products());
    } catch (err) {
      // Un 401 abre el diálogo de "sesión expirada" (evento global); el resto se muestra
      if ((err as { status?: number }).status !== 401) toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (session.authed) loadProducts(); }, [session.authed, loadProducts]);

  // Sesión vencida: el servidor respondió 401 o, al volver a la pestaña, ya no hay sesión
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!session.authed) return;
    const onExpired = () => setExpired(true);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      adminApi.session().then((s) => { if (!s.authed) setExpired(true); }).catch(() => {});
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [session.authed]);

  const handleLogout = async () => {
    await adminApi.logout().catch(() => {});
    setSession((s) => ({ ...s, authed: false, username: null }));
  };

  const replaceProduct = (p: Product) =>
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));

  // ─── Derivados ─────────────────────────────────────────────────────────
  const term = search.trim().toLowerCase();
  const filtered = products.filter((p) =>
    !term ||
    p.display_name.toLowerCase().includes(term) ||
    (p.marca ?? "").toLowerCase().includes(term) ||
    (p.categoria ?? "").toLowerCase().includes(term) ||
    String(p.id).includes(term)
  );

  const noAccesorios = products.filter((p) => p.categoria?.toLowerCase() !== "accesorios");
  const categorias = [...new Set(noAccesorios.map((p) => p.categoria).filter(Boolean) as string[])].sort();
  const marcas = [...new Set(noAccesorios.map((p) => p.marca).filter(Boolean) as string[])].sort();
  let bulkTargets = noAccesorios;
  if (bulkTarget === "categoria" && bulkValue) bulkTargets = bulkTargets.filter((p) => p.categoria === bulkValue);
  if (bulkTarget === "marca" && bulkValue) bulkTargets = bulkTargets.filter((p) => p.marca === bulkValue);

  // ─── Acciones ──────────────────────────────────────────────────────────
  const saveDiscount = async (id: number, pctRaw: number) => {
    const pct = Math.min(99, Math.max(0, Math.round(pctRaw || 0)));
    setSavingDiscountId(id);
    try {
      replaceProduct(await adminApi.updateProduct(id, { discount_pct: pct }));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingDiscountId(null);
      setEditingDiscountId(null);
    }
  };

  const applyBulkDiscount = async () => {
    const ids = bulkTargets.map((p) => p.id);
    if (!ids.length) return;
    setBulkSaving(true);
    try {
      const pct = Math.min(99, Math.max(0, bulkPct));
      await adminApi.bulkDiscount(ids, pct);
      setProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, discount_pct: pct, discount_active: pct > 0 } : p)));
      toast.success(pct > 0 ? `Descuento de ${pct}% aplicado a ${ids.length} productos` : `Descuento quitado a ${ids.length} productos`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBulkSaving(false);
    }
  };

  const quickUpload = async (p: Product, file: File | undefined) => {
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) return toast.error(invalid);
    setUploadingId(p.id);
    try {
      const optimized = await compressImage(file).catch(() => file);
      replaceProduct(await adminApi.uploadImage(p.id, optimized));
      toast.success("Imagen actualizada");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploadingId(null);
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!window.confirm(`¿Eliminar "${p.display_name}"? Esta acción no se puede deshacer.\n\nSi solo quieres ocultarlo de la tienda, pon el stock en 0.`)) return;
    setDeletingId(p.id);
    try {
      await adminApi.deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Producto eliminado");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  if (!session.checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sessionError && !session.authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <p className="mb-4 text-destructive">No se pudo conectar con el servidor: {sessionError}</p>
          <Button onClick={() => { setSessionError(""); setSession((s) => ({ ...s, checked: false })); checkSession(); }}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!session.authed) {
    return (
      <AuthScreen
        needsSetup={session.needsSetup}
        onAuthed={(username) => setSession({ checked: true, authed: true, needsSetup: false, username })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary md:text-3xl">Panel de Administración</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea y edita productos, sube imágenes y maneja descuentos · {session.username}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setEditing("new")} className="text-sm">
              <Plus className="mr-2 size-4" /> Nuevo producto
            </Button>
            <Button variant="outline" onClick={loadProducts} className="text-sm">
              <RefreshCw className="mr-2 size-4" /> Recargar
            </Button>
            <Button variant="outline" onClick={() => setShowPw(true)} className="text-sm">
              <KeyRound className="mr-2 size-4" /> Mi cuenta
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-sm text-destructive hover:text-destructive">
              <LogOut className="mr-2 size-4" /> Salir
            </Button>
          </div>
        </div>

        {/* Descuento masivo */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <button className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30" onClick={() => setBulkOpen((v) => !v)}>
            <div className="flex items-center gap-3">
              <Tag className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Descuento masivo</p>
                <p className="text-xs text-muted-foreground">Aplica o quita un descuento a todos los productos, por categoría o por marca</p>
              </div>
            </div>
            {bulkOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </button>

          {bulkOpen && (
            <div className="flex flex-col gap-4 border-t border-border px-5 py-5">
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "all", label: "Todos los productos" },
                  { value: "categoria", label: "Por categoría" },
                  { value: "marca", label: "Por marca" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setBulkTarget(opt.value); setBulkValue(""); }}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${bulkTarget === opt.value ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {bulkTarget !== "all" && (
                <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                  <option value="">— Selecciona —</option>
                  {(bulkTarget === "categoria" ? categorias : marcas).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}

              <p className="text-xs text-muted-foreground">
                Se aplicará a <span className="font-semibold text-primary">{bulkTargets.length} productos</span>
                {bulkValue && ` (${bulkValue})`}. Los accesorios nunca se incluyen.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Input type="number" min={0} max={99} value={bulkPct} onChange={(e) => setBulkPct(Number(e.target.value))} className="w-24 text-center" />
                <span className="text-sm text-muted-foreground">%</span>
                <Button
                  onClick={applyBulkDiscount}
                  disabled={bulkSaving || (bulkTarget !== "all" && !bulkValue)}
                  className={`text-sm ${bulkPct === 0 ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
                >
                  {bulkSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {bulkPct === 0 ? "Quitar descuento" : `Aplicar ${bulkPct}%`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Buscador */}
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por ID, nombre, marca o categoría..." className="pl-10" />
        </div>
        <p className="mb-4 text-xs text-muted-foreground">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</p>

        {/* Tabla */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold">Imagen</th>
                    <th className="px-4 py-3 text-left font-semibold">Producto</th>
                    <th className="hidden px-4 py-3 text-left font-semibold md:table-cell">Categoría · Marca</th>
                    <th className="px-4 py-3 text-center font-semibold">Descuento</th>
                    <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Fórmula</th>
                    <th className="px-4 py-3 text-right font-semibold">Precio / Stock</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const isAccesorio = product.categoria?.toLowerCase() === "accesorios";
                    const precioFinal = product.discount_active && product.discount_pct > 0
                      ? Math.round(product.precio * (1 - product.discount_pct / 100))
                      : null;
                    return (
                      <tr key={product.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30">
                        {/* Imagen (clic para cambiar) */}
                        <td className="px-4 py-3">
                          <label className="group relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-muted" title="Cambiar imagen">
                            <img
                              src={productImage(product)}
                              alt={product.display_name}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/img/logo.webp"; }}
                            />
                            <span className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity ${uploadingId === product.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                              {uploadingId === product.id ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              disabled={uploadingId !== null}
                              onChange={(e) => { quickUpload(product, e.target.files?.[0]); e.target.value = ""; }}
                            />
                          </label>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{product.display_name}</p>
                          <p className="font-mono text-xs text-muted-foreground">#{product.id}</p>
                        </td>

                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                          {product.categoria}
                          {product.marca && <span className="block text-xs">{product.marca}</span>}
                        </td>

                        {/* Descuento */}
                        <td className="px-4 py-3 text-center">
                          {isAccesorio ? (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          ) : editingDiscountId === product.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number" min={0} max={99}
                                value={discountPctValue}
                                onChange={(e) => setDiscountPctValue(Number(e.target.value))}
                                className="h-7 w-16 px-1 text-center text-xs"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveDiscount(product.id, discountPctValue);
                                  if (e.key === "Escape") setEditingDiscountId(null);
                                }}
                              />
                              <button onClick={() => saveDiscount(product.id, discountPctValue)} disabled={savingDiscountId === product.id} className="rounded-full bg-primary p-1 text-white hover:bg-primary/90">
                                {savingDiscountId === product.id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                              </button>
                              <button onClick={() => setEditingDiscountId(null)} className="rounded-full border border-border p-1 text-muted-foreground hover:text-foreground">
                                <X className="size-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              {product.discount_active && product.discount_pct > 0 ? (
                                <>
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">-{product.discount_pct}%</span>
                                  <button onClick={() => saveDiscount(product.id, 0)} disabled={savingDiscountId === product.id} className="rounded p-0.5 text-muted-foreground hover:text-destructive" title="Quitar descuento">
                                    {savingDiscountId === product.id ? <Loader2 className="size-3 animate-spin" /> : <X className="size-3" />}
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">Sin desc.</span>
                              )}
                              <button onClick={() => { setEditingDiscountId(product.id); setDiscountPctValue(product.discount_pct ?? 0); }} className="rounded p-0.5 text-muted-foreground hover:text-primary" title="Editar descuento">
                                <Pencil className="size-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Fórmula */}
                        <td className="hidden px-4 py-3 lg:table-cell">
                          {product.peso_formula && product.peso_formula !== "no_aplica" ? (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                              {PESO_FORMULA_OPTIONS.find((o) => o.value === product.peso_formula)?.label ?? product.peso_formula}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          )}
                          {(product.preocupaciones?.length ?? 0) > 0 && (
                            <span className="ml-1 text-xs text-muted-foreground">{product.preocupaciones!.length} etiquetas</span>
                          )}
                        </td>

                        {/* Precio + stock */}
                        <td className="px-4 py-3 text-right">
                          {precioFinal ? (
                            <>
                              <p className="text-xs text-muted-foreground line-through">{formatCOP(product.precio)}</p>
                              <p className="font-medium text-red-600">{formatCOP(precioFinal)}</p>
                            </>
                          ) : (
                            <p className="font-medium text-primary">{formatCOP(product.precio)}</p>
                          )}
                          <p className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                            {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
                          </p>
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setEditing(product)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" title="Editar">
                              <Pencil className="size-4" />
                            </button>
                            <button onClick={() => deleteProduct(product)} disabled={deletingId === product.id} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive" title="Eliminar">
                              {deletingId === product.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editing !== null && (
        <ProductFormDialog
          product={editing === "new" ? null : editing}
          allProducts={products}
          onClose={() => setEditing(null)}
          onSaved={(p, isNew) => {
            if (isNew) setProducts((prev) => [...prev, p].sort((a, b) => a.display_name.localeCompare(b.display_name)));
            else replaceProduct(p);
            toast.success(isNew ? "Producto creado" : "Cambios guardados");
          }}
        />
      )}
      {expired && (
        <ReloginDialog
          username={session.username}
          onDone={(username) => {
            setExpired(false);
            setSession((s) => ({ ...s, username }));
            toast.success("Listo, vuelve a guardar tus cambios");
          }}
        />
      )}
      {showPw && (
        <AccountDialog
          username={session.username}
          onClose={() => setShowPw(false)}
          onUsernameChanged={(username) => setSession((s) => ({ ...s, username }))}
        />
      )}
    </div>
  );
}
