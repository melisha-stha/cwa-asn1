import React from 'react';
import Timer from '../components/timer';
import styles from './court-room.module.css';

const CourtRoomPage: React.FC = () => {
  const initialGameTime = 5;
  return (
    <div className={styles.container}> 
      <h1>The Court Room Challenge</h1>

      <Timer initialMinutes={initialGameTime} />

      <div className={styles.gameArea}>
        <div className={styles.codeArea}>
            <h2>The Debugging Task</h2>
            <p>User is to debug code here.</p>
        </div>

        <div className={styles.messageBox}>
            <h3>Incoming Messages</h3>
            <p>Messages from your boss, family, and agile team will appear here.</p>
        </div>
      </div>
      
      <button style={{ marginTop: '20px' }}>Generate Code Output</button>
      <div style={{ marginTop: '10px', backgroundColor: '#333', padding: '10px', border: '1px solid #555' }}>
        <p>Generated HTML/JS Code Output Placeholder</p>
      </div>

    </div>
  );
};

export default CourtRoomPage;