import { db } from "../firebase/config.js"
import { sendMailHandler } from "../utils/send-email.js"

export const dailyCheck = async () => {
	const users = []
	const querySnapshot = await db.collection("users").get()
	for (const doc of querySnapshot.docs) {
		users.push({
			id: doc.id,
			...doc.data(),
			initial_date: doc.data().initial_date.toDate(),
			last_reading: doc.data().last_reading.toDate()
		})
	}
	for (const user of users) {
		try {
			if (user.enabled === false) continue
			if (user.is_active) {
				await db.collection("users").doc(user.id).update({
					is_active: false
				})
				const mail = {
					s: `LectorID - ${user.name} se fue sin fichar`,
					t: `El usuario [${user.name}] quedó activado hoy, se olvidó de fichar al salir. Hay que restar manualmente el tiempo que pasó desde que se fue hasta las 21:00.`
				}
				sendMailHandler(mail)
			} else if (
				Math.floor((Date.now() - user.last_reading.getTime()) / 60000) > 1440
			) {
				const mail = {
					s: `LectorID - ${user.name} hoy no trabajó`,
					t: `El usuario [${user.name}] hoy no fichó. En caso de que sea un error, hay que sumarle manualmente sus ${user.daily_hours} horas o el tiempo que haya trabajado hoy.`
				}
				sendMailHandler(mail)
			}
		} catch (err) {
			console.log(err)
		}
	}
}

export const dailySubstract = async () => {
	const users = []
	const querySnapshot = await db.collection("users").get()
	for (const doc of querySnapshot.docs) {
		users.push({
			id: doc.id,
			...doc.data(),
			initial_date: doc.data().initial_date.toDate(),
			last_reading: doc.data().last_reading.toDate()
		})
	}
	for (const user of users) {
		try {
			if (user.enabled === false) continue
			const newMinutes = user.minutes - user.daily_hours * 60
			await db.collection("users").doc(user.id).update({
				minutes: newMinutes
			})
			const mail = {
				s: `LectorID - ${user.name} resta de horas diarias`,
				t: `Al usuario [${user.name}] se le restaron ${user.daily_hours} horas. Ahora tiene ${Math.floor(newMinutes / 60)}:${Math.abs(newMinutes % 60)} horas.`
			}
			sendMailHandler(mail)
		} catch (err) {
			console.log(err)
		}
	}
}
