export type CategoryId = 
  | 'todos'
  | 'enterizos' 
  | 'sets'
  | 'vestidos' 
  | 'bodys' 
  | 'crop-tops';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface GarmentColor {
  name: string;
  hex: string;
}

export interface InventoryVariant {
  size: GarmentSize;
  color: string;
  stock: number;
}

export interface Product3DConfig {
  enabled: boolean;
  garmentType: 'dress' | 'jumpsuit' | 'two-piece' | 'blouse';
  glbUrl?: string;
  accentFinish?: 'silk' | 'satin' | 'crepe' | 'linen';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  price: number; // in COP
  originalPrice?: number; // for discounts
  description: string;
  shortDescription?: string;
  isNew?: boolean;
  isExclusive?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  images: string[];
  colors: GarmentColor[];
  sizes?: string[];
  inventory?: any[];
  colorImageMap?: Record<string, string>; // Maps color name to image URL or index
  imageColorMap?: Record<string, string>; // Maps image URL to color name (legacy)
  imageColors?: string[]; // Array parallel to images: imageColors[i] is the color name for images[i]
  material: string;
  composition: string;
  careInstructions: string[];
  measurementsGuide?: {
    bust: string;
    waist: string;
    hip: string;
    length: string;
  };
  model3d?: Product3DConfig;
  videoUrl?: string;
  coverMediaType?: 'image' | 'video';
  primaryMediaUrl?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize?: string;
  selectedColor: GarmentColor;
  quantity: number;
  unitPrice: number;
}

export interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  neighborhood: string;
  observations: string;
}

export interface InstagramMediaItem {
  id: string;
  type: 'image' | 'video' | 'reel';
  url: string; // Direct image URL, data URL, or video URL
  thumbnailUrl?: string;
  permalink: string;
  caption: string;
  likes?: number;
  comments?: number;
}

export interface StoreSettings {
  brandName: string;
  whatsappNumber: string; // e.g. "573213490850"
  whatsappDisplay: string; // e.g. "+57 321 349 0850"
  instagramUrl: string;
  logoUrl: string;
  announcementText: string;
  shippingNotice: string;
  freeShippingThreshold: number;
  adminPasscode: string;
}

