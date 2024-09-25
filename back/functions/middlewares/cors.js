const ACCEPTED_ORIGINS = [
	"https://alquilocarpas-horas.web.app",
	"https://alquilocarpas-horas.firebaseapp.com",
	"http://localhost:5173",
	process.env.ORIGIN_ESP8266,
	process.env.ORIGIN_DEV,
]

export const corsMiddleware = (req, res, next) => {
	const origin = req.get("origin") || req.get("referer")
	if (origin && ACCEPTED_ORIGINS.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin)
		next()
	} else {
		res.status(403).json({ code: 403, message: "Forbidden" })
	}
}

export const corsPreflightMiddleware = (req, res) => {
	console.log("corsPreflightMiddleware", req.headers.origin)
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	res.header("Access-Control-Allow-Headers", "Content-Type")
	res.send()
}
