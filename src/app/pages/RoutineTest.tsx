import { useState } from "react";
import { Link } from "react-router";
import { products, Product } from "../data/products";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "¿Cómo es el patrón de tu rizo?",
    options: [
      { text: "Ondulado (2A, 2B, 2C)", value: "wavy" },
      { text: "Rizado (3A, 3B, 3C)", value: "curly" },
      { text: "Afro (4A, 4B, 4C)", value: "coily" },
      { text: "No estoy segura, es una mezcla", value: "mixed" },
    ],
  },
  {
    id: 2,
    question: "¿Cómo se siente tu cabello usualmente?",
    options: [
      { text: "Seco y quebradizo", value: "dry" },
      { text: "Graso en la raíz pero seco en las puntas", value: "combination" },
      { text: "Normal, bien hidratado", value: "normal" },
      { text: "Muy dañado por decoloración o calor", value: "damaged" },
    ],
  },
  {
    id: 3,
    question: "¿Cuál es tu porosidad? (¿Qué tan rápido absorbe agua?)",
    options: [
      { text: "Alta (Se moja muy rápido y se seca rápido)", value: "high" },
      { text: "Media (Toma un tiempo normal)", value: "medium" },
      { text: "Baja (El agua resbala, tarda en mojarse y en secarse)", value: "low" },
      { text: "No lo sé", value: "unknown" },
    ],
  },
];

type RecommendedProduct = {
  step: string;
  product: Product;
  description: string;
};

export function RoutineTest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetTest = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const getProductByCategory = (category: Product["category"]) => {
    return (
      products.find((p) => p.category === category && p.inStock) ||
      products.find((p) => p.category === category) ||
      null
    );
  };

  const getFallbackProduct = () => {
    return products.find((p) => p.inStock) || products[0] || null;
  };

  if (showResult) {
    const curlType = answers[1];
    const condition = answers[2];
    const porosity = answers[3];

    const shampooProduct = getProductByCategory("shampoo") || getFallbackProduct();
    const treatmentProduct = getProductByCategory("treatment") || getFallbackProduct();
    const stylingProduct = shampooProduct; // Paso 3 usa el mismo producto del shampoo
    const finalProduct =
      curlType === "coily"
        ? getProductByCategory("treatment") || getFallbackProduct()
        : getProductByCategory("styling") || getFallbackProduct();

    const recommendedProducts: RecommendedProduct[] = [
      {
        step: "Paso 1: Limpieza",
        product: shampooProduct!,
        description:
          condition === "dry" || condition === "damaged"
            ? "Ideal para una limpieza suave que respete la hidratación natural de tu cabello."
            : "Una buena base de limpieza para mantener el cuero cabelludo fresco sin resecar.",
      },
      {
        step: "Paso 2: Tratamiento",
        product: treatmentProduct!,
        description:
          porosity === "high" || condition === "damaged"
            ? "Te ayuda a reforzar la fibra capilar y devolverle manejabilidad."
            : "Perfecto para mantener hidratación, suavidad y elasticidad.",
      },
      {
        step: "Paso 3: Peinar",
        product: stylingProduct!,
        description:
          "Para este paso estamos recomendando el mismo producto del shampoo, tal como lo pediste.",
      },
      {
        step: "Paso 4: Finalización",
        product: finalProduct!,
        description:
          curlType === "coily"
            ? "Aporta soporte extra para sellar y mantener el cabello controlado."
            : "Ayuda a mantener definición, forma y acabado por más tiempo.",
      },
    ].filter((item) => item.product);

    return (
      <div className="py-20 bg-background min-h-[calc(100vh-140px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <CheckCircle2 className="size-20 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold text-primary mb-6">Tu Rutina Perfecta</h1>
            <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto">
              Basados en tus respuestas, seleccionamos productos reales de tu catálogo para armar una rutina recomendada.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
              {recommendedProducts.map((item, idx) => (
                <Card
                  key={`${item.product.id}-${idx}`}
                  className="overflow-hidden border-primary/20 bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col h-full group"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {item.step}
                    </div>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-primary mb-2 leading-tight group-hover:text-primary/80 transition-colors">
                      {item.product.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-3">
                      <span className="font-semibold text-foreground">
                        ${item.product.price}
                      </span>

                      <Link to={`/products/${item.product.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs hover:bg-primary/10 hover:text-primary"
                        >
                          Ver producto
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button
                onClick={resetTest}
                variant="outline"
                className="border-primary text-primary hover:bg-secondary w-full sm:w-auto"
              >
                Hacer de nuevo
              </Button>

              <Button className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
                Añadir rutina completa al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];

  return (
    <div className="py-16 bg-background min-h-[calc(100vh-140px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="size-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Descubre lo que tu cabello necesita
            </h1>
            <p className="text-foreground/80">
              Responde estas simples preguntas para obtener una recomendación de productos y técnicas personalizadas.
            </p>
          </div>

          <Card className="bg-card shadow-lg border-border">
            <CardContent className="p-8">
              <div className="mb-8">
                <span className="text-sm font-semibold text-primary mb-2 block">
                  Pregunta {currentStep + 1} de {questions.length}
                </span>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid gap-4 mb-8">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(currentQ.id, option.value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQ.id] === option.value
                        ? "border-primary bg-secondary/50 text-primary font-medium"
                        : "border-border hover:border-primary/50 hover:bg-secondary/20 text-foreground"
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="flex justify-end border-t pt-6">
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className="bg-primary text-white hover:bg-primary/90 px-8"
                >
                  {currentStep === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}