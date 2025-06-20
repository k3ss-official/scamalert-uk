/**
 * ChadCan.Help - Chad AI Chatbot Enhanced with Geolocation
 * Contains all logic for the AI chatbot assistant with location awareness
 */

// Global variables
let chatContext = 'general';
let freeTimeLeft = 600; // 10 minutes in seconds
let timerInterval;
let chatHistory = [];
let userLocation = null;

// Initialize maps and dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeUKMap();
    initializeWorldMap();
    startLiveCounters();
    startActivityFeed();
    // Get user location on page load
    getUserLocation();
});

// IP Geolocation function
async function getUserLocation() {
    try {
        // Using ipapi.co for free IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.city && data.country_name === 'United Kingdom') {
            userLocation = {
                city: data.city,
                region: data.region,
                country: data.country_name
            };
        } else if (data.city) {
            userLocation = {
                city: data.city,
                region: data.region,
                country: data.country_name
            };
        }
    } catch (error) {
        console.log('Could not get location:', error);
        // Fallback - no location data
        userLocation = null;
    }
}

// Generate location-based opening lines
function getLocationGreeting() {
    if (!userLocation) return '';
    
    const greetings = [
        `Hey, I see you're in ${userLocation.city} - my boss is from there too! `,
        `Nice to meet someone from ${userLocation.city}! I've helped quite a few people from your area. `,
        `${userLocation.city}, eh? I've been tracking some interesting scam patterns in your region lately. `,
        `Greetings from the digital world to ${userLocation.city}! `,
        `${userLocation.city} - lovely place! I've been monitoring scam activity across the UK and your area's been quite active. `
    ];
    
    // Return a random greeting
    return greetings[Math.floor(Math.random() * greetings.length)];
}

