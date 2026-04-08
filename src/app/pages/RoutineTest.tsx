import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { fetchProducts, type Product } from "../data/products";
import {
  CheckCircle, Circle, ArrowRight, ArrowLeft,
  RotateCcw, ShoppingCart, Sparkles
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Answers {
  hairType?: string;
  porosity?: string;
  density?: string;
  length?: string;
  chemicalTreatment?: string;
  curlyJourney?: string;
  mainConcern?: string[];
  secondaryConcern?: string[];
  scalpConcern?: string;
  usesHeat?: string;
  washFrequency?: string;
  stylingGoal?: string;
  environment?: string;
  budget?: string;
  routine?: string[];
}

interface ScoredProduct {
  product: Product;
  score: number;
  reason: string;
  category: string;
}

interface RecommendedProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  reason: string;
  score: number;
}

// ─── Tags por producto ────────────────────────────────────────────────────────

const PRODUCT_TAGS: Record<number, string[]> = {
  // Cremas
  1:  ["cremas", "rizos", "definicion", "liviano", "ondulado", "rizado"],
  3:  ["cremas", "afro", "muy_rizado", "nutritiva", "volumen", "resequedad"],
  5:  ["cremas", "rizado", "muy_rizado", "frizz", "definicion", "selladora"],
  6:  ["cremas", "afro", "nutritiva", "resequedad", "premium", "alta_porosidad"],
  7:  ["cremas", "ondulado", "rizado", "liviano", "frizz", "media_porosidad"],
  8:  ["cremas", "rizado", "muy_rizado", "definicion", "frizz", "alta_porosidad"],
  10: ["cremas", "rizos", "definicion", "gel_crema", "fijacion_media"],
  11: ["cremas", "leave_in", "liviano", "ondulado", "brillo", "baja_porosidad"],
  12: ["cremas", "muy_rizado", "afro", "nutritiva", "resequedad", "alta_porosidad"],
  // Cepillos
  19: ["cepillos", "curly", "ondulado", "rizado", "aplicacion"],
  20: ["cepillos", "bordes", "afro", "muy_rizado", "acabado"],
  21: ["cepillos", "definidor", "rizos", "aplicacion", "muy_rizado"],
  25: ["cepillos", "laberinto", "afro", "muy_rizado", "desenredo"],
  26: ["cepillos", "masajeador", "cuero_cabelludo", "caida", "circulacion"],
  28: ["cepillos", "teezer", "ondulado", "rizado", "desenredo"],
  31: ["cepillos", "trinche", "afro", "muy_rizado", "volumen"],
  // Mascarillas
  32: ["mascarilla", "profunda", "nutritiva", "resequedad", "rizado"],
  36: ["mascarilla", "nutritiva", "siete_oleos", "alta_porosidad", "rotura"],
  37: ["mascarilla", "ultra_nutritiva", "alta_porosidad", "resequedad", "rotura"],
  38: ["mascarilla", "ultra_nutritiva", "premium", "afro", "muy_rizado"],
  39: ["mascarilla", "queratina", "quimico", "rotura", "puntas", "reparadora"],
  // Accesorios
  55: ["accesorios", "satin", "proteccion_nocturna", "rizos", "humedad"],
  57: ["accesorios", "gorro_termico", "tratamiento", "mascarilla", "calor"],
  59: ["accesorios", "toalla", "microfibra", "frizz", "secado"],
  60: ["accesorios", "toalla", "microfibra", "frizz", "secado"],
  62: ["accesorios", "atomizador", "humedad", "refrescado", "peinado"],
  63: ["accesorios", "difusor", "calor", "definicion", "volumen"],
  64: ["accesorios", "satin", "proteccion_nocturna", "premium", "humedad"],
  65: ["accesorios", "satin", "proteccion_nocturna", "economico"],
  69: ["accesorios", "emabuff", "peinado", "raiz", "volumen"],
  // Limpieza
  74: ["limpieza", "shampoo", "cero_sulfatos", "suave", "sensible"],
  75: ["limpieza", "shampoo", "herbal", "cuero_seco", "caspa"],
  76: ["limpieza", "cowash", "kids", "suave", "ondulado", "muy_rizado"],
  77: ["limpieza", "cowash", "hidratante", "alta_porosidad", "rizado"],
  78: ["limpieza", "cowash", "litro", "largo", "alta_porosidad"],
  79: ["limpieza", "shampoo", "purificante", "cuero_graso", "limpieza_profunda"],
  80: ["limpieza", "shampoo", "formula_perfecta", "rizado", "media_porosidad"],
  82: ["limpieza", "shampoo", "phyto", "nutritiva", "muy_rizado"],
  // Fijacion
  98: ["fijacion", "gel", "azul", "afro", "fijacion_fuerte", "anti_frizz"],
  99: ["fijacion", "gel", "naranja", "rizado", "fijacion_media", "definicion"],
  100:["fijacion", "gel", "verde", "ondulado", "fijacion_ligera", "brillo"],
  101:["fijacion", "gelatina", "rizos", "fijacion_media", "definicion"],
  105:["fijacion", "gel", "activador", "premium", "rizado", "muy_rizado"],
  // Acondicionador
  106:["acondionador", "melenas", "rizado", "media_porosidad", "suave"],
  107:["acondionador", "formula_perfecta", "rizado", "media_porosidad"],
  109:["acondionador", "phyto", "muy_rizado", "nutritiva", "alta_porosidad"],
  110:["acondionador", "sellador", "alta_porosidad", "brillo", "frizz"],
  // Termoprotector
  122:["termoprotector", "perfume", "calor", "brillo", "acabado"],
  123:["termoprotector", "calor", "frizz", "anti_humedad"],
  124:["termoprotector", "spray", "anti_humedad", "frizz", "calor"],
  // Aceites
  127:["aceites", "rizos_felices", "selladora", "brillo", "anti_frizz", "alta_porosidad"],
  133:["aceites", "liviano", "brillo", "selladora", "baja_porosidad"],
  // Tónico
  134:["tonico", "herbal", "caida", "cuero_cabelludo", "circulacion"],
};

