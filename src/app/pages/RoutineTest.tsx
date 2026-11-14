import { useEffect, useMemo, useState, useRef } from "react";
import { getProducts, productImage } from "../lib/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

// ─────────────────────────────────────────────
//  TIPOS  (basados en el esquema REAL de la DB)
// ─────────────────────────────────────────────
type Answers = Record<string, string>;

type Option = {
  value: string;
  label: string;
  helper?: string;
  image?: string;
};

type Question = {
  id: string;
  question: string;
  helper?: string;
  showImages?: boolean;
  options: Option[];
};

/** Columnas que REALMENTE existen en la tabla products */
type ProductRow = {
  id: number;
  sku?: string | null;
  nombre?: string | null;
  display_name: string;
  categoria?: string | null;
  marca?: string | null;
  formato?: string | null;
  precio: number;
  stock: number;
  descripcion?: string | null;
  descripcion_corta?: string | null;
  tipo_producto?: string | null;   // shampoo | co_wash | mascarilla | acondicionador | crema_de_peinar | gel | gel_en_crema | gelatina | espuma_fijadora | aceite_serum | termoprotector | cepillo | accesorio | tonico_capilar | ...
  paso_rutina?: string | null;     // lavado | tratamiento | acondicionado | finalizacion | sellado | proteccion | herramienta | accesorio | prelavado | cuero_cabelludo
  linea?: string | null;           // general | plex | juba | phyto_manga | cebolla | rizos_y_ondas | vinagre_de_manzana | ...
  estado_stock?: string | null;    // disponible | bajo | agotado
  peso_formula?: string | null;    // ligero | ligera | medio | medio-rico | rico | no_aplica
  featured?: boolean | null;
  preocupaciones?: string[] | null;
  preocupaciones_secundarias?: string[] | null;
  score_base?: number | null;
  tipo_cabello?: string | null;    // todos | rizado | afro | ondulado | niños
  nivel_fijacion?: string | null;  // no_aplica | ninguna | baja | media | media_alta | alta
  discount_pct?: number | null;
  discount_active?: boolean | null;
  imagen_url?: string | null;
};

type RoutineBucket =
  | "limpieza"
  | "acondicionador"
  | "mascarilla"
  | "crema"
  | "gel"
  | "aceite"
  | "accesorio_peinar"
  | "accesorio_dormir";

type ScoredProduct = ProductRow & {
  recommendationScore: number;
  reasons: string[];
  routineBucket: RoutineBucket | null;
};

type ProductProfile = {
  hairType: string;         // ondulado | rizado | muy_rizado | afro
  grosor: string;           // fino | medio | grueso
  densidad: string;         // baja | media | alta
  porosity: string;         // baja | media | alta | nose
  largo: string;            // corto | medio | largo
  scalp: string;            // normal | graso | sensible | mixto
  chemicalHistory: string;  // ninguno | moderado | alto
  heatUsage: string;        // bajo | medio | alto
  primaryGoal: string;      // definicion | frizz | resequedad | rotura | crecimiento | cuero_cabelludo
  secondaryGoal: string;
  washFrequency: string;    // diario | frecuente | semanal | espaciado
  humidityExposure: string; // baja | media | alta
  hold: string;             // sin_fijacion | ligera | media | alta
  weight: string;           // ligero | medio | rico
  finish: string;           // natural | definido | duradero
  accessoryNeed: string;    // ninguno | peinar | dormir | ambos
  budget: string;           // basico | intermedio | premium | sin_limite
  sinLimite: boolean;
};

type RecommendationSet = {
  limpieza?: ScoredProduct;
  mascarilla?: ScoredProduct;
  mascarilla_2?: ScoredProduct;
  mascarilla_3?: ScoredProduct;
  acondicionador?: ScoredProduct;
  crema?: ScoredProduct;
  gel?: ScoredProduct;
  aceite?: ScoredProduct;
  accesorio_peinar?: ScoredProduct;
  accesorio_dormir?: ScoredProduct;
};

type RoutineTestProps = {
  onRecommendationsReady?: (payload: {
    answers: Answers;
    profile: ProductProfile;
    recommendations: RecommendationSet;
  }) => void;
};

