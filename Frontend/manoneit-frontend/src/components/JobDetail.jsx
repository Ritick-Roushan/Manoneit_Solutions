import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { motion } from 'framer-motion';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/jobs/getJobById/${id}`, {
          withCredentials: true,
        });
        setJob(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch job');
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }
    navigate(`/apply/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error || 'Job not found'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto px-4 py-16 bg-gray-50"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.jobTitle}</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <img
            src={job.image || 'https://via.placeholder.com/48'}
            alt={job.jobTitle}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{job.company}</h2>
            <p className="text-gray-600">{job.location}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">Job Type:</span> {job.jobType}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">Salary:</span>{' '}
          {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">Skills Required:</span>{' '}
          {job.skillsRequired.join(', ')}
        </p>
        <p className="text-gray-600 mb-6">
          <span className="font-medium">Description:</span> {job.description}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Posted on {new Date(job.createdAt).toLocaleDateString()}
        </p>
        {job.status === 'active' && (
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        )}
        {job.status === 'closed' && (
          <p className="text-red-500 font-medium">This job is closed.</p>
        )}
      </div>
    </motion.div>
  );
};

export default JobDetail;