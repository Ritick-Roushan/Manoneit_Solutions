import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { JobContext } from '../../Context/JobContext';
import { AuthContext } from '../../Context/AuthContext';
import {
  FaArrowUp,
  FaStar,
  FaUsers,
  FaBriefcase,
  FaHandshake,
  FaChartLine,
  FaSearch,
  FaUserTie,
  FaClipboardCheck,
  FaRocket,
  FaIndustry,
  FaBuilding,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaFileAlt,
  FaUserCheck,
  FaComments,
  FaChevronDown,
  FaBuilding as FaBuildingIcon,
  FaUserGraduate,
} from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const { jobs, loading, error } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalClient, setModalClient] = useState(null);
  const [applyLoading, setApplyLoading] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'company',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');
  const navigate = useNavigate();

  const featuredJobs = (jobs || [])
    .filter((job) => job.status === 'active')
    .slice(0, 3);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleViewDetails = (id) => {
    setApplyLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setApplyLoading((prev) => ({ ...prev, [id]: false }));
      navigate(`/job-detail/${id}`);
    }, 400);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Thank you! We will contact you shortly.');
    setFormData({ name: '', email: '', phone: '', type: 'company', message: '' });
    setTimeout(() => setFormStatus(''), 4000);
  };

  const clientSliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  const clients = [
    { name: 'Greenply Industries', logo: 'https://shorturl.at/3AVHV', description: 'Leading manufacturer of plywood and decorative veneers.' },
    { name: 'Century Ply Industries', logo: 'https://shorturl.at/KvtHF', description: 'One of the largest manufacturers of plywood and decorative veneers in India.' },
    { name: 'KEC International', logo: 'https://shorturl.at/Pwsq4', description: 'Global infrastructure and EPC solutions provider.' },
    { name: 'cemindia projects limited', logo: 'https://shorturl.at/yPILw', description: 'Global infrastructure and EPC solutions provider.' },
    { name: 'RPG Group', logo: 'https://tinyurl.com/45ufekxy', description: 'Global conglomerate with diverse business interests.' },
    { name: 'LX Hausys India Pvt Ltd', logo: 'https://tinyurl.com/3vyjtjhz', description: 'Building materials and interior design solutions.' },
    { name: 'Greenlam Industries Ltd', logo: 'https://tinyurl.com/4w2kwubz', description: 'One of the largest manufacturers of laminates in Asia.' },
    { name: 'Saint-Gobain India Pvt Ltd', logo: 'https://tinyurl.com/yr3a6swy', description: 'Global leader in sustainable habitat solutions.' },
    { name: 'NCL Industries Ltd', logo: 'https://tinyurl.com/2v44yntp', description: 'Manufacturer of cement and building materials.' },
    { name: 'DTDC Express Limited', logo: 'https://tinyurl.com/2jtc6hyd', description: 'Leading logistics and supply chain solutions provider.' },
  ];

  const testimonials = [
    {
      quote: 'Manoneit Solutions helped me land my dream job in just two weeks!',
      author: 'Amit Raj',
      role: 'Product Manager',
      rating: 5,
    },
    {
      quote: 'The team was incredibly supportive throughout the hiring process.',
      author: 'Mr. Sunny Srivastava',
      role: 'Asst. Manager - Quality',
      rating: 4,
    },
  ];

  // Improved Services
  const services = [
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: 'Manpower Supply',
      desc: 'We source and provide suitable candidates based on your job requirements.',
    },
    {
      icon: <FaFileAlt className="text-3xl text-blue-600" />,
      title: 'Resume Screening & Shortlisting',
      desc: 'We talk to candidates and share only relevant, pre-screened profiles with you.',
    },
    {
      icon: <FaComments className="text-3xl text-blue-600" />,
      title: 'Interview Coordination',
      desc: 'We manage the complete interview process between your team and candidates.',
    },
    {
      icon: <FaHandshake className="text-3xl text-blue-600" />,
      title: 'End-to-End Hiring Support',
      desc: 'From requirement to offer letter — we handle the entire recruitment cycle.',
    },
  ];

  const industries = [
    {
      icon: <FaIndustry className="text-3xl text-blue-600" />,
      title: 'Manufacturing',
      desc: 'Industrial manufacturing, production units and related sectors.',
    },
    {
      icon: <FaBuilding className="text-3xl text-blue-600" />,
      title: 'Construction & Infrastructure',
      desc: 'Construction companies, infrastructure and building materials.',
    },
    {
      icon: <FaCogs className="text-3xl text-blue-600" />,
      title: 'Engineering & EPC',
      desc: 'Engineering, procurement and construction related roles.',
    },
    {
      icon: <FaTruck className="text-3xl text-blue-600" />,
      title: 'Logistics & Supply Chain',
      desc: 'Logistics, warehousing and supply chain operations.',
    },
  ];

  const processSteps = [
    {
      icon: <FaHandshake className="text-2xl text-blue-600" />,
      title: '1. Client Requirement',
      desc: 'Client shares the manpower requirement and open vacancies with us.',
    },
    {
      icon: <FaSearch className="text-2xl text-blue-600" />,
      title: '2. Candidate Sourcing',
      desc: 'We talk to candidates, understand their profile and shortlist suitable ones.',
    },
    {
      icon: <FaFileAlt className="text-2xl text-blue-600" />,
      title: '3. Profile Sharing',
      desc: 'We share a curated list of candidate resumes with the client.',
    },
    {
      icon: <FaUserCheck className="text-2xl text-blue-600" />,
      title: '4. Resume Selection',
      desc: 'Client reviews the profiles and selects the resumes they want to proceed with.',
    },
    {
      icon: <FaComments className="text-2xl text-blue-600" />,
      title: '5. Interview to Offer',
      desc: 'We coordinate the complete process — from interviews to final offer letter — between client and candidate.',
    },
  ];

  const whyChooseUs = [
    {
      title: 'End-to-End Coordination',
      desc: 'From requirement to offer letter — we handle the complete recruitment cycle.',
    },
    {
      title: 'Quality Candidates',
      desc: 'Only relevant and pre-screened profiles are shared with clients.',
    },
    {
      title: 'Trusted by Leading Companies',
      desc: 'Working with reputed organizations across multiple industries.',
    },
    {
      title: 'Transparent Process',
      desc: 'Clear communication and smooth coordination at every step.',
    },
  ];

  const faqs = [
    {
      question: 'How does Manoneit Solutions work with companies?',
      answer:
        'Once a company shares their manpower requirement, we source and talk to suitable candidates, share a curated list of resumes, and then coordinate the entire process from interview to final offer letter.',
    },
    {
      question: 'Do you charge candidates for job placement?',
      answer:
        'No. We do not charge any fees from candidates. Our services are completely free for job seekers.',
    },
    {
      question: 'Which industries do you mainly work with?',
      answer:
        'We work across multiple industries including Manufacturing, Construction, Infrastructure, Engineering, EPC, Logistics and more.',
    },
    {
      question: 'How long does the hiring process usually take?',
      answer:
        'It depends on the role and urgency. In most cases, we start sharing relevant profiles within a few days of receiving the requirement.',
    },
    {
      question: 'Can I apply for multiple jobs at the same time?',
      answer:
        'Yes, candidates can apply for multiple suitable openings. Our team will guide you accordingly.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white">
      {/* ================= HERO (IMPROVED) ================= */}
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-blue-50/70 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-800"
          >
            Recruitment & Manpower Solutions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg md:text-xl mb-6 text-slate-600 max-w-3xl mx-auto"
          >
            We help companies find the right candidates and coordinate the complete hiring process — from resume shortlisting to final offer letter.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base text-slate-500 mb-10"
          >
            Trusted by leading companies across Manufacturing, Infrastructure, Engineering & more.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              Explore Opportunities
            </Link>
            <Link
              to={user && ['admin', 'client'].includes(user.role) ? '/post-job' : '/signup'}
              className="bg-white text-blue-600 border border-blue-200 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              Hire Top Talent
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <FaUsers />, number: '50+', label: 'Client Partners' },
              { icon: <FaBriefcase />, number: '1000+', label: 'Placements' },
              { icon: <FaChartLine />, number: '95%', label: 'Success Rate' },
              { icon: <FaRocket />, number: '8+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-blue-600 text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DUAL PATH ================= */}
      <section className="py-16 bg-blue-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              How Can We Help You?
            </h2>
            <p className="text-gray-600">Choose the path that fits you best</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5">
                <FaBuildingIcon className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">For Companies</h3>
              <p className="text-gray-600 mb-6">
                Looking for quality manpower? Share your requirement and we will provide pre-screened candidates and coordinate till final offer.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> End-to-end recruitment support
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> Pre-screened candidate profiles
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> Interview to offer coordination
                </li>
              </ul>
              <Link
                to={user && ['admin', 'client'].includes(user.role) ? '/post-job' : '/signup'}
                className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Hire Talent
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5">
                <FaUserGraduate className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">For Candidates</h3>
              <p className="text-gray-600 mb-6">
                Looking for the right job opportunity? Explore openings from reputed companies and get free career support.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> Free job placement support
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> Opportunities in top companies
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" /> Guidance till final selection
                </li>
              </ul>
              <Link
                to="/jobs"
                className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Find Jobs
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES (IMPROVED) ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete recruitment support designed around your actual hiring needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-blue-50/50 p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-blue-100"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INDUSTRIES ================= */}
      <section className="py-20 bg-blue-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Industries We Serve</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Delivering quality talent across multiple industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{industry.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{industry.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW WE WORK ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">How We Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A clear and transparent process from requirement to final offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-blue-50/50 p-6 rounded-2xl shadow-sm border border-blue-100 text-center"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section className="py-16 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Our Trusted Partners
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Proud to work with leading companies across multiple industries.
          </p>

          <Slider {...clientSliderSettings}>
            {clients.map((client, index) => (
              <div key={index} className="px-4">
                <div
                  className="h-28 flex items-center justify-center bg-white rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setModalClient(client)}
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-16 max-w-[140px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-sm text-center px-3">
                      {client.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {modalClient && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalClient(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {modalClient.logo && (
                <img
                  src={modalClient.logo}
                  alt={modalClient.name}
                  className="w-24 h-24 mx-auto mb-4 object-contain"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 text-center">{modalClient.name}</h3>
              <p className="text-gray-600 text-center mt-2 text-sm">{modalClient.description}</p>
              <button
                onClick={() => setModalClient(null)}
                className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-full w-full hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= FEATURED JOBS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Featured Opportunities
            </h2>
            <p className="text-gray-600">Handpicked roles from our client partners</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  whileHover={{ y: -5 }}
                  className="bg-blue-50/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-blue-100"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        job.image ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXoHHxo7rwXNehFmlUwFBaDRJrg1rSqEQyEQ&s'
                      }
                      alt={job.jobTitle}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {job.jobTitle}
                      </h3>
                      <p className="text-gray-500 text-sm">{job.company}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600 mb-5">
                    <p>
                      <span className="font-medium">Location:</span> {job.location}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {job.jobType}
                    </p>
                    <p>
                      <span className="font-medium">Salary:</span>{' '}
                      {job.salary ? `₹${job.salary.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewDetails(job._id)}
                    disabled={applyLoading[job._id]}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {applyLoading[job._id] ? 'Loading...' : 'View Details'}
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No active opportunities at the moment.
              </p>
            )}
          </div>

          <div className="text-center mt-10">
            <Link to="/jobs" className="inline-block text-blue-600 font-medium hover:underline">
              View All Opportunities →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 bg-blue-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Why Choose Manoneit Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We go beyond traditional recruitment to become a true hiring partner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-blue-100"
              >
                <div className="flex items-center mb-3">
                  <FaCheckCircle className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Everything you need to know about working with us</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-blue-100 rounded-xl overflow-hidden bg-blue-50/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-800 hover:bg-blue-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <FaChevronDown
                    className={`text-blue-600 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Success Stories
          </h2>

          <Slider {...testimonialSliderSettings}>
            {testimonials.map((t, index) => (
              <div key={index} className="px-4">
                <div className="bg-white rounded-2xl p-7 border border-blue-100 h-full">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < t.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-center mb-5 text-sm leading-relaxed">
                    "{t.quote}"
                  </p>
                  <p className="font-semibold text-gray-800 text-center">{t.author}</p>
                  <p className="text-gray-500 text-sm text-center">{t.role}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ================= QUICK ENQUIRY FORM ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              Have a hiring requirement or looking for a job? Send us a message.
            </p>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="company">Company / Employer</option>
                  <option value="candidate">Job Seeker</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows="4"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your requirement or query..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Enquiry
            </button>

            {formStatus && (
              <p className="text-center text-green-600 font-medium">{formStatus}</p>
            )}
          </form>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your team?
          </h2>
          <p className="text-blue-50 mb-8 text-lg">
            Partner with Manoneit Solutions and get access to pre-screened, high-quality talent.
          </p>
          <Link
            to={user && ['admin', 'client'].includes(user.role) ? '/post-job' : '/signup'}
            className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;