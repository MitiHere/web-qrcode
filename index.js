const express = require("express");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");
const jsQR = require("jsqr");
const app = express();
const cors = require("cors");
const port = 3000;
const QRCode = require("qrcode");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const corsOptions = {
  origin: "https://always.ceyraud.com/", // Replace with the actual URL of 'file.ceyraud.com'
};
app.use(cors(corsOptions));

app.get("/client.js", (req, res) => {
  res.sendFile(__dirname + "/public/client.js");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/decode", async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send("No file uploaded.");
  }
  const imgPath = req.files.image.tempFilePath;
  const sharpImg = await sharp(imgPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const code = jsQR(
    Uint8ClampedArray.from(sharpImg.data),
    sharpImg.info.width,
    sharpImg.info.height
  );
  if (code) {
    res.json({ decodedData: code.data });
  } else {
    return res.status(500).send("Error decoding QR code.");
  }
});

app.get("/gen", async (req, res) => {
  QRCode.toDataURL(req.query.value, function (err, url) {
    res.send(url);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
