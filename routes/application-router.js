import express from "express";
import {
  getAllApplicationsByEmployer,
  getAllApplicationsByJobseeker,
  deleteApplicationByJobseeker,
  postApplication,
} from "../controllers/application-controller.js";
import { isAuthorized } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/job-seeker/getall", isAuthorized, getAllApplicationsByJobseeker);
router.get("/employer/getall", isAuthorized, getAllApplicationsByEmployer);
router.post("/post", isAuthorized, postApplication);
router.delete("/delete/:id", isAuthorized, deleteApplicationByJobseeker);

export default router;