// ─────────────────────────────────────────────
//  PREGUNTAS
// ─────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: "hairType",
    question: "¿Cuál es tu patrón de rizo?",
    helper: "Déjalo secar al aire sin producto para verlo mejor.",
    showImages: true,
    options: [
      { value: "ondulado", label: "Ondulado", helper: "Onda suave en forma de S", image: "/img/quiz/hair-ondulado.webp" },
      { value: "rizado", label: "Rizado", helper: "S marcada, espiral abierta", image: "/img/quiz/hair-rizado.webp" },
      { value: "muy_rizado", label: "Muy rizado", helper: "Espiral cerrada o zigzag", image: "/img/quiz/hair-muy-rizado.webp" },
      { value: "afro", label: "Afro / coily", helper: "Rizo muy compacto", image: "/img/quiz/hair-afro.webp" },
    ],
  },
  {
    id: "grosor",
    question: "¿Qué tan grueso es cada hebra de tu cabello?",
    helper: "Toma un solo pelo y compáralo. El fino apenas se ve; el grueso se siente como un hilo de coser.",
    showImages: true,
    options: [
      { value: "fino", label: "Fino", helper: "La hebra casi no se ve", image: "/img/quiz/grosor-fino.webp" },
      { value: "medio", label: "Medio", helper: "Hebra normal, se ve pero no se siente", image: "/img/quiz/grosor-medio.webp" },
      { value: "grueso", label: "Grueso", helper: "La hebra se siente como un hilo", image: "/img/quiz/grosor-grueso.webp" },
    ],
  },
  {
    id: "density",
    question: "¿Cuánto cabello tienes en la cabeza?",
    helper: "Míralo desde arriba con buena luz.",
    showImages: true,
    options: [
      { value: "baja", label: "Poca densidad", helper: "Se ve bastante cuero cabelludo", image: "/img/quiz/densidad-baja.webp" },
      { value: "media", label: "Densidad media", helper: "Se ve algo de cuero cabelludo", image: "/img/quiz/densidad-media.webp" },
      { value: "alta", label: "Mucha densidad", helper: "Casi no se ve el cuero cabelludo", image: "/img/quiz/densidad-alta.webp" },
    ],
  },
  {
    id: "porosity",
    question: "Cuando aplicas agua o crema, ¿cómo reacciona tu cabello?",
    helper: "La porosidad define cuánto absorbe y retiene la hidratación.",
    showImages: true,
    options: [
      { value: "baja", label: "Tarda en absorber", helper: "El agua rueda, cuesta mojarla", image: "/img/quiz/porosidad-baja.webp" },
      { value: "media", label: "Absorbe normal", helper: "Se hidrata y lo retiene bien", image: "/img/quiz/porosidad-media.webp" },
      { value: "alta", label: "Absorbe rápido pero se reseca", helper: "Bebe todo pero se seca enseguida", image: "/img/quiz/porosidad-alta.webp" },
      { value: "nose", label: "No lo sé", helper: "Te ayudaremos igual" },
    ],
  },
  {
    id: "length",
    question: "¿Qué largo tiene tu cabello?",
    options: [
      { value: "corto", label: "Corto", helper: "Por encima de los hombros" },
      { value: "medio", label: "Medio", helper: "Entre hombros y pecho" },
      { value: "largo", label: "Largo", helper: "Debajo del pecho" },
    ],
  },
  {
    id: "scalp",
    question: "¿Cómo se siente tu cuero cabelludo normalmente?",
    options: [
      { value: "normal", label: "Normal", helper: "Sin molestias" },
      { value: "graso", label: "Graso", helper: "Se pone aceitoso rápido" },
      { value: "sensible", label: "Sensible", helper: "Picazón, irritación o caspa" },
      { value: "mixto", label: "Mixto", helper: "Raíces grasas, largos resecos" },
    ],
  },
  {
    id: "chemicalHistory",
    question: "¿Cuánto proceso químico tiene tu cabello?",
    helper: "Decoloraciones, tintes fuertes, alisados, queratinas...",
    options: [
      { value: "ninguno", label: "Sin procesos", helper: "O solo tintes muy suaves" },
      { value: "moderado", label: "Algún proceso puntual", helper: "Mechas, tinte o keratina ocasional" },
      { value: "alto", label: "Procesado", helper: "Decoloraciones o procesos frecuentes" },
    ],
  },
  {
    id: "heatUsage",
    question: "¿Con qué frecuencia usas herramientas de calor?",
    helper: "Plancha, secador sin difusor, tenaza...",
    options: [
      { value: "bajo", label: "Casi nunca" },
      { value: "medio", label: "1–2 veces por semana" },
      { value: "alto", label: "3 o más veces por semana" },
    ],
  },
  {
    id: "primaryGoal",
    question: "¿Qué quieres mejorar principalmente?",
    helper: "Lo que más te molesta de tu cabello hoy.",
    options: [
      { value: "definicion", label: "Definición de rizos / ondas" },
      { value: "frizz", label: "Frizz y volumen desordenado" },
      { value: "resequedad", label: "Resequedad / hidratación" },
      { value: "rotura", label: "Daño, puntas o quiebre" },
      { value: "crecimiento", label: "Crecer y fortalecer" },
      { value: "cuero_cabelludo", label: "Cuero cabelludo", helper: "Grasitud, picazón, caspa" },
    ],
  },
  {
    id: "secondaryGoal",
    question: "¿Y un objetivo secundario?",
    options: [
      { value: "definicion", label: "Más definición" },
      { value: "frizz", label: "Menos frizz" },
      { value: "resequedad", label: "Más hidratación y suavidad" },
      { value: "rotura", label: "Reparar daño" },
      { value: "brillo", label: "Más brillo" },
      { value: "volumen", label: "Controlar el volumen" },
    ],
  },
  {
    id: "washFrequency",
    question: "¿Cada cuánto lavas el cabello?",
    helper: "Piensa en una semana normal.",
    options: [
      { value: "diario", label: "Casi todos los días" },
      { value: "frecuente", label: "Cada 2–3 días" },
      { value: "semanal", label: "1–2 veces por semana" },
      { value: "espaciado", label: "Cada 10 días o más" },
    ],
  },
  {
    id: "humidityExposure",
    question: "¿Cuánta humedad, calor o sudor enfrentas en tu día a día?",
    options: [
      { value: "baja", label: "Poca", helper: "Ambientes con aire acondicionado" },
      { value: "media", label: "Normal", helper: "Algo de calle y algo de aire" },
      { value: "alta", label: "Bastante", helper: "Mucho sol, calle, gym o transporte" },
    ],
  },
  {
    id: "hold",
    question: "¿Cómo prefieres sentir tu peinado?",
    options: [
      { value: "sin_fijacion", label: "Muy suave / sin fijación" },
      { value: "ligera", label: "Ligera, natural y ordenado" },
      { value: "media", label: "Media, con forma" },
      { value: "alta", label: "Alta, definición marcada y duradera" },
    ],
  },
  {
    id: "weight",
    question: "¿Cómo quieres sentir los productos?",
    options: [
      { value: "ligero", label: "Muy liviano, que casi no se sienta" },
      { value: "medio", label: "Intermedio, hidrata sin pesar" },
      { value: "rico", label: "Nutritivo, denso" },
    ],
  },
  {
    id: "finish",
    question: "¿Qué resultado final buscas?",
    options: [
      { value: "natural", label: "Natural, suave y con movimiento" },
      { value: "definido", label: "Rizos bien marcados" },
      { value: "duradero", label: "Muy definido y duradero varios días" },
    ],
  },
  {
    id: "accessoryNeed",
    question: "¿Quieres que te recomendemos accesorios?",
    helper: "Gorros, cepillos, difusores, scrunchies, etc.",
    options: [
      { value: "ninguno", label: "No, solo productos de rutina" },
      { value: "peinar", label: "Sí, para peinar y definir" },
      { value: "dormir", label: "Sí, para dormir y proteger" },
      { value: "ambos", label: "Sí, ambos tipos" },
    ],
  },
  {
    id: "budget",
    question: "¿Cuál es tu rango de presupuesto por producto?",
    helper: "Sin importar el precio siempre recomendamos la opción de mayor calidad disponible.",
    options: [
      { value: "basico", label: "Hasta $45.000", helper: "Básico" },
      { value: "intermedio", label: "$45.000 – $80.000", helper: "Intermedio" },
      { value: "premium", label: "Más de $80.000", helper: "Premium" },
      { value: "sin_limite", label: "El precio no importa", helper: "Quiero lo mejor sin importar el costo" },
    ],
  },
];

