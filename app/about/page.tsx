export default function About() {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
          lineHeight: "1.6"
        }}
      >
        <h1>About</h1>
        <p>Name: Melisha Shrestha</p>
        <p>Student ID: 21923855</p>
  
        <h2>Video</h2>
        <div>
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/VmFeDeiswhQ?si=pS9pB3bEgxbDZvPr" 
            title="YouTube video player" 
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          >
          </iframe>
        </div>

      </main>
    );
  }
  