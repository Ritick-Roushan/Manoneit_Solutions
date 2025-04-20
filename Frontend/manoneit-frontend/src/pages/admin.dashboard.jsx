import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../Context/AuthContext';
import { JobContext } from '../Context/JobContext';
import { FaBriefcase, FaUsers, FaUserTie, FaArchive, FaLink } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const { jobs, loading: jobsLoading, error: jobsError } = useContext(JobContext);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    clients: 0,
    candidates: 0,
  });
  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const [userStatsError, setUserStatsError] = useState(null);

  // Redirect non-admins or unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/jobs');
    }
  }, [user, navigate]);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setUserStatsLoading(true);
        setUserStatsError(null);
        const response = await axios.get('http://localhost:8000/api/v1/users/get-user-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User stats response:', response.data);
        setUserStats({
          totalUsers: response.data.data.totalUsers || 0,
          clients: response.data.data.clients || 0,
          candidates: response.data.data.candidates || 0,
        });
        setUserStatsLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error.response?.data || error.message);
        setUserStatsError(error.response?.data?.message || 'Failed to fetch user stats');
        setUserStatsLoading(false);
      }
    };

    if (token && user?.role === 'admin') {
      fetchUserStats();
    }
  }, [token, user]);

  // Calculate job metrics
  const activeJobsCount = jobs.filter((job) => job.status === 'active').length;
  const closedJobsCount = jobs.filter((job) => job.status === 'closed').length;

  // Get recent active jobs (last 5, sorted by updatedAt or createdAt)
  const recentJobs = jobs
    .filter((job) => job.status === 'active')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  // Debug metrics
  useEffect(() => {
    console.log('Dashboard metrics:', {
      activeJobsCount,
      closedJobsCount,
      userStats,
      recentJobs,
    });
  }, [activeJobsCount, closedJobsCount, userStats, recentJobs]);

  if (!user || user.role !== 'admin') {
    return null; // Redirect handled by useEffect
  }

  if (jobsLoading || userStatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (jobsError || userStatsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-red-500 text-lg">Error: {jobsError || userStatsError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Admin Dashboard
        </motion.h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Active Jobs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaBriefcase className="text-blue-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Jobs</h3>
              <p className="text-2xl font-bold text-gray-600">{activeJobsCount}</p>
            </div>
          </motion.div>

          {/* Closed Jobs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaArchive className="text-red-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Closed Jobs</h3>
              <p className="text-2xl font-bold text-gray-600">{closedJobsCount}</p>
            </div>
          </motion.div>

          {/* Clients (Companies) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaUserTie className="text-green-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Clients</h3>
              <p className="text-2xl font-bold text-gray-600">{userStats.clients}</p>
            </div>
          </motion.div>

          {/* Candidates */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaUsers className="text-purple-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Candidates</h3>
              <p className="text-2xl font-bold text-gray-600">{userStats.candidates}</p>
            </div>
          </motion.div>

          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaUsers className="text-yellow-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
              <p className="text-2xl font-bold text-gray-600">{userStats.totalUsers}</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Jobs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Active Jobs</h2>
          {recentJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium text-gray-800">Job Title</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Company</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Location</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Status</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{job.jobTitle}</td>
                      <td className="py-3 px-4">{job.company}</td>
                      <td className="py-3 px-4">{job.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <FaLink className="mr-1" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent active jobs found.</p>
          )}
        </motion.div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <Link
            to="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 mr-4"
          >
            View All Jobs
          </Link>
          <Link
            to="/post-job"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors duration-300"
          >
            Post New Job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;