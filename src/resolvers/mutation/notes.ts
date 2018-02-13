import { Context, getUserId, AuthError } from '../../utils'

export const notes = {
	async createNote(_, ctx, args, info) {
		const userId = getUserId(ctx)
		return ctx.db.mutation.createNote({data: {
			owner: { connect: { id: userId } },

		}})
	},
	async updateNote(_, ctx, {id, text}, info) {
		const userId = getUserId(ctx)
		const hasPermission = await ctx.db.exists.Note({
			id,
			owner: {id: userId},
		})
		if (!hasPermission) {
			throw new AuthError()
		}
		return await ctx.db.mutation.updateNote({
			where: { id },
			data: { text },
		})
	},
	async deleteNote(_, ctx, { id }, info) {
		const userId = getUserId(ctx)
		const hasPermission = await ctx.db.exists.Note({
			id,
			owner: {id: userId},
		})
		if (!hasPermission) {
			throw new AuthError()
		}
		return await ctx.db.mutation.deleteNote({
			where: { id },
		})
	},
	
}