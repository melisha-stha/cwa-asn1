"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './court-room.module.css';
import { Message } from '../messages';
import { getDebuggingChallenges, EASY_CODE, MEDIUM_CODE, DIFFICULT_CODE, DISTRACTION_MESSAGES, TIME_OPTIONS } from '../../lib/gameData';
import GameSetup from '../components/gameSetup';
import CodeEditorPanel from '../components/codeEditorPanel';
import MessageCenter from '../components/messageCenter';
import GameOverlay from '../components/gameOverlay';

type GameState = 'welcome' | 'playing' | 'game_over';

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatMessageTime = (message: Message) => {
    return message.timestamp?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) || 'N/A';
};

const getMessagePriority = (message: Message): 'low' | 'medium' | 'high' | 'critical' => {
    if (message.isCritical) {
        if (message.messageType === 'urgent') return 'critical';
        return 'high';
    }
    if (message.source === 'Boss') return 'medium';
    return 'low';
};

const categorizeMessage = (message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'>, currentGameTime: number): Message => {
    let messageType: 'initial' | 'urgent' | 'distraction' = 'distraction';

    if (message.isCritical) {
        messageType = message.text.toLowerCase().includes('urgent') ? 'urgent' : 'initial';
    }

    const categorized: Message = {
        ...message,
        messageType,
        timestamp: new Date(),
        gameTime: currentGameTime,
        priority: getMessagePriority({ ...message, messageType, timestamp: new Date(), gameTime: currentGameTime, priority: 'low' })
    };

    return categorized;
};


const CourtRoomPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('welcome');
    const [selectedGameTime, setSelectedGameTime] = useState(TIME_OPTIONS[1].time);
    const [timeRemaining, setTimeRemaining] = useState(selectedGameTime);
    const [isRunning, setIsRunning] = useState(false);
    const [penalties, setPenalties] = useState<string[]>([]);
    const [userCode, setUserCode] = useState(EASY_CODE);
    const [generatedOutput, setGeneratedOutput] = useState('');

    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [showMessageHistory, setShowMessageHistory] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<Message | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [criticalQueue, setCriticalQueue] = useState<Message[]>([]);
    const [minorQueue, setMinorQueue] = useState<Message[]>([]);

    const [penaltyScreen, setPenaltyScreen] = useState<string | null>(null);
    const [processedChallenges, setProcessedChallenges] = useState<Set<string>>(new Set());
    const [distractionMessages, setDistractionMessages] = useState<Message[]>([]);
    const [lastDistractionTime, setLastDistractionTime] = useState<number>(0);
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showFixFirstPopup, setShowFixFirstPopup] = useState(false);


    const getCurrentDifficulty = useCallback(() => {
        if (selectedGameTime === 60) return 'easy';
        if (selectedGameTime === 300) return 'medium';
        if (selectedGameTime === 600) return 'difficult';
        return 'medium';
    }, [selectedGameTime]);

    const getCurrentChallenges = useCallback(() => {
        const difficulty = getCurrentDifficulty();
        const challenges = getDebuggingChallenges(selectedGameTime);
        return challenges[difficulty as keyof typeof challenges] || [];
    }, [getCurrentDifficulty, selectedGameTime]);

    const getCodeTemplateForDifficulty = useCallback(() => {
        const difficulty = getCurrentDifficulty();
        if (difficulty === 'easy') return EASY_CODE;
        if (difficulty === 'medium') return MEDIUM_CODE;
        return DIFFICULT_CODE;
    }, [getCurrentDifficulty]);

    const resetGame = useCallback(() => {
        setGameState('welcome');
        setIsRunning(false);
        setPenalties([]);
        setTimeRemaining(selectedGameTime);
        setUserCode(getCodeTemplateForDifficulty());
        setCurrentMessages([]);
        setMessageHistory([]);
        setCurrentPopup(null);
        setUnreadCount(0);
        setCriticalQueue([]);
        setMinorQueue([]);
        setPenaltyScreen(null);
        setProcessedChallenges(new Set());
        setDistractionMessages([]);
        setLastDistractionTime(0);
        setShowWinPopup(false);
        setShowFixFirstPopup(false);
        setGeneratedOutput('');
    }, [selectedGameTime, getCodeTemplateForDifficulty]);

    useEffect(() => {
        resetGame();
    }, [selectedGameTime, resetGame]);

    const handleStartGame = () => {
        setTimeRemaining(selectedGameTime);
        setUserCode(getCodeTemplateForDifficulty());
        setGameState('playing');
        setIsRunning(true);
    };

    const isFixApplied = useCallback((penaltyKey: Message['penaltyKey']): boolean => {
        if (!userCode) return false;

        switch (penaltyKey) {
            case 'DisabilityAct':
                const imgTags = userCode.match(/<img\b[^>]*>/gi) || [];
                if (imgTags.length === 0) return false;

                const imgsWithAlt = imgTags.filter(tag => {
                    const hasAltAttr = /\balt\s*=\s*(['"`])[^'"`]*\1/i.test(tag);
                    const altMatch = tag.match(/\balt\s*=\s*(['"`])([^'"`]*)\1/i);
                    const altContent = altMatch ? altMatch[2].trim() : '';
                    return hasAltAttr && altContent.length > 0;
                });
                return imgsWithAlt.length === imgTags.length && imgTags.length > 0;

            case 'LawsOfTort_Validation':
                const codeLines = userCode.split('\n');
                let hasEmailValidation = false;

                for (const line of codeLines) {
                    const hasAtIncludes = /email[^}]*\.includes\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIncludes = /email[^}]*\.includes\s*\(\s*['"]\.["']\s*\)/i.test(line);
                    const hasAtIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]@['"]\s*\)/i.test(line);
                    const hasDotIndexOf = /email[^}]*\.indexOf\s*\(\s*['"]\.["']\s*\)/i.test(line);
                    const hasEmailRegex = /(\/[^\/]*@[^\/]*\.[^\/]*\/|new\s+RegExp|\.test\s*\(|\.match\s*\()/i.test(line) && /@.*\./i.test(line);
                    const hasCustomValidation = /function\s+\w*validate\w*email\w*/i.test(line) || /const\s+\w*validate\w*email\w*/i.test(line) || /email\s*[!=]==?\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);
                    const hasBuiltInValidation = /type\s*=\s*['"]email['"]/i.test(line) || /pattern\s*=\s*['"][^'"]*@[^'"]*\.[^'"]*['"]/i.test(line);

                    if ((hasAtIncludes && hasDotIncludes) || (hasAtIndexOf && hasDotIndexOf) || hasEmailRegex || hasCustomValidation || hasBuiltInValidation) {
                        hasEmailValidation = true;
                        break;
                    }
                }

                const codeWithoutComments = userCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
                const hasConditionalValidation = /if\s*\([^)]*email[^)]*[@.][^)]*\)/i.test(codeWithoutComments) || /if\s*\([^)]*!email[^)]*includes[^)]*[@.]/i.test(codeWithoutComments);

                return hasEmailValidation || hasConditionalValidation;

            case 'LawsOfTort_Database':
                const hasSecureDatabase = userCode.includes('secure database');
                const removedInsecureDatabase = !userCode.includes('insecure database');
                const hasSecurityMeasures = /secure|encrypt|hash|auth|token|ssl|https/i.test(userCode);
                const hasSecureConnection = /secure\s+(connection|database|storage)/i.test(userCode);

                return hasSecureDatabase && removedInsecureDatabase && (hasSecurityMeasures || hasSecureConnection);

            case 'Bankruptcy':
                const hasSecureAuth = userCode.includes('secure database');
                const hasAuthValidation = /password[^}]*length|password[^}]*strength|authenticate|authorization|login[^}]*validation/i.test(userCode);
                const hasSecurityCheck = /if\s*\([^)]*username[^)]*&&[^)]*password/i.test(userCode) || /if\s*\([^)]*password[^)]*&&[^)]*username/i.test(userCode);
                const hasProperLogin = /login[^}]*function|function[^}]*login|const[^}]*login/i.test(userCode);

                return hasSecureAuth && (hasAuthValidation || hasSecurityCheck || hasProperLogin);

            default:
                return false;
        }
    }, [userCode]);

    const getChallengeStatus = useCallback(() => {
        const challenges = getCurrentChallenges();
        return challenges.map(challenge => ({
            id: challenge.id,
            message: challenge.initialMessage,
            isFixed: isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'),
            penaltyKey: challenge.penaltyKey
        }));
    }, [getCurrentChallenges, isFixApplied]);

    const validateWinConditions = useCallback(() => {
        const challengeStatus = getChallengeStatus();
        const remainingIssues = challengeStatus
            .filter(status => !status.isFixed)
            .map(status => status.message);

        const canWin = remainingIssues.length === 0;
        return { canWin, remainingIssues };
    }, [getChallengeStatus]);

    const generateFinalCode = useCallback(async (isSubmissionAttempt = false) => {
        const { canWin } = validateWinConditions();

        if (isSubmissionAttempt && !canWin) {
            setShowFixFirstPopup(true);
            return;
        }

        if (isRunning) {
            setIsRunning(false);
            setGameState('game_over');
        }

        const isSuccessfulCompletion = canWin;
        const completionStatus = isSuccessfulCompletion ? 'SUCCESS' : 'INCOMPLETE';
        const timeElapsed = selectedGameTime - timeRemaining;

        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSE3CWA Generated Code - ${completionStatus}</title>
</head>
<body>
    ${userCode}
    
    <script>
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

        try {
            console.log('Attempting to save result to API...');
        } catch (error) {
            console.error('Error saving result:', error);
        }
    }, [validateWinConditions, isRunning, selectedGameTime, timeRemaining, userCode]);

    const addToPopupQueue = useCallback((message: Message) => {
        if (message.priority === 'critical') {
            setCriticalQueue(prev => [...prev, message]);
        } else {
            setMinorQueue(prev => [...prev, message]);
        }
    }, []);

    const handleClosePopup = useCallback(() => {
        setCurrentPopup(null);
        if (criticalQueue.length > 0) {
            const nextMessage = criticalQueue[0];
            setCriticalQueue(prev => prev.slice(1));
            setCurrentPopup(nextMessage);
        } else if (minorQueue.length > 0) {
            const nextMessage = minorQueue[0];
            setMinorQueue(prev => prev.slice(1));
            setCurrentPopup(nextMessage);
        }
    }, [criticalQueue, minorQueue]);

    const handleToggleHistory = () => {
        setShowMessageHistory(prev => !prev);
    };

    const handleMarkAllRead = () => {
        setUnreadCount(0);
    };

    const handleCloseFixFirstPopup = () => {
        setShowFixFirstPopup(false);
    };

    const handlePauseResume = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        resetGame();
    };


    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined;

        if (isRunning && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            setIsRunning(false);
            const { canWin } = validateWinConditions();

            if (canWin) {
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
    }, [isRunning, timeRemaining, gameState, validateWinConditions]);

    useEffect(() => {
        if (gameState !== 'playing' || !isRunning || penaltyScreen) return;

        const elapsedTime = selectedGameTime - timeRemaining;
        const challenges = getCurrentChallenges();

        const getNextSafeDistractionTime = (currentTime: number): number => {
            const bufferZone = 5;
            let nextSafeTime = currentTime + 1;

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

            return -1;
        };

        const getDistractionFrequencyForDifficulty = (difficulty: string, gameTime: number): { interval: number, maxCount: number } => {
            switch (difficulty) {
                case 'easy':
                    return { interval: Math.max(20, Math.floor(gameTime * 0.33)), maxCount: 2 };
                case 'medium':
                    return { interval: Math.max(12, Math.floor(gameTime * 0.08)), maxCount: Math.floor(gameTime / 15) };
                case 'difficult':
                    return { interval: Math.max(7, Math.floor(gameTime * 0.025)), maxCount: Math.floor(gameTime / 8) };
                default:
                    return { interval: 15, maxCount: 5 };
            }
        };


        challenges.forEach(challenge => {
            const challengeKey = `${challenge.id}_${challenge.initialTime}`;
            const isCurrentlyFixed = isFixApplied(challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy');

            if (elapsedTime >= challenge.initialTime && !processedChallenges.has(`${challengeKey}_initial`)) {
                const message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.initialTime,
                    source: 'Ethical/Legal',
                    text: challenge.initialMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                };

                const categorizedMessage = categorizeMessage(message, elapsedTime);
                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]);
                setUnreadCount(prev => prev + 1);
                currentPopup ? addToPopupQueue(categorizedMessage) : setCurrentPopup(categorizedMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_initial`]));
            }

            if (isCurrentlyFixed && processedChallenges.has(`${challengeKey}_initial`) && !processedChallenges.has(`${challengeKey}_urgent`)) {
                setCriticalQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                setMinorQueue(prev => prev.filter(m => m.penaltyKey !== challenge.penaltyKey));
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`, `${challengeKey}_penalty`]));
            }

            if (elapsedTime >= challenge.urgentTime &&
                !processedChallenges.has(`${challengeKey}_urgent`) &&
                !isCurrentlyFixed) {

                const message: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.urgentTime,
                    source: 'Ethical/Legal',
                    text: challenge.urgentMessage,
                    isCritical: true,
                    penaltyKey: challenge.penaltyKey as 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy',
                };

                const categorizedMessage = categorizeMessage(message, elapsedTime);
                setCurrentMessages(prev => [...prev, categorizedMessage]);
                setMessageHistory(prev => [...prev, categorizedMessage]);
                setUnreadCount(prev => prev + 1);
                addToPopupQueue(categorizedMessage);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_urgent`]));
            }

            if (elapsedTime >= challenge.penaltyTime &&
                !processedChallenges.has(`${challengeKey}_penalty`) &&
                !isCurrentlyFixed) {

                setPenaltyScreen(challenge.penaltyMessage);
                setPenalties(prev => [...prev, challenge.penaltyKey]);
                setIsRunning(false);
                setGameState('game_over');

                const penaltyMessage: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                    id: challenge.penaltyTime,
                    source: 'Court Order',
                    text: `PENALTY: ${challenge.penaltyMessage}`,
                    isCritical: true,
                    penaltyKey: 'PENALTY',
                };
                setMessageHistory(prev => [...prev, categorizeMessage(penaltyMessage, elapsedTime)]);
                setProcessedChallenges(prev => new Set([...prev, `${challengeKey}_penalty`]));
            }
        });

        const difficulty = getCurrentDifficulty();
        const { interval, maxCount } = getDistractionFrequencyForDifficulty(difficulty, selectedGameTime);
        const nextSafeTime = getNextSafeDistractionTime(elapsedTime);

        const shouldGenerateDistraction =
            (elapsedTime - lastDistractionTime >= interval) &&
            distractionMessages.length < maxCount &&
            nextSafeTime > elapsedTime && nextSafeTime !== -1;

        if (shouldGenerateDistraction) {
            const randomMessageIndex = Math.floor(Math.random() * DISTRACTION_MESSAGES.length);
            const distractionData = DISTRACTION_MESSAGES[randomMessageIndex];

            const distractionMessage: Omit<Message, 'timestamp' | 'gameTime' | 'messageType' | 'priority'> = {
                id: elapsedTime,
                source: distractionData.source,
                text: distractionData.text,
                isCritical: false,
                penaltyKey: 'Distraction',
            };

            const categorizedMessage = categorizeMessage(distractionMessage, elapsedTime);
            setCurrentMessages(prev => [...prev, categorizedMessage]);
            setMessageHistory(prev => [...prev, categorizedMessage]);
            setUnreadCount(prev => prev + 1);
            setDistractionMessages(prev => [...prev, categorizedMessage]);
            setLastDistractionTime(elapsedTime);

            currentPopup ? addToPopupQueue(categorizedMessage) : setCurrentPopup(categorizedMessage);
        }
    }, [gameState, isRunning, timeRemaining, selectedGameTime, penalties, processedChallenges, currentPopup, lastDistractionTime, getCurrentChallenges, getCurrentDifficulty, isFixApplied, addToPopupQueue, penaltyScreen, distractionMessages.length]);


    return (
        <div className={styles.gameContainer}>
            <GameOverlay
                gameState={gameState}
                penaltyScreen={penaltyScreen}
                showWinPopup={showWinPopup}
                showFixFirstPopup={showFixFirstPopup}
                selectedGameTime={selectedGameTime}
                timeRemaining={timeRemaining}
                penalties={penalties}
                onClosePenalty={() => { setPenaltyScreen(null); resetGame(); }}
                onResetGame={() => { setShowWinPopup(false); resetGame(); }}
                onGenerateFinalCode={() => generateFinalCode(false)}
                getCurrentDifficulty={getCurrentDifficulty}
                getChallengeStatus={getChallengeStatus}
                formatTime={formatTime}
                onCloseFixFirstPopup={handleCloseFixFirstPopup}
            />

            {gameState === 'welcome' && (
                <GameSetup
                    selectedGameTime={selectedGameTime}
                    onSelectTime={setSelectedGameTime}
                    onStartGame={handleStartGame}
                />
            )}

            {(gameState === 'playing' || gameState === 'game_over') && !penaltyScreen && (
                <div className={styles.gameLayout}>
                    <CodeEditorPanel
                        userCode={userCode}
                        timeRemaining={timeRemaining}
                        selectedGameTime={selectedGameTime}
                        isRunning={isRunning}
                        challengeStatus={getChallengeStatus()}
                        onCodeChange={setUserCode}
                        onGenerateFinalCode={() => generateFinalCode(true)}
                        onPauseResume={handlePauseResume}
                        onReset={handleReset}
                        formatTime={formatTime}
                    />
                    <MessageCenter
                        currentPopup={currentPopup}
                        currentMessages={currentMessages}
                        messageHistory={messageHistory}
                        unreadCount={unreadCount}
                        showMessageHistory={showMessageHistory}
                        formatMessageTime={formatMessageTime}
                        onClosePopup={handleClosePopup}
                        onToggleHistory={handleToggleHistory}
                        onMarkAllRead={handleMarkAllRead}
                    />
                </div>
            )}
        </div>
    );
};

export default CourtRoomPage;