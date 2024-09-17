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
