import React from 'react';
import styles from '@/app/court-room/court-room.module.css';
import { TIME_OPTIONS } from '../../lib/gameData';

interface GameSetupProps {
    selectedGameTime: number;
    onSelectTime: (time: number) => void;
    onStartGame: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ selectedGameTime, onSelectTime, onStartGame }) => {
    return (
        <div className={styles.welcomeScreen}>
            <h1 className={styles.welcomeTitle}>Court Room Challenge</h1>
            <p className={styles.welcomeText}>
                Fix the bugs in the code before you get fined for ethical or legal violations!
                You must fix **ALL** issues to win.
            </p>
            <div className={styles.difficultySelection}>
                <h2 className={styles.difficultyTitle}>Select Game Duration / Difficulty</h2>
                <div className={styles.timeOptions}>
                    {TIME_OPTIONS.map((option) => (
                        <button
                            key={option.time}
                            onClick={() => onSelectTime(option.time)}
                            className={`${styles.timeOptionBtn} ${selectedGameTime === option.time ? styles.selectedTime : ''}`}
                            style={{ 
                                // Simple styling application for selected state, assuming utility classes in CSS
                                backgroundColor: selectedGameTime === option.time ? (option.color.split(' ')[0].replace('bg-', '#').replace('-600', 'a')) : undefined,
                                borderColor: selectedGameTime === option.time ? (option.color.split(' ')[0].replace('bg-', '#').replace('-600', 'a')) : undefined,
                            }}
                        >
                            <span>{option.label}</span>
                            <span className={styles.difficultyLabel}>{option.difficulty}</span>
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={onStartGame}
                className={styles.startBtn}
            >
                Start Game
            </button>
        </div>
    );
};

export default GameSetup;