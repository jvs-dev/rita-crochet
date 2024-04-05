import { verifyUserLogin } from "./functions/userAuth"

let viewProductSection = document.getElementById("viewProductSection")
let homeSection = document.getElementById("homeSection")
let pageTitle = document.getElementById("pageTitle")
let perfilSection = document.getElementById("perfilSection")
let viewPerfilBtn = document.getElementById("viewPerfilBtn")
let createItemSection = document.getElementById("createItemSection")

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
    }
    if (productId != null) {
        homeSection.style.display = "none"
        viewProductSection.style.display = "flex"
        pageTitle.textContent = ""
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