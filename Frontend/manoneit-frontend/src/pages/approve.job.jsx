import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { motion } from 'framer-motion';

const AdminReview = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [rawJobs, setRawJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState({});

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch pending jobs
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8000/api/v1/users/jobs/pending-jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setRawJobs(result.data || []);
          const pendingJobs = (result.data || []).filter((job) => String(job.status).toLowerCase() === 'pending');
          setJobs(pendingJobs);
        } else {
          setError(result.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        setError('Error fetching jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin' && token) {
      fetchPendingJobs();
    } else {
      setLoading(false);
      setError('Not authorized or missing token');
    }
  }, [user, token]);

  // Approve a job
  const handleApprove = async (jobId) => {
    try {
      setApproving((prev) => ({ ...prev, [jobId]: true }));
      const response = await fetch(`http://localhost:8000/api/v1/users/approve/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== jobId));
        setRawJobs(rawJobs.filter((job) => job._id !== jobId));
      } else {
        setError(result.message || 'Failed to approve job');
      }
    } catch (err) {
      setError('Error approving job. Please try again.');
    } finally {
      setApproving((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Review Pending Jobs</h2>

        {loading && <p className="text-center text-gray-600">Loading pending jobs...</p>}
        {error && (
          <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg mb-6">{error}</p>
        )}
        {!loading && jobs.length === 0 && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No pending jobs to review.</p>
            {rawJobs.length > 0 && (
              <div className="mt-4">
                <p className="text-orange-600">Debug: Raw jobs from API (unfiltered):</p>
                <pre className="text-left text-sm bg-gray-100 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(rawJobs, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        {!loading && jobs.length > 0 && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-800">{job.jobTitle}</h3>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Company:</span> {job.company}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Job Type:</span> {job.jobType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Skills:</span> {job.skillsRequired.join(', ')}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Description:</span> {job.description}
                </p>
                {job.salary && (
                  <p className="text-gray-600">
                    <span className="font-medium">Salary:</span> ${job.salary.toLocaleString()}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Posted By:</span> {job.createdBy?.name || 'Unknown'}
                </p>
                <button
                  onClick={() => handleApprove(job._id)}
                  disabled={approving[job._id]}
                  className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                    approving[job._id]
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  aria-label={`Approve job ${job.jobTitle}`}
                >
                  {approving[job._id] ? 'Approving...' : 'Approve Job'}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminReview;
