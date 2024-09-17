import { Router } from "express"
import { KeyController } from "../controllers/key.js"

export const keyRouter = Router()


keyRouter.get("/last-readed", KeyController.getLastReaded)

keyRouter.get("/read/:key", KeyController.readKey)