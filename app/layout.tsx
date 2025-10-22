import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./components/navbar";
import Breadcrumbs from "./components/breadcrumbs";
import Theme from "./components/theme"

export const metadata: Metadata = {
  title: "CSE3CWA",
  description: "Assignment 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <div className="container my-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <div className="d-flex justify-content-between align-items-center">
            <Breadcrumbs />
            <Theme />
          </div>
        </div>

        {children}

        <footer className="bg-secondary text-white text-center py-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <p>Copyright © 2025 | Melisha Shrestha 21923855 | October 22 2025 |</p>
        </footer>

      </body>
    </html>
  );
}
