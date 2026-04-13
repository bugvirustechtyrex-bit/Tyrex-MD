const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs-extra');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
    };
};

// 1. CALCULATOR COMMAND
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
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ᴄᴀʟᴄ 2+2*\n📌 *.ᴄᴀʟᴄ 10-5*\n📌 *.ᴄᴀʟᴄ 6*8*\n📌 *.ᴄᴀʟᴄ 100/4*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const expression = args.join(' ');
    
    // Security: Only allow basic math operations
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮\n┃ ɪɴᴠᴀʟɪᴅ\n╰━━━━━━━━╯\n\n❌ ᴏɴʟʏ ɴᴜᴍʙᴇʀꜱ ᴀɴᴅ ʙᴀꜱɪᴄ ᴏᴘᴇʀᴀᴛᴏʀꜱ ᴀʟʟᴏᴡᴇᴅ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    try {
        const result = eval(expression);
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🧮 ᴄᴀʟᴄᴜʟᴀᴛɪᴏɴ 🧮
╚════════════════════╝

┌─── ✦﹒ᴇǫᴜᴀᴛɪᴏɴ﹒✦ ───┐
│ 📝 ${expression}
└────────────────────┘

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ ✅ ${result}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } catch (evalError) {
        reply(`❌ ɪɴᴠᴀʟɪᴅ ᴇxᴘʀᴇꜱꜱɪᴏɴ`);
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. QR CODE GENERATOR
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
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ǫʀ ʜᴇʟʟᴏ ᴡᴏʀʟᴅ*\n📌 *.ǫʀᴄᴏᴅᴇ ᴛᴇxᴛ ʜᴇʀᴇ*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const text = args.join(' ');
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

    await conn.sendMessage(from, {
        image: { url: apiUrl },
        caption: `╔════════════════════╗
║   📱 ǫʀ ᴄᴏᴅᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ 📱
╚════════════════════╝

📝 ᴛᴇxᴛ: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 3. READ QR CODE
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
            text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴡɪᴛʜ ǫʀ ᴄᴏᴅᴇ\n\nᴇxᴀᴍᴘʟᴇ: *.ʀᴇᴀᴅǫʀ* (ʀᴇᴘʟʏ ᴛᴏ ɪᴍᴀɢᴇ)\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    // Download the image
    const buffer = await m.quoted.download();
    
    // Send to QR reading API
    const formData = new FormData();
    formData.append('file', buffer, 'qr.png');
    
    const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const qrData = response.data[0].symbol[0].data;
    
    if (!qrData) {
        return reply('❌ ɴᴏ ǫʀ ᴄᴏᴅᴇ ꜰᴏᴜɴᴅ ɪɴ ᴛʜᴇ ɪᴍᴀɢᴇ');
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ǫʀ ꜱᴄᴀɴ ʀᴇꜱᴜʟᴛ 🔍
╚════════════════════╝

┌─── ✦﹒ᴄᴏɴᴛᴇɴᴛ﹒✦ ───┐
│ 📄 ${qrData}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 4. URL SHORTENER
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
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ꜱʜᴏʀᴛᴇɴ https://example.com/very/long/url*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const url = args[0];
    
    // Validate URL
    if (!url.match(/^https?:\/\//)) {
        return reply('❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴜʀʟ ꜱᴛᴀʀᴛɪɴɢ ᴡɪᴛʜ http:// ᴏʀ https://');
    }

    // Using TinyURL API
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const shortUrl = response.data;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔗 ᴜʀʟ ꜱʜᴏʀᴛᴇɴᴇʀ 🔗
╚════════════════════╝

┌─── ✦﹒ᴏʀɪɢɪɴᴀʟ﹒✦ ───┐
│ 📎 ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ꜱʜᴏʀᴛᴇɴᴇᴅ﹒✦ ───┐
│ 🔗 ${shortUrl}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 5. WEATHER COMMAND
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
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ᴡᴇᴀᴛʜᴇʀ ᴅᴀʀ ᴇꜱ ꜱᴀʟᴀᴀᴍ*\n📌 *.ᴡᴇᴀᴛʜᴇʀ ʟᴏɴᴅᴏɴ*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const city = args.join(' ');
    
    // Using wttr.in API
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%h+%w+%p&m`);
    const weatherData = response.data.trim();

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🌤️ ᴡᴇᴀᴛʜᴇʀ ɪɴꜰᴏ 🌤️
╚════════════════════╝

┌─── ✦﹒ʟᴏᴄᴀᴛɪᴏɴ﹒✦ ───┐
│ 📍 ${city}
└────────────────────┘

┌─── ✦﹒ᴄᴏɴᴅɪᴛɪᴏɴꜱ﹒✦ ───┐
│ 🌡️ ${weatherData}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʹʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴄɪᴛʏ ɴᴏᴛ ꜰᴏᴜɴᴅ ᴏʀ ᴀᴘɪ ᴇʀʀᴏʀ`);
}
});

// 6. PASSWORD GENERATOR
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
    let length = 12; // Default length
    
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

    // Calculate password strength
    let strength = "Weak";
    if (length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strength = "Strong";
    } else if (length >= 6 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) {
        strength = "Medium";
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔐 ᴘᴀꜱꜱᴡᴏʀᴅ ɢᴇɴ 🔐
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 📏 ʟᴇɴɢᴛʜ: ${length}
│ 💪 ꜱᴛʀᴇɴɢᴛʜ: ${strength}
└────────────────────┘

┌─── ✦﹒ᴘᴀꜱꜱᴡᴏʀᴅ﹒✦ ───┐
│ 🔑 ${password}
└────────────────────┘

⚠️ ᴋᴇᴇᴘ ᴛʜɪꜱ ᴘᴀꜱꜱᴡᴏʀᴅ ꜱᴀꜰᴇ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 7. RANDOM QUOTE
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
        { quote: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
        { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   💬 ʀᴀɴᴅᴏᴍ ǫᴜᴏᴛᴇ 💬
╚════════════════════╝

┌─── ✦﹒ǫᴜᴏᴛᴇ﹒✦ ───┐
│ " ${randomQuote.quote} "
└────────────────────┘

┌─── ✦﹒ᴀᴜᴛʜᴏʀ﹒✦ ───┐
│ ✍️ - ${randomQuote.author}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 8. TRANSLATE COMMAND
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
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ᴛʀ ᴇɴ:ꜱᴡ ʜᴇʟʟᴏ*\n📌 ʀᴇᴘʟʏ ᴛᴏ ᴛᴇxᴛ: *.ᴛʀ ᴇɴ:ꜱᴡ*\n\nʟᴀɴɢᴜᴀɢᴇ ᴄᴏᴅᴇꜱ:\nᴇɴ=english, ꜱᴡ=swahili, ꜰʀ=french, ᴇꜱ=spanish, ᴅᴇ=german\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    let targetLang = "en";
    let text = "";
    
    // Parse language code
    if (args[0].includes(':')) {
        const langParts = args[0].split(':');
        targetLang = langParts[1] || "en";
        text = args.slice(1).join(' ');
    } else {
        targetLang = args[0];
        text = args.slice(1).join(' ');
    }

    // If replying to a message
    if (m.quoted && m.quoted.message && m.quoted.message.conversation) {
        text = m.quoted.message.conversation;
    } else if (m.quoted && m.quoted.message && m.quoted.message.extendedTextMessage) {
        text = m.quoted.message.extendedTextMessage.text;
    }

    if (!text) {
        return reply('❌ ɴᴏ ᴛᴇxᴛ ᴛᴏ ᴛʀᴀɴꜱʟᴀᴛᴇ');
    }

    // Using Google Translate API
    const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const translatedText = response.data[0][0][0];
    const detectedLang = response.data[2];

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🌐 ᴛʀᴀɴꜱʟᴀᴛɪᴏɴ 🌐
╚════════════════════╝

┌─── ✦﹒ᴏʀɪɢɪɴᴀʟ﹒✦ ───┐
│ 🔤 ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}
│ 🌍 ᴅᴇᴛᴇᴄᴛᴇᴅ: ${detectedLang}
└────────────────────┘

┌─── ✦﹒ᴛʀᴀɴꜱʟᴀᴛᴇᴅ﹒✦ ───┐
│ 💬 ${translatedText}
│ 🎯 ᴛᴀʀɢᴇᴛ: ${targetLang}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴛʀᴀɴꜱʟᴀᴛɪᴏɴ ꜰᴀɪʟᴇᴅ`);
}
});

