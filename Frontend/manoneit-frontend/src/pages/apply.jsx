
import { useState, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      experience: '',
      currentSalary: '',
      expectedSalary: '',
      currentCompany: '',
    },
  });

  const onSubmit = async (data) => {
    if (!resume) {
      setError('Resume is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('jobId', jobId);
    formDataToSend.append('name', data.name);
    formDataToSend.append('email', data.email);
    formDataToSend.append('phone', data.phone);
    formDataToSend.append('experience', data.experience);
    formDataToSend.append('currentSalary', data.currentSalary);
    formDataToSend.append('expectedSalary', data.expectedSalary);
    formDataToSend.append('currentCompany', data.currentCompany);
    formDataToSend.append('resume', resume);

    try {
      setError(null);
      setLoading(true); // Start loading
      await axios.post(
        '/api/v1/users/submit-resume',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLoading(false); // Stop loading
      setSuccess(true); // Show success message
    } catch (error) {
      setLoading(false); // Stop loading on error
      setError(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError(null);
    } else {
      setError('Please upload a PDF file');
      setResume(null);
    }
  };

  if (!user || user.role !== 'candidate') {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 relative">
        <h2 className="text-2xl font-bold flex justify-center text-gray-800 mb-6">Apply for Job</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email',
                },
              })}
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Phone number must be exactly 10 digits',
                },
              })}
              type="text"
              maxLength={10}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              {...register('experience', {
                pattern: {
                  value: /^\d+$/,
                  message: 'Experience must be a number',
                },
              })}
              type="number"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Salary</label>
            <input
              {...register('currentSalary', {
                pattern: {
                  value: /^\d+$/,
                  message: 'Current salary must be a number',
                },
              })}
              type="number"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.currentSalary && (
              <p className="text-red-500 text-sm mt-1">{errors.currentSalary.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
            <input
              {...register('expectedSalary', {
                pattern: {
                  value: /^\d+$/,
                  message: 'Expected salary must be a number',
                },
              })}
              type="number"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.expectedSalary && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedSalary.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Company</label>
            <input
              {...register('currentCompany')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 w-full text-gray-700"
            />
            {error && error.includes('PDF') && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button during loading
            className={`w-full py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Processing your application...</p>
            </div>
          </div>
        )}
      </div>

      {/* Success Message Overlay */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center shadow-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Your job application has been successfully submitted. We'll get back to you soon!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyJob;
