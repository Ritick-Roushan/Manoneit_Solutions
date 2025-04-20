import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  const handleNavClick = (path) => {
    console.log('Navigating to:', path);
    setIsOpen(false);
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
          <nav className="hidden md:flex space-x-10">
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
                  to="/admin/dashboard"
                  onClick={() => handleNavClick('/admin/dashboard')}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </>
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
              <button
                onClick={handleLogout}
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to={user ? '/admin/dashboard' : '/signup'}
              onClick={() => handleNavClick(user ? '/admin/dashboard' : '/signup')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Link>
          </div>

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
                    to="/admin/dashboard"
                    onClick={() => handleNavClick('/admin/dashboard')}
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                </>
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
                <button
                  onClick={handleLogout}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300 text-left"
                >
                  Logout
                </button>
              )}
              <Link
                to={user ? '/admin/dashboard' : '/signup'}
                onClick={() => handleNavClick(user ? '/admin/dashboard' : '/signup')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300 text-center"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;