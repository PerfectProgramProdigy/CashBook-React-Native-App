import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, resizeBy, next) => {
  try {
    const { success } = await ratelimit.limit("myRateLimit");

    if (!success) {
      return resizeBy.status(429).json({
        message: "Please try again later",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
