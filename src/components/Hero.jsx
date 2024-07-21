import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Hero() {
  const { user, handleSignOut } = useAuth();

  return (
    <section className="relative bg-gray-900 text-white h-screen">
      <div className="absolute top-4 right-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="font-medium">{user.displayName || 'Profile'}</span>
            <button
              onClick={handleSignOut}
              className="rounded border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-gray-900"
          >
            Sign In
          </Link>
        )}
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Introducing an intuitive shopping mall{' '}
            <span className="sm:block"> Management System - ZapShop </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            A simple, easy-to-use, and intuitive shopping mall management system that helps you manage your
            shops, products and offers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/signUp"}
              className="block w-50 rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 md:w-full lg:w-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
