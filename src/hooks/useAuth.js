import { useState, useEffect } from 'react';
import { auth } from '../scripts/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';



export const useAuth = () => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, handleSignOut };
};
