function startChat(){

let chat=document.getElementById("chatBox");

chat.innerHTML="<p><b>Ahmad AI:</b> Hello Ahmad! How can I help you?</p>";

}

function clearChat(){

document.getElementById("chatBox").innerHTML="";

}

async function sendMessage(){

let input=document.getElementById("userInput");

let chat=document.getElementById("chatBox");

let message=input.value.trim();

if(message==="") return;

chat.innerHTML+="<p><b>You:</b> "+message+"</p>";

chat.innerHTML+="<p id='thinking'><b>Ahmad AI:</b> Thinking...</p>";

chat.scrollTop=chat.scrollHeight;

input.value="";

try{

let response=await fetch("https://api.allorigins.win/raw?url=https://api.affiliateplus.xyz/api/chatbot?message="+encodeURIComponent(message)+"&botname=AhmadAI&ownername=Ahmad");

let data=await response.json();

document.getElementById("thinking").innerHTML="<b>Ahmad AI:</b> "+data.message;

}

catch{

document.getElementById("thinking").innerHTML="<b>Ahmad AI:</b> Sorry, something went wrong.";

}

}

function changeColor(){

let color=document.getElementById("colorInput").value;

document.body.style.background=color;

}

function showChess(){

document.getElementById("chess").style.display="block";

}
