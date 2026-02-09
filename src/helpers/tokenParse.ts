export default function (url: string) {
  const cleanUrl = url.startsWith('#') ? url.substring(1) : url

  const params = new URLSearchParams(cleanUrl)

  const result = {
    access_token: params.get('access_token'),
    expires_at: params.get('expires_at'),
    expires_in: params.get('expires_in'),
    refresh_token: params.get('refresh_token'),
    token_type: params.get('token_type'),
    type: params.get('type'),
  }

  return result
}
