const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const { rateLimit } = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  keyGenerator: (req) => req.user.id,
  message: { message: "Too many requests. Please try again in a few minutes." },
});

const globalAiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 60,
    keyGenerator: () => "global",
    skipFailedRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "The demo is very busy right now. Please try again in a bit." },
});
const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  globalAiLimiter,
  aiLimiter,
  upload.single("resume"),
  interviewController.generateInterViewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  globalAiLimiter,
  aiLimiter,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
