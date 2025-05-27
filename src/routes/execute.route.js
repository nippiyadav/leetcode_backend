import { Router } from "express";
import { authenticaiton } from "../middleware/authentication.js";
import { executeCode } from "../controllers/execute.controller.js";

const router = Router();

router.route("/").post(authenticaiton,executeCode)

export default router