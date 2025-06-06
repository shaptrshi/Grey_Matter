import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, folder = "uploads") => {
  try {
    if (!fileBuffer) return null;
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: "auto",
          quality: "auto",
          fetch_format: "auto"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        const result = await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
          resource_type: "auto"
        });

        if (result.result !== "ok") {
            throw new Error(`Failed to delete file: ${result.result}`);
        } 
        console.log("File deleted successfully from Cloudinary");
        return true;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
}

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : null;
};

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl };
