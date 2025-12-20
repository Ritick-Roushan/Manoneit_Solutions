import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [availableJobs, setAvailableJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch applications and available jobs
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch applications
      console.log('Fetching user applications');
      const applicationsResponse = await axios.get('/api/v1/users/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log('Applications response:', applicationsResponse.data);
      const formattedApps = (applicationsResponse.data.data || []).map(app => ({
        ...app,
        status: app.status || (app.jobId ? 'pending' : 'rejected'),
      }));
      setApplications(formattedApps);

      // Fetch available jobs
      console.log('Fetching available jobs');
      const jobsResponse = await axios.get('/api/v1/users/jobs/getAllJobs', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log('Jobs response:', jobsResponse.data);
      setAvailableJobs(jobsResponse.data.data?.length || 0);

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err.response?.data || err.message);
      const errorMessage =
        err.response?.status === 401
          ? 'Unauthorized: Please log in again'
          : err.response?.data?.message || 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchData();
    } else {
      console.warn('User is not a candidate:', user);
      setError('Unauthorized: Candidate access required');
      setLoading(false);
    }
  }, [user]);

  // Handle withdrawal (delete from database and UI)
const withdrawApplication = async (applicationId, jobId) => {
  if (!confirm('Are you sure you want to withdraw this application?')) return;

  try {
    console.log(`Withdrawing application with applicationId: ${applicationId}, jobId: ${jobId}, userId: ${user._id}`);
    
    // Call the correct API route with both jobId and userId
    await axios.delete(`/api/v1/users/delete-application/${jobId}/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    // Remove the withdrawn application from state
    setApplications((prevApps) => prevApps.filter((app) => app._id !== applicationId));
    
    console.log('Application withdrawn and deleted successfully');
  } catch (err) {
    console.error('Error withdrawing application:', err.response?.data || err.message);
    alert(`Failed to withdraw application: ${err.response?.data?.message || 'Unknown error'}`);
    fetchData(); // Optional: refresh state in case of mismatch
  }
};


  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading applications...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || user.role !== 'candidate') {
    return <div className="text-center mt-10 text-red-600">Unauthorized: Candidate access required</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 py-16 bg-gray-50"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidate Dashboard</h1>

      {/* Job Statistics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-800">Jobs Applied</h3>
          <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-800">Jobs Available</h3>
          <p className="text-2xl font-bold text-green-600">{availableJobs}</p>
        </div>
      </div>

      {applications.length > 0 ? (
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

              <div className="mt-4 flex space-x-4">
                {app.status === 'pending' && (
                  <button
                    onClick={() => withdrawApplication(app._id, app.jobId?._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    disabled={!app.jobId?._id}
                  >
                    Withdraw Application
                  </button>
                )}
              </div>
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