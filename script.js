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
let demoQueue = []; // Holds the list of topics to run
let currentTopicIndex = -1;
let countdownInterval = null;
let totalTimeSeconds = 0;
let remainingTimeSeconds = 0;

// --- DOM ELEMENT REFERENCES ---
const startButton = document.getElementById('start-demo-btn');
const resetButton = document.getElementById('reset-times-btn');
const topicForm = document.getElementById('topic-form');
const iframeContainer = document.getElementById('iframe-container');
const iframe = document.getElementById('timer-iframe');
const topicNameDisplay = document.getElementById('current-topic-name');
const totalMinutesDisplay = document.getElementById('total-minutes');

// --- INITIAL SETUP AND UTILITIES ---

function calculateTotalTime() {
    let totalMinutes = 0;
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        const duration = parseInt(input.value) || 0;
        // Only tally if the box is checked AND time > 0
        const isChecked = input.parentElement.querySelector('input[type="checkbox"]').checked;
        if (isChecked && duration > 0) {
            totalMinutes += duration;
        }
    });
    totalMinutesDisplay.textContent = totalMinutes;
}

function generateTopicChecklist() {
    TOPICS.forEach(topic => {
        const div = document.createElement('div');
        div.classList.add('topic-item');
        div.innerHTML = `
            <input type="checkbox" id="check-${topic}" name="topic-check" value="${topic}">
            <label for="check-${topic}">${topic}</label>
            <input type="number" id="time-${topic}" class="time-input" value="0" min="0" required>
            <span>min</span>
        `;
        topicForm.appendChild(div);
    });

    // Add listener to recalculate total time whenever a value changes
    topicForm.addEventListener('change', calculateTotalTime);
    topicForm.addEventListener('input', calculateTotalTime);
}

function resetAllTimes() {
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        input.value = "0";
        input.parentElement.querySelector('input[type="checkbox"]').checked = false;
    });
    calculateTotalTime();
    alert("All topic times have been reset to 0 and checkboxes cleared.");
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// --- IFRAME COMMUNICATION (To update the visual timer) ---
function updateIframeDisplay(topicName, timeString, colorClass, topicIndex) {
    // Check if the iframe content is loaded before sending messages
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
            topic: topicName,
            time: timeString,
            color: colorClass,
            // Pass the current state to the iframe
        }, '*'); 
    }
}

// --- TIMER LOGIC ---

function updateVisualIndicator(remaining) {
    const visualDiv = iframe.contentDocument.getElementById('visual-indicator');
    
    // Check the new color thresholds
    if (remaining <= 10) {
        return 'red';      // RED: 10 seconds or less
    } else if (remaining <= 60) {
        return 'yellow';   // YELLOW: 1 minute (60 seconds) or less
    } else {
        return 'green';    // GREEN: More than 1 minute
    }
}

function runCountdown() {
    remainingTimeSeconds--;

    const timeString = formatTime(Math.max(0, remainingTimeSeconds));
    const colorClass = updateVisualIndicator(remainingTimeSeconds);
    
    // Send updated data to the iframe
    updateIframeDisplay(demoQueue[currentTopicIndex].name, timeString, colorClass);

    if (remainingTimeSeconds <= 0) {
        clearInterval(countdownInterval);
        topicNameDisplay.textContent = `${demoQueue[currentTopicIndex].name}: TIME UP!`;
        
        // ** MOVE TO NEXT TOPIC **
        currentTopicIndex++;
        if (currentTopicIndex < demoQueue.length) {
            startTimer(demoQueue[currentTopicIndex].name, demoQueue[currentTopicIndex].duration);
        } else {
            // Demo sequence finished
            topicNameDisplay.textContent = "DEMO SEQUENCE COMPLETE!";
            updateIframeDisplay("Demo Complete", "00:00", 'time-up');
        }
    }
}

function startTimer(topicName, durationMinutes) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    totalTimeSeconds = durationMinutes * 60;
    remainingTimeSeconds = totalTimeSeconds;
    
    // This check should already be handled when building the queue, but keep as a safeguard
    if (totalTimeSeconds <= 0) {
        currentTopicIndex++; 
        if (currentTopicIndex < demoQueue.length) {
             startTimer(demoQueue[currentTopicIndex].name, demoQueue[currentTopicIndex].duration);
        }
        return;
    }

    topicNameDisplay.textContent = `${currentTopicIndex + 1}/${demoQueue.length}: ${topicName}`;
    iframeContainer.classList.remove('hidden');

    // Initial display and start
    const initialTimeString = formatTime(remainingTimeSeconds);
    updateIframeDisplay(topicName, initialTimeString, updateVisualIndicator(remainingTimeSeconds));
    
    countdownInterval = setInterval(runCountdown, 1000);
}

function startDemoSequence() {
    demoQueue = []; // Clear the old queue

    // 1. Build the queue from checked topics with time > 0
    const checkedTopics = Array.from(document.querySelectorAll('input[name="topic-check"]:checked'));
    checkedTopics.forEach(checkbox => {
        const topicName = checkbox.value;
        const timeInputId = `time-${topicName}`;
        const duration = parseInt(document.getElementById(timeInputId).value) || 0;
        
        if (duration > 0) {
            demoQueue.push({ name: topicName, duration: duration });
        }
    });

    if (demoQueue.length === 0) {
        alert("Please check topics and ensure they have a time greater than 0 minutes to start the sequence.");
        return;
    }

    // 2. Start the first topic
    currentTopicIndex = 0;
    startTimer(demoQueue[currentTopicIndex].name, demoQueue[currentTopicIndex].duration);
}

// --- EVENT LISTENERS ---

startButton.addEventListener('click', startDemoSequence);
resetButton.addEventListener('click', resetAllTimes);

// The "Open Full-Screen Timer" button is no longer needed but we'll remove its listener

// Run this when the page loads
generateTopicChecklist();
calculateTotalTime(); 

// Handle messages from the parent window (for the iframe content)
window.addEventListener('message', function(event) {
    const data = event.data;
    if (data.topic) {
        // Ensure the display elements exist if we are in the iframe window
        const visualIndicator = document.getElementById('visual-indicator');
        const screenTimerText = document.getElementById('screen-timer-text');
        const screenTopicText = document.getElementById('screen-topic-text');
        
        if (visualIndicator) {
            visualIndicator.className = 'full-screen-display ' + data.color;
            screenTimerText.textContent = data.time;
            screenTopicText.textContent = data.topic;
        }
    }
});