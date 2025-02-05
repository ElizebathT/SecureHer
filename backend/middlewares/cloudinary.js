const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = "uploads"; // Default folder
      let resourceType = "auto"; // Automatically detect resource type (image, video, raw)
  
      // Determine folder and resource type based on file MIME type
      if (file.mimetype.startsWith("image")) {
        folder = "images";
        resourceType = "image";
      } else if (file.mimetype.startsWith("video")) {
        folder = "videos";
        resourceType = "video";
      } else if (file.mimetype === "application/pdf") {
        folder = "documents";
        resourceType = "raw"; // PDF falls under 'raw' type in Cloudinary
      }
  
      return {
        folder: folder,
        resource_type: resourceType,
        format: file.mimetype.split("/")[1], // Keep original file format
      };
    },
  });

const upload = multer({ storage });

module.exports =  upload 
