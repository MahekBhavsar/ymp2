import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function register(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const role = email.toLowerCase() === 'admin@foursisters.com' ? 'admin' : 'customer';

    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      phone: '',
      addresses: [],
      wishlist: [],
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return result;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setIsAdmin(data.role === 'admin');
          } else {
            setUserData(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserData(null);
          setIsAdmin(false);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    isAdmin,
    loading,
    register,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
