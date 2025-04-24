import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext'; // adjust path if needed

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // ✅ Get user info from context

  const fetchApplicants = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/applications/all?jobId=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setApplicants(response.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to close all applications?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/users/delete-all-applications/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchApplicants();
      } catch (err) {
        console.error('Error deleting all applications:', err);
      }
    }
  };

  const handleDeleteOne = async (appId) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/users/delete-application/${appId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchApplicants();
      } catch (err) {
        console.error('Error deleting one application:', err);
      }
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-700">Loading applicants...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicants for This Job</h2>

      {user?.role === 'admin' && applicants.length > 0 && (
        <button
          onClick={handleDeleteAll}
          className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close All Applications
        </button>
      )}

      {applicants.length === 0 ? (
        <p className="text-gray-600">No applicants yet.</p>
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
                {user?.role === 'admin' && <th className="py-3 px-4">Action</th>}
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{applicant.userId.fullname}</td>
                  <td className="py-3 px-4">{applicant.userId.email}</td>
                  <td className="py-3 px-4">{applicant.experience || 'N/A'} yrs</td>
                  <td className="py-3 px-4">₹{applicant.currentSalary || 'N/A'}</td>
                  <td className="py-3 px-4">₹{applicant.expectedSalary || 'N/A'}</td>
                  <td className="py-3 px-4">{applicant.currentCompany || 'N/A'}</td>
                  <td className="py-3 px-4">{applicant.status || 'Pending'}</td>
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
                  {user?.role === 'admin' && (
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteOne(applicant._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
