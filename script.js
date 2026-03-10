const chatBox = document.getElementById("chatBox");

const replies = {
    "hi": "Hello!",
    "hello": "Hi there!",
    "hey": "Hey!",
    "ok": "Alright!",
    "okay": "Okay!",
    "thanks": "You're welcome!",
    "thank you": "No problem!",
    "bye": "Goodbye!",
    "good morning": "Good morning!",
    "good night": "Good night!",
    "how are you": "I'm doing great!",
    "what is ai": "AI means Artificial Intelligence.",
    "who made you": "I was created by the developer.",
    "help": "You can chat with me or generate photos."
};

function startChat() {
    addMessage("ai", "Hello! How can I help you today?");
}

function sendMessage() {
    let input = document.getElementById("userInput");
    let text = input.value.trim();
    if (text === "") return;
    addMessage("user", text);
    let reply = findReply(text);
    typingEffect(reply);
    input.value = "";
}

function findReply(text) {
    // Remove punctuation and lowercase
    text = text.replace(/[?.!,]/g, "").toLowerCase();
    for (let key in replies) {
        if (text.includes(key.toLowerCase())) {
            return replies[key];
        }
    }
    return "Interesting! Tell me more.";
}

function addMessage(
