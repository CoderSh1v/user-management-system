import express from "express"
import { jwtAuth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getAllUsers,getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
const user = express.Router();


user.get("/", jwtAuth, authorizeRoles("admin"), getAllUsers)

user.get("/:id", jwtAuth, authorizeRoles("admin"), getUserById);

user.patch("/:id", jwtAuth, authorizeRoles("admin"), updateUser);

user.delete("/:id", jwtAuth, authorizeRoles("admin"), deleteUser);

export {user}