import { Router } from "express";
import { getAllSubmission, getSubmissionById, getSubmissionCount, getSubmissionDelete } from "../controllers/submission.controller.js";
import { authenticaiton, checkAdmin } from "../middleware/authentication.js";

const router = Router();

router.route("/get-all-submissions").get(authenticaiton,getAllSubmission);
router.route("/get-submission/:problemId").get(authenticaiton,getSubmissionById);
router.route("/get-submission-count/:problemId").get(authenticaiton,getSubmissionCount);
router.route("/get-submission-delete/:problemId").get(authenticaiton,checkAdmin,getSubmissionDelete);

export default router