// ─── Scoring por respuesta ────────────────────────────────────────────────────

function getScoreMap(answers: Answers): Record<string, number> {
  const s: Record<string, number> = {};
  const add = (tag: string, pts: number) => { s[tag] = (s[tag] ?? 0) + pts; };

  // 1. Tipo de rizo
  switch (answers.hairType) {
    case "ondulado":   add("ondulado",3); add("liviano",2); add("fijacion_ligera",2); add("baja_porosidad",1); break;
    case "rizado":     add("rizado",3); add("definicion",2); add("fijacion_media",2); add("media_porosidad",1); break;
    case "muy_rizado": add("muy_rizado",3); add("rizado",1); add("nutritiva",2); add("fijacion_fuerte",2); add("alta_porosidad",1); break;
    case "afro":       add("afro",3); add("muy_rizado",1); add("nutritiva",3); add("fijacion_fuerte",3); add("alta_porosidad",2); add("bordes",2); break;
  }

  // 2. Porosidad
  switch (answers.porosity) {
    case "baja":  add("baja_porosidad",3); add("liviano",2); add("brillo",1); break;
    case "media": add("media_porosidad",3); add("formula_perfecta",1); break;
    case "alta":  add("alta_porosidad",3); add("nutritiva",3); add("selladora",3); add("resequedad",2); add("ultra_nutritiva",2); break;
    case "no_se": add("media_porosidad",1); break;
  }

  // 3. Densidad
  switch (answers.density) {
    case "fino":   add("liviano",3); add("volumen",3); add("cowash",1); break;
    case "medio":  add("media_porosidad",1); break;
    case "grueso": add("nutritiva",2); add("profunda",2); add("desenredo",2); break;
  }

  // 4. Largo
  switch (answers.length) {
    case "corto":    add("liviano",1); break;
    case "mediano":  break;
    case "largo":    add("nutritiva",1); add("puntas",2); add("litro",2); add("selladora",1); break;
    case "muy_largo":add("nutritiva",2); add("puntas",3); add("litro",3); add("selladora",2); add("resequedad",1); break;
  }

  // 5. Tratamientos químicos
  switch (answers.chemicalTreatment) {
    case "tinte":        add("reparadora",2); add("queratina",2); add("brillo",2); break;
    case "decoloracion": add("reparadora",4); add("queratina",4); add("ultra_nutritiva",3); add("rotura",3); break;
    case "alisado":      add("reparadora",3); add("queratina",3); add("selladora",2); break;
    case "ninguno":      break;
  }

  // 6. Tiempo en método curly
  switch (answers.curlyJourney) {
    case "nuevo":     add("suave",2); add("formula_perfecta",2); add("cowash",1); break;
    case "6meses":    add("definicion",2); add("fijacion_media",1); break;
    case "1año":      add("premium",1); add("anti_frizz",1); break;
    case "experta":   add("premium",2); add("anti_frizz",2); add("alta_porosidad",1); break;
  }

  // 7. Preocupación principal (múltiple)
  (answers.mainConcern ?? []).forEach(c => {
    switch (c) {
      case "frizz":      add("anti_frizz",4); add("fijacion_fuerte",2); add("selladora",2); break;
      case "resequedad": add("resequedad",4); add("nutritiva",3); add("ultra_nutritiva",2); add("alta_porosidad",2); break;
      case "rotura":     add("rotura",4); add("reparadora",4); add("queratina",3); break;
      case "definicion": add("definicion",4); add("fijacion_media",2); add("gel_crema",2); break;
      case "caida":      add("caida",4); add("tonico",4); add("circulacion",3); add("cuero_cabelludo",2); break;
      case "puntas":     add("puntas",4); add("reparadora",3); add("selladora",2); break;
      case "volumen":    add("volumen",4); add("liviano",2); break;
      case "brillo":     add("brillo",4); add("selladora",2); add("aceites",2); break;
    }
  });

  // 8. Preocupación secundaria (múltiple)
  (answers.secondaryConcern ?? []).forEach(c => {
    switch (c) {
      case "frizz":      add("anti_frizz",2); add("selladora",1); break;
      case "resequedad": add("nutritiva",2); add("alta_porosidad",1); break;
      case "rotura":     add("reparadora",2); add("queratina",2); break;
      case "definicion": add("definicion",2); add("fijacion_media",1); break;
      case "caida":      add("caida",2); add("tonico",2); break;
      case "puntas":     add("puntas",2); add("reparadora",1); break;
      case "volumen":    add("volumen",2); break;
      case "brillo":     add("brillo",2); add("selladora",1); break;
    }
  });

  // 9. Cuero cabelludo
  switch (answers.scalpConcern) {
    case "normal":    break;
    case "graso":     add("purificante",4); add("limpieza_profunda",3); add("carbon",3); add("cuero_graso",3); break;
    case "seco":      add("cuero_seco",4); add("caspa",4); add("herbal",3); add("suave",2); break;
    case "sensible":  add("sensible",4); add("suave",4); add("cero_sulfatos",3); break;
    case "caida":     add("caida",4); add("tonico",4); add("circulacion",3); add("cebolla",3); add("romero",2); break;
  }

  // 10. Uso de calor
  switch (answers.usesHeat) {
    case "frecuente": add("calor",5); add("termoprotector",5); add("anti_humedad",3); add("difusor",2); break;
    case "ocasional": add("calor",3); add("termoprotector",3); add("difusor",2); break;
    case "nunca":     add("difusor",1); break;
  }

  // 11. Frecuencia de lavado
  switch (answers.washFrequency) {
    case "diario":    add("suave",3); add("cowash",3); add("cero_sulfatos",2); break;
    case "2_3":       add("cowash",2); add("suave",1); break;
    case "semanal":   add("profunda",1); add("purificante",1); break;
    case "quincenal": add("profunda",2); add("purificante",2); add("litro",1); break;
  }

  // 12. Objetivo de peinado
  switch (answers.stylingGoal) {
    case "maximo_rizo":   add("definicion",3); add("fijacion_fuerte",3); add("gel",2); break;
    case "natural_suave": add("fijacion_ligera",3); add("brillo",2); add("liviano",2); break;
    case "volumen":       add("volumen",3); add("raiz",3); add("liviano",2); break;
    case "duracion":      add("anti_frizz",3); add("fijacion_fuerte",3); add("anti_humedad",3); break;
    case "hidratacion":   add("nutritiva",3); add("resequedad",3); add("selladora",2); break;
  }

  // 13. Clima / ambiente
  switch (answers.environment) {
    case "humedo":  add("anti_humedad",3); add("fijacion_fuerte",2); add("anti_frizz",3); break;
    case "seco":    add("resequedad",2); add("nutritiva",2); add("humedad",2); break;
    case "caluroso":add("anti_humedad",2); add("anti_frizz",2); add("atomizador",2); break;
    case "variado": add("anti_frizz",1); add("fijacion_media",1); break;
  }

  // 14. Presupuesto
  switch (answers.budget) {
    case "basico":    add("economico",3); break;
    case "intermedio":break;
    case "premium":   add("premium",3); add("widi",2); add("kativa",2); break;
  }

  return s;
}

