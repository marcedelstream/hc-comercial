CREATE TABLE categories (
  id              SERIAL PRIMARY KEY,
  ascont_gru_ide  INTEGER UNIQUE,           -- gruIde de AsCont
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  image_url       TEXT,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTOS (mapea productos de AsCont: prsIde → ascont_prs_ide)
-- ============================================================
CREATE TABLE products (
  id                  SERIAL PRIMARY KEY,
  ascont_prs_ide      INTEGER UNIQUE,       -- prsIde de AsCont
  ascont_barcode      TEXT,                 -- prsCodigoBarras
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  short_description   TEXT,
  category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  price               NUMERIC(15,2),        -- precio activo (sincronizado de AsCont)
  sale_price          NUMERIC(15,2),        -- precio oferta (override manual)
  stock               INTEGER DEFAULT 0,    -- unidades disponibles (sincronizado)
  images              JSONB DEFAULT '[]',   -- array de URLs de imágenes
  tags                TEXT[],
  iva_percentage      NUMERIC(5,2) DEFAULT 10.0,  -- prsPorcentajeIva
  has_iva             BOOLEAN DEFAULT true,
  unit_measure_id     INTEGER,              -- uniMedIde de AsCont
  active              BOOLEAN DEFAULT true,
  featured            BOOLEAN DEFAULT false,
  last_ascont_sync    TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LISTAS DE PRECIOS (de AsCont: lprIde)
-- ============================================================
CREATE TABLE ascont_price_lists (
  id              SERIAL PRIMARY KEY,
  lpr_ide         INTEGER UNIQUE NOT NULL,  -- lprIde de AsCont
  description     TEXT NOT NULL,            -- lprDescripcion
  is_default      BOOLEAN DEFAULT false,    -- lista activa para el storefront
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRECIOS POR LISTA (de AsCont: preIde)
-- ============================================================
CREATE TABLE ascont_prices (
  id              SERIAL PRIMARY KEY,
  pre_ide         INTEGER UNIQUE,           -- preIde de AsCont
  product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
  price_list_id   INTEGER REFERENCES ascont_price_lists(id) ON DELETE CASCADE,
  price_unit      NUMERIC(15,2),            -- preUnidad (precio por unidad)
  price_package   NUMERIC(15,2),            -- precio por empaque/caja
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STOCK SINCRONIZADO (snapshot de AsCont por fecha)
-- ============================================================
CREATE TABLE ascont_stock_snapshots (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
  ascont_prs_ide  INTEGER NOT NULL,
  units           NUMERIC(15,4),            -- unidades
  packages        NUMERIC(15,4),            -- empaques
  entries         NUMERIC(15,4),            -- entradas
  exits           NUMERIC(15,4),            -- salidas
  branch_name     TEXT,                     -- sucursal
  warehouse_name  TEXT,                     -- deposito
  sync_date       DATE NOT NULL,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BANNERS / HERO SLIDERS
-- ============================================================
CREATE TABLE banners (
  id          SERIAL PRIMARY KEY,
  title       TEXT,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  link_url    TEXT,
  type        TEXT DEFAULT 'slider',        -- 'slider' | 'banner'
  active      BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIOS
-- ============================================================
CREATE TABLE testimonials (
  id              SERIAL PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  avatar_url      TEXT,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONFIGURACIÓN DEL SITIO
-- ============================================================
CREATE TABLE site_settings (
  id          SERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  value       JSONB,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Valores iniciales de configuración
INSERT INTO site_settings (key, value) VALUES
  ('header_text',      '"Envíos a todo el Paraguay · WhatsApp: +595982800258"'),
  ('site_name',        '"HC Comercial"'),
  ('whatsapp',         '"+595982800258"'),
  ('ascont_emp_id',    '198'),
  ('ascont_lpr_id',    '6'),   -- ID de lista de precios por defecto (ajustar)
  ('sync_auto',        'false');

-- ============================================================
-- ÓRDENES
-- ============================================================
CREATE TABLE orders (
  id               SERIAL PRIMARY KEY,
  order_number     TEXT UNIQUE,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  shipping_dept    TEXT,
  shipping_address JSONB,
  subtotal         NUMERIC(15,2),
  shipping_cost    NUMERIC(15,2),
  total            NUMERIC(15,2),
  status           TEXT DEFAULT 'pending', -- pending|confirmed|shipped|delivered|cancelled
  payment_method   TEXT DEFAULT 'whatsapp',
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ITEMS DE ÓRDENES
-- ============================================================
CREATE TABLE order_items (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  quantity        INTEGER NOT NULL,
  unit_price      NUMERIC(15,2) NOT NULL,
  total           NUMERIC(15,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LOG DE SINCRONIZACIONES AsCont
-- ============================================================
CREATE TABLE sync_logs (
  id               SERIAL PRIMARY KEY,
  sync_type        TEXT NOT NULL,   -- 'stock' | 'prices' | 'products' | 'full'
  status           TEXT NOT NULL,   -- 'success' | 'error'
  records_updated  INTEGER DEFAULT 0,
  error_message    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_active      ON products(active);
CREATE INDEX idx_products_featured    ON products(featured);
CREATE INDEX idx_products_ascont_id   ON products(ascont_prs_ide);
CREATE INDEX idx_prices_product       ON ascont_prices(product_id);
CREATE INDEX idx_prices_list          ON ascont_prices(price_list_id);
CREATE INDEX idx_stock_product        ON ascont_stock_snapshots(product_id);
CREATE INDEX idx_stock_date           ON ascont_stock_snapshots(sync_date);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_number        ON orders(order_number);

-- ============================================================
-- RLS (Row Level Security) — habilitar para producción
-- ============================================================
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ascont_price_lists   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ascont_prices        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ascont_stock_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs            ENABLE ROW LEVEL SECURITY;

-- Lectura pública para storefront
CREATE POLICY "productos_publicos"   ON products   FOR SELECT USING (active = true);
CREATE POLICY "categorias_publicas"  ON categories FOR SELECT USING (active = true);
CREATE POLICY "banners_publicos"     ON banners    FOR SELECT USING (active = true);
CREATE POLICY "testimonios_publicos" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "settings_publicos"    ON site_settings FOR SELECT USING (true);

-- Acceso total para service role (admin)
CREATE POLICY "admin_products"       ON products    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_categories"     ON categories  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_orders"         ON orders      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_order_items"    ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_prices"         ON ascont_prices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_stock"          ON ascont_stock_snapshots FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_price_lists"    ON ascont_price_lists FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_sync_logs"      ON sync_logs   FOR ALL USING (auth.role() = 'service_role');