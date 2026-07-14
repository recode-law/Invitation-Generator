const backgrounds = {
    bg1: { image: "1", textColor: "#0f1f26", locationTextColor: "#e6e6e6" },
    bg2: { image: "2", textColor: "#0f1f26", locationTextColor: "#fd402b"  },
    bg3: { image: "3", textColor: "#fd402b", locationTextColor: "#0f1f26"  },
    bg4: { image: "4", textColor: "#e6e6e6", locationTextColor: "#0f1f26"  },
    bg5: { image: "5", textColor: "#e6e6e6", locationTextColor: "#fd402b"  },
    bg6: { image: "6", textColor: "#fd402b", locationTextColor: "#e6e6e6"  },
    bg7: { image: "7", textColor: "#e6e6e6", locationTextColor: "#fd402b"  }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let format = "linkedin";
let sizex = 1200;
let sizey = 1200;
let centerx = sizex / 2;
let centery = sizey / 2;

const formatRadios = document.querySelectorAll('input[name="format"]');
const eventTypeInput = document.getElementById("event-type-input");
const backgroundSelect = document.getElementById("background-select");
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

let currentImage = null;
let currentBackground = null;
let overlayImage = null;


function loadBackgroundImage() {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `images/${format}/${backgrounds[currentBackground].image}.png`;
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
    ctx.drawImage(currentImage, 0, 0, sizex, sizey);

    if (overlayImage) {
        const overlaySize = 512;
        const paddingTop = 20;
        const paddingRight = -100;
        const cx = sizex - overlaySize - paddingRight + overlaySize / 2;
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

    const textColor = backgrounds[currentBackground].textColor;
    const locationTextColor = backgrounds[currentBackground].locationTextColor;

    setFontSize(60);
    setLetterSpacing(0);
    setFontColor(textColor);
    ctx.fillText(eventTypeInput.value, centerx, format == "linkedin" ? 610 : 725);

    setFontSize(120);
    setLetterSpacing(30);
    setFontColor(locationTextColor);
    ctx.fillText(locationInput.value, centerx, format == "linkedin" ? 720 : 825);

    setFontSize(40);
    setLetterSpacing(0);
    setFontColor(textColor);

    if (personEnabled.checked) {
        ctx.fillText(personInput.value, centerx, format == "linkedin" ? 835 : 925);
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
        ctx.fillText(`am ${day} ab ${time} Uhr` ,centerx, format == "linkedin" ? 960 : 1040);
    }

    ctx.fillText(`Treffpunkt: ${pointInput.value}`, centerx, format == "linkedin" ? 1020 : 1090);
    
    if (addressEnabled.checked) {
        ctx.fillText(`(${addressInput.value})`, centerx, format == "linkedin" ? 1070 : 1140);
    }

    setFontSize(40);
    if (newMembersEnabled.checked) {
        ctx.fillText("Auch für Interessierte!", centerx, format == "linkedin" ? 1120 : 1190);
    }

    updateTextbox();
}

function updateTextbox() {
    let location = pointInput.value;
    if (addressEnabled.checked) {
        location += ` (${addressInput.value})`
    }

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

    const text = `📢 Einladung zum Recode Law Stammtisch in ${locationInput.value}
Du interessierst dich für Recht, Innovation und Legal Tech oder möchtest einfach neue Leute aus der Community kennenlernen? Dann sei bei unserem nächsten Recode Law Stammtisch dabei!
📍 Treffpunkt: ${location}
🕒 Beginn: ${day} ab ${time} Uhr
Freu dich auf einen lockeren Abend mit spannenden Gesprächen, neuen Perspektiven und der Gelegenheit, dich mit Studierenden, Berufseinsteiger*innen und Interessierten zu vernetzen.
Der Stammtisch ist offen für alle – egal, ob du bereits Teil von Recode Law bist oder einfach einmal vorbeischauen möchtest. Wir freuen uns auf einen schönen Abend mit euch! ✨`;
}

async function updateFormat() {
    format = Array.from(formatRadios).find(radio => radio.checked).value;
    if (format === "linkedin") {
        sizex = 1200;
        sizey = 1200;
    } else if (format === "instagram") {
        sizex = 1080;
        sizey = 1350;
    }
    centerx = sizex / 2;
    centery = sizey / 2;
    canvas.width = sizex;
    canvas.height = sizey;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    setBackground(currentBackground || "bg1");
}

async function setBackground(backgroundKey) {
    currentBackground = backgroundKey;
    currentImage = await loadBackgroundImage();
    render();
}

backgroundSelect.addEventListener("change", (e) => {
    setBackground(e.target.value);
});

formatRadios.forEach(radio => {
    radio.addEventListener("change", updateFormat);
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
    link.download = `invite-${currentBackground}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
});

function current_date() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
}

function initialise() {
    dateInput.value = current_date();
    updateFormat();
}

document.fonts.ready.then(initialise);