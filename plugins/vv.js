const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const config = require('../config');

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "⚡"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        }
    };
};

cmd({
    pattern: "vv",
    alias: ["viewonce", "reveal", "vo"],
    desc: "Fungua picha/video ya view-once",
    category: "tools",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 USAGE
┣▣ 📌 Taga view-once message na jibu kwa *.vv*
┣▣
┣▣ 📌 Example: Reply to view-once with *.vv*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Handle view-once wrapper
        const viewOnceMsg = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || null;
        const mediaMessage = viewOnceMsg?.message?.imageMessage || 
                           viewOnceMsg?.message?.videoMessage || 
                           quoted.imageMessage || 
                           quoted.videoMessage;

        if (!mediaMessage) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 REASON
┣▣ ⚠️ Hakuwa na view-once message
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
        const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

        if (!mediaMessage.viewOnce) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 REASON
┣▣ ⚠️ Hii si view-once message
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Ping-style reaction
        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '👁️', '✨', '💫', '⚡'];
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        
        await conn.sendMessage(from, {
            react: { text: reactEmoji, key: mek.key }
        });

        // Download media
        const stream = await downloadContentFromMessage(
            mediaMessage,
            isImage ? "image" : "video"
        );
        
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Send revealed media (NOT view-once)
        await conn.sendMessage(from, {
            [isImage ? "image" : "video"]: buffer,
            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIEW-ONCE REVEALED
┣▣
┣▣ 📋 DETAILS
┣▣ 📌 TYPE: ${isImage ? 'IMAGE' : 'VIDEO'}
┣▣ 📝 CAPTION: ${mediaMessage.caption || 'Hakuna maandishi'}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (err) {
        console.error("VV Command Error:", err);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ COMMAND ERROR
┣▣
┣▣ 📋 ERROR INFO
┣▣ 📋 ${err.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});