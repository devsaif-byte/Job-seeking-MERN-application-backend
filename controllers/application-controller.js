import { catchAsyncError } from "../middlewares/async-error-middleware.js";
import ErrorHandler from "../middlewares/error-middleware.js";
import { Application } from "../models/application-model.js";
import { Job } from "../models/job-model.js";
import cloudinary from "cloudinary";

export const getAllApplicationsByEmployer = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler(
          "Job Seeker is not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    console.log(_id);
    const application = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      application,
    });
  }
);
export const getAllApplicationsByJobseeker = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    console.log(_id);
    const application = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      application,
    });
  }
);

export const deleteApplicationByJobseeker = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer is not allowed to access this resource!",
          400
        )
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application)
      return next(new ErrorHandler("Opps!, Application not found!", 404));
    application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application deleted successfully!",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer is not allowed to access this resource!", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume file required!", 400));
  }
  const { resume } = req.files;
  const anyOfTheseFormats = [
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf", // PDF format
    "application/msword", // Microsoft Word (.doc)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Microsoft Word (.docx)
  ];
  if (!anyOfTheseFormats.includes(resume.mimetype)) {
    // if the the format not include the mimetype of the file
    return next(
      new ErrorHandler(
        "Invalid file type. Please try upload another format.",
        400
      )
    );
  }
  const cloudResponse = await cloudinary.uploader.upload(resume.tempFilePath);
  // console.log(cloudResponse);

  if (!cloudResponse || cloudResponse.error) {
    console.log(
      "Cloudinary Error:",
      cloudResponse.error || "Unknown cloudinary Error."
    );
    return next(new ErrorHandler("Failed to upload resume", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) return next(new ErrorHandler("Job not found!", 404));
  const jobDetails = await Job.findById(jobId);
  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("All fields required!", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudResponse.public_id,
      url: cloudResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    application,
    message: "Application Submitted!",
  });
});
