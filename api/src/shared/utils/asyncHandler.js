/**
 * Wraps an async function to catch errors and pass them to the global error handler.
 * @param {function} fn The async function to wrap.
 * @returns {function} An Express middleware function.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
