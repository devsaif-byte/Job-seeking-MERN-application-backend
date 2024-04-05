/**
 * Utility function to catch asynchronous errors in route handlers.
 * @param {Function} payLoadFunction - The route handler function to be executed.
 * @returns {Function} - A middleware function that catches errors and passes them to the Express error handler.
 */
export const catchAsyncError = (payLoadFunction) => {
  return (req, res, next) => {
    Promise.resolve(payLoadFunction(req, res, next)).catch(next);
  };
};
