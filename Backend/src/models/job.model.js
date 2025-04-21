import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
    },
    jobType: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'contract', 'internship'],
        message: '{VALUE} is not a valid job type',
      },
      default: 'full-time',
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: null, // Optional field
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Skills required are mandatory'],
      validate: {
        validator: (skills) => skills.length > 0,
        message: 'At least one skill is required',
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'closed'], // Replaced 'draft' with 'pending'
        message: '{VALUE} is not a valid status',
      },
      default: 'pending', // Default for company-created jobs
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    applicants: {
      type: Number,
      default: 0,
      min: [0, 'Applicants cannot be negative'],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;