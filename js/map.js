// Inte map element
var lat = 30.0675;
var lon = -89.9272;
var myMap = null;

//html elements
const weatherButton = document.getElementById("weather-btn");
const tideButton = document.getElementById("tide-btn");
const popupCloseButton = document.getElementById("popup-close-btn");
const popup = document.getElementById("popup");

// --------- Map initialisation ---------
function initMap() {
    myMap = L.map("map").setView([lat, lon], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
        attribution:
            'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20,
    }).addTo(myMap);
    var marker = L.marker([lat, lon]).addTo(myMap);
}
window.onload = function () {
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    initMap();
};

// --------- Event listener ---------
weatherButton.addEventListener("click", () => {
    popup.style.backgroundImage = `url(${"../ressources/hurricane.gif"})`;
    popup.style.backgroundSize = "85vw 80vh";
    popup.classList.remove("hide");
});

tideButton.addEventListener("click", () => {
    popup.style.backgroundImage = `url(${"../img/tide.jpg"})`;
    popup.style.backgroundSize = "85vw 80vh";
    popup.classList.remove("hide");
});

popupCloseButton.addEventListener("click", () => {
    popup.classList.add("hide");
});

// --------- Update function ---------
setInterval(() => {
    var date = new Date();
    // var full_date =  date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var hours = date.getHours() + ":" + minutes;
    var text = document.getElementById("time");
    text.innerHTML = hours;
    console.log(text.innerHTML);
}, 1000);
