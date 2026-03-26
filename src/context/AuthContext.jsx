import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import API from '../services/firebase-api';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify token and get profile from backend
          const token = await firebaseUser.getIdToken(true); // Force refresh to ensure valid
          const response = await API.post('/auth/verify', { token });
          const backendUser = response.data.user;

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || backendUser?.name,
            photoURL: firebaseUser.photoURL,
            role: backendUser?.role || 'customer',
          });
        } catch (err) {
          console.error('Error fetching backend profile:', err);
          // Fallback to basic Firebase user if backend is down
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'customer',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register with email and password
  const register = async (email, password, displayName, role = 'customer') => {
    setError(null);
    try {
      let result;
      try {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        // If the email is already in use (e.g. from an interrupted previous registration attempt)
        if (err.code === 'auth/email-already-in-use') {
          try {
            // Try to log them in with the password they provided instead
            result = await signInWithEmailAndPassword(auth, email, password);
          } catch (loginErr) {
            throw new Error('This email is already registered. If you signed up with Google, use Google Sign-In.');
          }
        } else {
          throw err;
        }
      }
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Sync with MongoDB backend (updates role if it was interrupted before)
      const token = await result.user.getIdToken();
      const response = await API.post('/auth/register-firebase', { 
        name: displayName, 
        email, 
        role 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const backendUser = response.data.user;

      setUser({
        id: result.user.uid,
        email: result.user.email,
        displayName: displayName || result.user.displayName,
        photoURL: result.user.photoURL,
        role: backendUser?.role || role,
      });

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch backend profile immediately to return it
      const token = await result.user.getIdToken();
      const response = await API.post('/auth/verify', { token });
      const backendUser = response.data.user;

      const fullUser = {
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || backendUser?.name,
        photoURL: result.user.photoURL,
        role: backendUser?.role || 'customer',
      };

      setUser(fullUser);
      return fullUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get ID Token for API requests
  const getIdToken = async () => {
    if (user) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getIdToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
