import { firebaseConfig } from "../scripts/functions/firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadString, uploadBytes } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { activeLoading1, desactiveLoading1 } from "./functions/loading1";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

let step = 1
let stepscompletes = []
let createItemImage1 = document.getElementById("createItemImage1")
let createItemImage2 = document.getElementById("createItemImage2")
let createItemImage3 = document.getElementById("createItemImage3")
let createItemPreview1 = document.getElementById("createItemPreview1")
let createItemPreview2 = document.getElementById("createItemPreview2")
let createItemPreview3 = document.getElementById("createItemPreview3")
let createItemContinue = document.getElementById("createItemContinue")
let createItemStep1 = document.getElementById("createItemStep1")
let createItemStep2 = document.getElementById("createItemStep2")
let createItemStep3 = document.getElementById("createItemStep3")
let createItemLine1 = document.getElementById("createItemLine1")
let createItemLine2 = document.getElementById("createItemLine2")
let divCreateItemStep1 = document.getElementById("divCreateItemStep1")
let divCreateItemStep2 = document.getElementById("divCreateItemStep2")
let divCreateItemStep3 = document.getElementById("divCreateItemStep3")
let createItemStepTitle = document.getElementById("createItemStepTitle")
let CreateAnuncyFile = document.getElementById("CreateAnuncyFile")
let CreateAnuncyPreviewText = document.getElementById("CreateAnuncyPreviewText")
let CreateAnuncyPreviewImage = document.getElementById("CreateAnuncyPreviewImage")
let createItemName = document.getElementById("createItemName")
let createItemPrice = document.getElementById("createItemPrice")
let createItemCategory = document.getElementById("createItemCategory")

createItemName.oninput = function () {
    if (createItemName.value != "" && createItemPrice.value != "" && createItemCategory.value != "") {
        createItemContinue.classList.add("active")
    }
}
createItemPrice.oninput = function () {
    if (createItemName.value != "" && createItemPrice.value != "" && createItemCategory.value != "") {
        createItemContinue.classList.add("active")
    }
}
createItemCategory.oninput = function () {
    if (createItemName.value != "" && createItemPrice.value != "" && createItemCategory.value != "") {
        createItemContinue.classList.add("active")
    }
}

createItemImage1.onchange = function () {
    if (createItemImage1.files && createItemImage1.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            createItemPreview1.src = e.target.result;
            createItemContinue.classList.add("active")
        }
        reader.readAsDataURL(createItemImage1.files[0]);
    }

}

createItemImage2.onchange = function () {
    if (createItemImage2.files && createItemImage2.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            createItemPreview2.src = e.target.result;
        }
        reader.readAsDataURL(createItemImage2.files[0]);
    }

}

createItemImage3.onchange = function () {
    if (createItemImage3.files && createItemImage3.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            createItemPreview3.src = e.target.result;
        }
        reader.readAsDataURL(createItemImage3.files[0]);
    }

}

createItemContinue.onclick = function () {
    if (step == 1 && createItemPreview1.src != `${window.location.origin}/`) {
        stepscompletes.push(1)
        nextStep()
        createItemContinue.classList.remove("active")
    } else if (step == 2 && createItemName.value != "" && createItemPrice.value != "" && createItemCategory.value != "") {
        stepscompletes.push(2)
        nextStep()
    } else if (step == 3) {
        createProduct()
    }
}

createItemStep1.onclick = function () {
    step = 1
    createItemStep1.classList.add("active")
    createItemStep2.classList.remove("active")
    createItemLine1.classList.remove("active")
    createItemLine2.classList.remove("active")
    createItemStep3.classList.remove("active")
    divCreateItemStep1.style.display = "flex"
    divCreateItemStep2.style.display = "none"
    divCreateItemStep3.style.display = "none"
    createItemStepTitle.textContent = "ADICIONAR IMAGENS"
    createItemContinue.textContent = "CONTINUAR"
}

createItemStep2.onclick = function () {
    stepscompletes.forEach(element => {
        if (element == 1) {
            step = 1
            nextStep()
        }
    });
}

createItemStep3.onclick = function () {
    stepscompletes.forEach(element => {
        if (element == 2) {
            step = 2
            nextStep()
        }
    });
}

