import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateApplicationNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, companyName, ...rest } = body;

    if (!email || !password || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const requestNumber = generateApplicationNumber().replace("RKS", "RKS-EMP");

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "EMPLOYER",
        preferredLanguage: body.locale || "de",
        isApproved: false,
        employerProfile: {
          create: {
            companyName,
            industry: rest.industry,
            location: rest.location,
            companySize: rest.companySize,
            contactPerson: rest.contactPerson,
            position: rest.position,
            phone: rest.phone,
          },
        },
      },
      include: { employerProfile: true },
    });

    await prisma.employerRequest.create({
      data: {
        requestNumber,
        employerId: user.employerProfile!.id,
        professions: JSON.stringify(rest.professions || []),
        positions: parseInt(rest.positions) || 1,
        urgency: rest.urgency || "THREE_MONTHS",
        requirements: rest.requirements,
        contractType: rest.contractType,
        salaryRange: rest.salaryRange,
        housing: rest.housing || false,
        benefits: rest.benefits,
      },
    });

    return NextResponse.json({ requestNumber });
  } catch (error) {
    console.error("Employer request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const requests = await prisma.employerRequest.findMany({
    include: { employer: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}