// 9. SPEED TEST
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
    const startMsg = await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ⚡ ꜱᴘᴇᴇᴅ ᴛᴇꜱᴛ ⚡
╚════════════════════╝

▸ ᴛᴇꜱᴛɪɴɢ ɪɴᴛᴇʀɴᴇᴛ ꜱᴘᴇᴇᴅ...
▸ ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const startTime = Date.now();
    
    // Download a small file to test speed
    const testUrl = 'https://speedtest.tele2.net/1MB.zip';
    const response = await axios({
        method: 'get',
        url: testUrl,
        responseType: 'stream',
        timeout: 10000
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // in seconds
    const fileSizeMB = 1; // 1MB
    const speedMbps = (fileSizeMB * 8 / duration).toFixed(2);
    
    // Ping test
    const pingStart = Date.now();
    await axios.get('https://www.google.com', { timeout: 5000 });
    const pingEnd = Date.now();
    const ping = pingEnd - pingStart;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ⚡ ꜱᴘᴇᴇᴅ ᴛᴇꜱᴛ ʀᴇꜱᴜʟᴛ ⚡
╚════════════════════╝

┌─── ✦﹒ᴅᴏᴡɴʟᴏᴀᴅ﹒✦ ───┐
│ 📥 ꜱᴘᴇᴇᴅ: ${speedMbps} ᴍʙᴘꜱ
│ ⏱️ ᴛɪᴍᴇ: ${duration.toFixed(2)}ꜱ
└────────────────────┘

┌─── ✦﹒ᴘɪɴɢ﹒✦ ───┐
│ 📶 ʟᴀᴛᴇɴᴄʏ: ${ping}ᴍꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ꜱᴘᴇᴇᴅ ᴛᴇꜱᴛ ꜰᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.`);
}
});

// 10. RANDOM CAT FACT
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
        text: `╔════════════════════╗
║   🐱 ᴄᴀᴛ ꜰᴀᴄᴛ 🐱
╚════════════════════╝

┌─── ✦﹒ꜰᴀᴄᴛ﹒✦ ───┐
│ 📝 ${fact}
└────────────────────┘

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 📏 ʟᴇɴɢᴛʜ: ${length} ᴄʜᴀʀᴀᴄᴛᴇʀꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    
    // Fallback facts in case API fails
    const fallbackFacts = [
        "Cats sleep for about 70% of their lives.",
        "A group of cats is called a clowder.",
        "Cats have five toes on their front paws but only four on their back paws.",
        "Adult cats have 30 teeth.",
        "Cats can rotate their ears 180 degrees.",
        "A cat's nose print is unique like a human's fingerprint.",
        "Cats can make over 100 different sounds.",
        "The heaviest cat on record weighed over 46 pounds."
    ];
    
    const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🐱 ᴄᴀᴛ ꜰᴀᴄᴛ 🐱
╚════════════════════╝

┌─── ✦﹒ꜰᴀᴄᴛ﹒✦ ───┐
│ 📝 ${randomFact}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});