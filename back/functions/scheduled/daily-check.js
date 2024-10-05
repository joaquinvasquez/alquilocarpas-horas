import { onInit } from "firebase-functions/v2/core"
import * as nodemailer from "nodemailer"
import { db } from "../firebase/config.js"

const nodeMailerUser = process.env.NODEMAILER_USER
const nodeMailerPass = process.env.NODEMAILER_PASS

let transporter

onInit(() => {
	transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: nodeMailerUser,
			pass: nodeMailerPass
		}
	})
})

const sendMailHandler = ({ s, t }) => {
	const mailOptions = {
		from: nodeMailerUser,
		to: nodeMailerUser,
		subject: s,
		text: t
	}
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error)
		} else {
			console.log(`Email sent: ${info.response}`)
		}
	})
}

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
					t: `El usuario [${user.name}] quedó activado hoy, se olvidó de fichar al salir. Hay que restar manualmente el tiempo que pasó desde que se fue hasta las 00:00.`
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
			await db
				.collection("users")
				.doc(user.id)
				.update({
					minutes: user.minutes - user.daily_hours * 60
				})
		} catch (err) {
			console.log(err)
		}
	}
}
