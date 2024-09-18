import { db } from "../firebase/config.js"

export const UserModel = {
	getAllUsers: async () => {
		const users = []
		const querySnapshot = await db.collection("users").get()
		for (const doc of querySnapshot.docs) {
			doc.data().enabled &&
				users.push({
					id: doc.id,
					...doc.data(),
					initial_date: doc.data().initial_date.toDate(),
					last_reading: doc.data().last_reading.toDate()
				})
		}
		return users
	},

	createUser: async ({ name, key, daily_hours }) => {
		await db
			.collection("users")
			.doc()
			.create({
				name: name,
				key: key,
				initial_date: new Date(Date.now()),
				is_active: false,
				minutes: 0,
				daily_hours: daily_hours,
				last_reading: new Date(Date.now()),
				enabled: true
			})
		return { action: "created" }
	},

	getUserById: async ({ id }) => {
		const user = await db.collection("users").doc(id).get()
		if (user._fieldsProto === undefined) {
			const error = new Error("User not found")
			error.statusCode = 404
			throw error
		}
		return {
			id: user.id,
			...user.data(),
			initial_date: user.data().initial_date.toDate(),
			last_reading: user.data().last_reading.toDate()
		}
	},

	updateUserById: async ({ id, name, key, daily_hours, minutes = 0 }) => {
		const user = await db.collection("users").doc(id).get()
		if (user._fieldsProto === undefined) {
			const error = new Error("User not found")
			error.statusCode = 404
			throw error
		}
		console.log(user.data().minutes, minutes)
		await db
			.collection("users")
			.doc(id)
			.update({
				name: name || user.data().name,
				key: key || user.data().key,
				daily_hours: daily_hours || user.data().daily_hours,
				minutes: user.data().minutes + minutes
			})
		return { action: "updated" }
	},

	deleteUserById: async ({ id }) => {
		await db.collection("users").doc(id).update({ enabled: false })
		return { action: "deleted" }
	}
}
