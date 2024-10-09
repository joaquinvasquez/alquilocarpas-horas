import { Router } from "express"
import { KeyController } from "../controllers/key.js"
import { tokenValidation, tokenValidationESP8266 } from "../middlewares/tokenValidation.js"

export const keyRouter = Router()

keyRouter.get("/last-readed", tokenValidation, KeyController.getLastReaded)

keyRouter.get("/read/:key", tokenValidationESP8266, KeyController.readKey)
