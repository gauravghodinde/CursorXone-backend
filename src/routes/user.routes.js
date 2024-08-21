import { Router } from "express";
import {loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();


router.route("/auth/signup").post(registerUser);

router.route("/auth/login").post(loginUser);


export default router;
