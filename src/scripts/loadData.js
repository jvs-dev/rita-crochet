import { loadCart } from "./components/cart";
import { createUser, getUserDoc } from "./functions/UserData";
import { signIn, signOutUser, verifyUserLogin } from "./functions/userAuth";
let viewNotifysBtn = document.getElementById("viewNotifysBtn")
let viewCartBtn = document.getElementById("viewCartBtn")
let viewPerfilBtn = document.getElementById("viewPerfilBtn")
let loginBtn = document.getElementById("loginBtn")
let perfil_Photo = document.getElementById("perfil_Photo")
let exitAccount = document.getElementById("exitAccount")

function initLoad() {
    verifyUserLogin().then(result => {
        if (result == undefined) {
            loginBtn.style.display = "flex"
            viewNotifysBtn.style.display = "none"
            viewCartBtn.style.display = "none"
            viewPerfilBtn.style.display = "none"
            loginBtn.onclick = function () {
                signIn().then(loginResponse => {
                    if (loginResponse != undefined) {
                        getUserDoc(loginResponse.email).then(userData => {
                            if (userData != undefined) {
                                initLoad()
                            } else {
                                createUser(loginResponse.email, loginResponse.displayName).then(createdStatus => {
                                    if (createdStatus == "created") {
                                        initLoad()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        } else {
            loadCart()
            getUserDoc(result.email).then(resData => {
                if (resData.admin == true) {
                    let createProductBtn = document.getElementById("createProductBtn")
                    createProductBtn.style.display = "flex"
                    createProductBtn.onclick = function () {
                        window.location.href = `${window.location.origin}#createItem`
                    }
                }                
            })
            loginBtn.style.display = "none"
            viewNotifysBtn.style.display = "flex"
            viewCartBtn.style.display = "flex"
            viewPerfilBtn.style.display = "flex"
            perfil_Photo.src = `${result.photoURL}`
            viewPerfilBtn.onclick = function () {
                window.location.href = `${window.location.origin}#perfil`
            }
            exitAccount.onclick = function () {
                signOutUser().then(res => {
                    if (res == "sucess") {
                        window.location.href = `${window.location.origin}`
                        initLoad()
                    }
                })
            }
        }
    })

}

initLoad()