// ------------------- ELEMENTS -------------------
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const colorPicker = document.getElementById("colorInput");

// ------------------- PREDEFINED REPLIES -------------------
const replies = {
  // English
  "hi":"Hello!",
  "hello":"Hi there!",
  "hey":"Hey!",
  "good morning":"Good morning!",
  "good afternoon":"Good afternoon!",
  "good evening":"Good evening!",
  "ok":"Ok ✅",
  "alright":"Alright",
  "thanks":"You're welcome!",
  "thank you":"No problem!",
  "bye":"Goodbye!",
  "goodbye":"See you later!",
  "yes":"Yes",
  "no":"No",
  "who are you":"I am Ahmad AI, a simple web chatbot.",
  "play chess":"Opening chess board...",

  // Arabic
  "مرحبا":"أهلاً!",
  "السلام عليكم":"وعليكم السلام!",
  "كيف حالك":"أنا بخير، شكراً لك!",
  "شكراً":"على الرحب والسعة",
  "مع السلامة":"إلى اللقاء!",
  "نعم":"نعم",
  "لا":"لا"
};

const fallbackReplies = [
  "I don't know that yet.",
  "Can you explain differently?",
  "Interesting! Tell me more.",
  "Ok",
  "Alright",
  "Yes",
  "No",
  "لا أعرف ذلك بعد.",
  "هل يمكنك توضيح ذلك بطريقة أخرى؟"
];

// ------------------- EVENTS -------------------
sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);
colorPicker.addEventListener("change", changeBackground);
userInput.addEventListener("keydown", function(e){ if(e.key==="Enter") sendMessage(); });

// ------------------- CHAT FUNCTIONS -------------------
function startChat(){
  addMessage("ai","Hello! Ask me something in English or Arabic, type math like '5 plus 3', or type 'play chess'.");
}

// Main send message function (async for Wikipedia)
async function sendMessage(){
  let text = userInput.value.trim();
  if(text==="") return;
  addMessage("user", text);

  let reply = null;

  // 1️⃣ Check math first
  reply = checkMath(text);

  // 2️⃣ Wikipedia search for questions starting with "who is" or "what is"
  if(!reply && (text.toLowerCase().startsWith("who is") || text.toLowerCase().startsWith("what is"))){
    const searchQuery = text.replace(/who is|what is/i,"").trim();
    if(searchQuery){
      typingEffect("Searching...");
      reply = await searchWikipedia(searchQuery);
    }
  }

  // 3️⃣ If still no reply, check predefined replies
  if(!reply) reply = findReply(text);

  typingEffect(reply);

  // 4️⃣ Embed chess if needed
  if(text.toLowerCase().includes("play chess")) embedChess();

  userInput.value="";
}

// Add a message to chat box with automatic direction
function addMessage(type,text){
  let msg = document.createElement("div");
  msg.classList.add("message", type);
  
  // Detect Arabic letters
  if (/[ء-ي]/.test(text)) msg.style.direction = "rtl";
  else msg.style.direction = "ltr";
  
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing effect for AI response
function typingEffect(reply){
  let msg = document.createElement("div");
  msg.classList.add("message","ai");
  msg.innerText="Typing...";
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(()=>{ msg.innerText=reply; }, 600);
}

// Clear chat
function clearChat(){ chatBox.innerHTML=""; }

// Change background color
function changeBackground(){ document.body.style.backgroundColor = colorPicker.value; }

// ------------------- MATH -------------------
function checkMath(text){
  text = text.toLowerCase().replace("what is","").replace("what's","").replace("what’s","").trim();
  text = text.replace(/plus/g,"+").replace(/minus/g,"-").replace(/times/g,"*")
             .replace(/multiplied by/g,"*").replace(/x/g,"*").replace(/divided by/g,"/").replace(/over/g,"/");
  if(/^[0-9+\-*/().\s]+$/.test(text)){
    try{ return `Answer: ${eval(text)}` }catch(e){ return null; }
  }
  return null;
}

// ------------------- SIMPLE REPLIES -------------------
function findReply(text){
  text = text.toLowerCase().replace(/[?.!,]/g,"");
  for(let key in replies) if(text.includes(key)) return replies[key];
  return fallbackReplies[Math.floor(Math.random()*fallbackReplies.length)];
}

// ------------------- CHESS -------------------
function embedChess(){
  const old = document.getElementById("chessFrame");
  if(old) old.remove();
  let iframe = document.createElement("iframe");
  iframe.id = "chessFrame";
  iframe.src = "https://www.chess.com/play/computer";
  iframe.style.width="100%"; 
  iframe.style.height="650px";
  iframe.style.border="none"; 
  iframe.style.borderRadius="10px"; 
  iframe.style.marginTop="15px";
  chatBox.appendChild(iframe);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ------------------- WIKIPEDIA SEARCH -------------------
async function searchWikipedia(query){
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if(!res.ok) return "Sorry, I couldn't find information.";
    const data = await res.json();
    if(data.extract) return data.extract;
    return "Sorry, I couldn't find information.";
  } catch(e){
    return "Error fetching information.";
  }
}

// Start chat
startChat();
