import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignUp from './components/auth/SignUp.jsx';
import Login from './components/auth/Login.jsx';
import ErrorPage from './Error-page.jsx';
import Layout from './components/dashboard/Layout.jsx';
import Shops from './components/dashboard/Shops.jsx'; 
import ShopDetails from './components/dashboard/ShopDetails.jsx'; 
import AllProducts from './components/dashboard/AllProducts.jsx';
import AllShops from './components/dashboard/AllShops.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        path: "shops",
        element: <AllShops />,
      },
      {
        path: "shops/:categoryId",
        element: <Shops />,
        children: [
          {
            path: "details/:shopId",
            element: <ShopDetails />,
          },
        ],
      },
      {
        path: "products",
        element: <AllProducts />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
