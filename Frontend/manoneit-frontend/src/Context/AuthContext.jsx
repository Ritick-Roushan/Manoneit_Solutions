
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* ──────────────────────────────────────────────────────────
     1️⃣  Re-hydrate BOTH token *and* user from localStorage
  ─────────────────────────────────────────────────────────── */
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // NEW: read stored user (if any) so the dashboard stays mounted
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  /* ──────────────────────────────────────────────────────────
     2️⃣  When we have a token, decode & validate it, then
         keep user in both React state AND localStorage
  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!token) {
      console.log('AuthContext: No token found');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('AuthContext decoded token:', {
        role: decoded.role,
        email: decoded.email,
      });

      const now = Date.now() / 1000;           // seconds
      if (decoded.exp < now) {
        console.log('AuthContext: Token expired');
        logout();
        return;
      }

      const currentUser = {
        fullname: decoded.fullname,
        role: decoded.role,
        email: decoded.email,
        _id: decoded._id,
      };

      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));   // ⬅ NEW
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  }, [token]);

  /* ──────────────────────────────────────────────────────────
     3️⃣  loginWithToken keeps behaviour, plus persist user
  ─────────────────────────────────────────────────────────── */
  const loginWithToken = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      console.log('AuthContext login decoded token:', {
        role: decoded.role,
        email: decoded.email,
      });

      setToken(accessToken);
      localStorage.setItem('token', accessToken);

      const currentUser = {
        fullname: decoded.fullname,
        role: decoded.role,
        email: decoded.email,
        _id: decoded._id,
      };

      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));   // ⬅ NEW
    } catch (error) {
      console.error('Failed to decode token during login:', error);
    }
  };

  /* ──────────────────────────────────────────────────────────
     4️⃣  logout now clears stored user as well
  ─────────────────────────────────────────────────────────── */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');            // ⬅ NEW
  };

  return (
    <AuthContext.Provider value={{ user, token, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// import { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log('AuthContext decoded token:', { role: decoded.role, email: decoded.email });
//         const now = Date.now() / 1000; // current time in seconds
//         if (decoded.exp < now) {
//           console.log('AuthContext: Token expired');
//           logout(); // automatically logout
//           return;
//         }
//         setUser({
//           fullname: decoded.fullname,
//           role: decoded.role,
//           email: decoded.email,
//           _id: decoded._id,
//         });
//       } catch (error) {
//         console.error('Invalid token:', error);
//         logout();
//       }
//     } else {
//       console.log('AuthContext: No token found');
//     }
//   }, [token]);

//   const loginWithToken = (accessToken) => {
//     try {
//       const decoded = jwtDecode(accessToken);
//       console.log('AuthContext login decoded token:', { role: decoded.role, email: decoded.email });
//       setToken(accessToken);
//       localStorage.setItem('token', accessToken);
//       setUser({
//         fullname: decoded.fullname,
//         role: decoded.role,
//         email: decoded.email,
//         _id: decoded._id,
//       });
//     } catch (error) {
//       console.error('Failed to decode token during login:', error);
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loginWithToken, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



