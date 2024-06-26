import { firebaseConfig } from "./firebaseConfig";
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


export async function productDataAndImgs(id) {
    return new Promise(async (resolve) => {
        let fctRes = {
            data: {},
            images: []
        }
        const docRef = doc(db, "Products", `${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            fctRes.data = docSnap.data()
            for (let index = 1; index <= docSnap.data().photos; index++) {
                getDownloadURL(ref(storage, `products/${id}/images/image${index}`))
                    .then((url) => {
                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            const blob = xhr.response;
                        };
                        xhr.open('GET', url);
                        xhr.send();                        
                        fctRes.images.push(`${url}`)
                        if (index == docSnap.data().photos) {
                            resolve(fctRes)
                        }
                    })
            }            
        } else {
            resolve(undefined)
        }
    })




    const q = query(collection(db, "Products"), where("name", "==", ""));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        getDownloadURL(ref(storage, `products/${doc.id}/images/image1`))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                let loadProductsDiv = document.querySelectorAll(".loadProductsDiv")
                loadProductsDiv.forEach(loadDiv => {
                    let article = document.createElement("article")
                    loadDiv.insertAdjacentElement("beforeend", article)
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
                        <button class="productCard__addCart"><ion-icon name="cart-outline"
                            class="productCard__addCartIcon"></ion-icon></button>
                    </div>`
                    article.onclick = function () {
                        window.location.href = `${window.location.origin}?productId=${doc.id}`
                    }
                });
            })
    });
}