function nextStep() {
    if (step == 1) {
        createItemStep1.classList.add("active")
        createItemStep2.classList.add("active")
        createItemLine1.classList.add("active")
        createItemLine2.classList.remove("active")
        createItemStep3.classList.remove("active")
        divCreateItemStep1.style.display = "none"
        divCreateItemStep2.style.display = "flex"
        divCreateItemStep3.style.display = "none"
        createItemStepTitle.textContent = "ADICIONAR DADOS"
        createItemStep1.classList.add("active")
        createItemContinue.textContent = "CONTINUAR"
        step++
    } else if (step == 2) {
        createItemStep1.classList.add("active")
        createItemStep2.classList.add("active")
        createItemLine1.classList.add("active")
        createItemLine2.classList.add("active")
        createItemStep3.classList.add("active")
        divCreateItemStep1.style.display = "none"
        divCreateItemStep2.style.display = "none"
        divCreateItemStep3.style.display = "flex"
        createItemStepTitle.textContent = "ANÚNCIO (Opcional)"
        createItemContinue.textContent = "CRIAR"
        CreateAnuncyFile.onchange = function () {
            if (CreateAnuncyFile.files && CreateAnuncyFile.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    CreateAnuncyPreviewImage.src = e.target.result;
                    CreateAnuncyPreviewText.textContent = `${createItemName.value}`
                }
                reader.readAsDataURL(CreateAnuncyFile.files[0]);
            }

        }
        step++
    }
}


async function createProduct() {
    activeLoading1()
    let loading = 0
    let haveAnuncy = false
    if (CreateAnuncyPreviewImage.src != `${window.location.origin}/`) {
        haveAnuncy = true
    }
    let imagesSelecteds = []
    let i = 1
    if (createItemPreview1.src != `${window.location.origin}/`) {
        imagesSelecteds.push(`${createItemPreview1.src}`)
    }
    if (createItemPreview2.src != `${window.location.origin}/`) {
        imagesSelecteds.push(`${createItemPreview2.src}`)
    }
    if (createItemPreview3.src != `${window.location.origin}/`) {
        imagesSelecteds.push(`${createItemPreview3.src}`)
    }
    let docRef = await addDoc(collection(db, "Products"), {
        name: `${createItemName.value}`,
        category: `${createItemCategory.value}`,
        price: `${createItemPrice.value}`,
        stars: 5,
        photos: imagesSelecteds.length,
        saleOff: 0,
        totalSales: 0,
        anuncy: haveAnuncy
    });
    imagesSelecteds.forEach(file => {
        let storageRef = ref(storage, `products/${docRef.id}/images/image${i}`);
        uploadString(storageRef, file, 'data_url').then((snapshot) => {
            loading = loading + 50
            if (loading == 100) {
                desactiveLoading1()
                clearFields()
            }
        });
        i++
    });
    if (haveAnuncy == true) {
        let storageRef = ref(storage, `products/${docRef.id}/anuncy/image`);
        uploadString(storageRef, CreateAnuncyPreviewImage.src, 'data_url').then((snapshot) => {
            loading = loading + 50
            if (loading == 100) {
                desactiveLoading1()
                clearFields()
            }
        });
    } else {
        loading = loading + 50
        if (loading == 100) {
            desactiveLoading1()
            clearFields()
        }
    }
}

function clearFields() {
    stepscompletes = []
    CreateAnuncyPreviewImage.src = ""
    createItemPreview1.src = ""
    createItemPreview2.src = ""
    createItemPreview3.src = ""
    createItemName.value = ""
    createItemPrice.value = ""
    createItemContinue.classList.remove("active")
    step = 1
    createItemStep1.classList.add("active")
    createItemStep2.classList.remove("active")
    createItemLine1.classList.remove("active")
    createItemLine2.classList.remove("active")
    createItemStep3.classList.remove("active")
    divCreateItemStep1.style.display = "flex"
    divCreateItemStep2.style.display = "none"
    divCreateItemStep3.style.display = "none"
    createItemStepTitle.textContent = "ADICIONAR IMAGENS"
    createItemContinue.textContent = "CONTINUAR"
}