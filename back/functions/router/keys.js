import { Router } from "express"
import { KeyController } from "../controllers/key.js"
import { tokenValidation } from "../middlewares/tokenValidation.js"

export const keyRouter = Router()

keyRouter.get("/last-readed", KeyController.getLastReaded)

keyRouter.get("/read/:key", tokenValidation, KeyController.readKey)
