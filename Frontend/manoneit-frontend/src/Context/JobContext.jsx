import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:8000/api/v1/users/getAllJobs', {
        headers,
      });
      console.log('Fetched jobs response:', response.data);
      const jobData = response.data.data || response.data || [];
      if (!Array.isArray(jobData)) {
        throw new Error('Invalid job data format');
      }
      setJobs(jobData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to fetch jobs');
      setJobs([]);
      setLoading(false);
    }
  };

  const addJob = async (job) => {
    try {
      if (!token) throw new Error('No token available');
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/createJob',
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Added job:', response.data.data);
      setJobs((prev) => [...prev, response.data.data]);
      return response.data.data;
    } catch (error) {
      console.error('Error adding job:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const moveToClosed = async (jobId) => {
    try {
      if (!token) throw new Error('No token available');
      const response = await axios.patch(
        `http://localhost:8000/api/v1/users/closeJob/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Closed job:', response.data.data);
      // Update job status to 'closed'
      setJobs((prev) => {
        const updatedJobs = prev.map((job) =>
          job._id === jobId ? { ...job, status: 'closed' } : job
        );
        console.log('Updated jobs state:', updatedJobs); // Debug
        return updatedJobs;
      });
      return response.data.data;
    } catch (error) {
      console.error('Error closing job:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
  };

  const deleteJob = async (jobId) => {
    try {
      if (!token) throw new Error('No token available');
      await axios.delete(`http://localhost:8000/api/v1/users/deleteJob/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Deleted job:', jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, moveToClosed, deleteJob, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};