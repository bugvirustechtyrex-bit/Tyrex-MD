const { cmd } = require('../command');

cmd({
    pattern: "nicepic",
    alias: ["np"],
    react: "💕",
    desc: "Tuma picha nzuri",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";
    const channelLink = "https://whatsapp.com/channel/XXXXXXXXX"; // ✏️ Weka link yako
    
    const caption = `✨ NICE PHOTO ✨
━━━━━━━━━━━━━━━━
💕💞🌹💯
━━━━━━━━━━━━━━━━
📢 JOIN MY CHANNEL
${channelLink}
━━━━━━━━━━━━━━━━
> ${botName}`;
    
    await reply(caption);
});
