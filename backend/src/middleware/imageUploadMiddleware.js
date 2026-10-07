const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/images"
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
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueName =
      `${Date.now()}-${baseName || "image"}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    !allowedExtensions.includes(extension) ||
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(
      new Error(
        "Unsupported image type. Please upload a JPG, JPEG, PNG, WebP, or GIF image."
      )
    );
  }

  cb(null, true);
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadImage;