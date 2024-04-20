/**
 * Sends a JWT token as a cookie in the response.
 * @param {object} user - The user object.
 * @param {number} statusCode - The HTTP status code to be sent in the response.
 * @param {object} res - The Express response object.
 * @param {string} message - The message to be included in the response.
 * @returns {void}
 */
export const sendResponseToken = (user, statusCode, res, message) => {
  // Generate JWT token for the user
  const token = user.getJWTtoken();

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.FRONTEND_URL_PROD_MODE ? true : false, // set to true because we'll be using https in production
    sameSite: "none",
  };
  // Send response with token as a cookie
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
