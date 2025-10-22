export type Message = {
  id: number;
  source: 'Boss' | 'Family' | 'Agile' | 'Ethical/Legal';
  text: string;
  isCritical: boolean; // True for messages that lead to a fine if ignored
  penaltyKey?: 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy'; // What the penalty relates to
  timestamp?: Date; // Actual timestamp when message was received (optional, added at runtime)
  gameTime?: number; // Game time when message appeared (optional, added at runtime)
  messageType?: 'initial' | 'urgent' | 'distraction'; // Enhanced message categorization for better distinction
  priority?: 'low' | 'medium' | 'high' | 'critical'; // Priority level for enhanced sorting and display
};

// Array of timed messages. The 'id' will represent the approximate time (in seconds)
// when the message should first appear. We'll use 30-second intervals initially.
export const GAME_MESSAGES: Message[] = [
  // Time: 30 seconds
  { id: 30, source: 'Boss', text: 'Are you done with sprint 1? The client is asking for a demo.', isCritical: false },
  
  // Time: 60 seconds
  { id: 60, source: 'Family', text: 'Can you pick up the kids after work? I have a late meeting.', isCritical: false },

  // Time: 90 seconds - Critical Accessibility Fix
  { id: 90, source: 'Ethical/Legal', text: 'URGENT: fix alt in img1 (Accessibility issue).', isCritical: true, penaltyKey: 'DisabilityAct' },
  
  // Time: 120 seconds
  { id: 120, source: 'Agile', text: 'Fix: change Title colour to Red per product owner request.', isCritical: false },

  // Time: 150 seconds - Critical Security Fix
  { id: 150, source: 'Ethical/Legal', text: 'URGENT: Fix input validation (Security issue).', isCritical: true, penaltyKey: 'LawsOfTort_Validation' },
  
  // Time: 180 seconds - Critical Database Fix
  { id: 180, source: 'Ethical/Legal', text: 'URGENT: Fix Secure Database (Major security issue).', isCritical: true, penaltyKey: 'LawsOfTort_Database' },

];