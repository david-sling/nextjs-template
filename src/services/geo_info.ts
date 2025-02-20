import { Geo } from '@vercel/edge'
import { createFetcher } from './api'

export const fetchGeoInfo = createFetcher<GeoInfo>({
  url: 'https://ipapi.co/json/',
})

export const fetchGeoLocation: () => Promise<Geo> = async () => {
  try {
    const response = await fetch('/api/edge-geo')
    const data = await response.json() // Since the response is in text/html format
    return data
    // Process the response data as needed, e.g., update state to display the city
  } catch (error) {
    console.error('Failed to fetch geolocation:', error)
  }
}

//example response of the above for reference
// {
//   "city": "Kuala%20Lumpur",
//   "country": "MY",
//   "countryRegion": "14",
//   "flag": "🇲🇾",
//   "latitude": "3.1412",
//   "longitude": "101.685",
//   "region": "sin1"
// }

export interface GeoInfo {
  ip: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: string
  country_code: string
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
}
