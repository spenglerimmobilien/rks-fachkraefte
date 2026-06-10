import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RKS Fachkräfte",
  description: "Qualifizierte Fachkräfte aus Marokko für Deutschland",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
