import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { employerRequestId } = await request.json();

  const application = await prisma.application.update({
    where: { id },
    data: {
      employerRequestId,
      status: "MATCHING",
      statusHistory: {
        create: {
          status: "MATCHING",
          note: `Matched with request ${employerRequestId}`,
          changedBy: session.user.email,
        },
      },
    },
  });

  return NextResponse.json(application);
}
