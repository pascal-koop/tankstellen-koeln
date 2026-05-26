// extract street
export function extractStreet(adresse: string): string {
  const match = adresse.match(/^(.+?)\s*\(/)
  return match ? match[1].trim() : adresse.trim()
}

// extract district
export function extractDistrict(adresse: string): string {
  const match = adresse.match(/\((\d{5}\s+.+?)\)/)
  return match ? match[1] : ''
}

// normalze street
export function normalizeStreet(value: string): string {
  return value
    .toLowerCase()
    .replace(/straße|strasse/g, 'str.')
    .trim()
}
