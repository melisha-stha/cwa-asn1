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
            initialTime: Math.floor(gameDuration * 0.1), // 10% of game time (30s for 5min)
            urgentTime: Math.floor(gameDuration * 0.2), // 20% of game time (60s for 5min)
            penaltyTime: Math.floor(gameDuration * 0.3) // 30% of game time (90s for 5min)
        },
        {
            id: 'input_validation',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.2) + 120, // 20% + 2 minutes (150s for 5min)
            urgentTime: Math.floor(gameDuration * 0.4) + 120, // 40% + 2 minutes (180s for 5min)
            penaltyTime: Math.floor(gameDuration * 0.6) + 120 // 60% + 2 minutes (210s for 5min)
        },
        {
            id: 'secure_database',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.3) + 240, // 30% + 4 minutes (210s for 5min)
            urgentTime: Math.floor(gameDuration * 0.5) + 240, // 50% + 4 minutes (240s for 5min)
            penaltyTime: Math.floor(gameDuration * 0.7) + 240 // 70% + 4 minutes (270s for 5min)
        },
        {
            id: 'user_login',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.4) + 360, // 40% + 6 minutes (270s for 5min)
            urgentTime: Math.floor(gameDuration * 0.6) + 360, // 60% + 6 minutes (300s for 5min)
            penaltyTime: Math.floor(gameDuration * 0.8) + 360 // 80% + 6 minutes (330s for 5min)
        }
    ];

    const difficult = [
        {
            id: 'alt_tag_1',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img1.',
            urgentMessage: 'Urgent fix alt in img1.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.05), // 5% of game time (30s for 10min)
            urgentTime: Math.floor(gameDuration * 0.15), // 15% of game time (90s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.25) // 25% of game time (150s for 10min)
        },
        {
            id: 'alt_tag_2',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img2.',
            urgentMessage: 'Urgent fix alt in img2.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.1) + 60, // 10% + 1 minute (120s for 10min)
            urgentTime: Math.floor(gameDuration * 0.2) + 60, // 20% + 1 minute (180s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.3) + 60 // 30% + 1 minute (240s for 10min)
        },
        {
            id: 'input_validation_1',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.15) + 120, // 15% + 2 minutes (210s for 10min)
            urgentTime: Math.floor(gameDuration * 0.25) + 120, // 25% + 2 minutes (270s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.35) + 120 // 35% + 2 minutes (330s for 10min)
        },
        {
            id: 'input_validation_2',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix email validation.',
            urgentMessage: 'Urgent fix email validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.2) + 180, // 20% + 3 minutes (300s for 10min)
            urgentTime: Math.floor(gameDuration * 0.3) + 180, // 30% + 3 minutes (360s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.4) + 180 // 40% + 3 minutes (420s for 10min)
        },
        {
            id: 'secure_database_1',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.25) + 240, // 25% + 4 minutes (390s for 10min)
            urgentTime: Math.floor(gameDuration * 0.35) + 240, // 35% + 4 minutes (450s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.45) + 240 // 45% + 4 minutes (510s for 10min)
        },
        {
            id: 'secure_database_2',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix database security.',
            urgentMessage: 'Urgent fix database security.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.3) + 300, // 30% + 5 minutes (480s for 10min)
            urgentTime: Math.floor(gameDuration * 0.4) + 300, // 40% + 5 minutes (540s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.5) + 300 // 50% + 5 minutes (600s for 10min)
        },
        {
            id: 'user_login_1',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.35) + 360, // 35% + 6 minutes (570s for 10min)
            urgentTime: Math.floor(gameDuration * 0.45) + 360, // 45% + 6 minutes (630s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.55) + 360 // 55% + 6 minutes (690s for 10min)
        },
        {
            id: 'user_login_2',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix authentication.',
            urgentMessage: 'Urgent fix authentication.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.4) + 420, // 40% + 7 minutes (660s for 10min)
            urgentTime: Math.floor(gameDuration * 0.5) + 420, // 50% + 7 minutes (720s for 10min)
            penaltyTime: Math.floor(gameDuration * 0.6) + 420 // 60% + 7 minutes (780s for 10min)
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

// Difficulty-specific buggy code templates
const EASY_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Easy)</h3>

  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    // BUG: missing input validation like: if (!email.includes('@')) { ... }
    console.log('Saving profile...');
    alert('Saved');
  }
</script>
`.trim();

const MEDIUM_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Medium)</h3>

  <!-- BUG: missing alt -->
  <img src="profile.jpg" style="width:100px; height:100px; border-radius:50%;">

  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <label style="display:block; margin-top:10px;">Username:</label>
  <input type="text" id="username" value="user123" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>

  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" placeholder="password"/>
    <button onclick="login()">Login</button>
  </div>
</div>

<script>
  function saveData() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    // BUG: insecure database wording and missing validation
    console.log('Saving data to insecure database...'); 
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    // BUG: no proper login validation/security checks
    if (u && p) {
      alert('Logged in');
    }
  }
</script>
`.trim();

const DIFFICULT_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Difficult)</h3>

  <!-- BUGS: two images, both missing alt -->
  <img src="profile.jpg" style="width:100px; height:100px; border-radius:50%;">
  <img src="avatar.png" style="width:80px; height:80px; border-radius:50%; margin-left:10px;">

  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <label style="display:block; margin-top:10px;">Alt Email:</label>
  <input type="text" id="altEmail" value="also-bad" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>

  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" placeholder="password"/>
    <button onclick="login()">Login</button>
  </div>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    const altEmail = document.getElementById('altEmail').value;
    // BUGS: missing input validation for both emails
    // BUG: insecure database wording
    console.log('Saving data to insecure database...');
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    // BUG: no password strength / validation
    if (u && p) {
      alert('Logged in');
    }
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
    const [userCode, setUserCode] = useState(EASY_CODE);
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
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showFixFirstPopup, setShowFixFirstPopup] = useState(false);

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

    // Get starting buggy code based on difficulty
    const getCodeTemplateForDifficulty = () => {
        const difficulty = getCurrentDifficulty();
        if (difficulty === 'easy') return EASY_CODE;
        if (difficulty === 'medium') return MEDIUM_CODE;
        return DIFFICULT_CODE;
    };

    const isFixApplied = (penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        switch (penaltyKey) {
            case 'DisabilityAct':
                // All images must include an alt attribute
                const imgTags = userCode.match(/<img\b[^>]*>/gi) || [];
                if (imgTags.length === 0) return false;
                const imgsWithAlt = imgTags.filter(tag => /\balt=\s*["'][^"']*["']/i.test(tag));
                return imgsWithAlt.length === imgTags.length;
                
            case 'LawsOfTort_Validation':
                // Flexible detection: accept common patterns anywhere in the code
                const hasAtIncludes = /email[^}]*includes\s*\(\s*['"]@['"]\s*\)/i.test(userCode);
                const hasDotIncludes = /email[^}]*includes\s*\(\s*['"]\.["']\s*\)/i.test(userCode);
                const hasAtIndexOf = /email[^}]*indexOf\s*\(\s*['"]@['"]\s*\)/i.test(userCode);
                const hasDotIndexOf = /email[^}]*indexOf\s*\(\s*['"]\.["']\s*\)/i.test(userCode);
                const hasRegexEmail = /@.*\./i.test(userCode) && /(test|match|exec)\s*\(/i.test(userCode);
                return (
                    hasRegexEmail ||
                    (hasAtIncludes && hasDotIncludes) ||
                    (hasAtIndexOf && hasDotIndexOf)
                );
                
            case 'LawsOfTort_Database':
                return userCode.includes('secure database') && !userCode.includes('insecure database');
            
            case 'Bankruptcy':
                return userCode.includes('secure database') && userCode.includes('LawsOfTort');

            default:
                return false;
        }
    };

    // Determine if all configured challenges for the current difficulty are fixed
    const areAllChallengesFixed = (): boolean => {
        const challenges = getCurrentChallenges();
        if (!challenges || challenges.length === 0) return false;
        return challenges.every(ch => isFixApplied(ch.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'));
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
            // Show win popup if all issues fixed, else just end normally (existing penalties may also trigger)
            if (areAllChallengesFixed()) {
                setShowWinPopup(true);
            } else {
            setGameState('game_over');
            }
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
            
            // If user fixed the issue at any time, clear any queued urgent/penalty entries for this challenge
            if (isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {
                setPopupQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                // Mark urgent and penalty as processed to prevent future scheduling
                if (!processedChallenges.has(`${challengeKey}_urgent`)) {
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
                }
                if (!processedChallenges.has(`${challengeKey}_penalty`)) {
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                }
                return; // skip further handling for this challenge
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
        // More frequent distractions in difficult mode
        const difficulty = getCurrentDifficulty();
        const distractionInterval = difficulty === 'difficult' 
            ? Math.max(7, Math.floor(selectedGameTime * 0.02)) // 2% of game time, minimum 7 seconds for difficult
            : Math.max(15, Math.floor(selectedGameTime * 0.05)); // 5% of game time, minimum 15 seconds for easy/medium
        
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
            setUserCode(getCodeTemplateForDifficulty());
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
        setUserCode(getCodeTemplateForDifficulty());
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
                        <button 
                            onClick={() => {
                                // Block early end if not all fixed and timer not finished
                                if (timeRemaining > 0 && !areAllChallengesFixed()) {
                                    setShowFixFirstPopup(true);
                                    return;
                                }
                                if (areAllChallengesFixed()) {
                                    // If all fixed, show win popup (even if timer not zero)
                                    setShowWinPopup(true);
                                } else {
                                    // Otherwise, proceed to generate code and end
                                    generateFinalCode();
                                }
                            }} 
                            className={styles.endBtn}
                        >
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

            {/* Fix-first popup */}
            {showFixFirstPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>Finish Debugging First</h3>
                        </div>
                        <div className={styles.popupContent}>
                            <p className={styles.popupMessage}>Please fix all critical issues before ending the trial.</p>
                        </div>
                        <div className={styles.popupActions}>
                            <button onClick={() => setShowFixFirstPopup(false)} className={styles.popupOkBtn}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Win popup */}
            {showWinPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>Congratulations!</h3>
                        </div>
                        <div className={styles.popupContent}>
                            <p className={styles.popupMessage}>You have fixed the bugs and won the Court Room Challenge.</p>
                        </div>
                        <div className={styles.popupActions}>
                            <button onClick={() => { setShowWinPopup(false); resetGame(); }} className={styles.controlBtn}>Play New Game</button>
                            <button onClick={() => { setShowWinPopup(false); generateFinalCode(); }} className={styles.popupOkBtn}>Generate HTML Code</button>
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