// ─────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────
const lower = (v: string | null | undefined) => (v || "").toLowerCase().trim();
const formatPrice = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);
const titleize = (v: string | null | undefined) =>
  (v || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "No especificado";

function getProductImage(product: ProductRow) {
  return productImage(product);
}

/** Convierte preocupaciones (array o null) en texto plano para búsqueda */
function getConcernsText(product: ProductRow): string {
  const p1 = Array.isArray(product.preocupaciones) ? product.preocupaciones : [];
  const p2 = Array.isArray(product.preocupaciones_secundarias) ? product.preocupaciones_secundarias : [];
  return [...p1, ...p2].join(" ").toLowerCase();
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((n) => text.includes(n.toLowerCase()));
}

// ─────────────────────────────────────────────
//  BUCKET DE RUTINA  (basado en tipo_producto y paso_rutina reales)
// ─────────────────────────────────────────────
function getRoutineBucket(product: ProductRow): RoutineBucket | null {
  const tipo = lower(product.tipo_producto);
  const paso = lower(product.paso_rutina);
  const name = lower(product.display_name || product.nombre || "");

  // ── Accesorios: LISTA BLANCA estricta ────────────────────────────────────
  // Solo entran herramientas capilares reales. Todo lo demás (muñecas,
  // decorativos, etc.) queda fuera con bucket = null.

  const SLEEP_KEYWORDS  = ["gorro", "satin", "satén", "bonnet", "funda", "almohada"];
  const SLEEP_EXCLUDE   = ["eléctrico", "electrico", "térmico", "termico"];
  const STYLE_KEYWORDS  = [
    "cepillo", "peine", "difusor", "atomizador", "spray bottle",
    "scrunchi", "scrunchie", "toalla", "turbante", "gancho", "pinza",
    "aplicador", "gorro eléctrico", "gorro termico", "gorro térmico",
  ];

  if (tipo === "cepillo" || tipo === "pinza_seccionadora") return "accesorio_peinar";

  if (tipo === "accesorio" || paso === "herramienta" || paso === "accesorio") {
    // Dormir
    if (SLEEP_KEYWORDS.some((k) => name.includes(k)) && !SLEEP_EXCLUDE.some((k) => name.includes(k)))
      return "accesorio_dormir";
    // Peinar (solo si el nombre contiene una keyword de herramienta capilar)
    if (STYLE_KEYWORDS.some((k) => name.includes(k)))
      return "accesorio_peinar";
    // No es una herramienta capilar reconocida → descartar
    return null;
  }

  // Limpieza
  if (tipo === "shampoo" || tipo === "co_wash" || paso === "lavado")
    return "limpieza";

  // Mascarilla / Tratamiento
  // OJO: "mantequilla" en el nombre → crema (no tratamiento)
  if (name.includes("mantequilla"))
    return "crema";

  if (tipo === "mascarilla" || paso === "tratamiento")
    return "mascarilla";

  // Acondicionador
  if (tipo === "acondicionador" || paso === "acondicionado")
    return "acondicionador";

  // Crema de peinar / Leave-in
  if (tipo === "crema_de_peinar" || tipo === "leave_in" || tipo === "activador_rizos")
    return "crema";

  // Gel / Fijadores
  if (
    tipo === "gel" ||
    tipo === "gel_en_crema" ||
    tipo === "gelatina" ||
    tipo === "espuma_fijadora" ||
    tipo === "mousse"
  )
    return "gel";

  // Aceite / Sérum / Termoprotector
  if (
    tipo === "aceite_serum" ||
    tipo === "aceite" ||
    tipo === "termoprotector" ||
    paso === "sellado" ||
    paso === "prelavado" ||
    paso === "proteccion"
  )
    return "aceite";

  // Tónico capilar → aceite (categoría más cercana en rutina)
  if (tipo === "tonico_capilar" || paso === "cuero_cabelludo")
    return "aceite";

  return null;
}

// ─────────────────────────────────────────────
//  PERFIL DEL USUARIO
// ─────────────────────────────────────────────
export function buildProductProfile(answers: Answers): ProductProfile {
  return {
    hairType: answers.hairType || "rizado",
    grosor: answers.grosor || "medio",
    densidad: answers.density || "media",
    porosity: answers.porosity || "media",
    largo: answers.length || "medio",
    scalp: answers.scalp || "normal",
    chemicalHistory: answers.chemicalHistory || "ninguno",
    heatUsage: answers.heatUsage || "bajo",
    primaryGoal: answers.primaryGoal || "definicion",
    secondaryGoal: answers.secondaryGoal || "frizz",
    washFrequency: answers.washFrequency || "frecuente",
    humidityExposure: answers.humidityExposure || "media",
    hold: answers.hold || "media",
    weight: answers.weight || "medio",
    finish: answers.finish || "definido",
    accessoryNeed: answers.accessoryNeed || "ninguno",
    budget: answers.budget === "sin_limite" ? "premium" : answers.budget || "intermedio",
    sinLimite: answers.budget === "sin_limite",
  };
}

// ─────────────────────────────────────────────
//  SCORING  (usa ÚNICAMENTE columnas que existen en la DB)
// ─────────────────────────────────────────────

/** Keywords por objetivo → para buscar en preocupaciones */
const GOAL_KEYWORDS: Record<string, string[]> = {
  definicion: ["definici", "rizos", "ondas", "curl", "activador"],
  frizz: ["frizz", "anti-frizz", "antifrizz", "humedad", "sellado", "anti humedad"],
  resequedad: ["hidrat", "humect", "nutri", "suavidad", "moist", "hidronutri"],
  rotura: ["repar", "fortale", "plex", "queratina", "daño", "quiebre", "fragiliz", "botox orgánico"],
  crecimiento: ["crecim", "fortale", "cebolla", "caída"],
  cuero_cabelludo: ["cuero cabelludo", "scalp", "detox", "purificant", "caspa", "graso", "equilibrio del cuero"],
  brillo: ["brillo", "shine", "luminosidad"],
  volumen: ["volumen", "peso", "livian"],
};

/** Score de compatibilidad de tipo_cabello (producto vs usuario) */
function hairTypeScore(productTipo: string | null | undefined, userHairType: string): number {
  const pt = lower(productTipo);
  if (!pt || pt === "" || pt === "todos") return 8; // genérico, pequeño bonus

  // Excluir productos para niños directamente en scoreProduct
  if (pt === "niños") return -999;

  const matrix: Record<string, Record<string, number>> = {
    ondulado: { ondulado: 25, rizado: -5,  afro: -15 },
    rizado:   { rizado: 25,   ondulado: 8,  afro: -5  },
    muy_rizado: { rizado: 18, afro: 22,     ondulado: -10 },
    afro:     { afro: 25,     rizado: 8,    ondulado: -15 },
  };

  return matrix[userHairType]?.[pt] ?? 0;
}

/** Precio efectivo tras aplicar descuento (si discount_active = true) */
function getEffectivePrice(product: ProductRow): number {
  const base = product.precio || 0;
  if (product.discount_active && product.discount_pct && product.discount_pct > 0) {
    return Math.round(base * (1 - product.discount_pct / 100));
  }
  return base;
}

/** Categoría de presupuesto según precio efectivo del producto */
function getPriceCategory(precio: number): "basico" | "intermedio" | "premium" {
  if (precio <= 45000) return "basico";
  if (precio <= 80000) return "intermedio";
  return "premium";
}

/** Score de presupuesto (usa precio con descuento aplicado) */
function budgetScore(product: ProductRow, profile: ProductProfile): { pts: number; reason: string } {
  const precio = getEffectivePrice(product); // ← precio real que paga el usuario
  const cat = getPriceCategory(precio);

  if (profile.sinLimite) {
    // Sin límite: usa precio base (no descontado) para ordenar calidad
    const precioBase = product.precio || 0;
    const pts = Math.round(Math.min(precioBase / 200000, 1) * 28);
    return { pts, reason: "Seleccionado como la mejor opción disponible." };
  }

  if (cat === profile.budget) return { pts: 18, reason: "Encaja perfecto con tu presupuesto." };

  // Un escalón arriba → penalización moderada
  if (profile.budget === "basico" && cat === "intermedio") return { pts: -8, reason: "" };
  // Dos escalones arriba → penalización fuerte
  if (profile.budget === "basico" && cat === "premium") return { pts: -30, reason: "" };
  // Intermedio y es premium → penalización
  if (profile.budget === "intermedio" && cat === "premium") return { pts: -15, reason: "" };
  // Por debajo del presupuesto → slight bonus (ahorro)
  if (profile.budget === "premium" && cat !== "premium") return { pts: 5, reason: "" };
  if (profile.budget === "intermedio" && cat === "basico") return { pts: 5, reason: "" };

  return { pts: 0, reason: "" };
}

/** Score de fijación (crítico para gels y cremas) */
function fijacionScore(product: ProductRow, profile: ProductProfile, bucket: RoutineBucket | null): number {
  if (bucket !== "gel" && bucket !== "crema") return 0;

  const productFij = lower(product.nivel_fijacion);
  if (!productFij || productFij === "no_aplica" || productFij === "ninguna") return 2;

  const holdMap: Record<string, string[]> = {
    sin_fijacion: ["baja", "ninguna", "no_aplica"],
    ligera:       ["baja", "ligera", "ligera_media"],
    media:        ["media", "ligera_media", "media_alta"],
    alta:         ["alta", "media_alta"],
  };

  const preferred = holdMap[profile.hold] || ["media"];
  if (preferred.includes(productFij)) return 18;

  // Penalizar mismatch fuerte
  if (profile.hold === "sin_fijacion" && ["alta", "media_alta"].includes(productFij)) return -18;
  if (profile.hold === "alta" && ["baja", "ninguna"].includes(productFij)) return -12;

  return 0;
}

/** Score de peso de fórmula */
function pesoFormulaScore(product: ProductRow, profile: ProductProfile): number {
  const pf = lower(product.peso_formula);
  if (!pf || pf === "no_aplica") return 0;

  const weightMap: Record<string, string[]> = {
    ligero: ["ligero", "ligera"],
    medio:  ["medio", "ligero", "ligera"],
    rico:   ["rico", "medio-rico", "medio"],
  };

  // Ajuste por grosor
  let userWeight = profile.weight;
  if (profile.grosor === "fino" && userWeight === "rico") userWeight = "medio";
  if (profile.grosor === "grueso" && userWeight === "ligero") userWeight = "medio";

  const preferred = weightMap[userWeight] || ["medio"];
  if (preferred.includes(pf)) return 12;

  // Penalizar mismatch extremo
  if (userWeight === "ligero" && pf === "rico") return -12;
  if (userWeight === "rico" && pf === "ligero") return -8;

  return 0;
}

/** Score por preocupaciones del producto vs objetivos del usuario */
function concernsScore(
  concernsText: string,
  primaryGoal: string,
  secondaryGoal: string
): { pts: number; primaryMatch: boolean } {
  let pts = 0;
  const primaryKw = GOAL_KEYWORDS[primaryGoal] || [];
  const secondaryKw = GOAL_KEYWORDS[secondaryGoal] || [];
  const primaryMatch = includesAny(concernsText, primaryKw);

  if (primaryMatch) pts += 25;
  if (includesAny(concernsText, secondaryKw)) pts += 12;

  return { pts, primaryMatch };
}

/** Score por cuero cabelludo */
function scalpScore(concernsText: string, scalp: string): number {
  if (scalp === "normal") return 0;
  if (scalp === "graso" && includesAny(concernsText, ["graso", "limpieza profunda", "purificant", "detox", "control de residuos", "equilibrio"])) return 12;
  if (scalp === "sensible" && includesAny(concernsText, ["sensible", "caspa", "picazón", "suave"])) return 12;
  if (scalp === "mixto" && includesAny(concernsText, ["graso", "equilibrio", "mixto"])) return 8;
  return 0;
}

/** Score por línea (plex para procesado químico) */
function lineaScore(product: ProductRow, profile: ProductProfile): number {
  const linea = lower(product.linea);
  if (linea === "plex" || linea === "plex_fauno") {
    if (profile.chemicalHistory === "alto") return 20;
    if (profile.chemicalHistory === "moderado") return 10;
  }
  if (linea === "cebolla" && profile.primaryGoal === "crecimiento") return 12;
  if (linea === "vinagre_de_manzana" && (profile.scalp === "graso" || profile.scalp === "mixto" || profile.chemicalHistory !== "ninguno")) return 10;
  return 0;
}

function scoreProduct(product: ProductRow, profile: ProductProfile): ScoredProduct | null {
  // Excluir sin stock
  if ((product.stock || 0) <= 0) return null;

  // Excluir productos para niños
  if (lower(product.tipo_cabello) === "niños") return null;

  const bucket = getRoutineBucket(product);
  const concernsText = getConcernsText(product);
  const reasons: string[] = [];

  let score = Number(product.score_base || 50);

  // ── 1. Tipo de cabello ────────────────────────────
  const htScore = hairTypeScore(product.tipo_cabello, profile.hairType);
  if (htScore === -999) return null; // niños
  score += htScore;
  if (htScore >= 20) reasons.push("Va muy bien con tu tipo de cabello.");
  else if (htScore >= 10) reasons.push("Compatible con tu tipo de cabello.");

  // ── 2. Presupuesto ────────────────────────────────
  const { pts: bpts, reason: breason } = budgetScore(product, profile);
  score += bpts;
  if (breason) reasons.push(breason);

  // ── 3. Preocupaciones (objetivo principal y secundario) ───
  const { pts: cpts, primaryMatch } = concernsScore(concernsText, profile.primaryGoal, profile.secondaryGoal);
  score += cpts;
  if (primaryMatch) reasons.push("Atiende tu objetivo principal.");

  // ── 4. Cuero cabelludo ────────────────────────────
  score += scalpScore(concernsText, profile.scalp);

  // ── 5. Fijación (gels y cremas) ───────────────────
  score += fijacionScore(product, profile, bucket);

  // ── 6. Peso de fórmula ────────────────────────────
  score += pesoFormulaScore(product, profile);
  if (pesoFormulaScore(product, profile) > 0) {
    const pf = lower(product.peso_formula);
    if (profile.grosor === "fino" && ["ligero", "ligera"].includes(pf))
      reasons.push("Fórmula liviana, ideal para cabello fino.");
    if (profile.grosor === "grueso" && ["rico", "medio-rico"].includes(pf))
      reasons.push("Fórmula nutritiva para cabello grueso.");
  }

  // ── 7. Línea especializada (plex, cebolla, vinagre) ──
  score += lineaScore(product, profile);

  // ── 8. Featured ───────────────────────────────────
  if (product.featured) score += 12;

  // ── 9. Humedad / clima ────────────────────────────
  if (profile.humidityExposure === "alta" && includesAny(concernsText, ["frizz", "anti-frizz", "antifrizz", "humedad"])) {
    score += 12;
    if (!reasons.some((r) => r.includes("objetivo"))) reasons.push("Responde bien a la humedad.");
  }

  // ── 10. Acabado deseado ───────────────────────────
  if (profile.finish === "duradero" && bucket === "gel") score += 14;
  if (profile.finish === "definido" && (bucket === "crema" || bucket === "gel")) score += 8;
  if (profile.finish === "natural" && bucket === "crema") score += 8;

  // ── 11. Calor / daño ──────────────────────────────
  if (profile.heatUsage === "alto" && includesAny(concernsText, ["repar", "fortale", "plex", "protec", "queratina"])) score += 10;

  // ── 12. Mascarilla profunda para objetivos específicos ──
  if (bucket === "mascarilla" && (profile.primaryGoal === "resequedad" || profile.primaryGoal === "rotura")) {
    score += 15;
    reasons.push("Tratamiento profundo para tu objetivo principal.");
  }

  // ── 13. Penalización "pelo fino" para no-finos ────────
  // Evita que el Gel Escultor en Crema She Is domine sin importar el perfil
  if (includesAny(concernsText, ["pelo fino"]) && profile.grosor !== "fino") {
    score -= 28;
  }

  // ── 14. Accesorios ────────────────────────────────
  if (bucket === "accesorio_peinar" && ["peinar", "ambos"].includes(profile.accessoryNeed)) {
    score += 22;
    reasons.push("Accesorio para peinar y definir.");
  }
  if (bucket === "accesorio_dormir" && ["dormir", "ambos"].includes(profile.accessoryNeed)) {
    score += 22;
    reasons.push("Protege tu peinado mientras duermes.");
  }
  if ((bucket === "accesorio_peinar" || bucket === "accesorio_dormir") && profile.accessoryNeed === "ninguno") {
    score -= 60; // Si no quiere accesorios, los borramos de la competencia
  }

  // ── 15. Estado de stock ───────────────────────────
  if (lower(product.estado_stock) === "disponible") score += 5;

  return {
    ...product,
    recommendationScore: Math.round(score),
    reasons: [...new Set(reasons)].slice(0, 3),
    routineBucket: bucket,
  };
}

// ─────────────────────────────────────────────
//  SELECCIÓN POR BUCKET
// ─────────────────────────────────────────────
function pickBestByBucket(
  products: ScoredProduct[],
  bucket: RoutineBucket,
  usedIds: Set<number>
): ScoredProduct | undefined {
  const found = products
    .filter((p) => p.routineBucket === bucket && !usedIds.has(p.id))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)[0];
  if (found) usedIds.add(found.id);
  return found;
}

