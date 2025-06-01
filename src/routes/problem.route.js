import { Router } from "express";
import { authenticaiton, checkAdmin } from "../middleware/authentication.js";
import { createProblem, deleteProblemId, getAllProblems, getAllProblemSolvedUser, getProblemsId, testingProblem, updateProblemId } from "../controllers/problem.controller.js";

const router = Router();

router.route("/create-problem").post(authenticaiton, checkAdmin, createProblem)
router.route("/testing-problem").post(authenticaiton, checkAdmin, testingProblem)

router.route("/get-all-problem").get(getAllProblems);

router.route("/get-problem-id/:id").get(getProblemsId);

router.route("/update-problem/:id").put(authenticaiton, checkAdmin, updateProblemId);

router.route("/delete-problem/:id").delete(authenticaiton, checkAdmin, deleteProblemId);

router.route("/get-solved-problems").get(authenticaiton, getAllProblemSolvedUser);

export default router