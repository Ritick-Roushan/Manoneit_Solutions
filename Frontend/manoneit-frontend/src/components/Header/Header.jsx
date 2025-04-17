import { useState } from 'react';
import { Link } from 'react-router-dom';

// Simulated auth (replace with real auth)
const isAuthenticated = true;
const userRole = 'admin';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Manoneit Solutions
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-10">
            {['Home', 'Jobs', 'Clients', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
            {isAuthenticated && userRole === 'admin' && (
              <Link
                to="/post-job"
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                Post Job
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to={`/${userRole}/dashboard`}
                className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transform transition-transform duration-300"
              >
                Get Started
              </Link>
            ) : (
              <Link
                to={`/${userRole}/dashboard`}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transform transition-transform duration-300"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-200 animate-slide-down">
            <nav className="flex flex-col space-y-3 px-4 py-6">
              {['Home', 'Jobs', 'Clients', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {isAuthenticated && userRole === 'admin' && (
                <Link
                  to="/post-job"
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Post Job
                </Link>
              )}
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to={`/${userRole}/dashboard`}
                  className="text-gray-700 text-lg font-medium hover:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to={isAuthenticated ? `/${userRole}/dashboard` : '/signup'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transform transition-transform duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;