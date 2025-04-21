import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [closedJobsLoading, setClosedJobsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/jobs/getAllJobs', {
        withCredentials: true,
      });
      setJobs(response.data.data || []);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching jobs:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to fetch jobs';
      setError(errorMsg);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchJobs();
        }, retryDelay);
      }
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchClosedJobs = async () => {
    setClosedJobsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/jobs/getClosedJobs', {
        withCredentials: true,
      });
      setClosedJobs(response.data.data || []);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching closed jobs:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to fetch closed jobs';
      setError(errorMsg);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchClosedJobs();
        }, retryDelay);
      }
    } finally {
      setClosedJobsLoading(false);
    }
  };

  const moveToClosed = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/users/jobs/closeJob/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          withCredentials: true,
        }
      );
      const updatedJob = response.data.data;
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === id ? { ...job, status: 'closed', updatedAt: updatedJob.updatedAt } : job))
      );
      setClosedJobs((prev) => {
        const existingIndex = prev.findIndex((job) => job._id === id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = updatedJob;
          return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        return [updatedJob, ...prev.slice(0, 9)].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    } catch (err) {
      console.error('Error closing job:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to close job');
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/users/jobs/deleteJob/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true,
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      setClosedJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete job');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchClosedJobs();
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        closedJobs,
        jobsLoading,
        closedJobsLoading,
        error,
        moveToClosed,
        deleteJob,
        fetchJobs,
        fetchClosedJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};