export interface Product {
  id: string;
  name: string;
  category: 'shampoo' | 'conditioner' | 'styling' | 'treatment' | 'tools';
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  features?: string[];
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Shampoo Ultra Nutritivo Phyto Manga 300ml',
    category: 'shampoo',
    price: 50000,
    description: 'Shampoo nutritivo de Widi Care ideal para limpiar suavemente mientras aporta nutrición al cabello reseco, procesado o maltratado.',
    image: '/img/phyto_manga.png',
    inStock: true,
    features: ['Nutrición intensa', 'Limpieza suave', 'Con manteiga de mango', 'Cabello químicamente tratado'],
  },
  {
    id: 'p2',
    name: 'Acondicionador Ultra Nutritivo Phyto Manga 300ml',
    category: 'conditioner',
    price: 50000,
    description: 'Acondicionador nutritivo Widi Care formulado para suavizar, desenredar y devolver brillo al cabello seco o sensibilizado.',
    image: '/img/phyto_ac.png',
    inStock: true,
    features: ['Desenreda', 'Aporta brillo', 'Textura suave', 'Nutrición diaria'],
  },
  {
    id: 'p3',
    name: 'Mascarilla Ultra Nutritiva Phyto Manga 300g',
    category: 'treatment',
    price: 58000,
    description: 'Mascarilla capilar de nutrición profunda para recuperar suavidad, elasticidad y manejo en cabellos opacos o resecos.',
    image: '/img/phyto_mask.png',
    inStock: true,
    features: ['Nutrición profunda', 'Uso semanal', 'Cabello más suave', 'Ideal para cronograma capilar'],
  },
  {
    id: 'p4',
    name: 'Shampoo Cero Dramas 500ml',
    category: 'shampoo',
    price: 38000,
    description: 'Shampoo de limpieza profunda de Melenas i Bella pensado para remover residuos, grasa acumulada y preparar el cabello para la rutina capilar.',
    image: '/img/melenas_cero.png',
    inStock: true,
    features: ['Limpieza profunda', 'Remueve acumulación', 'Ideal para prelavado', 'Sensación fresca'],
  },
  {
    id: 'p5',
    name: 'Shampoo Hidratante 500ml',
    category: 'shampoo',
    price: 38000,
    description: 'Shampoo hidratante de uso frecuente que limpia sin resecar y ayuda a mantener el cabello suave y manejable.',
    image: '/img/melenas_raiz.png',
    inStock: true,
    features: ['Uso frecuente', 'Limpieza gentil', 'Hidratación', 'Cabello más manejable'],
  },
  {
    id: 'p6',
    name: 'Acondicionador Desenredante 500ml',
    category: 'conditioner',
    price: 34000,
    description: 'Acondicionador desenredante que facilita el peinado, suaviza la fibra capilar y ayuda a controlar el frizz.',
    image: '/img/melenas_rebelde.png',
    inStock: true,
    features: ['Desenreda fácil', 'Reduce frizz', 'Suaviza', 'Ideal para cabello abundante'],
  },
  {
    id: 'p7',
    name: 'Mascarilla Nutritiva 300ml',
    category: 'treatment',
    price: 37000,
    description: 'Mascarilla nutritiva para complementar la rutina capilar y aportar suavidad, brillo y mejor definición.',
    image: '/img/melenas_mask.png',
    inStock: true,
    features: ['Nutrición', 'Brillo', 'Suavidad', 'Apoyo al cronograma capilar'],
  },
  {
    id: 'p8',
    name: 'Atomizador Pulverizador',
    category: 'tools',
    price: 19000,
    description: 'Atomizador recargable para humedecer el cabello de forma uniforme durante peinados, definición o aplicación de productos.',
    image: '/img/atom.png',
    inStock: true,
    features: ['Pulverización fina', 'Recargable', 'Uso diario', 'Ideal para rizos'],
  },
  {
    id: 'p9',
    name: 'Gorro de Satín con Spandex XL',
    category: 'tools',
    price: 20000,
    description: 'Gorro de satín con banda de spandex diseñado para proteger el peinado, reducir frizz y ayudar a conservar la hidratación del cabello.',
    image: '/img/gorro_satin.png',
    inStock: true,
    features: ['Talla XL', 'Reduce frizz', 'Protege el peinado', 'Banda cómoda'],
  },
  {
    id: 'p10',
    name: 'Difusor Siliconado Universal',
    category: 'tools',
    price: 38000,
    description: 'Difusor siliconado plegable y adaptable para secador, pensado para mejorar la definición y distribuir mejor el aire en cabellos ondulados o rizados.',
    image: '/img/difusor.png',
    inStock: true,
    features: ['Universal', 'Plegable', 'Ideal para rizos', 'Distribución uniforme del aire'],
  },
];