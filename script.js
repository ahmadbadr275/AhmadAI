const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.querySelector("button[onclick='sendMessage()']");
const clearBtn = document.querySelector("button[onclick='clearChat()']");
const colorPicker = document.getElementById("colorInput");

const replies = {
  "hi":"Hello!",
  "hello":"Hi there!",
  "hey":"Hey!",
  "good morning":"Good morning!",
  "good afternoon":"Good afternoon!",
  "good evening":"Good evening!",
  "ok":"Alright ✅",
  "alright":"Okay!",
  "thanks":"You're welcome!",
  "thank you":"No problem!",
  "bye":"Goodbye!",
  "goodbye":"See you later!",
  "yes":"Great!",
  "no":"Alright.",
  "who are you":"I am Ahmad AI, a simple web chatbot.",
  "who is newton":"Isaac Newton was a scientist who discovered gravity and developed the laws of motion.",
  "who is einstein":"Albert Einstein was a physicist famous for the theory of relativity.",
  "what is ai":"AI means Artificial Intelligence.",
  "what is gravity":"Gravity is the force that pulls objects toward each other.",
  "what is the sun":"The Sun is the star at the center of our solar system.",
  "what is earth":"Earth is the planet we live on.",
  "what is mars":"Mars is the fourth planet from the Sun.",
  "play chess":"Opening chess board..."
};

const fallbackReplies = [
  "I don't know that yet, but I'm learning.",
  "Can you explain that differently?",
  "Interesting! Tell me more."
];

// ------------------- EVENTS -------------------
sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);
colorPicker.addEventListener("change", changeBackground);
userInput.addEventListener("keydown", function(e){ if(e.key==="Enter") sendMessage(); });

// ------------------- CHAT FUNCTIONS -------------------
function startChat(){
  addMessage("ai","Hello! Ask me something, type math like '5 plus 3', or type 'play chess'.");
}

function sendMessage(){
  let text = userInput.value.trim();
  if(text==="") return;
  addMessage("user", text);

  let reply = checkMath(text);
  if(!reply) reply = findReply(text);

  typingEffect(reply);

  if(text.toLowerCase().includes("play chess")) embedChess();

  userInput.value="";
}

function addMessage(type,text){
  let msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function typingEffect(reply){
  let msg = document.createElement("div");
  msg.classList.add("message","ai");
  msg.innerText="Typing...";
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(()=>{ msg.innerText=reply; }, 600);
}

function clearChat(){ chatBox.innerHTML=""; }
function changeBackground(){ document.body.style.backgroundColor = colorPicker.value; }

// ------------------- MATH -------------------
function checkMath(text){
  text = text.toLowerCase().replace("what is","").replace("what's","").replace("what’s","").trim();
  text = text.replace(/plus/g,"+").replace(/minus/g,"-").replace(/times/g,"*")
             .replace(/multiplied by/g,"*").replace(/x/g,"*").replace(/divided by/g,"/").replace(/over/g,"/");
  if(/^[0-9+\-*/().\s]+$/.test(text)){
    try{ return `Answer: ${eval(text)}`; }catch(e){ return null; }
  }
  return null;
}

// ------------------- REPLIES -------------------
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
  iframe.style.width="100%"; iframe.style.height="650px";
  iframe.style.border="none"; iframe.style.borderRadius="10px"; iframe.style.marginTop="15px";
  chatBox.appendChild(iframe);
  chatBox.scrollTop = chatBox.scrollHeight;
}
