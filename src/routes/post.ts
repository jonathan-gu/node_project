import { Router } from "express"
import { createPost, getPost, getPosts, updatePost, deletePost } from "../handlers/post"

const app = Router()

app.post("/post", createPost)

app.get("/post/:uuid", getPost)

app.get("/post", getPosts)

app.put("/post/:uuid", updatePost)

app.delete("/post/:uuid", deletePost)

export default app