import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjYbdRvsv8RAgETJ8EtlwrCREbHgi0cbc",
  authDomain: "mordern-blogging-platfrom.firebaseapp.com",
  projectId: "mordern-blogging-platfrom",
  storageBucket: "mordern-blogging-platfrom.appspot.com",
  messagingSenderId: "382754188921",
  appId: "1:382754188921:web:32778778ef0d2cf9baeea8",
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
