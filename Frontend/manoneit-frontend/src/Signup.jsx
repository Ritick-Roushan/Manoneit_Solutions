import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contactnumber: '',
    password: '',
    role: '', // Default role
    companyname: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // New state for success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      setLoadingOtp(true);
      setError('');
      const res = await axios.post('/api/v1/users/send-otp', { email: formData.email });
      console.log('🟢 OTP API full response:', res.data);
      setOtpSent(true);
    } catch (err) {
      console.error('🔴 Failed to send OTP:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoadingSignup(true);
      setError('');

      const res = await axios.post('/api/v1/users/register', formData);

      console.log('✅ Registration success:', res.data);
      setSuccess(true); // Show success state
      setFormData({
        fullname: '',
        email: '',
        contactnumber: '',
        password: '',
        role: '',
        companyname: '',
        otp: '',
      }); // Reset form
      setOtpSent(false); // Reset OTP state
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoadingSignup(false);
    }
  };

  // Reset success state to allow re-registration
  const handleTryAgain = () => {
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-green-200 p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <svg
              className="h-16 w-16 text-green-500 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created. You can now log in to continue.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </a>
            <button
              onClick={handleTryAgain}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-green-200 p-4 relative overflow-hidden">
      {/* Wave Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-10 transform transition-all duration-500 hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
            Join Us Today
          </span>
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 animate-fade-in">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <form className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Full Name"
              required
            />
            <label
              htmlFor="fullname"
              className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Email Address"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Email Address
            </label>
          </div>

          {/* Send OTP Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loadingOtp || !formData.email}
              className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105 ${loadingOtp || !formData.email
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
            >
              {loadingOtp ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    ></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
            {otpSent && (
              <span className="text-green-600 font-medium animate-pulse">OTP Sent!</span>
            )}
          </div>

          {/* OTP */}
          {otpSent && (
            <div className="relative">
              <input
                type="text"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="OTP"
                required
              />
              <label
                htmlFor="otp"
                className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
              >
                OTP
              </label>
            </div>
          )}

          {/* Contact Number */}
          <div className="relative">
            <input
              type="text"
              name="contactnumber"
              id="contactnumber"
              value={formData.contactnumber}
              onChange={handleChange}
              className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Contact Number"
              required
            />
            <label
              htmlFor="contactnumber"
              className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Contact Number
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Password
            </label>
          </div>

          {/* Role */}
          {/* Role */}
          <div className="relative">
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="candidate">Candidate</option>
              <option value="company">Company</option>
            </select>
            <label
              htmlFor="role"
              className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200"
            >
              Role
            </label>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>


          {/* Company Name */}
          {formData.role === 'company' && (
            <div className="relative">
              <input
                type="text"
                name="companyname"
                id="companyname"
                value={formData.companyname}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-200 rounded-lg bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Company Name"
                required
              />
              <label
                htmlFor="companyname"
                className="absolute left-3 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
              >
                Company Name
              </label>
            </div>
          )}

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            disabled={loadingSignup}
            className={`w-full px-4 py-3 rounded-lg text-white font-medium transition duration-300 transform hover:scale-105 ${loadingSignup
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              }`}
          >
            {loadingSignup ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>

      {/* Custom Animation for Fade-In */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;