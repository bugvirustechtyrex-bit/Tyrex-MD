const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

// 1. RANDOM DOG FACT
cmd({
    pattern: "dogfact",
    alias: ["dog", "puppy"],
    react: "🐶",
    desc: "Get random dog facts",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://dog-api.kinduff.com/api/facts');
    const fact = response.data.facts[0];

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🐶 DOG FACT 🐶
╚═══════════════════════════╝

┌─── ✦ FACT ✦ ───┐
│ 📝 ${fact}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 2. RANDOM JOKE
cmd({
    pattern: "joke",
    alias: ["dadjoke", "humor"],
    react: "😂",
    desc: "Get random jokes",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
    const joke = response.data.joke;

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   😂 RANDOM JOKE 😂
╚═══════════════════════════╝

┌─── ✦ JOKE ✦ ───┐
│ 📝 ${joke}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    
    // Fallback jokes
    const fallbackJokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call a fake noodle? An impasta!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "How does a penguin build its house? Igloos it together!",
        "Why don't eggs tell jokes? They'd crack each other up!"
    ];
    
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    
    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   😂 RANDOM JOKE 😂
╚═══════════════════════════╝

┌─── ✦ JOKE ✦ ───┐
│ 📝 ${randomJoke}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});

// 3. RANDOM ADVICE
cmd({
    pattern: "advice",
    alias: ["adv", "suggestion"],
    react: "💡",
    desc: "Get random life advice",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://api.adviceslip.com/advice');
    const advice = response.data.slip.advice;

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   💡 RANDOM ADVICE 💡
╚═══════════════════════════╝

┌─── ✦ ADVICE ✦ ───┐
│ 📝 ${advice}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 4. RANDOM FACT
cmd({
    pattern: "fact",
    alias: ["randomfact", "didyouknow"],
    react: "🤔",
    desc: "Get random interesting facts",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const facts = [
        "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible.",
        "A day on Venus is longer than a year on Venus.",
        "Bananas are berries, but strawberries aren't.",
        "Octopuses have three hearts and blue blood.",
        "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
        "Wombat poop is cube-shaped.",
        "A group of flamingos is called a 'flamboyance'.",
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
        "Cows have best friends and get stressed when separated from them.",
        "The dot over the letter 'i' is called a tittle."
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🤔 DID YOU KNOW? 🤔
╚═══════════════════════════╝

┌─── ✦ FACT ✦ ───┐
│ 📝 ${randomFact}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 5. RANDOM MEME
cmd({
    pattern: "meme",
    alias: ["memes", "funny"],
    react: "🖼️",
    desc: "Get random memes",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://meme-api.com/gimme');
    const memeUrl = response.data.url;
    const memeTitle = response.data.title;

    await conn.sendMessage(from, {
        image: { url: memeUrl },
        caption: `╔═══════════════════════════╗
║   🖼️ RANDOM MEME 🖼️
╚═══════════════════════════╝

┌─── ✦ TITLE ✦ ───┐
│ 📝 ${memeTitle}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 6. RANDOM QUOTES (DIFFERENT STYLE)
cmd({
    pattern: "motivation",
    alias: ["motivate", "inspire"],
    react: "🌟",
    desc: "Get motivational quotes",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://zenquotes.io/api/random');
    const quote = response.data[0].q;
    const author = response.data[0].a;

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🌟 MOTIVATION 🌟
╚═══════════════════════════╝

┌─── ✦ QUOTE ✦ ───┐
│ " ${quote} "
└─────────────────────────┘

┌─── ✦ BY ✦ ───┐
│ ✍️ - ${author}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 7. RANDOM PROGRAMMING JOKE
cmd({
    pattern: "progjoke",
    alias: ["programmingjoke", "devjoke"],
    react: "👨‍💻",
    desc: "Get programming jokes",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const response = await axios.get('https://v2.jokeapi.dev/joke/Programming?type=single');
    const joke = response.data.joke;

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   👨‍💻 PROGRAMMING JOKE 👨‍💻
╚═══════════════════════════╝

┌─── ✦ JOKE ✦ ───┐
│ 📝 ${joke}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    
    // Fallback programming jokes
    const fallbackJokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why did the programmer quit his job? He didn't get arrays!",
        "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
        "Why do Java developers wear glasses? Because they can't C#!"
    ];
    
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    
    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   👨‍💻 PROGRAMMING JOKE 👨‍💻
╚═══════════════════════════╝

┌─── ✦ JOKE ✦ ───┐
│ 📝 ${randomJoke}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});

// 8. RANDOM RIDDLE
cmd({
    pattern: "riddle",
    alias: ["puzzle", "brainteaser"],
    react: "🧩",
    desc: "Get random riddles",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const riddles = [
        { riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "An echo" },
        { riddle: "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. What am I?", answer: "A candle" },
        { riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "A map" },
        { riddle: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", answer: "The letter R" },
        { riddle: "What word becomes shorter when you add two letters to it?", answer: "Short" },
        { riddle: "What has to be broken before you can use it?", answer: "An egg" },
        { riddle: "I'm tall when I'm young, and I'm short when I'm old. What am I?", answer: "A candle" },
        { riddle: "What month of the year has 28 days?", answer: "All of them" }
    ];
    
    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🧩 RIDDLE TIME 🧩
╚═══════════════════════════╝

┌─── ✦ RIDDLE ✦ ───┐
│ ❓ ${randomRiddle.riddle}
└─────────────────────────┘

🔍 TYPE *.answer* TO SEE THE ANSWER

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    // Store the answer temporarily
    global.riddleAnswer = randomRiddle.answer;

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 9. RIDDLE ANSWER
cmd({
    pattern: "answer",
    alias: ["riddleanswer", "ans"],
    react: "✅",
    desc: "Get answer for the riddle",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    if (!global.riddleAnswer) {
        return await conn.sendMessage(from, {
            text: `╭───❌───╮
│ NO RIDDLE
╰─────────╯

❌ There is no active riddle.
Try *.riddle* first

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   ✅ RIDDLE ANSWER ✅
╚═══════════════════════════╝

┌─── ✦ ANSWER ✦ ───┐
│ 📝 ${global.riddleAnswer}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    // Clear the answer after showing
    global.riddleAnswer = null;

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});

// 10. RANDOM AFFIRMATION
cmd({
    pattern: "affirm",
    alias: ["affirmation", "positive"],
    react: "✨",
    desc: "Get positive affirmations",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const affirmations = [
        "You are capable of amazing things.",
        "Today is full of possibilities.",
        "You are stronger than you think.",
        "Your potential is limitless.",
        "You deserve happiness and success.",
        "Every day is a fresh start.",
        "You are enough, just as you are.",
        "Believe in yourself and all that you are.",
        "You make a difference in this world.",
        "Your voice matters.",
        "You are loved and appreciated.",
        "Great things are coming your way.",
        "You have the power to create change.",
        "Your kindness is a gift to others.",
        "You are on the right path."
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   ✨ POSITIVE AFFIRMATION ✨
╚═══════════════════════════╝

┌─── ✦ AFFIRMATION ✦ ───┐
│ 💫 ${randomAffirmation}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
}
});