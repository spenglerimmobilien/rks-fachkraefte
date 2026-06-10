import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { EmployerPortalContent } from "@/components/portal/EmployerPortalContent";

export default async function EmployerPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/login`);

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      requests: { orderBy: { createdAt: "desc" } },
      user: true,
    },
  });

  if (!profile) redirect(`/${locale}/anfrage`);

  const candidates = await prisma.candidateProfile.findMany({
    where: {
      applications: { some: { status: { in: ["QUALIFIED", "MATCHING"] } } },
    },
    select: {
      id: true,
      profession: true,
      experienceYears: true,
      germanLevel: true,
      city: true,
    },
  });

  const anonymizedCandidates = candidates.map((c, i) => ({
    id: c.id,
    label: `Kandidat #${i + 1}`,
    profession: c.profession,
    experienceYears: c.experienceYears,
    germanLevel: c.germanLevel,
    region: c.city,
  }));

  return (
    <EmployerPortalContent
      profile={JSON.parse(JSON.stringify(profile))}
      candidates={anonymizedCandidates}
      isApproved={session.user.isApproved}
    />
  );
}
