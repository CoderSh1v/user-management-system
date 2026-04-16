import express from "express"
import cors from "cors"
import { auth } from "./routes/auth.route.js";
import { errorhandler } from "./middlewares/eroorHandler.js";
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth",auth)
app.use(errorhandler)

export {app} 