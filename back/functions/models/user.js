import { db } from "../firebase/config.js"

export const UserModel = {
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

	updateUserById: async ({ id, name, key, daily_hours, minutes = 0 }) => {
		const user = await db.collection("users").doc(id).get()
		if (user._fieldsProto === undefined) {
			const error = new Error("User not found")
			error.statusCode = 404
			throw error
		}
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
	},

	getUserPermission: async ({ uid, email }) => {
		const adminUsers = []
		const allowedUsers = []
		const querySnapshot = await db.collection("authorized-users").get()
		for (const doc of querySnapshot.docs) {
			adminUsers.push({
				uid: doc.data().uid,
				email: doc.data().email
			})
		}
		const admin = adminUsers.find(
			(user) => user.uid === uid && user.email === email
		) !== undefined
		const querySnapshot2 = await db.collection("users").get()
		for (const doc of querySnapshot2.docs) {
			allowedUsers.push({
				name: doc.data().name,
				email: doc.data().email
			})
		}
		const allowed = allowedUsers.find(
			(user) => user.email === email
		) !== undefined
		console.log("adminUsers", adminUsers)
		console.log("allowedUsers", allowedUsers)
		console.log("admin", admin)
		console.log("allowed", allowed)
		return admin
			? { admin: true, allowed: true }
			: allowed
				? { admin: false, allowed: true }
				: { admin: false, allowed: false }
	}
}
