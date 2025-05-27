import { Router } from "express";
import { currentUser, loginController, logOut, registerController } from "../controllers/user.controller.js";
import { authenticaiton } from "../middleware/authentication.js";

const router = Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/currentUser").get(authenticaiton, currentUser);
router.route("/logout").get(authenticaiton, logOut);


export default router