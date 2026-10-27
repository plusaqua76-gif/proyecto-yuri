import { Product, StoreSettings } from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  brandName: 'Cirleni Hernández Brand Official',
  whatsappNumber: '573125964567',
  whatsappDisplay: '+57 312 596 4567',
  instagramUrl: 'https://www.instagram.com/cirlenihernandez',
  logoUrl: 'https://instagram.fnva3-1.fna.fbcdn.net/v/t51.82787-19/702946366_18598116715011552_1612907721483583567_n.jpg?_nc_cat=106&_nc_map=urlgen_bucketless&ig_cache_key=GD4c5ingHUp84xJCAE_Ag-IGM2IWbmNDAQAB0j-ccb7-5&ccb=7-5&_nc_sid=669407&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy44NDYuQzMifQ%3D%3D&_nc_ohc=jUippO3-p8wQ7kNvwGPtHra&_nc_oc=AdoXm99Q0ueb2SPrLuS58nlWOA1Jl_5MHpB1CgUMu1a8LvpJRIqJEnTvtQIas2ug2PQ&_nc_zt=24&_nc_ht=instagram.fnva3-1.fna&_nc_gid=mlGgyWKtteh3tMYHLk931A&_nc_ss=7d6a8&oh=00_AQPYDH2rsPfIEnmTiL2iZyE0FpfiPz-f8w6SlkHWyNF8Fg&oe=6AE18B4A',
  announcementText: '✨ Colección Alta Costura 2026 · Envíos a toda Colombia · Atención personalizada vía WhatsApp',
  shippingNotice: 'Envíos asegurados a nivel nacional. La disponibilidad y costo de flete se confirman al validar el pedido vía WhatsApp.',
  freeShippingThreshold: 250000,
  adminPasscode: 'cirleni2026',
};

