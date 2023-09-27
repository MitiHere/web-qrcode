const express = require("express");
const fileUpload = require("express-fileupload");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const clipboardy = import("clipboardy");
const app = express();
const port = 3000;

app.use(fileUpload());

app.get("/client.js", (req, res) => {
  res.sendFile(__dirname + "/public/client.js");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/decode", async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send("No file uploaded.");
  }
  const img = req.files.image;

  Jimp.read(img, function (err, image) {
    if (err) {
      console.error(err);
      res.status(500).send("Error processing image.");
    }
    // __ Creating an instance of qrcode-reader __ \\

    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = function (err, value) {
      if (err) {
        console.error(err);
      }
      // __ Printing the decrypted value __ \\
      res.json({ decodedData: qrCode.data });
    };

    // __ Decoding the QR code __ \\
    qrCodeInstance.decode(image.bitmap);
  });
});

app.post("/copy", (req, res) => {
  const textToCopy = req.body.textToCopy;
  clipboardy.writeSync(textToCopy);
  res.send("Text copied to clipboard.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
