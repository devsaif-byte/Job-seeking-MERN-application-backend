import { catchAsyncError } from "./async-error-middleware.js";
import ErrorHandler from "./error-middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";

/**
 * Middleware function to check if the user is authorized.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves once the authorization check is complete.
 */
export const isAuthorized = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token || "";
  try {
    if (!token) return next(new ErrorHandler("User not authorized", 401));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
  } catch (error) {
    return res.status(500).json(err.toString());
  }
});
