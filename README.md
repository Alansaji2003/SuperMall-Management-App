# SuperMall Management System

SuperMall Management System is a web application designed to facilitate merchants in rural towns to advertise and sell their products globally. The system provides a platform for users to explore various shops, products, and offers while allowing administrators to manage the entire platform.

## Technologies Used

- **React**: Front-end library for building user interfaces.
- **Firebase**: Backend-as-a-Service for database and authentication.
- **Vite**: Next-generation front-end tool for faster builds.
- **Vercel**: Hosting platform for the application.

## Features

### User Features

- View Categories of Shops
- View Shops
- View Shop Details
- View Products
- View Product Details
- View Offer Details

### Admin Features

- CRUD (Create, Read, Update, Delete) operations on:
  - Categories
  - Shops
  - Shop Details
  - Products
  - Product Details
  - Offers

## User Roles and Privileges

- **User**: Can browse the platform and view various categories, shops, products, and offers.
- **Admin**: Has complete control over the platform with the ability to manage all categories, shops, products, and offers.

## Getting Started

### Prerequisites

- Node.js
- Firebase account
- Vercel account

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Alansaji2003/SuperMall-Management-App.git
    cd SuperMall-management-App
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up Firebase:

   - Create a new Firebase project.
   - Set up Firestore and Authentication.
   - Add your Firebase configuration to the project.

4. Set up environment variables:
   - Go to scripts/firebaseConfig.js
   - Add your Firebase configuration details there.

    ```env
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
    ```

5. Start the development server:
    ```sh
    npm run dev
    ```

6. Deploy to Vercel:
    - Connect your repository to Vercel.
    - Set up your project and environment variables on Vercel.
    - Deploy your project.

## Working Flow

1. **User Registration and Login**: Users can sign up and log in using Firebase Authentication.
2. **User Role Assignment**: By default, users have the role `user`. If a user's role is set to `admin` in the database, they gain administrative privileges.
3. **Browsing**: Users can browse through categories, shops, shop details, products, product details, and offers.
4. **Admin Privileges**: Admins can perform CRUD operations on categories, shops, shop details, products, product details, and offers.

## Demo Gif

![Alt text](https://alansaji-portfolio.netlify.app/assets/img/proj28.gif)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.



## Contact

For any inquiries or feedback, please reach out to rockstaralansaji@gmail.com

