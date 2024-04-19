import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import jobRouter from "./routes/job-router.js";
import userRouter from "./routes/user-router.js";
import applicationRouter from "./routes/application-router.js";
import { dbConnection } from "./database/db-connection.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
const app = express();
dotenv.config({ path: "./configs/config.env" });

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL_DEV_MODE,
      process.env.FRONTEND_URL_PROD_MODE,
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/application", applicationRouter);
dbConnection();

app.use(errorMiddleware);
export default app;
