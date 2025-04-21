import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../Context/AuthContext';
import { FaBriefcase, FaUsers, FaLink } from 'react-icons/fa';
import axios from 'axios';

const CompanyDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companyJobs, setCompanyJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);

  // Redirect non-clients or unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'client') {
      navigate('/jobs');
    }
  }, [user, navigate]);

  // Fetch company jobs
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        const response = await axios.get('http://localhost:8000/api/v1/jobs/my-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyJobs(response.data.data);
        setJobsLoading(false);
      } catch (error) {
        console.error('Error fetching company jobs:', error.response?.data || error.message);
        setJobsError(error.response?.data?.message || 'Failed to fetch company jobs');
        setJobsLoading(false);
      }
    };

    if (token && user?.role === 'client') {
      fetchCompanyJobs();
    }
  }, [token, user]);

  // Calculate metrics
  const activeJobsCount = companyJobs.filter((job) => job.status === 'active').length;
  const pendingJobsCount = companyJobs.filter((job) => job.status === 'pending').length;
  const closedJobsCount = companyJobs.filter((job) => job.status === 'closed').length;

  if (!user || user.role !== 'client') {
    return null;
  }

  if (jobsLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">Loading...</div>;
  }

  if (jobsError) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">Error: {jobsError}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Company Dashboard
        </motion.h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaBriefcase className="text-yellow-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Jobs</h3>
              <p className="text-2xl font-bold text-gray-600">{pendingJobsCount}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
          >
            <FaBriefcase className="text-red-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Closed Jobs</h3>
              <p className="text-2xl font-bold text-gray-600">{closedJobsCount}</p>
            </div>
          </motion.div>
        </div>

        {/* Posted Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Posted Jobs</h2>
          {companyJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium text-gray-800">Job Title</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Location</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Status</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Applicants</th>
                    <th className="py-3 px-4 font-medium text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companyJobs.map((job) => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{job.jobTitle}</td>
                      <td className="py-3 px-4">{job.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{job.applicants || 0}</td>
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
            <p className="text-gray-600">No jobs posted yet.</p>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 text-center">
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

export default CompanyDashboard;