// Generated high-definition asset paths
export const ASSET_IMAGES = {
  hero: '/videos/hero_poster.jpg',
  enterizoBlack: '/src/assets/images/fashion_enterizo_black_1792782858876.jpg',
  vestidoAurora: '/src/assets/images/fashion_vestido_aurora_1792782860124.jpg',
  conjuntoMarfil: '/assets/aistudio/imgdownloader-080c057c_9fa09d13.jpeg',
  blusaSeda: '/src/assets/images/fashion_blusa_seda_1792782873911.jpg',
  pantalonPalazzo: '/src/assets/images/fashion_pantalon_palazzo_1792782874277.jpg',
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Enterizos
  {
    id: 'ch-ent-01',
    name: 'Enterizo Elegance Couture',
    slug: 'enterizo-elegance-couture',
    category: 'enterizos',
    price: 185000,
    originalPrice: 215000,
    description: 'Enterizo estructurado con escote drapeado asimétrico y fajón ajustable de alta costura. Confeccionado en crepé satén con caída impecable que alarga la silueta femenina. Ideal para eventos de noche, cócteles y cenas exclusivas.',
    shortDescription: 'Crepé satén con cinturón joya y silueta estilizada.',
    isNew: true,
    isExclusive: true,
    isBestseller: true,
    images: [
      ASSET_IMAGES.enterizoBlack,
      ASSET_IMAGES.hero,
      ASSET_IMAGES.conjuntoMarfil
    ],
    colors: [
      { name: 'Negro Azabache', hex: '#171717' },
      { name: 'Champagne Nude', hex: '#C6A77D' },
      { name: 'Esmeralda', hex: '#0B4A34' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'XS', color: 'Negro Azabache', stock: 3 },
      { size: 'S', color: 'Negro Azabache', stock: 5 },
      { size: 'M', color: 'Negro Azabache', stock: 4 },
      { size: 'L', color: 'Negro Azabache', stock: 2 },
      { size: 'XL', color: 'Negro Azabache', stock: 0 },
      { size: 'S', color: 'Champagne Nude', stock: 3 },
      { size: 'M', color: 'Champagne Nude', stock: 3 },
      { size: 'L', color: 'Champagne Nude', stock: 2 },
      { size: 'S', color: 'Esmeralda', stock: 2 },
      { size: 'M', color: 'Esmeralda', stock: 2 },
    ],
    material: 'Crepé satén italiano de peso medio con elasticidad ligera',
    composition: '94% Poliéster de alta torsión, 6% Elastano',
    careInstructions: [
      'Lavar en seco o a mano con agua fría y jabón delicado',
      'No retorcer ni escurrir',
      'Planchar por el revés a temperatura baja o con vapor vertical',
      'Secar a la sombra colgado en gancho acolchado'
    ],
    measurementsGuide: {
      bust: 'XS: 84cm | S: 88cm | M: 92cm | L: 98cm | XL: 104cm',
      waist: 'XS: 64cm | S: 68cm | M: 72cm | L: 78cm | XL: 84cm',
      hip: 'XS: 92cm | S: 96cm | M: 100cm | L: 106cm | XL: 112cm',
      length: '150 cm desde el hombro al dobladillo'
    },
    model3d: {
      enabled: true,
      garmentType: 'jumpsuit',
      accentFinish: 'satin'
    },
    createdAt: '2026-03-01'
  },
  {
    id: 'ch-ent-02',
    name: 'Enterizo Palazzo Bellissima',
    slug: 'enterizo-palazzo-bellissima',
    category: 'enterizos',
    price: 195000,
    originalPrice: 220000,
    description: 'Silueta fluida con pernera ancha tipo palazzo, espalda semi-descubierta con tirantes finos cruzados y detalle de aberturas sutiles. Un diseño pensado para deslumbrar con frescura y comodidad premium.',
    shortDescription: 'Palazzo holgado con espalda cruzada y caída majestuosa.',
    isNew: true,
    isExclusive: false,
    isSale: true,
    images: [
      ASSET_IMAGES.hero,
      ASSET_IMAGES.enterizoBlack
    ],
    colors: [
      { name: 'Champagne Dorado', hex: '#C6A77D' },
      { name: 'Marfil Clásico', hex: '#F8F5F0' },
      { name: 'Negro Azabache', hex: '#171717' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Champagne Dorado', stock: 4 },
      { size: 'M', color: 'Champagne Dorado', stock: 3 },
      { size: 'L', color: 'Champagne Dorado', stock: 2 },
      { size: 'S', color: 'Marfil Clásico', stock: 2 },
      { size: 'M', color: 'Marfil Clásico', stock: 0 },
    ],
    material: 'Lino seda premium transpirable',
    composition: '70% Viscosa, 30% Lino europeo',
    careInstructions: [
      'Lavado delicado a mano',
      'No usar blanqueador',
      'Secado horizontal a la sombra'
    ],
    model3d: {
      enabled: true,
      garmentType: 'jumpsuit',
      accentFinish: 'linen'
    },
    createdAt: '2026-03-02'
  },
  {
    id: 'ch-ent-03',
    name: 'Enterizo Asimétrico Royal',
    slug: 'enterizo-asimetrico-royal',
    category: 'enterizos',
    price: 175000,
    description: 'Manga asimétrica en un solo hombro con detalle plisado y pantalón pitillo estructurado. La combinación definitiva de vanguardia y sofisticación.',
    shortDescription: 'Corte un hombro con pinzas de realce y cintura ceñida.',
    isNew: false,
    isBestseller: true,
    images: [
      ASSET_IMAGES.enterizoBlack,
      ASSET_IMAGES.vestidoAurora
    ],
    colors: [
      { name: 'Negro Profundo', hex: '#111111' },
      { name: 'Azul Noche', hex: '#1B263B' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inventory: [
      { size: 'XS', color: 'Negro Profundo', stock: 2 },
      { size: 'S', color: 'Negro Profundo', stock: 5 },
      { size: 'M', color: 'Negro Profundo', stock: 4 },
      { size: 'L', color: 'Negro Profundo', stock: 2 },
    ],
    material: 'Poliéster stretch con acabado mate sedoso',
    composition: '95% Poliéster, 5% Spandex',
    careInstructions: ['Lavado profesional en seco'],
    createdAt: '2026-02-15'
  },

  // 2. Vestidos
  {
    id: 'ch-vest-01',
    name: 'Vestido Aurora Esmeralda & Oro',
    slug: 'vestido-aurora-esmeralda-oro',
    category: 'vestidos',
    price: 245000,
    originalPrice: 280000,
    description: 'Vestido de gala en seda esmeralda profunda con drapeado envolvente y panel contrastante en lamé oro suave. Mangas abullonadas con puños joya y escote en V pronunciado. Una pieza emblemática de Cirleni Hernández pensada para bodas de gala y ocasiones memorables.',
    shortDescription: 'Seda esmeralda con bordados dorados e insinuante vuelo.',
    isNew: true,
    isExclusive: true,
    isBestseller: true,
    isSale: true,
    images: [
      ASSET_IMAGES.vestidoAurora,
      ASSET_IMAGES.hero
    ],
    colors: [
      { name: 'Esmeralda & Oro', hex: '#0B4A34' },
      { name: 'Negro & Plata', hex: '#1C1C1E' },
      { name: 'Vino Tinto', hex: '#5E1925' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'XS', color: 'Esmeralda & Oro', stock: 2 },
      { size: 'S', color: 'Esmeralda & Oro', stock: 4 },
      { size: 'M', color: 'Esmeralda & Oro', stock: 5 },
      { size: 'L', color: 'Esmeralda & Oro', stock: 3 },
      { size: 'XL', color: 'Esmeralda & Oro', stock: 1 },
      { size: 'S', color: 'Negro & Plata', stock: 2 },
      { size: 'M', color: 'Negro & Plata', stock: 2 },
    ],
    material: 'Seda satén de alto gramaje con forro suave interno',
    composition: '92% Seda sintética premium, 8% Elastano',
    careInstructions: [
      'Solo lavado en tintorería especializada',
      'Guardar en funda protectora de tela'
    ],
    measurementsGuide: {
      bust: 'XS: 82cm | S: 86cm | M: 90cm | L: 96cm',
      waist: 'XS: 62cm | S: 66cm | M: 70cm | L: 76cm',
      hip: 'Vuelo holgado',
      length: '155 cm'
    },
    model3d: {
      enabled: true,
      garmentType: 'dress',
      accentFinish: 'silk'
    },
    createdAt: '2026-03-05'
  },
  {
    id: 'ch-vest-02',
    name: 'Vestido Midi Nácar Minimal',
    slug: 'vestido-midi-nacar-minimal',
    category: 'vestidos',
    price: 165000,
    description: 'Vestido corte midi con cuello halter y silueta columna que envuelve delicadamente las curvas. Acabado satinado aperlado que refleja la luz con sutileza.',
    shortDescription: 'Corte columna minimalista con cuello halter en tono nácar.',
    isNew: false,
    isExclusive: true,
    images: [
      ASSET_IMAGES.conjuntoMarfil,
      ASSET_IMAGES.vestidoAurora
    ],
    colors: [
      { name: 'Nácar Marfil', hex: '#F8F5F0' },
      { name: 'Terracota', hex: '#B85D3D' },
      { name: 'Negro', hex: '#171717' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Nácar Marfil', stock: 3 },
      { size: 'M', color: 'Nácar Marfil', stock: 4 },
      { size: 'L', color: 'Nácar Marfil', stock: 2 },
    ],
    material: 'Satén pesado con forro interior',
    composition: '100% Poliéster satén',
    careInstructions: ['Lavar a mano en agua fría'],
    model3d: {
      enabled: true,
      garmentType: 'dress',
      accentFinish: 'satin'
    },
    createdAt: '2026-02-20'
  },
  {
    id: 'ch-vest-03',
    name: 'Vestido Camisero Safari Silk',
    slug: 'vestido-camisero-safari-silk',
    category: 'vestidos',
    price: 155000,
    originalPrice: 180000,
    description: 'Versión elevada del clásico vestido camisero con botones nacarados, bolsillos de parche frontales y lazo en cintura para entallar.',
    shortDescription: 'Elegancia casual para el día a día y eventos de día.',
    isNew: false,
    isSale: true,
    images: [
      ASSET_IMAGES.hero,
      ASSET_IMAGES.blusaSeda
    ],
    colors: [
      { name: 'Arena Cálido', hex: '#EDE4DA' },
      { name: 'Oliva Suave', hex: '#586450' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'S', color: 'Arena Cálido', stock: 5 },
      { size: 'M', color: 'Arena Cálido', stock: 3 },
      { size: 'L', color: 'Arena Cálido', stock: 2 },
      { size: 'XL', color: 'Arena Cálido', stock: 0 },
    ],
    material: 'Mezcla de tencel y lino lavado',
    composition: '65% Tencel, 35% Lino',
    careInstructions: ['Lavado en ciclo suave'],
    createdAt: '2026-01-28'
  },

  // 3. Conjuntos
  {
    id: 'ch-conj-01',
    name: 'Conjunto Sartorial Marfil Studio',
    slug: 'conjunto-sartorial-marfil-studio',
    category: 'sets',
    price: 260000,
    originalPrice: 295000,
    description: 'Dúo sastre compuesto por blazer estructurado de un solo botón y pantalón de tiro alto con raya planchada. Confección artesanal colombiana con solapas de pico definidas y forro en rayón suave.',
    shortDescription: 'Blazer estructurado y pantalón de corte recto en lino y seda.',
    isNew: true,
    isExclusive: true,
    isBestseller: true,
    images: [
      ASSET_IMAGES.conjuntoMarfil,
      ASSET_IMAGES.pantalonPalazzo,
      ASSET_IMAGES.hero
    ],
    colors: [
      { name: 'Marfil Ópalo', hex: '#FAF8F5' },
      { name: 'Beige Cálido', hex: '#EDE4DA' },
      { name: 'Negro Clásico', hex: '#171717' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'XS', color: 'Marfil Ópalo', stock: 2 },
      { size: 'S', color: 'Marfil Ópalo', stock: 4 },
      { size: 'M', color: 'Marfil Ópalo', stock: 4 },
      { size: 'L', color: 'Marfil Ópalo', stock: 3 },
      { size: 'XL', color: 'Marfil Ópalo', stock: 1 },
      { size: 'S', color: 'Beige Cálido', stock: 3 },
      { size: 'M', color: 'Beige Cálido', stock: 2 },
    ],
    material: 'Lino con mezcla de rayón y elastano para máxima adaptabilidad',
    composition: '55% Lino, 42% Rayón, 3% Elastano',
    careInstructions: [
      'Lavado en seco profesional recomendado',
      'No centrifugar',
      'Planchar con paño protector'
    ],
    model3d: {
      enabled: true,
      garmentType: 'two-piece',
      accentFinish: 'linen'
    },
    createdAt: '2026-03-04'
  },
  {
    id: 'ch-conj-02',
    name: 'Conjunto Top Corset & Falda Midi',
    slug: 'conjunto-top-corset-falda-midi',
    category: 'sets',
    price: 185000,
    description: 'Top encorsetado con ballenas flexibles que estilizan el torso junto con una falda midi de silueta sirena con abertura lateral discreta.',
    shortDescription: 'Corset entallado y falda fluida con sutil abertura.',
    isNew: true,
    images: [
      ASSET_IMAGES.enterizoBlack,
      ASSET_IMAGES.conjuntoMarfil
    ],
    colors: [
      { name: 'Champagne Miel', hex: '#C6A77D' },
      { name: 'Negro Seducción', hex: '#171717' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Champagne Miel', stock: 3 },
      { size: 'M', color: 'Champagne Miel', stock: 3 },
      { size: 'L', color: 'Champagne Miel', stock: 2 },
    ],
    material: 'Satén grueso de alta densidad',
    composition: '96% Poliéster, 4% Elastano',
    careInstructions: ['Lavar a mano con delicadeza'],
    createdAt: '2026-02-18'
  },

  // 4. Blusas
  {
    id: 'ch-blus-01',
    name: 'Blusa Drapeada Satin Champagne',
    slug: 'blusa-drapeada-satin-champagne',
    category: 'crop-tops',
    price: 110000,
    originalPrice: 130000,
    description: 'Blusa en satén de seda con cuello fluido estilo cascada, puños ajustados con botones forrados a mano y caída ligera que combina perfectamente con pantalones sastre o faldas tubo.',
    shortDescription: 'Cuello cascada con caída vaporosa y puños franceses.',
    isNew: true,
    isBestseller: true,
    images: [
      ASSET_IMAGES.blusaSeda,
      ASSET_IMAGES.hero
    ],
    colors: [
      { name: 'Champagne Perlado', hex: '#C6A77D' },
      { name: 'Blanco Nieve', hex: '#FFFFFF' },
      { name: 'Verde Botella', hex: '#1E3F20' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'XS', color: 'Champagne Perlado', stock: 4 },
      { size: 'S', color: 'Champagne Perlado', stock: 6 },
      { size: 'M', color: 'Champagne Perlado', stock: 5 },
      { size: 'L', color: 'Champagne Perlado', stock: 3 },
      { size: 'XL', color: 'Champagne Perlado', stock: 2 },
    ],
    material: 'Seda charmeuse sintética de acabado aterciopelado',
    composition: '100% Poliéster microfibra',
    careInstructions: ['Lavar a mano con shampoo neutro', 'Plancha tibia con vapor'],
    model3d: {
      enabled: true,
      garmentType: 'blouse',
      accentFinish: 'satin'
    },
    createdAt: '2026-03-03'
  },
  {
    id: 'ch-blus-02',
    name: 'Camisa Popelín Estructurada Atelier',
    slug: 'camisa-popelin-estructurada-atelier',
    category: 'crop-tops',
    price: 98000,
    description: 'Camisa blanca de cuello camisero alto, puños dobles y corte entallado en espalda. Un clásico atemporal indispensable en el armario ejecutivo.',
    shortDescription: 'Algodón popelín con acabado anti-arrugas y silueta limpia.',
    isNew: false,
    images: [
      ASSET_IMAGES.conjuntoMarfil,
      ASSET_IMAGES.blusaSeda
    ],
    colors: [
      { name: 'Blanco Óptico', hex: '#FFFFFF' },
      { name: 'Azul Celeste', hex: '#D6E6F2' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Blanco Óptico', stock: 5 },
      { size: 'M', color: 'Blanco Óptico', stock: 4 },
      { size: 'L', color: 'Blanco Óptico', stock: 2 },
    ],
    material: 'Popelín de algodón egipcio',
    composition: '97% Algodón, 3% Elastano',
    careInstructions: ['Lavado estándar a 30°C'],
    createdAt: '2026-01-20'
  },

  // 5. Pantalones
  {
    id: 'ch-pant-01',
    name: 'Pantalón Palazzo Camel Alta Costura',
    slug: 'pantalon-palazzo-camel-alta-costura',
    category: 'sets',
    price: 135000,
    originalPrice: 155000,
    description: 'Pantalón palazzo de tiro ultra-alto con pretina ancha, pinzas encontradas frontales y bolsillos laterales invisibles. Confeccionado en paño liviano con caída con peso que estiliza el caminar.',
    shortDescription: 'Tiro alto con pinzas profundas y silueta palazzo majestuosa.',
    isNew: true,
    isExclusive: true,
    isBestseller: true,
    images: [
      ASSET_IMAGES.pantalonPalazzo,
      ASSET_IMAGES.blusaSeda,
      ASSET_IMAGES.hero
    ],
    colors: [
      { name: 'Camel Dorado', hex: '#B58D54' },
      { name: 'Negro Intenso', hex: '#171717' },
      { name: 'Marfil Arena', hex: '#EDE4DA' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: [
      { size: 'XS', color: 'Camel Dorado', stock: 3 },
      { size: 'S', color: 'Camel Dorado', stock: 5 },
      { size: 'M', color: 'Camel Dorado', stock: 4 },
      { size: 'L', color: 'Camel Dorado', stock: 3 },
      { size: 'XL', color: 'Camel Dorado', stock: 1 },
      { size: 'S', color: 'Negro Intenso', stock: 4 },
      { size: 'M', color: 'Negro Intenso', stock: 3 },
    ],
    material: 'Mezcla de paño liviano con viscosa de alta densidad',
    composition: '64% Poliéster, 32% Viscosa, 4% Spandex',
    careInstructions: ['Lavado en seco o planchado a vapor vertical'],
    measurementsGuide: {
      waist: 'XS: 64cm | S: 68cm | M: 72cm | L: 78cm | XL: 84cm',
      hip: 'XS: 94cm | S: 98cm | M: 104cm | L: 110cm | XL: 116cm',
      bust: 'N/A',
      length: '112 cm de largo total'
    },
    createdAt: '2026-03-02'
  },
  {
    id: 'ch-pant-02',
    name: 'Pantalón Cigarette Sastrería',
    slug: 'pantalon-cigarette-sastreria',
    category: 'sets',
    price: 120000,
    description: 'Corte tobillero ajustado con abertura lateral pequeña en el bajo. Combina la comodidad del stretch con la elegancia impecable del sastre.',
    shortDescription: 'Corte recto tobillero con raya frontal permanente.',
    isNew: false,
    images: [
      ASSET_IMAGES.enterizoBlack,
      ASSET_IMAGES.pantalonPalazzo
    ],
    colors: [
      { name: 'Negro Azabache', hex: '#171717' },
      { name: 'Terracota Cálido', hex: '#A35339' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Negro Azabache', stock: 4 },
      { size: 'M', color: 'Negro Azabache', stock: 4 },
      { size: 'L', color: 'Negro Azabache', stock: 2 },
    ],
    material: 'Biolino stretch premium',
    composition: '95% Poliéster, 5% Elastano',
    careInstructions: ['Lavado a máquina en ciclo corto'],
    createdAt: '2026-02-10'
  },

  // 6. Accesorios
  {
    id: 'ch-acc-01',
    name: 'Cinturón Escultural Hebilla Oro 24K',
    slug: 'cinturon-escultural-hebilla-oro',
    category: 'bodys',
    price: 85000,
    description: 'Cinturón en cuero vacuno 100% legítimo colombiano con hebilla orgánica bañada en oro de 24 quilates. La pieza infaltable para definir la cintura en enterizos y blazers.',
    shortDescription: 'Cuero genuino colombiano con herraje escultural bañado en oro.',
    isNew: true,
    isExclusive: true,
    images: [
      ASSET_IMAGES.blusaSeda,
      ASSET_IMAGES.hero
    ],
    colors: [
      { name: 'Cuero Negro', hex: '#171717' },
      { name: 'Cuero Miel', hex: '#9E7D53' }
    ],
    sizes: ['S', 'M', 'L'],
    inventory: [
      { size: 'S', color: 'Cuero Negro', stock: 6 },
      { size: 'M', color: 'Cuero Negro', stock: 8 },
      { size: 'L', color: 'Cuero Negro', stock: 4 },
      { size: 'S', color: 'Cuero Miel', stock: 5 },
      { size: 'M', color: 'Cuero Miel', stock: 5 },
    ],
    material: 'Cuero vacuno grabado grano fino',
    composition: '100% Cuero colombiano, herrajes de zamak con baño de oro',
    careInstructions: ['Limpiar con paño seco', 'Evitar contacto directo con perfumes'],
    createdAt: '2026-03-01'
  },
  {
    id: 'ch-acc-02',
    name: 'Aretes Cascada Solitaria Oro & Perla',
    slug: 'aretes-cascada-solitaria-oro-perla',
    category: 'bodys',
    price: 68000,
    originalPrice: 80000,
    description: 'Aretes largos artesanales con gotas de perlas barrocas naturales de agua dulce y estructura texturizada a mano en filigrana contemporánea.',
    shortDescription: 'Perlas barrocas naturales sobre estructura martillada.',
    isNew: false,
    isSale: true,
    images: [
      ASSET_IMAGES.vestidoAurora,
      ASSET_IMAGES.conjuntoMarfil
    ],
    colors: [
      { name: 'Oro & Perla Blanca', hex: '#E5C158' }
    ],
    sizes: ['M'],
    inventory: [
      { size: 'M', color: 'Oro & Perla Blanca', stock: 10 }
    ],
    material: 'Bronce con baño de oro de 18K y laca cataforética protectora',
    composition: 'Hipoalergénico, libre de níquel',
    careInstructions: ['Guardar por separado en su joyero para no rayar'],
    createdAt: '2026-02-14'
  },
  {
    id: 'ch-acc-03',
    name: 'Clutch Joya Seda & Broche Magnético',
    slug: 'clutch-joya-seda-broche-magnetico',
    category: 'bodys',
    price: 115000,
    description: 'Bolso de mano rígido forrado en satén champagne con cadena desmontable en oro viejo para llevar al hombro o como sobre de mano.',
    shortDescription: 'Bolso de fiesta con textura sedosa y cadena oculta.',
    isNew: true,
    images: [
      ASSET_IMAGES.blusaSeda,
      ASSET_IMAGES.enterizoBlack
    ],
    colors: [
      { name: 'Champagne Nácar', hex: '#EDE4DA' },
      { name: 'Negro Onix', hex: '#111111' }
    ],
    sizes: ['M'],
    inventory: [
      { size: 'M', color: 'Champagne Nácar', stock: 4 },
      { size: 'M', color: 'Negro Onix', stock: 3 },
    ],
    material: 'Estructura rígida forrada en raso de seda',
    composition: 'Raso de poliéster, forro de raso, cadena metálica',
    careInstructions: ['Limpieza superficial con paño húmedo'],
    createdAt: '2026-03-06'
  }
];

export const CATEGORIES_LIST: { id: string; name: string; description: string }[] = [
  { id: 'todos', name: 'Todos los Diseños', description: 'Explora toda la colección femenina exclusiva' },
  { id: 'enterizos', name: 'Enterizos', description: 'Siluetas alargadas, cortes asimétricos y palazzo' },
  { id: 'sets', name: 'Sets', description: 'Sets exclusivos, dos piezas y combinaciones de alta costura' },
  { id: 'vestidos', name: 'Vestidos', description: 'Creaciones de gala, midi y vestidos camiseros' },
  { id: 'bodys', name: 'Bodys', description: 'Bodys entallados, telas prémium y siluetas elegantes' },
  { id: 'crop-tops', name: 'Crop tops', description: 'Crop tops sofisticados, escotes finos y detalles únicos' },
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    author: 'Valentina Restrepo',
    city: 'Medellín, Antioquia',
    garment: 'Enterizo Elegance Couture',
    comment: 'Quedé enamorada del enterizo negro. La tela tiene una caída espectacular y el entalle es perfecto. El pedido por WhatsApp fue súper rápido y me llegó en 2 días.',
    rating: 5,
    date: 'Hace 3 días'
  },
  {
    id: 't-2',
    author: 'Camila Montoya',
    city: 'Bogotá D.C.',
    garment: 'Vestido Aurora Esmeralda',
    comment: 'Lo usé para el matrimonio de mi mejor amiga y recibí elogios toda la noche. La atención de Cirleni Hernández por WhatsApp fue inmejorable, me asesoraron con la talla exacta.',
    rating: 5,
    date: 'Hace 1 semana'
  },
  {
    id: 't-3',
    author: 'Daniela Giraldo',
    city: 'Cali, Valle del Cauca',
    garment: 'Conjunto Sartorial Marfil',
    comment: 'La calidad del sastre es digna de una casa de modas internacional. Las terminaciones son impecables y el lino no se arruga fácilmente. Definitivamente volveré a comprar.',
    rating: 5,
    date: 'Hace 2 semanas'
  }
];

export const INITIAL_INSTAGRAM_FEED = [
  {
    id: 'ig-1',
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-black-dress-on-a-runway-41527-large.mp4',
    thumbnailUrl: ASSET_IMAGES.enterizoBlack,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'Pasarela & Atelier Cirleni Hernández: Caída impecable en crepé satén y silueta estructurada ✨',
    likes: 1240,
    comments: 84
  },
  {
    id: 'ig-2',
    type: 'image' as const,
    url: ASSET_IMAGES.vestidoAurora,
    thumbnailUrl: ASSET_IMAGES.vestidoAurora,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'Vestido Aurora en seda esmeralda y detalles en oro. Hecho para ocasiones inolvidables 💚',
    likes: 2180,
    comments: 112
  },
  {
    id: 'ig-3',
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-studio-41481-large.mp4',
    thumbnailUrl: ASSET_IMAGES.pantalonPalazzo,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'Reel de Colección: Pantalón Palazzo Camel y movimiento natural en cada paso 🤎',
    likes: 1890,
    comments: 96
  },
  {
    id: 'ig-4',
    type: 'image' as const,
    url: ASSET_IMAGES.conjuntoMarfil,
    thumbnailUrl: ASSET_IMAGES.conjuntoMarfil,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'El poder del sastre blanco marfil en lino y seda. Clásicos que nunca pasan de moda 🤍',
    likes: 1540,
    comments: 73
  },
  {
    id: 'ig-5',
    type: 'image' as const,
    url: ASSET_IMAGES.hero,
    thumbnailUrl: ASSET_IMAGES.hero,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'Sesión editorial Cirleni Hernández Brand Official 2026. Elegancia que inspira.',
    likes: 3120,
    comments: 145
  },
  {
    id: 'ig-6',
    type: 'image' as const,
    url: ASSET_IMAGES.blusaSeda,
    thumbnailUrl: ASSET_IMAGES.blusaSeda,
    permalink: 'https://www.instagram.com/cirlenihernandez',
    caption: 'Texturas que enamoran: Satén champagne drapeado al milímetro ✨',
    likes: 980,
    comments: 42
  }
];

