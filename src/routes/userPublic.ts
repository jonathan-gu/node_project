import { Router } from "express"
import { createUser, signIn } from "../handlers/user"
import { verifyDataBodyCreateUser, verifyDataBodySignIn } from "../modules/verificationUser"

const app = Router()

app.post("/signUp", verifyDataBodyCreateUser, createUser)

app.post("/signIn", verifyDataBodySignIn, signIn)

export default app