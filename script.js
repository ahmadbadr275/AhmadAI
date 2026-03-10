const chatBox = document.getElementById("chatBox");

const replies = {
  "hi":"Hello!",
  "hello":"Hi there!",
  "hey":"Hey!",
  "how are you":"I'm doing great!",
  "who are you":"I am Ahmad AI, a simple web chatbot.",
  "who is newton":"Isaac Newton was a scientist who discovered gravity and developed the laws of motion.",
  "who is einstein":"Albert Einstein was a physicist famous for the theory of relativity.",
  "what is ai":"AI means Artificial Intelligence.",
  "what is gravity":"Gravity is the force that pulls objects toward each other.",
  "what is the sun":"The Sun is the star at the center of our solar system.",
  "what is earth":"Earth is the planet we live on.",
  "what is mars":"Mars is the fourth planet from the Sun.",
  "thanks":"You're welcome!",
  "thank you":"No problem!",
  "bye":"Goodbye!",
  "play chess":"Opening chess board..."
};

const fallbackReplies = [
  "I don't know that yet, but I'm learning.",
  "Can you explain that differently?",
  "Interesting! Tell me more."
];

function startChat(){
  addMessage("ai","Hello! Ask me something, type math like '5 plus 3', or type 'play chess'.");
}

function sendMessage(){
  const input = document.getElementById("userInput");
  let text = input.value.trim();
  if(text==="") return;

  addMessage("user", text);

  let reply = checkMath(text);
  if(!reply) reply = findReply(text);

  typingEffect(reply);

  if(text.toLowerCase().includes("play chess")) embedChess();

  input.value="";
}

function checkMath(text){
  text = text.toLowerCase();
  text = text.replace("what is","").replace("what's","").trim();
  text = text.replace(/plus/g,"+")
             .replace(/minus/g,"-")
             .replace(/times/g,"*")
             .replace(/multiplied by/g,"*")
             .replace(/x/g,"*")
             .replace(/divided by/g,"/")
             .replace(/over/g,"/");

  if(/^[0-9+\-*/().\s]+$/.test(text)){
    try{
      let result = eval(text);
      return `Answer: ${result}`;
    }catch(e){
      return null;
    }
  }
  return null;
}

function findReply(text){
  text = text.toLowerCase().replace(/[?.!,]/g,"");
  for(let key in replies){
    if(text.includes(key)) return replies[key];
  }
  return fallbackReplies[Math.floor(Math.random()*fallbackReplies.length)];
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

  setTimeout(()=>{ msg.innerText=reply; },600);
}

function clearChat(){
  chatBox.innerHTML="";
}

function changeBackground(){
  const color = document.getElementById("colorInput").value;
  document.body.style.backgroundColor=color;
}

function enterSend(event){
  if(event.key==="Enter") sendMessage();
}

function embedChess(){
  let iframe = document.createElement("iframe");
  iframe.id = "chessFrame";
  iframe.src = "https://www.chess.com/play/computer";
  chatBox.appendChild(iframe);
  chatBox.scrollTop = chatBox.scrollHeight;
}
