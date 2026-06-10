import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdminDashboard } from "@/components/portal/AdminDashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  const [applications, employerRequests, pendingEmployers] = await Promise.all([
    prisma.application.findMany({
      include: {
        candidate: true,
        statusHistory: { orderBy: { createdAt: "desc" }, take: 1 },
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employerRequest.findMany({
      include: { employer: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "EMPLOYER", isApproved: false },
      include: { employerProfile: true },
    }),
  ]);

  return (
    <AdminDashboard
      applications={JSON.parse(JSON.stringify(applications))}
      employerRequests={JSON.parse(JSON.stringify(employerRequests))}
      pendingEmployers={JSON.parse(JSON.stringify(pendingEmployers))}
    />
  );
}
