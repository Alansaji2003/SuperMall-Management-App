// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy2UF2sGwZzj29GaasgobpOmkeqkIfB2M",
  authDomain: "shopping-mall-web-application.firebaseapp.com",
  projectId: "shopping-mall-web-application",
  storageBucket: "shopping-mall-web-application.appspot.com",
  messagingSenderId: "218468871127",
  appId: "1:218468871127:web:b1352ac2a2a97b3141f992",
  measurementId: "G-F6S9L6F67Q"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db };