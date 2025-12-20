import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { motion } from 'framer-motion';
import { FaSpinner, FaSearch } from 'react-icons/fa';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) {
        setError('Invalid job ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/users/jobs/getJobById/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        // Check if the response data is HTML, which indicates an error in the API endpoint/server setup
        if (typeof res.data === 'string' && res.data.startsWith('<!doctype html>')) {
          console.error('API returned HTML instead of JSON. This often indicates a misconfigured backend route or proxy.');
          throw new Error('Server returned an HTML page. Expected job data. Check API endpoint and proxy configuration.');
        }

        let jobData = res.data;
        // Attempt to extract job data if nested, assuming the backend sends valid JSON
        if (res.data.data) {
          jobData = res.data.data;
        } else if (res.data.job) {
          jobData = res.data.job;
        } else if (!res.data._id) { // If the root data doesn't have an _id, it's likely not the job object itself
          console.error('Invalid job data structure: Missing _id at root level or in expected nested paths.', res.data);
          throw new Error('Job data is in an unexpected format. Could not find job details.');
        }

        setJob(jobData);
        setError(null);
      } catch (err) {
        console.error('Error fetching job:', err);
        let errorMessage = 'Failed to load job details.';

        if (err.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your internet connection or server availability.';
        } else if (err.message.includes('HTML page')) {
          errorMessage = err.message; // Use the specific message for HTML response
        } else if (axios.isAxiosError(err)) {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (err.response.status === 404) {
              errorMessage = `Job not found for ID: ${jobId}. It may have been deleted or doesn’t exist.`;
            } else if (err.response.status === 401) {
              errorMessage = 'Unauthorized access. Please log in if required.';
            } else {
              errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            }
          } else if (err.request) {
            // The request was made but no response was received
            errorMessage = 'No response from server. Server might be down or unreachable.';
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId, token]);

  const handleApply = () => {
    if (!job || job.status !== 'active') {
      return alert('This job is not available for applications.');
    }

    if (!user) {
      setApplyLoading(true);
      setTimeout(() => {
        setApplyLoading(false);
        navigate('/login');
      }, 800);
      return;
    }

    setApplyLoading(true);
    setTimeout(() => {
      setApplyLoading(false);
      navigate(`/apply/${jobId}`);
    }, 800);
  };

  const handleRetry = () => {
    setError(null); // Clear previous error
    setLoading(true); // Show loading spinner again
    // Re-call fetchJobDetail
    const fetchJobDetail = async () => {
      try {
        const res = await axios.get(`/api/v1/users/jobs/getJobById/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        if (typeof res.data === 'string' && res.data.startsWith('<!doctype html>')) {
          console.error('API returned HTML instead of JSON on retry.');
          throw new Error('Server returned an HTML page. Expected job data.');
        }

        let jobData = res.data;
        if (res.data.data) {
          jobData = res.data.data;
        } else if (res.data.job) {
          jobData = res.data.job;
        } else if (!res.data._id) {
          throw new Error('Job data is in an unexpected format on retry.');
        }
        setJob(jobData);
        setError(null);
      } catch (err) {
        console.error('Error retrying fetch:', err);
        let errorMessage = 'Failed to load job details on retry.';
        if (err.message.includes('HTML page')) {
          errorMessage = err.message;
        } else if (axios.isAxiosError(err)) {
          if (err.response) {
            if (err.response.status === 404) {
              errorMessage = `Job not found for ID: ${jobId}.`;
            } else if (err.response.status === 401) {
              errorMessage = 'Unauthorized access on retry.';
            } else {
              errorMessage = err.response.data?.message || `Server error: ${err.response.status} on retry`;
            }
          } else if (err.request) {
            errorMessage = 'No response from server on retry. Server might be down.';
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-center">
          <p className="text-red-500 text-lg bg-red-50 p-4 rounded-lg shadow">Error: {error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-gray-600 text-lg">Job not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-16 bg-gradient-to-br from-blue-100 to-purple-100"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.jobTitle}</h1>
          <div className="flex items-center mb-4">
            <img
              src={job.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXoHHxo7rwXNehFmlUwFBaDRJrg1rSqEQyEQ&s'}
              alt={job.jobTitle}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">{job.company}</p>
              <p className="text-gray-600">{job.location}</p>
            </div>
          </div>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Job Type:</span> {job.jobType}</p>
            <p>
              <span className="font-medium">Salary:</span>{' '}
              {job.salary ? `₹${job.salary.toLocaleString('en-IN')}` : 'Not specified'}
            </p>
            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div>
                <p className="font-medium text-gray-700">Skills Required:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {job.skillsRequired.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            <p><span className="font-medium">Description:</span></p>
            <p className="text-gray-500 whitespace-pre-line">{job.description}</p>
            <p>
              <span className="font-medium">Posted on:</span>{' '}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
                : 'Not available'}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {job.status}
              </span>
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={handleApply}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              disabled={applyLoading}
              aria-label="Apply for job"
            >
              {applyLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSearch className="mr-2" />}
              {applyLoading ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default JobDetailPage;