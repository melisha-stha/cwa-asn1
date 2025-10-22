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
    // Easy mode: Exactly 25%, 50%, 75% timing intervals as per requirements 3.2, 3.3, 3.4
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

    // Medium mode: 10-15% intervals with dynamic spacing as per requirement 3.5
    const medium = [
        {
            id: 'alt_tag',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img1.',
            urgentMessage: 'Urgent fix alt in img1.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.10), // 10% of game time
            urgentTime: Math.floor(gameDuration * 0.20), // 20% of game time
            penaltyTime: Math.floor(gameDuration * 0.30) // 30% of game time
        },
        {
            id: 'input_validation',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.25), // 25% of game time
            urgentTime: Math.floor(gameDuration * 0.35), // 35% of game time
            penaltyTime: Math.floor(gameDuration * 0.45) // 45% of game time
        },
        {
            id: 'secure_database',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.50), // 50% of game time
            urgentTime: Math.floor(gameDuration * 0.60), // 60% of game time
            penaltyTime: Math.floor(gameDuration * 0.70) // 70% of game time
        },
        {
            id: 'user_login',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.75), // 75% of game time
            urgentTime: Math.floor(gameDuration * 0.85), // 85% of game time
            penaltyTime: Math.floor(gameDuration * 0.95) // 95% of game time
        }
    ];

    // Difficult mode: 10-15% intervals with dynamic spacing as per requirement 3.5
    const difficult = [
        {
            id: 'alt_tag_1',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img1.',
            urgentMessage: 'Urgent fix alt in img1.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.10), // 10% of game time
            urgentTime: Math.floor(gameDuration * 0.15), // 15% of game time
            penaltyTime: Math.floor(gameDuration * 0.20) // 20% of game time
        },
        {
            id: 'alt_tag_2',
            penaltyKey: 'DisabilityAct',
            initialMessage: 'Fix alt in img2.',
            urgentMessage: 'Urgent fix alt in img2.',
            penaltyMessage: 'You are fined for breaking the Disability Act.',
            initialTime: Math.floor(gameDuration * 0.25), // 25% of game time
            urgentTime: Math.floor(gameDuration * 0.30), // 30% of game time
            penaltyTime: Math.floor(gameDuration * 0.35) // 35% of game time
        },
        {
            id: 'input_validation_1',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix input validation.',
            urgentMessage: 'Urgent fix input validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.40), // 40% of game time
            urgentTime: Math.floor(gameDuration * 0.45), // 45% of game time
            penaltyTime: Math.floor(gameDuration * 0.50) // 50% of game time
        },
        {
            id: 'input_validation_2',
            penaltyKey: 'LawsOfTort_Validation',
            initialMessage: 'Fix email validation.',
            urgentMessage: 'Urgent fix email validation.',
            penaltyMessage: 'You are fined for breaking the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.55), // 55% of game time
            urgentTime: Math.floor(gameDuration * 0.60), // 60% of game time
            penaltyTime: Math.floor(gameDuration * 0.65) // 65% of game time
        },
        {
            id: 'secure_database_1',
            penaltyKey: 'LawsOfTort_Database',
            initialMessage: 'Fix secure database.',
            urgentMessage: 'Urgent fix secure database.',
            penaltyMessage: 'You got hacked and you have broken the Laws of Tort.',
            initialTime: Math.floor(gameDuration * 0.70), // 70% of game time
            urgentTime: Math.floor(gameDuration * 0.75), // 75% of game time
            penaltyTime: Math.floor(gameDuration * 0.80) // 80% of game time
        },
        {
            id: 'user_login_1',
            penaltyKey: 'Bankruptcy',
            initialMessage: 'Fix user login.',
            urgentMessage: 'Urgent fix user login.',
            penaltyMessage: 'You have been declared bankrupt and no one can use your app, so you don\'t get paid.',
            initialTime: Math.floor(gameDuration * 0.85), // 85% of game time
            urgentTime: Math.floor(gameDuration * 0.90), // 90% of game time
            penaltyTime: Math.floor(gameDuration * 0.95) // 95% of game time
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
    console.log('Saving profile...');
    alert('Saved');
  }
</script>
`.trim();

const MEDIUM_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Medium)</h3>

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
    console.log('Saving data to insecure database...'); 
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (u && p) {
      alert('Logged in');
    }
  }
</script>
`.trim();

const DIFFICULT_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Difficult)</h3>

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
    console.log('Saving data to insecure database...');
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
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

    // Enhanced popup queue management state
    const [criticalQueue, setCriticalQueue] = useState<Message[]>([]);
    const [minorQueue, setMinorQueue] = useState<Message[]>([]);

    // New penalty system state
    const [penaltyScreen, setPenaltyScreen] = useState<string | null>(null);
    const [processedChallenges, setProcessedChallenges] = useState<Set<string>>(new Set());
    const [distractionMessages, setDistractionMessages] = useState<Message[]>([]);
    const [lastDistractionTime, setLastDistractionTime] = useState<number>(0);
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showFixFirstPopup, setShowFixFirstPopup] = useState(false);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Enhanced message time formatting with proper timestamps (Requirement 9.1, 9.3)
    const formatMessageTime = (message: Message) => {
        // Always use actual timestamp for accurate record keeping (Requirement 9.1)
        const timestamp = message.timestamp?.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) || 'N/A';

        // Also show game time for context
        const gameTime = message.gameTime || message.id;
        const gameMinutes = Math.floor(gameTime / 60);
        const gameSeconds = gameTime % 60;
        const gameTimeStr = `${String(gameMinutes).padStart(2, '0')}:${String(gameSeconds).padStart(2, '0')}`;

        return `${timestamp} (${gameTimeStr})`;
    };

    // Enhanced message priority calculation for better distinction (Requirement 9.4)
    const getMessagePriority = (message: Message): 'low' | 'medium' | 'high' | 'critical' => {
        if (message.isCritical) {
            if (message.messageType === 'urgent') return 'critical';
            return 'high';
        }

        // Non-critical messages get lower priority
        if (message.source === 'Boss') return 'medium';
        return 'low';
    };

    // Enhanced message categorization for better organization (Requirement 9.4)
    const categorizeMessage = (message: Message): Message => {
        const priority = getMessagePriority(message);

        // Determine message type based on content and criticality
        let messageType: 'initial' | 'urgent' | 'distraction' = 'distraction';

        if (message.isCritical) {
            messageType = message.text.toLowerCase().includes('urgent') ? 'urgent' : 'initial';
        }

        // Add timestamp and gameTime for complete record keeping (Requirement 9.1)
        const currentGameTime = selectedGameTime - timeRemaining;

        return {
            ...message,
            messageType,
            priority,
            timestamp: new Date(), // Actual timestamp when message was processed
            gameTime: currentGameTime // Game time when message appeared
        };
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

    // Enhanced safe interval calculation to avoid conflicts with critical messages (Requirement 7.6)
    const getNextSafeDistractionTime = (currentTime: number, challenges: any[]): number => {
        const bufferZone = 5; // Minimum 5-second buffer
        let nextSafeTime = currentTime + 1;

        // Find the next time slot that doesn't conflict with critical messages
        while (nextSafeTime <= selectedGameTime) {
            const isConflict = challenges.some(challenge => {
                return Math.abs(nextSafeTime - challenge.initialTime) < bufferZone ||
                    Math.abs(nextSafeTime - challenge.urgentTime) < bufferZone ||
                    Math.abs(nextSafeTime - challenge.penaltyTime) < bufferZone;
            });

            if (!isConflict) {
                return nextSafeTime;
            }
            nextSafeTime++;
        }

        return -1; // No safe time found
    };

    // Calculate optimal distraction frequency based on difficulty (Requirements 7.2, 7.3, 7.4)
    const getDistractionFrequencyForDifficulty = (difficulty: string, gameTime: number): { interval: number, maxCount: number } => {
        switch (difficulty) {
            case 'easy':
                // Requirement 7.2: 1-2 Minor_Distraction popups at safe intervals
                return {
                    interval: Math.max(20, Math.floor(gameTime * 0.33)), // Spread across game for 1-2 messages
                    maxCount: 2
                };
            case 'medium':
                // Requirement 7.3: Random Minor_Distraction popups at moderate frequency
                return {
                    interval: Math.max(12, Math.floor(gameTime * 0.08)), // 8% of game time
                    maxCount: Math.floor(gameTime / 15) // Approximately every 15 seconds
                };
            case 'difficult':
                // Requirement 7.4: Frequent Minor_Distraction popups (every 7+ seconds minimum)
                return {
                    interval: Math.max(7, Math.floor(gameTime * 0.025)), // 2.5% of game time, minimum 7 seconds
                    maxCount: Math.floor(gameTime / 8) // Approximately every 8 seconds
                };
            default:
                return { interval: 15, maxCount: 5 };
        }
    };

    const isFixApplied = (penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        switch (penaltyKey) {
            case 'DisabilityAct':
                // Enhanced alt tag detection to handle edge cases and multiple image scenarios
                const imgTags = userCode.match(/<img\b[^>]*>/gi) || [];
                if (imgTags.length === 0) return false;

                // More robust alt attribute detection
                const imgsWithAlt = imgTags.filter(tag => {
                    // Check for alt attribute with various quote styles and spacing
                    const hasAltAttr = /\balt\s*=\s*(['"`])[^'"`]*\1/i.test(tag);
                    // Ensure alt attribute has meaningful content (not empty or just whitespace)
                    const altMatch = tag.match(/\balt\s*=\s*(['"`])([^'"`]*)\1/i);
                    const altContent = altMatch ? altMatch[2].trim() : '';
                    return hasAltAttr && altContent.length > 0;
                });

                // All images must have meaningful alt attributes
                return imgsWithAlt.length === imgTags.length && imgTags.length > 0;

            case 'LawsOfTort_Validation':
                // Strengthened input validation detection for flexible coding approaches
                const codeLines = userCode.split('\n');
                let hasEmailValidation = false;

                // Check for various email validation patterns across multiple lines
                for (const line of codeLines) {
                    // Pattern 1: includes() method for @ and . checks
                    const hasAtIncludes = /email[^}]*\.includes\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIncludes = /email[^}]*\.includes\s*\(\s*['"]\.["']\s*\)/i.test(line);

                    // Pattern 2: indexOf() method for @ and . checks  
                    const hasAtIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]\.["']\s*\)/i.test(line);

                    // Pattern 3: Regular expression validation
                    const hasEmailRegex = /(\/[^\/]*@[^\/]*\.[^\/]*\/|new\s+RegExp|\.test\s*\(|\.match\s*\()/i.test(line) &&
                        /@.*\./i.test(line);

                    // Pattern 4: Custom validation functions
                    const hasCustomValidation = /function\s+\w*validate\w*email\w*/i.test(line) ||
                        /const\s+\w*validate\w*email\w*/i.test(line) ||
                        /email\s*[!=]==?\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);

                    // Pattern 5: Built-in validation attributes or methods
                    const hasBuiltInValidation = /type\s*=\s*['"]email['"]/i.test(line) ||
                        /pattern\s*=\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);

                    if ((hasAtIncludes && hasDotIncludes) ||
                        (hasAtIndexOf && hasDotIndexOf) ||
                        hasEmailRegex ||
                        hasCustomValidation ||
                        hasBuiltInValidation) {
                        hasEmailValidation = true;
                        break;
                    }
                }

                // Also check for validation in conditional statements (but not in comments)
                const codeWithoutComments = userCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
                const hasConditionalValidation = /if\s*\([^)]*email[^)]*[@.][^)]*\)/i.test(codeWithoutComments) ||
                    /if\s*\([^)]*!email[^)]*includes[^)]*[@.]/i.test(codeWithoutComments);

                return hasEmailValidation || hasConditionalValidation;

            case 'LawsOfTort_Database':
                // Verify secure database and authentication fix detection accuracy
                const hasSecureDatabase = userCode.includes('secure database');
                const removedInsecureDatabase = !userCode.includes('insecure database');

                // Additional security-related checks
                const hasSecurityMeasures = /secure|encrypt|hash|auth|token|ssl|https/i.test(userCode);
                const hasSecureConnection = /secure\s+(connection|database|storage)/i.test(userCode);

                return hasSecureDatabase && removedInsecureDatabase && (hasSecurityMeasures || hasSecureConnection);

            case 'Bankruptcy':
                // Enhanced authentication fix detection
                const hasSecureAuth = userCode.includes('secure database');
                const hasAuthValidation = /password[^}]*length|password[^}]*strength|authenticate|authorization|login[^}]*validation/i.test(userCode);
                const hasSecurityCheck = /if\s*\([^)]*username[^)]*&&[^)]*password/i.test(userCode) ||
                    /if\s*\([^)]*password[^)]*&&[^)]*username/i.test(userCode);
                const hasProperLogin = /login[^}]*function|function[^}]*login|const[^}]*login/i.test(userCode);

                return hasSecureAuth && (hasAuthValidation || hasSecurityCheck || hasProperLogin);

            default:
                return false;
        }
    };

    // Enhanced validation for win conditions (Requirements 5.1, 5.3)
    const areAllChallengesFixed = (): boolean => {
        const challenges = getCurrentChallenges();
        if (!challenges || challenges.length === 0) return false;
        return challenges.every(ch => isFixApplied(ch.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'));
    };

    // Get detailed status of all challenges for better user feedback
    const getChallengeStatus = () => {
        const challenges = getCurrentChallenges();
        return challenges.map(challenge => ({
            id: challenge.id,
            message: challenge.initialMessage,
            isFixed: isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'),
            penaltyKey: challenge.penaltyKey
        }));
    };

    // Enhanced win condition validation with detailed logging
    const validateWinConditions = (): { canWin: boolean; remainingIssues: string[] } => {
        const challengeStatus = getChallengeStatus();
        const remainingIssues = challengeStatus
            .filter(status => !status.isFixed)
            .map(status => status.message);

        const canWin = remainingIssues.length === 0;

        console.log('=== Win Condition Validation ===');
        console.log(`Total challenges: ${challengeStatus.length}`);
        console.log(`Fixed challenges: ${challengeStatus.filter(s => s.isFixed).length}`);
        console.log(`Remaining issues: ${remainingIssues.length}`);
        console.log(`Can win: ${canWin}`);
        console.log('================================');

        return { canWin, remainingIssues };
    };

    // Enhanced final code generation with success validation (Requirement 5.4)
    const generateFinalCode = async () => {
        if (isRunning) {
            setIsRunning(false);
            setGameState('game_over');
        }

        // Requirement 5.4: Generate final HTML code output when game completes successfully
        const isSuccessfulCompletion = areAllChallengesFixed();
        const completionStatus = isSuccessfulCompletion ? 'SUCCESS' : 'INCOMPLETE';

        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSE3CWA Generated Code - ${completionStatus}</title>
</head>
<body>
    <!-- Court Room Challenge Result: ${completionStatus} -->
    <!-- Game Completion Time: ${formatTime(selectedGameTime - timeRemaining)} -->
    <!-- All Issues Fixed: ${isSuccessfulCompletion ? 'YES' : 'NO'} -->
    
${userCode}
    
    <script>
        // Enhanced validation status reporting
        const altFixStatus = document.body.innerHTML.includes('alt="');
        const emailValidationStatus = document.body.innerHTML.includes('@') && document.body.innerHTML.includes('.');
        const securityFixStatus = document.body.innerHTML.includes('secure database');
        
        console.log('=== Court Room Challenge Results ===');
        console.log('Game Completion Status:', '${completionStatus}');
        console.log('Alt Tag Accessibility Fix:', altFixStatus ? 'FIXED' : 'MISSING');
        console.log('Email Validation Fix:', emailValidationStatus ? 'FIXED' : 'MISSING');
        console.log('Security Database Fix:', securityFixStatus ? 'FIXED' : 'MISSING');
        console.log('All Issues Resolved:', ${isSuccessfulCompletion});
        console.log('=====================================');
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
                    completionStatus: completionStatus,
                    allIssuesFixed: isSuccessfulCompletion,
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
            // Requirement 5.3: Automatic win detection when timer expires with all issues fixed
            const { canWin } = validateWinConditions();

            if (canWin) {
                console.log('Timer expired - all issues fixed, showing congratulatory message');
                setShowWinPopup(true);
            } else {
                // Timer expired but not all issues fixed - end game normally
                console.log('Timer expired - issues remain unfixed, ending game');
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
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                    timestamp: new Date(), // Requirement 9.1: Proper timestamp for complete record
                    gameTime: elapsedTime, // Requirement 9.1: Game time for context
                    messageType: 'initial',
                    priority: 'high'
                };

                // Enhanced message categorization before adding to history (Requirement 9.4)
                const categorizedMessage = categorizeMessage(message);

                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]); // Requirement 9.1: Complete record maintenance
                setUnreadCount(prev => prev + 1); // Requirement 9.2: Accurate unread counter

                // Use enhanced queue system - critical messages get priority
                if (currentPopup) {
                    addToPopupQueue(categorizedMessage);
                } else {
                    setCurrentPopup(categorizedMessage);
                }
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_initial`]));
            }

            // Enhanced challenge cancellation logic (Requirements 4.3, 4.4)
            if (isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {
                // Requirement 4.3: Cancel Urgent_Fix_Messages when issues are fixed after Fix_Message
                if (processedChallenges.has(`${challengeKey}_initial`) && !processedChallenges.has(`${challengeKey}_urgent`)) {
                    // Issue was fixed after Fix_Message but before Urgent_Fix_Message
                    setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                    setMinorQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
                    console.log(`Challenge ${challenge.id}: Urgent message cancelled - issue fixed after initial message`);
                }

                // Requirement 4.4: Cancel Penalty_Pages when issues are fixed after Urgent_Fix_Message
                if (processedChallenges.has(`${challengeKey}_urgent`) && !processedChallenges.has(`${challengeKey}_penalty`)) {
                    // Issue was fixed after Urgent_Fix_Message but before Penalty_Page
                    setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                    setMinorQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                    console.log(`Challenge ${challenge.id}: Penalty cancelled - issue fixed after urgent message`);
                }

                // Clear any remaining queued messages for this challenge
                setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                setMinorQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));

                // Mark all stages as processed to prevent future scheduling
                if (!processedChallenges.has(`${challengeKey}_urgent`)) {
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
                }
                if (!processedChallenges.has(`${challengeKey}_penalty`)) {
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                }
                return; // skip further handling for this challenge
            }

            // Requirement 6.1: Display Urgent_Fix_Message when Fix_Message timeout expires without resolution
            if (elapsedTime >= challenge.urgentTime &&
                !processedChallenges.has(`${challengeKey}_urgent`) &&
                processedChallenges.has(`${challengeKey}_initial`) &&
                !isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {

                const message: Message = {
                    id: challenge.urgentTime,
                    source: 'Ethical/Legal',
                    text: challenge.urgentMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                    timestamp: new Date(), // Requirement 9.1: Proper timestamp for complete record
                    gameTime: elapsedTime, // Requirement 9.1: Game time for context
                    messageType: 'urgent',
                    priority: 'critical'
                };

                // Enhanced message categorization before adding to history (Requirement 9.4)
                const categorizedMessage = categorizeMessage(message);

                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]); // Requirement 9.1: Complete record maintenance
                setUnreadCount(prev => prev + 1); // Requirement 9.2: Accurate unread counter

                // Use enhanced queue system - critical messages get priority
                if (currentPopup) {
                    addToPopupQueue(categorizedMessage);
                } else {
                    setCurrentPopup(categorizedMessage);
                }
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
                console.log(`Challenge ${challenge.id}: Urgent message displayed - Fix_Message timeout expired without resolution`);
            }

            // Requirement 6.2: Display Penalty_Page when Urgent_Fix_Message timeout expires without resolution
            if (elapsedTime >= challenge.penaltyTime &&
                !processedChallenges.has(`${challengeKey}_penalty`) &&
                processedChallenges.has(`${challengeKey}_urgent`) &&
                !isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy')) {

                setPenaltyScreen(challenge.penaltyMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                setIsRunning(false);
                setGameState('game_over');
                console.log(`Challenge ${challenge.id}: Penalty triggered - Urgent_Fix_Message timeout expired without resolution`);
            }
        });

        // Optimized distraction message timing and frequency (Requirements 7.1, 7.2, 7.3, 7.4, 7.6)
        const difficulty = getCurrentDifficulty();
        const { interval: distractionInterval, maxCount: maxDistractions } = getDistractionFrequencyForDifficulty(difficulty, selectedGameTime);

        // Enhanced safe time calculation with 5-second buffer (Requirement 7.6)
        const isTimeSlotSafe = (timeSlot: number): boolean => {
            const bufferZone = 5; // Minimum 5-second buffer around Fix_Messages and Urgent_Fix_Messages

            return !challenges.some(challenge => {
                // Check conflicts with initial Fix_Message timing
                const initialConflict = Math.abs(timeSlot - challenge.initialTime) < bufferZone;
                // Check conflicts with Urgent_Fix_Message timing  
                const urgentConflict = Math.abs(timeSlot - challenge.urgentTime) < bufferZone;
                // Check conflicts with penalty timing (though less critical for distractions)
                const penaltyConflict = Math.abs(timeSlot - challenge.penaltyTime) < bufferZone;

                return initialConflict || urgentConflict || penaltyConflict;
            });
        };

        // Improved distraction scheduling with safe interval calculation
        if (elapsedTime > 0 &&
            elapsedTime - lastDistractionTime >= distractionInterval &&
            distractionMessages.length < maxDistractions) {

            // Check if current time slot is safe for distraction messages
            if (isTimeSlotSafe(elapsedTime)) {
                // Difficulty-based probability for showing distractions (Requirement 7.1)
                let shouldShowDistraction = false;

                if (difficulty === 'easy') {
                    // Requirement 7.2: Display 1-2 Minor_Distraction popups at safe intervals
                    shouldShowDistraction = distractionMessages.length < 2;
                } else if (difficulty === 'medium') {
                    // Requirement 7.3: Display random Minor_Distraction popups at moderate frequency
                    shouldShowDistraction = Math.random() > 0.25; // 75% chance to show when interval met
                } else {
                    // Requirement 7.4: Display frequent Minor_Distraction popups (every 7+ seconds minimum)
                    shouldShowDistraction = Math.random() > 0.1; // 90% chance to show when interval met
                }

                if (shouldShowDistraction) {
                    // Requirement 7.5: Source Minor_Distraction content from family, boss, or Agile message categories
                    const randomDistraction = DISTRACTION_MESSAGES[Math.floor(Math.random() * DISTRACTION_MESSAGES.length)];
                    const distractionMessage: Message = {
                        id: elapsedTime,
                        source: randomDistraction.source as 'Family' | 'Boss' | 'Agile',
                        text: randomDistraction.text,
                        isCritical: false,
                        timestamp: new Date(), // Requirement 9.1: Proper timestamp for complete record
                        gameTime: elapsedTime, // Requirement 9.1: Game time for context
                        messageType: 'distraction',
                        priority: randomDistraction.source === 'Boss' ? 'medium' : 'low'
                    };

                    // Enhanced message categorization before adding to history (Requirement 9.4)
                    const categorizedMessage = categorizeMessage(distractionMessage);

                    setDistractionMessages(prev => [...prev, categorizedMessage]);
                    setMessageHistory(prev => [...prev, categorizedMessage]); // Requirement 9.1: Complete record maintenance
                    setUnreadCount(prev => prev + 1); // Requirement 9.2: Accurate unread counter
                    setLastDistractionTime(elapsedTime);

                    // Use enhanced queue system - minor distractions go to minor queue (Requirement 2.2)
                    if (currentPopup) {
                        addToPopupQueue(categorizedMessage);
                    } else {
                        setCurrentPopup(categorizedMessage);
                    }
                }
            } else {
                // If current time is not safe, find next safe time for distraction
                const nextSafeTime = getNextSafeDistractionTime(elapsedTime, challenges);
                if (nextSafeTime > 0 && nextSafeTime - elapsedTime <= 3) {
                    // If next safe time is within 3 seconds, update last distraction time to delay properly
                    setLastDistractionTime(elapsedTime - distractionInterval + 3);
                }
            }
        }
    }, [timeRemaining, isRunning, processedChallenges, userCode, selectedGameTime, gameState, penaltyScreen, currentPopup, lastDistractionTime]);

    // Real-time fix detection and challenge state updates (Requirements 4.3, 4.4)
    useEffect(() => {
        if (gameState !== 'playing' || !isRunning || penaltyScreen) return;

        const challenges = getCurrentChallenges();
        const elapsedTime = selectedGameTime - timeRemaining;

        challenges.forEach(challenge => {
            const challengeKey = `${challenge.id}_${challenge.initialTime}`;
            const isFixed = isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy');

            // Real-time cancellation when issue gets fixed
            if (isFixed) {
                // Check if we need to cancel upcoming urgent messages (Requirement 4.3)
                if (processedChallenges.has(`${challengeKey}_initial`) &&
                    !processedChallenges.has(`${challengeKey}_urgent`) &&
                    elapsedTime < challenge.urgentTime) {

                    // Cancel queued urgent messages
                    setCriticalQueue(prev => prev.filter(m =>
                        !(m.penaltyKey === challenge.penaltyKey && m.text === challenge.urgentMessage)
                    ));
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
                    console.log(`Real-time cancellation: Urgent message for ${challenge.id} cancelled due to fix`);
                }

                // Check if we need to cancel upcoming penalty (Requirement 4.4)
                if (processedChallenges.has(`${challengeKey}_urgent`) &&
                    !processedChallenges.has(`${challengeKey}_penalty`) &&
                    elapsedTime < challenge.penaltyTime) {

                    // Cancel penalty
                    setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
                    console.log(`Real-time cancellation: Penalty for ${challenge.id} cancelled due to fix`);
                }
            }
        });
    }, [userCode, gameState, isRunning, penaltyScreen, processedChallenges, timeRemaining, selectedGameTime]);

    // Control Functions
    const startGame = () => {
        if (selectedGameTime > 0) {
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
            // Clear both queue types
            setCriticalQueue([]);
            setMinorQueue([]);
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
        // Clear both queue types
        setCriticalQueue([]);
        setMinorQueue([]);
    };

    // Enhanced popup queue management functions with cancellation support
    const addToPopupQueue = (message: Message) => {
        // Check if this message should be cancelled due to fix
        if (message.penaltyKey && isFixApplied(message.penaltyKey)) {
            console.log(`Message cancelled before queuing: ${message.text}`);
            return;
        }

        if (message.isCritical) {
            setCriticalQueue(prev => [...prev, message]);
        } else {
            setMinorQueue(prev => [...prev, message]);
        }
    };

    const processNextPopup = () => {
        // Critical messages always take priority over minor distractions (Requirement 2.2)
        if (criticalQueue.length > 0) {
            const nextCritical = criticalQueue[0];
            setCriticalQueue(prev => prev.slice(1));

            // Double-check if this message should still be shown (real-time cancellation)
            if (nextCritical.penaltyKey && isFixApplied(nextCritical.penaltyKey)) {
                console.log(`Message cancelled during processing: ${nextCritical.text}`);
                // Skip this message and process next
                processNextPopup();
                return;
            }

            setCurrentPopup(nextCritical);
        } else if (minorQueue.length > 0) {
            const nextMinor = minorQueue[0];
            setMinorQueue(prev => prev.slice(1));
            setCurrentPopup(nextMinor);
        }
    };

    const handlePopupOk = () => {
        setCurrentPopup(null);
        // Process next popup in queue automatically (Requirement 2.4)
        processNextPopup();
    };

    // Enhanced popup queue processing effect (Requirements 2.1, 2.3, 2.4)
    useEffect(() => {
        // Only process queue if no popup is currently displayed (Requirement 2.1)
        if (!currentPopup) {
            processNextPopup();
        }
    }, [currentPopup, criticalQueue, minorQueue]);

    // Enhanced message history toggle with proper unread counter reset (Requirement 9.5)
    const toggleMessageHistory = () => {
        const wasHidden = !showMessageHistory;
        setShowMessageHistory(!showMessageHistory);

        // Requirement 9.5: Reset unread counter when message history is viewed
        if (wasHidden) {
            // Only reset when opening the history (not when closing)
            setUnreadCount(0);
            console.log('Message history opened - unread counter reset to 0');
        }
    };

    // Enhanced unread counter validation function (Requirement 9.2)
    const validateUnreadCounter = () => {
        const expectedUnread = showMessageHistory ? 0 : unreadCount;
        console.log('=== Unread Counter Validation ===');
        console.log(`Current unread count: ${unreadCount}`);
        console.log(`Message history visible: ${showMessageHistory}`);
        console.log(`Expected unread count: ${expectedUnread}`);
        console.log(`Total messages in history: ${messageHistory.length}`);
        console.log(`Counter accuracy: ${expectedUnread === unreadCount ? 'CORRECT' : 'INCORRECT'}`);
        console.log('================================');

        return expectedUnread === unreadCount;
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
                                // Enhanced end trial validation logic (Requirements 5.1, 5.2)
                                const { canWin, remainingIssues } = validateWinConditions();

                                if (!canWin) {
                                    // Requirement 5.2: Display "Fix the remaining bugs before ending the trial"
                                    console.log('End trial blocked - remaining issues:', remainingIssues);
                                    setShowFixFirstPopup(true);
                                    return;
                                }

                                // Requirement 5.1: Display congratulatory message when all issues resolved
                                console.log('All challenges completed - showing win popup');
                                setShowWinPopup(true);
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
                        <p key={index} className={styles.penaltyItem}>[ALERT] {p}</p>
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
                            X
                        </button>
                    </div>
                    <div className={styles.messageList}>
                        {/* Enhanced message history display with proper timestamps and critical message distinction (Requirements 9.1, 9.3, 9.4) */}
                        {messageHistory.slice().reverse().map((msg, index) => {
                            // Enhanced priority-based styling
                            const priorityClass = msg.priority === 'critical' ? styles.criticalUrgent :
                                msg.priority === 'high' ? styles.criticalHigh :
                                    msg.priority === 'medium' ? styles.mediumPriority :
                                        styles.lowPriority;

                            // Enhanced message type indicators
                            const typeIcon = msg.messageType === 'urgent' ? '[URGENT]' :
                                msg.messageType === 'initial' ? '[INITIAL]' :
                                    msg.source === 'Boss' ? '[BOSS]' :
                                        msg.source === 'Family' ? '[FAMILY]' :
                                            msg.source === 'Agile' ? '[AGILE]' : '[EMAIL]';

                            return (
                                <div
                                    key={`${msg.id}-${index}-${msg.timestamp?.getTime() || Date.now()}`}
                                    className={`${styles.messageItem} ${msg.isCritical ? styles.criticalMessage : ''} ${priorityClass}`}
                                >
                                    <div className={styles.messageHeader}>
                                        <strong className={`${styles.messageSource} ${msg.isCritical ? styles.criticalSource : ''}`}>
                                            {typeIcon} {msg.source}
                                            {msg.isCritical && (
                                                <span className={styles.criticalBadge}>
                                                    {msg.messageType === 'urgent' ? 'URGENT' : 'CRITICAL'}
                                                </span>
                                            )}
                                        </strong>
                                        <span className={styles.messageTime}>{formatMessageTime(msg)}</span>
                                    </div>
                                    <div className={`${styles.messageText} ${msg.isCritical ? styles.criticalText : ''}`}>
                                        {msg.text}
                                    </div>
                                    {/* Enhanced penalty information display (Requirement 9.4) */}
                                    {msg.isCritical && msg.penaltyKey && (
                                        <div className={styles.penaltyInfo}>
                                            <span className={styles.penaltyLabel}>Penalty Risk:</span>
                                            <span className={styles.penaltyType}>
                                                {msg.penaltyKey.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            {msg.messageType === 'urgent' && (
                                                <span className={styles.urgentWarning}>IMMEDIATE ACTION REQUIRED</span>
                                            )}
                                        </div>
                                    )}
                                    {/* Message metadata for debugging and validation */}
                                    <div className={styles.messageMetadata}>
                                        Priority: {msg.priority?.toUpperCase()} | Type: {msg.messageType?.toUpperCase()}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Enhanced empty state message */}
                        {messageHistory.length === 0 && (
                            <div className={styles.emptyMessageHistory}>
                                <p>No messages yet. Messages will appear here as you play.</p>
                                <p className={styles.emptySubtext}>Critical messages will be highlighted in red.</p>
                            </div>
                        )}
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

            {/* Enhanced fix-first popup (Requirement 5.2) */}
            {showFixFirstPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>Cannot End Trial</h3>
                        </div>
                        <div className={styles.popupContent}>
                            <p className={styles.popupMessage}>
                                Fix the remaining bugs before ending the trial.
                            </p>
                            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                <p>Outstanding issues:</p>
                                <ul style={{ textAlign: 'left', marginTop: '5px' }}>
                                    {getCurrentChallenges().map(challenge => {
                                        const isFixed = isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy');
                                        if (!isFixed) {
                                            return (
                                                <li key={challenge.id} style={{ color: '#d32f2f' }}>
                                                    - {challenge.initialMessage}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.popupActions}>
                            <button onClick={() => setShowFixFirstPopup(false)} className={styles.popupOkBtn}>
                                Continue Debugging
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced win popup (Requirements 5.1, 5.3) */}
            {showWinPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>Congratulations!</h3>
                        </div>
                        <div className={styles.popupContent}>
                            <p className={styles.popupMessage}>
                                All debugging issues have been resolved successfully.
                            </p>
                            <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                                <p><strong>Summary:</strong></p>
                                <ul style={{ textAlign: 'left', marginTop: '5px' }}>
                                    <li>Time completed: {formatTime(selectedGameTime - timeRemaining)}</li>
                                    <li>Difficulty: {getCurrentDifficulty().charAt(0).toUpperCase() + getCurrentDifficulty().slice(1)}</li>
                                    <li>Issues resolved: {getCurrentChallenges().length} of {getCurrentChallenges().length}</li>
                                    <li>No penalties incurred</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.popupActions}>
                            <button
                                onClick={() => { setShowWinPopup(false); resetGame(); }}
                                className={styles.controlBtn}
                            >
                                Play New Game
                            </button>
                            <button
                                onClick={() => { setShowWinPopup(false); generateFinalCode(); }}
                                className={styles.popupOkBtn}
                            >
                                Generate Final Code
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