import express from "express"
import * as dotenv from "dotenv"
import userRoutes from "./routes/user"
import { protect } from "./modules/auth"
import config from "./config"

dotenv.config()

const app = express()
const port = config.port

app.use(express.json())

app.use("/", [
    userRoutes
])

app.use("/", protect, [

])

app.listen(port, () => {
    console.log("Server is listening on " + port)
})