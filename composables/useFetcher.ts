export const useFetcher = (url: string) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.dbBaseUrl as string
  const headerAuth = config.public.apiHeaderKey as string
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${headerAuth}`
    }
  }
  return async () => await fetch(`${baseUrl}${url}`, options)
    .then(response => response.json())
}
