import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUploadedFile(
  file: File,
  subfolder: string
): Promise<{ fileName: string; fileUrl: string; fileSize: number; mimeType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);
  await writeFile(filePath, buffer);

  return {
    fileName: file.name,
    fileUrl: `/api/uploads/${subfolder}/${safeName}`,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}
