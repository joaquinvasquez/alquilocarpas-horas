import * as functions from "firebase-functions/v2"
import express from "express"
import { corsMiddleware, corsPreflightMiddleware } from "./middlewares/cors.js"
import { usersRouter } from "./router/users.js"
import { keyRouter } from "./router/keys.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { dailyCheck, dailySubstract } from "./scheduled/daily-check.js"

const app = express()

// PARA DESHABILITAR EL HEADER X-POWERED-BY
app.disable("x-powered-by")

// PARA PARSEAR EL BODY
app.use(express.json())

// PARA LOS CORS
app.use(corsMiddleware)

// PARA LOS CORS PREFLIGHT
app.options("*", corsPreflightMiddleware)

app.use("/users", usersRouter)
app.use("/key", keyRouter)

// PARA EL ERROR HANDLING
app.use(errorHandler)

export const api = functions.https.onRequest(app)

export const everyNight = functions.scheduler.onSchedule(
	"59 02 * * 2-6", // at 02:59 from Tuesday to Saturday (UTC), 23:59 from Monday to Friday (UTC -3)
	dailyCheck
)

export const everyMorning = functions.scheduler.onSchedule(
	"00 09 * * 1-5", // at 09:00 from Monday to Friday (UTC), 06:00 from Monday to Friday (UTC -3)
	dailySubstract
)
