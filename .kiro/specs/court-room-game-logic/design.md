# Design Document

## Overview

The Court Room Challenge is a React-based debugging simulation game that creates a realistic coding environment with time pressure, distractions, and escalating consequences. The design emphasizes dynamic timing, intelligent message queuing, and flexible code validation to provide an engaging educational experience.

## Architecture

### Component Structure
```
CourtRoomPage (Main Component)
├── Welcome Screen (Difficulty Selection)
├── Game Screen (Active Gameplay)
│   ├── Header (Timer & Controls)
│   ├── Message System (Icon & History)
│   ├── Code Editor (Textarea)
│   ├── Output Display
│   └── Popup System (Messages & Notifications)
├── Penalty Screen (Game Over)
└── Win/Completion Modals
```

### State Management Architecture
The game uses React hooks for comprehensive state management:

- **Game State**: `'welcome' | 'playing' | 'game_over'`
- **Timer State**: Current time, running status, selected duration
- **Message State**: Current messages, history, popup queue, unread count
- **Challenge State**: Active debugging issues, completion tracking
- **UI State**: Popup visibility, penalty screens, modal states

## Components and Interfaces

### Core Game Logic Components

#### 1. Difficulty Configuration System
```typescript
interface DifficultyOption {
  time: number;           // Duration in seconds
  label: string;          // Display label
  difficulty: string;     // Difficulty name
  color: string;          // UI styling
}

interface DebuggingChallenge {
  id: string;             // Unique identifier
  penaltyKey: string;     // Validation key
  initialMessage: string; // First notification
  urgentMessage: string;  // Escalation message
  penaltyMessage: string; // Game over message
  initialTime: number;    // When to show first message
  urgentTime: number;     // When to show urgent message
  penaltyTime: number;    // When to trigger penalty
}
```

#### 2. Message System
```typescript
interface Message {
  id: number;             // Timestamp/sequence ID
  source: MessageSource;  // Origin of message
  text: string;           // Message content
  isCritical: boolean;    // Priority level
  penaltyKey?: string;    // Associated debugging issue
}

type MessageSource = 'Boss' | 'Family' | 'Agile' | 'Ethical/Legal';
```

#### 3. Dynamic Timing Calculator
The system calculates message timing based on proportional scaling:

- **Easy Mode**: 25%, 50%, 75% of game duration
- **Medium Mode**: 10-15% intervals with staggered timing
- **Difficult Mode**: Compressed timing with overlapping challenges

### Code Validation Engine

#### Flexible Pattern Matching
The validation system uses multiple detection strategies:

1. **Accessibility (Alt Tags)**
   - Regex pattern matching for `alt="..."` attributes
   - Counts all `<img>` tags vs. tags with alt attributes
   - Requires 100% coverage for validation

2. **Input Validation**
   - Detects email validation patterns (`includes('@')`, `includes('.')`)
   - Supports multiple validation approaches (indexOf, regex, includes)
   - Flexible matching for common coding solutions

3. **Security Issues**
   - String replacement detection (`'insecure database'` → `'secure database'`)
   - Keyword presence validation
   - Context-aware security pattern recognition

## Data Models

### Game State Model
```typescript
interface GameState {
  // Core game status
  gameState: 'welcome' | 'playing' | 'game_over';
  selectedGameTime: number;
  timeRemaining: number;
  isRunning: boolean;
  
  // Challenge tracking
  processedChallenges: Set<string>;
  penalties: string[];
  userCode: string;
  generatedOutput: string;
  
  // Message system
  currentMessages: Message[];
  messageHistory: Message[];
  currentPopup: Message | null;
  popupQueue: Message[];
  unreadCount: number;
  
  // UI state
  showMessageHistory: boolean;
  penaltyScreen: string | null;
  showWinPopup: boolean;
  showFixFirstPopup: boolean;
}
```

### Challenge Configuration Model
```typescript
interface ChallengeSet {
  easy: DebuggingChallenge[];
  medium: DebuggingChallenge[];
  difficult: DebuggingChallenge[];
}

// Dynamic challenge generation based on game duration
const getDebuggingChallenges = (gameDuration: number): ChallengeSet
```

## Error Handling

### Validation Error Recovery
- **Invalid Code Detection**: Graceful handling of syntax errors in user code
- **Timing Edge Cases**: Prevention of message overlap and queue corruption
- **State Synchronization**: Consistent state updates across timer and message systems

### User Experience Error Handling
- **Premature End Attempts**: Clear messaging when trying to end with unfixed issues
- **Timer Expiration**: Automatic game conclusion with appropriate messaging
- **Popup Queue Management**: Prevention of message loss during rapid interactions

## Testing Strategy

### Unit Testing Focus Areas
1. **Challenge Generation Logic**
   - Verify correct challenge sets for each difficulty
   - Validate timing calculations for different game durations
   - Test edge cases for very short/long game times

2. **Code Validation Engine**
   - Test pattern matching for all debugging issue types
   - Verify flexible validation accepts multiple solution approaches
   - Ensure false positive prevention

3. **Message Timing System**
   - Validate proportional timing calculations
   - Test message scheduling and queue management
   - Verify distraction timing avoids critical message conflicts

### Integration Testing
1. **Complete Game Flow**
   - End-to-end gameplay for each difficulty level
   - Message popup sequencing and queue processing
   - Timer synchronization with message system

2. **State Management**
   - Concurrent state updates during active gameplay
   - Popup queue integrity during rapid user interactions
   - Game reset and restart functionality

### User Acceptance Testing
1. **Gameplay Experience**
   - Difficulty progression feels appropriate
   - Message timing creates realistic pressure
   - Code validation responds to common solutions

2. **Educational Value**
   - Players learn from debugging challenges
   - Escalation system teaches consequence awareness
   - Distraction simulation mirrors real development environment

## Performance Considerations

### Timer Optimization
- Single interval timer with 1-second precision
- Efficient state updates to prevent unnecessary re-renders
- Cleanup of intervals on component unmount

### Message System Efficiency
- Queue-based popup management prevents UI blocking
- Lazy evaluation of challenge conditions
- Minimal DOM updates for message history

### Code Editor Performance
- Debounced validation to prevent excessive processing
- Efficient regex pattern matching
- Optimized string operations for large code blocks

## Security Considerations

### Input Validation
- Sanitization of user code input to prevent XSS
- Safe HTML generation for output display
- Validation of timing parameters to prevent manipulation

### Data Persistence
- Secure storage of game results
- Protection of user-generated code content
- Safe handling of penalty and completion data

## Accessibility Features

### Keyboard Navigation
- Full keyboard support for all game controls
- Accessible popup management and dismissal
- Screen reader compatible message announcements

### Visual Design
- High contrast color schemes for critical messages
- Clear visual hierarchy for different message types
- Responsive design for various screen sizes

### Cognitive Accessibility
- Clear instructions and feedback messages
- Consistent UI patterns throughout the game
- Progressive difficulty to accommodate different skill levels