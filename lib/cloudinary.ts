import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  // don't throw here — allow non-image flows in dev, but log to help devs
  console.warn("Cloudinary env vars are not fully configured. Image upload will fail until set.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageFromBuffer(buffer: Buffer, opts: UploadApiOptions = {}): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(opts, (err, res) => {
      if (err) return reject(err);
      resolve(res as UploadApiResponse);
    });
    stream.end(buffer);
  });
}

export default cloudinary;