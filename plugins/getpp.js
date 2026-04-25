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

        // Simple caption with ONLY channel link
        const caption = `
📸 NICE PHOTO 💕💞🌹💯

🔗 JOIN MY CHANNEL:
https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02
`.trim();

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "💯", key: mek.key } });

    } catch (err) {
        console.error("ERROR:", err);
        reply("❌ Failed to fetch profile picture");
    }
});
