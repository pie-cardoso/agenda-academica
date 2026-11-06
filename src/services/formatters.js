export function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

/** Remove acentos e caixa para buscas. */
export function normalize(text = '') {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export function normalizeUrl(raw) {
  const value = raw.trim()
  if (!value) return ''
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

export function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

export function isValidUrl(url) {
  try { return Boolean(new URL(url).hostname.includes('.')) } catch { return false }
}

export function isVideoUrl(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}

export function extOf(filename = '') {
  const i = filename.lastIndexOf('.')
  return i > -1 ? filename.slice(i + 1).toLowerCase() : 'arquivo'
}
