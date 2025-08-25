import "bootstrap/dist/css/bootstrap.min.css"; 

export const metadata: Metadata = {
  title: "CSE3CWA",
  description: "Assignment 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header 
          style={{
            backgroundColor: "lightblue",
            padding: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        > 
          <h2>CSE3CWA Assignment 1</h2>
          <p>Student No- 21923855</p>
        </header>

        {children}

        <footer className="bg-secondary text-white text-center py-3">
          <p>Copyright © 2025 Melisha Shrestha 21923855 August 27 2025</p>
        </footer>

      </body>
    </html>
  );
}
