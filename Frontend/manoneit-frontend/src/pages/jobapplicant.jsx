import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { motion } from 'framer-motion';

const JobApplicants = () => {
  const { jobId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants and job title
  const fetchApplicants = async () => {
    if (!jobId) {
      console.error('No jobId provided');
      setError('Invalid job ID');
      setLoading(false);
      return;
    }

    if (!token) {
      console.error('No token available');
      setError('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch applicants
      console.log(`Fetching applicants for jobId: ${jobId}`);
      const applicantsResponse = await axios.get(
        `http://localhost:8000/api/v1/users/applications/all?jobId=${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log('Applicants response:', applicantsResponse.data);
      const applicantsData = applicantsResponse.data.data || [];
      setApplicants(Array.isArray(applicantsData) ? applicantsData : []);

      // Fetch job details (optional, continue even if this fails)
      try {
        console.log(`Fetching job details for jobId: ${jobId}`);
        const jobResponse = await axios.get(`http://localhost:8000/api/v1/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log('Job response:', jobResponse.data);
        setJobTitle(jobResponse.data.data?.jobTitle || 'Unknown Job');
      } catch (jobErr) {
        console.warn('Failed to fetch job details:', jobErr.response?.data || jobErr.message);
        setJobTitle('Unknown Job');
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching applicants:', err.response?.data || err.message);
      const errorMessage =
        err.response?.status === 401
          ? 'Unauthorized: Please log in again'
          : err.response?.status === 404
            ? 'No applicants found for this job'
            : err.response?.data?.message || 'Failed to load applicants';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      console.warn('No user data available, waiting for AuthContext');
      return;
    }
    if (user.role !== 'admin') {
      console.warn('User is not an admin:', user);
      setError('Unauthorized: Admin access required');
      setLoading(false);
      return;
    }
    fetchApplicants();
  }, [jobId, user, token]);

  // Delete all applications for the job
  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to close all applications for this job?')) return;

    try {
      console.log(`Deleting all applications for jobId: ${jobId}`);
      await axios.delete(`/api/v1/users/delete-all-applications/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setApplicants([]);
      console.log('All applications deleted successfully');
    } catch (err) {
      console.error('Error deleting all applications:', err.response?.data || err.message);
      alert('Failed to delete all applications');
      fetchApplicants();
    }
  };

  // Delete a single application
  const handleDeleteOne = async (appId, jobId, userId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      console.log(`Deleting application for jobId: ${jobId}, userId: ${userId}`);
      await axios.delete(`/api/v1/users/delete-application/${jobId}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setApplicants((prevApplicants) => prevApplicants.filter((app) => app._id !== appId));
      console.log('Application deleted successfully');
    } catch (err) {
      console.error('Error deleting application:', err.response?.data || err.message);
      alert(`Failed to delete application: ${err.response?.data?.message || 'Unknown error'}`);
      fetchApplicants();
    }
  };


  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading applicants...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
        <button
          onClick={fetchApplicants}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center mt-10 text-red-600">Unauthorized: Admin access required</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Applicants for {jobTitle || 'Job'}
        </h2>

        {/* Applicants Statistics */}
        <div className="mb-8 bg-white rounded-xl p-4 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-800">Total Applicants</h3>
          <p className="text-2xl font-bold text-blue-600">{applicants.length}</p>
        </div>

        {applicants.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Close All Applications
          </button>
        )}

        {applicants.length === 0 ? (
          <p className="text-gray-600">No applicants yet for this job.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-900 font-semibold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Current Salary</th>
                  <th className="py-3 px-4">Expected Salary</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{applicant.userId?.fullname || 'N/A'}</td>
                    <td className="py-3 px-4">{applicant.userId?.email || 'N/A'}</td>
                    <td className="py-3 px-4">{applicant.experience || 'N/A'} yrs</td>
                    <td className="py-3 px-4">₹{applicant.currentSalary || 'N/A'}</td>
                    <td className="py-3 px-4">₹{applicant.expectedSalary || 'N/A'}</td>
                    <td className="py-3 px-4">{applicant.currentCompany || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${applicant.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : applicant.status === 'withdrawn'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {applicant.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {applicant.resume ? (
                        <a
                          href={applicant.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        'Not uploaded'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          handleDeleteOne(applicant._id, applicant.jobId?._id, applicant.userId?._id)
                        }
                        className="text-red-500 hover:underline"
                        disabled={!applicant.userId?._id || !applicant.jobId?._id}
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobApplicants;