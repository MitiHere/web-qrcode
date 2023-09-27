// app.js (front-end)
const decodeButton = document.getElementById("decodeButton");
const copyButton = document.getElementById("copyButton");
const decodedData = document.getElementById("decodedData");
const imageInput = document.getElementById("imageInput");

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
    })
    .catch((error) => {
      console.error(error);
      decodedData.textContent = "Error decoding QR code.";
    });
});

copyButton.addEventListener("click", () => {
  const textToCopy = decodedData.textContent.replace("Decoded Data: ", "");

  fetch("/copy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ textToCopy }),
  })
    .then((response) => response.text())
    .then(() => {
      alert("Text copied to clipboard.");
    })
    .catch((error) => {
      console.error(error);
      alert("Error copying text to clipboard.");
    });
});