// ─── Motor de scoring ─────────────────────────────────────────────────────────

function scoreProduct(productId: number, scoreMap: Record<string, number>): number {
  const tags = PRODUCT_TAGS[productId] ?? [];
  return tags.reduce((total, tag) => total + (scoreMap[tag] ?? 0), 0);
}

const CATEGORY_REASONS: Record<string, string> = {
  limpieza:       "Limpia el cuero cabelludo respetando la hidratación natural de tus rizos",
  acondionador:   "Hidrata y detangle, fundamental para mantener la estructura del rizo",
  mascarilla:     "Tratamiento profundo según las necesidades específicas de tu cabello",
  cremas:         "Define y estiliza adaptado a tu patrón de rizo y necesidades",
  fijacion:       "Fija el estilo con la fuerza justa para tu tipo de rizo",
  termoprotector: "Protege la fibra capilar del daño por calor",
  aceites:        "Sella la cutícula, aporta brillo y reduce el frizz",
  tonico:         "Estimula el cuero cabelludo y fortalece el cabello desde la raíz",
  cepillos:       "Herramienta clave para aplicar productos y definir el rizo",
  accesorios:     "Complemento esencial para completar y proteger tu rutina",
};

function buildScoredRecommendations(answers: Answers, products: Product[]): RecommendedProduct[] {
  const scoreMap = getScoreMap(answers);
  const wantsRoutines = answers.routine ?? ["completa"];

  const wantsWash      = wantsRoutines.includes("lavado")       || wantsRoutines.includes("completa");
  const wantsStyling   = wantsRoutines.includes("peinado")      || wantsRoutines.includes("completa");
  const wantsTools     = wantsRoutines.includes("herramientas") || wantsRoutines.includes("completa");
  const wantsTreatment = wantsRoutines.includes("tratamiento")  || wantsRoutines.includes("completa");

  const inStock = products.filter(
    (p) => (p["Stock Ema Rizos"] ?? 0) > 0 && p.Estado === "Activo"
  );

  // Filtrar por presupuesto
  const budgetFilter = (p: Product): boolean => {
    const price = p["Precio venta externa"] ?? 0;
    if (answers.budget === "basico")   return price <= 45000;
    if (answers.budget === "premium")  return price >= 40000;
    return true;
  };

  const scored: ScoredProduct[] = inStock
    .filter((p) => PRODUCT_TAGS[p.ID] !== undefined)
    .filter(budgetFilter)
    .map((p) => {
      const tags = PRODUCT_TAGS[p.ID] ?? [];
      const cat  = (p.Categoría ?? "").toLowerCase();
      return {
        product: p,
        score: scoreProduct(p.ID, scoreMap),
        reason: CATEGORY_REASONS[cat] ?? "Recomendado para tu perfil capilar",
        category: p.Categoría ?? "",
      };
    })
    .sort((a, b) => b.score - a.score);

  const results: RecommendedProduct[] = [];
  const addedIds = new Set<number>();

  const topFromCategory = (cats: string[], count = 1) => {
    const filtered = scored.filter((s) =>
      cats.some((c) => (s.product.Categoría ?? "").toLowerCase().includes(c.toLowerCase()))
      && !addedIds.has(s.product.ID)
    );
    filtered.slice(0, count).forEach((s) => {
      addedIds.add(s.product.ID);
      results.push({
        id: s.product.ID,
        name: s.product.Nombre ?? "",
        brand: s.product.Marca ?? "",
        category: s.category,
        price: s.product["Precio venta externa"] ?? 0,
        reason: s.reason,
        score: s.score,
      });
    });
  };

  if (wantsWash) {
    topFromCategory(["limpieza"], 1);           // 1 shampoo o co-wash
    topFromCategory(["acondionador"], 1);        // 1 acondicionador
  }
  if (wantsTreatment) {
    topFromCategory(["mascarilla"], 1);          // 1 mascarilla
    topFromCategory(["aceites", "tonico"], 1);   // 1 aceite o tónico
  }
  if (wantsStyling) {
    topFromCategory(["cremas"], 1);              // 1 crema
    topFromCategory(["fijacion"], 1);            // 1 gel/fijador
    if (answers.usesHeat !== "nunca") {
      topFromCategory(["termoprotector"], 1);
    }
  }
  if (wantsTools) {
    topFromCategory(["cepillos"], 2);            // 2 cepillos
    topFromCategory(["accesorios"], 2);          // 2 accesorios
  }

  return results;
}

