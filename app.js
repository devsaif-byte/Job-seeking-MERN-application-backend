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
import cookieSession from "cookie-session";
const app = express();
dotenv.config({ path: "./configs/config.env" });

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL_PROD_MODE,
    process.env.FRONTEND_URL_DEV_MODE,
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  // using cookie session
  cookieSession({
    name: "session",
    keys: ["kay1", "key2"],
    domain: [
      process.env.FRONTEND_URL_DEV_MODE,
      process.env.FRONTEND_URL_PROD_MODE,
    ],
    sameSite: process.env.FRONTEND_URL_PROD_MODE ? "none" : "lax", // set to true because we'll be using https in production.
    httpOnly: true,
    secure: process.env.FRONTEND_URL_PROD_MODE ? true : false, // set to true because we'll be using https in production,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  })
);

app.use(
  // using json, urlencode, fileupload for cloudinary
  express.json(),
  express.urlencoded({ extended: true }),
  fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })
);
// using routes
app.use("/api/v1/job", cors(corsOptions), jobRouter);
app.use("/api/v1/user", cors(corsOptions), userRouter);
app.use("/api/v1/application", cors(corsOptions), applicationRouter);
// calling database function
dbConnection();
// using custom error middleware
app.use(errorMiddleware);
export default app;
