const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// FakevCard - Imebadilishwa kwa BIN-ADNAN
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
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
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
                text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ᴛᴀɢᴀ ᴜᴊᴜᴍʙᴇ ᴡᴀ *ᴠɪᴇᴡ-ᴏɴᴄᴇ* ɪɴᴀʏᴏᴏɴᴇꜱʜᴀ ᴍᴀʀʀᴀ ᴍᴏᴊᴀ

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴠᴠ* (ʀᴇᴘʟʏ ᴛᴏ ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴍᴇᴅɪᴀ)

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`, 
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
                text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ᴀɪɴᴀ ʜɪʏᴏ ʜᴀɪᴛᴜɴɢɪᴋᴀɴɪ. ʜᴀᴋɪᴋɪꜱʜᴀ ᴜᴍᴇᴛᴀɢᴀ ᴘɪᴄʜᴀ/ᴠɪᴅᴇᴏ ᴛᴜ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
        const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

        if (!mediaMessage.viewOnce) {
            return await conn.sendMessage(from, { 
                text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ʜɪʏᴏ ꜱɪ ᴘɪᴄʜᴀ/ᴠɪᴅᴇᴏ ʏᴀ ᴋᴜᴏɴᴇꜱʜᴀ ᴍᴀʀʀᴀ ᴍᴏᴊᴀ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Send processing message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   👁️ ᴘʀᴏᴄᴇꜱꜱɪɴɢ... 👁️
╚════════════════════╝

⏳ ɪɴᴀꜰᴜɴɢᴜʟɪᴀ ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴍᴇᴅɪᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        // Ping-style reaction
        const reactionEmojis = ['🔥','⚡','🚀','💨','🎯','🎉','🌟','💥','👁️','✨','💫','⚡'];
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
            caption: `╔════════════════════╗
║   ✅ ᴠɪᴇᴡ-ᴏɴᴄᴇ ʀᴇᴠᴇᴀʟᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 📁 ᴛʏᴘᴇ: ${isImage ? 'ᴘɪᴄʜᴀ' : 'ᴠɪᴅᴇᴏ'}
│ 📝 ᴄᴀᴘᴛɪᴏɴ: ${mediaMessage.caption || 'ʜᴀᴋᴜɴᴀ ᴍᴀᴇʟᴇᴢᴏ'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (err) {
        console.error("VV Command Error:", err);
        await conn.sendMessage(from, { 
            text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ɪᴍᴇꜱʜɪɴᴅɪᴋᴀ ᴋᴜꜰᴜɴɢᴜʟɪᴀ ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴍᴇᴅɪᴀ
📋 ᴋᴏꜱᴀ: ${err.message}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});