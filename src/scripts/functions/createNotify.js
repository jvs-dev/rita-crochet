import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { verifyUserLogin } from "./userAuth";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export async function createNotify(userEmail, title, description, forAdmin, color, category, paymentCode) {
    let actualDate = new Date();        
    let docRef = await addDoc(collection(db, "users", `${userEmail}`, "notifys"), {
        title: `${title}`,
        description: `${description}`,
        forAdmin: forAdmin,
        color: `${color}`,
        category: `${category}`,
        date: `${`${actualDate.getDate()}`.length == 1 ? `0${actualDate.getDate()}` : `${actualDate.getDate()}`}/${`${actualDate.getMonth() + 1}`.length == 1 ? `0${actualDate.getMonth() + 1}` : `${actualDate.getMonth() + 1}`}`,
        hours: `${`${actualDate.getHours()}`.length == 1 ? `0${actualDate.getHours()}` : `${actualDate.getHours()}`}:${`${actualDate.getMinutes()}`.length == 1 ? `0${actualDate.getMinutes()}` : `${actualDate.getMinutes()}`}`,
        paymentCode: `${paymentCode}`,
        timestamp: serverTimestamp()
    });
}