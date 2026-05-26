import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchTankstellen } from './tankstellen.api'

const ARC_GIS_RESPONSE = {
  features: [
    {
      attributes: { objectid: 1, adresse: 'Bonner Str. 98 (50677 Neustadt/Süd)' },
      geometry: { x: 6.96, y: 50.916 },
    },
    {
      attributes: { objectid: 2, adresse: 'Aachener Str. 12 (50674 Lindenthal)' },
      geometry: { x: 6.92, y: 50.935 },
    },
  ],
}

describe('fetchTankstellen', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps ArcGIS features to Tankstelle objects', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(ARC_GIS_RESPONSE),
    } as Response)

    const result = await fetchTankstellen()

    expect(result).toEqual([
      { objectid: 1, adresse: 'Bonner Str. 98 (50677 Neustadt/Süd)', lat: 50.916, lng: 6.96 },
      { objectid: 2, adresse: 'Aachener Str. 12 (50674 Lindenthal)', lat: 50.935, lng: 6.92 },
    ])
  })

  it('throws on non-ok HTTP responses', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)

    await expect(fetchTankstellen()).rejects.toThrow('API-Fehler: 500 Internal Server Error')
  })

  it('re-throws network errors', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network down'))

    await expect(fetchTankstellen()).rejects.toThrow('Network down')
  })
})
