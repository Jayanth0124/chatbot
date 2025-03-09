document.addEventListener("DOMContentLoaded", function() {
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const scrollBtn = document.querySelector("#scroll-btn");
const downloadBtn = document.querySelector("#download-btn");
const voiceBtn = document.querySelector("#voice-btn");

let userText = null;

// Ensure Puter.js is loaded before using it
const loadPuterJS = async () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://js.puter.com/v2/";
        script.onload = resolve;
        document.head.appendChild(script);
    });
};

// Load saved chats and theme from local storage
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor") || "dark_mode";
    if (themeButton) {
        document.body.classList.toggle("light-mode", themeColor === "light_mode");
        themeButton.innerText = themeColor;
    }

    const defaultText = `<div class="default-text">
                            <h1>Made By Jayanth</h1>
                            <p>Start a conversation.<br> Your chat history will be displayed here.</p>
                         </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    await loadPuterJS(); // Ensure Puter.js is loaded before calling API

    const pElement = document.createElement("p");
    try {
        if (userText.startsWith("generate image:")) {
            const prompt = userText.replace("generate image:", "").trim();
            const imageElement = await puter.ai.txt2img(prompt);
            imageElement.style.maxWidth = "100%";
            incomingChatDiv.querySelector(".typing-animation").remove();
            incomingChatDiv.querySelector(".chat-details").appendChild(imageElement);
        } else if (userText.startsWith("analyze image:")) {
            const imageUrl = userText.replace("analyze image:", "").trim();
            const response = await puter.ai.chat("What do you see in this image?", imageUrl);
            pElement.textContent = response.text;
            incomingChatDiv.querySelector(".typing-animation").remove();
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        } else {
            const response = await puter.ai.chat(userText, { stream: true });
            for await (const part of response) {
                pElement.textContent += part?.text || "";
            }
            incomingChatDiv.querySelector(".typing-animation").remove();
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        }
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong. Please try again.";
        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    }
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const showTypingAnimation = () => {
    const typingHtml = `<div class="chat-content typing">
                            <div class="chat-details">
                                <div class="typing-animation">
                                    <span class="typing-dot"></span>
                                    <span class="typing-dot"></span>
                                    <span class="typing-dot"></span>
                                </div>
                            </div>
                        </div>`;

    const typingDiv = createChatElement(typingHtml, "incoming");
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    // Delay before AI response to simulate typing effect
    setTimeout(() => getChatResponse(typingDiv), 1500);
};

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = "auto";

    const userHtml = `<div class="chat-content">
                        <div class="chat-details">
                            <p>${userText}</p>
                        </div>
                    </div>`;

    const outgoingChatDiv = createChatElement(userHtml, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    // Show typing animation before AI response
    setTimeout(showTypingAnimation, 500);
};


// Event Listeners
deleteButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete all chats?")) return;
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
});

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const theme = document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode";
        localStorage.setItem("themeColor", theme);
        themeButton.innerText = theme;
    });
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);
loadDataFromLocalstorage();

// Extra Features
document.addEventListener("DOMContentLoaded", () => {
    // Scroll Button Logic
    chatContainer.addEventListener("scroll", () => {
        if (chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight - 50) {
            scrollBtn.classList.remove("hidden");
        } else {
            scrollBtn.classList.add("hidden");
        }
    });

    scrollBtn.addEventListener("click", () => {
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    });

    let isRecording = false; // Prevent multiple recordings

    voiceBtn.addEventListener("click", () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
            return;
        }

        if (isRecording) return; // Prevent multiple clicks while recording

        isRecording = true; // Set recording flag
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.lang = "en-US"; // Set language to English
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            voiceBtn.classList.add("recording"); // Add visual indication
        };

        recognition.onresult = (event) => {
            chatInput.value = event.results[0][0].transcript; // Overwrite previous text
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert(`Speech recognition error: ${event.error}`);
        };

        recognition.onend = () => {
            isRecording = false; // Reset recording flag
            voiceBtn.classList.remove("recording"); // Remove visual indication
        };

        recognition.start();

        // Stop recording after 5 seconds automatically
        setTimeout(() => {
            recognition.stop();
        }, 5000);
    });


    // Download Chat History
    downloadBtn.addEventListener("click", () => {
        const chatText = [...chatContainer.querySelectorAll(".chat")].map(m => m.textContent).join("\n");
        const blob = new Blob([chatText], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "chat_history.txt";
        a.click();
    });
});


});

window.onload = function () {
    let continueBtn = document.querySelector("button[aria-label='Continue']");
    if (continueBtn) continueBtn.click();
};
