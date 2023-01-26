import { Router } from "express"
import { createComment, getComment, getComments, updateComment, deleteComment } from "../handlers/comment"

const app = Router()

app.post("/comment", createComment)

app.get("/comment/:uuid", getComment)

app.get("/comment", getComments)

app.put("/comment/:uuid", updateComment)

app.delete("/comment/:uuid", deleteComment)

export default app