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
      companyName,
      industry,
      location,
      companySize,
      contactPerson,
      position,
      phone,
      professions,
      positions,
      urgency,
      requirements,
      contractType,
      salaryRange,
      housing,
      isApproved,
      requestStatus,
    } = body;

    if (!email || !companyName || !contactPerson) {
      return NextResponse.json(
        { error: "E-Mail, Firmenname und Ansprechpartner sind Pflichtfelder" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "E-Mail bereits registriert" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password || "rks-temp-2026", 12);
    const requestNumber = generateApplicationNumber().replace("RKS-", "RKS-EMP-");
    const professionList = Array.isArray(professions) ? professions : professions ? [professions] : [];

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "EMPLOYER",
        preferredLanguage: "de",
        isApproved: isApproved !== false,
        employerProfile: {
          create: {
            companyName,
            industry: industry || null,
            location: location || null,
            companySize: companySize || null,
            contactPerson,
            position: position || null,
            phone: phone || null,
            requests: {
              create: {
                requestNumber,
                professions: JSON.stringify(professionList),
                positions: positions ? parseInt(positions) : 1,
                urgency: urgency || "THREE_MONTHS",
                requirements: requirements || null,
                contractType: contractType || null,
                salaryRange: salaryRange || null,
                housing: housing === true,
                status: requestStatus || "PENDING",
              },
            },
          },
        },
      },
      include: {
        employerProfile: { include: { requests: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authResult.session.user.id,
        action: "CREATE_EMPLOYER",
        entity: "EmployerRequest",
        entityId: user.employerProfile!.requests[0].id,
        details: JSON.stringify({ email, requestNumber, companyName }),
      },
    });

    return NextResponse.json({
      success: true,
      requestNumber,
      userId: user.id,
    });
  } catch (error) {
    console.error("Admin create employer:", error);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
