# HC Comercial — Handoff para próxima sesión

**Repo:** https://github.com/marcedelstream/hc-comercial  
**Deploy:** Vercel (auto-deploy en push a `main`)  
**Último commit estable:** `388eca8`  

---

## Estado actual del proyecto

### Lo que funciona
- Sitio público aprobado por el cliente: `/` `/shop` `/products/[slug]` `/contacto` `/ofertas` `/carrito` `/checkout`
- Panel admin accesible en `/admin` (login) → `/admin/dashboard`
- Build de Vercel sin errores (sitemap OK, proxy OK)
- Supabase configurado con credenciales en `.env.local`

### Lo que NO funciona aún
- **Las tablas de Supabase no están creadas** → todos los endpoints del admin responden 500
- **Auth tiene problemas** (ver sección abajo)
- **El storefront sigue usando datos estáticos** (`src/data/staticData.ts`) — los productos reales de Supabase no se muestran todavía

---

## Tarea 1 — Hacer funcionar la base de datos (PRIORITARIO)

### Problema
Las tablas `products`, `categories`, `banners`, `testimonials`, `site_settings`, `orders`, `order_items` **no existen en Supabase todavía**. Hay que ejecutar el schema.

### Pasos
1. Ir a [supabase.com](https://supabase.com) → proyecto `errpomonhkqtakidtblp`
2. Abrir **SQL Editor**
3. Copiar y ejecutar el contenido de `supabase-schema.sql` (está en la raíz del repo)
4. Verificar en **Table Editor** que aparecen las 7 tablas
5. Probar que `/admin/productos` ya no da 500

### Variables de entorno en Vercel
Confirmar que estas 3 están cargadas en Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=errpomonhkqtakidtblp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Tarea 2 — Pulir el Auth

### Problemas conocidos
- El `src/proxy.ts` protege las rutas `/admin/*` pero no se ha probado en producción (Vercel) que la redirección funcione correctamente con cookies SSR
- Si el usuario cierra el navegador y vuelve, puede que necesite hacer login de nuevo aunque la sesión de Supabase siga activa (depende de si las cookies persisten)
- El login page en `/admin` hereda los estilos del layout del storefront (`src/app/layout.tsx`) — se ve raro con la navbar del sitio encima

### Qué hay que hacer
1. **Separar el layout del admin del storefront**: el `src/app/(admin)/layout.tsx` es un pass-through (`<>{children}</>`) pero hereda `src/app/layout.tsx` (que tiene navbar, footer, etc.). Hay que crear un layout raíz para admin que NO incluya navbar/footer.
2. **Verificar persistencia de sesión** en producción después de ejecutar el schema
3. **Crear el usuario admin en Supabase Auth**: ir a Supabase → Authentication → Users → Add user (email + password)

---

## Tarea 3 — Logo y diseño del panel admin

### Problema
- La sidebar del admin muestra solo texto "HC ADMIN"
- El logo original está en `public/hc-comercial-logo.png`
- El cliente quiere que sea la versión en **blanco** (como aparece en la página principal)

### Qué hay que hacer
1. Revisar si el logo PNG tiene versión blanca o si hay un SVG
2. Editar `src/components/admin/sidebar.tsx` línea donde dice `HC ADMIN` para usar el logo
3. Si el logo es oscuro, crear versión CSS con `filter: brightness(0) invert(1)` para hacerlo blanco

### Archivo a editar
`src/components/admin/sidebar.tsx` — en el `<div className="px-6 py-6 border-b...">` reemplazar el texto por `<img>`

---

## Tarea 4 — Eliminar mocks y conectar el storefront a Supabase

### Situación actual
El storefront (la tienda pública) usa **datos 100% estáticos** en `src/data/staticData.ts`. Los cambios que el admin guarda en Supabase no se reflejan en la tienda.

### Archivos de datos estáticos
- `src/data/staticData.ts` — productos, categorías, banners (hardcoded)
- `src/get-api-data/product.ts` — devuelve datos de staticData
- `src/get-api-data/category.ts` — devuelve datos de staticData
- `src/get-api-data/hero.ts` — devuelve banners de staticData

### Plan de migración (hacer en orden)
1. **Crear funciones Supabase** en un nuevo `src/lib/storefront-data.ts`:
   - `getProducts()` → `supabase.from("products").select("*").eq("active", true)`
   - `getCategories()` → `supabase.from("categories").select("*").eq("active", true)`
   - `getBanners()` → `supabase.from("banners").select("*").eq("active", true).order("order_index")`
   - `getProductBySlug()` → filtra por slug
2. **Actualizar** `src/get-api-data/product.ts`, `category.ts`, `hero.ts` para llamar a las funciones de Supabase
3. **Cargar los productos reales** en Supabase via el admin panel
4. **Eliminar** `src/data/staticData.ts` una vez que todo esté en la DB

### Importante
No tocar la estructura visual de los componentes del storefront. Solo cambiar la fuente de datos.

---

## Tarea 5 — Conexión con API de Stock

### Contexto
El cliente tiene un software de stock externo. La idea es que los cambios de stock en ese sistema se reflejen automáticamente en la tienda.

### Variables de entorno ya definidas (sin valor aún)
```
STOCK_API_URL=        # URL del endpoint del software de stock
STOCK_API_KEY=        # Clave de autenticación
SYNC_SECRET_KEY=      # Secreto para validar webhooks entrantes
```

### Arquitectura propuesta
**Opción A — Webhook (el stock nos avisa):**
- El software de stock hace POST a `https://tudominio.com/api/webhook/stock`
- Nuestro endpoint valida el `SYNC_SECRET_KEY` y actualiza `products.stock` en Supabase

**Opción B — Pull periódico (nosotros consultamos el stock):**
- Cron job (Vercel Cron o externo) llama a `STOCK_API_URL` cada X minutos
- Sincroniza precios y stock en Supabase

### Qué necesitamos del cliente antes de implementar
- [ ] URL y documentación de la API del software de stock
- [ ] Formato de los datos (JSON/XML, campos disponibles)
- [ ] ¿Tiene webhook o solo polling?
- [ ] Credenciales de prueba

---

## Archivos clave del proyecto

| Archivo | Qué hace |
|---|---|
| `src/proxy.ts` | Auth middleware (protege /admin/*) |
| `src/lib/supabase-admin.ts` | Helpers Supabase: browser client, server client, service role |
| `src/app/(admin)/admin/page.tsx` | Login page `/admin` |
| `src/app/(admin)/admin/(protected)/layout.tsx` | Layout con sidebar, verifica sesión |
| `src/components/admin/sidebar.tsx` | Sidebar del panel admin |
| `src/data/staticData.ts` | Datos mock del storefront (a eliminar) |
| `supabase-schema.sql` | Schema completo de Supabase (ejecutar en SQL Editor) |
| `next-sitemap.config.js` | Config del sitemap (URL del sitio a actualizar cuando salga a prod) |
| `.env.local` | Variables de entorno locales (NO se sube a GitHub) |

---

## Orden sugerido para la próxima sesión

1. Ejecutar `supabase-schema.sql` en Supabase
2. Crear usuario admin en Supabase Auth
3. Verificar login y CRUD básico en el admin
4. Separar layout admin del layout del storefront (navbar/footer)
5. Poner logo blanco en la sidebar
6. Migrar storefront de datos estáticos a Supabase
7. Cuando haya datos reales, eliminar staticData.ts
8. Implementar sync de stock (cuando el cliente provea la API)
