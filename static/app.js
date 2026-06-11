const cities = {
  passau: { label: "Passau", image: "images/passau.png" },
  berlin: { label: "Berlin", image: "images/berlin.png" }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const citySelect = document.getElementById("city-select");
const addressInput = document.getElementById("address-input");
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
    ctx.font = "18px sans-serif";
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
  const fontSize = Math.max(canvas.width * 0.05, 30);

  ctx.font = `bold ${fontSize}px sans-serif`;
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

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `invite-${currentCity}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

setCity("passau");
