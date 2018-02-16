import { Context, User } from '../../utils'
import { getGithubToken, getGithubUser, GithubUser } from '../../github'
import { getFacebookUser, FacebookUser } from '../../facebook'
import * as jwt from 'jsonwebtoken'

async function getUserWithGithub(ctx: Context, githubUserId: string): Promise<User> {
  return await ctx.db.query.user({ where: { githubUserId } })
}

async function getUserWithFacebook(ctx: Context, facebookUserId: string): Promise<User>{
  return await ctx.db.query.user({ where: { facebookUserId } })
}

async function createUserWithGithub(ctx, githubUser: GithubUser): Promise<User> {
  const user = await ctx.db.mutation.createUser({
    data: {
      githubUserId: githubUser.id,
      name: githubUser.name,
      email: githubUser.email,
      bio: githubUser.bio || 'User has no bio',
      public_repos: githubUser.public_repos,
      public_gists: githubUser.public_gists,
      notes: [],
    },
  })
  return user
}

async function createUserWithFacebook(ctx, facebookUser: FacebookUser): Promise<User> {
  const user = await ctx.db.mutation.createUser({
    data: {
      facebookUserId: facebookUser.id,
      first_name: facebookUser.first_name,
      email: facebookUser.email,
      gender: facebookUser.gender || 'User has no bio',
      picture: facebookUser.picture.data.url,
      notes: [],
    },
  })
  return user
}

//-------- exposed prisma solver

export const auth = {
	gitAuthenticate: async (parent, { githubCode }, ctx: Context, info) => {
		const githubToken = await getGithubToken(githubCode)
		const githubUser = await getGithubUser(githubToken)
		let user = await getUserWithGithub(ctx, githubUser.id)
		if (!user) {
			user = await createUserWithGithub(ctx, githubUser)
		}
		return {
			token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
			user,
		}
  },
  facebookAuthenticate: async (parent, { facebookToken }, ctx: Context, info ) => {
    const facebookUser = await getFacebookUser(facebookToken)
    let user = await getUserWithFacebook(ctx, facebookUser.id)
    if (!user) {
      user = await createUserWithFacebook(ctx, facebookUser)
    }
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user
    }
  },
}