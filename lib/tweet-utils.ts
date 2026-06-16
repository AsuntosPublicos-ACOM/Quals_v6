import type { Tweet, TweetFilters, WordFrequency } from './types'

/**
 * Extrae palabras clave de un tweet
 */
export function extractKeywords(texto: string): string[] {
  const stopwords = new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber', 'por', 'con', 'su', 'para',
    'es', 'estar', 'o', 'este', 'si', 'he', 'has', 'ha', 'hemos', 'han', 'haya', 'haces', 'hace', 'hacemos',
    'hacen', 'hago', 'hagas', 'hagamos', 'hagan', 'haré', 'harás', 'hará', 'haremos', 'harán', 'haría',
    'the', 'and', 'is', 'it', 'to', 'in', 'at', 'on', 'are', 'from', 'as', 'or', 'be', 'was', 'were', 'been',
    'que', 'este', 'ese', 'aquello', 'etc', 'donde', 'como', 'cuando', 'cual', 'cuanto'
  ])

  const palabras = texto
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !stopwords.has(palabra))

  return [...new Set(palabras)]
}

/**
 * Genera frecuencias de palabras a partir de tweets
 */
export function generateWordFrequencies(tweets: Tweet[]): WordFrequency[] {
  const wordFrequency: Record<string, number> = {}

  for (const tweet of tweets) {
    const palabras = extractKeywords(tweet.texto)
    for (const palabra of palabras) {
      wordFrequency[palabra] = (wordFrequency[palabra] || 0) + 1
    }
  }

  // Calcular tamaños basados en frecuencia (normalizar entre 10 y 50)
  const frequencies = Object.entries(wordFrequency)
    .map(([word, frequency]) => ({ word, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 150) // Top 150 palabras

  const minFreq = Math.min(...frequencies.map(f => f.frequency))
  const maxFreq = Math.max(...frequencies.map(f => f.frequency))

  return frequencies.map(({ word, frequency }) => {
    const size = 10 + ((frequency - minFreq) / (maxFreq - minFreq)) * 40
    return { word, frequency, size }
  })
}

/**
 * Filtra tweets por rango de fechas
 */
export function filterTweetsByDate(
  tweets: Tweet[],
  fechaDesde?: string,
  fechaHasta?: string
): Tweet[] {
  return tweets.filter(tweet => {
    const tweetDate = new Date(tweet.fecha)
    if (fechaDesde && tweetDate < new Date(fechaDesde)) return false
    if (fechaHasta && tweetDate > new Date(fechaHasta)) return false
    return true
  })
}

/**
 * Filtra tweets por sector (basándose en los sectores del legislador)
 */
export function filterTweetsBySector(tweets: Tweet[], sectorIds: string[]): Tweet[] {
  if (sectorIds.length === 0) return tweets

  return tweets.filter(tweet => {
    // Los tweets se filtran si el legislador autor está vinculado a los sectores
    // Por ahora, retornamos todos si el array de sectores es vacío
    return true
  })
}

/**
 * Filtra tweets por partido político
 */
export function filterTweetsByParty(tweets: Tweet[], partidos: string[]): Tweet[] {
  if (partidos.length === 0) return tweets
  return tweets.filter(tweet => partidos.includes(tweet.autor.partido))
}

/**
 * Filtra tweets por legislador específico
 */
export function filterTweetsByLegislador(tweets: Tweet[], legisladorIds: string[]): Tweet[] {
  if (legisladorIds.length === 0) return tweets
  return tweets.filter(tweet => legisladorIds.includes(tweet.autor.id))
}

/**
 * Aplica todos los filtros a un array de tweets
 */
export function filterTweetsByFilters(tweets: Tweet[], filters: TweetFilters): Tweet[] {
  let filtered = tweets

  // Aplicar filtro de fechas
  if (filters.fechaDesde || filters.fechaHasta) {
    filtered = filterTweetsByDate(filtered, filters.fechaDesde, filters.fechaHasta)
  }

  // Aplicar filtro de sectores
  if (filters.sectores.length > 0) {
    filtered = filterTweetsBySector(filtered, filters.sectores)
  }

  // Aplicar filtro de partidos
  if (filters.partidos.length > 0) {
    filtered = filterTweetsByParty(filtered, filters.partidos)
  }

  // Aplicar filtro de legisladores
  if (filters.legisladores.length > 0) {
    filtered = filterTweetsByLegislador(filtered, filters.legisladores)
  }

  return filtered
}

/**
 * Obtiene palabras comunes de un grupo de tweets
 */
export function getCommonWords(tweets: Tweet[], limite: number = 50): WordFrequency[] {
  const wordFreq = generateWordFrequencies(tweets)
  return wordFreq.slice(0, limite)
}

/**
 * Formatea número para display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Formatea fecha para display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `Hace ${diffMins}m`
  }
  if (diffHours < 24) {
    return `Hace ${diffHours}h`
  }
  if (diffDays < 7) {
    return `Hace ${diffDays}d`
  }

  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Obtiene el inicial del nombre para avatar fallback
 */
export function getInitials(nombre: string): string {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
