// ---------------- ELEMENTS ----------------
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// ---------------- REPLIES ----------------
const replies = {

  // English
  "hi":"Hello!",
  "hello":"Hi there!",
  "hey":"Hey!",
  "ok":"Ok",
  "thanks":"You're welcome!",
  "thank you":"No problem!",
  "bye":"Goodbye!",
  "who are you":"I am Ahmad AI.",
  "play chess":"Opening chess board...",

  // Arabic
  "مرحبا":"أهلاً!",
  "السلام عليكم":"وعليكم السلام!",
  "كيف حالك":"أنا بخير!",
  "شكرا":"على الرحب والسعة!",
  "شكراً":"على الرحب والسعة!",
  "مع السلامة":"إلى اللقاء!",
  "نعم":"نعم",
  "لا":"لا"
};

// ---------------- FALLBACK ----------------
const fallbackEN = [
  "I don't know that yet.",
  "Interesting! Tell me more.",
  "Can you explain differently?"
];

const fallbackAR = [
  "لا أعرف ذلك بعد.",
  "مثير للاهتمام، أخبرني أكثر.",
  "هل يمكنك التوضيح أكثر؟"
];

// ---------------- START CHAT ----------------
function startChat(){
  addMessage("ai","Hello! مرحبا! Ask me something.");
}

// ---------------- SEND MESSAGE ----------------
function sendMessage(){

  let text = userInput.value.trim();
  if(text === "") return;

  addMessage("user", text);

  let clean = normalize(text);

  // ---------- MATH ----------
  let math = checkMath(clean);
  if(math){
    typingEffect(math);
    userInput.value="";
    return;
  }

  // ---------- FIND REPLY ----------
  let reply = null;

  for(let key in replies){
    if(clean.includes(normalize(key))){
      reply = replies[key];
      break;
    }
  }

  // ---------- FALLBACK ----------
  if(!reply){
    if(/[ء-ي]/.test(clean)){
      reply = fallbackAR[Math.floor(Math.random()*fallbackAR.length)];
    }else{
      reply = fallbackEN[Math.floor(Math.random()*fallbackEN.length)];
    }
  }

  typingEffect(reply);

  if(clean.includes("play chess")){
    embedChess();
  }

  userInput.value="";
}

// ---------------- NORMALIZE TEXT ----------------
function normalize(text){

  return text
  .toLowerCase()
  .replace(/[?.!,،؟]/g,"")
  .replace(/أ|إ|آ/g,"ا")
  .replace(/ة/g,"ه")
  .replace(/ى/g,"ي")
  .trim();

}

// ---------------- ADD MESSAGE ----------------
function addMessage(type,text){

  let msg = document.createElement("div");
  msg.classList.add("message",type);

  if(/[ء-ي]/.test(text)){
    msg.style.direction="rtl";
  }

  msg.innerText = text;

  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;

}

// ---------------- TYPING EFFECT ----------------
function typingEffect(reply){

  let msg = document.createElement("div");

  msg.classList.add("message","ai");

  msg.innerText = "Typing...";

  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(()=>{

    msg.innerText = reply;

  },600);

}

// ---------------- CLEAR CHAT ----------------
function clearChat(){

  chatBox.innerHTML = "";

}

// ---------------- CHANGE BACKGROUND ----------------
function changeBackground(){

  document.body.style.backgroundColor = colorPicker.value;

}

// ---------------- MATH CHECK ----------------
function checkMath(text){

  let mathText = text
  .replace("what is","")
  .replace("plus","+")
  .replace("minus","-")
  .replace("times","*")
  .replace("multiplied by","*")
  .replace("x","*")
  .replace("divided by","/")
  .replace("over","/");

  if(/^[0-9+\-*/().\s]+$/.test(mathText)){

    try{

      return "Answer: " + eval(mathText);

    }catch{

      return null;

    }

  }

  return null;

}

// ---------------- CHESS ----------------
function embedChess(){

  const old = document.getElementById("chessFrame");

  if(old) old.remove();

  let iframe = document.createElement("iframe");

  iframe.id = "chessFrame";

  iframe.src = "https://www.chess.com/play/computer";

  iframe.style.width = "100%";

  iframe.style.height = "650px";

  iframe.style.border = "none";

  iframe.style.borderRadius = "10px";

  iframe.style.marginTop = "15px";

  chatBox.appendChild(iframe);

  chatBox.scrollTop = chatBox.scrollHeight;

}

// ---------------- ENTER KEY ----------------
function enterSend(e){

  if(e.key === "Enter"){

    sendMessage();

  }

}

// start
startChat();
