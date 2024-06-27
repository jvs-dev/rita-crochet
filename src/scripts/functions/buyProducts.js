import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { verifyUserLogin } from "./userAuth";
import { productDataAndImgs } from "./productData";
import { calcTotal } from "./calcCartValue";
import QRCode from 'qrcode';
import { activeLoading1, desactiveLoading1 } from "./loading1";
import { createNotify } from "./createNotify";
import { getUserDoc } from "./UserData";
import { completeUserData } from "../components/completeUserData";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
let confirmPay = document.getElementById("confirmPay")
let paymentSection = document.getElementById("paymentSection")
let copyPay = document.getElementById("copyPay")
let copyPayText = document.getElementById("copyPayText")
let paymentQRCode = document.getElementById("paymentQRCode")

copyPay.addEventListener("click", function () {
    let tempTextArea = document.createElement("textarea");
    tempTextArea.value = copyPayText.innerText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
});

confirmPay.onclick = function () {
    paymentSection.style.opacity = "0"
    setTimeout(() => {
        paymentSection.style.display = "none"
    }, 500);
}

export async function getPay(paymentId) {
    return new Promise(resolve => {
        let requestBody = {
            payId: `${paymentId}`,
        };
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        fetch('http://localhost:3000/api/getpay', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                resolve(data)
            })
    })
}

async function createPay(email, value) {
    return new Promise(resolve => {
        let requestBody = {
            payerEmail: `${email}`,
            value: `${value}`
        };
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        fetch('http://localhost:3000/api/createpay', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                resolve(data)
            })
    })
}

async function generateQRCode(text) {
    return new Promise(async (resolve) => {
        try {
            const qrCodeImage = await QRCode.toDataURL(text);
            resolve(qrCodeImage)
        } catch (error) {
            resolve('error')
        }
    })
}

export async function buyThisProducts(selectedsArr) {
    let newItemsArray = []
    let viewCart = document.getElementById("viewCart")
    let viewNotifys = document.getElementById("viewNotifys")
    let body = document.querySelector("body")
    viewCart.classList.remove("active")
    viewNotifys.classList.remove("active")
    body.style.overflow = ""
    activeLoading1()
    verifyUserLogin().then(async (user) => {
        if (user != undefined) {
            getUserDoc(user.email).then(async (userData) => {
                if (userData.address == "" || userData.cpf == "" || userData.phone == "" || userData.cep == "" || userData.street == "") {                    
                    completeUserData(user.email, userData, selectedsArr)
                    desactiveLoading1()
                } else {
                    selectedsArr.forEach(element => {
                        if (element.select == true) {
                            newItemsArray.push(element)
                        }
                    });
                    createPay(`${user.email}`, calcTotal(selectedsArr)).then(async (payRes) => {
                        let docRef = await addDoc(collection(db, "payments"), {
                            payerEmail: `${user.email}`,
                            paymentStatus: "pending",
                            totalAmount: calcTotal(selectedsArr),
                            items: newItemsArray,
                            paymentId: payRes.result.id,
                            inRoute: false
                        });
                        copyPayText.textContent = `${payRes.result.point_of_interaction.transaction_data.qr_code}`
                        generateQRCode(payRes.result.point_of_interaction.transaction_data.qr_code).then((qrCodeLink) => {
                            paymentQRCode.src = `${qrCodeLink}`
                        })
                        paymentSection.style.display = "flex"
                        setTimeout(() => {
                            paymentSection.style.opacity = "1"
                        }, 1);
                        desactiveLoading1()
                        console.log("Document written with ID: ", docRef.id);
                        console.log(payRes);
                        createNotify(user.email, "Compra pendente", "Faça o pagamento em até 10min para receber seu produto com frete 100% grátis.", false, "red", "pending payment", payRes.result.id)
                    })
                }
            })
        } else {
            /* copyPayText.textContent = `${payRes.result.point_of_interaction.transaction_data.qr_code}`
            generateQRCode(payRes.result.point_of_interaction.transaction_data.qr_code).then((qrCodeLink) => {
                paymentQRCode.src = `${qrCodeLink}`
            })
            paymentSection.style.display = "flex"
            setTimeout(() => {
                paymentSection.style.opacity = "1"
            }, 1);
            desactiveLoading1() */
        }
    })
}

export async function loadPayment(paymentId) {
    return new Promise(resolve => {
        activeLoading1()
        getPay(paymentId).then(payRes => {
            if (payRes.result.status != "cancelled") {
                copyPayText.textContent = `${payRes.result.point_of_interaction.transaction_data.qr_code}`
                generateQRCode(payRes.result.point_of_interaction.transaction_data.qr_code).then((qrCodeLink) => {
                    paymentQRCode.src = `${qrCodeLink}`
                })
                paymentSection.style.display = "flex"
                setTimeout(() => {
                    paymentSection.style.opacity = "1"
                }, 1);
                desactiveLoading1()
                resolve("sucess")
                console.log(payRes.result);
            } else {
                resolve("error")
                desactiveLoading1()
            }
        })
    })
}
