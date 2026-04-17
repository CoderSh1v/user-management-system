import express from "express"
import { jwtAuth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getAllUsers,getUserById, updateUser, deleteUser, getOwnProfile, updateProfile} from "../controllers/user.controller.js";
const user = express.Router();

user.get("/me", jwtAuth, getOwnProfile);

user.patch("/me", jwtAuth, updateProfile);

user.get("/", jwtAuth, authorizeRoles("admin","manager"), getAllUsers)

user.get("/:id", jwtAuth, authorizeRoles("admin","manager"), getUserById);

user.patch("/:id", jwtAuth, authorizeRoles("admin","manager"), updateUser);

user.delete("/:id", jwtAuth, authorizeRoles("admin","manager"), deleteUser);

export {user}