
// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('accessToken') || null);

//   const loginWithToken = (accessToken, userData) => {
//     setToken(accessToken);
//     setUser(userData);
//     localStorage.setItem('accessToken', accessToken);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('accessToken');
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   // Restore session on page load
//   useEffect(() => {
//     const storedToken = localStorage.getItem('accessToken');
//     if (storedToken) {
//       axios
//         .get('http://localhost:8000/api/v1/users/get-user-stats', {
//           headers: { Authorization: `Bearer ${storedToken}` },
//           withCredentials: true,
//         })
//         .then((response) => {
//           setUser(response.data.data.user);
//           setToken(storedToken);
//           axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//         })
//         .catch(() => {
//           logout();
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, token, loginWithToken, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          fullname: decoded.fullname,
          role: decoded.role,
          email: decoded.email,
          _id: decoded._id,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        logout(); // If the token is invalid, log the user out
      }
    }
  }, [token]);

  const loginWithToken = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      setUser({
        fullname: decoded.fullname,
        role: decoded.role,
        email: decoded.email,
        _id: decoded._id,
      });
    } catch (error) {
      console.error('Failed to decode token during login:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



