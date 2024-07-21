import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../scripts/firebaseContext';
import Person2Icon from '@mui/icons-material/Person2';

function NavBar(props) {
  const { findRole } = useFirebase();
  const { user, handleSignOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(user);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      const handleClick = () => {
        navigate('/login');
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [user, navigate]);

  useEffect(() => {
    const result = findRole(user?.uid);
    result.then((role) => {
      if (role === 'admin') {
        setIsAdmin(true);
      }
    });
  }, [user?.uid, findRole]);

  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOutClick = () => {
    setDropdownOpen(false);
    handleSignOut();
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
const goToShops = () => {
    navigate('/dashboard/shops');
}
const goToProducts = () => {
    navigate('/dashboard/products');
}

  return (
    
    <div>
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <svg className='w-20 md:w-full' id="logo-16" width="109" height="43" viewBox="0 0 109 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.9315 11.4284C62.1883 8.6852 58.9316 6.5091 55.3475 5.0245C51.7633 3.5399 47.9219 2.7758 44.0424 2.7758C40.1629 2.7758 36.3215 3.5399 32.7373 5.0245C29.1532 6.5091 25.8965 8.6852 23.1533 11.4284L44.0424 32.3174L64.9315 11.4284Z" className="ccompli1" fill="#FFD200"></path>
            <path d="M44.0686 32.3475C46.8118 35.0907 50.0684 37.2667 53.6526 38.7513C57.2367 40.2359 61.0782 41 64.9577 41C68.837 41 72.679 40.2359 76.263 38.7513C79.847 37.2667 83.104 35.0907 85.847 32.3475L64.9577 11.4584L44.0686 32.3475Z" className="ccompli2" fill="#06E07F"></path>
            <path d="M44.017 32.3429C41.2738 35.0861 38.0171 37.2621 34.433 38.7467C30.8488 40.2313 27.0074 40.9954 23.1279 40.9954C19.2484 40.9954 15.407 40.2313 11.8228 38.7467C8.2387 37.2621 4.982 35.0861 2.2388 32.3429L23.1279 11.4538L44.017 32.3429Z" className="ccustom" fill="#E3073C"></path>
            <path d="M64.9831 11.433C67.726 8.6898 70.983 6.5138 74.567 5.0292C78.151 3.5446 81.993 2.7805 85.872 2.7805C89.752 2.7805 93.593 3.5446 97.177 5.0292C100.761 6.5138 104.018 8.6898 106.761 11.433L85.872 32.3221L64.9831 11.433Z" className="ccustom" fill="#1F84EF"></path>
          </svg>
          <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ZapShop</h1>
        </div>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                {user?.photoURL!=null?(<img
                  className="w-8 h-8 rounded-full"
                  src={user.photoURL || user.displayName}
                  alt="user photo"
                />):(<Person2Icon className="w-8 h-8 text-white" />)}
              </button>
              {dropdownOpen && (
                <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 mt-2 w-48" id="user-dropdown">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">{user.displayName}</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    
                    <li>
                      <button
                        onClick={handleSignOutClick}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded border w-50 h-10 border-white px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-gray-900"
            >
              Sign In
            </Link>
          )}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isMenuOpen ? "true" : "false"}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between ${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a onClick={() => navigate('/dashboard')} className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Dashboard</a>
            </li>
            <li>
              <a onClick={goToShops} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Shops</a>
            </li>
            <li>
              <a onClick={goToProducts} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Products</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div className='flex justify-between bg-sky-950 items-center'>
       <div className='p-5'>
       <h1 className="font-bold text-white text-2xl mt-3">{props.greeting}</h1>
        <p className="text-slate-400">Welcome to the ZapShop, {user?.displayName || "guest"}! 🙂</p>
        </div>
        <div>{isAdmin && <h1 className='md:font-bold md:text-lg font-mono p-10 text-orange-400 text-sm'>Admin Mode 👑</h1>}</div>
      </div>
    </div>
  );
}

export default NavBar;
