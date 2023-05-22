const express = require("express");
const path = require("path");
const multer = require("multer");
const { readdir } = require("fs").promises;

const app = express();
app.use("/images/", express.static("./images"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  let files = null;
  await readdir(__dirname + "/images", "utf8")
    .then((data) => (files = data))
    .catch((error) => console.log(error));
  if (files) {
    res.render("index", { images: files });
  } else {
    res.send("bu yer ishladi");
  }
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.body);
  return res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
