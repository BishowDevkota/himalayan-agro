import { NextResponse } from "next/server";
import { uploadImageFromBuffer } from "../../../../lib/cloudinary";

export async function POST(req: Request) {
  try {
    // support multipart/form-data (file) and JSON { dataUrl }
    const contentType = req.headers.get("content-type") || "";
    let result: any = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as any;
      const folder = (form.get("folder") || "").toString().trim() || "ecom_products";
      if (!file) return NextResponse.json({ message: "file required" }, { status: 400 });
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      result = await uploadImageFromBuffer(buffer, { folder });
    } else {
      const body = await req.json().catch(() => ({}));
      const folder = (body.folder || "").toString().trim() || "ecom_products";
      if (body.dataUrl) {
        const matches = body.dataUrl.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return NextResponse.json({ message: "Invalid dataUrl" }, { status: 400 });
        const b = Buffer.from(matches[2], "base64");
        result = await uploadImageFromBuffer(b, { folder });
      } else if (body.url) {
        // proxy an external URL to cloudinary
        result = await uploadImageFromBuffer(Buffer.from(''), { public_id: undefined, upload_preset: undefined });
        // Note: for simplicity we rely on client to provide file or dataUrl. External URL proxy isn't implemented.
        return NextResponse.json({ message: "External URL upload not supported" }, { status: 400 });
      } else {
        return NextResponse.json({ message: "No file or dataUrl provided" }, { status: 400 });
      }
    }

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Upload failed" }, { status: 500 });
  }
}