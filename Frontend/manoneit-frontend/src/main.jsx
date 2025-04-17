import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { JobProvider } from './Context/JobContext.jsx';
import App from './App.jsx';
import './index.css';
import Home from './components/Home/Home.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Jobs from './Job.jsx';
import PostJob from './Postjob.jsx';

// Simulated auth (replace with real auth)
const isAdminLoggedIn = true;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/jobs',
        element: <Jobs />,
      },
      {
        path: '/post-job',
        element: isAdminLoggedIn ? <PostJob /> : <Login />,
      },
      {
        path: '/apply',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Apply Page</h1>
        </div>,
      },
      {
        path: '/clients',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Clients Page</h1>
        </div>,
      },
      {
        path: '/contact',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Contact Page</h1>
        </div>,
      },
      {
        path: '/candidate/dashboard',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
        </div>,
      },
      {
        path: '/company/dashboard',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Company Dashboard</h1>
        </div>,
      },
      {
        path: '/admin/dashboard',
        element: <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JobProvider>
      <RouterProvider router={router} />
    </JobProvider>
  </React.StrictMode>
);



// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<Layout />}>
//       <Route path='' element={<Home />} />
//       <Route path='/Login' element={<Login />} />
//       <Route path='/Signup' element={<Signup />} />
//     </Route>
//   )
// )