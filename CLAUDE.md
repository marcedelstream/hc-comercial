# HC COMERCIAL - Tienda Online

## Descripción del Proyecto
Adaptación del template CozyCommerce Lite para **HC COMERCIAL**, empresa paraguaya dedicada a la venta de equipos gastronómicos. La tienda es una demo funcional sin backend/base de datos activa (Supabase se conectará en etapa posterior).

## Cliente
- **Empresa:** HC COMERCIAL
- **Rubro:** Venta de equipos gastronómicos
- **WhatsApp:** +595982800258
- **País:** Paraguay
- **Moneda:** Guaraníes (₲)

## Paleta de Colores
- **Primario:** `#EEEC00` (amarillo intenso) → corresponde al color `blue` en Tailwind config
- **Oscuro/Secundario:** Negro / `#1C274C` (dark en Tailwind)
- Botones primarios: fondo amarillo `#EEEC00` + texto negro (no texto blanco)

## Stack Tecnológico
- **Framework:** Next.js con App Router
- **Estilos:** Tailwind CSS v4
- **Estado:** Redux Toolkit (carrito, wishlist)
- **ORM (futuro):** Prisma + Supabase (no conectado en demo)
- **Datos:** Estáticos desde `src/data/staticData.ts`

## Datos Estáticos (Demo)
Todos los productos, hero sliders, categorías y demás datos se cargan desde:
- `src/data/staticData.ts` — Fuente única de datos de la demo

Los archivos en `src/get-api-data/` retornan datos estáticos en lugar de consultas a DB, para que la demo funcione sin Supabase.

## Productos HC COMERCIAL
12 equipos gastronómicos ficticios con precios en Guaraníes. Ver `src/data/staticData.ts`.

## Pago (Checkout)
- Único método simulado: **Bancard** (simulación, no pago real)
- El formulario muestra campos de tarjeta y simula el procesamiento

## Cotizador de Flete
- En cada página de producto individual `/products/[slug]`
- El usuario selecciona el departamento de Paraguay destino
- Se muestra el costo estimado de traslado (datos ficticios)
- Costos en `src/data/staticData.ts` → `departamentosParaguay`

## Departamentos de Paraguay (Flete)
Los costos de traslado van desde Asunción/Central (₲30,000–₲50,000) hasta Boquerón/Alto Paraguay (₲160,000).

## Imágenes
No se usan imágenes ficticias. Se muestra un placeholder con texto **"Sin imagen"** en todos los espacios de imagen de productos.

## Idioma
Todo el contenido en **español paraguayo**.

## Próximos Pasos (Post-Demo)
1. Conectar Supabase como base de datos
2. Reemplazar datos estáticos con consultas Prisma reales
3. Integrar Bancard real para pagos
4. Subir imágenes reales de productos a Cloudinary
5. Configurar email transaccional (Nodemailer)

## Comandos
```bash
npm run dev      # Desarrollo local
npm run build    # Build producción
npm run start    # Servidor producción
```

## Notas de Implementación
- El color `blue` en Tailwind = `#EEEC00` (amarillo de marca)
- Los botones con `bg-blue` deben usar `text-dark` (negro), NO `text-white`
- El toploader de Next.js usa `#EEEC00`
- `formatPrice()` en `src/utils/formatePrice.ts` formatea en Guaraníes (₲)
