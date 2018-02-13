import { Context, getUserId, AuthError } from '../../utils'

export const note = async (_, { id }, ctx: Context, info) => {
    const userId = getUserId(ctx)

    return await ctx.db.mutation.createNote({ data: {
			owner: { connect: {id: userId} },
			text,
		}})
}