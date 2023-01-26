import express from "express"
import * as dotenv from "dotenv"
import userPublicRoutes from "./routes/userPublic"
import userProtectRoutes from "./routes/userProtect"
import postRoutes from "./routes/post"
import commentRoutes from "./routes/comment"
import { protect } from "./modules/auth"
import config from "./config"

dotenv.config()

const app = express()
const port = config.port

app.use(express.json())

app.use("/api", [
    userPublicRoutes
])

app.use("/api", protect, [
    userProtectRoutes,
    postRoutes,
    commentRoutes
])

app.listen(port, () => {
    console.log("Server is listening on " + port)
})