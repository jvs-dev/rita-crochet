import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where, addDoc, updateDoc, increment, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { verifyUserLogin } from "./userAuth";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export async function verifyAllPayments() {
    return new Promise(async (resolve) => {
        let response = []
        const q = query(collection(db, "payments"), where("paymentStatus", "!=", ``));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {            
            response.push([doc.data(), doc.id])
        });
        resolve(response)
    })
}