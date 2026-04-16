import express from "express"
import { login, register } from "../controllers/auth.controller.js";
import { jwtAuth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const auth = express.Router();

auth.use(jwtAuth)

auth.post("/login",login)

auth.post("/register",authorizeRoles(admin),register)

export {auth}