"use client";
import React, { useState, useEffect, useCallback } from 'react';
import styles from './court-room.module.css'; 
import { GAME_MESSAGES, Message } from './messages'; // Import our messages

const initialGameTime = 5 * 60; // 5 minutes in seconds

const CourtRoomPage: React.FC = () => {
  // State for the timer
  const [timeRemaining, setTimeRemaining] = useState(initialGameTime);
  const [isRunning, setIsRunning] = useState(false);
  
  // State for messages
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [penalties, setPenalties] = useState<string[]>([]); // To track penalties

  // --- TIMER LOGIC (Modified from Step 2) ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      clearInterval(intervalId);
      setIsRunning(false);
      alert("Time's up! Game Over."); 
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeRemaining]);
  
  // Function to format seconds (re-used from Step 2)
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetGame = () => {
    setTimeRemaining(initialGameTime);
    setIsRunning(false);
    setCurrentMessages([]);
    setPenalties([]);
  };
  
  // --- MESSAGE LOGIC ---
  useEffect(() => {
    if (!isRunning) return;

    // Calculate elapsed time (how many seconds have passed)
    const elapsedTime = initialGameTime - timeRemaining;
    
    // Check if any message should be triggered now
    GAME_MESSAGES.forEach(msg => {
      // Check if the message's ID (trigger time) matches the elapsed time
      // and if it hasn't been shown already
      if (elapsedTime === msg.id && !currentMessages.find(m => m.id === msg.id)) {
        setCurrentMessages(prev => [...prev, msg]);
      }

      // Check for escalation/penalty (e.g., if ignored for 2 minutes/120 seconds)
      if (msg.isCritical && elapsedTime === msg.id + 120) {
        // In a real game, you'd check if the user completed the fix here.
        // For simplicity, we assume they haven't fixed it for now.
        const penaltyText = `PENALTY! Court Room appears for ignoring ${msg.penaltyKey} issue!`;
        if (!penalties.includes(penaltyText)) {
            setPenalties(prev => [...prev, penaltyText]);
            alert(penaltyText); 
            // NOTE: In the final version, you would deduct marks here 
        }
      }
    });
  // The effect depends on timeRemaining and isRunning
  }, [timeRemaining, isRunning, currentMessages, penalties]); 

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>The Court Room Challenge</h1>
        <p>Student No.</p>
      </div>

      <div style={{ padding: '10px', border: '1px solid black', display: 'inline-block', marginBottom: '10px' }}>
          <h2>Time Remaining: {formatTime(timeRemaining)}</h2>
          <button onClick={toggleTimer}> {isRunning ? 'Pause' : 'Start'} </button>
          <button onClick={resetGame} style={{ marginLeft: '10px' }}> Reset Game </button>
      </div>
      
      {/* Display Penalties */}
      {penalties.length > 0 && (
          <div style={{ border: '2px solid red', padding: '10px', margin: '10px 0', backgroundColor: 'darkred' }}>
              <h3>FINES/PENALTIES</h3>
              {penalties.map((p, index) => <p key={index} style={{ margin: '5px 0' }}>🚨 {p}</p>)}
          </div>
      )}
      
      <div className={styles.gameArea}> 
        <div className={styles.codeArea}>
            <h2>The Debugging Task</h2>
            <p>User is to debug code here.</p>
            {/* The main debugging task will be here */}
        </div>
        
        <div className={styles.messageBox}>
            <h3>Incoming Messages ({currentMessages.length})</h3>
            {/* Display the latest message at the top */}
            {currentMessages.slice().reverse().map((msg) => (
                <div key={msg.id} style={{ borderBottom: '1px dashed #666', padding: '5px 0', color: msg.isCritical ? 'red' : 'white' }}>
                    <strong>{msg.source}:</strong> {msg.text} 
                </div>
            ))}
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