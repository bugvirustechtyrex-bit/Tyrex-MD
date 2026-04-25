const { cmd } = require('../command');

cmd({
    pattern: "nicepic",
    alias: ["np"],
    react: "💕",
    desc: "Tuma picha na maandishi mazuri",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // BOT NAME
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        
        // CHANNEL LINK YAKO - Badilisha hii!!
        const channelLink = "https://whatsapp.com/channel/XXXXXXXXX";
        
        // SIMPLE CAPTION
        const caption = `✨ NICE PHOTO ✨
━━━━━━━━━━━━━━━━
💕💞🌹💯

📢 JOIN MY CHANNEL
${channelLink}

> ${botName}`;
        
        // Tumia image kutoka kwa bot (kama ipo)
        // Au tumia text tu kwanza ku-test
        await conn.sendMessage(from, {
            text: caption
        }, { quoted: mek });
        
        // Reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (err) {
        console.log("Error:", err);
        reply("❌ Error: " + err.message);
    }
});
