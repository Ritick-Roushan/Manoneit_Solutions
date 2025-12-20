import Job from '../models/job.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asynchandler.js';

// @desc    Create a new job
// @route   POST /api/v1/jobs/createJob
// @access  Private (Client or Admin)
const createJob = asyncHandler(async (req, res) => {
  const { jobTitle, jobType, company, location, salary, skillsRequired, description } = req.body;
  const createdBy = req.user?._id;

  if (!jobTitle || !company || !location || !skillsRequired || !description || !createdBy) {
    throw new ApiError(400, 'Job title, company, location, skills, description, and creator are required');
  }

  if (!['company', 'admin'].includes(req.user?.role)) {
    throw new ApiError(403, 'Only clients or admins can create jobs');
  }

  const job = await Job.create({
    jobTitle,
    jobType: jobType || 'full-time',
    company,
    location,
    salary: salary?.trim() || null,
    skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map((s) => s.trim()),
    description,
    status: req.user.role === 'admin' ? 'active' : 'pending', // Admins create active jobs, clients create pending
    createdBy,
  });

  return res.status(201).json({
    success: true,
    data: job,
    message: req.user.role === 'client' ? 'Job created and pending admin approval' : 'Job created successfully',
  });
});

const getAllJobs = asyncHandler(async (req, res) => {
  const query = req.user?.role === 'admin' ? {} : { status: 'active' };
  const jobs = await Job.find(query).populate('createdBy', 'name');
  return res.status(200).json({
    success: true,
    data: jobs,
  });
});


// @desc    Get pending (active only for admin)
// @route   GET /api/v1/jobs/getAllJobs
// @access  admin


const getPendingJobs = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Only admins can access pending jobs');
  }

  // Fetch only pending jobs for admin
  const jobs = await Job.find({ status: 'pending' }).populate('createdBy', 'name');
  return res.status(200).json({
    success: true,
    data: jobs,
  });
});

// @desc    Get single job by ID
// @route   GET /api/v1/jobs/getJobById/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('createdBy', 'name');

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return res.status(200).json({
    success: true,
    data: job,
  });
});

// @desc    Close a job
// @route   PATCH /api/v1/jobs/closeJob/:id
// @access  Private (Admin only)
const getClosedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: 'closed' })
    .populate('createdBy', 'name')
    .sort({ updatedAt: -1 })
    .limit(10);
  return res.status(200).json({
    success: true,
    data: jobs,
  });
});


const closeJob = asyncHandler(async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   res.status(403);
  //   throw new Error('Only admins can close jobs');
  // }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { status: 'closed' },
    { new: true }
  );

  res.status(200).json({ success: true, data: updatedJob });
});

// @desc    Delete a job
// @route   DELETE /api/v1/jobs/deleteJob/:id
// @access  Private (Admin only)
const deleteJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Only admins can delete jobs');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  await Job.deleteOne({ _id: req.params.id });
  return res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

// @desc    Get jobs created by the user
// @route   GET /api/v1/jobs/my-jobs
// @access  Private (Client or Admin)
const getMyJobs = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;
  if (!createdBy) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (!['client', 'admin'].includes(req.user?.role)) {
    throw new ApiError(403, 'Only clients or admins can view their jobs');
  }

  const jobs = await Job.find({ createdBy }).populate('createdBy', 'name');
  return res.status(200).json({
    success: true,
    data: jobs,
  });
});

// @desc    Approve a pending job
// @route   PATCH /api/v1/jobs/approve/:jobId
// @access  Private (Admin only)
const approveJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Only admins can approve jobs');
  }

  const { jobId } = req.params;
  const job = await Job.findByIdAndUpdate(
    jobId,
    { status: 'active', updatedAt: Date.now() },
    { new: true }
  );

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return res.status(200).json({
    success: true,
    data: job,
    message: 'Job approved successfully',
  });
});

export { createJob, getAllJobs, getJobById, getClosedJobs, deleteJob, getMyJobs, approveJob , closeJob, getPendingJobs};