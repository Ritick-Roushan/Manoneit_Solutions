import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/my-applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          withCredentials: true,
        });
        setApplications(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'candidate') {
      fetchApplications();
    }
  }, [user]);

  if (!user || user.role !== 'candidate') {
    return <div className="text-red-500 text-center">Unauthorized</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 py-16 bg-gray-50"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidate Dashboard</h1>
      {loading ? (
        <p className="text-gray-600">Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800">{app.jobId?.jobTitle || 'Unknown'}</h3>
              <p className="text-gray-600">Company: {app.jobId?.company || 'Unknown'}</p>
              <p className="text-gray-500 text-sm">
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No applications found.</p>
      )}
    </motion.div>
  );
};

export default UserDashboard;