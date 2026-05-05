import { NextResponse } from "next/server";
import { uploadImageFromBuffer } from "../../../../lib/cloudinary";

const MAX_FILE_SIZE_BYTES = 200 * 1024;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "file required" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ message: "File size must be 200KB or less" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageFromBuffer(buffer, {
      folder: "distributor_documents",
    });

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}