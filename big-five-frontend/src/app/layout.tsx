import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {AntdRegistry} from "@ant-design/nextjs-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Big Five personality traits",
  description: "Big Five personality traits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <body>
      <AntdRegistry>
        {children}
      </AntdRegistry>
    </body>
    </html>
  );
}
