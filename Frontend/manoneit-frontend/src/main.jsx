import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { JobProvider } from './Context/JobContext.jsx';
import { AuthProvider, AuthContext } from './Context/AuthContext.jsx';

import App from './App.jsx';
import './index.css';

import Home from './components/Home/Home.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Jobs from './Job.jsx';
import JobDetail from './components/JobDetail.jsx';
import PostJob from './Postjob.jsx';
import Profile from './pages/personalinformation.jsx';
import ChangePassword from './pages/changepassword.jsx';
import ApplyJob from './pages/apply.jsx';
import UserDashboard from './pages/candidate.dashboard.jsx';
import CompanyDashboard from './pages/company.dashboard.jsx';
import AdminDashboard from './pages/admin.dashboard.jsx';
import JobApplicants from './pages/jobapplicant.jsx';
import AdminReview from './pages/approve.job.jsx';

// Placeholder Page
const Page = ({ title }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
  </div>
);

// 🔒 Protected Route
const ProtectedRoute = ({ allowedRoles, redirectPath = '/jobs', children }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return null; // Show nothing or a loader while checking auth

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
        Back to Jobs
      </a>
    </div>
  </div>
);

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/jobs/:id', element: <JobDetail /> },
      { path: '/apply/:jobId', element: <ApplyJob /> },

      { path: '/clients', element: <Page title="Clients Page" /> },
      { path: '/contact', element: <Page title="Contact Page" /> },
     // {path:"/jobs/:jobId/applicants", element: <JobApplicants /> },

      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'client', 'candidate']}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/change-password',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'client', 'candidate']}>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/post-job',
        element: (
          <ProtectedRoute allowedRoles={['company', 'admin']}>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['candidate']}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/company-dashboard',
        element: (
          <ProtectedRoute allowedRoles={['client']}>
            <CompanyDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/jobs/:jobId/applicants',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <JobApplicants />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-review',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReview />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);

// Render App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <JobProvider>
        <RouterProvider router={router} />
      </JobProvider>
    </AuthProvider>
  </React.StrictMode>
);
