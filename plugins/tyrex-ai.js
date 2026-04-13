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

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "think", "chatgpt", "brainy", "chat"],
    react: "🤖",
    desc: "Ask AI anything - Powered by GPT",
    category: "ai",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, q, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║   🤖 AI ASSISTANT 🤖
╚═══════════════════════════╝

┌─── ✦ HOW TO USE ✦ ───┐
│ 📌 *.ai what is love?*
│ 📌 *.gpt tell me a joke*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    // Send processing message with typing indicator
    await conn.sendPresenceUpdate('composing', from);
    
    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🤔 THINKING... 🤔
╚═══════════════════════════╝

⏳ AI is processing your question...

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Call AI API
    const response = await axios.get(`https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(q.trim())}`, {
        timeout: 30000 // 30 seconds timeout
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    let aiResponse = response.data.response || response.data.result || response.data.data || JSON.stringify(response.data);

    // Truncate if too long
    if (aiResponse.length > 4000) {
        aiResponse = aiResponse.substring(0, 3990) + '...\n\n📌 *Response truncated due to length*';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   🤖 AI RESPONSE 🤖
╚═══════════════════════════╝

┌─── ✦ YOUR QUESTION ✦ ───┐
│ ❓ ${q.substring(0, 100)}${q.length > 100 ? '...' : ''}
└─────────────────────────┘

┌─── ✦ AI ANSWER ✦ ───┐
│ 💡 ${aiResponse}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    console.error('AI Command Error:', e);
    
    let errorMsg = '❌ AI service is currently unavailable';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ Rate limit exceeded. Please try again later';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ AI server error. Try again later';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ Request timed out. Please try again';
    } else if (e.message.includes('ECONNREFUSED')) {
        errorMsg = '❌ Connection to AI service failed';
    }

    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║   ❌ AI ERROR ❌
╚═══════════════════════════╝

┌─── ✦ ERROR INFO ✦ ───┐
│ 📋 ${errorMsg}
└─────────────────────────┘

💡 Please try again later

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});