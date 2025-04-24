import { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { JobContext } from '../../Context/JobContext';
import { AuthContext } from '../../Context/AuthContext';
import { FaArrowUp, FaStar } from 'react-icons/fa';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const { jobs, closedJobs, loading, error } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  const [flippedCard, setFlippedCard] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalClient, setModalClient] = useState(null);
  const [applyLoading, setApplyLoading] = useState({});
  const [particlesInit, setParticlesInit] = useState(false);

  // Debug jobs
  useEffect(() => {
    console.log('Jobs data (Home.jsx):', { jobs, closedJobs });
    console.log('Featured jobs:', jobs.filter((job) => job.status === 'active').slice(0, 3));
    console.log('Closed jobs:', closedJobs);
    console.log('Loading:', loading, 'Error:', error);
  }, [jobs, closedJobs, loading, error]);

  // Initialize particles
  const initParticles = async (engine) => {
    try {
      await loadSlim(engine);
      setParticlesInit(true);
    } catch (err) {
      console.error('Particles failed to load:', err);
    }
  };

  // Featured jobs (only active)
  const featuredJobs = (jobs || [])
    .filter((job) => job.status === 'active')
    .slice(0, 3);

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
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setApplyLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setApplyLoading((prev) => ({ ...prev, [id]: false }));
      window.location.href = `/apply/${id}`;
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
      logo: 'data:image/jpeg;base64,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',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-gray-600 text-lg">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-32 text-white overflow-hidden">
        {particlesInit && (
          <Particles
            id="tsparticles"
            init={initParticles}
            options={{
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
            }}
            className="absolute inset-0 z-0"
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
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-sm text-left"
            >
              <h3 className="text-xl font-semibold mb-2">For Candidates</h3>
              <p className="text-gray-200 mb-4">
                Discover exciting opportunities and apply with confidence to roles that match your skills and passion.
              </p>
              <Link
                to="/jobs"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
              >
                Discover Your Dream Job
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-sm text-left"
            >
              <h3 className="text-xl font-semibold mb-2">For Clients</h3>
              <p className="text-gray-200 mb-4">
                Find pre-screened, top-tier talent to fill your open positions quickly and efficiently.
              </p>
              <Link
                to={user && ['admin', 'client'].includes(user.role) ? '/post-job' : '/signup'}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => setFlippedCard(flippedCard === job._id ? null : job._id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
                    {flippedCard === job._id ? (
                      <motion.div
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -180, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 p-6 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {job.jobTitle}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}
                          </p>
                          <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickApply(job._id);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                          disabled={applyLoading[job._id]}
                        >
                          {applyLoading[job._id] ? 'Applying...' : 'Quick Apply'}
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
                            src={job.image || 'https://via.placeholder.com/48'}
                            alt={job.jobTitle}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {job.jobTitle}
                            </h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                        <p className="text-gray-500 text-sm mb-4">{job.jobType}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickApply(job._id);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                          disabled={applyLoading[job._id]}
                        >
                          {applyLoading[job._id] ? 'Applying...' : 'Quick Apply'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No active jobs found.</p>
            )}
          </motion.div>
          <div className="text-center mt-8">
            <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
              View All Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Closed Jobs Section */}
      {/* <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Recently Closed Jobs
          </motion.h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading closed jobs...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : closedJobs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {closedJobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={job.image || 'https://via.placeholder.com/48'}
                      alt={job.jobTitle}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{job.jobTitle}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                  <p className="text-gray-500 text-sm mb-4">{job.jobType}</p>
                  <p className="text-red-500 text-sm font-medium mb-4">
                    Closed on {new Date(job.updatedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-600 col-span-full">No recently closed jobs.</p>
          )}
        </div>
      </section> */}

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
              className="bg-white rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalClient.logo}
                alt={modalClient.name}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-bold text-gray-800 text-center">{modalClient.name}</h3>
              <p className="text-gray-600 text-center">{modalClient.description}</p>
              <button
                onClick={() => setModalClient(null)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full w-full hover:bg-blue-700 transition-colors duration-300"
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
                <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-blue-500">
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
                        className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="font-semibold text-gray-800">{testimonial.author}</p>
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
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
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