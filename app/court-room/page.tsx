"use client";

import React, { useState, useEffect } from 'react';
import styles from './court-room.module.css';
import { GAME_MESSAGES, Message } from './messages';

type GameState = 'welcome' | 'playing' | 'game_over';

const TIME_OPTIONS = [
    { time: 60, label: '1 min', difficulty: 'Easy', color: 'bg-green-600 hover:bg-green-700' },
    { time: 300, label: '5 mins', difficulty: 'Medium', color: 'bg-orange-600 hover:bg-orange-700' },
    { time: 600, label: '10 mins', difficulty: 'Difficult', color: 'bg-red-600 hover:bg-red-700' },
];

const getDebuggingChallenges = (gameDuration: number) => {
    const easy = [
        {
            id: 'input_validation',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.25), // 25% of game time
            urgentTime: Math.floor(gameDuration * 0.5), // 50% of game time
            penaltyTime: Math.floor(gameDuration * 0.75) // 75% of game time
        }
    ];

    const medium = [
        {
            id: 'alt_tag',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img1.',
            urgentMessage: 'Urgent fix alt in img1.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.1), // 10% of game time
            urgentTime: Math.floor(gameDuration * 0.2), // 20% of game time
            penaltyTime: Math.floor(gameDuration * 0.3) // 30% of game time
        },
        {
            id: 'input_validation',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.2), // 20% of game time
            urgentTime: Math.floor(gameDuration * 0.4), // 40% of game time
            penaltyTime: Math.floor(gameDuration * 0.6) // 60% of game time
        },
        {
            id: 'secure_database',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.3), // 30% of game time
            urgentTime: Math.floor(gameDuration * 0.5), // 50% of game time
            penaltyTime: Math.floor(gameDuration * 0.7) // 70% of game time
        },
        {
            id: 'user_login',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.4), // 40% of game time
            urgentTime: Math.floor(gameDuration * 0.6), // 60% of game time
            penaltyTime: Math.floor(gameDuration * 0.8) // 80% of game time
        }
    ];

    const difficult = [
        {
            id: 'alt_tag_1',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img1.',
            urgentMessage: 'Urgent fix alt in img1.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.05), // 5% of game time
            urgentTime: Math.floor(gameDuration * 0.15), // 15% of game time
            penaltyTime: Math.floor(gameDuration * 0.25) // 25% of game time
        },
        {
            id: 'alt_tag_2',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img2.',
            urgentMessage: 'Urgent fix alt in img2.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.1), // 10% of game time
            urgentTime: Math.floor(gameDuration * 0.2), // 20% of game time
            penaltyTime: Math.floor(gameDuration * 0.3) // 30% of game time
        },
        {
            id: 'input_validation_1',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.15), // 15% of game time
            urgentTime: Math.floor(gameDuration * 0.25), // 25% of game time
            penaltyTime: Math.floor(gameDuration * 0.35) // 35% of game time
        },
        {
            id: 'input_validation_2',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix email validation.',
            urgentMessage: 'Urgent fix email validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.2), // 20% of game time
            urgentTime: Math.floor(gameDuration * 0.3), // 30% of game time
            penaltyTime: Math.floor(gameDuration * 0.4) // 40% of game time
        },
        {
            id: 'secure_database_1',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.25), // 25% of game time
            urgentTime: Math.floor(gameDuration * 0.35), // 35% of game time
            penaltyTime: Math.floor(gameDuration * 0.45) // 45% of game time
        },
        {
            id: 'secure_database_2',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix database security.',
            urgentMessage: 'Urgent fix database security.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.3), // 30% of game time
            urgentTime: Math.floor(gameDuration * 0.4), // 40% of game time
            penaltyTime: Math.floor(gameDuration * 0.5) // 50% of game time
        },
        {
            id: 'user_login_1',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.35), // 35% of game time
            urgentTime: Math.floor(gameDuration * 0.45), // 45% of game time
            penaltyTime: Math.floor(gameDuration * 0.55) // 55% of game time
        },
        {
            id: 'user_login_2',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix authentication.',
            urgentMessage: 'Urgent fix authentication.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.4), // 40% of game time
            urgentTime: Math.floor(gameDuration * 0.5), // 50% of game time
            penaltyTime: Math.floor(gameDuration * 0.6) // 60% of game time
        }
    ];

    return { easy, medium, difficult };
};

