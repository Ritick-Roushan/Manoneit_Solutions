import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log('Header user:', { user: user ? { email: user.email, role: user.role } : null });

  const handleLogout = async () => {
    try {
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
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  const handleNavClick = (path) => {
    console.log('Navigating to:', path);
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => handleNavClick('/')}>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Manoneit Solutions
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {['Home', 'Jobs', 'Clients', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => handleNavClick(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/post-job"
                  onClick={() => handleNavClick('/post-job')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Post Job
                </Link>
                <Link
                  to="/admin-dashboard"
                  onClick={() => handleNavClick('/admin-dashboard')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </>
            )}
            {user?.role === 'client' && (
              <>
                <Link
                  to="/post-job"
                  onClick={() => handleNavClick('/post-job')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Post Job
                </Link>
                <Link
                  to="/company-dashboard"
                  onClick={() => handleNavClick('/company-dashboard')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </>
            )}
            {user?.role === 'candidate' && (
              <Link
                to="/dashboard"
                onClick={() => handleNavClick('/dashboard')}
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => handleNavClick('/login')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => handleNavClick('/signup')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => handleNavClick('/profile')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Personal Information
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={() => handleNavClick('/change-password')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden bg-white/90 border-t border-gray-200 transition-all duration-300">
            <nav className="flex flex-col space-y-3 px-4 py-6">
              {['Home', 'Jobs', 'Clients', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => handleNavClick(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/post-job"
                    onClick={() => handleNavClick('/post-job')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Post Job
                  </Link>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => handleNavClick('/admin-dashboard')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              {user?.role === 'client' && (
                <>
                  <Link
                    to="/post-job"
                    onClick={() => handleNavClick('/post-job')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Post Job
                  </Link>
                  <Link
                    to="/company-dashboard"
                    onClick={() => handleNavClick('/company-dashboard')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              {user?.role === 'candidate' && (
                <Link
                  to="/dashboard"
                  onClick={() => handleNavClick('/dashboard')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              )}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => handleNavClick('/login')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => handleNavClick('/signup')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-gray-700 text-lg font-medium">{user.email}</div>
                  <Link
                    to="/profile"
                    onClick={() => handleNavClick('/profile')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Personal Information
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => handleNavClick('/change-password')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300 text-left"
                  >
                    Logout
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