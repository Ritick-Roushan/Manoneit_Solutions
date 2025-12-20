import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { Application } from '../models/application.model.js';
import Job  from '../models/job.model.js';

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    logger: true,
  });

// @desc    Submit a job application with resume
// @route   POST /api/v1/users/submit-resume
// @access  Private (Candidate)
const submitResume = asyncHandler(async (req, res) => {
  console.log('Starting submitResume...');
  const { name, email, phone, experience, currentSalary, expectedSalary, currentCompany, jobId } = req.body || {};
  const resume = req.files?.resume?.[0];
  const userId = req.user?._id;

  // Validation
  console.log('Validating input...');
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'Form data missing or empty');
  }
  if (!req.files || !resume) {
    throw new ApiError(400, 'No resume file uploaded');
  }
  if (!name) {
    throw new ApiError(400, 'Full name is required');
  }
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new ApiError(400, 'Valid email address is required');
  }
  if (!jobId) {
    throw new ApiError(400, 'Job ID is required');
  }
  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }
  if (req.user?.role !== 'candidate') {
    throw new ApiError(403, 'Only candidates can submit applications');
  }

  // Verify job exists and is active
  const job = await Job.findById(jobId);
  if (!job || job.status !== 'active') {
    throw new ApiError(400, 'Job not found or not active');
  }

  // Check for duplicate application
  const existingApplication = await Application.findOne({ userId, jobId });
  if (existingApplication) {
    throw new ApiError(400, 'You have already applied for this job');
  }

  // Verify nodemailer configuration
  console.log('Checking nodemailer config...');
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail credentials');
    throw new ApiError(500, 'Email service misconfigured');
  }

  // Verify file exists
  console.log('Verifying file access...');
  const filePath = path.resolve(resume.path);
  try {
    await fs.access(filePath, fs.constants.R_OK);
    console.log('File accessible:', filePath);
  } catch (accessError) {
    console.error('File access error:', accessError.message);
    throw new ApiError(500, 'Uploaded file not found or inaccessible', [accessError.message]);
  }

  // Save resume to public folder
  // const publicDir = path.join('public', 'resumes');
  // await fs.mkdir(publicDir, { recursive: true });
  // const resumeFilename = `${Date.now()}-${resume.originalname}`;
  // const newFilePath = path.join(publicDir, resumeFilename);
  // try {
  //   await fs.copyFile(filePath, newFilePath);
  //   console.log('Resume copied to:', newFilePath);
  // } catch (copyError) {
  //   console.error('File copy error:', copyError.message);
  //   throw new ApiError(500, 'Failed to save resume', [copyError.message]);
  // }

  // Create application
  const application = await Application.create({
    userId,
    jobId,
    resume: `/uploads/${path.basename(resume.path)}`,
    name,
    email,
    phone,
    experience,
    currentSalary,
    expectedSalary,
    currentCompany,
    status: 'pending',
  });

  // Increment job applicants
  await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

  // Create transporters
  const adminTransporter = createTransporter();
  const userTransporter = createTransporter();

  // Verify SMTP connections
  console.log('Verifying admin SMTP connection...');
  await adminTransporter.verify().catch((verifyError) => {
    console.error('Admin SMTP verification error:', verifyError.message);
    throw new ApiError(500, 'Failed to connect to admin email server', [verifyError.message]);
  });

  console.log('Verifying user SMTP connection...');
  await userTransporter.verify().catch((verifyError) => {
    console.error('User SMTP verification error:', verifyError.message);
    throw new ApiError(500, 'Failed to connect to user email server', [verifyError.message]);
  });

  // Admin email
  console.log('Preparing admin email...');
  const adminMailOptions = {
    from: `Manoneit Solutions <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: process.env.GMAIL_USER,
    subject: `New Application for Job ${job.jobTitle} - ${name}`,
    text: `
Dear Admin,

A new application has been submitted to Manoneit Solutions for "${job.jobTitle}".

Application Details:
- Job ID: ${jobId}
- Job Title: ${job.jobTitle}
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'N/A'}
- Experience: ${experience || 'N/A'} years
- Current Salary: ${currentSalary || 'N/A'}
- Expected Salary: ${expectedSalary || 'N/A'}
- Current Company: ${currentCompany || 'N/A'}

The resume is attached. Please review and process the application.

