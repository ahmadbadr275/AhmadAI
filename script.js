// ----------------- AhmadAI Offline Smart Chat -----------------

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// ----------------- Memory -----------------
let memory = []; // last 5 messages

// ----------------- Knowledge Library -----------------
const knowledgeLibrary = {
  "who is albert einstein": "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. 🤓",
  "who is isaac newton": "Isaac Newton was an English mathematician, physicist, and astronomer who formulated the laws of motion and universal gravitation. ⚡",
  "what is gravity": "Gravity is a natural force that attracts objects with mass toward each other. 🌍",
  "what is photosynthesis": "Photosynthesis is the process used by plants to convert sunlight into energy, producing oxygen and glucose. 🌱",
  "who is napoleon": "Napoleon Bonaparte was a French military leader who became emperor of France and conquered much of Europe. 🏰",
  "who is messi": "Lionel Messi is an Argentine professional footballer, considered one of the greatest players of all time. ⚽",
  "what is javascript": "JavaScript is a programming language used to create interactive effects within web browsers. 💻",
  "what is python": "Python is a high-level programming language known for readability and simplicity. 🐍",
  "what is arabic": "Arabic is a Semitic language spoken in many countries in the Middle East and North Africa. 📝",
  "what is ai": "AI stands for Artificial Intelligence, a branch of computer science focused on creating smart machines. 🤖",
  "hello": "Hello! 👋 How can I help you today?",
  "hi": "Hi there! 😄",
  "hey": "Hey! 😎",
  "how are you": "I'm doing great, thanks for asking! 🙂",
  "bye": "Goodbye! 👋 See you later!",
  "thanks": "You're welcome! 🙏",
  "thank you": "No problem! 👍",
  // Add more info as needed
};

// ----------------- Fallbacks -----------------
const fallbackEN = [
  "Hmm 🤔 I’m not sure yet, but I’m learning!",
  "Interesting question! Can you tell me more?",
  "I don’t fully understand, can you explain differently?",
  "Good question! I’ll try to improve on that."
];

const fallbackAR = [
  "ممم 🤔 لست متأكداً بعد",
  "سؤال جميل 👀 أخبرني أكثر",
  "لم أفهم تماماً، هل يمكنك التوضيح؟"
];

// ----------------- Start Chat -----------------
function startChat(){
  addMessage("ai","Hello! 👋 Ask me anything.");
}

// ----------------- Send Message -----------------
function sendMessage(){
  let text = userInput.value.trim();
  if(text === "") return;

  addMessage("user", text);

  memory.push(text);
  if(memory.length > 5) memory.shift(); // keep last 5

  let clean = text.toLowerCase().replace(/[?.!,]/g,"");
  let reply = null;

  // Check Knowledge Library
  if(knowledgeLibrary[clean]){
    reply = knowledgeLibrary[clean];
  }

  // Math
  let math = safeMath(clean);
  if(math !== null){
    reply = math;
  }

  // Random fallback if no match
  if(!reply){
    if(/[ء-ي]/.test(clean)){
      reply = fallbackAR[Math.floor(Math.random()*fallbackAR.length)];
    } else {
      reply = fallbackEN[Math.floor(Math.random()*fallbackEN.length)];
    }
  }

  typingEffect(reply);
  userInput.value = "";
}

// ----------------- Add Message -----------------
function addMessage(type, text){
  let msg = document.createElement("div");
  msg.classList.add("message", type);
  if(/[ء-ي]/.test(text)) msg.style.direction = "rtl";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ----------------- Typing Effect -----------------
function typingEffect(reply){
  let msg = document.createElement("div");
  msg.classList.add("message","ai");
  msg.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(()=>{
    msg.innerText = reply;
  },900);
}

// ----------------- Clear Chat -----------------
function clearChat(){
  chatBox.innerHTML = "";
  memory = [];
}

// ----------------- Change Background -----------------
function changeBackground(){
  document.body.style.backgroundColor = colorPicker.value;
}

// ----------------- Enter Key -----------------
function enterSend(e){
  if(e.key === "Enter") sendMessage();
}

// ----------------- Safe Math -----------------
function safeMath(text){
  try{
    let expr = text
      .replace("what is","")
      .replace("plus","+")
      .replace("minus","-")
      .replace(/times|multiplied by|x/g,"*")
      .replace(/divided by|over/g,"/")
      .replace(/زائد/g,"+")
      .replace(/ناقص/g,"-")
      .replace(/ضرب/g,"*")
      .replace(/قسمة/g,"/");

    expr = expr.replace(/[^0-9+\-*/().\s]/g,"");

    if(/^[0-9+\-*/().\s]+$/.test(expr)){
      return "Answer: "+Function('"use strict";return ('+expr+')')();
    }
  } catch(e){ return null; }

  return null;
}
