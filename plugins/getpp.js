const { cmd } = require('../command');

cmd({
    pattern: "nicepic",
    alias: ["np"],
    react: "💕",
    desc: "Tuma picha nzuri",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Jaribu kutuma text tu kwanza
        await reply("✅ Command inafanya kazi! Sasa naongeza picha...");
        
        // BOT NAME
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        
        // CHANNEL LINK - Badilisha hii!!
        const channelLink = "https://whatsapp.com/channel/XXXXXXXXX";
        
        // Caption
        const caption = `✨ NICE PHOTO ✨

💕💞🌹💯

📢 JOIN MY CHANNEL
${channelLink}

> ${botName}`;
        
        // Tumia picha kutoka kwa bot (kama ipo)
        // Ikiwa bot ina profile picture, tumia hiyo
        try {
            const ppUrl = await conn.profilePictureUrl(conn.user.id, 'image');
            await conn.sendMessage(from, {
                image: { url: ppUrl },
                caption: caption
            }, { quoted: mek });
        } catch (imgErr) {
            // Kama hakuna picha, tuma text tu
            await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (err) {
        console.error("ERROR:", err);
        reply("❌ Error: " + err.message);
    }
});
