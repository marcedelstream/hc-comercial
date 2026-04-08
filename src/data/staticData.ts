// ============================================================
// DATOS ESTÁTICOS DEMO - HC COMERCIAL
// Equipos Gastronómicos - Paraguay
// Todos los precios en Guaraníes (₲)
// ============================================================

// ------ TIPOS ------

export type StaticProduct = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  slug: string;
  quantity: number;
  updatedAt: string;
  category: { title: string; slug: string };
  productVariants: {
    image: string;
    color: string;
    size: string;
    isDefault: boolean;
  }[];
  reviews: number;
  tags: string[];
  offers: string[];
  sku: string;
  additionalInformation: { name: string; description: string }[];
};

export type StaticCategory = {
  id: number;
  title: string;
  slug: string;
  img: string | null;
  updatedAt: string;
};

export type StaticHeroSlider = {
  id: number;
  discountRate: number;
  sliderImage: string;
  updatedAt: string;
  product: {
    price: number;
    discountedPrice: number | null;
    title: string;
    slug: string;
    shortDescription: string;
  };
};

export type StaticHeroBanner = {
  id: number;
  bannerName: string;
  subtitle: string;
  bannerImage: string;
  updatedAt: string;
  product: {
    price: number;
    discountedPrice: number | null;
    title: string;
    slug: string;
  };
};

export type DepartamentoParaguay = {
  nombre: string;
  costoFlete: number;
};

// ------ CATEGORÍAS ------

export const staticCategories: StaticCategory[] = [
  {
    id: 1,
    title: "Cocción y Frituras",
    slug: "coccion-frituras",
    img: null,
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Hornos y Convección",
    slug: "hornos-conveccion",
    img: null,
    updatedAt: "2024-01-01",
  },
  {
    id: 3,
    title: "Refrigeración",
    slug: "refrigeracion",
    img: null,
    updatedAt: "2024-01-01",
  },
  {
    id: 4,
    title: "Preparación y Amasado",
    slug: "preparacion-amasado",
    img: null,
    updatedAt: "2024-01-01",
  },
  {
    id: 5,
    title: "Bebidas y Cafetería",
    slug: "bebidas-cafeteria",
    img: null,
    updatedAt: "2024-01-01",
  },
  {
    id: 6,
    title: "Pequeños Electrodomésticos",
    slug: "pequenos-electrodomesticos",
    img: null,
    updatedAt: "2024-01-01",
  },
];

// ------ PRODUCTOS ------

