const cities = {
    passau: { label: "Passau", image: "images/passau.png" },
    berlin: { label: "Berlin", image: "images/berlin.png" },
    munich: { label: "München", image: "images/munich.png" }
};


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = 1024;

const eventTypeInput = document.getElementById("event-type-input");
const citySelect = document.getElementById("city-select");
const locationInput = document.getElementById("location-input");
const personInput = document.getElementById("person-input");
const dateInput = document.getElementById("date-input");
const pointInput = document.getElementById("point-input");
const addressEnabled = document.getElementById("adress-enabled");
const addressInput = document.getElementById("address-input");
const newMembersEnabled = document.getElementById("new-members-enabled");

const downloadBtn = document.getElementById("download-btn");

let currentImage = null;
let currentCity = null;

function loadCityImage(cityKey) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = cities[cityKey].image;
    });
}

function render() {
    canvas.width = size;
    canvas.height = size;

    if (!currentImage) {
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#9ca3af";
        ctx.font = "18px 'IBM Plex Mono'";
        ctx.textAlign = "center";
        ctx.fillText("No image loaded", size / 2, size / 2);
        return;
    }

    

    ctx.drawImage(currentImage, 0, 0, size, size);

    const padding = size * 0.1;
    const fontSize = 40;

    ctx.font = `${fontSize}px 'IBM Plex Mono'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(eventTypeInput.value, size / 2, size / 2);
    ctx.fillText(locationInput.value, size / 2, size / 2 + 40);
    ctx.fillText(personInput.value, size / 2, size / 2 + 80);
    
    {
        date = new Date(dateInput.value);
        day = date.toLocaleString('de-de', { 
            year: '2-digit', 
            month: '2-digit', 
            day: '2-digit',
        });
        time = date.toLocaleString('de-de', { 
            hour: '2-digit', 
            minute: '2-digit', 
        });
        ctx.fillText(`am ${day} ab ${time} Uhr` ,size / 2, size / 2 + 120);
    }

    ctx.fillText(`Treffpunkt: ${pointInput.value}`, size / 2, size / 2 + 160);
    if (addressEnabled.checked) {
        ctx.fillText(`(${addressInput.value})`, size / 2, size / 2 + 200);
    }

    if (newMembersEnabled.checked) {
        ctx.fillText("Auch für Nichtmitglieder!", size / 2, size / 2 + 240);
    }
}

async function setCity(cityKey) {
    currentCity = cityKey;
    locationInput.value = cities[cityKey].label;
    currentImage = await loadCityImage(cityKey);
    render();
}

citySelect.addEventListener("change", (e) => {
    setCity(e.target.value);
});

eventTypeInput.addEventListener("input", render);
locationInput.addEventListener("input", render);
personInput.addEventListener("input", render);
dateInput.addEventListener("input", render);
pointInput.addEventListener("input", render);
addressEnabled.addEventListener("input", render);
addressInput.addEventListener("input", render);
newMembersEnabled.addEventListener("input", render);

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `invite-${currentCity}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
});

function current_date() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
}

document.fonts.ready.then(() => {
    setCity("passau");
    dateInput.value = current_date();
});