import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { JobContext } from './Context/JobContext';
import { AuthContext } from './Context/AuthContext';
import { FaArrowUp } from 'react-icons/fa';

const Jobs = () => {
  const navigate = useNavigate();
  const { jobs, closedJobs, loading, error, moveToClosed, deleteJob } = useContext(JobContext);
  const { user } = useContext(AuthContext);

  const [flippedCard, setFlippedCard] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [applyLoading, setApplyLoading] = useState({});
  const [closeLoading, setCloseLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleQuickApply = (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setApplyLoading((prev) => ({ ...prev, [id]: false }));
      navigate(`/apply/${id}`);
    }, 1000);
  };

  const handleCloseJob = async (id) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can close jobs');
      return;
    }
    setCloseLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await moveToClosed(id);
      setCloseLoading((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error('Failed to close job:', error.message);
      alert('Failed to close job');
      setCloseLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteJob = async (id) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete jobs');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeleteLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteJob(id);
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error('Failed to delete job:', error.message);
      alert('Failed to delete job');
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const activeJobs = (jobs || [])
    .filter((job) => job.status === 'active')
    .filter((job) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        job.jobTitle?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
      );
    });

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
    <div className="relative py-16">
      {/* Active Jobs Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Available Jobs
          </motion.h2>

          <div className="mb-8 max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search jobs by title, company, location, or description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
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
                        className="absolute inset-0 p-6 flex flex-col justify-between bg-white rounded-xl"
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
                        <div className="flex gap-2 flex-wrap">
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
                          {user && user.role === 'admin' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseJob(job._id);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-300"
                                disabled={closeLoading[job._id]}
                              >
                                {closeLoading[job._id] ? 'Closing...' : 'Close Job'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteJob(job._id);
                                }}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-300"
                                disabled={deleteLoading[job._id]}
                              >
                                {deleteLoading[job._id] ? 'Deleting...' : 'Delete Job'}
                              </button>
                            </>
                          )}
                        </div>
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
                        <div className="flex gap-2 flex-wrap">
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
                          {user && user.role === 'admin' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseJob(job._id);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-300"
                                disabled={closeLoading[job._id]}
                              >
                                {closeLoading[job._id] ? 'Closing...' : 'Close Job'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteJob(job._id);
                                }}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-300"
                                disabled={deleteLoading[job._id]}
                              >
                                {deleteLoading[job._id] ? 'Deleting...' : 'Delete Job'}
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                {searchQuery ? 'No jobs match your search.' : 'No active jobs found.'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Recently Closed Jobs */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Recently Closed Jobs
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {closedJobs.length > 0 ? (
              closedJobs.map((job) => (
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
                  {user && user.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-300"
                      disabled={deleteLoading[job._id]}
                    >
                      {deleteLoading[job._id] ? 'Deleting...' : 'Delete Job'}
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No recently closed jobs.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
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

export default Jobs;