export const staticProducts: StaticProduct[] = [
  {
    id: "prod-001",
    title: "Freidora Industrial FI-2000",
    shortDescription: "Freidora de doble canasta con capacidad de 20 litros. Ideal para restaurantes y comedores con alto volumen de producción.",
    description: "<p>La <strong>Freidora Industrial FI-2000</strong> está diseñada para establecimientos gastronómicos que requieren alta productividad. Con sus dos canastas independientes de acero inoxidable 304 y sistema de calentamiento rápido, garantiza frituras uniformes y crujientes en todo momento.</p><p>Su termostato de precisión mantiene la temperatura entre 60°C y 190°C, y el filtro de aceite facilita el mantenimiento diario.</p>",
    price: 1850000,
    discountedPrice: 1650000,
    slug: "freidora-industrial-fi-2000",
    quantity: 15,
    updatedAt: "2024-01-15",
    category: { title: "Cocción y Frituras", slug: "coccion-frituras" },
    productVariants: [{ image: "", color: "Acero Inoxidable", size: "20L", isDefault: true }],
    reviews: 12,
    tags: ["freidora", "coccion", "industrial"],
    offers: [],
    sku: "HC-FI-2000",
    additionalInformation: [
      { name: "Capacidad", description: "20 litros (2 x 10L)" },
      { name: "Potencia", description: "6000W" },
      { name: "Material", description: "Acero inoxidable 304" },
      { name: "Temperatura", description: "60°C – 190°C" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Dimensiones", description: "55 x 40 x 35 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-002",
    title: "Horno Convector HC-600",
    shortDescription: "Horno convector de 6 bandejas con sistema de vapor. Cocción uniforme y eficiente para panaderías y pastelerías.",
    description: "<p>El <strong>Horno Convector HC-600</strong> ofrece una cocción perfecta gracias a su sistema de circulación forzada de aire caliente. Con capacidad para 6 bandejas GN 2/3, es ideal para panaderías, pastelerías y restaurantes.</p><p>Su panel de control digital permite programar temperatura, tiempo y nivel de vapor con precisión. La puerta doble vidrio templado permite monitorear la cocción sin abrir el horno.</p>",
    price: 4200000,
    discountedPrice: null,
    slug: "horno-convector-hc-600",
    quantity: 8,
    updatedAt: "2024-01-20",
    category: { title: "Hornos y Convección", slug: "hornos-conveccion" },
    productVariants: [{ image: "", color: "Acero Inoxidable", size: "6 bandejas", isDefault: true }],
    reviews: 8,
    tags: ["horno", "convector", "panaderia"],
    offers: [],
    sku: "HC-HC-600",
    additionalInformation: [
      { name: "Capacidad", description: "6 bandejas GN 2/3" },
      { name: "Potencia", description: "4800W" },
      { name: "Temperatura máx.", description: "270°C" },
      { name: "Sistema", description: "Vapor + Convección" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Dimensiones", description: "80 x 75 x 55 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-003",
    title: "Plancha Grill Doble PG-900",
    shortDescription: "Plancha grill de doble superficie acanalada + lisa. Ideal para parrillas, churrasquerías y restaurantes.",
    description: "<p>La <strong>Plancha Grill Doble PG-900</strong> combina superficie acanalada y lisa en un mismo equipo, brindando versatilidad máxima. Fabricada en hierro fundido con mango ergonómico y base de acero inoxidable.</p><p>Su potente resistencia eléctrica distribuye el calor de manera uniforme, logrando marcas perfectas en carnes, verduras y empanadas.</p>",
    price: 1150000,
    discountedPrice: 990000,
    slug: "plancha-grill-doble-pg-900",
    quantity: 20,
    updatedAt: "2024-01-18",
    category: { title: "Cocción y Frituras", slug: "coccion-frituras" },
    productVariants: [{ image: "", color: "Negro / Acero", size: "90cm", isDefault: true }],
    reviews: 18,
    tags: ["plancha", "grill", "churrasqueria"],
    offers: [],
    sku: "HC-PG-900",
    additionalInformation: [
      { name: "Superficie", description: "Acanalada + Lisa" },
      { name: "Potencia", description: "3200W" },
      { name: "Material", description: "Hierro fundido + Acero inox." },
      { name: "Temperatura", description: "Hasta 300°C" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Dimensiones", description: "90 x 50 x 20 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-004",
    title: "Heladera Comercial HC-350L",
    shortDescription: "Heladera vertical de 350 litros con doble puerta de vidrio. Ideal para exhibición de productos fríos en locales comerciales.",
    description: "<p>La <strong>Heladera Comercial HC-350L</strong> es la solución perfecta para la exhibición y conservación de alimentos en supermercados, almacenes y restaurantes. Sus puertas de vidrio panorámico permiten visualizar el producto sin abrir el equipo.</p><p>Sistema de refrigeración No Frost con temperatura regulable entre -2°C y +8°C. Iluminación LED interior que resalta los productos y reduce el consumo eléctrico.</p>",
    price: 3800000,
    discountedPrice: 3500000,
    slug: "heladera-comercial-hc-350l",
    quantity: 5,
    updatedAt: "2024-02-01",
    category: { title: "Refrigeración", slug: "refrigeracion" },
    productVariants: [{ image: "", color: "Acero / Vidrio", size: "350L", isDefault: true }],
    reviews: 6,
    tags: ["heladera", "refrigeracion", "exhibicion"],
    offers: [],
    sku: "HC-HVC-350",
    additionalInformation: [
      { name: "Capacidad", description: "350 litros" },
      { name: "Temperatura", description: "-2°C a +8°C" },
      { name: "Sistema", description: "No Frost" },
      { name: "Iluminación", description: "LED interior" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Dimensiones", description: "130 x 60 x 205 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-005",
    title: "Cocina Industrial 6 Hornallas CI-600",
    shortDescription: "Cocina industrial a gas con 6 hornallas de alto rendimiento. Robusta estructura de acero inoxidable para cocinas profesionales.",
    description: "<p>La <strong>Cocina Industrial 6 Hornallas CI-600</strong> está diseñada para soportar el ritmo exigente de cocinas profesionales. Fabricada íntegramente en acero inoxidable AISI 430, con quemadores de fundición de hierro de alto rendimiento BTU.</p><p>Incluye horno incorporado de 60 litros con piloto automático, parrillas de fundición resistentes y bandeja colectora de grasas de fácil extracción.</p>",
    price: 2950000,
    discountedPrice: null,
    slug: "cocina-industrial-6-hornallas-ci-600",
    quantity: 10,
    updatedAt: "2024-01-25",
    category: { title: "Cocción y Frituras", slug: "coccion-frituras" },
    productVariants: [{ image: "", color: "Acero Inoxidable", size: "6 hornallas", isDefault: true }],
    reviews: 15,
    tags: ["cocina", "gas", "hornallas", "industrial"],
    offers: [],
    sku: "HC-CI-600",
    additionalInformation: [
      { name: "Hornallas", description: "6 quemadores de hierro fundido" },
      { name: "Combustible", description: "Gas GLP / Gas Natural" },
      { name: "Horno", description: "60 litros incluido" },
      { name: "Material", description: "Acero inoxidable AISI 430" },
      { name: "Dimensiones", description: "150 x 70 x 90 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-006",
    title: "Batidora Planetaria BP-20L",
    shortDescription: "Batidora planetaria de 20 litros con 3 velocidades y 3 accesorios intercambiables. Para panaderías y pastelerías profesionales.",
    description: "<p>La <strong>Batidora Planetaria BP-20L</strong> es el equipo ideal para la elaboración de masas, cremas y merengues en grandes cantidades. Su sistema planetario garantiza una mezcla homogénea en todo el recipiente.</p><p>Incluye gancho para masa, paleta mezcladora y globo batidor, todos en acero inoxidable. Protector de seguridad de aluminio con interruptor automático al levantarse.</p>",
    price: 1450000,
    discountedPrice: 1250000,
    slug: "batidora-planetaria-bp-20l",
    quantity: 12,
    updatedAt: "2024-01-30",
    category: { title: "Preparación y Amasado", slug: "preparacion-amasado" },
    productVariants: [{ image: "", color: "Acero / Blanco", size: "20L", isDefault: true }],
    reviews: 10,
    tags: ["batidora", "planetaria", "panaderia", "pasteleria"],
    offers: [],
    sku: "HC-BP-20",
    additionalInformation: [
      { name: "Capacidad", description: "20 litros" },
      { name: "Motor", description: "1100W" },
      { name: "Velocidades", description: "3 velocidades + pulso" },
      { name: "Accesorios", description: "Gancho, Paleta, Globo" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-007",
    title: "Licuadora Industrial LI-5L",
    shortDescription: "Licuadora industrial de alta potencia con jarra de 5 litros. Para jugos, salsas, batidos y sopas en grandes cantidades.",
    description: "<p>La <strong>Licuadora Industrial LI-5L</strong> es robusta y silenciosa, diseñada para el uso continuo en bares, restaurantes y juguerías. Su motor de 1500W tritura hielo, frutas y verduras con facilidad.</p><p>Jarra de policarbonato irrompible con graduación y tapa con orificio para agregar ingredientes. Base con ventosa antideslizante para mayor seguridad.</p>",
    price: 680000,
    discountedPrice: null,
    slug: "licuadora-industrial-li-5l",
    quantity: 25,
    updatedAt: "2024-02-05",
    category: { title: "Bebidas y Cafetería", slug: "bebidas-cafeteria" },
    productVariants: [{ image: "", color: "Acero / Transparente", size: "5L", isDefault: true }],
    reviews: 20,
    tags: ["licuadora", "industrial", "jugos", "bebidas"],
    offers: [],
    sku: "HC-LI-5",
    additionalInformation: [
      { name: "Capacidad", description: "5 litros" },
      { name: "Motor", description: "1500W" },
      { name: "Velocidades", description: "3 velocidades + pulso + turbo" },
      { name: "Material jarra", description: "Policarbonato irrompible" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-008",
    title: "Microondas Comercial MC-30L",
    shortDescription: "Microondas comercial de 30 litros con 1500W de potencia. Ideal para calentamiento rápido en restaurantes y cafeterías.",
    description: "<p>El <strong>Microondas Comercial MC-30L</strong> está especialmente diseñado para el uso intensivo en ambientes gastronómicos. Con su potencia de 1500W, calienta porciones en segundos sin perder sabor ni textura.</p><p>Panel de control digital con temporizador de hasta 99 minutos y 5 niveles de potencia. Interior de acero inoxidable fácil de limpiar y resistente a los impactos.</p>",
    price: 890000,
    discountedPrice: 790000,
    slug: "microondas-comercial-mc-30l",
    quantity: 18,
    updatedAt: "2024-02-08",
    category: { title: "Pequeños Electrodomésticos", slug: "pequenos-electrodomesticos" },
    productVariants: [{ image: "", color: "Acero Inoxidable", size: "30L", isDefault: true }],
    reviews: 7,
    tags: ["microondas", "comercial", "calentamiento"],
    offers: [],
    sku: "HC-MC-30",
    additionalInformation: [
      { name: "Capacidad", description: "30 litros" },
      { name: "Potencia", description: "1500W" },
      { name: "Niveles de potencia", description: "5 niveles" },
      { name: "Interior", description: "Acero inoxidable" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-009",
    title: "Cafetera Expreso Doble CE-300",
    shortDescription: "Cafetera expreso de doble grupo con bomba vibratoria de 15 bares. Para cafeterías y restaurantes con alto flujo de clientes.",
    description: "<p>La <strong>Cafetera Expreso Doble CE-300</strong> es el corazón de cualquier cafetería profesional. Su sistema de doble caldera permite preparar expreso y vaporizar leche simultáneamente sin pérdida de temperatura.</p><p>Con pantalla LED de control de temperatura, presión de 15 bares y boquillas de vapor ajustables. Capacidad de depósito de 3 litros y bandeja calentaplatos integrada.</p>",
    price: 2100000,
    discountedPrice: null,
    slug: "cafetera-expreso-doble-ce-300",
    quantity: 7,
    updatedAt: "2024-02-10",
    category: { title: "Bebidas y Cafetería", slug: "bebidas-cafeteria" },
    productVariants: [{ image: "", color: "Acero / Negro", size: "Doble grupo", isDefault: true }],
    reviews: 9,
    tags: ["cafetera", "expreso", "cafe", "cafeteria"],
    offers: [],
    sku: "HC-CE-300",
    additionalInformation: [
      { name: "Grupos", description: "2 grupos independientes" },
      { name: "Presión", description: "15 bares" },
      { name: "Caldera", description: "Doble caldera 2L + 1.5L" },
      { name: "Potencia", description: "3200W" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-010",
    title: "Máquina de Pasta MP-180",
    shortDescription: "Máquina para elaborar pasta fresca en todas sus formas. Motor de 300W con 8 tipos de corte incluidos. Para restaurantes italianos y trattorías.",
    description: "<p>La <strong>Máquina de Pasta MP-180</strong> permite elaborar pasta fresca artesanal de manera rápida y consistente. Sus 8 matrices de bronce permiten obtener diferentes tipos de pasta: espagueti, fettuccine, penne, rigatoni y más.</p><p>Producción de hasta 8 kg/hora, ideal para restaurantes medianos. Cuerpo de aluminio fundido y partes en contacto con alimentos en acero inoxidable o teflón alimenticio.</p>",
    price: 1350000,
    discountedPrice: null,
    slug: "maquina-de-pasta-mp-180",
    quantity: 6,
    updatedAt: "2024-02-12",
    category: { title: "Preparación y Amasado", slug: "preparacion-amasado" },
    productVariants: [{ image: "", color: "Aluminio / Acero", size: "8 kg/h", isDefault: true }],
    reviews: 5,
    tags: ["pasta", "frescos", "italiano", "maquina"],
    offers: [],
    sku: "HC-MP-180",
    additionalInformation: [
      { name: "Producción", description: "Hasta 8 kg/hora" },
      { name: "Motor", description: "300W" },
      { name: "Matrices incluidas", description: "8 tipos de corte" },
      { name: "Cuerpo", description: "Aluminio fundido" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
  {
    id: "prod-011",
    title: "Cámara Frigorífica CF-8m3",
    shortDescription: "Cámara frigorífica modular de 8 m³ con panel sandwich de 100mm. Para conservación de carnes, lácteos y productos frescos a gran escala.",
    description: "<p>La <strong>Cámara Frigorífica CF-8m3</strong> es la solución definitiva para el almacenamiento a temperatura controlada de grandes volúmenes. Construida con paneles tipo sandwich de poliuretano de 100mm de espesor, ofrece un aislamiento térmico superior.</p><p>Sistema de refrigeración hermético con compresor de bajo consumo. Temperatura regulable entre -2°C y +5°C. Incluye alarma de temperatura, sistema de descongelamiento automático y iluminación interior LED.</p>",
    price: 8500000,
    discountedPrice: 7800000,
    slug: "camara-frigorifica-cf-8m3",
    quantity: 3,
    updatedAt: "2024-02-15",
    category: { title: "Refrigeración", slug: "refrigeracion" },
    productVariants: [{ image: "", color: "Blanco / Acero", size: "8 m³", isDefault: true }],
    reviews: 4,
    tags: ["camara", "frigorifico", "conservacion", "carnes"],
    offers: [],
    sku: "HC-CF-8M3",
    additionalInformation: [
      { name: "Volumen", description: "8 m³" },
      { name: "Panel", description: "Sandwich PU 100mm" },
      { name: "Temperatura", description: "-2°C a +5°C" },
      { name: "Compresor", description: "Hermético de bajo consumo" },
      { name: "Dimensiones internas", description: "2.5 x 2 x 2.2 m" },
      { name: "Garantía", description: "18 meses" },
    ],
  },
  {
    id: "prod-012",
    title: "Amasadora Industrial AI-25kg",
    shortDescription: "Amasadora espiral de 25 kg de capacidad. Ideal para panaderías y pizzerías que requieren masa uniforme y de alta calidad.",
    description: "<p>La <strong>Amasadora Industrial AI-25kg</strong> con sistema de espiral garantiza una mezcla perfecta de ingredientes sin calentar la masa, preservando todas sus propiedades. Ideal para pan artesanal, pizza y masas hojaldradas.</p><p>Cuba de acero inoxidable fácil de limpiar, con tapa de seguridad que detiene el motor al abrirse. Motor de doble velocidad para amasado y refinado. Ruedas de transporte para mayor movilidad.</p>",
    price: 2750000,
    discountedPrice: 2450000,
    slug: "amasadora-industrial-ai-25kg",
    quantity: 9,
    updatedAt: "2024-02-18",
    category: { title: "Preparación y Amasado", slug: "preparacion-amasado" },
    productVariants: [{ image: "", color: "Acero Inoxidable", size: "25kg", isDefault: true }],
    reviews: 11,
    tags: ["amasadora", "espiral", "panaderia", "pizza"],
    offers: [],
    sku: "HC-AI-25",
    additionalInformation: [
      { name: "Capacidad", description: "25 kg de masa" },
      { name: "Motor", description: "2200W doble velocidad" },
      { name: "Cuba", description: "Acero inoxidable" },
      { name: "Sistema", description: "Espiral" },
      { name: "Voltaje", description: "220V / 50Hz" },
      { name: "Dimensiones", description: "70 x 50 x 85 cm" },
      { name: "Garantía", description: "12 meses" },
    ],
  },
];

// ------ HERO SLIDERS ------

export const staticHeroSliders: StaticHeroSlider[] = [
  {
    id: 1,
    discountRate: 11,
    sliderImage: "",
    updatedAt: "2024-01-01",
    product: {
      price: 1850000,
      discountedPrice: 1650000,
      title: "Freidora Industrial FI-2000",
      slug: "freidora-industrial-fi-2000",
      shortDescription: "Doble canasta, 20 litros, temperatura precisa. La aliada de tu cocina profesional.",
    },
  },
  {
    id: 2,
    discountRate: 0,
    sliderImage: "",
    updatedAt: "2024-01-02",
    product: {
      price: 4200000,
      discountedPrice: null,
      title: "Horno Convector HC-600",
      slug: "horno-convector-hc-600",
      shortDescription: "6 bandejas, vapor integrado, cocción uniforme. El horno profesional que tu negocio necesita.",
    },
  },
  {
    id: 3,
    discountRate: 11,
    sliderImage: "",
    updatedAt: "2024-01-03",
    product: {
      price: 8500000,
      discountedPrice: 7800000,
      title: "Cámara Frigorífica CF-8m3",
      slug: "camara-frigorifica-cf-8m3",
      shortDescription: "Conservación profesional de 8 m³. Paneles de alta eficiencia térmica.",
    },
  },
];

// ------ HERO BANNERS ------

export const staticHeroBanners: StaticHeroBanner[] = [
  {
    id: 1,
    bannerName: "Cocina Industrial 6 Hornallas",
    subtitle: "Equipá tu cocina profesional",
    bannerImage: "",
    updatedAt: "2024-01-01",
    product: {
      price: 2950000,
      discountedPrice: null,
      title: "Cocina Industrial CI-600",
      slug: "cocina-industrial-6-hornallas-ci-600",
    },
  },
  {
    id: 2,
    bannerName: "Batidora Planetaria BP-20L",
    subtitle: "Ideal para panaderías",
    bannerImage: "",
    updatedAt: "2024-01-01",
    product: {
      price: 1450000,
      discountedPrice: 1250000,
      title: "Batidora Planetaria BP-20L",
      slug: "batidora-planetaria-bp-20l",
    },
  },
];

// ------ COUNTDOWN ------

export const staticCountdown = {
  id: 1,
  title: "Oferta Especial por Tiempo Limitado",
  subtitle: "¡No te lo pierdas!",
  countdownImage: "",
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
  product: {
    title: "Amasadora Industrial AI-25kg",
  },
};

// ------ HEADER SETTINGS ------

export const staticHeaderSettings = {
  id: 1,
  headerText: "Envíos a todo el Paraguay · WhatsApp: +595982800258",
  headerLogo: null,
  emailLogo: null,
};

// ------ SEO SETTINGS ------

export const staticSeoSettings = {
  id: 1,
  siteTitle: "HC COMERCIAL - Equipos Gastronómicos",
  siteName: "HC COMERCIAL",
  metadescription: "HC COMERCIAL vende equipos gastronómicos de alta calidad en Paraguay. Freidoras, hornos, heladeras, batidoras y más. Envíos a todo el país.",
  metaKeywords: "equipos gastronómicos, paraguay, freidoras, hornos, heladeras comerciales, cocina industrial",
  metaImage: null,
  favicon: "/favicon.ico",
  gtmId: null,
};

// ------ DEPARTAMENTOS DE PARAGUAY (FLETE) ------

export const departamentosParaguay: DepartamentoParaguay[] = [
  { nombre: "Asunción (Capital)", costoFlete: 30000 },
  { nombre: "Central", costoFlete: 50000 },
  { nombre: "Cordillera", costoFlete: 60000 },
  { nombre: "Paraguarí", costoFlete: 65000 },
  { nombre: "Guairá", costoFlete: 75000 },
  { nombre: "Alto Paraná", costoFlete: 80000 },
  { nombre: "Caaguazú", costoFlete: 80000 },
  { nombre: "Itapúa", costoFlete: 85000 },
  { nombre: "San Pedro", costoFlete: 90000 },
  { nombre: "Misiones", costoFlete: 90000 },
  { nombre: "Caazapá", costoFlete: 95000 },
  { nombre: "Ñeembucú", costoFlete: 100000 },
  { nombre: "Canindeyú", costoFlete: 100000 },
  { nombre: "Concepción", costoFlete: 100000 },
  { nombre: "Amambay", costoFlete: 110000 },
  { nombre: "Presidente Hayes", costoFlete: 120000 },
  { nombre: "Alto Paraguay", costoFlete: 150000 },
  { nombre: "Boquerón", costoFlete: 160000 },
];

// ------ HELPERS ------

export const getProductBySlug = (slug: string): StaticProduct | undefined =>
  staticProducts.find((p) => p.slug === slug);

export const getRelatedProducts = (slug: string, limit = 4): StaticProduct[] =>
  staticProducts.filter((p) => p.slug !== slug).slice(0, limit);
