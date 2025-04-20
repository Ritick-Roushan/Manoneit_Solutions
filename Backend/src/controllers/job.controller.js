import Job from '../models/job.model.js';
import { asyncHandler } from '../utils/asynchandler.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin only)
const createJob = asyncHandler(async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   res.status(403);
  //   throw new Error('Only admins can create jobs');
  // }

  const { jobTitle, jobType, company, location, salary, skillsRequired, description } = req.body;

  const job = await Job.create({
    jobTitle,
    jobType,
    company,
    location,
    salary,
    skillsRequired,
    description,
  });

  res.status(201).json({ success: true, data: job });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find();
  res.status(200).json({ success: true, data: jobs });
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({ success: true, data: job });
});

// @desc    Close a job
// @route   PATCH /api/jobs/:id/close
// @access  Private (Admin only)
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
// @route   DELETE /api/jobs/:id
// @access  Private (Admin only)
const deleteJob = asyncHandler(async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   res.status(403);
  //   throw new Error('Only admins can delete jobs');
  // }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();
  res.status(200).json({ success: true, message: 'Job deleted successfully' });
});

export { createJob, getAllJobs, getJobById, closeJob, deleteJob };