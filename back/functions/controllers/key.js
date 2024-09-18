import { KeyModel } from "../models/key.js"
import { validateKey } from "../schemas/validation.js"

export const KeyController = {
	getLastReaded: async (req, res, next) => {
		try {
			const last = await KeyModel.getLastReaded()
			return res.json(last)
		} catch (err) {
			next(err)
		}
	},

	readKey: async (req, res, next) => {
		try {
			const key = validateKey(req.params.key)
			if (!key.success) {
				res.status(400).json({ error: key.error })
			}
			await KeyModel.setLastReaded({ key: key.data })
			const action = await KeyModel.updateUserTimeByKey({
				key: key.data
			})
			res.json(action)
		} catch (err) {
			next(err)
		}
	}
}
