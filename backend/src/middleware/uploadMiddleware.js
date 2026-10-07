const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/resources"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const baseName = path
      .basename(
        file.originalname,
        extension
      )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueName =
      `${Date.now()}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".txt",
  ".zip",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Unsupported file type. Please upload a PDF, Word, PowerPoint, Excel, TXT, or ZIP file."
      )
    );
  }

  cb(null, true);
};

const uploadResource = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = uploadResource;