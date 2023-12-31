import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBIEnvAR4FU3S-_U0kbZ_5-Ey8FdbOldvo",
  authDomain: "project-repository-2b4f1.firebaseapp.com",
  projectId: "project-repository-2b4f1",
  storageBucket: "project-repository-2b4f1.appspot.com",
  messagingSenderId: "618415178892",
  appId: "1:618415178892:web:d13c5fe58bfef60e6d67a9",
  measurementId: "G-X9LEXPZP3J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const firestore = getFirestore(app);
const storage = getStorage(app);

const userRef = collection(firestore, "users");

const createUser = (collectionName, data) => {
  return firestore.collection(collectionName).add(data);
};

const readUser = (collectionName, userData) => {
  return firestore.collection(collectionName).doc(userData).get();
};

const updateUser = (collectionName, userId, newData) => {
  return firestore.collection(collectionName).doc(userId).update(newData);
}

const deleteData = (collectionName, userId) =>{
  return 	firestore.collection(collectionName).doc(userId).delete() ;
}


export {
  createUser,
  readUser,
  updateUser,
  deleteData,
  signInWithEmailAndPassword,
  signOut,
  firestore,
  auth
};

export default storage;