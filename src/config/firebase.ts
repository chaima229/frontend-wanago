
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDb-kdobgyf6A71MJvbkhPTOSYYXBwDcOA",
  authDomain: "reservation-93215.firebaseapp.com",
  projectId: "reservation-93215",
  storageBucket: "reservation-93215.firebasestorage.app",
  messagingSenderId: "33787360643",
  appId: "1:33787360643:web:2cbba7a0910aad22fb72b6",
  measurementId: "G-BQY1F5EZBQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
