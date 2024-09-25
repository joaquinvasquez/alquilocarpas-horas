export const tokenValidation = (req, res, next) => {
	const token = req.header("x-esp8266-token")
	if (!token) {
		return res.status(401).json({ code: 401, message: "Access Denied" })
	}
	if (token !== process.env.TOKEN_ESP8266) {
		return res.status(403).json({ code: 403, message: "Forbidden" })
	}
	next()
}
