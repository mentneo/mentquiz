import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, isAdmin = false) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: isAdmin ? 'admin' : 'student',
        createdAt: new Date()
      });
      
      return user;
    } catch (error) {
      console.error("Error in signup function:", error);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      // If not, create a new user document with default role "student"
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: 'student', // Default role
          createdAt: new Date(),
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        });
        console.log("Created new user document for Google sign-in");
      }
      
      return user;
    } catch (error) {
      console.error("Error in Google sign-in:", error);
      throw error;
    }
  }

  async function fetchUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const role = await fetchUserRole(user.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Error in auth state change:", error);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
