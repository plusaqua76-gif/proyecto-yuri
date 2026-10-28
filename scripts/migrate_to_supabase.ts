import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../src/data/initialProducts';

const SUPABASE_URL = 'https://cborwkzzoynfimbyxczy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3J3a3p6b3luZmltYnl4Y3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTQ2MzgsImV4cCI6MjEwODc3MDYzOH0.zHHgzPw1d2o8nF3zsX2LrHaenI9sofdmJEQ_8xvdYs0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
  console.log('🚀 INICIANDO MIGRACIÓN AUTOMÁTICA A SUPABASE...');

  // 1. Migrar Configuración de la Tienda (store_settings)
  console.log('📦 Migrando configuración de la boutique...');
  const { data: settingsData, error: settingsErr } = await supabase
    .from('store_settings')
    .upsert(
      {
        id: 'main',
        brand_name: INITIAL_STORE_SETTINGS.brandName,
        whatsapp_number: INITIAL_STORE_SETTINGS.whatsappNumber,
        whatsapp_display: INITIAL_STORE_SETTINGS.whatsappDisplay,
        instagram_url: INITIAL_STORE_SETTINGS.instagramUrl,
        logo_url: INITIAL_STORE_SETTINGS.logoUrl,
        announcement_text: INITIAL_STORE_SETTINGS.announcementText,
        shipping_notice: INITIAL_STORE_SETTINGS.shippingNotice,
        free_shipping_threshold: INITIAL_STORE_SETTINGS.freeShippingThreshold,
        admin_passcode: INITIAL_STORE_SETTINGS.adminPasscode,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (settingsErr) {
    console.error('❌ Error migrando configuración:', settingsErr.message);
  } else {
    console.log('✅ Configuración migrada con éxito');
  }

  // 2. Migrar Productos (products)
  console.log(`📦 Migrando ${INITIAL_PRODUCTS.length} productos del catálogo...`);

  let migratedCount = 0;
  for (const prod of INITIAL_PRODUCTS) {
    const payload = {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      category: prod.category || 'enterizos',
      price: prod.price || 0,
      original_price: prod.originalPrice || null,
      description: prod.description || '',
      short_description: prod.shortDescription || '',
      is_new: Boolean(prod.isNew),
      is_exclusive: Boolean(prod.isExclusive),
      is_sale: Boolean(prod.isSale),
      is_bestseller: Boolean(prod.isBestseller),
      images: prod.images || [],
      colors: prod.colors || [],
      sizes: prod.sizes || ['S', 'M', 'L'],
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

    const { error: prodErr } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (prodErr) {
      console.error(`❌ Error migrando producto "${prod.name}":`, prodErr.message);
    } else {
      migratedCount++;
    }
  }

  console.log(`🎉 MIGRACIÓN COMPLETADA: ${migratedCount} de ${INITIAL_PRODUCTS.length} productos insertados/actualizados en Supabase.`);
}

runMigration();
