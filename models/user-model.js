import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must be contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: { type: Number, required: [true, "Please enter your Phone Number!"] },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
/**
 * Middleware function to encrypt the password when the user registers or modifies their password.
 * @param {function} next - The callback function to move to the next middleware function or the save operation itself.
 * @returns {void}
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  else this.password = await bcrypt.hash(this.password, 10);
});
/**
 * Compares the user password entered by the user with the saved password.
 * @param {string} enteredPassword - The password entered by the user for comparison.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the passwords match, otherwise false.
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
/**
 * Generates a JWT token when a user registers or logs in.
 * @returns {string} - The generated JWT token.
 */
userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
