import { useState, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom'; // ✅ Combined import
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      experience: '',
      currentSalary: '',
      expectedSalary: '',
      currentCompany: '',
    },
  });

  const onSubmit = async (data) => {
    if (!resume) {
      setError('Resume is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('jobId', jobId);
    formDataToSend.append('name', data.name);
    formDataToSend.append('email', data.email);
    formDataToSend.append('phone', data.phone);
    formDataToSend.append('experience', data.experience);
    formDataToSend.append('currentSalary', data.currentSalary);
    formDataToSend.append('expectedSalary', data.expectedSalary);
    formDataToSend.append('currentCompany', data.currentCompany);
    formDataToSend.append('resume', resume);

    try {
      setError(null);
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/submit-resume',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log('Response:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError(null);
    } else {
      setError('Please upload a PDF file');
      setResume(null);
    }
  };

  if (!user || user.role !== 'candidate') {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for Job</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email',
                },
              })}
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register('phone')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              {...register('experience')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Salary</label>
            <input
              {...register('currentSalary')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
            <input
              {...register('expectedSalary')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Company</label>
            <input
              {...register('currentCompany')}
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 w-full"
            />
            {error && error.includes('PDF') && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;






// import { useState, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../Context/AuthContext';

// const ApplyJob = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const { user, token } = useContext(AuthContext);
//   const [resume, setResume] = useState(null);
//   const [error, setError] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: '',
//       email: '',
//       phone: '',
//       experience: '',
//       currentSalary: '',
//       expectedSalary: '',
//       currentCompany: '',
//     },
//   });

//   const onSubmit = async (data) => {
//     if (!resume) {
//       setError('Resume is required');
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append('jobId', jobId);
//     formDataToSend.append('name', data.name);
//     formDataToSend.append('email', data.email);
//     formDataToSend.append('phone', data.phone);
//     formDataToSend.append('experience', data.experience);
//     formDataToSend.append('currentSalary', data.currentSalary);
//     formDataToSend.append('expectedSalary', data.expectedSalary);
//     formDataToSend.append('currentCompany', data.currentCompany);
//     formDataToSend.append('resume', resume);

//     console.log('FormData entries:');
//     for (let [key, value] of formDataToSend.entries()) {
//       console.log(`  ${key}: ${value instanceof File ? value.name : value}`);
//     }

//     try {
//       setError(null);
//       const response = await axios.post(
//         'http://localhost:8000/api/v1/users/submit-resume',
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//       console.log('Response:', response.data);
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Error submitting application:', error.response?.data || error.message);
//       setError(error.response?.data?.message || 'Failed to submit application');
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       setResume(file);
//       setError(null);
//     } else {
//       setError('Please upload a PDF file');
//       setResume(null);
//     }
//   };

//   if (!user || user.role !== 'candidate') {
//     return <Navigate to="/jobs" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for Job</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               {...register('name', { required: 'Name is required' })}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               {...register('email', {
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                   message: 'Invalid email',
//                 },
//               })}
//               type="email"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone</label>
//             <input
//               {...register('phone')}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
//             <input
//               {...register('experience')}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Current Salary</label>
//             <input
//               {...register('currentSalary')}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
//             <input
//               {...register('expectedSalary')}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Current Company</label>
//             <input
//               {...register('currentCompany')}
//               type="text"
//               className="mt-1 w-full px-4 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileChange}
//               className="mt-1 w-full"
//             />
//             {error && error.includes('PDF') && <p className="text-red-500 text-sm">{error}</p>}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
//           >
//             Submit Application
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplyJob;