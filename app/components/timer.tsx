"use client";

import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialMinutes: number;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes }) => {
  const initialSeconds = initialMinutes * 60;
  
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined; // Must be declared here

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      alert("Time's up! The Court is in session."); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeRemaining]); 

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(initialSeconds);
    setIsRunning(false); 
  };

  return (
    <div style={{ padding: '10px', border: '1px solid black', display: 'inline-block' }}>
      <h2>Time Remaining: {formatTime(timeRemaining)}</h2>
      <button onClick={toggleTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={resetTimer} style={{ marginLeft: '10px' }}>
        Reset
      </button>
    </div>
  );
};

export default Timer;