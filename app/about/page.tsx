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
        <div
          style={{
            width: "600px",
            height: "340px",
            border: "2px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <p>Video Placeholder</p>
        </div>
      </main>
    );
  }
  