import { Router } from "express"
import { UserController } from "../controllers/user.js"

export const usersRouter = Router()

usersRouter.get("/", UserController.getAllUsers)

usersRouter.post("/", UserController.createUser)

usersRouter.get("/:id", UserController.getUserById)

usersRouter.put("/:id", UserController.updateUserById)

usersRouter.delete("/:id", UserController.deleteUserById)

usersRouter.post('/allowed', UserController.getUserPermission)