import { onInit } from "firebase-functions/v2/core"
import * as nodemailer from "nodemailer"

const nodeMailerUser = process.env.NODEMAILER_USER
const nodeMailerPass = process.env.NODEMAILER_PASS
const nodeMailerTarget = process.env.NODEMAILER_TARGET

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

export const sendMailHandler = ({ s, t }) => {
	const mailOptions = {
		from: nodeMailerUser,
		to: nodeMailerTarget,
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
