import * as fetch from 'isomorphic-fetch'

export interface GithubUser {
	id: string,
  name: string,
  email: string,
  bio: string,
  public_repos: number,
  public_gists: number
}

export async function getGithubToken(githubCode: string): Promise<string> {
	const endpoint = 'https://github.com/login/oauth/access_token'

	const data = await fetch(endpoint, {
		method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
		},
		body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: githubCode,
    })
	}).then(res => res.json())

	if (data.error) {
    throw new Error(JSON.stringify(data.error))
	}
	
	// if (data.error) {
  //   throw new Error(process.env.GITHUB_CLIENT_SECRET)
  // }

	return data.access_token
}

export async function getGithubUser(githubToken: string): Promise<githubUser> {
  const endpoint = `https://api.github.com/user?access_token=${githubToken}`
  const data = await fetch(endpoint)
    .then(response => response.json())

  if (data.error) {
		// throw new Error(JSON.stringify(data.error))
		throw new Error('getUser error')
  }

  return data
}