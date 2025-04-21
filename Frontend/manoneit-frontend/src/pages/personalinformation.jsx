import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-gray-700 text-lg mb-4">Please log in to view your profile.</p>
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

  // Assuming user object has fields like email, role, name, phone, etc.
  const userInfo = [
    { label: 'Full Name', value: user.fullname },
    { label: 'Email', value: user.email },
    { label: 'Contact Number', value: user.contactnumber },
    { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) }, // Capitalize role
    // Add more fields as available in your user object
    // { label: 'Name', value: user.name || 'N/A' },
    // { label: 'Phone', value: user.phone || 'N/A' },
  ];

  // Get user's initials for avatar (using email as fallback)
  const getInitials = () => {
    const name = user.name || user.email.split('@')[0];
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white shadow-xl rounded-lg max-w-lg w-full p-8 mx-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {getInitials()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{user.email}</h2>
          <p className="text-gray-500 text-sm">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>

        {/* User Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            {userInfo.map((info) => (
              <div key={info.label} className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">{info.label}</span>
                <span className="text-sm text-gray-900">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 font-medium transition-colors duration-300"
          >
            Back to Home
          </Link>
          <Link
            to="/change-password"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;