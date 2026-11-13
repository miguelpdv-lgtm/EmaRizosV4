"""Convierte migration/supabase-products.json en migration/products-data.sql (INSERTs para MySQL)."""
import json
import pathlib

HERE = pathlib.Path(__file__).parent
rows = json.loads((HERE / "supabase-products.json").read_text(encoding="utf-8"))

COLS = [
    "id", "sku", "nombre", "display_name", "categoria", "marca", "formato", "precio", "stock",
    "descripcion", "descripcion_corta", "tipo_producto", "paso_rutina", "linea", "estado_stock",
    "peso_formula", "featured", "preocupaciones", "preocupaciones_secundarias", "score_base",
    "tipo_cabello", "nivel_fijacion", "discount_pct", "discount_active",
]


def sql_value(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(int(v))
    if isinstance(v, list):
        v = json.dumps(v, ensure_ascii=False)
    s = str(v).replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "")
    return f"'{s}'"


lines = [
    "-- Productos exportados desde Supabase. Importar DESPUÉS de schema.sql.",
    "SET NAMES utf8mb4;",
    "",
]
for r in rows:
    r = dict(r)
    if r.get("sku") == "":
        r["sku"] = None
    vals = ", ".join(sql_value(r.get(c)) for c in COLS)
    lines.append(f"INSERT INTO products ({', '.join(COLS)}) VALUES ({vals});")

(HERE / "products-data.sql").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"{len(rows)} productos exportados")
