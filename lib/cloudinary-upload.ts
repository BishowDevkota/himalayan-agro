/**
 * Upload a file to Cloudinary with size validation
 * @param file - File to upload
 * @param maxSizeKB - Maximum file size in KB (default 200)
 * @returns Promise with secure_url or throws error
 */
export async function uploadToCloudinary(file: File, maxSizeKB: number = 200): Promise<string> {
  // Validate file size (convert KB to bytes)
  const maxSizeBytes = maxSizeKB * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeKB}KB. Current size: ${(file.size / 1024).toFixed(2)}KB`);
  }

  // Get Cloudinary config from environment
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  // Create FormData for Cloudinary API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to upload file to Cloudinary');
  }
}