// UK Map with threat levels
function initializeUKMap() {
    const ukMap = L.map('ukMap').setView([54.5, -3.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(ukMap);

    // Add threat markers for major cities
    const threats = [
        {name: 'London', coords: [51.5074, -0.1278], level: 'high', count: 892},
        {name: 'Manchester', coords: [53.4808, -2.2426], level: 'high', count: 467},
        {name: 'Birmingham', coords: [52.4862, -1.8904], level: 'medium', count: 334},
        {name: 'Leeds', coords: [53.8008, -1.5491], level: 'medium', count: 289},
        {name: 'Glasgow', coords: [55.8642, -4.2518], level: 'medium', count: 245},
        {name: 'Liverpool', coords: [53.4084, -2.9916], level: 'low', count: 156}
    ];

    threats.forEach(threat => {
        const color = threat.level === 'high' ? '#dc2626' : threat.level === 'medium' ? '#f59e0b' : '#16a34a';

        L.circleMarker(threat.coords, {
            radius: Math.sqrt(threat.count) / 3,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6
        }).addTo(ukMap).bindPopup(`
            <strong>${threat.name}</strong><br>
            Threat Level: ${threat.level.toUpperCase()}<br>
            Active Scams: ${threat.count}
        `);
    });
}

// World Map for scam origins
function initializeWorldMap() {
    const worldMap = L.map('worldMap').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(worldMap);

    // Scam source regions
    const scamSources = [
        {name: 'Nigeria', coords: [9.0820, 8.6753], intensity: 85},
        {name: 'India', coords: [20.5937, 78.9629], intensity: 72},
        {name: 'Romania', coords: [45.9432, 24.9668], intensity: 68},
        {name: 'Russia', coords: [61.5240, 105.3188], intensity: 61},
        {name: 'China', coords: [35.8617, 104.1954], intensity: 45}
    ];

    scamSources.forEach(source => {
        L.circleMarker(source.coords, {
            radius: source.intensity / 8,
            fillColor: '#dc2626',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(worldMap).bindPopup(`
            <strong>${source.name}</strong><br>
            Scam Activity: ${source.intensity}%
        `);
    });
}

// Live counters animation
function startLiveCounters() {
    const counters = [
        {id: 'scamsToday', target: 2847, increment: 1},
        {id: 'moneyLost', target: 847000, increment: 100, prefix: '£', suffix: 'k'},
        {id: 'usersProtected', target: 12439, increment: 2},
        {id: 'activeThreats', target: 34, increment: 1}
    ];

    counters.forEach(counter => {
        let current = 0;
        const element = document.getElementById(counter.id);
        
        const interval = setInterval(() => {
            current += counter.increment;
            if (current >= counter.target) {
                current = counter.target;
                clearInterval(interval);
            }
            
            let display = current.toLocaleString();
            if (counter.prefix) display = counter.prefix + display;
            if (counter.suffix) display = display + counter.suffix;
            
            if (element) element.textContent = display;
        }, 50);
    });
}

// Activity feed
function startActivityFeed() {
    const activities = [
        'Blocked romance scam targeting user in Manchester',
        'Detected fake parcel notification in Birmingham',
        'Prevented crypto investment fraud in London',
        'Identified tech support scam in Leeds',
        'Stopped marketplace fraud in Glasgow',
        'Blocked HMRC phishing attempt in Liverpool',
        'Detected deepfake celebrity endorsement scam',
        'Prevented AnyDesk remote access fraud',
        'Blocked fake customs fee notification',
        'Identified suspicious dating profile'
    ];

    function addActivity() {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;

        const activity = activities[Math.floor(Math.random() * activities.length)];
        const time = new Date().toLocaleTimeString();
        
        const item = document.createElement('div');
        item.className = 'activity-item p-2 border-l-4 border-blue-500 bg-blue-50 mb-2';
        item.innerHTML = `
            <div class="text-sm text-gray-800">${activity}</div>
            <div class="text-xs text-gray-500">${time}</div>
        `;
        
        feed.insertBefore(item, feed.firstChild);
        
        // Keep only last 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    // Add initial activities
    for (let i = 0; i < 5; i++) {
        setTimeout(addActivity, i * 1000);
    }

    // Continue adding every 10 seconds
    setInterval(addActivity, 10000);
}

// Agreement modal functions
function showAgreement() {
    document.getElementById('agreementModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('agreementModal').classList.add('hidden');
}

// Chad session functions
function startChadSession() {
    closeModal();
    document.getElementById('chatModal').classList.remove('hidden');
    startFreeTimer();
    initializeChat();
}

function openChadWithContext(context) {
    chatContext = context;
    showAgreement();
}

async function initializeChat() {
    const messages = document.getElementById('chatMessages');
    const contextMessages = {
        'romance': 'I notice you clicked on "Romance Scams" - do you think you might have been targeted by someone online who\'s asking for money or seems too good to be true?',
        'marketplace': 'I see you clicked on "Facebook Marketplace Scams" - are you concerned about a seller or buyer you\'ve been dealing with? Maybe someone asking for unusual payment methods?',
        'parcel': 'I notice you clicked on "Fake Parcel Tracking" - have you received a suspicious text or email about a delivery, maybe asking for customs fees?',
        'crypto': 'I see you clicked on "Fake Crypto Investment" - have you seen ads featuring celebrities promoting investment opportunities?',
        'tech_support': 'I notice you clicked on "Tech Support Scams" - have you received unexpected calls about computer problems or been asked to install remote access software?',
        'customs': 'I see you clicked on "Fake Customs/HMRC" - have you received messages asking for payment of customs fees or tax refunds?',
        'general': 'How can I help you today?'
    };

    // Get location greeting
    const locationGreeting = getLocationGreeting();

    // Enhanced initial greeting with location awareness
    addMessage('chad', `${locationGreeting}Hi there! I'm Chad, your AI scam detection assistant.

I'm here to help you figure out if something suspicious might be a scam. Don't worry about being technical - just type and speak normally with me. Welcome to the AI age!

${contextMessages[chatContext]}`);
}

function addMessage(sender, text, typing = false) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    if (sender === 'chad') {
        messageDiv.className = 'flex items-start space-x-3';
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-white text-sm"></i>
            </div>
            <div class="chat-bubble bg-white rounded-lg p-3 shadow border ${typing ? 'typing-indicator' : ''}">
                ${typing ? '<span>Chad is typing...</span>' : `<p class="text-gray-800 whitespace-pre-wrap">${text}</p>`}
            </div>
        `;
    } else {
        messageDiv.className = 'flex items-start space-x-3 justify-end';
        messageDiv.innerHTML = `
            <div class="chat-bubble bg-blue-600 text-white rounded-lg p-3">
                <p class="whitespace-pre-wrap">${text}</p>
            </div>
            <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
        `;
    }

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;

    // Remove typing indicator after message is added
    if (typing) {
        setTimeout(() => {
            messageDiv.querySelector('.typing-indicator').classList.remove('typing-indicator');
            messageDiv.querySelector('span').outerHTML = `<p class="text-gray-800 whitespace-pre-wrap">${text}</p>`;
        }, 1500);
    }
}

// Timer functions
function startFreeTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    
    timerInterval = setInterval(() => {
        freeTimeLeft--;
        
        const minutes = Math.floor(freeTimeLeft / 60);
        const seconds = freeTimeLeft % 60;
        
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (freeTimeLeft <= 0) {
            clearInterval(timerInterval);
            addMessage('chad', 'Your free session has ended. Thank you for using ChadCan.Help!');
        }
    }, 1000);
}

// Send message function
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    
    // Add typing indicator
    const typingIndicator = addMessage('chad', '', true);
    
    try {
        // Prepare chat history for API
        chatHistory.push({ role: 'user', content: message });
        
        const systemPrompt = `You are Chad, an AI scam detection assistant for ChadCan.Help. You help UK users identify and avoid scams. Be friendly, knowledgeable, and helpful. Keep responses concise but informative. Focus on practical advice and red flags to watch for.`;
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory,
                options: {
                    systemPrompt: systemPrompt,
                    maxTokens: 500,
                    temperature: 0.7
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error?.message || errorData.error || 'Failed to get response from Chad.');
        }
        
        const data = await response.json();
        const aiResponseText = data.choices[0].message.content;
        
        addMessage('chad', aiResponseText);
        // Use {role: 'assistant', content: aiResponseText} for chatHistory
        chatHistory.push({ role: 'assistant', content: aiResponseText });
        
    } catch (error) {
        console.error('Error sending message to API:', error);
        if (typingIndicator) typingIndicator.remove(); // Ensure removal on error
        addMessage('chad', `Sorry, I encountered an error: ${error.message}. Please check the console for details.`);
        // Optionally, don't add the error message to chat history, or add it with a specific role like 'error'
    }
}

// Generate Chad response based on keywords
function generateChadResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Scam analysis responses
    if (lowerMessage.includes('tracking') || lowerMessage.includes('parcel') || lowerMessage.includes('delivery')) {
        return `I can help you check that tracking information. Could you share:

• The tracking number you received
• The website you're being directed to  
• The company claiming to have your parcel

Based on my analysis, I'll give you a detailed report with red flags and next steps. Remember - if anyone's asking for customs fees via text or email, that's usually a scam. If you're ever unsure about anything - dial 159 to speak safely to your bank.`;
    }
    
    if (lowerMessage.includes('romance') || lowerMessage.includes('dating') || lowerMessage.includes('relationship')) {
        return `I understand this might be difficult to talk about. Romance scams are incredibly sophisticated now.

Can you tell me:
• How did you meet this person?
• Have they asked for money or financial help?
• Do their photos seem too professional?
• Have they avoided video calls?

And if you're ever unsure about anything - dial 159 to speak safely to your bank.`;
    }
    
    // Default response
    return "I'm here to help you identify potential scams. Can you tell me more about what's concerning you?";
}

// Close chat modal
function closeChatModal() {
    document.getElementById('chatModal').classList.add('hidden');
    clearInterval(timerInterval);
}

// Handle Enter key in message input
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

