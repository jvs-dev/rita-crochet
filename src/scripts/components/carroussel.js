let homeCarroussel = document.getElementById("homeCarroussel")
let lastScrollLeft = 0
let direction = 1

setInterval(() => {
    homeCarroussel.scrollLeft = homeCarroussel.scrollLeft + (1 * direction)
    if (homeCarroussel.scrollLeft == lastScrollLeft) {
        setTimeout(() => {
            direction = -1
        }, 1000);
    }
    if (homeCarroussel.scrollLeft == 0) {
        setTimeout(() => {
            direction = 1
        }, 1000);
    }
    lastScrollLeft = homeCarroussel.scrollLeft
}, 20);