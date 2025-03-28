import { UserModel } from "../models/user.js"
import {
	validateId,
	validateNewUser,
	validatePermission,
	validateUser
} from "../schemas/validation.js"

export const UserController = {
	createUser: async (req, res, next) => {
		try {
			const body = validateNewUser(req.body)
			if (!body.success) {
				res.status(400).json({ error: body.error })
			}
			const { name, key, daily_hours, email } = body.data
			const createdOK = await UserModel.createUser({
				name,
				key,
				daily_hours,
				email
			})
			return res.json(createdOK)
		} catch (err) {
			next(err)
		}
	},

	updateUserById: async (req, res, next) => {
		try {
			const id = validateId(req.params.id)
			const body = validateUser(req.body)
			if (!id.success || !body.success) {
				res.status(400).json({ error: id.error || body.error })
			}
			const { name, email, key, daily_hours, minutes } = body.data
			const updatedOK = await UserModel.updateUserById({
				id: id.data,
				name,
				email,
				key,
				daily_hours,
				minutes
			})
			return res.json(updatedOK)
		} catch (err) {
			next(err)
		}
	},

	deleteUserById: async (req, res, next) => {
		try {
			const id = validateId(req.params.id)
			if (!id.success) {
				res.status(400).json({ error: id.error })
			}
			const deletedOK = await UserModel.deleteUserById({ id: id.data })
			return res.json(deletedOK)
		} catch (err) {
			next(err)
		}
	},

	getUserPermission: async (req, res, next) => {
		try {
			const body = validatePermission(req.body)
			const { uid, email } = body.data
			const allowed = await UserModel.getUserPermission({ uid, email })
			return res.json(allowed)
		} catch (err) {
			next(err)
		}
	}
}