/**
 * Cuántas mascarillas recomendar según el perfil:
 *
 * - sin_limite + cabello muy dañado → 3
 * - sin_limite + cualquier condición → 2
 * - premium o intermedio + daño presente → 2
 * - basico sin daño → 1 (siempre priorizar tratamientos)
 *
 * "Daño severo": procesamiento alto, queratina/decoloración, alta porosidad
 * con objetivo de reparación, o combinación de factores.
 */
function getMascarillaCount(profile: ProductProfile): number {
  const severellyDamaged =
    profile.chemicalHistory === "alto" ||
    (profile.primaryGoal === "rotura" && profile.porosity === "alta") ||
    (profile.chemicalHistory !== "ninguno" && profile.porosity === "alta");

  const hasDamage =
    profile.chemicalHistory !== "ninguno" ||
    profile.primaryGoal === "rotura" ||
    profile.porosity === "alta";

  if (profile.sinLimite) return severellyDamaged ? 3 : 2;
  if (profile.budget === "premium" && hasDamage) return 2;
  if (profile.budget === "intermedio" && severellyDamaged) return 2;
  return 1;
}

function buildRecommendationSet(
  products: ScoredProduct[],
  profile: ProductProfile
): RecommendationSet {
  const usedIds = new Set<number>();
  const mascarillaCount = getMascarillaCount(profile);

  const set: RecommendationSet = {
    limpieza:      pickBestByBucket(products, "limpieza", usedIds),
    // ORDEN CORRECTO: mascarillas PRIMERO, luego acondicionador sella la cutícula
    mascarilla:    pickBestByBucket(products, "mascarilla", usedIds),
    mascarilla_2:  mascarillaCount >= 2 ? pickBestByBucket(products, "mascarilla", usedIds) : undefined,
    mascarilla_3:  mascarillaCount >= 3 ? pickBestByBucket(products, "mascarilla", usedIds) : undefined,
    acondicionador: pickBestByBucket(products, "acondicionador", usedIds),
    crema:         pickBestByBucket(products, "crema", usedIds),
    gel:           pickBestByBucket(products, "gel", usedIds),
    aceite:        pickBestByBucket(products, "aceite", usedIds),
  };
  if (["peinar", "ambos"].includes(profile.accessoryNeed))
    set.accesorio_peinar = pickBestByBucket(products, "accesorio_peinar", usedIds);
  if (["dormir", "ambos"].includes(profile.accessoryNeed))
    set.accesorio_dormir = pickBestByBucket(products, "accesorio_dormir", usedIds);
  return set;
}

