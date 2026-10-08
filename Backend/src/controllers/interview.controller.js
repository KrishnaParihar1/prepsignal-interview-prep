const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  const jobDescription = typeof req.body.jobDescription === "string" ? req.body.jobDescription.trim() : "";
  const selfDescription = typeof req.body.selfDescription === "string" ? req.body.selfDescription.trim() : "";

  if (jobDescription.length > 5000 || selfDescription.length > 3000) {
    return res.status(400).json({ message: "Job description (max 5000 chars) or self description (max 3000 chars) is too long" });
  }

  let resumeText = "";
  if (req.file) {
    const parser = new pdfParse.PDFParse({ data: Uint8Array.from(req.file.buffer) });
    try {
      resumeText = (await parser.getText()).text;
    } catch {
      return res.status(400).json({ message: "Could not read the uploaded PDF" });
    } finally {
      await parser.destroy();
    }
  }

  if (!jobDescription || (!resumeText.trim() && !selfDescription)) {
    return res.status(400).json({ message: "Job description and a resume or self description are required" });
  }
  const interViewReportByAi = await generateInterviewReport({
    resume: resumeText,
    selfDescription,
    jobDescription,
  });

  interViewReportByAi.matchScore = Math.min(100, Math.max(0, Math.round(Number(interViewReportByAi.matchScore) || 0)));

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription,
    jobDescription,
    ...interViewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  if (!mongoose.isValidObjectId(interviewId)) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  if (!mongoose.isValidObjectId(interviewReportId)) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
