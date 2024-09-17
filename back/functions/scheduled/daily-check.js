import * as functions from "firebase-functions/v2"
import * as nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "joaquinvasquez20@gmail.com",
		pass: "clqk hpnz gayd owbm"
	}
})

export const dailyCheck = functions.scheduler.onSchedule(
	"59 02 * * 1-5", // at 23:59 from Monday to Friday (UTC)
	async (event) => {
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
				if (user.is_active) {
					await db.collection("users").doc(user.id).update({
						is_active: false
					})
					const mailOptions = {
						from: "joaquinvasquez20@gmail.com",
						to: "joaquinvasquez20@gmail.com",
						subject: `LectorID - ${user.name} se fue sin fichar`,
						text: `El usuario [${user.name}] quedó activado hoy, se olvidó de fichar al salir. Hay que restar manualmente el tiempo que pasó desde que se fue hasta las 00:00.`
					}
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							console.log(error)
						} else {
							console.log(`Email sent: ${info.response}`)
						}
					})
				} else {
					if (
						Math.floor((Date.now() - user.last_reading.getTime()) / 60000) >
						1440
					) {
						await db
							.collection("users")
							.doc(user.id)
							.update({
								minutes: user.minutes - user.weekly_hours * 60
							})
						const mailOptions = {
							from: "joaquinvasquez20@gmail.com",
							to: "joaquinvasquez20@gmail.com",
							subject: `LectorID - ${user.name} hoy no trabajó`,
							text: `El usuario [${user.name}] hoy no fichó. Ya se le descontaron las horas de hoy (${user.weekly_hours}), en caso de que sea un error, hay que sumar manualmente el tiempo que trabajó hoy + lo que se descontó automáticamente (${user.weekly_hours}).`
						}
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.log(error)
							} else {
								console.log(`Email sent: ${info.response}`)
							}
						})
					}
				}
			} catch (err) {
				console.log(err)
			}
		}
	}
)