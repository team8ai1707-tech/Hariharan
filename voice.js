/**
 * Vedha Resort Voice Assistant - Speech Recognition & Synthesis Engine
 */

const voiceAssistant = {
    recognition: null,
    isListening: false,
    isSpeaking: false,
    synth: window.speechSynthesis,
    
    init() {
        console.log("Initializing Vedha Voice Assistant...");
        
        // Setup Web Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            // Bind Recognition Events
            this.recognition.onstart = () => this.handleStart();
            this.recognition.onresult = (event) => this.handleResult(event);
            this.recognition.onerror = (event) => this.handleError(event);
            this.recognition.onend = () => this.handleEnd();
        } else {
            console.warn("Speech Recognition API is not supported in this browser.");
            document.getElementById('voice-status-text').innerText = "Voice input unsupported in this browser.";
            document.getElementById('assistant-badge').innerText = "OFFLINE";
            document.getElementById('assistant-badge').style.color = "var(--status-booked)";
        }
    },

    toggleListening() {
        if (!this.recognition) {
            this.speakText("Sorry, voice command is not supported in your current browser. Please try Chrome or Safari.");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                // If speaking, cancel it first
                if (this.synth.speaking) {
                    this.synth.cancel();
                    this.isSpeaking = false;
                    document.getElementById('voice-orb-btn').classList.remove('speaking');
                }
                this.recognition.start();
            } catch (err) {
                console.error("Speech Recognition start error:", err);
            }
        }
    },

    handleStart() {
        this.isListening = true;
        const orb = document.getElementById('voice-orb-btn');
        const statusText = document.getElementById('voice-status-text');
        
        orb.classList.add('listening');
        statusText.innerHTML = `<span style="color:#10b981; animation: blink 1s infinite;">Listening... Say a command</span>`;
    },

    handleEnd() {
        this.isListening = false;
        document.getElementById('voice-orb-btn').classList.remove('listening');
    },

    handleError(event) {
        console.error("Speech Recognition Error:", event.error);
        const statusText = document.getElementById('voice-status-text');
        
        if (event.error === 'not-allowed') {
            statusText.innerText = "Microphone access blocked. Enable permissions.";
            this.speakText("Microphone access is required for voice assistant commands.");
        } else {
            statusText.innerText = "Voice assistant timed out. Try again.";
        }
    },

    handleResult(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log(`Recognized Speech: "${transcript}"`);
        
        const statusText = document.getElementById('voice-status-text');
        statusText.innerText = `You said: "${transcript}"`;
        
        // Command Routing Logic
        this.processCommand(transcript);
    },

    processCommand(command) {
        // Navigation commands
        if (command.includes('room') || command.includes('suite') || command.includes('accommodation') || command.includes('stay') || command.includes('book')) {
            app.navigateTo('rooms');
            this.speakText("Showing our available luxury rooms and suites. You can reserve your stay here.");
            return;
        }

        if (command.includes('pool') || command.includes('swimming') || command.includes('splash') || command.includes('water') || command.includes('spa') || command.includes('amenities')) {
            app.navigateTo('amenities');
            this.speakText("Redirecting to swimming pools and spa amenities. Lifeguards are active at the children pool.");
            return;
        }

        if (command.includes('menu') || command.includes('food') || command.includes('dining') || command.includes('restaurant') || command.includes('lunch') || command.includes('dinner') || command.includes('eat')) {
            app.navigateTo('dining');
            this.speakText("Opening fine dining page. We have North Indian, South Indian, and Chinese options.");
            return;
        }

        if (command.includes('hall') || command.includes('party') || command.includes('banquet') || command.includes('reception') || command.includes('ticket') || command.includes('event') || command.includes('desk')) {
            app.navigateTo('reception');
            this.speakText("Here is the Reception Desk and Party Hall planner. You can request desk queue tickets here.");
            return;
        }

        if (command.includes('kid') || command.includes('garden') || command.includes('playground') || command.includes('park') || command.includes('orchard') || command.includes('nature')) {
            app.navigateTo('kids-garden');
            this.speakText("Showing Kids Play Zone and Botanical Sanctuary features.");
            return;
        }

        if (command.includes('parking') || command.includes('car') || command.includes('vehicle') || command.includes('valet') || command.includes('slot')) {
            app.navigateTo('parking');
            this.speakText("Opening Smart Parking layout. Green spots are available to reserve.");
            return;
        }

        if (command.includes('service') || command.includes('housekeeping') || command.includes('towels') || command.includes('dining request') || command.includes('luggage')) {
            app.navigateTo('service');
            this.speakText("Opening resort service desk. Please choose your room and submit a request.");
            return;
        }

        if (command.includes('map') || command.includes('direction') || command.includes('address') || command.includes('location') || command.includes('coorg')) {
            app.navigateTo('map');
            this.speakText("Here is our location in Coorg. Open google maps for driving directions.");
            return;
        }

        if (command.includes('review') || command.includes('rating') || command.includes('comment') || command.includes('opinion') || command.includes('feedback')) {
            app.navigateTo('reviews');
            this.speakText("Opening reviews page. You can read diaries or write your own review.");
            return;
        }

        // Action commands
        if (command.includes('check out') || command.includes('checkout')) {
            // Find first booked room and check it out
            const bookedRoom = app.rooms.find(r => r.status === 'booked');
            if (bookedRoom) {
                app.navigateTo('rooms');
                app.checkOutRoom(bookedRoom.id);
                this.speakText(`Checking out Room ${bookedRoom.id} for you. It has entered the twenty minute cleaning cycle.`);
            } else {
                app.navigateTo('rooms');
                this.speakText("There are no currently occupied rooms. Please check in a suite first.");
            }
            return;
        }

        if (command.includes('cleaning') || command.includes('clean') || command.includes('timer') || command.includes('sanitization')) {
            app.navigateTo('rooms');
            this.speakText("To ensure maximum hygiene, checked out rooms undergo a twenty minute cleaning cycle with real time progress tracking.");
            return;
        }

        if (command.includes('hello') || command.includes('hi ') || command.includes('hey')) {
            this.speakText("Hello! Welcome to Vedha Resort virtual assistant. I can navigate you to rooms, dining, pool schedules, parking grids, or help you check out.");
            return;
        }

        if (command.includes('help') || command.includes('command') || command.includes('what can you do')) {
            this.speakText("I can redirect you to any section. Just speak commands like show rooms, open food menu, check parking, or check out room.");
            return;
        }

        // Fallback
        this.speakText("I understood " + command + ", but I don't have a specific action for that. Try saying: go to dining, or show available rooms.");
    },

    speakText(text) {
        if (!this.synth) return;

        // If currently speaking, stop it
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            this.isSpeaking = true;
            document.getElementById('voice-orb-btn').classList.add('speaking');
            document.getElementById('voice-status-text').innerText = text;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            document.getElementById('voice-orb-btn').classList.remove('speaking');
            document.getElementById('voice-status-text').innerText = "Click mic icon and speak a command...";
        };

        utterance.onerror = (err) => {
            console.error("Speech Synthesis Error:", err);
            this.isSpeaking = false;
            document.getElementById('voice-orb-btn').classList.remove('speaking');
        };

        // Try to select an elegant English voice if available
        const voices = this.synth.getVoices();
        const premiumVoice = voices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
        );
        if (premiumVoice) {
            utterance.voice = premiumVoice;
        }

        this.synth.speak(utterance);
    }
};

// Initialize voice module
window.addEventListener('DOMContentLoaded', () => {
    // We delay slightly to let the voice synthesis voices load (Chrome bug)
    setTimeout(() => {
        voiceAssistant.init();
    }, 500);
});