// Distraction messages
const DISTRACTION_MESSAGES = [
    { source: 'Family', text: 'Can you pick up the kids after work? I have a late meeting.' },
    { source: 'Boss', text: 'Are you done with sprint 1? The client is asking for a demo.' },
    { source: 'Agile', text: 'Fix: change Title colour to Red per product owner request.' },
    { source: 'Family', text: 'Don\'t forget about dinner tonight!' },
    { source: 'Boss', text: 'The deadline is approaching, how is the project going?' },
    { source: 'Agile', text: 'We need to update the user interface design.' }
];

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
    // Game state management
    const [gameState, setGameState] = useState<GameState>('welcome');
    const [selectedGameTime, setSelectedGameTime] = useState(TIME_OPTIONS[1].time); // Default to 5 mins
    const [timeRemaining, setTimeRemaining] = useState(selectedGameTime);
    const [isRunning, setIsRunning] = useState(false);
    const [penalties, setPenalties] = useState<string[]>([]);
    const [userCode, setUserCode] = useState(initialProblemCode);
    const [generatedOutput, setGeneratedOutput] = useState('');

    // Message system state
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [showMessageHistory, setShowMessageHistory] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<Message | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // New penalty system state
    const [penaltyScreen, setPenaltyScreen] = useState<string | null>(null);
    const [processedChallenges, setProcessedChallenges] = useState<Set<string>>(new Set());
    const [distractionMessages, setDistractionMessages] = useState<Message[]>([]);
    const [lastDistractionTime, setLastDistractionTime] = useState<number>(0);
    const [popupQueue, setPopupQueue] = useState<Message[]>([]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const formatMessageTime = (messageId: number) => {
        const minutes = Math.floor(messageId / 60);
        const seconds = messageId % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Get current difficulty level
    const getCurrentDifficulty = () => {
        if (selectedGameTime === 60) return 'easy';
        if (selectedGameTime === 300) return 'medium';
        if (selectedGameTime === 600) return 'difficult';
        return 'medium';
    };

    // Get current challenges based on difficulty
    const getCurrentChallenges = () => {
        const difficulty = getCurrentDifficulty();
        const challenges = getDebuggingChallenges(selectedGameTime);
        return challenges[difficulty as keyof typeof challenges] || [];
    };

    const isFixApplied = (penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        switch (penaltyKey) {
            case 'DisabilityAct':
                return /<img[^>]*alt=["'][^"']*["'][^>]*>/i.test(userCode);
                
            case 'LawsOfTort_Validation':
                return userCode.includes("if (!email.includes('@'))");
                
            case 'LawsOfTort_Database':
                return userCode.includes('secure database') && !userCode.includes('insecure database');
            
            case 'Bankruptcy':
                return userCode.includes('secure database') && userCode.includes('LawsOfTort');

            default:
                return false;
        }
    };

    const generateFinalCode = async () => {
        if (isRunning) {
            setIsRunning(false);
            setGameState('game_over');
        }

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

        const timeElapsed = selectedGameTime - timeRemaining; 

        try {
            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    generatedCode: finalHtml,
                    penalties: penalties, 
                    timeTaken: timeElapsed,
                    initialTime: selectedGameTime,
                }),
            });

            if (response.ok) {
                console.log('Success! Code and game result saved to database.'); 
            } else {
                console.warn('Warning: Failed to save result to database.');
            }
        } catch (error) {
            console.error('Error saving result:', error);
        }
    };
    
    // Timer Logic Effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined; 

        if (isRunning && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            setIsRunning(false);
            setGameState('game_over');
            console.log("Time's up! Game Over."); 
            generateFinalCode();
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, timeRemaining, gameState]);

    // New Message/Penalty Logic Effect with smart timing
    useEffect(() => {
        if (gameState !== 'playing' || !isRunning || penaltyScreen) return;

        const elapsedTime = selectedGameTime - timeRemaining;
        const challenges = getCurrentChallenges();
        
        // Process debugging challenges
        challenges.forEach(challenge => {
            const challengeKey = `${challenge.id}_${challenge.initialTime}`;
            
            // Initial message - appears around 10-15 seconds for all difficulties
            if (elapsedTime >= challenge.initialTime && !processedChallenges.has(`${challengeKey}_initial`)) {
                const message: Message = {
                    id: challenge.initialTime,
                    source: 'Ethical/Legal',
                    text: challenge.initialMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'
                };
                
                setCurrentMessages(prev => [...prev, message]);
                setMessageHistory(prev => [...prev, message]);
                setUnreadCount(prev => prev + 1);
                
                // Add to popup queue or show immediately if no current popup
                if (currentPopup) {
                    setPopupQueue(prev => [...prev, message]);
                } else {
                    setCurrentPopup(message);
                }
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_initial`]));
            }
            
            // Urgent message - timing based on difficulty
            if (elapsedTime >= challenge.urgentTime && 
                !processedChallenges.has(`${challengeKey}_urgent`) &&
                processedChallenges.has(`${challengeKey}_initial`) &&
                !isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {
                
                const message: Message = {
                    id: challenge.urgentTime,
                    source: 'Ethical/Legal',
                    text: challenge.urgentMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'
                };
                
                setCurrentMessages(prev => [...prev, message]);
                setMessageHistory(prev => [...prev, message]);
                setUnreadCount(prev => prev + 1);
                
                // Add to popup queue or show immediately if no current popup
                if (currentPopup) {
                    setPopupQueue(prev => [...prev, message]);
                } else {
                    setCurrentPopup(message);
                }
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
            }
            
            // Penalty
            if (elapsedTime >= challenge.penaltyTime && 
                !processedChallenges.has(`${challengeKey}_penalty`) &&
                processedChallenges.has(`${challengeKey}_urgent`) &&
                !isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {
                
                setPenaltyScreen(challenge.penaltyMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                setIsRunning(false);
                setGameState('game_over');
            }
        });
        
        // Add distraction messages at safe intervals (avoiding critical message times)
        const distractionInterval = Math.max(15, Math.floor(selectedGameTime * 0.05)); // 5% of game time, minimum 15 seconds
        if (elapsedTime > 0 && 
            elapsedTime - lastDistractionTime >= distractionInterval && 
            elapsedTime % distractionInterval === 0) {
            
            const isSafeTime = !challenges.some(challenge => 
                Math.abs(elapsedTime - challenge.initialTime) < 5 || 
                Math.abs(elapsedTime - challenge.urgentTime) < 5
            );
            
            if (isSafeTime) {
                const randomDistraction = DISTRACTION_MESSAGES[Math.floor(Math.random() * DISTRACTION_MESSAGES.length)];
                const distractionMessage: Message = {
                    id: elapsedTime,
                    source: randomDistraction.source as 'Family' | 'Boss' | 'Agile',
                    text: randomDistraction.text,
                    isCritical: false
                };
                
                setDistractionMessages(prev => [...prev, distractionMessage]);
                setMessageHistory(prev => [...prev, distractionMessage]);
                setUnreadCount(prev => prev + 1);
                setLastDistractionTime(elapsedTime);
                
                // Add to popup queue or show immediately if no current popup
                if (currentPopup) {
                    setPopupQueue(prev => [...prev, distractionMessage]);
                } else {
                    setCurrentPopup(distractionMessage);
                }
            }
        }
    }, [timeRemaining, isRunning, processedChallenges, userCode, selectedGameTime, gameState, penaltyScreen, currentPopup, lastDistractionTime]);

    // Control Functions
    const startGame = () => {
        if(selectedGameTime > 0) {
            setTimeRemaining(selectedGameTime);
            setGameState('playing');
            setIsRunning(true);
            setCurrentMessages([]);
            setMessageHistory([]);
            setPenalties([]);
            setUserCode(initialProblemCode);
            setGeneratedOutput('');
            setUnreadCount(0);
            setCurrentPopup(null);
            setPenaltyScreen(null);
            setProcessedChallenges(new Set());
            setDistractionMessages([]);
            setLastDistractionTime(0);
            setPopupQueue([]);
        }
    };

    const toggleTimer = () => setIsRunning(!isRunning);
    
    const resetGame = () => {
        setGameState('welcome');
        setIsRunning(false);
        setTimeRemaining(selectedGameTime);
        setCurrentMessages([]);
        setMessageHistory([]);
        setPenalties([]);
        setUserCode(initialProblemCode);
        setGeneratedOutput('');
        setUnreadCount(0);
        setCurrentPopup(null);
        setPenaltyScreen(null);
        setProcessedChallenges(new Set());
        setDistractionMessages([]);
        setLastDistractionTime(0);
        setPopupQueue([]);
    };

    const handlePopupOk = () => {
        setCurrentPopup(null);
        // Process next popup in queue if available
        if (popupQueue.length > 0) {
            const nextPopup = popupQueue[0];
            setPopupQueue(prev => prev.slice(1));
            setCurrentPopup(nextPopup);
        }
    };

    // Process popup queue to ensure only one popup at a time
    useEffect(() => {
        if (!currentPopup && popupQueue.length > 0) {
            const nextPopup = popupQueue[0];
            setPopupQueue(prev => prev.slice(1));
            setCurrentPopup(nextPopup);
        }
    }, [currentPopup, popupQueue]);

    const toggleMessageHistory = () => {
        setShowMessageHistory(!showMessageHistory);
        if (!showMessageHistory) {
            setUnreadCount(0);
        }
    };

    // Welcome Screen
    const renderWelcomeScreen = () => (
        <div className={`${styles.welcomeScreen} text-center p-8 bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl mx-auto max-w-2xl`}>
            <h1 className="text-4xl font-extrabold text-white mb-6">WELCOME TO THE COURT ROOM CHALLENGE</h1>
            <p className="text-xl font-light text-gray-300 mb-10">Select your time limit below to set the difficulty of your trial.</p>
            
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-indigo-400 uppercase tracking-wider">Choose Your Time / Difficulty</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {TIME_OPTIONS.map((option) => (
                    <div key={option.time} className="text-center">
                        <p className="text-sm font-medium mb-1 text-gray-400">{option.difficulty}</p>
                        <button
                            onClick={() => setSelectedGameTime(option.time)}
                            className={`
                                w-full py-3 rounded-lg font-bold text-white transition-all duration-200 shadow-md
                                ${option.color}
                                ${selectedGameTime === option.time 
                                    ? 'ring-4 ring-offset-2 ring-indigo-500'
                                    : 'opacity-75 hover:opacity-100'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    </div>
                ))}
            </div>

            <button 
                onClick={startGame}
                className="px-12 py-4 bg-indigo-600 text-white text-xl font-extrabold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
                START TRIAL
            </button>
        </div>
    );
    
    // Penalty Screen
    const renderPenaltyScreen = () => (
        <div className={styles.penaltyContainer}>
            <div className={styles.penaltyContent}>
                <h1 className={styles.penaltyTitle}>GAME OVER</h1>
                <p className={styles.penaltyMessage}>{penaltyScreen}</p>
                <button 
                    onClick={resetGame}
                    className={styles.penaltyButton}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Game Play Screen
    const renderGameScreen = () => (
        <div className={styles.gameContainer}>
            {/* Header with timer and controls */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>The Court Room Challenge</h1>
                    <p className={styles.studentNo}>Student No.</p>
            </div>

                <div className={styles.timerControls}>
                    <div className={styles.timer}>
                        <span className={styles.timerLabel}>Time Remaining:</span>
                        <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
                    </div>
                    <div className={styles.controls}>
                        <button onClick={toggleTimer} className={styles.controlBtn}>
                            {isRunning ? 'Pause' : 'Resume'}
                        </button>
                        <button onClick={resetGame} className={styles.controlBtn}>
                            New Game
                        </button>
                        <button onClick={generateFinalCode} className={styles.endBtn}>
                    End Trial & Generate Code
                </button>
                    </div>
                </div>
            </div>
            
            {/* Penalties display */}
            {penalties.length > 0 && (
                <div className={styles.penalties}>
                    <h3 className={styles.penaltiesTitle}>FINES/PENALTIES</h3>
                    {penalties.map((p, index) => (
                        <p key={index} className={styles.penaltyItem}>🚨 {p}</p>
                    ))}
                </div>
            )}
            
            {/* Message icon */}
            <button 
                className={styles.messageIcon}
                onClick={toggleMessageHistory}
            >
                <svg className={styles.messageIconSvg} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {unreadCount > 0 && (
                    <span className={styles.notificationBadge}>{unreadCount}</span>
                )}
            </button>

            {/* Message history dropdown */}
            {showMessageHistory && (
                <div className={styles.messageHistory}>
                    <div className={styles.messageHistoryHeader}>
                        <h3>Message History</h3>
                        <button 
                            onClick={toggleMessageHistory}
                            className={styles.closeBtn}
                        >
                            ×
                        </button>
                </div>
                    <div className={styles.messageList}>
                        {messageHistory.slice().reverse().map((msg) => (
                        <div 
                            key={msg.id} 
                                className={`${styles.messageItem} ${msg.isCritical ? styles.criticalMessage : ''}`}
                            >
                                <div className={styles.messageHeader}>
                                    <strong className={styles.messageSource}>{msg.source}</strong>
                                    <span className={styles.messageTime}>{formatMessageTime(msg.id)}</span>
                                </div>
                                <div className={styles.messageText}>{msg.text}</div>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {/* Full-screen code editor */}
            <div className={styles.codeEditorContainer}>
                <div className={styles.codeEditorHeader}>
                    <h2 className={styles.codeEditorTitle}>The Debugging Task</h2>
                    <p className={styles.codeEditorSubtitle}>Edit the code below to fix the issues mentioned in the critical messages.</p>
                </div>
                <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className={styles.codeEditor}
                    placeholder="Start coding here..."
                />
            </div>
            
            {/* Generated output */}
            <div className={styles.outputContainer}>
                {generatedOutput ? (
                    <pre className={styles.outputCode}>
                        {generatedOutput}
                    </pre>
                ) : (
                    <p className={styles.outputPlaceholder}>Click 'End Trial & Generate Code' to see the final HTML5 + JS code.</p>
                )}
            </div>

            {/* Message popup */}
            {currentPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>
                                {currentPopup.source}
                                {currentPopup.isCritical && <span className={styles.criticalBadge}>CRITICAL</span>}
                            </h3>
                        </div>
                        <div className={styles.popupContent}>
                            <p className={styles.popupMessage}>{currentPopup.text}</p>
                        </div>
                        <div className={styles.popupActions}>
                            <button 
                                onClick={handlePopupOk}
                                className={styles.popupOkBtn}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            {gameState === 'welcome' && renderWelcomeScreen()}
            {penaltyScreen && renderPenaltyScreen()}
            {(gameState === 'playing' || (gameState === 'game_over' && !penaltyScreen)) && renderGameScreen()}
        </div>
    );
};

export default CourtRoomPage;