import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // To store confirmation data

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Set status as rejected if jobId is null or undefined
      const formattedApps = (response.data.data || []).map(app => ({
        ...app,
        status: app.status || (app.jobId ? 'pending' : 'rejected'),
      }));

      setApplications(formattedApps);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchApplications();
    }
  }, [user]);

  const withdrawApplication = async (applicationId) => {
    const confirmWithdraw = window.confirm('Are you sure you want to withdraw this application?');
    if (!confirmWithdraw) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/users/delete-application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err.response?.data || err.message);
      alert('Failed to withdraw application');
    }
  };

  const deleteApplication = async (applicationId, status) => {
    if (status === 'rejected') {
      // This part is for UI deletion after user confirms the action
      setDeleteConfirmation(applicationId); // Store the application ID to trigger deletion
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this application permanently?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/users/delete-application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application:', err.response?.data || err.message);
      alert('Failed to delete application');
    }
  };

  const handleConfirmDelete = (applicationId) => {
    setApplications((prevApps) => prevApps.filter((app) => app._id !== applicationId));
    setDeleteConfirmation(null); // Clear confirmation state after deletion
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null); // Reset confirmation state if user cancels
  };

  if (!user || user.role !== 'candidate') {
    return <div className="text-red-500 text-center mt-10">Unauthorized</div>;
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
              <h3 className="text-xl font-semibold text-gray-800">{app.jobId?.jobTitle || 'Unknown Job'}</h3>
              <p className="text-gray-600">Company: {app.jobId?.company || 'Unknown Company'}</p>
              <p className="text-gray-500 text-sm mb-2">
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-gray-700">
                Status:{' '}
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    app.status === 'pending'
                      ? 'bg-yellow-500'
                      : app.status === 'withdrawn'
                      ? 'bg-blue-500'
                      : 'bg-red-500'
                  }`}
                >
                  {app.status}
                </span>
              </p>

              {app.status === 'pending' && (
                <button
                  onClick={() => withdrawApplication(app._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Withdraw Application
                </button>
              )}

              {(app.status === 'withdrawn' || app.status === 'rejected') && (
                <button
                  onClick={() => deleteApplication(app._id, app.status)}
                  className="mt-4 ml-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                >
                  Delete Application
                </button>
              )}

              {deleteConfirmation === app._id && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Are you sure you want to delete this application?</p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleConfirmDelete(app._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      No, Cancel
                    </button>
                  </div>
                </div>
              )}
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
