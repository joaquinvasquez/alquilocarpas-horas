import { Router } from "express"
import { KeyController } from "../controllers/key.js"

export const keyRouter = Router()

keyRouter.get("/read/:key", KeyController.readKey)
