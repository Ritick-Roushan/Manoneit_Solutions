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

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setLogoutError(null);
      await axios.post('/api/v1/users/logout', {}, { withCredentials: true });
    } catch (error) {
      console.log('Logout API failed:', error.response?.status);
    } finally {
      logout();
      setIsOpen(false);
      setIsProfileOpen(false);
      navigate('/login');
      setLogoutLoading(false);
    }
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate(path);
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const roleLinks = {
    admin: [
      { path: '/post-job', label: 'Post Job' },
      { path: '/admin-review', label: 'Review Jobs' },
      { path: '/invoicegenerator', label: 'Generate Invoice' },
      { path: '/billing-details', label: 'Billing Details' },
      { path: '/candidates-details', label: 'Candidate Details' },
      { path: '/admin-dashboard', label: 'Dashboard' },
    ],
    company: [
      { path: '/post-job', label: 'Post Job' },
      { path: '/company-dashboard', label: 'Dashboard' },
    ],
    candidate: [{ path: '/dashboard', label: 'Dashboard' }],
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    // ...(user?.role === 'admin' ? [{ label: 'Clients', path: '/clients' }] : []),
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Fully Blue */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => handleNavClick('/')}>
              <h1 className="text-2xl font-bold text-blue-600">
                Manoneit Solutions
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className="text-gray-600 text-sm font-medium hover:text-blue-600 hover:bg-blue-50 px-3.5 py-2 rounded-lg transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {user &&
              roleLinks[user.role]?.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="text-gray-600 text-sm font-medium hover:text-blue-600 hover:bg-blue-50 px-3.5 py-2 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => handleNavClick('/login')}
                  className="text-gray-600 text-sm font-medium hover:text-blue-600 hover:bg-blue-50 px-3.5 py-2 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => handleNavClick('/signup')}
                  className="ml-2 bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials(user.email)}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2.5 text-sm text-gray-700 font-medium border-b border-gray-100 truncate">
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => handleNavClick('/profile')}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Personal Information
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={() => handleNavClick('/change-password')}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                        logoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {logoutLoading ? 'Logging out...' : 'Logout'}
                    </button>
                    {logoutError && (
                      <p className="px-4 py-2 text-sm text-red-500 bg-red-50">
                        {logoutError}
                      </p>
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
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-lg hover:bg-blue-50"
              aria-label="Toggle mobile menu"
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
          <div className="md:hidden bg-white border-t border-gray-100">
            <nav className="flex flex-col space-y-1 px-4 py-5">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}

              {user &&
                roleLinks[user.role]?.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => handleNavClick('/login')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => handleNavClick('/signup')}
                    className="mt-2 bg-blue-600 text-white text-center font-medium px-3 py-2.5 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {user && (
                <>
                  <div className="text-gray-500 text-sm px-3 py-2 border-t border-gray-100 mt-2 pt-3 truncate">
                    {user.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => handleNavClick('/profile')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg"
                  >
                    Personal Information
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => handleNavClick('/change-password')}
                    className="text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className={`text-left text-gray-600 text-base font-medium hover:text-blue-600 hover:bg-blue-50 px-3 py-2.5 rounded-lg ${
                      logoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {logoutLoading ? 'Logging out...' : 'Logout'}
                  </button>
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