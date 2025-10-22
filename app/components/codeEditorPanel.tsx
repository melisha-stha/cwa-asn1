import React from 'react';
import styles from '@/app/court-room/court-room.module.css';

interface ChallengeStatus {
    id: string;
    message: string;
    isFixed: boolean;
    penaltyKey: string;
}

interface CodeEditorPanelProps {
    userCode: string;
    timeRemaining: number;
    selectedGameTime: number;
    isRunning: boolean;
    challengeStatus: ChallengeStatus[];
    onCodeChange: (newCode: string) => void;
    onGenerateFinalCode: () => void;
    formatTime: (totalSeconds: number) => string;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
    userCode,
    timeRemaining,
    selectedGameTime,
    isRunning,
    challengeStatus,
    onCodeChange,
    onGenerateFinalCode,
    formatTime,
}) => {
    const timeElapsed = selectedGameTime - timeRemaining;
    const areAllFixed = challengeStatus.every(c => c.isFixed);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Court Room Challenge - Debugging</h1>
                    <p className={styles.studentNo}>Time Elapsed: {formatTime(timeElapsed)}</p>
                </div>
                <div className={styles.timerControls}>
                    <div className={styles.timer}>
                        Time Remaining: <span className={styles.timerValue}>{formatTime(timeRemaining)}</span>
                    </div>
                    <button
                        onClick={onGenerateFinalCode}
                        disabled={!isRunning || !areAllFixed}
                        className={`${styles.controlBtn} ${!isRunning || !areAllFixed ? styles.disabled : styles.submitBtn}`}
                    >
                        Submit Final Code
                    </button>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.codeEditor}>
                    <h2 className={styles.panelTitle}>Buggy Code Editor</h2>
                    <textarea
                        value={userCode}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className={styles.codeArea}
                        spellCheck="false"
                    />
                </div>

                <div className={styles.previewPanel}>
                    <h2 className={styles.panelTitle}>Output Preview</h2>
                    <div className={styles.previewArea}>
                        <iframe
                            title="Code Preview"
                            srcDoc={userCode}
                            className={styles.iframe}
                        />
                    </div>
                    <div className={styles.statusPanel}>
                        <h2 className={styles.statusTitle}>Challenge Status</h2>
                        <ul className={styles.challengeList}>
                            {challengeStatus.length === 0 ? (
                                <li>Loading challenges...</li>
                            ) : (
                                challengeStatus.map((challenge, index) => (
                                    <li key={index} className={challenge.isFixed ? styles.fixed : styles.unfixed}>
                                        <span className={styles.challengeMessage}>{challenge.message}</span>
                                        <span className={styles.fixStatus}>{challenge.isFixed ? 'FIXED' : 'UNFIXED'}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                        <p className={styles.finalStatus}>
                            **Final Submission Status:** {areAllFixed ? 'READY TO SUBMIT' : 'ISSUES REMAIN'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPanel;