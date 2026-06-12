const cities = {
  passau: { label: "Passau", image: "images/passau.png" },
  berlin: { label: "Berlin", image: "images/berlin.png" }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const citySelect = document.getElementById("city-select");
const addressInput = document.getElementById("address-input");
const fontSizeSlider = document.getElementById("font-size-slider");
const fontSizeValue = document.getElementById("font-size-value");
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
  if (!currentImage) {
    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "18px 'IBM Plex Mono'";
    ctx.textAlign = "center";
    ctx.fillText("No image loaded", 250, 250);
    return;
  }

  canvas.width = currentImage.width;
  canvas.height = currentImage.height;

  ctx.drawImage(currentImage, 0, 0);

  const address = addressInput.value.trim();
  if (!address) return;

  const padding = canvas.width * 0.1;
  const fontSize = parseInt(fontSizeSlider.value, 10);

  ctx.font = `${fontSize}px 'IBM Plex Mono'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textWidth = ctx.measureText(address).width;
  const boxWidth = textWidth + padding * 2;
  const boxHeight = fontSize + padding;
  const boxX = canvas.width / 2 - boxWidth / 2;
  const boxY = canvas.height / 2 - boxHeight / 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(address, canvas.width / 2, canvas.height / 2);
}

async function setCity(cityKey) {
  currentCity = cityKey;
  currentImage = await loadCityImage(cityKey);
  render();
}

citySelect.addEventListener("change", (e) => {
  setCity(e.target.value);
});

addressInput.addEventListener("input", render);

fontSizeSlider.addEventListener("input", () => {
  fontSizeValue.textContent = `${fontSizeSlider.value}px`;
  render();
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `invite-${currentCity}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

setCity("passau");
