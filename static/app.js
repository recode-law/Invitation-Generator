const cities = {
    passau: { label: "PASSAU", image: "images/passau.png" },
    berlin: { label: "BERLIN", image: "images/berlin.png" },
    munich: { label: "MÜNCHEN", image: "images/munich.png" }
};


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = 1024;
const center = size / 2;

const eventTypeInput = document.getElementById("event-type-input");
const citySelect = document.getElementById("city-select");
const locationInput = document.getElementById("location-input");
const personEnabled = document.getElementById("person-enabled");
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

function setFontSize(fontSize) {
    ctx.font = `${fontSize}px 'IBM Plex Mono'`;
}

function setLetterSpacing(spacing) {
    ctx.letterSpacing = `${spacing}px`;
}

function setFontColor(color) {
    ctx.fillStyle = color;
}

function render() {
    ctx.drawImage(currentImage, 0, 0, size, size);

    let offset = center;

    setFontSize(60);
    setLetterSpacing(0);
    setFontColor("#ffffff");
    ctx.fillText(eventTypeInput.value, center, offset);

    setFontSize(120);
    setLetterSpacing(30);
    setFontColor("#ff0000");
    offset += 100;
    ctx.fillText(locationInput.value, center, offset);

    setFontSize(40);
    setLetterSpacing(0);
    setFontColor("#ffffff");
    offset += 110;

    if (personEnabled.checked) {
        ctx.fillText(personInput.value, center, offset);
        offset += 60;
    }
    
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
        ctx.fillText(`am ${day} ab ${time} Uhr` ,center, offset);
    }

    offset += 60;
    ctx.fillText(`Treffpunkt: ${pointInput.value}`, center, offset);
    
    if (addressEnabled.checked) {
        offset += 60;
        ctx.fillText(`(${addressInput.value})`, center, offset);
    }

    offset = center + 460;
    if (newMembersEnabled.checked) {
        ctx.fillText("Auch für Nichtmitglieder!", center, offset);
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
personEnabled.addEventListener("input", render);
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

function initialise() {
    canvas.width = size;
    canvas.height = size;   
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    setCity("passau");
    dateInput.value = current_date();
}

document.fonts.ready.then(initialise);