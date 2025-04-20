import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './Context/AuthContext';

const Signup = () => {
  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      contactnumber: '',
      companyname: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    // Prepare user data
    const userData = {
      fullname: data.fullname,
      email: data.email,
      contactnumber: data.contactnumber,
      role,
      password: data.password,
      ...(role === 'company' && data.companyname && { companyname: data.companyname }),
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Signup response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: result,
      });

      // Handle success (200 or 201)
      if (response.status === 200 || response.status === 201) {
        // Try various response structures
        const accessToken =
          result.data?.accessToken ||
          result.accessToken ||
          result.data?.token ||
          result.token;
        const user =
          result.data?.user ||
          result.user ||
          result.data?.registeredUser ||
          result.data ||
          result;

        if (!accessToken || !user?._id) {
          console.warn('Invalid response structure:', result);
          alert('Registration succeeded!');
          navigate('/login');
          return;
        }

        login(accessToken, user);
        alert('Registration succeeded!');
        navigate('/login');
      } else {
        console.warn('Backend error:', result);
        setError('root', { message: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('root', { message: 'Failed to register. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Join Manoneit Solutions
          </h2>
          <p className="text-sm text-gray-600">Create your account</p>
        </div>

        {errors.root && <p className="text-red-500 text-center text-sm">{errors.root.message}</p>}

        {/* Role Selector */}
        <div className="flex justify-center space-x-2">
          {['Candidate', 'Company', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                role === r.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
          <div>
            <label htmlFor="fullname" className="block font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullname"
              {...register('fullname', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Full name must be at least 2 characters' },
              })}
              type="text"
              placeholder="Enter your full name"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
            )}
          </div>

          {role === 'company' && (
            <div>
              <label htmlFor="companyname" className="block font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyname"
                {...register('companyname', { required: 'Company name is required' })}
                type="text"
                placeholder="Enter your company name"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.companyname && (
                <p className="text-red-500 text-sm mt-1">{errors.companyname.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="contactnumber" className="block font-medium text-gray-700">
              Contact Number
            </label>
            <input
              id="contactnumber"
              {...register('contactnumber', {
                required: 'Contact number is required',
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Enter a valid phone number (e.g., +1234567890)',
                },
              })}
              type="tel"
              placeholder="Enter your contact number"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.contactnumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactnumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              type="email"
              placeholder="Enter your email address"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              {...register('confirmPassword', { required: 'Confirm password is required' })}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;