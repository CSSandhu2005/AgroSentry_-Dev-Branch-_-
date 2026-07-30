import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroSentry | Dashboard",
  description: "Precision Agricultural Intelligence Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
