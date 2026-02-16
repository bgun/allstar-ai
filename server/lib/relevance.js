import axios from 'axios'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

export async function filterByRelevance(results, query) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('Relevance filter: ANTHROPIC_API_KEY not set, skipping')
    return { results, filtered: null }
  }

  if (results.length === 0) {
    return { results, filtered: null }
  }

  const numberedTitles = results.map((r, i) => `${i}: ${r.title}`).join('\n')

  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: MODEL,
        max_tokens: 256,
        system: `You are a parts listing filter. The user searched for: "${query}"

Your job: return ONLY the indices of listings that actually match the searched part type.

Rules:
- Keep listings that are the correct part type for the search query
- Remove listings for completely different part types (e.g. if searching for headlights, remove steering wheels, blower motors, catalytic converters, bumpers, fenders, grilles, etc.)
- When in doubt, keep the listing
- Respond with ONLY a JSON array of indices to keep, e.g. [0, 2, 5, 8]
- No explanation, no markdown, just the JSON array`,
        messages: [{ role: 'user', content: numberedTitles }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 10000,
      }
    )

    const text = response.data?.content?.[0]?.text?.trim()
    if (!text) throw new Error('Empty LLM response')

    const indices = JSON.parse(text)
    if (!Array.isArray(indices)) throw new Error('Response is not an array')

    const filtered = indices
      .filter((i) => Number.isInteger(i) && i >= 0 && i < results.length)
      .map((i) => results[i])

    console.log(`Relevance filter: ${filtered.length}/${results.length} items kept`)
    return {
      results: filtered,
      filtered: { original: results.length, kept: filtered.length },
    }
  } catch (err) {
    console.error('Relevance filter failed, returning unfiltered:', err.message)
    return { results, filtered: null }
  }
}
