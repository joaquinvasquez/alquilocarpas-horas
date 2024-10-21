import { db } from "../firebase/config.js"
import { sendMailHandler } from "../utils/send-email.js"

export const KeyModel = {
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
			const sessionTime = Math.floor(
				(Date.now() - userData.last_reading.toDate().getTime()) / 60000
			)
			const newMinutes = userData.minutes + sessionTime
			await db
				.collection("users")
				.doc(user.docs[0].id)
				.update({
					is_active: false,
					minutes: newMinutes,
					last_reading: new Date(Date.now())
				})
			const mail = {
				s: `LectorID - ${userData.name} fichó al salir`,
				t: `El usuario [${userData.name}] fichó al salir. Se sumaron ${Math.floor(sessionTime / 60)}:${sessionTime % 60} horas, quedó un total de ${Math.floor(newMinutes / 60)}:${newMinutes % 60} horas trabajadas.`
			}
			sendMailHandler(mail)
			return { action: "bye" }
		}
		await db
			.collection("users")
			.doc(user.docs[0].id)
			.update({
				is_active: true,
				last_reading: new Date(Date.now())
			})
		const mail = {
			s: `LectorID - ${user.name} fichó al entrar`,
			t: `El usuario [${user.name}] fichó al entrar.`
		}
		sendMailHandler(mail)
		return { action: "hello" }
	}
}
