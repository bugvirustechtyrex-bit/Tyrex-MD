const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    alias: ["pp", "profile", "dp"],
    desc: "Fetch user profile picture",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // Identify Target
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else if (q) {
            let num = q.replace(/[^0-9]/g, '');
            target = num + '@s.whatsapp.net';
        } else {
            target = m.sender;
        }

        await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

        // Fetch Profile Picture
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg';
        }

        const userNumber = target.split('@')[0];

        // Simple message with channel
        const caption = `
┏━━━━━━━━━━━━━━━┓
┃    📸 NICE PHOTO 💕
┃
┃    👤 @${userNumber}
┃
┃    💞🌹💯
┃
┃    ✨ TYREX MD ✨
┃    📢 @newsletter 
┃    JID: 120363424973782944
┗━━━━━━━━━━━━━━━┛
`.trim();

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption,
            mentions: [target]
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "💞", key: mek.key } });

    } catch (err) {
        console.error("ERROR:", err);
        reply("❌ Failed to fetch profile picture");
    }
});
