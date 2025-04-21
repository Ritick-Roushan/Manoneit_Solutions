import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/change-password',
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          withCredentials: true,
        }
      );
      setSuccess('Password changed successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/profile'), 2000); // Redirect to profile after 2 seconds
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-gray-700 text-lg mb-4">Please log in to change your password.</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white shadow-xl rounded-lg max-w-lg w-full p-8 mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Change Password</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword} // Corrected typo
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Change Password
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/profile"
            className="text-gray-600 hover:text-blue-500 font-medium transition-colors duration-300"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;