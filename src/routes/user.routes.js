import { Router } from "express";
import {getUser, loginUser, registerUser, updateUser } from "../controllers/user.controller.js";


const router = Router();


router.route("/auth/signup").post(registerUser);

router.route("/auth/login").post(loginUser);

router.route("/update").post(updateUser);
router.route("/").post(getUser);


export default router;
