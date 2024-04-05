import express from "express";
import { login, logout, register } from "../controllers/user-controller.js";
import { isAuthorized } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthorized, logout);

export default router;
