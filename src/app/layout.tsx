import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { FollowProvider } from "@/lib/FollowContext";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "littleScreen — Built by parents, not by algorithms",
  description:
    "The parent-verified platform for children's screen time. Discover trusted playlists curated by real parents for every moment — bedtime, travel, sick days, and more.",
  keywords: "kids screen time, parent verified content, children playlists, safe kids videos, parenting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <FollowProvider>
            <Navigation />
            <main>{children}</main>
          </FollowProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
