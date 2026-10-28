import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  CartItem,
  GarmentSize,
  GarmentColor,
  CategoryId,
  StoreSettings,
  CustomerOrderInfo,
} from '../types';
import {
  INITIAL_STORE_SETTINGS,
  INITIAL_PRODUCTS,
} from '../data/initialProducts';
import { supabase } from '../supabase';

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name || 'Sin nombre',
    slug: row.slug || row.id,
    category: row.category || 'enterizos',
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    description: row.description || '',
    shortDescription: row.short_description || '',
    isNew: Boolean(row.is_new),
    isExclusive: Boolean(row.is_exclusive),
    isSale: Boolean(row.is_sale),
    isBestseller: Boolean(row.is_bestseller),
    images: Array.isArray(row.images) ? row.images : [],
    colors: Array.isArray(row.colors) ? row.colors : [{ name: 'Negro', hex: '#171717' }],
    sizes: Array.isArray(row.sizes) ? row.sizes : ['S', 'M', 'L'],
    inventory: Array.isArray(row.inventory) ? row.inventory : [],
    colorImageMap: row.color_image_map || {},
    imageColors: Array.isArray(row.image_colors) ? row.image_colors : [],
    material: row.material || 'Tela premium',
    composition: row.composition || '100% Alta Calidad',
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : ['Lavado delicado a mano'],
    videoUrl: row.video_url || undefined,
    coverMediaType: row.cover_media_type || 'image',
    primaryMediaUrl: row.primary_media_url || (Array.isArray(row.images) ? row.images[0] : ''),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapProductToRow(prod: Product): any {
  return {
    id: prod.id,
    name: prod.name,
    slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: prod.category || 'enterizos',
    price: Number(prod.price) || 0,
    original_price: prod.originalPrice ? Number(prod.originalPrice) : null,
    description: prod.description || '',
    short_description: prod.shortDescription || '',
    is_new: Boolean(prod.isNew),
    is_exclusive: Boolean(prod.isExclusive),
    is_sale: Boolean(prod.isSale),
    is_bestseller: Boolean(prod.isBestseller),
    images: prod.images || [],
    colors: prod.colors || [],
    sizes: prod.sizes || [],
    inventory: prod.inventory || [],
    color_image_map: prod.colorImageMap || {},
    image_colors: prod.imageColors || [],
    material: prod.material || 'Tela premium',
    composition: prod.composition || '100% Alta Calidad',
    care_instructions: prod.careInstructions || [],
    video_url: prod.videoUrl || null,
    cover_media_type: prod.coverMediaType || 'image',
    primary_media_url: prod.primaryMediaUrl || prod.images?.[0] || '',
    created_at: prod.createdAt || new Date().toISOString(),
  };
}

function mapRowToSettings(row: any): StoreSettings {
  return {
    brandName: row.brand_name || INITIAL_STORE_SETTINGS.brandName,
    whatsappNumber: row.whatsapp_number || INITIAL_STORE_SETTINGS.whatsappNumber,
    whatsappDisplay: row.whatsapp_display || INITIAL_STORE_SETTINGS.whatsappDisplay,
    instagramUrl: row.instagram_url || INITIAL_STORE_SETTINGS.instagramUrl,
    logoUrl: row.logo_url || INITIAL_STORE_SETTINGS.logoUrl,
    announcementText: row.announcement_text || INITIAL_STORE_SETTINGS.announcementText,
    shippingNotice: row.shipping_notice || INITIAL_STORE_SETTINGS.shippingNotice,
    freeShippingThreshold: Number(row.free_shipping_threshold) || INITIAL_STORE_SETTINGS.freeShippingThreshold,
    adminPasscode: row.admin_passcode || INITIAL_STORE_SETTINGS.adminPasscode,
  };
}

