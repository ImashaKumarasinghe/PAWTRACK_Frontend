import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PawTrack",
  description: "Street pet reporting and adoption tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
