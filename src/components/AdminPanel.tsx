import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  Lock,
  ShieldCheck,
  Image as ImageIcon,
  Package,
  Settings,
  Upload,
  Film,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, GarmentSize, GarmentColor, CategoryId } from '../types';
import { formatCOP } from '../utils/formatters';
import { optimizeImageFile } from '../utils/imageOptimizer';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    storeSettings,
    updateStoreSettings,
    showNotification,
    isSyncing,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'new-product' | 'settings'>('products');
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // File input refs for reliable click triggering
  const newPhotoInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);
  const newVideoInputRef = useRef<HTMLInputElement>(null);
  const editVideoInputRef = useRef<HTMLInputElement>(null);

  // Constants for sizes and colors
  const STANDARD_SIZES: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const PRESET_COLORS: GarmentColor[] = [
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Negro', hex: '#171717' },
    { name: 'Vinotinto', hex: '#5B1524' },
    { name: 'Café', hex: '#5C3A21' },
    { name: 'Rojo', hex: '#DC2626' },
    { name: 'Verde militar', hex: '#4B5320' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Azul', hex: '#1D4ED8' },
    { name: 'Rosa', hex: '#F472B6' },
    { name: 'Beige', hex: '#E6D7C3' },
    { name: 'Gris', hex: '#94A3B8' },
    { name: 'Champagne', hex: '#C6A77D' },
  ];

  // Custom color inputs
  const [newCustomColorName, setNewCustomColorName] = useState('');
  const [newCustomColorHex, setNewCustomColorHex] = useState('#DC2626');
  const [editCustomColorName, setEditCustomColorName] = useState('');
  const [editCustomColorHex, setEditCustomColorHex] = useState('#DC2626');

  // Editing existing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');

  // New product form state
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    category: 'enterizos',
    price: 150000,
    originalPrice: 180000,
    description: '',
    shortDescription: '',
    isNew: true,
    isExclusive: false,
    isSale: false,
    isBestseller: false,
    coverMediaType: 'image',
    primaryMediaUrl: '',
    images: [],
    colors: [{ name: 'Negro', hex: '#171717' }],
    sizes: ['S', 'M', 'L'],
    colorImageMap: {},
    imageColorMap: {},
    material: 'Satén y crepé de seda',
    composition: '95% Poliéster, 5% Spandex',
    careInstructions: ['Lavado delicado a mano con agua fría'],
    inventory: [
      { size: 'S', color: 'Negro', stock: 5 },
      { size: 'M', color: 'Negro', stock: 5 },
      { size: 'L', color: 'Negro', stock: 3 },
    ],
    videoUrl: undefined,
  });

  // Settings form
  const [tempSettings, setTempSettings] = useState(storeSettings);

  // Helper functions for Sizes, Colors and Image-Color mapping
  const toggleSize = (size: GarmentSize, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      const current = editingProduct.sizes || [];
      const updated = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      setEditingProduct({ ...editingProduct, sizes: updated.length ? updated : [size] });
    } else {
      const current = (newProd.sizes as GarmentSize[]) || [];
      const updated = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      setNewProd({ ...newProd, sizes: updated.length ? updated : [size] });
    }
  };

  const addColorToProduct = (color: GarmentColor, isEditing: boolean) => {
    if (!color.name.trim()) return;
    if (isEditing && editingProduct) {
      const current = editingProduct.colors || [];
      if (!current.some((c) => c.name.toLowerCase() === color.name.trim().toLowerCase())) {
        setEditingProduct({ ...editingProduct, colors: [...current, { name: color.name.trim(), hex: color.hex }] });
        showNotification(`Color "${color.name}" añadido`);
      } else {
        showNotification(`El color "${color.name}" ya existe`);
      }
    } else {
      const current = newProd.colors || [];
      if (!current.some((c) => c.name.toLowerCase() === color.name.trim().toLowerCase())) {
        setNewProd({ ...newProd, colors: [...current, { name: color.name.trim(), hex: color.hex }] });
        showNotification(`Color "${color.name}" añadido`);
      } else {
        showNotification(`El color "${color.name}" ya existe`);
      }
    }
  };

  const removeColorFromProduct = (colorName: string, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      const current = (editingProduct.colors || []).filter((c) => c.name !== colorName);
      const newColorMap = { ...(editingProduct.colorImageMap || {}) };
      delete newColorMap[colorName];
      const newImgMap = { ...(editingProduct.imageColorMap || {}) };
      Object.keys(newImgMap).forEach((k) => {
        if (newImgMap[k] === colorName) delete newImgMap[k];
      });
      setEditingProduct({
        ...editingProduct,
        colors: current.length ? current : [{ name: 'Único', hex: '#171717' }],
        colorImageMap: newColorMap,
        imageColorMap: newImgMap,
      });
    } else {
      const current = (newProd.colors || []).filter((c) => c.name !== colorName);
      const newColorMap = { ...(newProd.colorImageMap || {}) };
      delete newColorMap[colorName];
      const newImgMap = { ...(newProd.imageColorMap || {}) };
      Object.keys(newImgMap).forEach((k) => {
        if (newImgMap[k] === colorName) delete newImgMap[k];
      });
      setNewProd({
        ...newProd,
        colors: current.length ? current : [{ name: 'Único', hex: '#171717' }],
        colorImageMap: newColorMap,
        imageColorMap: newImgMap,
      });
    }
  };

  const assignColorToImage = (imageIndex: number, colorName: string, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      const currentImgs = editingProduct.images || [];
      const updatedColors = [...(editingProduct.imageColors || [])];
      while (updatedColors.length < currentImgs.length) {
        updatedColors.push('');
      }
      updatedColors[imageIndex] = colorName;

      // Clean colorImageMap with color name as key (no data URLs as keys!)
      const colMap: Record<string, string> = {};
      updatedColors.forEach((cName, idx) => {
        if (cName && currentImgs[idx]) {
          colMap[cName] = currentImgs[idx];
        }
      });

      setEditingProduct({
        ...editingProduct,
        imageColors: updatedColors,
        colorImageMap: colMap,
      });
    } else {
      const currentImgs = newProd.images || [];
      const updatedColors = [...(newProd.imageColors || [])];
      while (updatedColors.length < currentImgs.length) {
        updatedColors.push('');
      }
      updatedColors[imageIndex] = colorName;

      const colMap: Record<string, string> = {};
      updatedColors.forEach((cName, idx) => {
        if (cName && currentImgs[idx]) {
          colMap[cName] = currentImgs[idx];
        }
      });

      setNewProd({
        ...newProd,
        imageColors: updatedColors,
        colorImageMap: colMap,
      });
    }
    showNotification(colorName ? `Foto asignada al color "${colorName}"` : 'Color desasignado de la foto');
  };

  // Helper for uploading and compressing 1 or more photos
  const handleMultiImageFiles = async (
    files: File[] | FileList | null,
    currentImages: string[],
    currentColors: string[],
    onUpdate: (updatedImages: string[], updatedColors: string[]) => void
  ) => {
    if (!files) return;
    const rawList = Array.from(files);
    if (rawList.length === 0) return;

    setIsOptimizing(true);
    showNotification(`Procesando y cargando ${rawList.length} foto(s)...`);

    try {
      const optimizedUrls: string[] = [];
      for (const file of rawList) {
        const optimized = await optimizeImageFile(file);
        if (optimized && optimized.trim()) {
          optimizedUrls.push(optimized);
        }
      }

      if (optimizedUrls.length === 0) {
        showNotification('No se pudo procesar la imagen seleccionada.');
        return;
      }

      const updatedImgs = [...currentImages, ...optimizedUrls];
      const updatedCols = [...currentColors];
      while (updatedCols.length < updatedImgs.length) {
        updatedCols.push('');
      }

      onUpdate(updatedImgs, updatedCols);
      showNotification(`${optimizedUrls.length} foto(s) agregada(s) con éxito`);
    } catch (error) {
      console.error('Error al optimizar imagen:', error);
      showNotification('Error al procesar las fotos. Por favor intenta de nuevo.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Helper for uploading video
  const handleVideoFile = (
    file: File | null,
    onUpdate: (url: string | undefined) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpdate(e.target.result as string);
        showNotification('Video de la prenda cargado exitosamente');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === storeSettings.adminPasscode || passcode === 'cirleni2026') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleClearCatalog = async () => {
    const confirmed = window.confirm(
      '¿Deseas vaciar todas las prendas del catálogo de prueba? Esta acción borrará los registros de la base de datos en la nube para que puedas publicar únicamente tus prendas originales.'
    );
    if (confirmed) {
      await clearAllProducts();
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name?.trim()) {
      showNotification('Por favor asigna un nombre a la prenda.');
      return;
    }

    const isCoverVideo = newProd.coverMediaType === 'video';
    const videoUrl = newProd.videoUrl?.trim() || undefined;
    const imagesList = newProd.images && newProd.images.length > 0 ? newProd.images : [];

    if (!isCoverVideo && imagesList.length === 0) {
      showNotification('Por favor agrega al menos una foto de la prenda o selecciona video de portada.');
      return;
    }

    if (isCoverVideo && !videoUrl) {
      showNotification('Por favor sube o ingresa la URL del video para la portada.');
      return;
    }

    setIsSaving(true);
    try {
      const created: Product = {
        id: `ch-prod-${Date.now()}`,
        name: newProd.name.trim(),
        slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: (newProd.category as CategoryId) || 'enterizos',
        price: Number(newProd.price) || 120000,
        originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
        description: newProd.description || 'Prenda exclusiva confeccionada con estándares de alta costura.',
        shortDescription: newProd.shortDescription || '',
        isNew: Boolean(newProd.isNew),
        isExclusive: Boolean(newProd.isExclusive),
        isSale: Boolean(newProd.isSale),
        isBestseller: Boolean(newProd.isBestseller),
        images: imagesList.length > 0 ? imagesList : (videoUrl ? [videoUrl] : []),
        colors: newProd.colors && newProd.colors.length > 0 ? newProd.colors : [{ name: 'Negro', hex: '#171717' }],
        sizes: newProd.sizes && newProd.sizes.length > 0 ? (newProd.sizes as GarmentSize[]) : ['S', 'M', 'L'],
        colorImageMap: newProd.colorImageMap || {},
        imageColors: newProd.imageColors || new Array(imagesList.length).fill(''),
        material: newProd.material || 'Tela premium',
        composition: newProd.composition || '100% Alta Calidad',
        careInstructions: newProd.careInstructions || ['Lavado delicado a mano'],
        inventory: newProd.inventory || [],
        videoUrl: videoUrl,
        coverMediaType: isCoverVideo ? 'video' : 'image',
        primaryMediaUrl: isCoverVideo ? videoUrl : (imagesList[0] || ''),
        createdAt: new Date().toISOString(),
      };

      await addProduct(created);
      showNotification(`"${created.name}" guardada con éxito (${created.images.length} fotos)`);
      setActiveTab('products');
      setNewProd({
        name: '',
        category: 'enterizos',
        price: 150000,
        description: '',
        coverMediaType: 'image',
        primaryMediaUrl: '',
        images: [],
        colors: [{ name: 'Negro', hex: '#171717' }],
        sizes: ['S', 'M', 'L'],
        colorImageMap: {},
        imageColors: [],
        material: 'Satén y crepé de seda',
        composition: '95% Poliéster, 5% Spandex',
        careInstructions: ['Lavado delicado a mano con agua fría'],
        inventory: [
          { size: 'S', color: 'Negro', stock: 5 },
          { size: 'M', color: 'Negro', stock: 5 },
          { size: 'L', color: 'Negro', stock: 3 },
        ],
        videoUrl: undefined,
      });
    } catch (err) {
      console.error('Error al guardar prenda:', err);
      showNotification('Error al guardar en la nube. Revisa tu conexión o el tamaño de las fotos.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const isCoverVideo = editingProduct.coverMediaType === 'video';
    const videoUrl = editingProduct.videoUrl?.trim() || undefined;
    const imagesList = editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [];

    setIsSaving(true);
    try {
      const updated: Product = {
        ...editingProduct,
        coverMediaType: isCoverVideo ? 'video' : 'image',
        primaryMediaUrl: isCoverVideo ? (videoUrl || '') : (imagesList[0] || ''),
        videoUrl: videoUrl,
        images: imagesList.length > 0 ? imagesList : (videoUrl ? [videoUrl] : []),
        colors: editingProduct.colors && editingProduct.colors.length > 0 ? editingProduct.colors : [{ name: 'Negro', hex: '#171717' }],
        sizes: editingProduct.sizes && editingProduct.sizes.length > 0 ? editingProduct.sizes : ['S', 'M', 'L'],
        colorImageMap: editingProduct.colorImageMap || {},
        imageColors: editingProduct.imageColors || new Array(imagesList.length).fill(''),
      };

      await updateProduct(updated);
      showNotification(`"${updated.name}" actualizada con éxito (${updated.images.length} fotos)`);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error al actualizar prenda:', err);
      showNotification('Error al actualizar cambios en la base de datos.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(tempSettings);
  };

  // Handle local logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setTempSettings((prev) => ({ ...prev, logoUrl: dataUrl }));
          updateStoreSettings({ logoUrl: dataUrl });
          showNotification('Logo oficial actualizado exitosamente desde archivo local');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        className="bg-white sm:rounded-2xl max-w-4xl w-full min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto shadow-2xl border-0 sm:border border-[#EDE4DA] sm:my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE4DA] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#171717] rounded-lg text-[#C6A77D] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#171717]">
                Panel de Administración Boutique
              </h2>
              <p className="text-xs text-[#77716C]">
                Cirleni Hernández Brand Official
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-full border border-emerald-200">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Base en la Nube Conectada</span>
              {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600 ml-1" />}
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-[#77716C] hover:text-[#171717] rounded-full hover:bg-[#FAF8F5] transition-colors"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Protection */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#EDE4DA] flex items-center justify-center text-[#C6A77D]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#171717]">
                Acceso Administrativo Protegido
              </h3>
              <p className="text-xs text-[#77716C]">
                Ingresa tu clave de acceso para gestionar prendas, fotos, videos y WhatsApp.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Ingresa tu clave de administrador"
                  className="w-full px-4 py-2.5 text-center text-sm border border-[#EDE4DA] rounded-lg focus:outline-hidden focus:border-[#C6A77D]"
                  autoFocus
                />
                {passcodeError && (
                  <span className="text-xs text-red-600 block mt-1.5">
                    Clave incorrecta. Intenta nuevamente.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Ingresar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col">
            {/* Nav Tabs */}
            <div className="flex items-center justify-between border-b border-[#EDE4DA] bg-[#FAF8F5] px-3 sm:px-6 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none">
              <div className="flex shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'products'
                      ? 'border-[#171717] text-[#171717]'
                      : 'border-transparent text-[#77716C] hover:text-[#171717]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Prendas en Catálogo ({products.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('new-product');
                    setEditingProduct(null);
                  }}
                  className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'new-product'
                      ? 'border-[#171717] text-[#171717]'
                      : 'border-transparent text-[#77716C] hover:text-[#171717]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Nueva Prenda</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setEditingProduct(null);
                  }}
                  className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'border-[#171717] text-[#171717]'
                      : 'border-transparent text-[#77716C] hover:text-[#171717]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>WhatsApp & Tienda</span>
                </button>
              </div>

              {products.length > 0 && (
                <button
                  onClick={handleClearCatalog}
                  className="text-[11px] text-[#77716C] hover:text-red-600 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
                  title="Vaciar prendas de prueba para dejar el catálogo limpio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vaciar Prendas de Prueba</span>
                </button>
              )}
            </div>

            {/* Tab 1: Product List & Stock */}
            {activeTab === 'products' && !editingProduct && (
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#171717]">
                      Prendas registradas en tu tienda oficial
                    </h3>
                    <p className="text-xs text-[#77716C]">
                      Aquí puedes editar precios, tallas, fotos o videos de portada de cada prenda.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('new-product')}
                    className="px-3.5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#C6A77D] self-start sm:self-auto transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Nueva Prenda</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="bg-[#FAF8F5] rounded-xl border border-dashed border-[#EDE4DA] p-10 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center text-[#C6A77D] border border-[#EDE4DA]">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-[#171717]">
                        No hay prendas en el catálogo todavía
                      </h4>
                      <p className="text-xs text-[#77716C] max-w-md mx-auto">
                        Tu tienda está limpia y conectada a la base de datos en la nube. Comienza agregando tus vestidos, enterizos, sets, bodys o crop tops originales.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('new-product')}
                      className="px-5 py-2.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Primera Prenda</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#EDE4DA] rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF8F5] text-[#171717] uppercase tracking-wider text-[11px] font-semibold border-b border-[#EDE4DA]">
                        <tr>
                          <th className="py-3 px-4">Prenda & Portada</th>
                          <th className="py-3 px-4">Categoría</th>
                          <th className="py-3 px-4">Precio COP</th>
                          <th className="py-3 px-4">Tallas</th>
                          <th className="py-3 px-4">Multimedia</th>
                          <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDE4DA]">
                        {products.map((p) => {
                          const isCoverVid = p.coverMediaType === 'video' && (p.primaryMediaUrl || p.videoUrl);
                          return (
                            <tr key={p.id} className="hover:bg-[#FAF8F5]/50">
                              <td className="py-3 px-4 flex items-center gap-3">
                                {isCoverVid ? (
                                  <div className="relative w-11 h-14 rounded-md border border-[#EDE4DA] bg-black overflow-hidden flex items-center justify-center shrink-0">
                                    <video
                                      src={p.primaryMediaUrl || p.videoUrl}
                                      className="w-full h-full object-cover"
                                      muted
                                      playsInline
                                    />
                                    <span className="absolute bottom-0.5 right-0.5 bg-[#C6A77D] text-[#171717] text-[7px] font-extrabold px-1 py-0.5 rounded uppercase">
                                      VIDEO
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    src={p.images[0] || '/src/assets/images/fashion_enterizo_black_1792782858876.jpg'}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-11 h-14 object-cover rounded-md border border-[#EDE4DA] shrink-0"
                                  />
                                )}
                                <div>
                                  <span className="font-semibold text-[#171717] block">
                                    {p.name}
                                  </span>
                                  <span className="text-[10px] text-[#77716C]">
                                    {p.colors.map((c) => c.name).join(', ')}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-[#77716C] uppercase text-[11px]">
                                {p.category}
                              </td>
                              <td className="py-3 px-4 font-bold text-[#171717] tabular-nums">
                                {formatCOP(p.price)}
                              </td>
                              <td className="py-3 px-4 text-[#77716C]">
                                 WhatsApp
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {p.coverMediaType === 'video' ? (
                                    <span className="text-[10px] font-bold text-[#171717] bg-[#C6A77D]/30 px-2 py-0.5 rounded border border-[#C6A77D]/60 flex items-center gap-1">
                                      <Film className="w-3 h-3 text-[#171717]" />
                                      Portada Video
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-[#171717] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE4DA] flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3 text-[#C6A77D]" />
                                      Portada Foto
                                    </span>
                                  )}

                                  {p.images.length > 0 && (
                                    <span className="text-[10px] text-[#77716C] bg-white px-1.5 py-0.5 rounded border border-[#EDE4DA]">
                                      {p.images.length} {p.images.length === 1 ? 'foto' : 'fotos'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 text-[#171717] hover:text-[#C6A77D] hover:bg-[#FAF8F5] rounded transition-colors"
                                  title="Editar prenda"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-1.5 text-[#77716C] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar de la tienda"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Edit Product */}
            {editingProduct && (
              <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6A77D]">
                      Modo Edición
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#171717]">
                      {editingProduct.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="text-xs text-[#77716C] hover:text-[#171717] underline"
                  >
                    Volver al listado
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Nombre de la Prenda *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Categoría *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as CategoryId,
                        })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    >
                      <option value="enterizos">Enterizos</option>
                      <option value="sets">Sets</option>
                      <option value="vestidos">Vestidos</option>
                      <option value="bodys">Bodys</option>
                      <option value="crop-tops">Crop tops</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Precio COP *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Precio Anterior (Descuento)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Ej. 180000 para indicar oferta"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg tabular-nums"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Descripción de la Prenda</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  {/* Tallas Disponibles */}
                  {/* WhatsApp Sizing Note */}
                  <div className="sm:col-span-2 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#C6A77D]/40 text-xs text-[#77716C] flex items-center gap-2">
                    <span className="text-[#25D366] font-bold text-sm">💬</span>
                    <span>Las tallas se coordinan directamente con el cliente al momento de atender el pedido por WhatsApp.</span>
                  </div>

                  {/* Colores Disponibles */}
                  <div className="sm:col-span-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-xs text-[#171717] block">
                          Colores Disponibles de la Prenda *
                        </span>
                        <p className="text-[11px] text-[#77716C]">
                          Agrega los colores en que existe esta prenda para luego asociar cada foto al color correspondiente.
                        </p>
                      </div>

                      {/* Lista de colores actuales */}
                      <span className="text-[11px] font-semibold text-[#C6A77D]">
                        {editingProduct.colors.length} {editingProduct.colors.length === 1 ? 'color activo' : 'colores activos'}
                      </span>
                    </div>

                    {/* Chips de colores actuales */}
                    <div className="flex flex-wrap gap-2">
                      {editingProduct.colors.map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#EDE4DA] rounded-lg text-xs font-semibold text-[#171717] shadow-2xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => removeColorFromProduct(c.name, true)}
                            className="p-0.5 text-[#77716C] hover:text-red-600 rounded"
                            title={`Quitar color ${c.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Presets rápidos y creador personalizado */}
                    <div className="pt-2 border-t border-[#EDE4DA] space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#77716C] block">
                        Agregar Colores Frecuentes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((preset) => {
                          const alreadyAdded = editingProduct.colors.some(
                            (c) => c.name.toLowerCase() === preset.name.toLowerCase()
                          );
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => addColorToProduct(preset, true)}
                              disabled={alreadyAdded}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                                alreadyAdded
                                  ? 'bg-[#EDE4DA]/40 text-[#77716C] border-transparent cursor-default'
                                  : 'bg-white hover:bg-stone-50 text-[#171717] border-[#EDE4DA]'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/15"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>+{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Agregar Color Personalizado */}
                      <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <div className="flex items-center gap-1.5 bg-white border border-[#EDE4DA] rounded-lg px-2 py-1">
                          <input
                            type="color"
                            value={editCustomColorHex}
                            onChange={(e) => setEditCustomColorHex(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            title="Elegir tono exacto"
                          />
                          <input
                            type="text"
                            value={editCustomColorName}
                            onChange={(e) => setEditCustomColorName(e.target.value)}
                            placeholder="Nombre (ej. Magenta, Vino)"
                            className="text-xs text-[#171717] border-0 focus:outline-none w-32"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (editCustomColorName.trim()) {
                              addColorToProduct(
                                { name: editCustomColorName.trim(), hex: editCustomColorHex },
                                true
                              );
                              setEditCustomColorName('');
                            }
                          }}
                          className="px-3 py-1.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Añadir Color
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Multimedia: Portada Principal Selector (Foto o Video) */}
                  <div className="sm:col-span-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE4DA] pb-3">
                      <div>
                        <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-[#C6A77D]" />
                          <span>Primer Elemento Visual / Portada de la Prenda</span>
                        </span>
                        <p className="text-[11px] text-[#77716C]">
                          Selecciona si deseas que la primera vista sea una Foto o un Video de la prenda.
                        </p>
                      </div>

                      {/* Selector de tipo de medio */}
                      <div className="flex bg-white p-1 rounded-lg border border-[#EDE4DA] self-start sm:self-auto shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              coverMediaType: 'image',
                              primaryMediaUrl: editingProduct.images[0] || '',
                            })
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            editingProduct.coverMediaType !== 'video'
                              ? 'bg-[#171717] text-white'
                              : 'text-[#77716C] hover:text-[#171717]'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#C6A77D]" />
                          <span>Foto de Portada</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              coverMediaType: 'video',
                              primaryMediaUrl: editingProduct.videoUrl || '',
                            })
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            editingProduct.coverMediaType === 'video'
                              ? 'bg-[#C6A77D] text-[#171717]'
                              : 'text-[#77716C] hover:text-[#171717]'
                          }`}
                        >
                          <Film className="w-3.5 h-3.5 text-[#171717]" />
                          <span>Video de Portada</span>
                        </button>
                      </div>
                    </div>

                    {/* Si la portada es Video */}
                    {editingProduct.coverMediaType === 'video' && (
                      <div className="space-y-3 p-3.5 bg-white rounded-lg border border-[#C6A77D]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-[#C6A77D]" />
                              <span>Video Asignado como Primera Vista</span>
                            </span>
                            <p className="text-[11px] text-[#77716C]">
                              Carga un video en MP4/WebM desde tu dispositivo o ingresa un enlace directo.
                            </p>
                          </div>

                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors self-start sm:self-auto">
                            <Upload className="w-3.5 h-3.5 text-[#C6A77D]" />
                            <span>Subir video</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                   handleVideoFile(file, (url) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      videoUrl: url,
                                      primaryMediaUrl: url,
                                    })
                                  );
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProduct.videoUrl || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                videoUrl: e.target.value,
                                primaryMediaUrl: e.target.value,
                              })
                            }
                            placeholder="O escribe una URL directa de video (MP4 / WebM)"
                            className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                          />
                          {editingProduct.videoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({
                                  ...editingProduct,
                                  videoUrl: undefined,
                                  primaryMediaUrl: editingProduct.images[0] || '',
                                  coverMediaType: 'image',
                                })
                              }
                              className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                            >
                              Quitar
                            </button>
                          )}
                        </div>

                        {editingProduct.videoUrl && (
                          <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-[#EDE4DA] bg-black">
                            <video
                              src={editingProduct.videoUrl}
                              controls
                              muted
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fotografías Adicionales / Galería con Asociación de Color */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-[#C6A77D]" />
                            <span>Galería de Fotos ({editingProduct.images.length}) & Asociación a Color</span>
                          </span>
                          <p className="text-[11px] text-[#77716C]">
                            Puedes asignarle a cada foto el color de la prenda que muestra, para que al elegir ese color en la tienda cambie a esa foto automáticamente.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isOptimizing}
                          onClick={() => editPhotoInputRef.current?.click()}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${isOptimizing ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#171717] hover:bg-[#C6A77D] cursor-pointer'} text-white text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto`}
                        >
                          {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C6A77D]" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>{isOptimizing ? 'Optimizando fotos...' : 'Subir fotos'}</span>
                        </button>
                        <input
                          ref={editPhotoInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isOptimizing}
                          onChange={(e) => {
                            const selected = e.target.files ? Array.from(e.target.files) : [];
                            e.target.value = '';
                            if (selected.length > 0) {
                              handleMultiImageFiles(
                                selected,
                                editingProduct.images || [],
                                editingProduct.imageColors || [],
                                (updatedImgs, updatedCols) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: updatedImgs,
                                    imageColors: updatedCols,
                                    primaryMediaUrl:
                                      editingProduct.coverMediaType === 'image'
                                        ? updatedImgs[0] || ''
                                        : editingProduct.primaryMediaUrl,
                                  })
                              );
                            }
                          }}
                          className="hidden"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editImageUrlInput}
                          onChange={(e) => setEditImageUrlInput(e.target.value)}
                          placeholder="O agrega una URL de imagen (/src/assets/... o https://...)"
                          className="flex-1 px-3 py-1.5 bg-white border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editImageUrlInput.trim()) {
                              const updatedImgs = [...editingProduct.images, editImageUrlInput.trim()];
                              const updatedCols = [...(editingProduct.imageColors || []), ''];
                              setEditingProduct({
                                ...editingProduct,
                                images: updatedImgs,
                                imageColors: updatedCols,
                                primaryMediaUrl:
                                  editingProduct.coverMediaType === 'image'
                                    ? updatedImgs[0]
                                    : editingProduct.primaryMediaUrl,
                              });
                              setEditImageUrlInput('');
                              showNotification('Foto agregada a la prenda');
                            }
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#EDE4DA] rounded-lg text-xs font-semibold text-[#171717]"
                        >
                          Añadir URL
                        </button>
                      </div>

                      {/* Miniaturas de Fotos con Asignación de Color */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                        {editingProduct.images.map((imgUrl, idx) => {
                          const assignedColor = editingProduct.imageColors?.[idx] || '';
                          const assignedColorObj = editingProduct.colors.find(
                            (c) => c.name.toLowerCase() === assignedColor.toLowerCase()
                          );
                          return (
                            <div
                              key={idx}
                              className="rounded-lg border border-[#EDE4DA] bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                            >
                              <div className="relative aspect-[3/4] w-full bg-stone-100 group">
                                <img
                                  src={imgUrl}
                                  alt={`Foto ${idx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {idx === 0 && editingProduct.coverMediaType !== 'video' ? (
                                  <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold bg-[#171717] text-[#C6A77D] px-1.5 py-0.5 rounded shadow-xs">
                                    Portada
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImgs = [...editingProduct.images];
                                      const newCols = [...(editingProduct.imageColors || [])];
                                      const [selectedImg] = newImgs.splice(idx, 1);
                                      const [selectedCol] = newCols.splice(idx, 1);
                                      newImgs.unshift(selectedImg);
                                      newCols.unshift(selectedCol || '');
                                      setEditingProduct({
                                        ...editingProduct,
                                        images: newImgs,
                                        imageColors: newCols,
                                        coverMediaType: 'image',
                                        primaryMediaUrl: selectedImg,
                                      });
                                      showNotification('Foto establecida como portada principal');
                                    }}
                                    className="absolute top-1.5 left-1.5 z-10 text-[9px] font-medium bg-black/70 hover:bg-[#171717] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Hacer Portada
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const filteredImgs = editingProduct.images.filter((_, i) => i !== idx);
                                    const filteredCols = (editingProduct.imageColors || []).filter((_, i) => i !== idx);
                                    setEditingProduct({
                                      ...editingProduct,
                                      images: filteredImgs,
                                      imageColors: filteredCols,
                                      primaryMediaUrl:
                                        editingProduct.coverMediaType === 'image'
                                          ? filteredImgs[0] || ''
                                          : editingProduct.primaryMediaUrl,
                                    });
                                  }}
                                  className="absolute top-1.5 right-1.5 z-10 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                                  title="Eliminar foto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Selector de Color para esta foto */}
                              <div className="p-2 bg-[#FAF8F5] border-t border-[#EDE4DA] space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-[#171717] flex items-center gap-1 truncate">
                                    {assignedColorObj && (
                                      <span
                                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/20 shrink-0"
                                        style={{ backgroundColor: assignedColorObj.hex }}
                                      />
                                    )}
                                    <span>Color de esta foto:</span>
                                  </span>
                                </div>
                                <select
                                  value={assignedColor}
                                  onChange={(e) => assignColorToImage(idx, e.target.value, true)}
                                  className="w-full text-[11px] py-1 px-1.5 bg-white border border-[#EDE4DA] rounded font-medium text-[#171717] focus:border-[#C6A77D] focus:outline-none"
                                >
                                  <option value="">(Sin color / Foto general)</option>
                                  {editingProduct.colors.map((c) => (
                                    <option key={c.name} value={c.name}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Si la portada es foto, permitir video secundario opcional */}
                    {editingProduct.coverMediaType !== 'video' && (
                      <div className="pt-3 border-t border-[#EDE4DA]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-[#C6A77D]" />
                              <span>Video de Pasarela Opcional</span>
                            </span>
                            <p className="text-[11px] text-[#77716C]">
                              Puedes incluir un video para que las clientas vean la caída de la tela en el detalle.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => editVideoInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#171717] border border-[#EDE4DA] text-xs font-semibold rounded-lg cursor-pointer transition-colors self-start sm:self-auto"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C6A77D]" />
                            <span>Subir video</span>
                          </button>
                          <input
                            ref={editVideoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (file) {
                                handleVideoFile(file, (url) =>
                                  setEditingProduct({ ...editingProduct, videoUrl: url })
                                );
                              }
                            }}
                            className="hidden"
                          />
                        </div>

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={editingProduct.videoUrl || ''}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, videoUrl: e.target.value })
                            }
                            placeholder="O pega URL de video secundario"
                            className="flex-1 px-3 py-1.5 bg-white border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Etiquetas / Badges */}
                  <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isSale)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isSale: e.target.checked })
                        }
                      />
                      <span>En Oferta</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isExclusive)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isExclusive: e.target.checked })
                        }
                      />
                      <span>Exclusivo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isNew)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                        }
                      />
                      <span>Nueva Colección</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE4DA]">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#EDE4DA] rounded-lg text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#C6A77D] transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Create New Product */}
            {activeTab === 'new-product' && (
              <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
                <div className="pb-2 border-b border-[#EDE4DA]">
                  <h3 className="font-serif text-base font-bold text-[#171717]">
                    Publicar Nueva Prenda en tu Tienda
                  </h3>
                  <p className="text-xs text-[#77716C]">
                    La información y fotos/videos se guardarán directamente en tu base de datos en la nube.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Nombre de la Prenda *</label>
                    <input
                      type="text"
                      required
                      value={newProd.name || ''}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      placeholder="Ej. Enterizo Gala Esmeralda"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Categoría *</label>
                    <select
                      value={newProd.category}
                      onChange={(e) =>
                        setNewProd({ ...newProd, category: e.target.value as CategoryId })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    >
                      <option value="enterizos">Enterizos</option>
                      <option value="sets">Sets</option>
                      <option value="vestidos">Vestidos</option>
                      <option value="bodys">Bodys</option>
                      <option value="crop-tops">Crop tops</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Precio en COP *</label>
                    <input
                      type="number"
                      required
                      value={newProd.price || ''}
                      onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      placeholder="185000"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Precio Anterior (Opcional)</label>
                    <input
                      type="number"
                      value={newProd.originalPrice || ''}
                      onChange={(e) =>
                        setNewProd({
                          ...newProd,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="210000"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg tabular-nums"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Descripción Detallada</label>
                    <textarea
                      value={newProd.description || ''}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      placeholder="Detalles de corte, tela, ocasiones de uso y detalles de confección..."
                      rows={3}
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  {/* WhatsApp Sizing Note */}
                  <div className="sm:col-span-2 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#C6A77D]/40 text-xs text-[#77716C] flex items-center gap-2">
                    <span className="text-[#25D366] font-bold text-sm">💬</span>
                    <span>Las tallas se coordinan directamente con el cliente al momento de atender el pedido por WhatsApp.</span>
                  </div>

                  {/* Colores Disponibles */}
                  <div className="sm:col-span-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-xs text-[#171717] block">
                          Colores Disponibles de la Prenda *
                        </span>
                        <p className="text-[11px] text-[#77716C]">
                          Define los colores de esta prenda y luego podrás asociar cada foto que subas a su color exacto.
                        </p>
                      </div>

                      <span className="text-[11px] font-semibold text-[#C6A77D]">
                        {(newProd.colors || []).length} {((newProd.colors || []).length === 1) ? 'color activo' : 'colores activos'}
                      </span>
                    </div>

                    {/* Chips de colores actuales */}
                    <div className="flex flex-wrap gap-2">
                      {(newProd.colors || []).map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#EDE4DA] rounded-lg text-xs font-semibold text-[#171717] shadow-2xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => removeColorFromProduct(c.name, false)}
                            className="p-0.5 text-[#77716C] hover:text-red-600 rounded"
                            title={`Quitar color ${c.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Presets rápidos y creador personalizado */}
                    <div className="pt-2 border-t border-[#EDE4DA] space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#77716C] block">
                        Agregar Colores Frecuentes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((preset) => {
                          const alreadyAdded = (newProd.colors || []).some(
                            (c) => c.name.toLowerCase() === preset.name.toLowerCase()
                          );
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => addColorToProduct(preset, false)}
                              disabled={alreadyAdded}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                                alreadyAdded
                                  ? 'bg-[#EDE4DA]/40 text-[#77716C] border-transparent cursor-default'
                                  : 'bg-white hover:bg-stone-50 text-[#171717] border-[#EDE4DA]'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/15"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>+{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Agregar Color Personalizado */}
                      <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <div className="flex items-center gap-1.5 bg-white border border-[#EDE4DA] rounded-lg px-2 py-1">
                          <input
                            type="color"
                            value={newCustomColorHex}
                            onChange={(e) => setNewCustomColorHex(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            title="Elegir tono exacto"
                          />
                          <input
                            type="text"
                            value={newCustomColorName}
                            onChange={(e) => setNewCustomColorName(e.target.value)}
                            placeholder="Nombre (ej. Nude, Cobre)"
                            className="text-xs text-[#171717] border-0 focus:outline-none w-32"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (newCustomColorName.trim()) {
                              addColorToProduct(
                                { name: newCustomColorName.trim(), hex: newCustomColorHex },
                                false
                              );
                              setNewCustomColorName('');
                            }
                          }}
                          className="px-3 py-1.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Añadir Color
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Multimedia: Portada Principal Selector (Foto o Video) */}
                  <div className="sm:col-span-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE4DA] pb-3">
                      <div>
                        <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-[#C6A77D]" />
                          <span>Primer Elemento Visual / Portada Principal</span>
                        </span>
                        <p className="text-[11px] text-[#77716C]">
                          ¿Qué deseas mostrar en la primera vista de la prenda? Puedes elegir Foto o Video.
                        </p>
                      </div>

                      {/* Selector de Foto o Video */}
                      <div className="flex bg-white p-1 rounded-lg border border-[#EDE4DA] self-start sm:self-auto shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            setNewProd({
                              ...newProd,
                              coverMediaType: 'image',
                              primaryMediaUrl: newProd.images?.[0] || '',
                            })
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            newProd.coverMediaType !== 'video'
                              ? 'bg-[#171717] text-white'
                              : 'text-[#77716C] hover:text-[#171717]'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#C6A77D]" />
                          <span>Foto de Portada</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setNewProd({
                              ...newProd,
                              coverMediaType: 'video',
                              primaryMediaUrl: newProd.videoUrl || '',
                            })
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            newProd.coverMediaType === 'video'
                              ? 'bg-[#C6A77D] text-[#171717]'
                              : 'text-[#77716C] hover:text-[#171717]'
                          }`}
                        >
                          <Film className="w-3.5 h-3.5 text-[#171717]" />
                          <span>Video de Portada</span>
                        </button>
                      </div>
                    </div>

                    {/* Si la portada es Video */}
                    {newProd.coverMediaType === 'video' && (
                      <div className="space-y-3 p-3.5 bg-white rounded-lg border border-[#C6A77D]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-[#C6A77D]" />
                              <span>Cargar Video para la Portada</span>
                            </span>
                            <p className="text-[11px] text-[#77716C]">
                              Este video aparecerá en la primera vista de la tarjeta de la prenda en la tienda.
                            </p>
                          </div>

                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors self-start sm:self-auto">
                            <Upload className="w-3.5 h-3.5 text-[#C6A77D]" />
                            <span>Subir archivo de video</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVideoFile(file, (url) =>
                                    setNewProd({
                                      ...newProd,
                                      videoUrl: url,
                                      primaryMediaUrl: url,
                                    })
                                  );
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProd.videoUrl || ''}
                            onChange={(e) =>
                              setNewProd({
                                ...newProd,
                                videoUrl: e.target.value,
                                primaryMediaUrl: e.target.value,
                              })
                            }
                            placeholder="O escribe una URL directa de video (MP4 / WebM)"
                            className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                          />
                          {newProd.videoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setNewProd({
                                  ...newProd,
                                  videoUrl: undefined,
                                  primaryMediaUrl: newProd.images?.[0] || '',
                                  coverMediaType: 'image',
                                })
                              }
                              className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                            >
                              Quitar
                            </button>
                          )}
                        </div>

                        {newProd.videoUrl && (
                          <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-[#EDE4DA] bg-black">
                            <video
                              src={newProd.videoUrl}
                              controls
                              muted
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Galería de Fotos con Asociación a Color */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-[#C6A77D]" />
                            <span>Fotografías de la Prenda ({newProd.images?.length || 0}) & Color Asociado</span>
                          </span>
                          <p className="text-[11px] text-[#77716C]">
                            {newProd.coverMediaType === 'video'
                              ? 'Fotos complementarias. Puedes asociar cada una al color que exhibe.'
                              : 'La primera foto será la portada. Puedes asignarle a cada foto su color correspondiente.'}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isOptimizing}
                          onClick={() => newPhotoInputRef.current?.click()}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${isOptimizing ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#171717] hover:bg-[#C6A77D] cursor-pointer'} text-white text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto`}
                        >
                          {isOptimizing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C6A77D]" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{isOptimizing ? 'Optimizando fotos...' : 'Subir fotos'}</span>
                        </button>
                        <input
                          ref={newPhotoInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isOptimizing}
                          onChange={(e) => {
                            const selected = e.target.files ? Array.from(e.target.files) : [];
                            e.target.value = '';
                            if (selected.length > 0) {
                              handleMultiImageFiles(
                                selected,
                                newProd.images || [],
                                newProd.imageColors || [],
                                (updatedImgs, updatedCols) =>
                                  setNewProd({
                                    ...newProd,
                                    images: updatedImgs,
                                    imageColors: updatedCols,
                                    primaryMediaUrl:
                                      newProd.coverMediaType === 'image'
                                        ? updatedImgs[0] || ''
                                        : newProd.primaryMediaUrl,
                                  })
                              );
                            }
                          }}
                          className="hidden"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newImageUrlInput}
                          onChange={(e) => setNewImageUrlInput(e.target.value)}
                          placeholder="O escribe una URL de imagen (/src/assets/... o https://...)"
                          className="flex-1 px-3 py-1.5 bg-white border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newImageUrlInput.trim()) {
                              const list = [...(newProd.images || []), newImageUrlInput.trim()];
                              const cols = [...(newProd.imageColors || []), ''];
                              setNewProd({
                                ...newProd,
                                images: list,
                                imageColors: cols,
                                primaryMediaUrl:
                                  newProd.coverMediaType === 'image'
                                    ? list[0]
                                    : newProd.primaryMediaUrl,
                              });
                              setNewImageUrlInput('');
                              showNotification('Foto agregada a la nueva prenda');
                            }
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#EDE4DA] rounded-lg text-xs font-semibold text-[#171717]"
                        >
                          Añadir URL
                        </button>
                      </div>

                      {/* Miniaturas con Asignación de Color */}
                      {newProd.images && newProd.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                          {newProd.images.map((imgUrl, idx) => {
                            const assignedColor = newProd.imageColors?.[idx] || '';
                            const assignedColorObj = (newProd.colors || []).find(
                              (c) => c.name.toLowerCase() === assignedColor.toLowerCase()
                            );
                            return (
                              <div
                                key={idx}
                                className="rounded-lg border border-[#EDE4DA] bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                              >
                                <div className="relative aspect-[3/4] w-full bg-stone-100 group">
                                  <img
                                    src={imgUrl}
                                    alt={`Foto ${idx + 1}`}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  {idx === 0 && newProd.coverMediaType !== 'video' ? (
                                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold bg-[#171717] text-[#C6A77D] px-1.5 py-0.5 rounded shadow-xs">
                                      Portada
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const list = [...(newProd.images || [])];
                                        const cols = [...(newProd.imageColors || [])];
                                        const [pickedImg] = list.splice(idx, 1);
                                        const [pickedCol] = cols.splice(idx, 1);
                                        list.unshift(pickedImg);
                                        cols.unshift(pickedCol || '');
                                        const colMap: Record<string, string> = {};
                                        cols.forEach((cName, i) => {
                                          if (cName && list[i]) colMap[cName] = list[i];
                                        });
                                        setNewProd({
                                          ...newProd,
                                          images: list,
                                          imageColors: cols,
                                          colorImageMap: colMap,
                                          coverMediaType: 'image',
                                          primaryMediaUrl: pickedImg,
                                        });
                                        showNotification('Foto definida como portada');
                                      }}
                                      className="absolute top-1.5 left-1.5 z-10 text-[9px] font-medium bg-black/70 hover:bg-[#171717] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      Hacer Portada
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = (newProd.images || []).filter((_, i) => i !== idx);
                                      const cols = (newProd.imageColors || []).filter((_, i) => i !== idx);
                                      const colMap: Record<string, string> = {};
                                      cols.forEach((cName, i) => {
                                        if (cName && list[i]) colMap[cName] = list[i];
                                      });
                                      setNewProd({
                                        ...newProd,
                                        images: list,
                                        imageColors: cols,
                                        colorImageMap: colMap,
                                        primaryMediaUrl:
                                          newProd.coverMediaType === 'image'
                                            ? list[0] || ''
                                            : newProd.primaryMediaUrl,
                                      });
                                    }}
                                    className="absolute top-1.5 right-1.5 z-10 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                                    title="Eliminar foto"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Selector de Color para esta foto */}
                                <div className="p-2 bg-[#FAF8F5] border-t border-[#EDE4DA] space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold text-[#171717] flex items-center gap-1 truncate">
                                      {assignedColorObj && (
                                        <span
                                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/20 shrink-0"
                                          style={{ backgroundColor: assignedColorObj.hex }}
                                        />
                                      )}
                                      <span>Color de esta foto:</span>
                                    </span>
                                  </div>
                                  <select
                                    value={assignedColor}
                                    onChange={(e) => assignColorToImage(idx, e.target.value, false)}
                                    className="w-full text-[11px] py-1 px-1.5 bg-white border border-[#EDE4DA] rounded font-medium text-[#171717] focus:border-[#C6A77D] focus:outline-none"
                                  >
                                    <option value="">(Sin color / Foto general)</option>
                                    {(newProd.colors || []).map((c) => (
                                      <option key={c.name} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Video secundario opcional si la portada es foto */}
                    {newProd.coverMediaType !== 'video' && (
                      <div className="pt-3 border-t border-[#EDE4DA]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-[#C6A77D]" />
                              <span>Video de Pasarela Opcional</span>
                            </span>
                            <p className="text-[11px] text-[#77716C]">
                              Muestra la caída y el movimiento de la prenda.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => newVideoInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF8F5] text-[#171717] border border-[#EDE4DA] text-xs font-semibold rounded-lg cursor-pointer transition-colors self-start sm:self-auto"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C6A77D]" />
                            <span>Subir video</span>
                          </button>
                          <input
                            ref={newVideoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (file) {
                                handleVideoFile(file, (url) =>
                                  setNewProd({ ...newProd, videoUrl: url })
                                );
                              }
                            }}
                            className="hidden"
                          />
                        </div>

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={newProd.videoUrl || ''}
                            onChange={(e) => setNewProd({ ...newProd, videoUrl: e.target.value })}
                            placeholder="O escribe URL de video secundario"
                            className="flex-1 px-3 py-1.5 bg-white border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Etiquetas / Badges */}
                  <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(newProd.isNew)}
                        onChange={(e) => setNewProd({ ...newProd, isNew: e.target.checked })}
                      />
                      <span>Etiqueta Nueva Colección</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(newProd.isExclusive)}
                        onChange={(e) => setNewProd({ ...newProd, isExclusive: e.target.checked })}
                      />
                      <span>Exclusivo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(newProd.isSale)}
                        onChange={(e) => setNewProd({ ...newProd, isSale: e.target.checked })}
                      />
                      <span>En Oferta</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE4DA]">
                  <button
                    type="submit"
                    disabled={isSaving || isOptimizing}
                    className="px-6 py-2.5 bg-[#171717] hover:bg-[#C6A77D] disabled:bg-stone-400 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#C6A77D]" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Guardando en la nube...' : 'Publicar Prenda en la Tienda'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 4: Store & WhatsApp Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                <div className="space-y-1 pb-3 border-b border-[#EDE4DA]">
                  <h3 className="font-serif text-base font-bold text-[#171717]">
                    Ajustes de la Tienda & WhatsApp de Pedidos
                  </h3>
                  <p className="text-xs text-[#77716C]">
                    Configura el número oficial de WhatsApp para pedidos directos y el enlace oficial de Instagram.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Nombre Oficial de la Marca</label>
                    <input
                      type="text"
                      value={tempSettings.brandName}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, brandName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Número de WhatsApp (con código de país 57)</label>
                    <input
                      type="text"
                      value={tempSettings.whatsappNumber}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })
                      }
                      placeholder="573125964567"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Texto Visible del WhatsApp</label>
                    <input
                      type="text"
                      value={tempSettings.whatsappDisplay}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, whatsappDisplay: e.target.value })
                      }
                      placeholder="+57 312 596 4567"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Enlace de Instagram Oficial</label>
                    <input
                      type="url"
                      value={tempSettings.instagramUrl}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, instagramUrl: e.target.value })
                      }
                      placeholder="https://www.instagram.com/cirlenihernandez"
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  {/* Logo Management */}
                  <div className="sm:col-span-2 p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-3">
                    <span className="font-semibold block text-[#171717]">
                      Logo Oficial de la Marca
                    </span>
                    <div className="flex items-center gap-4">
                      {tempSettings.logoUrl ? (
                        <img
                          src={tempSettings.logoUrl}
                          alt="Logo actual"
                          className="w-14 h-14 rounded-full object-cover border border-[#C6A77D]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#171717] text-[#C6A77D] flex items-center justify-center font-bold">
                          CH
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={tempSettings.logoUrl}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, logoUrl: e.target.value })
                          }
                          placeholder="URL del logo"
                          className="w-full px-3 py-1.5 border border-[#EDE4DA] rounded bg-white text-[11px] font-mono"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EDE4DA] hover:border-[#171717] rounded text-[11px] font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#C6A77D]" />
                          <span>Subir logo desde archivo local</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Barra de Anuncios Superior</label>
                    <input
                      type="text"
                      value={tempSettings.announcementText}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, announcementText: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDE4DA] rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#EDE4DA]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Ajustes de la Tienda</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
