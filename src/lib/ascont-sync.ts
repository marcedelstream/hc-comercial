import { supabaseAdmin } from './supabase-admin'

interface PriceItem {
  preUnidad: number
  prsIde: {
    prsIde: number
    prsDescripcion: string
    prsCodigoBarras: string
    prsIsImpuestoIva: boolean
    prsPorcentajeIva: number
    gruIde: {
      gruIde: number
      gruDescripcion: string
    }
  }
}

interface StockItem {
  prsIde: number
  unidades: number
}

function generateSlug(name: string, id: number): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) + `-${id}`
  )
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function todayStr(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '')
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function ascontUrl(baseUrl: string, pathname: string, params: Record<string, string>): string {
  const url = new URL(pathname, `${normalizeBaseUrl(baseUrl)}/`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

function getFetchErrorMessage(error: unknown, url: string): string {
  if (!(error instanceof Error)) return String(error)

  const cause = error.cause as
    | { code?: string; errno?: string | number; syscall?: string; hostname?: string; address?: string; port?: number }
    | undefined

  const details = [
    error.message,
    cause?.code && `code=${cause.code}`,
    cause?.syscall && `syscall=${cause.syscall}`,
    cause?.hostname && `host=${cause.hostname}`,
    cause?.address && `address=${cause.address}`,
    cause?.port && `port=${cause.port}`,
  ].filter(Boolean)

  let hint = ''
  if (cause?.code === 'ENOTFOUND') {
    hint = ' Verifica que ASCONT_BASE_URL este bien escrito y que el dominio del tunnel exista.'
  } else if (cause?.code === 'ECONNREFUSED' || cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    hint = ' Verifica que el Cloudflare Tunnel/servidor de AsCont este activo y accesible.'
  } else if (cause?.code?.includes('CERT') || cause?.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
    hint = ' Verifica el certificado SSL del endpoint configurado.'
  }

  return `${details.join(' - ')}. URL: ${url}.${hint}`
}

async function fetchAscontJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const preview = body ? ` - ${body.slice(0, 300)}` : ''
    throw new Error(`HTTP ${res.status}${preview}`)
  }

  return res.json() as Promise<T>
}

export async function fullSync(): Promise<{
  ok: boolean
  categories: number
  products: number
  error?: string
}> {
  const baseUrl = process.env.ASCONT_BASE_URL
  const empId   = process.env.ASCONT_EMP_ID ?? '198'
  const lprId   = process.env.ASCONT_LPR_ID ?? '6'

  if (!baseUrl) return { ok: false, categories: 0, products: 0, error: 'ASCONT_BASE_URL no configurado' }

  // ── 1. Fetch precios (fuente primaria — filtra productos sin precio configurado) ──
  let priceItems: PriceItem[]
  try {
    const url = ascontUrl(baseUrl, '/movil/precioapi/precios/', { empId, lprId })
    priceItems = await fetchAscontJson<PriceItem[]>(url)
  } catch (e) {
    const url = ascontUrl(baseUrl, '/movil/precioapi/precios/', { empId, lprId })
    const msg = getFetchErrorMessage(e, url)
    return { ok: false, categories: 0, products: 0, error: `Error fetching precios: ${msg}` }
  }

  if (!Array.isArray(priceItems)) {
    return { ok: false, categories: 0, products: 0, error: `Precios: se esperaba array, recibió: ${JSON.stringify(priceItems).slice(0, 300)}` }
  }
  if (priceItems.length === 0) {
    return { ok: false, categories: 0, products: 0, error: `Precios: array vacío para empId=${empId} lprId=${lprId}` }
  }

  // ── 2. Fetch stock (fuente secundaria — suma por depósito) ────
  const stockMap = new Map<number, number>()
  try {
    const url = ascontUrl(baseUrl, '/movil/stockapi/stockgeneral/', { empId, fechaHasta: todayStr() })
    const stockItems = await fetchAscontJson<StockItem[]>(url)
    if (Array.isArray(stockItems)) {
      for (const item of stockItems) {
        stockMap.set(item.prsIde, (stockMap.get(item.prsIde) ?? 0) + item.unidades)
      }
    }
  } catch {
    // stock no disponible → quedan en 0, no es error fatal
  }

  // ── 3. Upsert categorías (de gruDescripcion) ──────────────────
  const now = new Date().toISOString()
  const gruposSeen = new Set<string>()
  const categoryRows: { name: string; slug: string; active: boolean; updated_at: string }[] = []

  for (const item of priceItems) {
    const gruDesc = item.prsIde?.gruIde?.gruDescripcion?.trim()
    if (gruDesc && !gruposSeen.has(gruDesc)) {
      gruposSeen.add(gruDesc)
      categoryRows.push({ name: gruDesc, slug: toSlug(gruDesc), active: true, updated_at: now })
    }
  }

  // ignoreDuplicates: true → solo inserta categorías nuevas, nunca pisa imagen/nombre customizado por admin
  const { error: catErr } = await supabaseAdmin
    .from('categories')
    .upsert(categoryRows, { onConflict: 'slug', ignoreDuplicates: true })

  if (catErr) return { ok: false, categories: 0, products: 0, error: `Error categorías: ${catErr.message}` }

  const { data: cats } = await supabaseAdmin
    .from('categories')
    .select('id, slug')
    .in('slug', categoryRows.map((c) => c.slug))

  const catBySlug = new Map(cats?.map((c) => [c.slug, c.id]) ?? [])

  // ── 4. Upsert productos (solo campos de AsCont, no toca active/featured/sale_price/images) ──
  const productRows = priceItems.map((item) => {
    const prsIde     = item.prsIde?.prsIde
    const name       = item.prsIde?.prsDescripcion?.trim() ?? ''
    const barcode    = item.prsIde?.prsCodigoBarras?.trim() || null
    const price      = item.preUnidad ?? 0
    const hasIva     = !!item.prsIde?.prsIsImpuestoIva
    const ivaPercent = item.prsIde?.prsPorcentajeIva ?? 0
    const gruDesc    = item.prsIde?.gruIde?.gruDescripcion?.trim() ?? ''
    const catSlug    = toSlug(gruDesc)
    const stock      = Math.max(0, Math.round(stockMap.get(prsIde) ?? 0))

    return {
      ascont_prs_ide:  prsIde,
      name,
      ascont_barcode:  barcode,
      price,
      has_iva:         hasIva,
      iva_percentage:  ivaPercent,
      stock,
      slug:            generateSlug(name, prsIde),
      category_id:     catBySlug.get(catSlug) ?? null,
      updated_at:      now,
    }
  })

  const { error: prodErr } = await supabaseAdmin
    .from('products')
    .upsert(productRows, { onConflict: 'ascont_prs_ide', ignoreDuplicates: false })

  if (prodErr) return { ok: false, categories: 0, products: 0, error: `Error productos: ${prodErr.message}` }

  // ── 5. Eliminar productos que ya no están en la lista de precios ──
  const syncedIds = productRows.map((r) => r.ascont_prs_ide).filter(Boolean)
  if (syncedIds.length > 0) {
    await supabaseAdmin
      .from('products')
      .delete()
      .not('ascont_prs_ide', 'is', null)
      .not('ascont_prs_ide', 'in', `(${syncedIds.join(',')})`)
  }

  // ── 6. Log ────────────────────────────────────────────────────
  await supabaseAdmin.from('sync_logs').insert({
    sync_type:       'full',
    status:          'success',
    records_updated: productRows.length,
    created_at:      now,
  })

  return { ok: true, categories: categoryRows.length, products: productRows.length }
}
