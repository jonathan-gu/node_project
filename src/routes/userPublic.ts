import { Router } from "express"
import { createUser, signIn } from "../handlers/user"


const app = Router()

app.post("/signUp", createUser)

app.post("/signIn", signIn)

export default app