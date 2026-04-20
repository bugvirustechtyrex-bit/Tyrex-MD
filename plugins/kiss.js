const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "sila",
    alias: ["reaction", "animegif", "otaku"],
    react: "🎬",
    desc: "Send anime reaction GIFs",
    category: "fun",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, q, reply}) => {
    try{
        const reactions = [
            "kiss", "hug", "slap", "punch", "kick", "bite", "pat", 
            "lick", "cuddle", "nom", "wink", "facepalm", "happy", 
            "sad", "cry", "angry", "dance", "blush", "smug", 
            "think", "wave", "highfive", "handhold", "stare", 
            "kill", "shoot", "yeet", "bonk", "tickle"
        ];
        
        if (!q || !q.trim()) {
            return await reply(`📌 *How to use:*\n*.gif kiss*\n*.gif hug*\n*.gif slap*\n\n📋 *Available reactions:*\n${reactions.slice(0, 15).join(", ")}\n${reactions.slice(15).join(", ")}`);
        }
        
        let reaction = q.trim().toLowerCase();
        
        if (!reactions.includes(reaction)) {
            return await reply(`❌ Invalid reaction: *${reaction}*\n\n📋 *Available reactions:*\n${reactions.join(", ")}`);
        }
        
        // Call API
        const response = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${reaction}`, {
            timeout: 10000
        });
        
        if (!response.data || !response.data.url) {
            throw new Error('No GIF URL received');
        }
        
        const gifUrl = response.data.url;
        
        // Option 1: Send as image (GIF will move if it's actually a GIF)
        await conn.sendMessage(from, {
            image: { url: gifUrl },
            caption: `🎬 *${reaction.toUpperCase()}* reaction GIF\n👤 Requested by: @${sender.split('@')[0]}`,
            mentions: [sender],
            mimetype: 'image/gif'
        }, { quoted: mek });
        
        /* 
        // Option 2: If option 1 doesn't work, try sending as document
        // Uncomment this and comment option 1 if GIFs still don't work
        
        await conn.sendMessage(from, {
            document: { url: gifUrl },
            mimetype: 'image/gif',
            fileName: `${reaction}.gif`,
            caption: `🎬 *${reaction.toUpperCase()}* reaction GIF\n👤 Requested by: @${sender.split('@')[0]}`,
            mentions: [sender]
        }, { quoted: mek });
        */
        
    } catch (e) {
        console.error('GIF Command Error:', e);
        
        let errorMsg = '❌ Failed to fetch GIF. Please try again later.';
        
        if (e.code === 'ECONNABORTED') {
            errorMsg = '❌ Request timed out. Please try again.';
        } else if (e.message.includes('ECONNREFUSED')) {
            errorMsg = '❌ Cannot connect to GIF service.';
        }
        
        await reply(errorMsg);
    }
});