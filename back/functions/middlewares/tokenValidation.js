import admin from "firebase-admin"

export const tokenValidationESP8266 = (req, res, next) => {
	const token = req.header("x-esp8266-token")
	if (!token) {
		return res.status(401).json({ code: 401, message: "Access Denied" })
	}
	if (token !== process.env.TOKEN_ESP8266) {
		return res.status(403).json({ code: 403, message: "Forbidden" })
	}
	next()
}

export const tokenValidation = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]

	if (!token) {
		return res.status(401).json({ code: 401, message: "No token provided" })
	}

	try {
		const decodedToken = await admin.auth().verifyIdToken(token)
		req.user = decodedToken
		next()
	} catch (error) {
		return res.status(401).json({ code: 401, message: "Invalid token" })
	}
}
