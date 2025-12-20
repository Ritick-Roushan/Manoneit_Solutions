import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { AuthContext } from './Context/AuthContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      jobTitle: '',
      company: '',
      location: '',
      jobType: 'full-time',
      skillsRequired: '',
      description: '',
      salary: '',
    },
  });

  const onSubmit = async (data) => {
    if (!user || !['admin', 'company'].includes(user.role)) {
      setError('root', { message: 'You must be an admin or company to post jobs' });
      return;
    }

    const jobData = {
      ...data,
      skillsRequired: data.skillsRequired
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill),
      salary: data.salary?.trim() || undefined,
      status: user.role === 'admin' ? 'active' : 'pending',
    };

    try {
      setLoading(true);
      const response = await fetch('/api/v1/users/jobs/createJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();
      setLoading(false);
      if (response.ok) {
        setSuccess(true);
      } else {
        setError('root', { message: result.message || 'Error posting the job' });
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setLoading(false);
      setError('root', { message: 'Failed to post job. Please try again.' });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full mx-auto my-12"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Post a New Job</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {isAdmin
            ? 'Your job will be published immediately.'
            : 'Your job will be reviewed by an admin before publication.'}
        </p>

        {errors.root && (
          <p className="text-red-500 text-center text-sm mb-6 bg-red-50 p-3 rounded-lg">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              id="jobTitle"
              {...register('jobTitle', { required: 'Job title is required' })}
              type="text"
              placeholder="e.g., Software Engineer"
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Job title"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              id="company"
              {...register('company', { required: 'Company name is required' })}
              type="text"
              placeholder="e.g., TechCorp"
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Company name"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              {...register('location', { required: 'Location is required' })}
              type="text"
              placeholder="e.g., Remote or New York, NY"
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Job location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="jobType"
              {...register('jobType', { required: 'Job type is required' })}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Job type"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {errors.jobType && (
              <p className="text-red-500 text-sm mt-1">{errors.jobType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
              Skills Required
            </label>
            <input
              id="skillsRequired"
              {...register('skillsRequired', {
                required: 'At least one skill is required',
                validate: (value) =>
                  value.split(',').map((skill) => skill.trim()).filter((skill) => skill).length > 0 ||
                  'At least one skill is required',
              })}
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Required skills"
            />
            <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            {errors.skillsRequired && (
              <p className="text-red-500 text-sm mt-1">{errors.skillsRequired.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              id="description"
              {...register('description', { required: 'Job description is required' })}
              placeholder="Describe the job responsibilities and requirements..."
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[150px] resize-y"
              aria-label="Job description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              id="salary"
              {...register('salary')}
              type="text"
              placeholder="e.g., 20 LPA"
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />

            <p className="text-sm text-gray-500 mt-1">Optional: Enter annual salary amount</p>
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            aria-label="Post job"
          >
            {loading ? 'Submitting...' : 'Post Job'}
          </button>
        </form>
      </motion.div>
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center shadow-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              {isAdmin ? 'Job Created Successfully!' : 'Job Submitted for Review!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isAdmin
                ? 'Job created successfully.'
                : 'Job created and pending admin approval.'}
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              aria-label="Go to jobs page"
            >
              Go to Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;