// ─────────────────────────────────────────────
//  ORDEN DE RUTINA (mascarilla → acondicionador: el acondicionador sella la cutícula DESPUÉS del tratamiento)
// ─────────────────────────────────────────────
const ROUTINE_ORDER: { key: keyof RecommendationSet; label: string; sublabel?: string }[] = [
  { key: "limpieza",       label: "Limpieza" },
  { key: "mascarilla",     label: "Tratamiento 1",   sublabel: "Mascarilla principal" },
  { key: "mascarilla_2",   label: "Tratamiento 2",   sublabel: "Rótala en tus diferentes lavadas" },
  { key: "mascarilla_3",   label: "Tratamiento 3",   sublabel: "Para los días de mayor nutrición e hidratación" },
  { key: "acondicionador", label: "Acondicionador",  sublabel: "Sella la cutícula después del tratamiento" },
  { key: "crema",          label: "Crema para peinar" },
  { key: "gel",            label: "Gel / Gelatina" },
  { key: "aceite",         label: "Aceite / Sérum" },
];

// ─────────────────────────────────────────────
//  CRONOGRAMA CAPILAR
// ─────────────────────────────────────────────
type DayType = "lavado_completo" | "lavado_ligero" | "refresh" | "descanso";

type ScheduleDay = {
  name: string;
  type: DayType;
  steps: string[];
};

