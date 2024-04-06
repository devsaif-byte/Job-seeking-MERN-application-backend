import { catchAsyncError } from "../middlewares/async-error-middleware.js";
import ErrorHandler from "../middlewares/error-middleware.js";
import { User } from "../models/user-model.js";
import { sendResponseToken } from "../utils/jwt-token.js";

/**
 * Controller function to handle user registration.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves once the registration process is complete.
 */
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;
  // Check if all required fields are provided
  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("Please fill full registration form!"));
  }
  // Check if the email is already in use
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already exist!"));
  }
  // Create a new user
  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });
  // Send success response
  sendResponseToken(user, 200, res, "User registered successfully!");
});

/**
 * Controller function to handle user login.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {void}
 */
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return next(
      new ErrorHandler("Please provide email, password and role.", 400)
    );
  const user = await User.findOne({ email }).select("+password");
  //   console.log(user);
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid Email or Password", 400));
  if (user.role !== role)
    return next(
      new ErrorHandler(`User with this email and ${role} not found!`, 400)
    );
  sendResponseToken(user, 200, res, "User logged in successfully!");
});
/**
 * Controller function for handling user logout.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise representing the completion of the logout process.
 */
export const logout = catchAsyncError(async (req, res, next) => {
  // Clear the JWT token cookie
  // Send a response indicating successful logout
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged out successfully!",
    });
});

export const getUser = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
