import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JobContext } from './Context/JobContext';

// Simulated auth
const userRole = 'admin';

const Jobs = () => {
  const { jobs, closedJobs, moveToClosed } = useContext(JobContext);
  const location = useLocation();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  const filteredJobs = jobs
    .filter((job) =>
      filter === 'All' ? true : job.category === filter
    )
    .filter((job) =>
      searchQuery
        ? [job.title, job.company, job.location].some((field) =>
            field.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true
    );

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to close "${title}"? It will be moved to Recently Closed Jobs.`)) {
      moveToClosed(id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', `/jobs?search=${searchQuery}`);
    setSearchQuery(searchQuery);
  };

  return (
    <section id="jobs" className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="flex glass rounded-full overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company, or location..."
              className="flex-1 px-4 py-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Active Jobs Section */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
        >
          Explore Active Jobs
        </motion.h2>
        <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
          {['All', 'Engineering', 'Management', 'Data', 'Design', 'Marketing'].map(
            (category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-blue-500"
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
                <p className="text-gray-500 text-sm mb-2">{job.type}</p>
                <p className="text-gray-500 text-sm mb-2">{job.salary}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    to="/apply"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all duration-300"
                  >
                    Apply Now
                  </Link>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-all duration-300"
                    >
                      Close Job
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No active jobs found.
            </p>
          )}
        </motion.div>

        {/* Recently Closed Jobs Section */}
        {closedJobs.length > 0 && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            >
              Recently Closed Jobs
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {closedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-gray-400 opacity-80"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-12 h-12 rounded-full object-cover mr-4 opacity-60"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-600">
                        {job.title}
                      </h3>
                      <p className="text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                  <p className="text-gray-500 text-sm mb-2">{job.type}</p>
                  <p className="text-gray-500 text-sm mb-2">{job.salary}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  <p className="text-red-500 text-sm font-medium">
                    This job is closed.
                  </p>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Jobs;