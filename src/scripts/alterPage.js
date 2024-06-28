import { addToCart } from "./components/cart"
import { getUserDoc } from "./functions/UserData"
import { getInRouteByEmail } from "./functions/inRoute"
import { getPaymentByEmail, getPreparingByEmail } from "./functions/payments"
import { productDataAndImgs } from "./functions/productData"
import { verifyUserLogin } from "./functions/userAuth"

let viewProductSection = document.getElementById("viewProductSection")
let homeSection = document.getElementById("homeSection")
let pageTitle = document.getElementById("pageTitle")
let perfilSection = document.getElementById("perfilSection")
let viewPerfilBtn = document.getElementById("viewPerfilBtn")
let createItemSection = document.getElementById("createItemSection")
let requestSection = document.getElementById("requestSection")
let perfilSctNameInput = document.getElementById("perfilSctNameInput")
let perfilSctTelInput = document.getElementById("perfilSctTelInput")
let perfilSctCPFInput = document.getElementById("perfilSctCPFInput")
let perfilSctCEPInput = document.getElementById("perfilSctCEPInput")
let perfilSctAdressInput = document.getElementById("perfilSctAdressInput")
let perfilSctStreetInput = document.getElementById("perfilSctStreetInput")
let perfilInRoute = document.getElementById("perfil_inRoute")
let perfilPreparing = document.getElementById("perfil_preparing")

function disableAllPages() {
    homeSection.style.display = "none"
    viewProductSection.style.display = "none"
    perfilSection.style.display = "none"
    createItemSection.style.display = "none"
}


