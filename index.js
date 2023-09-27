const express = require("express");
const fileUpload = require("express-fileupload");
const Jimp = require("jimp");
const fs = require("fs");
const qrCodeReader = require("qrcode-reader");
const clipboardy = import("clipboardy");
const app = express();
const port = 3000;

app.use(fileUpload());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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
  const imgPath = req.files.image.tempFilePath;

  const buffer = fs.readFileSync(imgPath);
  Jimp.read(buffer, function (err, image) {
    if (err) {
      console.error(err);
      // TODO handle error
    }
    const qr = new QrCode();
    qr.callback = function (err, value) {
      if (err) {
        console.error(err);
        // TODO handle error
      }
      console.log(value.result);
      console.log(value);
    };
    qr.decode(image.bitmap);
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
