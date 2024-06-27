import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export async function getUserDoc(userEmail) {
    return new Promise(async resolve => {
        const docRef = doc(db, "users", `${userEmail}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data())
        } else {
            resolve(undefined)
        }
    })
}

export async function createUser(userEmail, userName) {
    return new Promise(async resolve => {
        await setDoc(doc(db, `users`, `${userEmail}`), {
            email: `${userEmail}`,
            name: `${userName}`,
            phone: ``,
            address: ``,
            street: ``,
            cpf: ``,
            cep: ``,
        });
        resolve("created")
    })
}

export async function editUserData(userEmail, name, cep, cpf, tel, address, street) {
    return new Promise(async resolve => {
        const washingtonRef = doc(db, "users", `${userEmail}`);        
        await updateDoc(washingtonRef, {
            email: `${userEmail}`,
            name: `${name}`,
            phone: `${tel}`,
            address: `${address}`,
            street: `${street}`,
            cpf: `${cpf}`,
            cep: `${cep}`,
        });        
        resolve("edited")
    })
}

/* const docRef = await addDoc(collection(db, "users", `${userEmail}`, `cart`), {
            name: "Tokyo",
            country: "Japan"
        }); */
/* const docRef = await addDoc(collection(db, "users", `${userEmail}`, `notifys`), {
    name: "Tokyo",
    country: "Japan"
}); */
