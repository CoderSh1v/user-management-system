import {app} from "./app.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()
const port = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)


app.listen(port)
