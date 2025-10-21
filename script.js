// script.js (Replace ALL content with this code)

const TOPICS = [
    "Inbound Voice", "Chat", "SMS 1:1", "Email", "Whatsapp", "Other",
    "Navigator", "Identity", "Guardian", "Workspace Designer", "Copilot",
    "Knowledge Management", "Autopilot", "Multi-Agent Orchestration",
    "Video/ Cobrowse", "Cases", "Integrations", "Client 360", "Online Banking",
    "CRM", "UCaaS", "Other (please specify)", "Builder Automations",
    "Outbound: Automated Notifications", "Proactive Notifications",
    "Native Preview Dialer", "Talkdesk Dialer for Salesforce",
    "Noetica Advanced Dialer", "Quality Management", "Feedback",
    "Performance Management", "WFM", "Live", "Explore", "Studio", "Admin"
];

// Helper variables
let currentTopic = null;
let countdownInterval = null;
let totalTimeSeconds = 0;
let remainingTimeSeconds = 0;

// --- DOM ELEMENT REFERENCES ---
const startButton = document.getElementById('start-demo-btn');
const resetButton = document.getElementById('reset-times-btn');
const topicForm = document.getElementById('topic-form');
const currentTimerStatusDiv = document.getElementById('current-timer-status');
const topicNameDisplay = document.getElementById('current-topic-name');
const timeDisplay = document.getElementById('remaining-time');
const visualIndicator = document.getElementById('visual-indicator');
const screenTimerText = document.getElementById('screen-timer-text');
const screenTopicText = document.getElementById('screen-topic-text');


// --- INITIAL SETUP AND RESETS ---
function generateTopicChecklist() {
    TOPICS.forEach(topic => {
        const div = document.createElement('div');
        div.classList.add('topic-item');
        // Set default value to "0" to fix the input issue
        div.innerHTML = `
            <input type="checkbox" id="check-${topic}" name="topic-check" value="${topic}">
            <label for="check-${topic}">${topic}</label>
            <input type="number" id="time-${topic}" class="time-input" value="0" min="0" required>
            <span>min</span>
        `;
        topicForm.appendChild(div);
    });
}

function resetAllTimes() {
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        input.value = "0";
        input.parentElement.querySelector('input[type="checkbox"]').checked = false;
    });
    alert("All topic times have been reset to 0 and checkboxes cleared.");
}

// --- TIMER LOGIC ---
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateVisualIndicator(remaining, total) {
    const percentage = total === 0 ? 0 : (remaining / total) * 100;
    
    visualIndicator.className = ''; // Reset class
    
    if (percentage > 66) {
        visualIndicator.classList.add('green');
    } else if (percentage > 33) {
        visualIndicator.classList.add('yellow');
    } else if (percentage > 0) {
        visualIndicator.classList.add('red');
    } else {
        visualIndicator.classList.add('time-up');
    }
}

function runCountdown() {
    remainingTimeSeconds--;

    const timeString = formatTime(Math.max(0, remainingTimeSeconds));

    timeDisplay.textContent = timeString;
    screenTimerText.textContent = timeString;

    updateVisualIndicator(remainingTimeSeconds, totalTimeSeconds);

    if (remainingTimeSeconds <= 0) {
        clearInterval(countdownInterval);
        topicNameDisplay.textContent = `${currentTopic}: TIME UP!`;
        screenTopicText.textContent = `${currentTopic}: TIME UP!`;
        // In a real app, you might auto-start the next topic here.
    }
}

function startTimer(topicName, durationMinutes) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    totalTimeSeconds = durationMinutes * 60;
    remainingTimeSeconds = totalTimeSeconds;
    
    // Check if time is 0 and prevent starting
    if (totalTimeSeconds <= 0) {
        alert(`Time for "${topicName}" is set to 0. Please set a time greater than 0.`);
        return;
    }

    currentTopic = topicName;
    
    topicNameDisplay.textContent = topicName;
    screenTopicText.textContent = topicName;
    currentTimerStatusDiv.classList.remove('hidden');
    
    // Initial update before the interval starts
    runCountdown(); 
    
    // Start the countdown
    countdownInterval = setInterval(runCountdown, 1000);
}

// --- EVENT LISTENERS ---

startButton.addEventListener('click', () => {
    const checkedTopics = Array.from(document.querySelectorAll('input[name="topic-check"]:checked'));

    if (checkedTopics.length === 0) {
        alert("Please check a topic and set its time (min) to start the demo.");
        return;
    }

    // Get the first checked topic and its time
    const firstTopicCheckbox = checkedTopics[0];
    const firstTopicName = firstTopicCheckbox.value;
    const timeInputId = `time-${firstTopicName}`;
    
    // Use parseInt() to ensure we get a number, defaulting to 0 if input is invalid/blank
    const duration = parseInt(document.getElementById(timeInputId).value) || 0; 
    
    startTimer(firstTopicName, duration);
});

resetButton.addEventListener('click', resetAllTimes);

// The "Open Full-Screen Timer" button listener
document.getElementById('open-display-btn').addEventListener('click', () => {
    alert("Open your repository's live URL in a second, maximized browser window to use the full-screen timer display.");
});

// Run this when the page loads
generateTopicChecklist();