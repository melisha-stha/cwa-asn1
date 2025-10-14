"use client";

import React, { useState, useEffect } from 'react';
import styles from './court-room.module.css';
import { GAME_MESSAGES, Message } from './messages';

const initialGameTime = 5 * 60;

const initialProblemCode = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile</h3>
  
  <img src="profile.jpg" style="width:100px; height:100px; border-radius:50%;">

  <label style="display:block; margin-top:10px;">Username:</label>
  <input type="text" id="username" value="user123" style="border:1px solid #ccc;">

  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    console.log('Saving data to insecure database...'); 
    
    alert('Data saved (but maybe not securely or legally!)');
  }
</script>
`.trim();


const CourtRoomPage: React.FC = () => {
    const [timeRemaining, setTimeRemaining] = useState(initialGameTime);
    const [isRunning, setIsRunning] = useState(false);
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [penalties, setPenalties] = useState<string[]>([]);
    const [userCode, setUserCode] = useState(initialProblemCode);
    const [generatedOutput, setGeneratedOutput] = useState('');


    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const isFixApplied = (penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        switch (penaltyKey) {
            case 'DisabilityAct':
                return /<img[^>]*alt=["'][^"']*["'][^>]*>/i.test(userCode);
                
            case 'LawsOfTort_Validation':
                // FIX APPLIED HERE: Using double quotes for the outer string
                return userCode.includes("if (!email.includes('@'))");
                
            case 'LawsOfTort_Database':
                return userCode.includes('secure database') && !userCode.includes('insecure database');
            
            case 'Bankruptcy':
                return userCode.includes('secure database') && userCode.includes('LawsOfTort');

            default:
                return false;
        }
    };

    const generateFinalCode = () => {
        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSE3CWA Generated Code</title>
</head>
<body>
    
${userCode}
    
    <script>
        const altFixStatus = document.body.innerHTML.includes('alt="');
        console.log('Alt Tag Accessibility Fix Status:', altFixStatus ? 'FIXED' : 'MISSING');
    </script>
</body>
</html>
        `.trim();

        setGeneratedOutput(finalHtml);
    };


    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined; 

        if (isRunning && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setIsRunning(false);
            alert("Time's up! Game Over."); 
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, timeRemaining]);


    useEffect(() => {
        if (!isRunning) return;

        const elapsedTime = initialGameTime - timeRemaining;
        
        GAME_MESSAGES.forEach(msg => {
            if (elapsedTime === msg.id && !currentMessages.find(m => m.id === msg.id)) {
                setCurrentMessages(prev => [...prev, msg]);
            }

            if (msg.isCritical && elapsedTime === msg.id + 120) {
                const fixKey = msg.penaltyKey;

                if (fixKey && !isFixApplied(fixKey)) {
                    const penaltyText = `PENALTY! Court fine for ignoring ${fixKey} issue!`;
                    
                    if (!penalties.includes(penaltyText)) {
                        setPenalties(prev => [...prev, penaltyText]);
                        alert(penaltyText); 
                    }
                }
            }
        });
    }, [timeRemaining, isRunning, currentMessages, penalties, userCode]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetGame = () => {
        setTimeRemaining(initialGameTime);
        setIsRunning(false);
        setCurrentMessages([]);
        setPenalties([]);
        setUserCode(initialProblemCode);
        setGeneratedOutput('');
    };

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
            
            {penalties.length > 0 && (
                <div style={{ border: '2px solid red', padding: '10px', margin: '10px 0', backgroundColor: 'darkred' }}>
                    <h3>FINES/PENALTIES</h3>
                    {penalties.map((p, index) => <p key={index} style={{ margin: '5px 0' }}>🚨 {p}</p>)}
                </div>
            )}
            
            <div className={styles.gameArea}> 
                <div className={styles.codeArea}>
                    <h2>The Debugging Task (Fix the issues!)</h2>
                    <p>Edit the code below to fix the issues mentioned in the **RED** critical messages.</p>
                    <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        style={{ width: '100%', minHeight: '300px', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', padding: '10px' }}
                    />
                </div>
                
                <div className={styles.messageBox}>
                    <h3>Incoming Messages ({currentMessages.length})</h3>
                    {currentMessages.slice().reverse().map((msg) => (
                        <div 
                            key={msg.id} 
                            style={{ 
                                borderBottom: '1px dashed #666', 
                                padding: '5px 0', 
                                color: msg.isCritical ? 'red' : 'white',
                                fontWeight: msg.isCritical ? 'bold' : 'normal'
                            }}>
                            <strong>{msg.source}:</strong> {msg.text} 
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={generateFinalCode} style={{ marginTop: '20px' }}>
                Generate Code Output (Final Deliverable)
            </button>
            
            <div style={{ marginTop: '10px', backgroundColor: '#333', padding: '10px', border: '1px solid #555' }}>
                {generatedOutput ? (
                    <pre style={{ color: 'lightgreen', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {generatedOutput}
                    </pre>
                ) : (
                    <p>Click 'Generate Code Output' to see the final HTML5 + JS code.</p>
                )}
            </div>
        </div>
    );
};

export default CourtRoomPage;