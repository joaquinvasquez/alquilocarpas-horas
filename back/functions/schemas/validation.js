import z from "zod"

export const validateKey = (key) => {
	return z
		.string()
		.regex(/[A-F0-9]{8}/)
		.safeParse(key)
}

export const validateId = (id) => {
	return z
		.string()
		.regex(/[a-zA-z0-9]{20}/)
		.safeParse(id)
}

const newUserSchema = z.object({
	name: z.string().min(1).max(20),
	key: z.string().regex(/[A-F0-9]{8}/),
	daily_hours: z.number().min(0).max(12)
})

export const validateNewUser = (user) => {
	return newUserSchema.safeParse(user)
}

const updateUserSchema = z.object({
	name: z.string().min(1).max(20),
	key: z.string().regex(/[A-F0-9]{8}/),
	daily_hours: z.number().min(0).max(12),
	minutes: z.number()
})

export const validateUser = (user) => {
	return updateUserSchema.partial().safeParse(user)
}
