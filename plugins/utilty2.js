const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs-extra');
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

// ==============================================
// 1. CALCULATOR COMMAND
// ==============================================
cmd({
    pattern: "calc",
    alias: ["calculate", "math"],
    react: "🧮",
    desc: "Perform mathematical calculations",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.calc 2+2
┣▣ 📌 *.calc 10-5
┣▣ 📌 *.calc 6*8
┣▣ 📌 *.calc 100/4
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const expression = args.join(' ');
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ INVALID
┣▣ ⚠️ Only numbers and basic operations allowed
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        try {
            const result = eval(expression);
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🧮 CALCULATION
┣▣
┣▣ 📋 EXPRESSION: ${expression}
┣▣ ✅ RESULT: ${result}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } catch (evalError) {
            reply(`❌ Invalid expression\n\n⚡ ${config.BOT_NAME} ✨`);
        }
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 2. QR CODE GENERATOR
// ==============================================
cmd({
    pattern: "qr",
    alias: ["qrcode", "makeqr"],
    react: "📱",
    desc: "Generate QR code from text",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.qr hello world
┣▣ 📌 *.qrcode your text here
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const text = args.join(' ');
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📱 QR CODE GENERATED
┣▣
┣▣ 📝 TEXT: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 3. READ QR CODE
// ==============================================
cmd({
    pattern: "readqr",
    alias: ["scanqr", "qrreader"],
    react: "🔍",
    desc: "Read/Scan QR code from image",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, quoted}) => {
    try{
        if (!m.quoted || !m.quoted.message || (!m.quoted.message.imageMessage && !m.quoted.message.documentMessage)) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 Reply to an image with QR code using *.readqr*
┣▣ 📌 Example: *.readqr (reply to QR image)
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const buffer = await m.quoted.download();
        const formData = new FormData();
        formData.append('file', buffer, 'qr.png');
        
        const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const qrData = response.data[0].symbol[0].data;
        
        if (!qrData) {
            return reply(`❌ No QR code found in the image\n\n⚡ ${config.BOT_NAME} ✨`);
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔍 QR SCAN RESULT
┣▣
┣▣ 📋 CONTENT: ${qrData}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 4. URL SHORTENER
// ==============================================
cmd({
    pattern: "shorten",
    alias: ["shorturl", "tinyurl"],
    react: "🔗",
    desc: "Shorten long URLs",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.shorten https://example.com/very/long/url
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const url = args[0];
        
        if (!url.match(/^https?:\/\//)) {
            return reply(`❌ Please provide a valid URL starting with http:// or https://\n\n⚡ ${config.BOT_NAME} ✨`);
        }

        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        const shortUrl = response.data;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔗 URL SHORTENER
┣▣
┣▣ 📋 ORIGINAL: ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}
┣▣ 🔗 SHORTENED: ${shortUrl}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 5. WEATHER COMMAND
// ==============================================
cmd({
    pattern: "weather",
    alias: ["wttr", "temp"],
    react: "🌤️",
    desc: "Get weather information for a city",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.weather Dar es Salaam
┣▣ 📌 *.weather London
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const city = args.join(' ');
        const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%h+%w+%p&m`);
        const weatherData = response.data.trim();

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🌤️ WEATHER INFO
┣▣
┣▣ 📍 LOCATION: ${city}
┣▣ 🌡️ CONDITIONS: ${weatherData}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ City not found or API error\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 6. PASSWORD GENERATOR
// ==============================================
cmd({
    pattern: "genpass",
    alias: ["password", "generatepass"],
    react: "🔐",
    desc: "Generate strong random password",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        let length = 12;
        if (args[0] && !isNaN(args[0])) {
            length = parseInt(args[0]);
            if (length < 4) length = 4;
            if (length > 50) length = 50;
        }

        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        let strength = "Weak";
        if (length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            strength = "Strong";
        } else if (length >= 6 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) {
            strength = "Medium";
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔐 PASSWORD GENERATOR
┣▣
┣▣ 📋 SETTINGS
┣▣ 📏 Length: ${length}
┣▣ 💪 Strength: ${strength}
┣▣
┣▣ 🔑 PASSWORD: ${password}
┣▣
┣▣ ⚠️ Keep this password safe!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 7. RANDOM QUOTE
// ==============================================
cmd({
    pattern: "quote",
    alias: ["randomquote", "motivation"],
    react: "💬",
    desc: "Get random inspirational quote",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const quotes = [
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
            { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
            { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
            { quote: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 💬 RANDOM QUOTE
┣▣
┣▣ 📝 "${randomQuote.quote}"
┣▣
┣▣ ✍️ - ${randomQuote.author}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 8. TRANSLATE COMMAND
// ==============================================
cmd({
    pattern: "tr",
    alias: ["translate"],
    react: "🌐",
    desc: "Translate text to different languages",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply, quoted}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.tr en:sw hello world
┣▣ 📌 Reply to text with *.tr en:sw
┣▣
┣▣ Language codes: en=english, sw=swahili,
┣▣ fr=french, es=spanish, de=german
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let targetLang = "en";
        let text = "";

        if (args[0].includes(':')) {
            const langParts = args[0].split(':');
            targetLang = langParts[1] || "en";
            text = args.slice(1).join(' ');
        } else {
            targetLang = args[0];
            text = args.slice(1).join(' ');
        }

        if (m.quoted && m.quoted.message && m.quoted.message.conversation) {
            text = m.quoted.message.conversation;
        } else if (m.quoted && m.quoted.message && m.quoted.message.extendedTextMessage) {
            text = m.quoted.message.extendedTextMessage.text;
        }

        if (!text) {
            return reply(`❌ No text to translate\n\n⚡ ${config.BOT_NAME} ✨`);
        }

        const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const translatedText = response.data[0][0][0];
        const detectedLang = response.data[2];

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🌐 TRANSLATION
┣▣
┣▣ 📋 ORIGINAL
┣▣ 🔤 ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}
┣▣ 🌍 Detected: ${detectedLang}
┣▣
┣▣ 📋 TRANSLATED
┣▣ 💬 ${translatedText}
┣▣ 🎯 Target: ${targetLang}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Translation failed\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 9. SPEED TEST
// ==============================================
cmd({
    pattern: "speed",
    alias: ["speedtest", "netspeed"],
    react: "⚡",
    desc: "Test internet speed",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const startTime = Date.now();
        const testUrl = 'https://speedtest.tele2.net/1MB.zip';
        const response = await axios({ method: 'get', url: testUrl, responseType: 'stream', timeout: 10000 });
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const fileSizeMB = 1;
        const speedMbps = (fileSizeMB * 8 / duration).toFixed(2);

        const pingStart = Date.now();
        await axios.get('https://www.google.com', { timeout: 5000 });
        const pingEnd = Date.now();
        const ping = pingEnd - pingStart;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚡ SPEED TEST RESULT
┣▣
┣▣ 📊 DOWNLOAD SPEED
┣▣ 📥 Speed: ${speedMbps} Mbps
┣▣ ⏱️ Time: ${duration.toFixed(2)}s
┣▣
┣▣ 📡 PING
┣▣ 📶 Latency: ${ping}ms
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Speed test failed. Try again later.\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 10. RANDOM CAT FACT
// ==============================================
cmd({
    pattern: "catfact",
    alias: ["cat", "kitty"],
    react: "🐱",
    desc: "Get random cat facts",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const response = await axios.get('https://catfact.ninja/fact');
        const fact = response.data.fact;
        const length = response.data.length;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🐱 CAT FACT
┣▣
┣▣ 📋 FACT
┣▣ 📝 ${fact}
┣▣
┣▣ 📊 DETAILS
┣▣ 📏 Length: ${length} characters
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        const fallbackFacts = [
            "Cats sleep for about 70% of their lives.",
            "A group of cats is called a clowder.",
            "Cats have five toes on their front paws but only four on their back paws.",
            "Adult cats have 30 teeth.",
            "Cats can rotate their ears 180 degrees.",
            "A cat's nose print is unique like a human's fingerprint."
        ];
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🐱 CAT FACT
┣▣
┣▣ 📝 ${randomFact}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});