const WEEK_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function buildSchedule(profile: ProductProfile): {
  days: ScheduleDay[];
  mascarillaNote: string | null;
} {
  // Tipo de cada día (por índice 0=Lunes … 6=Domingo), valor por defecto: descanso
  const types: DayType[] = Array(7).fill("descanso");

  /**
   * Distribución semanal según frecuencia declarada:
   *
   * diario / frecuente  → 3 lavados completos + 1 refresh
   *   Lun: completo · Mié: completo · Jue: refresh · Sáb: completo
   *
   * semanal (1–2/sem)   → 1 lavado completo + 1 lavado ligero + 1 refresh
   *   Lun: completo · Jue: ligero · Sáb: refresh
   *
   * espaciado (≥10 días)→ 1 lavado completo + 1 refresh
   *   Lun: completo · Jue: refresh
   */
  switch (profile.washFrequency) {
    case "diario":
    case "frecuente":
      types[0] = "lavado_completo"; // Lunes
      types[2] = "lavado_completo"; // Miércoles
      types[3] = "refresh";          // Jueves
      types[5] = "lavado_completo"; // Sábado
      break;
    case "semanal":
      types[0] = "lavado_completo"; // Lunes
      types[3] = "lavado_ligero";   // Jueves
      types[5] = "refresh";          // Sábado
      break;
    case "espaciado":
      types[0] = "lavado_completo"; // Lunes
      types[3] = "refresh";          // Jueves
      break;
  }

  const stepsMap: Record<DayType, string[]> = {
    lavado_completo: ["Champú", "Mascarilla", "Acondicionador", "Crema para peinar", "Gel"],
    lavado_ligero:   ["Champú", "Acondicionador", "Crema para peinar", "Gel"],
    refresh:         ["Crema para peinar", "Gel"],
    descanso:        [],
  };

  const days: ScheduleDay[] = WEEK_DAYS.map((name, i) => ({
    name,
    type: types[i],
    steps: stepsMap[types[i]],
  }));

  // Nota de rotación si hay más de una mascarilla
  const mc = getMascarillaCount(profile);
  const washDayNames = days
    .filter((d) => d.type === "lavado_completo")
    .map((d) => d.name);

  let mascarillaNote: string | null = null;
  if (mc === 2) {
    mascarillaNote = `En los días de lavado completo (${washDayNames.join(", ")}), alterna entre el Tratamiento 1 y el Tratamiento 2 según el estado de tu cabello ese día.`;
  } else if (mc === 3) {
    mascarillaNote = `En los días de lavado completo (${washDayNames.join(", ")}), rota entre los tres tratamientos. Usa el de mayor nutrición cuando el cabello esté más reseco o fatigado.`;
  }

  return { days, mascarillaNote };
}

