import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Manoneit Solutions
            </h3>
            <p className="text-gray-300 text-sm">
              Connecting top talent with leading companies. Your career starts here.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Jobs'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <p className="text-gray-300 text-sm">
              Regd. Office: H/N-A/35, Rajeev Nagar Gali, Kanti Factory Road, Gandhi Nagar, Kankarbagh, Patna-800020
            </p>
            <p className="text-gray-300 text-sm mt-2">Email: manoneitindia@gmail.com</p>
            <p className="text-gray-300 text-sm">Phone: 9973752777</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.linkedin.com/company/manoneit-solutions" // Replace with your LinkedIn URL
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-300"
                aria-label="Visit our LinkedIn page"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Manoneit Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;