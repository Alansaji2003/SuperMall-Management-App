import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../scripts/firebaseConfig';
import { collection, addDoc, getDocs,query,where,  serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { db } from '../../scripts/firebaseConfig';


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const handleEmailPassSignUp = async (e) => {
    setDisabled(true);
    e.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setDisabled(false);
      return;
    }
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: `${fname} ${lname}`,
      });
  
      // Check if the email already exists in the 'users' collection
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Email does not exist, add the user to the 'users' collection
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: `${fname} ${lname}`,
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        setError('Email already exists in the database');
        setDisabled(false);
      }
  
      navigate('/dashboard');
      setDisabled(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setDisabled(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setDisabled(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the email already exists in the 'users' collection
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Email does not exist, add the user to the 'users' collection
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        setError('Email already exists in the database');
        setDisabled(false);
      }
      
      navigate('/dashboard');
      setDisabled(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setDisabled(false);
    }
  };

  return (
    <div>
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://plus.unsplash.com/premium_photo-1687572821942-d6f30f6b125d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <a className="block text-blue-600" href="#">
                <span className="sr-only">Home</span>
              </a>

              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to ZapShop 🔫
              </h1>

              <p className="mt-4 leading-relaxed text-gray-900">
                Sign up to get started with ZapShop. 🚀
              </p>

              <form className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleEmailPassSignUp}>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    onChange={(e) => setFname(e.target.value)}
                    type="text"
                    id="FirstName"
                    name="first_name"
                    className="mt-1 w-full rounded-sm border bg-white text-sm text-gray-700 shadow-sm h-7"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    onChange={(e) => setLname(e.target.value)}
                    type="text"
                    id="LastName"
                    name="last_name"
                    className="mt-1 w-full rounded-sm border bg-white text-sm text-gray-700 shadow-sm h-7"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="Email"
                    name="email"
                    className="mt-1 w-full rounded-sm border bg-white text-sm text-gray-700 shadow-sm h-7"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="Password"
                    name="password"
                    className="mt-1 w-full rounded-sm border bg-white text-sm text-gray-700 shadow-sm h-7"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
                    Password Confirmation
                  </label>

                  <input
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    type="password"
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    className="mt-1 w-full rounded-sm border bg-white text-sm text-gray-700 shadow-sm h-7"
                  />
                </div>

                <div className="col-span-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <img
                      src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                      alt="Google logo"
                      className="h-5 w-5 mr-2"
                    />
                    Signup with Google
                  </button>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                  disabled={disabled}
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  >
                    Create an account
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <a href="/login" className="text-gray-700 underline">Log in</a>.
                  </p>
                </div>

                {error && <div className="col-span-6 text-red-500 text-sm mt-2">{error}</div>}
              </form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
