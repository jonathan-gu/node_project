import { Router } from "express"
import { signUp, signIn } from "../handlers/user"

const app = Router()

app.post("/signUp", signUp)

app.post("/signIn", signIn)

export default app