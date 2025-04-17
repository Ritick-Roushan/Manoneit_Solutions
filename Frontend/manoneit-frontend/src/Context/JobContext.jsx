import { createContext, useState } from 'react';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-Time',
      category: 'Engineering',
      description: 'Develop and maintain web applications.',
      salary: '$100,000 - $120,000',
      image: 'https://images.unsplash.com/photo-1516321310764-8d9c54860779?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovate Inc.',
      location: 'New York, NY',
      type: 'Full-Time',
      category: 'Management',
      description: 'Lead product development and strategy.',
      salary: '$120,000 - $150,000',
      image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'DataSolutions',
      location: 'San Francisco, CA',
      type: 'Contract',
      category: 'Data',
      description: 'Analyze data and provide insights.',
      salary: '$80,000 - $100,000',
      image: 'https://images.unsplash.com/photo-1551288049-b1f3a0c3f3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
  ]);

  const [closedJobs, setClosedJobs] = useState([]);

  const addJob = (job) => {
    setJobs((prev) => [
      ...prev,
      {
        ...job,
        id: prev.length + 1,
        image: job.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
    ]);
  };

  const moveToClosed = (id) => {
    const jobToClose = jobs.find((job) => job.id === id);
    if (jobToClose) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      setClosedJobs((prev) => {
        const updated = [jobToClose, ...prev];
        return updated.slice(0, 10); // Limit to 10 jobs
      });
    }
  };

  return (
    <JobContext.Provider value={{ jobs, closedJobs, addJob, moveToClosed }}>
      {children}
    </JobContext.Provider>
  );
};