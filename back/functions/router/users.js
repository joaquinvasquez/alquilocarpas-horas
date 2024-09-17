import { Router } from "express"
import { UserController } from "../controllers/user"

export const usersRouter = Router()

usersRouter.get("/", UserController.getAllUsers)

usersRouter.post("/new", UserController.createUser)

usersRouter.get("/:id", UserController.getUserById)

usersRouter.put("/update/:id", UserController.updateUserById)

usersRouter.put("/delete/:id", UserController.deleteUserById)
