import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "../Components/Login";
import Loading from "../Components/Loading";
import { useEffect } from "react";
import firebase from "firebase/compat/app";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          id: user.uid,
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login></Login>;
  } else {
    return <Component {...pageProps} />;
  }
}

export default MyApp;
