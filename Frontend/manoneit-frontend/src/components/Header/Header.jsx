import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug user role
  console.log('Header user:', user ? { email: user.email, role: user.role } : 'No user logged in');

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setLogoutError(null);
      await axios.post(
        'http://localhost:8000/api/v1/users/logout',
        {},
        {
          withCredentials: true,
        }
      );
      logout();
      setIsOpen(false);
      setIsProfileOpen(false);
      navigate('/login');
    } catch (error) {
      setLogoutError(error.response?.data?.message || 'Logout failed. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate(path);
  };

  // Generate user initials for avatar
  const getInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    return parts.map((part) => part.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  // Define role-specific links
  const roleLinks = {
    admin: [
      { path: '/post-job', label: 'Post Job', aria: 'Navigate to post job page' },
      { path: '/admin-review', label: 'Review Jobs', aria: 'Navigate to admin review page' },
      { path: '/admin-dashboard', label: 'Dashboard', aria: 'Navigate to admin dashboard' },
    ],
    company: [
      { path: '/post-job', label: 'Post Job', aria: 'Navigate to post job page' },
      { path: '/company-dashboard', label: 'Dashboard', aria: 'Navigate to company dashboard' },
    ],
    candidate: [
      { path: '/dashboard', label: 'Dashboard', aria: 'Navigate to candidate dashboard' },
    ],
  };

  // Define navigation links, restricting 'Clients' to admins
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    ...(user?.role === 'admin' ? [{ label: 'Clients', path: '/clients' }] : []),
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => handleNavClick('/')}>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Manoneit Solutions
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                aria-label={`Navigate to ${item.label} page`}
              >
                {item.label}
              </Link>
            ))}
            {user && roleLinks[user.role]?.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                aria-label={link.aria}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => handleNavClick('/login')}
                  className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                  aria-label="Navigate to login page"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => handleNavClick('/signup')}
                  className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                  aria-label="Navigate to signup page"
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                  aria-label="Toggle profile menu"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(user.email)}
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-200">
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => handleNavClick('/profile')}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      aria-label="Navigate to profile page"
                    >
                      Personal Information
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={() => handleNavClick('/change-password')}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      aria-label="Navigate to change password page"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                        logoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      aria-label="Logout"
                    >
                      {logoutLoading ? 'Logging out...' : 'Logout'}
                    </button>
                    {logoutError && (
                      <p className="px-4 py-2 text-sm text-red-500 bg-red-50">{logoutError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200" id="mobile-menu">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                  aria-label={`Navigate to ${item.label} page`}
                >
                  {item.label}
                </Link>
              ))}
              {user && roleLinks[user.role]?.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                  aria-label={link.aria}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => handleNavClick('/login')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                    aria-label="Navigate to login page"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => handleNavClick('/signup')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                    aria-label="Navigate to signup page"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {user && (
                <>
                  <div className="text-gray-600 text-base font-medium px-3 py-2">{user.email}</div>
                  <Link
                    to="/profile"
                    onClick={() => handleNavClick('/profile')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                    aria-label="Navigate to profile page"
                  >
                    Personal Information
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => handleNavClick('/change-password')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300"
                    aria-label="Navigate to change password page"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className={`text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-300 text-left ${
                      logoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Logout"
                  >
                    {logoutLoading ? 'Logging out...' : 'Logout'}
                  </button>
                  {logoutError && (
                    <p className="px-3 py-2 text-sm text-red-500 bg-red-50 rounded-lg">
                      {logoutError}
                    </p>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;