const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const colorPicker = document.getElementById("colorInput");

// MEMORY
let lastUserMessage = "";

// SMART REPLIES (with variation)
const replies = {
  "hi": ["Hello 👋","Hey there 😄","Hi! What's up?"],
  "hello": ["Hello 🙂","Hey!","Hi there 👋"],
  "hey": ["Hey!","Yo 😎","Hey there!"],
  "how are you": ["I'm good 🙂","Doing great! How about you?","All good here 😎"],
  "ok": ["Alright ✅","Got it 👍","Okay!"],
  "yes": ["Nice 😄","Great!","Awesome 👍"],
  "no": ["Alright","Okay, no problem","Got it"],
  "thanks": ["You're welcome 🙏","Anytime 😄","No worries 👍"],
  "thank you": ["You're welcome 🙏","Glad to help!","No problem 👍"],
  "bye": ["Goodbye 👋","See you later 😄","Bye!"],
  "who are you": ["I am Ahmad AI 🤖","I'm Ahmad AI, your assistant 🤖"],

  // Arabic
  "مرحبا": ["أهلاً 👋","مرحباً 😄"],
  "السلام عليكم": ["وعليكم السلام","أهلاً وسهلاً 👋"],
  "كيف حالك": ["أنا بخير 🙂","تمام الحمد لله 😄"],
  "شكرا": ["على الرحب والسعة","العفو 😊"],
  "مع السلامة": ["إلى اللقاء 👋","مع السلامة 😄"]
};

// FALLBACK RESPONSES
const fallbackEN = [
  "Hmm 🤔 I’m not sure yet, but I’m learning!",
  "That’s interesting… tell me more 👀",
  "I don’t fully understand, can you explain it differently?",
  "I think I need more details 😅",
  "Good question! I’ll try to improve on that."
];

const fallbackAR = [
  "ممم 🤔 لست متأكداً بعد",
  "سؤال جميل 👀 أخبرني أكثر",
  "لم أفهم تماماً، هل يمكنك التوضيح؟",
  "أحتاج تفاصيل أكثر 😅"
];

// START CHAT
function startChat(){
  addMessage("ai","Hello! 👋 Ask me something.");
}

// SEND MESSAGE
async function sendMessage(){
  let text = userInput.value.trim();
  if(text === "") return;

  addMessage("user", text);
  lastUserMessage = text;

  let clean = text.toLowerCase().replace(/[?.!,]/g,"");
  let reply = null;

  // MATH HANDLING
  let math = safeMath(clean);
  if(math !== null){
    typingEffect(math);
    userInput.value = "";
    return;
  }

  // SMART MATCHING
  reply = getBestReply(clean);

  // BASIC CONTEXT
  if(!reply && (clean.includes("and") || clean.includes("also"))){
    reply = "Tell me more about that 👀";
  }

  // WIKIPEDIA SEARCH
  const wikiTriggers = ["who","what","where","when","why","how","which","define","tell me","ما","من","أين","متى","لماذا"];
  let useWiki = wikiTriggers.some(q => clean.includes(q));

  if(!reply && useWiki){
    reply = await searchWikipedia(clean);
  }

  // FALLBACK
  if(!reply){
    if(/[ء-ي]/.test(clean)){
      reply = fallbackAR[Math.floor(Math.random() * fallbackAR.length)];
    } else {
      reply = fallbackEN[Math.floor(Math.random() * fallbackEN.length)];
    }
  }

  // ADD PERSONALITY
  if(reply && !reply.includes("🤖")){
    reply += " 🤖";
  }

  setTimeout(() => typingEffect(reply), 500);
  userInput.value = "";
}

// SMART MATCH FUNCTION
function getBestReply(input){
  let bestMatch = null;
  let highestScore = 0;

  for(let key in replies){
    let words = key.split(" ");
    let score = 0;

    for(let i = 0; i < words.length; i++){
      if(input.includes(words[i])){
        score++;
      }
    }

    if(score > highestScore){
      highestScore = score;
      bestMatch = replies[key];
    }
  }

  if(Array.isArray(bestMatch)){
    return bestMatch[Math.floor(Math.random() * bestMatch.length)];
  }

  return bestMatch;
}

// ADD MESSAGE TO CHAT
function addMessage(type, text){
  let msg = document.createElement("div");
  msg.classList.add("message", type);

  if(/[ء-ي]/.test(text)){
    msg.style.direction = "rtl";
  }

  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// TYPING EFFECT
function typingEffect(reply){
  let msg = document.createElement("div");
  msg.classList.add("message","ai");

  msg.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    msg.innerText = reply;
  }, 900);
}

// CLEAR CHAT
function clearChat(){
  chatBox.innerHTML = "";
}

// CHANGE BACKGROUND COLOR
function changeBackground(){
  document.body.style.backgroundColor = colorPicker.value;
}

// SAFE MATH FUNCTION
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
      return "Answer: " + Function('"use strict";return (' + expr + ')')();
    }
  } catch(e){
    return null;
  }

  return null;
}

// WIKIPEDIA SEARCH
async function searchWikipedia(question){
  let query = question.replace(/who|what|where|when|why|how|which|define|tell me|is|are|ما|من|أين|متى|لماذا/gi,"").trim();

  let isArabic = /[ء-ي]/.test(query);
  let lang = isArabic ? "ar" : "en";

  try{
    let searchURL = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    let res = await fetch(searchURL);
    let data = await res.json();

    if(data.query.search.length > 0){
      let title = data.query.search[0].title;

      let summaryURL = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`;
      let res2 = await fetch(summaryURL);
      let data2 = await res2.json();

      let page = Object.values(data2.query.pages)[0];

      if(page.extract){
        return page.extract.slice(0, 300) + "...";
      }
    }
  } catch(e){
    console.error(e);
  }

  return isArabic ? "لم أجد معلومات" : "I couldn't find information.";
}

// ENTER KEY SUPPORT
function enterSend(e){
  if(e.key === "Enter"){
    sendMessage();
  }
}
