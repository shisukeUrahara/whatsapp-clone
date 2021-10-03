import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "<apiKey>",
  authDomain: "<authDomain>",
  projectId: "<projectId>",
  storageBucket: "<storageBucket>",
  messagingSenderId: "<messagingSenderId>",
  appId: "<appId>",
  measurementId: "<measurementId>",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// accessing and using the firestore
const db = app.firestore();
const storage = firebase.storage();
const auth = firebase.auth(app);
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, provider, auth };