// ─── Preguntas ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "hairType", step: 1,
    question: "¿Cómo es la forma natural de tu cabello?",
    subtitle: "Sin ningún producto aplicado.",
    type: "single",
    options: [
      { value: "ondulado",   label: "Ondulado",      description: "Forma una S suave, tiende a perder el rizo con la humedad" },
      { value: "rizado",     label: "Rizado",         description: "Rizos en S o espiral definidos, con volumen moderado" },
      { value: "muy_rizado", label: "Muy rizado",     description: "Rizos cerrados en espiral o tirabuzón apretado" },
      { value: "afro",       label: "Afro / Coily",   description: "Rizos muy cerrados, zigzag o patrón apretado, mucho volumen" },
    ],
  },
  {
    id: "porosity", step: 2,
    question: "¿Cómo reacciona tu cabello a la humedad y los productos?",
    subtitle: "La porosidad determina qué tanto tu cabello absorbe y retiene la hidratación.",
    type: "single",
    options: [
      { value: "baja",   label: "Le cuesta absorber",    description: "Los productos se quedan encima, tarda mucho en mojarse" },
      { value: "media",  label: "Absorbe bien",           description: "Penetra fácil, queda hidratado y suave sin resequedad" },
      { value: "alta",   label: "Absorbe demasiado rápido", description: "Se seca muy rápido, se esponja, siempre necesita producto" },
      { value: "no_se",  label: "No estoy segura",        description: "Aún no lo he identificado" },
    ],
  },
  {
    id: "density", step: 3,
    question: "¿Cómo describes la cantidad de tu cabello?",
    subtitle: "No el grosor de cada hebra, sino cuántos pelos tienes en total.",
    type: "single",
    options: [
      { value: "fino",   label: "Poco cabello",   description: "Se ve el cuero cabelludo con facilidad, se siente liviano" },
      { value: "medio",  label: "Cantidad normal", description: "Ni mucho ni poco, volumen estándar" },
      { value: "grueso", label: "Mucho cabello",   description: "Abundante y denso, tarda bastante en secarse" },
    ],
  },
  {
    id: "length", step: 4,
    question: "¿Qué tan largo es tu cabello actualmente?",
    subtitle: "El largo influye en la cantidad y tipo de productos que necesitas.",
    type: "single",
    options: [
      { value: "corto",     label: "Corto",      description: "Por encima de los hombros" },
      { value: "mediano",   label: "Mediano",     description: "A la altura de los hombros" },
      { value: "largo",     label: "Largo",       description: "Por debajo de los hombros" },
      { value: "muy_largo", label: "Muy largo",   description: "Por debajo del pecho" },
    ],
  },
  {
    id: "chemicalTreatment", step: 5,
    question: "¿Tu cabello ha tenido algún tratamiento químico reciente?",
    subtitle: "En los últimos 12 meses.",
    type: "single",
    options: [
      { value: "ninguno",      label: "Ninguno",                  description: "Cabello virgen o sin tratamientos químicos" },
      { value: "tinte",        label: "Tinte o coloración",       description: "Color, mechas, balayage" },
      { value: "decoloracion", label: "Decoloración o blanqueo",  description: "Aclarado, platinum, rubio platino" },
      { value: "alisado",      label: "Alisado o keratina",       description: "Tratamiento para reducir el rizo" },
    ],
  },
  {
    id: "curlyJourney", step: 6,
    question: "¿Cuánto tiempo llevas cuidando tu cabello rizado de forma consciente?",
    subtitle: "Esto nos ayuda a calibrar la complejidad de los productos que necesitas.",
    type: "single",
    options: [
      { value: "nuevo",    label: "Soy nueva en esto",             description: "Estoy empezando a conocer mi cabello" },
      { value: "6meses",   label: "Menos de 6 meses",             description: "Ya tengo las bases, busco afinar mi rutina" },
      { value: "1año",     label: "Entre 6 meses y 1 año",        description: "Tengo experiencia, quiero resultados más precisos" },
      { value: "experta",  label: "Más de 1 año",                 description: "Conozco bien mi cabello y busco optimizar" },
    ],
  },
  {
    id: "mainConcern", step: 7,
    question: "¿Cuáles son tus principales preocupaciones capilares?",
    subtitle: "Elige hasta 3 opciones. Estas tienen el mayor peso en tu recomendación.",
    type: "multiple",
    maxSelections: 3,
    options: [
      { value: "frizz",      label: "Frizz excesivo" },
      { value: "resequedad", label: "Resequedad y opacidad" },
      { value: "rotura",     label: "Rotura y cabello frágil" },
      { value: "definicion", label: "Falta de definición" },
      { value: "caida",      label: "Caída o pérdida de cabello" },
      { value: "puntas",     label: "Puntas abiertas o dañadas" },
      { value: "volumen",    label: "Poco volumen" },
      { value: "brillo",     label: "Falta de brillo y suavidad" },
    ],
  },
  {
    id: "secondaryConcern", step: 8,
    question: "¿Y cuáles son tus preocupaciones secundarias?",
    subtitle: "Elige hasta 2 opciones. Sirven para afinar aún más la recomendación.",
    type: "multiple",
    maxSelections: 2,
    options: [
      { value: "frizz",      label: "Frizz excesivo" },
      { value: "resequedad", label: "Resequedad y opacidad" },
      { value: "rotura",     label: "Rotura y cabello frágil" },
      { value: "definicion", label: "Falta de definición" },
      { value: "caida",      label: "Caída o pérdida de cabello" },
      { value: "puntas",     label: "Puntas abiertas o dañadas" },
      { value: "volumen",    label: "Poco volumen" },
      { value: "brillo",     label: "Falta de brillo y suavidad" },
    ],
  },
  {
    id: "scalpConcern", step: 9,
    question: "¿Cómo describirías tu cuero cabelludo?",
    subtitle: "Esto determina qué tipo de limpieza y tratamiento necesitas.",
    type: "single",
    options: [
      { value: "normal",    label: "Normal",                    description: "Sin exceso de grasa ni resequedad notable" },
      { value: "graso",     label: "Graso",                     description: "Se pone oleoso rápido tras el lavado" },
      { value: "seco",      label: "Seco o con caspa",          description: "Picazón, descamación o sensación de tirantez" },
      { value: "sensible",  label: "Sensible o irritado",       description: "Reacciona fácil a productos, ardor o enrojecimiento" },
      { value: "caida",     label: "Con caída o poco denso",    description: "Noto que se me cae más de lo normal" },
    ],
  },
  {
    id: "usesHeat", step: 10,
    question: "¿Con qué frecuencia usas calor sobre tu cabello?",
    subtitle: "Secador, plancha, rizador u otras herramientas de calor.",
    type: "single",
    options: [
      { value: "frecuente", label: "Frecuentemente",    description: "Varias veces por semana" },
      { value: "ocasional", label: "Ocasionalmente",    description: "Una o dos veces al mes" },
      { value: "nunca",     label: "No uso calor",      description: "Siempre secado natural" },
    ],
  },
  {
    id: "washFrequency", step: 11,
    question: "¿Con qué frecuencia lavas tu cabello?",
    subtitle: "Incluye tanto shampoo como co-wash.",
    type: "single",
    options: [
      { value: "diario",    label: "Todos los días" },
      { value: "2_3",       label: "2 o 3 veces por semana" },
      { value: "semanal",   label: "Una vez a la semana" },
      { value: "quincenal", label: "Cada dos semanas o menos" },
    ],
  },
  {
    id: "stylingGoal", step: 12,
    question: "¿Cuál es tu objetivo principal al peinar?",
    subtitle: "Esto define la fuerza de fijación y el tipo de productos de peinado.",
    type: "single",
    options: [
      { value: "maximo_rizo",   label: "Máxima definición y rizo",   description: "Quiero los rizos más definidos posibles" },
      { value: "natural_suave", label: "Natural y sin rigidez",       description: "Rizos suaves, sin efecto casco ni cartón" },
      { value: "volumen",       label: "Volumen y cuerpo",            description: "Prefiero fullness y movimiento antes que definición" },
      { value: "duracion",      label: "Que dure varios días",        description: "Quiero que el peinado aguante sin retoques" },
      { value: "hidratacion",   label: "Hidratación ante todo",       description: "Mi prioridad es que el cabello se sienta suave y nutrido" },
    ],
  },
  {
id: "environment", step: 13,
  question: "¿En qué ambiente pasas más tiempo durante el día?",
  subtitle: "Barranquilla es una ciudad calurosa y húmeda, pero el ambiente inmediato también importa.",
  type: "single",
  options: [
    { value: "humedo",    label: "Al aire libre frecuentemente",   description: "Caminatas, transporte público, actividades al sol" },
    { value: "caluroso",  label: "Mixto, entre calle y interiores", description: "Sales y entras, entre calor y aire acondicionado" },
    { value: "seco",      label: "Principalmente en interiores",    description: "Oficina, estudio o casa con aire acondicionado todo el día" },
    { value: "variado",   label: "Muy activa, mucho ejercicio",     description: "Deporte, gimnasio o actividades físicas frecuentes" },
  ],
},
  {
    id: "budget", step: 14,
    question: "¿Cuál es tu presupuesto aproximado para tu rutina capilar?",
    subtitle: "Mensual, incluyendo todos los productos.",
    type: "single",
    options: [
      { value: "basico",     label: "Básico",      description: "Hasta $45.000 por producto" },
      { value: "intermedio", label: "Intermedio",  description: "Entre $45.000 y $80.000 por producto" },
      { value: "premium",    label: "Premium",     description: "Sin límite, quiero lo mejor para mi cabello" },
    ],
  },
  {
    id: "routine", step: 15,
    question: "¿Qué partes de tu rutina quieres armar o mejorar?",
    subtitle: "Puedes elegir varias. Solo recibirás productos de las categorías que selecciones.",
    type: "multiple",
    maxSelections: 4,
    options: [
      { value: "lavado",       label: "Rutina de lavado",          description: "Shampoos, co-wash y acondicionadores" },
      { value: "tratamiento",  label: "Tratamiento y nutrición",   description: "Mascarillas, aceites y tónicos" },
      { value: "peinado",      label: "Rutina de peinado",         description: "Cremas, geles y fijadores para definir" },
      { value: "herramientas", label: "Herramientas y accesorios", description: "Cepillos, gorros, toallas y difusores" },
      { value: "completa",     label: "Rutina completa",           description: "Todo lo anterior, una guía integral" },
    ],
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function RoutineTest() {
  const { addToCart } = useCart();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());

  const totalSteps = QUESTIONS.length;
  const currentQuestion = QUESTIONS[step - 1];

  function getAnswer(id: string): Answer {
    return answers[id as keyof Answers] ?? "";
  }
  type Answer = string | string[];

  function handleSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function handleMultiple(value: string) {
    const prev = (answers[currentQuestion.id as keyof Answers] as string[]) ?? [];
    const max = currentQuestion.maxSelections ?? 99;
    if (prev.includes(value)) {
      setAnswers((a) => ({ ...a, [currentQuestion.id]: prev.filter((v) => v !== value) }));
    } else if (prev.length < max) {
      setAnswers((a) => ({ ...a, [currentQuestion.id]: [...prev, value] }));
    }
  }

  function canAdvance(): boolean {
    if (!currentQuestion) return false;
    const ans = answers[currentQuestion.id as keyof Answers];
    if (currentQuestion.type === "multiple") return ((ans as string[] | undefined)?.length ?? 0) > 0;
    return !!ans;
  }

  async function handleNext() {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      try {
        let prods = allProducts;
        if (prods.length === 0) {
          prods = await fetchProducts();
          setAllProducts(prods);
        }
        const recs = buildScoredRecommendations(answers, prods);
        setRecommendations(recs);
        setDone(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setRecommendations([]);
    setDone(false);
    setAddedToCart(new Set());
  }

  function handleAddOne(rec: RecommendedProduct) {
    addToCart({ id: String(rec.id), name: rec.name, price: rec.price, image: `img/products/${rec.id}.png`, type: "product" });
    setAddedToCart((prev) => new Set(prev).add(rec.id));
    toast.success(`${rec.name} agregado al carrito`);
  }

  function handleAddAll() {
    recommendations.forEach((rec) => {
      if (!addedToCart.has(rec.id)) {
        addToCart({ id: String(rec.id), name: rec.name, price: rec.price, image: `img/products/${rec.id}.png`, type: "product" });
      }
    });
    setAddedToCart(new Set(recommendations.map((r) => r.id)));
    toast.success("Rutina completa agregada al carrito");
  }

  const totalPrice = recommendations.reduce((sum, r) => sum + r.price, 0);

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="size-4" />
            Test de Rutina Personalizado
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Descubre tu rutina ideal
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Responde {totalSteps} preguntas sobre tu cabello y te recomendaremos exactamente
            los productos que necesitas, basado en tu perfil único.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-sm">
            {["Tipo de rizo", "Necesidades", "Hábitos", "Presupuesto"].map((label, i) => (
              <div key={label} className="bg-muted rounded-xl p-3 flex flex-col items-center gap-1">
                <span className="text-primary font-bold text-xl">{i + 1}</span>
                <span className="text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-primary text-white rounded-full px-10" onClick={() => setStep(1)}>
            Comenzar test <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  // ── RESULTADOS ─────────────────────────────────────────────────────────────
  if (done) {
    const routineNames = (answers.routine ?? ["completa"])
      .map((r) => ({ lavado: "Lavado", tratamiento: "Tratamiento", peinado: "Peinado", herramientas: "Herramientas", completa: "Completa" }[r] ?? r))
      .join(" + ");

    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="size-4" />
              Rutina: {routineNames}
            </div>
            <h1 className="text-4xl font-bold text-primary mb-3">Tu rutina personalizada</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Seleccionamos estos productos con base en el análisis de tu perfil capilar.
              Cada uno fue elegido porque encaja con tus características específicas.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No encontramos productos disponibles para tu perfil en este momento.{" "}
              <Link to="/products" className="text-primary underline">Ver catálogo completo</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                    <Link to={`/products/${rec.id}`}>
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={`img/products/${rec.id}.png`}
                          alt={rec.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = "img/logo.png"; }}
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground uppercase mb-1">
                        {rec.category} · {rec.brand}
                      </div>
                      <Link to={`/products/${rec.id}`}>
                        <h3 className="text-base font-semibold mb-1 hover:text-primary transition-colors leading-tight">
                          {rec.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3 leading-snug">{rec.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${rec.price.toLocaleString("es-CO")}
                        </span>
                        <Button
                          size="sm"
                          variant={addedToCart.has(rec.id) ? "outline" : "default"}
                          className={addedToCart.has(rec.id) ? "border-green-500 text-green-600" : "bg-primary text-white hover:bg-primary/90"}
                          onClick={() => handleAddOne(rec)}
                          disabled={addedToCart.has(rec.id)}
                        >
                          {addedToCart.has(rec.id) ? (
                            <><CheckCircle className="size-4 mr-1" /> Agregado</>
                          ) : (
                            <><ShoppingCart className="size-4 mr-1" /> Agregar</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {recommendations.length} productos · rutina {routineNames}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    Total estimado: ${totalPrice.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-primary text-white rounded-full px-8"
                    onClick={handleAddAll}
                    disabled={addedToCart.size === recommendations.length}
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    {addedToCart.size === recommendations.length ? "Todo en el carrito" : "Agregar toda la rutina"}
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8" onClick={handleRestart}>
                    <RotateCcw className="size-4 mr-2" /> Repetir test
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── PREGUNTAS ──────────────────────────────────────────────────────────────
  const currentAnswer = getAnswer(currentQuestion.id);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Pregunta {step} de {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% completado</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            Paso {step} · {currentQuestion.id === "routine" ? "Tipo de rutina" : "Perfil capilar"}
          </p>
          <h2 className="text-2xl font-bold text-primary mb-2">{currentQuestion.question}</h2>
          {currentQuestion.subtitle && (
            <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
          )}
          {currentQuestion.type === "multiple" && (
            <p className="text-sm text-primary/70 mt-1 font-medium">
              Selecciona hasta {currentQuestion.maxSelections} opciones.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 mb-10">
          {currentQuestion.options.map((opt) => {
            const isSelected =
              currentQuestion.type === "multiple"
                ? (currentAnswer as string[]).includes(opt.value)
                : currentAnswer === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => currentQuestion.type === "multiple" ? handleMultiple(opt.value) : handleSingle(opt.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3
                  ${isSelected ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40 hover:bg-muted/50"}`}
              >
                <span className="mt-0.5 shrink-0">
                  {isSelected
                    ? <CheckCircle className="size-5 text-primary" />
                    : <Circle className="size-5 text-muted-foreground" />}
                </span>
                <span>
                  <span className="font-semibold text-foreground block">{opt.label}</span>
                  {"description" in opt && opt.description && (
                    <span className="text-sm text-muted-foreground">{opt.description}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={step === 1} className="rounded-full px-6">
            <ArrowLeft className="size-4 mr-2" /> Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canAdvance() || loading}
            className="bg-primary text-white rounded-full px-8"
          >
            {loading ? "Analizando tu perfil..." : step === totalSteps ? "Ver mi rutina" : "Siguiente"}
            {!loading && <ArrowRight className="ml-2 size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}