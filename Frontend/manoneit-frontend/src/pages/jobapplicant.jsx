import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchApplicants();
  }, [jobId]);

  if (loading) return <div className="text-center mt-10 text-gray-700">Loading applicants...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicants for This Job</h2>

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
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
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
