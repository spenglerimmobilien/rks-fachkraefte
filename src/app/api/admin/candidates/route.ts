import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { generateApplicationNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      city,
      nationality,
      profession,
      experienceYears,
      germanLevel,
      status,
      note,
      preferredLanguage,
    } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "E-Mail, Vorname und Nachname sind Pflichtfelder" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "E-Mail bereits registriert" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password || "rks-temp-2026", 12);
    const applicationNumber = generateApplicationNumber();
    const appStatus = status || "RECEIVED";

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "CANDIDATE",
        preferredLanguage: preferredLanguage || "de",
        isApproved: true,
        candidateProfile: {
          create: {
            firstName,
            lastName,
            phone: phone || null,
            city: city || null,
            nationality: nationality || "Marokko",
            profession: profession || null,
            experienceYears: experienceYears ? parseInt(experienceYears) : null,
            germanLevel: germanLevel || null,
            applications: {
              create: {
                applicationNumber,
                status: appStatus,
                statusHistory: {
                  create: {
                    status: appStatus,
                    note: note || "Manuell vom Admin angelegt",
                    changedBy: authResult.session.user.email,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        candidateProfile: { include: { applications: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authResult.session.user.id,
        action: "CREATE_CANDIDATE",
        entity: "Application",
        entityId: user.candidateProfile!.applications[0].id,
        details: JSON.stringify({ email, applicationNumber }),
      },
    });

    return NextResponse.json({
      success: true,
      applicationNumber,
      userId: user.id,
    });
  } catch (error) {
    console.error("Admin create candidate:", error);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
