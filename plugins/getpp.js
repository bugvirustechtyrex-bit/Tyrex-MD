const { cmd } = require('../command');

cmd({
    pattern: "nicepic",
    alias: ["np", "beautiful", "nicephoto"],
    react: "💕",
    desc: "Tuma picha na maandishi mazuri",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, botFooter }) => {
    try {
        // Reaction ya kuonyesha inachakata
        await conn.sendMessage(from, { react: { text: "💞", key: mek.key } });

        // BOT NAME
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        
        // CHANNEL LINK YAKO - Badilisha hii na link yako
        const channelLink = "https://whatsapp.com/channel/XXXXXXXXX"; // ✏️ Weka link yako hapa!
        
        // Link ya picha (Picha unayotaka itumwe)
        const imageUrl = "https://telegra.ph/file/6c8c9a6f7c3a4b2d5e8f9.jpg"; // ✏️ Weka URL yako ya picha
        
        // Maandishi ya kupendeza
        const caption = `
╔════════════════════╗
║   ✨ *NICE PHOTO* ✨   ║
╠════════════════════╣
║                    ║
║     💕💞🌹💯      ║
║                    ║
║  *Beautiful shot!*  ║
║   *You look amazing* ║
║                    ║
╠════════════════════╣
║  📢 *JOIN MY CHANNEL*  ║
║  ${channelLink}  ║
║                    ║
║   Thanks for using  ║
║      ${botName}    ║
╚════════════════════╝
`.trim();

        // Tuma picha na ujumbe
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption,
            footer: botName
        }, { quoted: mek });

        // Reaction ya kukamilika
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("NICEPIC ERROR:", err);
        
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        const channelLink = "https://whatsapp.com/channel/XXXXXXXXX"; // ✏️ Weka link yako hapa!
        
        // Kama picha haiwezi kupatikana, tuma ujumbe tu
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ✨ *NICE PHOTO* ✨   ║
╠════════════════════╣
║                    ║
║     💕💞🌹💯      ║
║                    ║
║  *Beautiful!* 😍    ║
║                    ║
╠════════════════════╣
║  📢 *JOIN MY CHANNEL*  ║
║  ${channelLink}  ║
║                    ║
║   Thanks for using  ║
║      ${botName}    ║
╚════════════════════╝`,
            footer: botName
        }, { quoted: mek });
    }
});

// Toleo jingine - Tuma picha random
cmd({
    pattern: "beauty",
    alias: ["nice", "lovepic"],
    react: "🌹",
    desc: "Tuma picha nzuri na channel link",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply, botFooter }) => {
    try {
        await conn.sendMessage(from, { react: { text: "💕", key: mek.key } });
        
        // BOT NAME
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        
        // Channel yako link
        const myChannel = "https://whatsapp.com/channel/XXXXXXXXX"; // ✏️ Badilisha
        
        // Picha mbalimbali za kupendeza
        const niceImages = [
            "https://telegra.ph/file/6c8c9a6f7c3a4b2d5e8f9.jpg",
            "https://telegra.ph/file/7d9e0a1b2c3d4e5f6a7b8.jpg",
            "https://telegra.ph/file/8a9b0c1d2e3f4a5b6c7d8.jpg"
        ];
        
        // Chagua picha random
        const randomImage = niceImages[Math.floor(Math.random() * niceImages.length)];
        
        const message = `✨ *NICE PHOTO* ✨
━━━━━━━━━━━━━━━━━━
     💕💞🌹💯
━━━━━━━━━━━━━━━━━━
📸 *Beautiful capture!*
😍 *Keep shining bright!*
━━━━━━━━━━━━━━━━━━
📢 *𝐉𝐎𝐈𝐍 𝐌𝐘 𝐂𝐇𝐀𝐍𝐍𝐄𝐋*
${myChannel}
━━━━━━━━━━━━━━━━━━
> ${botName}`;
        
        await conn.sendMessage(from, {
            image: { url: randomImage },
            caption: message,
            footer: botName
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (err) {
        console.error("BEAUTY ERROR:", err);
        
        const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
        const myChannel = "https://whatsapp.com/channel/XXXXXXXXX"; // ✏️ Badilisha
        
        reply(`✨ *NICE PHOTO* ✨
━━━━━━━━━━━━━━━━━━
     💕💞🌹💯
━━━━━━━━━━━━━━━━━━
📢 *JOIN MY CHANNEL*
${myChannel}
━━━━━━━━━━━━━━━━━━
> ${botName}`);
    }
});
