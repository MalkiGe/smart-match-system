const path = require("path");
const fs = require("fs");
const multer = require("multer");

const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const field = file.fieldname;
    const uploadRoot = path.join(__dirname, "../../uploads");
    const subfolder = field === "resumePdf" || field === "resumePDF" ? "pdfs" : "images";
    const destination = path.join(uploadRoot, subfolder);
    ensureDirectoryExists(destination);
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const cleaned = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
    cb(null, `${timestamp}-${cleaned}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
