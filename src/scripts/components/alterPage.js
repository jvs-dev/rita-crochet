let viewProductSection = document.getElementById("viewProductSection")
let homeSection = document.getElementById("homeSection")

window.addEventListener("load", () => {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get('productId');
    if (productId != null) {
        homeSection.style.display = "none"
        viewProductSection.style.display = "flex"
    }
})