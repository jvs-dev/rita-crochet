import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

function formatDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; // Os meses em JavaScript são indexados de 0 a 11
    let year = date.getFullYear() % 100; // Pega os dois últimos dígitos do ano

    // Adiciona zero à esquerda se o dia ou mês tiverem apenas um dígito
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;

    return `${day}/${month}/${year}`;
}

export async function addInRoute(paymentData, userData, paymentId) {
    console.log(paymentData, userData);
    const routeRef = doc(db, "payments", `${paymentId}`);
    await updateDoc(routeRef, {
        inRoute: true
    });
    await setDoc(doc(db, "inRoute", `${paymentId}`), {
        email: `${userData.email}`,
        totalAmount: paymentData.totalAmount,
        items: paymentData.items,
        address: `${userData.address}`,
        cep: `${userData.cep}`,
        cpf: `${userData.cpf}`,
        name: `${userData.name}`,
        phone: `${userData.phone}`,
        street: `${userData.street}`,
        status: "Saiu da loja",
        date: formatDate()
    });
}

export async function getInRoute(id) {
    return new Promise(async (resolve) => {
        const docRef = doc(db, "inRoute", `${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data())
        } else {
            resolve("No such document!")
        }
    })
}

export async function getInRouteByEmail(email) {
    return new Promise(async (resolve) => {
        let response = []
        const q = query(collection(db, "inRoute"), where("email", "==", `${email}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            response.push([doc.data(), doc.id])
        });
        resolve(response)
    })
}