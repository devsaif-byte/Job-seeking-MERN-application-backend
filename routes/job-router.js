import express from "express";
import { isAuthorized } from "../middlewares/auth-middleware.js";
import {
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
} from "../controllers/job-controller.js";
const router = express.Router();

router.get("/all-jobs", getAllJobs);
router.post("/post", isAuthorized, postJob);
router.get("/my-jobs", isAuthorized, getMyJobs);
router.put("/update/:id", isAuthorized, updateJob);
router.delete("/delete/:id", isAuthorized, deleteJob);
router.get("/:id", isAuthorized, getSingleJob);

export default router;
