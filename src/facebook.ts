import fetch from 'node-fetch'

interface User {
  id: string
}

export interface FacebookUser {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  gender: string | null
  picture: any | null
}

interface EventData {
  facebookToken: string
}

export async function getFacebookUser(facebookToken: string): Promise<FacebookUser> {
  const endpoint = `https://graph.facebook.com/v2.11/me?fields=id%2Cemail%2Cfirst_name%2Clast_name%2Cgender%2Cpicture&access_token=${facebookToken}`
  const data = await fetch(endpoint)
    .then(response => response.json())

  if (data.error) {
    throw new Error(JSON.stringify(data.error))
  }

  return data
}