function mapSettingsToRow(settings: StoreSettings): any {
  return {
    id: 'main',
    brand_name: settings.brandName,
    whatsapp_number: settings.whatsappNumber,
    whatsapp_display: settings.whatsappDisplay,
    instagram_url: settings.instagramUrl,
    logo_url: settings.logoUrl,
    announcement_text: settings.announcementText,
    shipping_notice: settings.shippingNotice,
    free_shipping_threshold: settings.freeShippingThreshold,
    admin_passcode: settings.adminPasscode,
    updated_at: new Date().toISOString(),
  };
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;

  cart: CartItem[];
  addToCart: (
    product: Product,
    color: GarmentColor,
    quantity?: number
  ) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartVariant: (cartItemId: string, size: GarmentSize, color: GarmentColor) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  activeCategory: CategoryId;
  setActiveCategory: (category: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;

  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;

  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  customerInfo: CustomerOrderInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerOrderInfo>>;

  notificationMessage: string | null;
  showNotification: (msg: string) => void;

  isCloudConnected: boolean;
  isSyncing: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'ch_boutique_products_v1',
  CART: 'ch_boutique_cart_v1',
  WISHLIST: 'ch_boutique_wishlist_v1',
  SETTINGS: 'ch_boutique_settings_v1',
  RECENTLY_VIEWED: 'ch_boutique_recent_v1',
  CUSTOMER_INFO: 'ch_boutique_customer_v1',
  INSTAGRAM_FEED: 'ch_boutique_instagram_v1',
};

// Strips undefined values and invalid map keys recursively so Firestore accepts every document
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map((item) => (typeof item === 'object' && item !== null ? cleanForFirestore(item) : item));
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val === undefined) continue;
      // Exclude invalid Firestore map keys (data URLs, slashes, or excessively long strings)
      if (key.startsWith('data:') || key.includes('/') || key.length > 500) {
        continue;
      }
      const safeKey = key.replace(/\./g, '_');
      cleaned[safeKey] = cleanForFirestore(val);
    }
    return cleaned;
  }
  return obj;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Products state (instant initial cache from localStorage or initial boutique catalog for 0ms load)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Store Settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '573213490850') {
          parsed.whatsappNumber = '573125964567';
          parsed.whatsappDisplay = '+57 312 596 4567';
        }
        return { ...INITIAL_STORE_SETTINGS, ...parsed };
      }
    } catch {
      // ignore
    }
    return INITIAL_STORE_SETTINGS;
  });

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Customer Info
  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_INFO);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: '',
      phone: '',
      department: 'Bogotá D.C.',
      city: 'Bogotá',
      address: '',
      neighborhood: '',
      observations: '',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(customerInfo));
    } catch {
      // ignore
    }
  }, [customerInfo]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  // REAL-TIME SUPABASE SYNCHRONIZATION
  useEffect(() => {
    async function initSupabaseData() {
      try {
        setIsSyncing(true);

        // 1. Fetch initial products from Supabase
        const { data: prodRows, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!prodErr && prodRows && prodRows.length > 0) {
          const loadedProds = prodRows.map(mapRowToProduct);
          setProducts(loadedProds);
          setIsCloudConnected(true);
        }

        // 2. Fetch initial settings from Supabase
        const { data: settingsRow, error: setErr } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'main')
          .maybeSingle();

        if (!setErr && settingsRow) {
          setStoreSettings(mapRowToSettings(settingsRow));
        }
      } catch (err) {
        console.warn('Supabase fetch notice, preserving local state:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    initSupabaseData();

    // Subscribe to realtime changes on products table
    const productsChannel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.eventType === 'INSERT') {
            const newProd = mapRowToProduct(payload.new);
            setProducts((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedProd = mapRowToProduct(payload.new);
            setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Subscribe to realtime changes on store_settings table
    const settingsChannel = supabase
      .channel('public:store_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        (payload) => {
          if (payload.new) {
            setStoreSettings(mapRowToSettings(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  // CRUD Operations synced with Supabase
  const addProduct = async (newProduct: Product) => {
    setIsSyncing(true);
    // Optimistic local update
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    showNotification(`Guardando "${newProduct.name}" en Supabase...`);

    try {
      const row = mapProductToRow(newProduct);
      const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
      if (error) {
        console.error('Error insertando en Supabase:', error.message);
        showNotification(`Nota: Guardado local de "${newProduct.name}"`);
      } else {
        showNotification(`"${newProduct.name}" guardado exitosamente en Supabase`);
      }
    } catch (error) {
      console.error('Error al guardar en Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProduct = async (updated: Product) => {
    setIsSyncing(true);
    // Optimistic update
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
    showNotification(`Actualizando "${updated.name}" en Supabase...`);

    try {
      const row = mapProductToRow(updated);
      const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
      if (error) {
        console.error('Error actualizando en Supabase:', error.message);
      } else {
        showNotification(`"${updated.name}" actualizado en Supabase`);
      }
    } catch (error) {
      console.error('Error al actualizar en Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsSyncing(true);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Eliminando de la base de datos Supabase...');

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Error eliminando de Supabase:', error.message);
      } else {
        showNotification('Prenda eliminada de Supabase');
      }
    } catch (error) {
      console.error('Error al eliminar de Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearAllProducts = async () => {
    setIsSyncing(true);
    showNotification('Limpiando catálogo en Supabase...');
    try {
      const { error } = await supabase.from('products').delete().neq('id', 'keep_none');
      if (!error) {
        setProducts([]);
        try {
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        } catch {
          // ignore
        }
        showNotification('Catálogo limpiado en Supabase.');
      }
    } catch (error) {
      console.error('Error al limpiar productos:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    setIsSyncing(true);
    const updated = { ...storeSettings, ...newSettings };
    setStoreSettings(updated);
    showNotification('Guardando ajustes en Supabase...');

    try {
      const row = mapSettingsToRow(updated);
      const { error } = await supabase.from('store_settings').upsert(row, { onConflict: 'id' });
      if (error) {
        console.error('Error guardando ajustes en Supabase:', error.message);
      } else {
        showNotification('Ajustes guardados en Supabase');
      }
    } catch (error) {
      console.error('Error al guardar ajustes en Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addToCart = (
    product: Product,
    color: GarmentColor,
    quantity: number = 1
  ): { success: boolean; message?: string } => {
    const cartItemId = `${product.id}_${color.name}`;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedSize: 'A coordinar por WhatsApp',
        selectedColor: color,
        quantity,
        unitPrice: product.price,
      };
      setCart((prev) => [newItem, ...prev]);
    }
    showNotification(`"${product.name}" agregado al carrito`);
    return { success: true };
  };


  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const variant = item.product.inventory?.find(
            (v) =>
              v.size === item.selectedSize &&
              v.color.toLowerCase() === item.selectedColor.name.toLowerCase()
          );
          const maxStock = variant !== undefined ? variant.stock : 99;
          const clamped = Math.min(newQuantity, maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const updateCartVariant = (
    cartItemId: string,
    newSize: GarmentSize,
    newColor: GarmentColor
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newId = `${item.productId}_${newSize}_${newColor.name}`;
          return {
            ...item,
            id: newId,
            selectedSize: newSize,
            selectedColor: newColor,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Eliminado de tus favoritos');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Guardado en tus favoritos ✨');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartVariant,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAdminOpen,
        setIsAdminOpen,
        storeSettings,
        updateStoreSettings,
        recentlyViewed,
        addRecentlyViewed,
        customerInfo,
        setCustomerInfo,
        notificationMessage,
        showNotification,
        isCloudConnected,
        isSyncing,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
