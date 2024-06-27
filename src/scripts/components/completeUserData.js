import { editUserData } from "../functions/UserData"
import { buyThisProducts } from "../functions/buyProducts"

let completeUserDataSection = document.getElementById("completeUserDataSection")
                                                                                            
export function completeUserData(email, data, selectedsArr) {
    let confirmCompleteUserData = document.getElementById("confirmCompleteUserData")
    let completeDataName = document.getElementById("completeDataName")
    let completeDataCPF = document.getElementById("completeDataCPF")
    let completeDataTel = document.getElementById("completeDataTel")
    let completeDataAdress = document.getElementById("completeDataAdress")
    let completeDataStreet = document.getElementById("completeDataStreet")
    let completeDataCEP = document.getElementById("completeDataCEP")
    completeDataName.value = `${data.name}`
    completeDataCEP.value = `${data.cep}`
    completeDataCPF.value = `${data.cpf}`
    completeDataTel.value = `${data.phone}`
    completeDataAdress.value = `${data.address}`
    completeDataStreet.value = `${data.street}`
    completeUserDataSection.style.display = "flex"
    setTimeout(() => {
        completeUserDataSection.style.opacity = "1"
    }, 1);
    confirmCompleteUserData.onclick = function () {
        if (completeDataName.value != "" && completeDataCEP.value != "" && completeDataCPF.value != "" && completeDataTel.value != "" && completeDataAdress.value != "" && completeDataStreet.value != "") {
            editUserData(email, completeDataName.value, completeDataCEP.value, completeDataCPF.value, completeDataTel.value, completeDataAdress.value, completeDataStreet.value).then(res => {
                completeUserDataSection.style.opacity = "0"
                setTimeout(() => {
                    completeUserDataSection.style.display = "none"
                    buyThisProducts(selectedsArr)
                }, 500);
            })
        } else {

        }
    }
}                                               