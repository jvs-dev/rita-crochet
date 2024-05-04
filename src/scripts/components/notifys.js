import { firebaseConfig } from "../functions/firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { verifyUserLogin } from "../functions/userAuth";
import { loadPayment } from "../functions/buyProducts";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const viewNotifysBtn = document.getElementById("viewNotifysBtn")
const loadNotifysDiv = document.getElementById("loadNotifysDiv")
const viewNotifys = document.getElementById("viewNotifys")
const closeViewNotifys = document.getElementById("closeViewNotifys")
const mobileViewNotifys = document.getElementById("mobileViewNotifys")
const body = document.querySelector("body")

closeViewNotifys.onclick = function () {
    viewNotifys.classList.remove("active")
    body.style.overflow = ""
}

async function deleteNotify(userEmail, id) {
    await deleteDoc(doc(db, "users", `${userEmail}`, `notifys`, `${id}`)).then(res => {
        loadNotifys()
    });
}

mobileViewNotifys.onclick = function () {
    loadNotifys()
    body.style.overflow = "hidden"
}

viewNotifysBtn.onclick = function () {
    loadNotifys()
}


export function loadNotifys() {
    let notifyMessage = "sem notificações"
    loadNotifysDiv.style.justifyContent = "center"
    loadNotifysDiv.innerHTML = `<div style="--uib-color: var(--dark-yellow);" class="dot-spinner">
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
        <div class="dot-spinner__dot"></div>
      </div>`
    viewNotifys.classList.add("active")
    verifyUserLogin().then(async (user) => {
        if (user != undefined) {
            let querySnapshot = await getDocs(collection(db, "users", `${user.email}`, `notifys`));
            loadNotifysDiv.style.justifyContent = ""
            loadNotifysDiv.innerHTML = ``
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                notifyMessage = "sem mais notificações"
                let article = document.createElement("article")
                let deleteNotifyBtn = document.createElement("button")
                deleteNotifyBtn.classList.add("notifyCard__closeNotify")
                article.classList.add("notifyCard")
                loadNotifysDiv.insertAdjacentElement("beforeend", article)
                article.style.order = `-${doc.data().timestamp.seconds}`
                article.innerHTML = `
                <div class="notifyCard__div--1">
                    <div style="--warning: ${doc.data().color};" class="notifyCard__iconDiv">
                        <ion-icon name="alert-circle-outline"></ion-icon>
                    </div>
                    <p class="notifyCard__date">${doc.data().date}</p>
                    <p class="notifyCard__hours">${doc.data().hours}</p>
                </div>
                <div class="notifyCard__div--2">
                    <p style="--warning: ${doc.data().color};" class="notifyCard__title">${doc.data().title}</p>
                    <p class="notifyCard__description">${doc.data().description}</p>
                </div>`
                article.insertAdjacentElement("beforeend", deleteNotifyBtn)
                deleteNotifyBtn.innerHTML = `<ion-icon name="close-outline"></ion-icon>`
                article.children[1].children[0].onclick = function () {
                    loadPayment(doc.data().paymentCode).then(res => {
                        if (res == "error") {
                            deleteNotify(user.email, doc.id)
                        }
                    })
                }
                deleteNotifyBtn.onclick = function () {
                    deleteNotify(user.email, doc.id)
                }
            });
            loadNotifysDiv.insertAdjacentHTML("beforeend", `<p class="loadNotifysDiv__noMoreNotifys">${notifyMessage}</p>`)
        }
    })
}
