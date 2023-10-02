// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, getReactNativePersistence, initializeAuth} from 'firebase/auth';
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  REACT_APP_API_KEY, 
  REACT_APP_AUTH_DOMAIN, 
  REACT_APP_PROJECT_ID, 
  REACT_APP_STORAGE_BUCKET, 
  REACT_APP_MESSAGE_ID, 
  REACT_APP_APP_ID 
} from '@env';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGE_ID,
  appId: REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);

// const auth = getAuth(app);
const db = getFirestore(app);

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
    // Perform any additional actions after logout if needed
    
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


export {auth, db, storage};