Best regards,
Manoneit Solutions Recruitment System
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New Job Application</h2>
        <p>Dear Admin,</p>
        <p>A new application has been submitted to <strong>Manoneit Solutions</strong> for "<strong>${job.jobTitle}</strong>".</p>
        <h3>Application Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Job ID:</strong> ${jobId}</li>
          <li><strong>Job Title:</strong> ${job.jobTitle}</li>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
          <li><strong>Experience:</strong> ${experience || 'N/A'} years</li>
          <li><strong>Current Salary:</strong> ${currentSalary || 'N/A'}</li>
          <li><strong>Expected Salary:</strong> ${expectedSalary || 'N/A'}</li>
          <li><strong>Current Company:</strong> ${currentCompany || 'N/A'}</li>
        </ul>
        <p>The resume is attached. Please review and process the application.</p>
        <p>Best regards,<br><strong>Manoneit Solutions Recruitment System</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: resume.originalname,
        path: filePath,
      },
    ],
  };

  // User confirmation email
  console.log('Preparing user email...');
  const userMailOptions = {
    from: `Manoneit Solutions <${process.env.GMAIL_USER}>`,
    to: email,
    replyTo: process.env.GMAIL_USER,
    subject: `Application Received`,
    text: `
Dear ${name},

Your application for "${job.jobTitle}" (Job ID: ${jobId}) has been received by Manoneit Solutions. We will review it and contact you soon.

If this email is in your spam folder, please mark it as "Not Spam" to receive future updates.

Contact: ${process.env.GMAIL_USER}

Regards,
Manoneit Solutions Team
    `,
  };

  // Send admin email
  console.log('Sending admin email to:', process.env.GMAIL_USER);
  try {
    const adminResult = await adminTransporter.sendMail(adminMailOptions);
    console.log('Admin email sent:', adminResult.messageId, 'Accepted:', adminResult.accepted);
  } catch (adminError) {
    console.error('Admin email error:', adminError.message, 'Code:', adminError.code);
    throw new ApiError(500, 'Failed to send admin email', [adminError.message]);
  }

  // Send user email (non-critical)
  console.log('Sending user email to:', email);
  let userEmailFailed = false;
  let userEmailErrorMessage = '';
  try {
    const userResult = await userTransporter.sendMail(userMailOptions);
    console.log('User email sent:', userResult.messageId, 'Accepted:', userResult.accepted);
  } catch (userError) {
    console.error('User email error:', userError.message, 'Code:', userError.code);
    userEmailFailed = true;
    userEmailErrorMessage = userError.message;
  }

  // Delete the uploaded file
  console.log('Checking file exists before deleting:', filePath);
  try {
    await fs.access(filePath, fs.constants.F_OK);
    console.log('File exists before deletion');
  
    await fs.unlink(filePath);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('File check/delete error:', error.message);
  }
  
  

  console.log('Submission complete.');
  return res.status(200).json({
    success: true,
    message: userEmailFailed
      ? `Application submitted, but failed to send confirmation email: ${userEmailErrorMessage}`
      : 'Application submitted successfully',
    data: application,
  });
});

// @desc    Get user's applications
// @route   GET /api/v1/users/my-applications
// @access  Private (Candidate)
const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, 'User not authenticated');
  }
  if (req.user?.role !== 'candidate') {
    throw new ApiError(403, 'Only candidates can view their applications');
  }

  const applications = await Application.find({ userId })
    .populate('jobId', 'jobTitle company')
    .populate('userId', 'name');
  return res.status(200).json({
    success: true,
    data: applications,
  });
});

// @desc    Get all applications
// @route   GET /api/v1/users/applications/all
// @access  Private (Admin only)
const getAllApplications = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  const { jobId } = req.query;

  const filter = jobId ? { jobId } : {};

  const applications = await Application.find(filter)
    .populate('jobId', 'jobTitle company')
    .populate('userId', 'fullname email');

  return res.status(200).json({
    success: true,
    data: applications,
  });
});


const deleteAllApplicationsForJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Only admins can close all applications');
  }

  const { jobId } = req.params;
  await Application.deleteMany({ jobId });

  res.status(200).json({
    success: true,
    message: 'All applications for this job have been deleted',
  });
});

// Delete a specific user's application for a job - Admin Only
// DELETE application by jobId and userId
const deleteSingleApplication = asyncHandler(async (req, res) => {
  const { jobId, userId } = req.params;

  const deleted = await Application.findOneAndDelete({ jobId, userId });

  if (!deleted) {
    throw new ApiError(404, 'Application not found for this user and job');
  }

  res.status(200).json({
    success: true,
    message: 'Application deleted successfully',
  });
});



export { submitResume, getMyApplications, getAllApplications, deleteAllApplicationsForJob, deleteSingleApplication };