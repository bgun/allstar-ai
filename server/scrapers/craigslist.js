import axios from 'axios'

export async function searchCraigslist(query, opts = {}) {
  const city = opts.city || 'denver'
  const lat = opts.lat || 39.6654
  const lon = opts.lon || -105.1062
  const search_distance = opts.search_distance || 1000

  const apiUrl = `https://sapi.craigslist.org/web/v8/postings/search/full`
  const params = {
    batch: '11-0-360-0-0',
    cc: 'US',
    lang: 'en',
    searchPath: 'pta',
    query,
    lat: String(lat),
    lon: String(lon),
    search_distance: String(search_distance),
  }

  const browseUrl = `https://${city}.craigslist.org/search/${city}-co/pta?query=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&search_distance=${search_distance}`

  const { data } = await axios.get(apiUrl, {
    params,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })

  const decode = data?.data?.decode || {}
  const items = data?.data?.items || []
  const minPostedDate = decode.minPostedDate || 0
  const minPostingId = decode.minPostingId || 0
  const locations = decode.locations || []
  const locDescriptions = decode.locationDescriptions || []

  const results = items.slice(0, 25).map((item) => {
    const postingId = minPostingId + item[0]
    const postedTs = minPostedDate + item[1]
    const title = item[item.length - 1]
    const priceNum = item[3]

    // Parse location: "areaIdx:neighIdx~lat~lon"
    const locStr = item[4] || ''
    const locParts = locStr.split('~')
    const areaParts = (locParts[0] || '').split(':')
    const areaIdx = parseInt(areaParts[0]) || 0
    const area = locations[areaIdx]
    const areaName = area?.[1] || city
    const subArea = area?.[2] || null

    // Neighborhood description from locationDescriptions (index in field[3] doesn't apply — use areaParts[1])
    const neighIdx = parseInt(areaParts[1]) || 0
    const neighborhoods = decode.neighborhoods || []
    const neighName = neighIdx > 0 && neighIdx < neighborhoods.length ? neighborhoods[neighIdx] : null

    // Build listing URL from tagged fields
    let linkSlug = null
    let imageUrl = null
    let priceStr = null

    for (const field of item) {
      if (!Array.isArray(field)) continue
      if (field[0] === 6 && field.length >= 2) {
        linkSlug = field[1]
      } else if (field[0] === 4 && field.length >= 2) {
        // First image
        const imgId = field[1]
        if (typeof imgId === 'string') {
          const cleanId = imgId.startsWith('3:') ? imgId.slice(2) : imgId
          imageUrl = `https://images.craigslist.org/${cleanId}_600x450.jpg`
        }
      } else if (field[0] === 10 && field.length >= 2) {
        priceStr = field[1]
      }
    }

    const urlBase = subArea
      ? `https://${areaName}.craigslist.org/${subArea}/pts/d`
      : `https://${areaName}.craigslist.org/pts/d`
    const link = linkSlug ? `${urlBase}/${linkSlug}/${postingId}.html` : null

    const locationText = neighName || locDescriptions[areaIdx] || areaName || null

    return {
      title,
      price: priceStr || (priceNum ? `$${priceNum}` : null),
      price_cents: priceNum ? priceNum * 100 : null,
      link,
      image: imageUrl,
      source: 'craigslist',
      external_id: String(postingId),
      condition: null,
      listing_date: new Date(postedTs * 1000).toISOString(),
      location: locationText,
      seller_name: null,
    }
  })

  return { items: results, url: browseUrl }
}
