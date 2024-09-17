import { db } from "../firebase/config"

export const KeyFirebaseModel = {
	getLastReaded: async () => {
		const lastReaded = await db
			.collection("last-readed")
			.doc("last-readed")
			.get()

		return lastReaded.data()
	},

	setLastReaded: async ({ key }) => {
		await db.collection("last-readed").doc("last-readed").set({
			last_read: key
		})
		return
	},

	updateUserTimeByKey: async ({ key }) => {
		const user = await db.collection("users").where("key", "==", key).get()
		if (user.empty) {
			const error = new Error("User not found")
			error.statusCode = 404
			throw error
		}
		const userData = user.docs[0].data()
		if (userData.is_active) {
			await db
				.collection("users")
				.doc(user.docs[0].id)
				.update({
					is_active: false,
					minutes:
						userData.minutes +
						Math.floor(
							(Date.now() - userData.last_reading.toDate().getTime()) / 60000
						),
					last_reading: new Date(Date.now())
				})
			return { action: "bye" }
		}
		await db
			.collection("users")
			.doc(user.docs[0].id)
			.update({
				is_active: true,
				last_reading: new Date(Date.now())
			})
		return { action: "hello" }
	}
}
