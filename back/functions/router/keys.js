import { Router } from "express"
import { KeyController } from "../controllers/key.js"
import { tokenValidationESP8266 } from "../middlewares/tokenValidation.js"

export const keyRouter = Router()

keyRouter.get("/read/:key", tokenValidationESP8266, KeyController.readKey)
