import "bootstrap/dist/css/bootstrap.min.css"; 
import HamburgerMenu from "./components/hamburgerMenu";
import Breadcrumbs from "./components/breadcrumbs";
import Theme from "./components/theme";

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

        <nav className="navbar navbar-expand-lg navbar-light bg-light border-top border-bottom">
          <div className="container-fluid d-flex justify-content-between">
            <ul className="navbar-nav flex-row">
              <li className="nav-item me-3">
                <a className="nav-link text-dark link-primary" href="/">Home</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-dark link-primary" href="/tabs">Tabs</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-dark link-primary" href="/prelab-qns">Pre-lab Questions</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-dark link-primary" href="/escape-room">Escape Room</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-dark link-primary" href="/coding-races">Coding Races</a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <a className="nav-link text-dark link-primary" href="/about">About</a>
              <HamburgerMenu /> 
              
            </div>
          </div>
        </nav>
        
        <div className="container my-2">
          <div className="d-flex justify-content-between align-items-center">
            <Breadcrumbs />
            <Theme />
          </div>
        </div>

        {children}

        <footer className="bg-secondary text-white text-center py-3">
          <p>Copyright © 2025 | Melisha Shrestha 21923855 | August 27 2025 |</p>
        </footer>

      </body>
    </html>
  );
}
