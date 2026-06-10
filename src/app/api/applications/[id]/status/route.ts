import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, note } = await request.json();

  const application = await prisma.application.update({
    where: { id },
    data: {
      status: status,
      statusHistory: {
        create: {
          status: status,
          note,
          changedBy: session.user.email,
        },
      },
    },
    include: { statusHistory: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "STATUS_CHANGE",
      entity: "Application",
      entityId: id,
      details: JSON.stringify({ status, note }),
    },
  });

  return NextResponse.json(application);
}
