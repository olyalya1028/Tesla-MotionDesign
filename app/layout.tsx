import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { CalEmbed } from "@/components/CalEmbed";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tesla — Model 3",
  description:
    "Model 3, Full Self-Driving (Supervised), Tesla vehicles, charging network and energy products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a
          className="fixed left-0 top-0 z-[100] -translate-y-[120%] bg-neutral-darkest px-5 py-3 text-regular font-medium text-white focus-visible:translate-y-0"
          href="#main"
        >
          Skip to main content
        </a>
        {children}
        <CalEmbed />
      </body>
    </html>
  );
}
