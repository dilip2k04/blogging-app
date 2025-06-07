// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyDMirIjQpqxBiVLX2Nl_H6chw-430WIg",
  authDomain: "blog-6c564.firebaseapp.com",
  projectId: "blog-6c564",
  storageBucket: "blog-6c564.appspot.com",
  messagingSenderId: "673419280848",
  appId: "1:673419280848:web:94ca94884797946c1479d5",
  measurementId: "G-39MZ92T0V2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };