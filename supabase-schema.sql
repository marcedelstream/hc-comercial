-- HC COMERCIAL - Supabase Schema
-- Ejecutar en el SQL Editor de Supabase

-- ============================================================
-- EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORÍAS
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  price_original NUMERIC,
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  badge TEXT,
  active BOOLEAN DEFAULT true,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BANNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_url TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONFIGURACIÓN DEL SITIO
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB
);

INSERT INTO site_settings (key, value) VALUES
  ('ticker_text', '"ENVIOS A TODO PARAGUAY ★ EQUIPOS GASTRONÓMICOS ★ IMPORTACIONES DIRECTAS ★ ALTO RENDIMIENTO ★"'),
  ('black_banner_product_id', 'null'),
  ('best_seller_product_ids', '[]'),
  ('special_offer_product_id', 'null'),
  ('special_offer_ends_at', 'null')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT,
  city TEXT,
  department TEXT,
  delivery_cost NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública (storefront puede leer sin auth)
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (active = true);
CREATE POLICY "public_read_banners" ON banners FOR SELECT USING (active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);

-- Service role puede hacer todo (admin usa service role key)
CREATE POLICY "service_all_categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_banners" ON banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_settings" ON site_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
