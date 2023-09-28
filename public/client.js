// app.js (front-end)
const decodeButton = document.getElementById("decodeButton");
const copyLink = document.getElementById("copyLink");
const decodedData = document.getElementById("decodedData");
const imageInput = document.getElementById("imageInput");
const makrButton = document.getElementById("makrButton");
const qrtext = document.getElementById("qrtext");
const img = document.getElementById("img");

decodeButton.addEventListener("click", () => {
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);

  fetch("/decode", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      decodedData.textContent = `Decoded Data: ${data.decodedData}`;
      copyLink.hidden = false;
    })
    .catch((error) => {
      console.error(error);
      decodedData.textContent = "Error decoding QR code.";
    });
});

copyLink.addEventListener("click", () => {
  const textToCopy = decodedData.textContent.replace("Decoded Data: ", "");
  navigator.clipboard.writeText(textToCopy);
  alert("Copied");
});

makrButton.addEventListener("click", () => {
  console.log(qrtext.value);
  fetch("/gen?value=" + qrtext.value)
    .then((response) => response.text())
    .then((data) => {
      img.src = data;
      img.alt = "Fetched Image";
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
    });
});
