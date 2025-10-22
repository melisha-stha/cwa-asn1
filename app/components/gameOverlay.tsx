import React from 'react';
import styles from '@/app/court-room/court-room.module.css';

interface ChallengeStatus {
    id: string;
    message: string;
    isFixed: boolean;
    penaltyKey: string;
}

interface GameOverlayProps {
    gameState: 'welcome' | 'playing' | 'game_over';
    penaltyScreen: string | null;
    showWinPopup: boolean;
    showFixFirstPopup: boolean;
    selectedGameTime: number;
    timeRemaining: number;
    penalties: string[];
    onClosePenalty: () => void;
    onResetGame: () => void;
    onGenerateFinalCode: () => void;
    getCurrentDifficulty: () => 'easy' | 'medium' | 'difficult';
    getChallengeStatus: () => ChallengeStatus[];
    formatTime: (totalSeconds: number) => string;
    onCloseFixFirstPopup: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
    gameState,
    penaltyScreen,
    showWinPopup,
    showFixFirstPopup,
    selectedGameTime,
    timeRemaining,
    penalties,
    onClosePenalty,
    onResetGame,
    onGenerateFinalCode,
    getCurrentDifficulty,
    getChallengeStatus,
    formatTime,
    onCloseFixFirstPopup
}) => {
    const timeTaken = selectedGameTime - timeRemaining;
    const challenges = getChallengeStatus();
    const resolvedChallenges = challenges.filter(c => c.isFixed).length;

    // --- Dramatic Penalty Screen ---
    if (penaltyScreen) {
        return (
            <div className={styles.penaltyOverlay}>
                <div className={styles.courtRoomPenalty}>
                    <div className={styles.judgeSection}>
                        <img 
                            src="/angry-judge.webp" 
                            alt="Angry Judge" 
                            className={styles.angryJudge}
                        />
                        <div className={styles.penaltyContent}>
                            <h1 className={styles.penaltyTitle}>COURT ORDER</h1>
                            <h2 className={styles.penaltySubtitle}>PENALTY ISSUED</h2>
                            <div className={styles.penaltyText}>
                                <p className={styles.penaltyMessage}>{penaltyScreen}</p>
                            </div>
                            <button onClick={onClosePenalty} className={styles.penaltyAcknowledgeBtn}>
                                ACKNOWLEDGE PENALTY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Game Over Screen (Loss) ---
    if (gameState === 'game_over' && !showWinPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.gameOverBox}>
                    <h2 className={styles.gameOverHeader}>TIME EXPIRED</h2>
                    <h1 className={styles.gameOverTitle}>Game Over</h1>
                    <p className={styles.gameOverMessage}>
                        You failed to fix all bugs before the time ran out.
                    </p>
                    <ul className={styles.finalStats}>
                        <li>Difficulty: {getCurrentDifficulty().slice(1)}</li>
                        <li>Time Elapsed: {formatTime(timeTaken)}</li>
                        <li>Issues Fixed: {resolvedChallenges} / {challenges.length}</li>
                        <li>Total Penalties: {penalties.length}</li>
                    </ul>
                    <button onClick={onResetGame} className={styles.controlBtn}>
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    // --- Win Popup (All Fixed) ---
    if (showWinPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.winBox}>
                    <h2 className={styles.winHeader}>SUCCESS!</h2>
                    <h1 className={styles.winTitle}>Case Closed!</h1>
                    <p className={styles.winMessage}>
                        Congratulations! You successfully fixed all the critical issues.
                    </p>
                    <div className={styles.winSummary}>
                        <p>Your Final Results:</p>
                        <ul className={styles.finalStats}>
                            <li>Time Taken: {formatTime(timeTaken)}</li>
                            <li>Difficulty: {getCurrentDifficulty().slice(1)}</li>
                            <li>Issues resolved: {challenges.length} of {challenges.length}</li>
                            <li>{penalties.length === 0 ? 'No penalties incurred' : `Total Penalties: ${penalties.length}`}</li>
                        </ul>
                    </div>
                    <div className={styles.popupActions}>
                        <button onClick={onResetGame} className={styles.controlBtn}>
                            Play New Game
                        </button>
                        <button onClick={onGenerateFinalCode} className={styles.popupOkBtn}>
                            Generate Final Code
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Fix First Popup (Prevent early submission) ---
    if (showFixFirstPopup) {
        return (
            <div className={styles.overlay}>
                <div className={styles.fixFirstBox}>
                    <h2 className={styles.fixFirstHeader}>REMAINING ISSUES</h2>
                    <p className={styles.fixFirstMessage}>
                        You must fix ALL legal and ethical violations before submitting.
                    </p>
                    <ul className={styles.fixList}>
                        {challenges.filter(c => !c.isFixed).map(c => (
                            <li key={c.id}>{c.message}</li>
                        ))}
                    </ul>
                    <button onClick={onCloseFixFirstPopup} className={styles.popupOkBtn}>
                        Back to Coding
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default GameOverlay;