import { firebaseConfig } from "../functions/firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { verifyUserLogin } from "../functions/userAuth";
import { productDataAndImgs } from "../functions/productData";
import { calcTotal } from "../functions/calcCartValue";
import { buyThisProducts } from "../functions/buyProducts";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

let body = document.querySelector("body")
let mobileViewCart = document.getElementById("mobileViewCart")
let closeCart = document.getElementById("closeCart")
let viewCartBtn = document.getElementById("viewCartBtn")
let viewCart = document.getElementById("viewCart")
let loadCartItemsDiv = document.getElementById("loadCartItemsDiv")
let cartTotalPriceSpan = document.getElementById("cartTotalPriceSpan")
let cartFinalizeBuy = document.getElementById("cartFinalizeBuy")
let selectedsArr = []

mobileViewCart.onclick = function () {
    viewCart.classList.add("active")
    body.style.overflow = "hidden"
}

viewCartBtn.onclick = function () {
    viewCart.classList.add("active")
}
closeCart.onclick = function () {
    viewCart.classList.remove("active")
    body.style.overflow = ""
}

export async function verifyItemInCart(userEmail, itemId) {
    return new Promise(async (resolve) => {
        let docRef = doc(db, "users", `${userEmail}`, `cart`, `${itemId}`);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data())
        } else {
            resolve(undefined)
        }
    })
}

export async function addToCart(itemId, itemQuanty) {
    return new Promise(async (resolve) => {
        verifyUserLogin().then(async (userDoc) => {
            if (userDoc != undefined) {
                verifyItemInCart(userDoc.email, itemId).then(async (res) => {
                    if (res == undefined) {
                        await setDoc(doc(db, "users", `${userDoc.email}`, `cart`, `${itemId}`), {
                            id: `${itemId}`,
                            quanty: itemQuanty
                        }).then(() => {
                            loadCart()
                        });
                        resolve("added")
                    } else {
                        let cartRef = doc(db, "users", `${userDoc.email}`, `cart`, `${itemId}`);
                        await updateDoc(cartRef, {
                            quanty: increment(itemQuanty)
                        });
                        resolve("added")
                    }
                })
            }
        })
    })
}

export function alterCartQuanty(itemId, itemQuanty) {
    return new Promise(async (resolve) => {
        verifyUserLogin().then(async (userDoc) => {
            if (userDoc != undefined) {
                await setDoc(doc(db, "users", `${userDoc.email}`, `cart`, `${itemId}`), {
                    id: `${itemId}`,
                    quanty: itemQuanty
                });
                resolve("added")
            }
        })
    })
}

export async function removeToCart(itemId) {
    verifyUserLogin().then(async (userDoc) => {
        if (userDoc != undefined) {
            await deleteDoc(doc(db, "users", `${userDoc.email}`, `cart`, `${itemId}`)).then(() => {
                loadCart()
            });
        }
    })
}

export function loadCart() {
    verifyUserLogin().then(async (userDoc) => {
        if (userDoc != undefined) {
            loadCartItemsDiv.innerHTML = ""
            let querySnapshot = await getDocs(collection(db, "users", `${userDoc.email}`, `cart`));
            querySnapshot.forEach((doc) => {
                productDataAndImgs(doc.data().id).then(productDataRes => {
                    let starsAdded = 0
                    function activeStar() {
                        if (starsAdded < productDataRes.data.stars) {
                            starsAdded++
                            return `active`
                        } else {
                            return ``
                        }
                    }
                    let article = document.createElement("article")
                    loadCartItemsDiv.insertAdjacentElement("beforeend", article)
                    article.classList.add("cardCart")
                    article.innerHTML = `
                        <div class="cardCart__div--1">
                            <img class="cardCart__img" src="${productDataRes.images[0]}" alt="">
                            <div class="cardCart__div--2">
                                <div class="cardCart__div--3">
                                    <p class="cardCart__note">${productDataRes.data.stars}.0</p>
                                    <div class="cardCart__starsDiv">
                                        <ion-icon name="star" class="cardCart__star ${activeStar()}"></ion-icon>
                                        <ion-icon name="star" class="cardCart__star ${activeStar()}"></ion-icon>
                                        <ion-icon name="star" class="cardCart__star ${activeStar()}"></ion-icon>
                                        <ion-icon name="star" class="cardCart__star ${activeStar()}"></ion-icon>
                                        <ion-icon name="star" class="cardCart__star ${activeStar()}"></ion-icon>
                                    </div>
                                </div>
                                <p class="cardCart__name">${productDataRes.data.name}</p>
                                <p class="cardCart__price">$${productDataRes.data.price}</p>
                            </div>
                            <label class="cl-checkbox">
                              
                              <span></span>
                            </label>
                        </div>
                        <div class="cardCart__div--4">                            
                            <p class="cardCart__quanty">Unidades:</p>                            
                        </div>`
                    let selectItem = document.createElement("input")
                    let input = document.createElement("input")
                    let deleteCartItem = document.createElement("button")
                    article.children[0].children[2].insertAdjacentElement("afterbegin", selectItem)
                    article.children[1].insertAdjacentElement("beforeend", input)
                    article.children[1].insertAdjacentElement("afterbegin", deleteCartItem)
                    selectItem.type = "checkbox"
                    if (selectedsArr.some(objeto => objeto.id === doc.data().id)) {
                        if (selectedsArr.find(objeto => objeto.id === doc.data().id)) {
                            if (selectedsArr.find(objeto => objeto.id === doc.data().id).select == true) {
                                selectItem.checked = true
                            }
                        }
                    } else {
                        selectedsArr.push({ price: productDataRes.data.price, id: doc.data().id, quanty: Number(doc.data().quanty), select: true })
                        selectItem.checked = true
                    }
                    cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                    deleteCartItem.classList.add("cardCart__delete")
                    deleteCartItem.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`
                    input.classList.add("cardCart__quantyInput")
                    input.type = "number"
                    input.value = doc.data().quanty
                    input.oninput = function () {
                        if (input.value != 0) {
                            alterCartQuanty(doc.data().id, input.value)
                            let objetoParaEditar = selectedsArr.find(objeto => objeto.id === doc.data().id);
                            if (objetoParaEditar) {
                                objetoParaEditar.quanty = input.value;
                                cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                            }
                        } else {
                            removeToCart(doc.data().id)
                            selectedsArr = selectedsArr.filter(objeto => objeto.id !== doc.data().id);
                            cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                        }
                    }
                    deleteCartItem.onclick = function () {
                        removeToCart(doc.data().id)
                        selectedsArr = selectedsArr.filter(objeto => objeto.id !== doc.data().id);
                        cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                    }
                    selectItem.onclick = function () {
                        if (selectItem.checked == true) {
                            let objetoParaEditar = selectedsArr.find(objeto => objeto.id === doc.data().id);
                            if (objetoParaEditar) {
                                objetoParaEditar.select = true
                                cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                            }
                        } else {
                            let objetoParaEditar = selectedsArr.find(objeto => objeto.id === doc.data().id);
                            if (objetoParaEditar) {
                                objetoParaEditar.select = false
                                cartTotalPriceSpan.textContent = `R$${calcTotal(selectedsArr)}`
                            }
                        }
                    }
                    cartFinalizeBuy.onclick = function () {
                        buyThisProducts(selectedsArr)
                    }
                })
            });
        }
    })
}