// ─────────────────────────────────────────────
//  COMPONENTE CRONOGRAMA
// ─────────────────────────────────────────────
function ScheduleSection({ profile }: { profile: ProductProfile }) {
  const { days, mascarillaNote } = buildSchedule(profile);

  const TYPE_CONFIG: Record<DayType, { label: string; pill: string }> = {
    lavado_completo: { label: "Lavado completo", pill: "bg-primary/10 text-primary font-semibold" },
    lavado_ligero:   { label: "Lavado ligero",   pill: "bg-sky-100 text-sky-700 font-semibold" },
    refresh:         { label: "Refresh",          pill: "bg-amber-100 text-amber-700 font-semibold" },
    descanso:        { label: "Descanso",         pill: "bg-muted text-muted-foreground" },
  };

  const LEGEND = [
    {
      type: "lavado_completo" as DayType,
      description: "Champú, mascarilla(s), acondicionador y finalizadores. Paso completo de tratamiento.",
    },
    {
      type: "lavado_ligero" as DayType,
      description: "Champú y acondicionador. Sin mascarilla. Ideal para limpiezas intermedias.",
    },
    {
      type: "refresh" as DayType,
      description: "Crema para peinar y gel sobre el cabello seco o ligeramente humedecido. Sin champú.",
    },
    {
      type: "descanso" as DayType,
      description: "Sin producto. El cabello descansa y se recupera.",
    },
  ];

  return (
    <section>
      <div className="mb-5 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary">Cronograma capilar semanal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribución recomendada para optimizar el estado de tu cabello a lo largo de la semana.
        </p>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-semibold text-foreground w-28">Día</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground w-44">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Pasos</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={day.name} className={`border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3 font-medium text-foreground">{day.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-xs ${TYPE_CONFIG[day.type].pill}`}>
                    {TYPE_CONFIG[day.type].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {day.steps.length > 0 ? day.steps.join(" · ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-5 space-y-2 rounded-2xl border bg-muted/30 p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Leyenda</p>
        {LEGEND.map(({ type, description }) => (
          <div key={type} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 shrink-0 inline-block rounded-full px-3 py-0.5 text-xs ${TYPE_CONFIG[type].pill}`}>
              {TYPE_CONFIG[type].label}
            </span>
            <span className="text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>

      {/* Nota de rotación de mascarillas */}
      {mascarillaNote && (
        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          <span className="font-semibold text-primary">Rotación de tratamientos — </span>
          {mascarillaNote}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function RoutineTest({ onRecommendationsReady }: RoutineTestProps) {
  const { addToCart } = useCart();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendationSet, setRecommendationSet] = useState<RecommendationSet>({});

  const current = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const selected = current ? answers[current.id] : undefined;

  const profile = useMemo(() => buildProductProfile(answers), [answers]);

  const routineItems = useMemo(
    () =>
      ROUTINE_ORDER.map(({ key, label, sublabel }) => ({
        key,
        label,
        sublabel,
        product: recommendationSet[key],
      })).filter((item) => !!item.product) as {
        key: keyof RecommendationSet;
        label: string;
        sublabel?: string;
        product: ScoredProduct;
      }[],
    [recommendationSet]
  );

  const extraItems = useMemo(
    () =>
      [
        { key: "accesorio_peinar", label: "Extra para peinar", product: recommendationSet.accesorio_peinar },
        { key: "accesorio_dormir", label: "Extra para dormir", product: recommendationSet.accesorio_dormir },
      ].filter((item) => !!item.product) as {
        key: keyof RecommendationSet;
        label: string;
        product: ScoredProduct;
      }[],
    [recommendationSet]
  );

  const allCartProducts = useMemo(() => {
    const map = new Map<number, ScoredProduct>();
    [...routineItems, ...extraItems].forEach((item) => map.set(item.product.id, item.product));
    return Array.from(map.values());
  }, [routineItems, extraItems]);

  const handleSelect = (value: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps - 1) { setStep((prev) => prev + 1); return; }
    setDone(true);
  };

  const handleBack = () => setStep((prev) => Math.max(0, prev - 1));

  const handleRestart = () => {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setDone(false);
    setLoading(false);
    setError(null);
    setRecommendationSet({});
  };

  const handleAddToCart = (product: ScoredProduct, quantity = 1, showToast = true) => {
    if (!product) return;
    const image = getProductImage(product) || "/img/logo.webp";
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: String(product.id), name: product.display_name, price: Number(product.precio || 0), image, type: "product" });
    }
    if (showToast) toast.success(`${quantity} × ${product.display_name} agregado al carrito`);
  };

  const handleAddOne = (product: ScoredProduct) => handleAddToCart(product, 1, true);

  const handleAddAllToCart = () => {
    if (!allCartProducts.length) return;
    allCartProducts.forEach((p) => handleAddToCart(p, 1, false));
    toast.success(`${allCartProducts.length} productos agregados al carrito`);
  };

  // Fetch y score de productos al completar el test
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!done) return;
      setLoading(true);
      setError(null);

      let data: ProductRow[] = [];
      try {
        data = (await getProducts({ limit: 400 })) as ProductRow[];
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudieron cargar los productos.");
        setLoading(false);
        return;
      }

      const scored = (data || [])
        .map((item) => scoreProduct(item as ProductRow, profile))
        .filter(Boolean)
        .sort((a, b) => (b?.recommendationScore || 0) - (a?.recommendationScore || 0)) as ScoredProduct[];

      setRecommendationSet(buildRecommendationSet(scored, profile));
      setLoading(false);
    };
    fetchRecommendations();
  }, [done, profile]);

  useEffect(() => {
    if (!done || loading) return;
    onRecommendationsReady?.({ answers, profile, recommendations: recommendationSet });
  }, [answers, done, loading, onRecommendationsReady, profile, recommendationSet]);

  // ── Pantalla inicio ────────────────────────
  if (!started) {
    return (
      <div className="py-10 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            Test capilar
          </div>
          <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold text-primary">
            Descubre tu rutina ideal
          </h1>
          <p className="mb-3 md:mb-4 text-base md:text-lg text-muted-foreground">
            Responde {totalSteps} preguntas sobre tu cabello y armamos una rutina
            personalizada con los productos disponibles.
          </p>
          <p className="mb-8 md:mb-10 text-sm md:text-base text-muted-foreground">
            En menos de 3 minutos verás tu limpieza, tratamiento, definición y finalización ideal.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-primary px-8 md:px-10 text-white"
            onClick={() => setStarted(true)}
          >
            Comenzar test
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Pantalla resultados ────────────────────
  if (done) {
    return (
      <div className="py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-6 md:mb-8 text-center">
            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-4" />
              Rutina recomendada
            </div>
            <h1 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold text-primary">
              Esta es tu rutina personalizada
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-muted-foreground">
              Un producto por etapa, en el orden correcto para tu tipo de cabello.
            </p>
          </div>

          {loading && (
            <div className="mb-8 flex items-center justify-center rounded-3xl border bg-background px-6 py-12 text-muted-foreground">
              <Loader2 className="mr-3 size-5 animate-spin" />
              Buscando la mejor combinación para tu tipo de cabello...
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && !!allCartProducts.length && (
            <div className="mb-6 md:mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-primary px-8 text-white text-sm md:text-base"
                onClick={handleAddAllToCart}
              >
                <ShoppingBag className="mr-2 size-4" />
                Agregar toda la rutina
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 text-sm md:text-base"
                onClick={handleRestart}
              >
                <RotateCcw className="mr-2 size-4" />
                Repetir test
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-10 md:space-y-14">
              <HorizontalCarouselSection
                title="Rutina base"
                subtitle="Limpieza · Mascarilla · Acondicionador · Crema · Gel · Aceite"
                items={routineItems}
                onAddToCart={handleAddOne}
                emptyMessage="No encontramos suficientes productos con stock para completar la rutina."
              />

              {!!extraItems.length && (
                <HorizontalCarouselSection
                  title="Extras recomendados"
                  subtitle="Accesorios que complementan tu rutina."
                  items={extraItems}
                  onAddToCart={handleAddOne}
                  emptyMessage="Por ahora no tenemos accesorios que encajen con tu perfil."
                />
              )}

              <ScheduleSection profile={profile} />
            </div>
          )}

          {!loading && !error && !allCartProducts.length && (
            <div className="rounded-3xl border bg-background p-6 text-center text-muted-foreground">
              No encontramos productos suficientes para armar una rutina completa.
              Prueba ajustando tus respuestas o revisa el catálogo general.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Pantalla preguntas ─────────────────────
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Barra de progreso */}
        <div className="mb-6 md:mb-8">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Pregunta {step + 1} de {totalSteps}</span>
            <span>{Math.round(((step + 1) / totalSteps) * 100)}% completado</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border bg-background p-5 shadow-sm md:p-8">
          <h2 className="mb-2 text-xl md:text-2xl font-bold text-primary">
            {current.question}
          </h2>

          {current.helper && (
            <p className="mb-4 md:mb-6 text-sm text-muted-foreground">{current.helper}</p>
          )}

          {/* Opciones con imágenes */}
          {current.showImages ? (
            <div className="mb-6 md:mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {current.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all text-left ${
                    selected === option.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option.image ? (
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square w-full bg-muted/40 flex items-center justify-center">
                      <span className="text-3xl">✋</span>
                    </div>
                  )}
                  <div className={`p-2 md:p-3 ${selected === option.value ? "bg-primary/5 text-primary" : ""}`}>
                    <div className="text-xs md:text-sm font-semibold">{option.label}</div>
                    {option.helper && (
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{option.helper}</div>
                    )}
                  </div>
                  {selected === option.value && (
                    <div className="absolute top-2 right-2 rounded-full bg-primary p-0.5">
                      <CheckCircle2 className="size-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            /* Opciones de texto */
            <div className="mb-6 md:mb-8 grid grid-cols-1 gap-2 md:gap-3">
              {current.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full rounded-2xl border-2 p-3 md:p-4 text-left transition-all ${
                    selected === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm md:text-base font-semibold">{option.label}</div>
                  {option.helper && (
                    <div className="mt-1 text-xs md:text-sm text-muted-foreground">{option.helper}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="rounded-full px-5 md:px-6 text-sm md:text-base"
            >
              <ArrowLeft className="mr-2 size-4" />
              Atrás
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selected}
              className="rounded-full bg-primary px-5 md:px-6 text-white text-sm md:text-base"
            >
              {step === totalSteps - 1 ? "Ver resultados" : "Siguiente"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CAROUSEL Y TARJETA
// ─────────────────────────────────────────────
function HorizontalCarouselSection({
  title,
  subtitle,
  items,
  onAddToCart,
  emptyMessage,
}: {
  title: string;
  subtitle?: string;
  items: { key: keyof RecommendationSet; label: string; sublabel?: string; product: ScoredProduct }[];
  onAddToCart: (product: ScoredProduct) => void;
  emptyMessage: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items.length) {
    return (
      <section className="rounded-3xl border bg-background p-6">
        <h2 className="mb-2 text-xl md:text-2xl font-bold text-primary">{title}</h2>
        {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </section>
    );
  }

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-primary">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => scroll("left")}>
            <ArrowLeft className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => scroll("right")}>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <div key={String(item.key)} className="w-72 shrink-0 md:w-80">
            <ProductCard product={item.product} label={item.label} sublabel={item.sublabel} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  label,
  sublabel,
  onAddToCart,
}: {
  product: ScoredProduct;
  label: string;
  sublabel?: string;
  onAddToCart: (product: ScoredProduct) => void;
}) {
  const image = getProductImage(product);
  return (
    <div className="h-full overflow-hidden rounded-3xl border bg-background shadow-sm flex flex-col">
      <img
        src={image}
        alt={product.display_name}
        className="h-64 md:h-72 lg:h-80 w-full object-cover"
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/img/logo.webp"; }}
      />
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-primary">{label}</div>
        {sublabel && <div className="mb-1 text-xs text-muted-foreground">{sublabel}</div>}
        <h3 className="mb-1 text-base md:text-lg font-bold text-foreground line-clamp-2">
          {product.display_name}
        </h3>
        <p className="mb-2 text-xs md:text-sm text-muted-foreground">
          {[product.marca, product.linea && product.linea !== "general" ? titleize(product.linea) : null]
            .filter(Boolean)
            .join(" · ") || titleize(product.tipo_producto)}
        </p>
        <p className="mb-3 text-xs md:text-sm text-muted-foreground line-clamp-3">
          {product.descripcion_corta || product.descripcion || "Producto recomendado para tu rutina."}
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {product.discount_active && product.discount_pct && product.discount_pct > 0 ? (
            <>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {formatPrice(getEffectivePrice(product))}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.precio)}
              </span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                -{product.discount_pct}%
              </span>
            </>
          ) : (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {formatPrice(product.precio)}
            </span>
          )}
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            Stock: {product.stock}
          </span>
        </div>
        {!!product.reasons.length && (
          <ul className="mb-4 space-y-1 text-xs md:text-sm text-muted-foreground">
            {product.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        )}
        <Button
          className="mt-auto w-full rounded-full bg-primary text-white text-sm"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingBag className="mr-2 size-4" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
}