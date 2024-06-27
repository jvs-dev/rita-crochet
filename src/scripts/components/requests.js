import { getUserDoc } from "../functions/UserData"
import { cancelPurchase } from "../functions/cancelPurchase"
import { createNotify } from "../functions/createNotify"
import { addInRoute, getInRoute } from "../functions/inRoute"
import { productDataAndImgs } from "../functions/productData"
import { verifyUserLogin } from "../functions/userAuth"
import { verifyAllPayments } from "../functions/verifyPay"
let requestSection = document.getElementById("requestSection")

function loadRequests() {
    requestSection.innerHTML = ""
    verifyUserLogin().then(async (user) => {
        if (user != undefined) {
            getUserDoc(user.email).then(actualUserData => {
                if (actualUserData.admin == true) {
                    verifyAllPayments().then(allPayments => {
                        allPayments.forEach(payment => {
                            if (payment[0].paymentStatus == "approved") {
                                getUserDoc(payment[0].payerEmail).then(userData => {
                                    console.log(payment);
                                    console.log(userData);
                                    let card = document.createElement("article")
                                    requestSection.insertAdjacentElement("beforeend", card)
                                    card.classList.add("requestCard")
                                    card.innerHTML = `
                                <ion-icon class="requestCard__moreInfo" name="ellipsis-vertical-outline"></ion-icon>
                                <div class="requestCard__div--1">                                    
                                    <div class="requestCard__div--2">
                                    <p class="requestCard__userName">${userData.name}</p>
                                    <p class="requestCard__userEmail">${userData.email}</p>
                                    <p class="requestCard__address">${userData.street}, ${userData.address}, ${userData.cep}.</p>
                                    <p class="requestCard__tell">${userData.phone}</p>
                                    </div>
                                </div>
                                <p class="requestCard__p">COMPRADOS:</p>
                                <div class="requestCard__div--3">
                                    
                                </div>
                                <div class="requestCard__div--5">
                                    
                                </div>`
                                    payment[0].items.forEach(item => {
                                        productDataAndImgs(item.id).then(itemData => {
                                            card.children[3].insertAdjacentHTML("beforeend", `
                                    <div class="requestCard__div--4">
                                        <img src="${itemData.images[0]}" alt="" class="requestCard__itemImg">
                                        <p class="requestCard__itemName">${itemData.data.name}</p>
                                        <p class="requestCard__itemSize">Tamanho: M</p>
                                        <p class="requestCard__quanty">Quantidade: ${item.quanty}</p>
                                    </div>
                                    `)
                                        })
                                    });
                                    if (payment[0].inRoute == false) {
                                        let recuseBtn = document.createElement("button")
                                        let deliveredBtn = document.createElement("button")
                                        recuseBtn.textContent = "FAZER REEMBOLSO"
                                        deliveredBtn.textContent = "ITENS A CAMINHO"
                                        recuseBtn.classList.add("requestCard__btn")
                                        recuseBtn.classList.add("btn--recuse")
                                        deliveredBtn.classList.add("requestCard__btn")
                                        deliveredBtn.classList.add("btn--accept")
                                        card.children[4].insertAdjacentElement("beforeend", recuseBtn)
                                        card.children[4].insertAdjacentElement("beforeend", deliveredBtn)
                                        recuseBtn.onclick = function () {
                                            cancelPurchase(payment[1]).then(res => {
                                                createNotify(userData.email, "Compra cancelada", "Sua compra foi cancelada pelo vendedor. Mas você recebera o reembolso em até 3 dias úteis.", false, "red", "Purchase canceled", "")
                                                card.parentNode.removeChild(card);
                                            })
                                        }
                                        deliveredBtn.onclick = function () {
                                            addInRoute(payment[0], userData, payment[1]).then(res => {
                                                createNotify(userData.email, "Itens a caminho", `Todos os itens da compra ${payment[1]} já estão a caminho`, false, "green", "Itens in route", "")
                                                loadRequests()
                                            })
                                        }
                                    } else {
                                        getInRoute(payment[1]).then(res => {
                                            card.children[4].insertAdjacentHTML("beforeend", `
                                            <div class="requestCard__inRoute__div">
                                                <div class="requestCard__inRoute__div--2">
                                                    <lord-icon class="requestCard__inRoute__icon" src="https://cdn.lordicon.com/zzjjvkam.json" trigger="hover" colors="primary:#1f1f1f,secondary:#1f1f1f"></lord-icon>
                                                </div>
                                                <p class="requestCard__inRoute__description">${res.status}</p>                                        
                                                <p class="requestCard__inRoute__date">${res.date}</p>
                                            </div>
                                        `)
                                        })
                                    }
                                })

                            }
                        })
                    })
                }
            })
        }
    })
}
loadRequests()