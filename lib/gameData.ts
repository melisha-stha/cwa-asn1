import { Message } from '../messages'; // Assuming 'messages.ts' is at the root or correctly linked

// --- Game Configuration Data ---

export const TIME_OPTIONS = [
    { time: 60, label: '1 min', difficulty: 'Easy', color: 'bg-green-600 hover:bg-green-700' },
    { time: 300, label: '5 mins', difficulty: 'Medium', color: 'bg-orange-600 hover:bg-orange-700' },
    { time: 600, label: '10 mins', difficulty: 'Difficult', color: 'bg-red-600 hover:bg-red-700' },
];

export const getDebuggingChallenges = (gameDuration: number) => {
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
export const DISTRACTION_MESSAGES: Omit<Message, 'id' | 'isCritical' | 'penaltyKey' | 'timestamp' | 'gameTime' | 'messageType' | 'priority'>[] = [
    { source: 'Family', text: 'Can you pick up the kids after work? I have a late meeting.' },
    { source: 'Boss', text: 'Are you done with sprint 1? The client is asking for a demo.' },
    { source: 'Agile', text: 'Fix: change Title colour to Red per product owner request.' },
    { source: 'Family', text: 'Don\'t forget about dinner tonight!' },
    { source: 'Boss', text: 'The deadline is approaching, how is the project going?' },
    { source: 'Agile', text: 'We need to update the user interface design.' }
];

// Difficulty-specific buggy code templates
export const EASY_CODE = `
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

export const MEDIUM_CODE = `
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

export const DIFFICULT_CODE = `
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