import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PortalContent } from "@/components/portal/PortalContent";

export default async function CandidatePortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/login`);

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      applications: {
        include: { statusHistory: { orderBy: { createdAt: "asc" } }, documents: true },
        orderBy: { createdAt: "desc" },
      },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!profile) redirect(`/${locale}/bewerbung`);

  return <PortalContent profile={JSON.parse(JSON.stringify(profile))} userName={`${profile.firstName} ${profile.lastName}`} />;
}
