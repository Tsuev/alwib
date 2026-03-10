export type IpAsnInfo = {
  id: string
  name: string
  hosting: boolean
}

export type IpCheckResult = {
  ip: string
  city: string
  lat: string
  lon: string
  country: string
  code: string
  emoji: string
  timezone: string
  asn: IpAsnInfo
}