window.addEventListener("load", () => {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get('productId');
    if (`${window.location.hash}`.replace("#", "") == "perfil") {
        verifyUserLogin().then(result => {
            if (result != undefined) {
                viewPerfilBtn.children[0].name = "home-outline"
                disableAllPages()
                perfilSection.style.display = "flex"
                pageTitle.textContent = "PERFIL"
                getUserDoc(result.email).then(userData => {
                    perfilSctNameInput.value = `${userData.name}`
                    perfilSctTelInput.value = `${userData.phone}`
                    perfilSctCPFInput.value = `${userData.cpf}`
                    perfilSctCEPInput.value = `${userData.cep}`
                    perfilSctAdressInput.value = `${userData.address}`
                    perfilSctStreetInput.value = `${userData.street}`
                })
                getInRouteByEmail(result.email).then(buyedData => {
                    if (buyedData.length > 0) {
                        perfilInRoute.insertAdjacentHTML("beforeend", `<span class="perfilSection__div__span">${buyedData.length}</span>`)
                    }
                })
                getPreparingByEmail(result.email).then(preparingData => {
                    if (preparingData.length > 0) {
                        perfilPreparing.insertAdjacentHTML("beforeend", `<span class="perfilSection__div__span">${preparingData.length}</span>`)
                    }
                })
                viewPerfilBtn.onclick = function () {
                    window.location.href = `${window.location.origin}`
                }
            } else {
                window.location.href = window.location.origin
            }
        })
    } else if (`${window.location.hash}`.replace("#", "") == "createItem") {
        verifyUserLogin().then(result => {
            if (result != undefined) {
                viewPerfilBtn.children[0].name = "home-outline"
                disableAllPages()
                createItemSection.style.display = "flex"
                pageTitle.textContent = "Criar"
                viewPerfilBtn.onclick = function () {
                    window.location.href = `${window.location.origin}`
                }
            }
        })
    } else if (`${window.location.hash}`.replace("#", "") == "requests") {
        verifyUserLogin().then(result => {
            if (result != undefined) {
                viewPerfilBtn.children[0].name = "home-outline"
                disableAllPages()
                requestSection.style.display = "flex"
                pageTitle.textContent = "Pedidos"
                viewPerfilBtn.onclick = function () {
                    window.location.href = `${window.location.origin}`
                }
            }
        })
    }
    if (productId != null) {
        productDataAndImgs(productId).then(res => {
            let mainHeader = document.getElementById("mainHeader")
            let imageNow = 0
            let viewProductAddCart = document.getElementById("viewProductAddCart")
            let viewProductImage = document.getElementById("viewProductImage")
            let viewProductProxImg = document.getElementById("viewProductProxImg")
            let viewProductLastImg = document.getElementById("viewProductLastImg")
            mainHeader.style.display = "none"
            viewProductImage.src = `${res.images[imageNow]}`
            if (res.data.photos == 1) {
                viewProductProxImg.style.display = "none"
                viewProductLastImg.style.display = "none"
            } else {
                viewProductProxImg.onclick = function () {
                    if (imageNow == (res.data.photos - 1)) {
                        imageNow = 0
                        viewProductImage.src = `${res.images[imageNow]}`
                    } else {
                        imageNow = imageNow + 1
                        viewProductImage.src = `${res.images[imageNow]}`
                    }
                }
                viewProductLastImg.onclick = function () {
                    if (imageNow == 0) {
                        imageNow = res.data.photos - 1
                        viewProductImage.src = `${res.images[imageNow]}`
                    } else {
                        imageNow = imageNow - 1
                        viewProductImage.src = `${res.images[imageNow]}`
                    }
                }
            }
            document.getElementById("viewProductName").textContent = `${res.data.name}`
            document.getElementById("viewProductPrice").textContent = `R$${res.data.price}`
            document.getElementById("viewProductCategory").textContent = `${res.data.category}`
            document.getElementById("viewProductExtra").textContent = `${res.data.stars > 3 ? `Avaliado em ${res.data.stars} estrelas`.toUpperCase() : document.getElementById("viewProductExtra").textContent}`
            viewProductAddCart.onclick = function () {
                viewProductAddCart.style.background = "var(--green)"
                viewProductAddCart.style.color = "var(--white)"
                viewProductAddCart.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`
                addToCart(productId, 1).then(added => {
                    setTimeout(() => {
                        viewProductAddCart.style.background = ""
                        viewProductAddCart.style.color = ""
                        viewProductAddCart.innerHTML = `<ion-icon name="cart-outline"></ion-icon>`
                    }, 1000);
                })
            }
            homeSection.style.display = "none"
            viewProductSection.style.display = "flex"
            pageTitle.textContent = ""
        })
    }
})

window.addEventListener("hashchange", () => {
    if (`${window.location.hash}`.replace("#", "") == "perfil") {
        verifyUserLogin().then(result => {
            if (result != undefined) {
                viewPerfilBtn.children[0].name = "home-outline"
                disableAllPages()
                perfilSection.style.display = "flex"
                pageTitle.textContent = "PERFIL"
                getUserDoc(result.email).then(userData => {
                    perfilSctNameInput.value = `${userData.name}`
                    perfilSctTelInput.value = `${userData.phone}`
                    perfilSctCPFInput.value = `${userData.cpf}`
                    perfilSctCEPInput.value = `${userData.cep}`
                    perfilSctAdressInput.value = `${userData.address}`
                    perfilSctStreetInput.value = `${userData.street}`
                })
                getInRouteByEmail(result.email).then(buyedData => {
                    if (buyedData.length > 0) {
                        perfilInRoute.insertAdjacentHTML("beforeend", `<span class="perfilSection__div__span">${buyedData.length}</span>`)
                    }
                })
                getPreparingByEmail(result.email).then(preparingData => {
                    if (preparingData.length > 0) {
                        perfilPreparing.insertAdjacentHTML("beforeend", `<span class="perfilSection__div__span">${preparingData.length}</span>`)
                    }
                })
                viewPerfilBtn.onclick = function () {
                    window.location.href = `${window.location.origin}`
                }
            }
        })
    } else if (`${window.location.hash}`.replace("#", "") == "createItem") {
        verifyUserLogin().then(result => {
            if (result != undefined) {
                viewPerfilBtn.children[0].name = "home-outline"
                disableAllPages()
                createItemSection.style.display = "flex"
                pageTitle.textContent = "Criar"
                viewPerfilBtn.onclick = function () {
                    window.location.href = `${window.location.origin}`
                }
            }
        })
    } else {
        disableAllPages()
        homeSection.style.display = "flex"
        pageTitle.textContent = "HOME"
    }
})