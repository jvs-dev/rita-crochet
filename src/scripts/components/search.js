import { firebaseConfig } from "../functions/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { addToCart } from "./cart.js";
import { verifyUserLogin } from "../functions/userAuth.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();
let searchInput = document.getElementById("searchInput")
let homeSection = document.getElementById("homeSection")
let homeSearchSection = document.getElementById("homeSearchSection")
let typingTimer;
let doneTypingInterval = 1000;

async function loadProducts(searchText) {
    homeSearchSection.innerHTML = ``
    const q = query(collection(db, "Products"), where("name", "!=", ""));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().name.toLowerCase().includes(`${searchText.toLowerCase()}`)) {
            getDownloadURL(ref(storage, `products/${doc.id}/images/image1`))
                .then((url) => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                        const blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
                    let article = document.createElement("article")
                    homeSearchSection.insertAdjacentElement("beforeend", article)
                    article.classList.add("productCard")
                    article.innerHTML = `
                    <img class="productCard__img"
                        src="${url}"
                        alt="">
                    <p class="productCard__title">${doc.data().name}</p>
                    <div class="productCard__div">
                        <div class="productCard__div--2">
                        <p class="productCard__category">${doc.data().category}</p>
                        <p class="productCard__p">MAIS DE 10 VENDIDOS</p>
                        </div>                        
                    </div>`
                    let cardAddCartBtn = document.createElement("button")
                    article.children[2].insertAdjacentElement("beforeend", cardAddCartBtn)
                    cardAddCartBtn.classList.add("productCard__addCart")
                    cardAddCartBtn.innerHTML = `<ion-icon name="cart-outline"
                    class="productCard__addCartIcon"></ion-icon>`
                    cardAddCartBtn.onclick = function (evt) {
                        evt.stopPropagation()
                        verifyUserLogin().then(async (userDoc) => {
                            if (userDoc != undefined) {
                                cardAddCartBtn.style.pointerEvents = "none"
                                cardAddCartBtn.innerHTML = `<ion-icon class="productCard__addCartIcon" name="checkmark-outline"></ion-icon>`
                                cardAddCartBtn.style.background = "var(--green)"
                                cardAddCartBtn.style.color = "var(--white)"
                                addToCart(doc.id, 1).then(added => {
                                    setTimeout(() => {
                                        cardAddCartBtn.innerHTML = `<ion-icon name="cart-outline" class="productCard__addCartIcon"></ion-icon>`
                                        cardAddCartBtn.style.pointerEvents = ""
                                        cardAddCartBtn.style.background = ""
                                        cardAddCartBtn.style.color = ""
                                    }, 1000);
                                })
                            } else {
                                cardAddCartBtn.style.pointerEvents = "none"
                                cardAddCartBtn.innerHTML = `<ion-icon class="productCard__addCartIcon" name="close-circle-outline"></ion-icon>`
                                cardAddCartBtn.style.background = "var(--red)"
                                cardAddCartBtn.style.color = "var(--white)"
                                setTimeout(() => {
                                    cardAddCartBtn.innerHTML = `<ion-icon name="cart-outline" class="productCard__addCartIcon"></ion-icon>`
                                    cardAddCartBtn.style.pointerEvents = ""
                                    cardAddCartBtn.style.background = ""
                                    cardAddCartBtn.style.color = ""
                                }, 1000);
                            }
                        })
                    }
                    article.onclick = function () {
                        window.location.href = `${window.location.origin}?productId=${doc.id}`
                    }
                })
        }
    });
}

searchInput.addEventListener('input', (evt) => {
    if (evt.target.value != "") {
        homeSection.children[2].style.display = "none"
        homeSection.children[3].style.display = "none"
        homeSection.children[4].style.display = "none"
        homeSearchSection.style.display = "flex"
        homeSearchSection.innerHTML = `
            <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
            </div>`
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        if (evt.target.value != "") {
            homeSection.children[2].style.display = "none"
            homeSection.children[3].style.display = "none"
            homeSection.children[4].style.display = "none"
            homeSearchSection.style.display = "flex"
            loadProducts(evt.target.value)
        } else {
            homeSection.children[2].style.display = ""
            homeSection.children[3].style.display = ""
            homeSection.children[4].style.display = ""
            homeSearchSection.style.display = ""
        }
    }, doneTypingInterval);
});