import { Router } from "express"
import { UserController } from "../controllers/user.js"

export const usersRouter = Router()

usersRouter.post("/", UserController.createUser)

usersRouter.put("/:id", UserController.updateUserById)

usersRouter.delete("/:id", UserController.deleteUserById)

usersRouter.post('/allowed', UserController.getUserPermission)