import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export function verifyUserLogin() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        resolve(user)
      } else {
        resolve(undefined)
      }
    });
  })
}

export function signIn() {
  return new Promise(resolve => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        resolve(user)
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        resolve(undefined)
      });
  })
}

export function signOutUser() {
  return new Promise(resolve => {
    signOut(auth).then(() => {
      resolve("sucess")
    }).catch((error) => {
      resolve("error")
    });
  })
}