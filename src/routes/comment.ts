import { Router } from "express"
import { createComment, getComment, getComments, updateComment, deleteComment } from "../handlers/comment"

const app = Router()

app.post("/comment/:uuid", createComment)

app.get("/comment/:uuid", getComment)

app.get("/comments:uuid", getComments)

app.put("/comment/:uuid", updateComment)

app.delete("/comment/:uuid", deleteComment)

export default app