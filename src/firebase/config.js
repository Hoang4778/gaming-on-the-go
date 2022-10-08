import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8Z8VlARJ5rhMWQPvFHbWQw-lH3bUJQ0E",
  authDomain: "gaming-on-the-go.firebaseapp.com",
  projectId: "gaming-on-the-go",
  storageBucket: "gaming-on-the-go.appspot.com",
  messagingSenderId: "568814412776",
  appId: "1:568814412776:web:92a6836d318f09386c7a5d",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
