import { Router } from "express";
import { googleUser,googleUserLogin,loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();


router.route("/auth/signup").post(registerUser);

router.route("/auth/login").post(loginUser);
router.route("/auth/google").get(googleUser);
router.route("/auth/google/callback").get(googleUserLogin);

export default router;
