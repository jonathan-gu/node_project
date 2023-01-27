import { Router } from "express"
import { body } from "express-validator"
import { getUser, getUsers, updateUser, deleteUser } from "../handlers/user"
import { verifyDataBodyCreateUser, verifyDataBodySignIn, verifyDataBodyUpdateUser } from "../modules/verificationUser"

const app = Router()

app.get("/user/:uuid", getUser)

app.get("/user", getUsers)

app.put("/user/:uuid", verifyDataBodyUpdateUser, updateUser)

app.delete("/user/:uuid", deleteUser)

export default app