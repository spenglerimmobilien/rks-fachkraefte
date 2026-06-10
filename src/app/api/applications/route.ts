import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NATIONALITIES } from "@/lib/constants";
import { generateApplicationNumber } from "@/lib/utils";
import { saveUploadedFile } from "@/lib/upload";
const DOC_TYPE_MAP: Record<string, string> = {
  CV: "CV",
  EDUCATION_CERT: "EDUCATION_CERT",
  LANGUAGE_CERT: "LANGUAGE_CERT",
  ID_FRONT: "ID_FRONT",
  WORK_REFERENCE: "WORK_REFERENCE",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const nationality = formData.get("nationality") as string;
    if (!nationality || !NATIONALITIES.includes(nationality as (typeof NATIONALITIES)[number])) {
      return NextResponse.json({ error: "Invalid nationality" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const applicationNumber = generateApplicationNumber();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "CANDIDATE",
        preferredLanguage: (formData.get("preferredLanguage") as string) || "de",
        isApproved: true,
        candidateProfile: {
          create: {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            birthDate: formData.get("birthDate") as string,
            nationality,
            city: formData.get("city") as string,
            phone: formData.get("phone") as string,
            whatsapp: formData.get("whatsapp") as string,
            profession: formData.get("profession") as string,
            experienceYears: parseInt(formData.get("experienceYears") as string) || 0,
            education: formData.get("education") as string,
            institution: formData.get("institution") as string,
            graduationYear: formData.get("graduationYear") as string,
            germanLevel: formData.get("germanLevel") as string,
            hasGermanCert: formData.get("hasGermanCert") === "true",
            desiredRegion: formData.get("desiredRegion") as string,
            startDate: formData.get("startDate") as string,
            driversLicense: formData.get("driversLicense") === "true",
            motivation: formData.get("motivation") as string,
          },
        },
      },
      include: { candidateProfile: true },
    });

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        candidateId: user.candidateProfile!.id,
        status: "RECEIVED",
        statusHistory: {
          create: { status: "RECEIVED", note: "Bewerbung eingegangen" },
        },
      },
    });

    for (const [key, docType] of Object.entries(DOC_TYPE_MAP)) {
      const files = formData.getAll(key) as File[];
      for (const file of files) {
        if (file && file.size > 0) {
          const saved = await saveUploadedFile(file, application.id);
          await prisma.document.create({
            data: {
              candidateId: user.candidateProfile!.id,
              applicationId: application.id,
              type: docType,
              fileName: saved.fileName,
              fileUrl: saved.fileUrl,
              fileSize: saved.fileSize,
              mimeType: saved.mimeType,
            },
          });
        }
      }
    }

    return NextResponse.json({ applicationNumber, applicationId: application.id });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      candidate: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}
