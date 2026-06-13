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
const overlayImageInput = document.getElementById("overlay-image-input");
const overlayImageClearButton = document.getElementById("overlay-image-clear-button");
const downloadBtn = document.getElementById("download-btn");

const recode_name_image = new Image();
recode_name_image.src = "static/recode_name.svg";

let currentImage = null;
let currentCity = null;
let overlayImage = null;


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

    ctx.drawImage(recode_name_image, 15, 15, recode_name_image.width * 0.5, recode_name_image.height * 0.5);

    if (overlayImage) {
        const overlaySize = 512;
        const paddingTop = 20;
        const paddingRight = -100;
        const cx = size - overlaySize - paddingRight + overlaySize / 2;
        const cy = paddingTop + overlaySize / 2;
        const radius = overlaySize / 2;
        const minDim = Math.min(overlayImage.width, overlayImage.height);
        const sx = (overlayImage.width - minDim) / 2;
        const sy = (overlayImage.height - minDim) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(overlayImage, sx, sy, minDim, minDim, cx - radius, cy - radius, overlaySize, overlaySize);
        ctx.restore();
    }

    let offset = center;

    setFontSize(60);
    setLetterSpacing(0);
    setFontColor("#e6e6e6");
    ctx.fillText(eventTypeInput.value, center, offset);

    setFontSize(120);
    setLetterSpacing(30);
    setFontColor("#ff0000");
    offset += 100;
    ctx.fillText(locationInput.value, center, offset);

    setFontSize(40);
    setLetterSpacing(0);
    setFontColor("#e6e6e6");
    offset += 110;

    if (personEnabled.checked) {
        ctx.fillText(personInput.value, center, offset);
        offset += 60;
    }

    setFontSize(30);
    
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

    offset += 40;
    ctx.fillText(`Treffpunkt: ${pointInput.value}`, center, offset);
    
    if (addressEnabled.checked) {
        offset += 40;
        ctx.fillText(`(${addressInput.value})`, center, offset);
    }

    setFontSize(40);
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

overlayImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                overlayImage = img;
                render();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

overlayImageClearButton.addEventListener("click", () => {
    overlayImage = null;
    overlayImageInput.value = null;
    render();
});

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
    dateInput.value = current_date();
    setCity("passau");
}

document.fonts.ready.then(initialise);