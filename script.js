// script.js (at the top)

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

// Function to generate the checklist in the HTML
function generateTopicChecklist() {
    const form = document.getElementById('topic-form');
    TOPICS.forEach(topic => {
        const div = document.createElement('div');
        div.classList.add('topic-item');
        div.innerHTML = `
            <input type="checkbox" id="check-${topic}" name="topic-check" value="${topic}">
            <label for="check-${topic}">${topic}</label>
            <input type="number" id="time-${topic}" class="time-input" value="3" min="1" required>
            <span>min</span>
        `;
        form.appendChild(div);
    });
}

generateTopicChecklist(); // Run on load