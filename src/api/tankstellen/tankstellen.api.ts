import type { ArcGISResponse, Tankstelle } from './tankstellen.types'

const API_URL =
  'https://geoportal.stadt-koeln.de/arcgis/rest/services/verkehr/gefahrgutstrecken/MapServer/0/query?where=objectid+is+not+null&outFields=*&outSR=4326&f=pjson'

export async function fetchTankstellen(): Promise<Tankstelle[]> {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status} ${response.statusText}`)
    }

    const data: ArcGISResponse = await response.json()

    return data.features.map((feature) => ({
      objectid: feature.attributes.objectid,
      adresse: feature.attributes.adresse,
      lng: feature.geometry.x,
      lat: feature.geometry.y,
    }))
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Fehler beim Laden der Tankstellen', { cause: error })
  }
}
