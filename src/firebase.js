// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyBxORxZQkjx7TTd-jqqKu1p5UlfDXRUY",
  authDomain: "ferterliser-distribution.firebaseapp.com",
  projectId: "ferterliser-distribution",
  storageBucket: "ferterliser-distribution.appspot.com",
  messagingSenderId: "420198454131",
  appId: "1:420198454131:web:c387efe1a29fbd80b3eb06",
  measurementId: "G-JLYRP7PE8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);


const uploadImage = async (file) => {
  const storageRef = ref(storage, `shop/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

// Initialize Firebase Authentication and get a reference to the service
export { db, storage, uploadImage };