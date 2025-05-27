import { Router } from "express";
import { getAllSubmission, getSubmissionById, getSubmissionCount } from "../controllers/submission.controller.js";
import { authenticaiton } from "../middleware/authentication.js";

const router = Router();

router.route("/get-all-submissions").get(authenticaiton,getAllSubmission);
router.route("/get-submission/:problemId").get(authenticaiton,getSubmissionById);
router.route("/get-submission-count/:problemId").get(authenticaiton,getSubmissionCount);

export default router