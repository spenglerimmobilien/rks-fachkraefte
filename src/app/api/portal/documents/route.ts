import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = (formData.get("type") as string) || "OTHER";

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: session.user.id },
    include: { applications: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const saved = await saveUploadedFile(file, profile.id);
  const doc = await prisma.document.create({
    data: {
      candidateId: profile.id,
      applicationId: profile.applications[0]?.id,
      type: type || "OTHER",
      fileName: saved.fileName,
      fileUrl: saved.fileUrl,
      fileSize: saved.fileSize,
      mimeType: saved.mimeType,
    },
  });

  return NextResponse.json(doc);
}
