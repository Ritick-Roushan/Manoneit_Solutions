import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { JobProvider } from './Context/JobContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import { AuthContext } from './Context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';
import Home from './components/Home/Home.jsx';
import Dashboard from './pages/admin.dashboard.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Jobs from './Job.jsx';
import PostJob from './Postjob.jsx';

// Placeholder Page component
const Page = ({ title }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
  </div>
);

// Protected Route for admin-only access
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  console.log('ProtectedRoute check:', { user: user ? { email: user.email, role: user.role } : null });

  if (!user) {
    console.log('Redirecting to /login: User not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('Redirecting to /jobs: User is not admin');
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/jobs', element: <Jobs /> },
      {
        path: '/post-job',
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      { path: '/apply', element: <Page title="Apply Page" /> },
      { path: '/clients', element: <Page title="Clients Page" /> },
      { path: '/contact', element: <Page title="Contact Page" /> },
      { path: '/candidate/dashboard', element: <Page title="Candidate Dashboard" /> },
      { path: '/company/dashboard', element: <Page title="Company Dashboard" /> },
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <JobProvider>
        <RouterProvider router={router} />
      </JobProvider>
    </AuthProvider>
  </React.StrictMode>
);