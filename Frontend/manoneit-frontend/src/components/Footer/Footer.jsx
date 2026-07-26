import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Manoneit Solutions
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Strategic talent solutions for growing businesses.  
              We connect exceptional professionals with leading organizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              H/N-A/35, Rajeev Nagar Gali, Kanti Factory Road,  
              Gandhi Nagar, Kankarbagh, Patna-800020
            </p>
            <p className="text-slate-300 text-sm mt-3">
              Email: shivam@manoneitsolutions.in
            </p>
            <p className="text-slate-300 text-sm">Phone: 9973752777</p>

            <div className="flex space-x-4 mt-5">
              <a
                href="https://www.linkedin.com/company/manoneit-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Manoneit Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;