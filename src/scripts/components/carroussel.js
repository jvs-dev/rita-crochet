import { firebaseConfig } from "../functions/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

let homeCarroussel = document.getElementById("homeCarroussel")
let lastScrollLeft = 0
let direction = 1

setInterval(() => {
    homeCarroussel.scrollLeft = homeCarroussel.scrollLeft + (1 * direction)
    if (homeCarroussel.scrollLeft == lastScrollLeft) {
        setTimeout(() => {
            direction = -1
        }, 1000);
    }
    if (homeCarroussel.scrollLeft == 0) {
        setTimeout(() => {
            direction = 1
        }, 1000);
    }
    lastScrollLeft = homeCarroussel.scrollLeft
}, 20);



async function loadAnuncy() {
    const q = query(collection(db, "Products"), where("anuncy", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        getDownloadURL(ref(storage, `products/${doc.id}/anuncy/image`))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                let homeCarroussel = document.getElementById("homeCarroussel")
                let article = document.createElement("article")
                homeCarroussel.insertAdjacentElement("beforeend", article)
                article.classList.add("carroussel__cardAnuncy")
                article.innerHTML = `
                <img
                    src="${url}"
                    alt="" class="cardAnuncy__img">
                <div class="cardAnuncy__div">
                    <p class="cardAnuncy__title">${doc.data().name}</p>
                    <div class="cardAnuncy__div--2">
                        <p class="cardAnuncy__p">AVALIADO EM ${doc.data().stars} ESTRELAS</p>
                        <button class="cardAnuncy__viewMore">VER MAIS</button>
                    </div>
                </div>`
            })
    });
}

loadAnuncy()