import { Router } from "express"
import { getUser, getUsers, updateUser, deleteUser } from "../handlers/user"

const app = Router()

app.get("/user/:uuid", getUser)

app.get("/user", getUsers)

app.put("/user/:uuid", updateUser)

app.delete("/user/:uuid", deleteUser)

export default app