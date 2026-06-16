import type { Tweet, Congresista } from './types'

/**
 * Servicio para interactuar con Twitter API v2
 * Nota: Esta es una implementación base que requiere configuración de credenciales
 * en variables de entorno: TWITTER_BEARER_TOKEN
 */

const TWITTER_API_BASE_URL = 'https://api.twitter.com/2'
const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN || ''

interface TwitterApiResponse {
  data?: Array<{
    id: string
    text: string
    created_at: string
    public_metrics: {
      like_count: number
      retweet_count: number
      reply_count: number
    }
  }>
  errors?: Array<{ message: string }>
}

/**
 * Busca tweets de un legislador específico
 * @param legislador Objeto Congresista con información del legislador
 * @param horasAtras Número de horas hacia atrás para buscar tweets (default: 7 días)
 * @returns Array de tweets del legislador
 */
export async function fetchCongresistaTweets(
  legislador: Congresista,
  horasAtras: number = 168 // 7 días por defecto
): Promise<Tweet[]> {
  try {
    // Para esta implementación, retornamos tweets simulados
    // En producción, se usaría la API real de Twitter/X
    return generateMockTweets(legislador, horasAtras)
  } catch (error) {
    console.error(`Error fetching tweets for ${legislador.nombre}:`, error)
    return []
  }
}

/**
 * Obtiene tweets de múltiples legisladores
 * @param legisladores Array de Congresista
 * @returns Array de todos los tweets de los legisladores
 */
export async function fetchMultipleCongresistaTweets(
  legisladores: Congresista[]
): Promise<Tweet[]> {
  const allTweets: Tweet[] = []

  for (const legislador of legisladores) {
    const tweets = await fetchCongresistaTweets(legislador)
    allTweets.push(...tweets)
  }

  return allTweets.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}

/**
 * Genera tweets mock para demostración
 * Esto será reemplazado por llamadas reales a Twitter API
 */
function generateMockTweets(legislador: Congresista, horasAtras: number): Tweet[] {
  const mockTweets = [
    {
      texto: 'Presentamos nuevo proyecto de ley para fortalecer el sistema educativo. La educación es la base del desarrollo nacional.',
      dias: 1
    },
    {
      texto: 'Reunión con sectores empresariales para discutir políticas de empleo y generación de oportunidades laborales.',
      dias: 2
    },
    {
      texto: 'Importante avance en la comisión: aprobado dictamen de reforma tributaria. Seguimos trabajando por un sistema justo.',
      dias: 3
    },
    {
      texto: 'Invertir en salud es invertir en el futuro. Congratulamos la ampliación de presupuesto para centros de salud.',
      dias: 5
    },
    {
      texto: 'Acabo de terminar serie de talleres en provincia. La participación de los ciudadanos es fundamental para el cambio.',
      dias: 7
    }
  ]

  return mockTweets.map((tweet, index) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - tweet.dias)

    return {
      id: `${legislador.id}-tweet-${index}`,
      texto: tweet.texto,
      fecha: fecha.toISOString(),
      autor: legislador,
      likes: Math.floor(Math.random() * 500) + 50,
      retweets: Math.floor(Math.random() * 200) + 10,
      respuestas: Math.floor(Math.random() * 100) + 5,
      url: `https://x.com/${legislador.nombre.toLowerCase().replace(' ', '_')}/status/${Date.now() + index}`,
      palabrasClave: extractKeywordsFromText(tweet.texto)
    }
  })
}

/**
 * Extrae palabras clave básicas del texto
 */
function extractKeywordsFromText(text: string): string[] {
  const stopwords = new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber', 'por', 'con', 'su', 'para',
    'es', 'estar', 'o', 'este', 'si', 'he', 'has', 'ha', 'hemos', 'han', 'haya', 'haces', 'hace', 'hacemos',
    'hacen', 'hago', 'hagas', 'hagamos', 'hagan', 'haré', 'harás', 'hará', 'haremos', 'harán', 'haría',
    'the', 'and', 'is', 'it', 'to', 'in', 'at', 'on', 'are', 'from', 'as', 'or', 'be', 'was', 'were', 'been',
    'que', 'este', 'ese', 'aquello', 'etc', 'donde', 'como', 'cuando', 'cual', 'cuanto'
  ])

  const palabras = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !stopwords.has(palabra))

  return [...new Set(palabras)] // Remover duplicados
}

/**
 * Procesa tweets para extraer frecuencias de palabras
 * Útil para generar la nube de palabras
 */
export function processTweetsForWordCloud(tweets: Tweet[]): { word: string; frequency: number }[] {
  const wordFrequency: Record<string, number> = {}

  for (const tweet of tweets) {
    const palabras = extractKeywordsFromText(tweet.texto)
    for (const palabra of palabras) {
      wordFrequency[palabra] = (wordFrequency[palabra] || 0) + 1
    }
  }

  return Object.entries(wordFrequency)
    .map(([word, frequency]) => ({ word, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 100) // Top 100 palabras
}
