const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

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
            return await reply(`📌 *How to use:*\n*.ai what is love?*\n*.gpt tell me a joke*`);
        }

        // Call AI API
        const response = await axios.get(`https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(q.trim())}`, {
            timeout: 30000
        });

        if (!response.data) {
            throw new Error('No response from API');
        }

        let aiResponse = response.data.response || response.data.result || response.data.data || JSON.stringify(response.data);

        // Truncate if too long
        if (aiResponse.length > 4000) {
            aiResponse = aiResponse.substring(0, 3990) + '...\n\n📌 Response truncated due to length';
        }

        // Send plain answer as a REPLY to the user's message
        await conn.sendMessage(from, { text: aiResponse }, { quoted: mek });

    } catch (e) {
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

        await reply(errorMsg);
    }
});