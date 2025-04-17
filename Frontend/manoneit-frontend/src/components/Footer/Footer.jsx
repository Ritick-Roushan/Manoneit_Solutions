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
              {['Home', 'Jobs', 'Clients', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
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
            <p className="text-gray-300 text-sm">Email: info@manoneit.com</p>
            <p className="text-gray-300 text-sm">Phone: (123) 456-7890</p>
            <div className="flex space-x-4 mt-4">
              {['linkedin', 'twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-300 hover:text-blue-400 hover:scale-110 transform transition-all duration-300"
                >
                  <i className={`fab fa-${social} text-xl`}></i>
                </a>
              ))}
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