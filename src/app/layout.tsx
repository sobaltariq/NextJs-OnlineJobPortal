import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./../scss/main_style.scss";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Providers } from "@/redux/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Job Portal",
  description: "Online Job Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <div className="width-container">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

// npm i sass
// npm i @reduxjs/toolkit
// npm i axios
// npm install formik yup
