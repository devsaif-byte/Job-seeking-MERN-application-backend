import { catchAsyncError } from "../middlewares/async-error-middleware.js";
import ErrorHandler from "../middlewares/error-middleware.js";
import { Job } from "../models/job-model.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  //   console.log(req);
  if (role === "Job Seeker")
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;
  // make some conditions
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  // create post with postedby user using id
  const postedBy = req.user._id;
  const post = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  // send to the client
  res.status(200).json({
    success: true,
    message: "Job posted successfully!",
    post,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Opps Job not found!.", 400));
  }
  const { id } = req.params;
  let post = await Job.findById(id);
  if (!post)
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  post = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    post,
    message: "Job updated successfully!",
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const post = await Job.findById(id);
  if (!post) return next(new ErrorHandler("Opps Job not found!.", 400));
  await post.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted successfully!",
  });
});
