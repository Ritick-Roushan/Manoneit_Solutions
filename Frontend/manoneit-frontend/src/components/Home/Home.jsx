import { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { JobContext } from '../../Context/JobContext';
import { FaArrowUp, FaStar } from 'react-icons/fa';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Simulated auth
const isAuthenticated = true;
const userRole = 'admin';

const Home = () => {
  const { jobs } = useContext(JobContext);
  const [filter, setFilter] = useState('All');
  const [flippedCard, setFlippedCard] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalClient, setModalClient] = useState(null);
  const [applyLoading, setApplyLoading] = useState({});
  const [init, setInit] = useState(false);

  // Initialize particles
  useEffect(() => {
    loadSlim().then(() => setInit(true));
  }, []);

  // Particle config
  const particlesConfig = useMemo(
    () => ({
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#3B82F6', '#9333EA'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    }),
    []
  );

  // Filtered jobs
  const filteredJobs =
    filter === 'All'
      ? jobs.slice(0, 3)
      : jobs.filter((job) => job.category === filter).slice(0, 3);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle quick apply
  const handleQuickApply = (id) => {
    setApplyLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setApplyLoading((prev) => ({ ...prev, [id]: false }));
      window.location.href = '/apply';
    }, 1000);
  };

  const clientSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
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
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  const clients = [
    {
      name: 'TechCorp',
      logo: 'https://images.unsplash.com/photo-1611162617213-7d15a376f562?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      description: 'Leading tech solutions provider.',
    },
    {
      name: 'Innovate Inc.',
      logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      description: 'Innovative product development.',
    },
    {
      name: 'DataSolutions',
      logo: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      description: 'Data-driven insights.',
    },
    {
      name: 'GlobalTech',
      logo: 'https://images.unsplash.com/photo-1516321310764-8d9c54860779?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      description: 'Global technology leader.',
    },
  ];

  const testimonials = [
    {
      quote: 'Manoneit Solutions helped me land my dream job at TechCorp in just two weeks!',
      author: 'Jane Doe',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
    },
    {
      quote: 'The team was incredibly supportive throughout the hiring process.',
      author: 'John Smith',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 4,
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-32 text-white overflow-hidden">
        {init && (
          <Particles
            id="tsparticles"
            options={particlesConfig}
            className="particles-bg"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 z-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Launch Your Career, Hire Top Talent
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gray-100 max-w-3xl mx-auto"
          >
            Manoneit Solutions connects passionate professionals with innovative companies for the perfect career match.
          </motion.p>
          <div className="flex justify-center gap-6 flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass rounded-xl p-6 max-w-sm text-left"
            >
              <h3 className="text-xl font-semibold mb-2">For Candidates</h3>
              <p className="text-gray-200 mb-4">
                Discover exciting opportunities and apply with confidence to roles that match your skills and passion.
              </p>
              <Link
                to="/jobs"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transform transition-all duration-300 cta-bounce"
              >
                Discover Your Dream Job
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass rounded-xl p-6 max-w-sm text-left"
            >
              <h3 className="text-xl font-semibold mb-2">For Clients</h3>
              <p className="text-gray-200 mb-4">
                Find pre-screened, top-tier talent to fill your open positions quickly and efficiently.
              </p>
              <Link
                to={isAuthenticated && userRole === 'admin' ? '/post-job' : '/signup'}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 cta-bounce"
              >
                Hire Top Talent
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Featured Opportunities
          </motion.h2>
          <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
            {['All', 'Engineering', 'Management', 'Data', 'Design', 'Marketing'].map(
              (category) => (
                <motion.button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 tooltip ${
                    filter === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  data-tooltip={`Filter by ${category}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              )
            )}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl glass cursor-pointer"
                onClick={() => setFlippedCard(flippedCard === job.id ? null : job.id)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  {flippedCard === job.id ? (
                    <motion.div
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -180, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{job.salary}</p>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickApply(job.id);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all duration-300"
                        disabled={applyLoading[job.id]}
                      >
                        {applyLoading[job.id] ? 'Applying...' : 'Quick Apply'}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ rotateY: -180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 180, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={job.image}
                          alt={job.title}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                      <p className="text-gray-500 text-sm mb-4">{job.type}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickApply(job.id);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all duration-300"
                        disabled={applyLoading[job.id]}
                      >
                        {applyLoading[job.id] ? 'Applying...' : 'Quick Apply'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link
              to="/jobs"
              className="text-blue-600 hover:underline font-medium"
            >
              View All Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Our Trusted Partners
          </motion.h2>
          <Slider {...clientSliderSettings}>
            {clients.map((client, index) => (
              <motion.div
                key={index}
                className="px-4 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setModalClient(client)}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="mx-auto h-20 object-contain"
                />
              </motion.div>
            ))}
          </Slider>
        </div>
        {/* Client Modal */}
        {modalClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setModalClient(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full glass"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalClient.logo}
                alt={modalClient.name}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-bold text-gray-800 text-center">
                {modalClient.name}
              </h3>
              <p className="text-gray-600 text-center">
                {modalClient.description}
              </p>
              <button
                onClick={() => setModalClient(null)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full w-full hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Success Stories
          </motion.h2>
          <Slider {...testimonialSliderSettings}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="px-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-blue-500 glass">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <p className="text-gray-600 italic mb-4 text-sm line-clamp-2">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-semibold text-gray-800">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="scroll-to-top"
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