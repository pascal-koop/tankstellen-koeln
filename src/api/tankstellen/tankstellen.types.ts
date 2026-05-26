export interface Tankstelle {
  objectid: number
  adresse: string
  lat: number
  lng: number
}

export interface ArcGISFeature {
  attributes: {
    objectid: number
    adresse: string
  }
  geometry: {
    x: number
    y: number
  }
}

export interface ArcGISResponse {
  features: ArcGISFeature[]
}
