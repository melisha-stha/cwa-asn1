import React from 'react';
import styles from '@/app/court-room/court-room.module.css';;
import { Message } from '../messages'; // Assuming 'messages.ts' is at the root

interface MessageCenterProps {
    currentPopup: Message | null;
    messageHistory: Message[];
    showMessageHistory: boolean;
    formatMessageTime: (message: Message) => string;
    onClosePopup: () => void;
    onToggleHistory: () => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
    currentPopup,
    messageHistory,
    showMessageHistory,
    formatMessageTime,
    onClosePopup,
    onToggleHistory
}) => {
    return (
        <div className={styles.messageCenter}>
            {/* Current Popup */}
            {currentPopup && (
                <div className={styles.messagePopup}>
                    <div className={styles.popupHeader}>
                        <span className={styles.popupSource}>{currentPopup.source}</span>
                        <button onClick={onClosePopup} className={styles.closePopup}>X</button>
                    </div>
                    <p className={styles.popupText}>{currentPopup.text}</p>
                    <small className={styles.popupTime}>{formatMessageTime(currentPopup)}</small>
                </div>
            )}

            {/* Message History Panel */}
            {showMessageHistory && (
                <div className={styles.messageHistoryPanel}>
                    <div className={styles.historyHeader}>
                        <h3>Message History</h3>
                        <button onClick={onToggleHistory} className={styles.closeHistory}>X</button>
                    </div>
                    <div className={styles.historyList}>
                        {[...messageHistory].reverse().map((message, index) => (
                            <div key={index} className={`${styles.historyItem} ${message.isCritical ? styles.criticalMessage : styles.minorMessage}`}>
                                <p className={styles.historyText}>
                                    <span className={styles.historySource}>[{message.source}]</span> {message.text}
                                </p>
                                <small className={styles.historyTime}>{formatMessageTime(message)}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageCenter;