const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const VIDEO_IMAGE = 'https://files.catbox.moe/36vahk.png';

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv"],
    desc: "Download videos from YouTube",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   🎥 ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎥
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴀɢᴇ﹒✦ ───┐
│ ❓ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠɪᴅᴇᴏ ɴᴀᴍᴇ
└────────────────────┘

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴠɪᴅᴇᴏ ᴄʀɪꜱᴛɪᴀɴᴏ ʀᴏɴᴀʟᴅᴏ ɢᴏᴀʟ*

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔍 ꜱᴇᴀʀᴄʜɪɴɢ ᴠɪᴅᴇᴏ... 🔍
╚════════════════════╝

⏳ ʟᴏᴏᴋɪɴɢ ꜰᴏʀ: *${q}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const search = await yts(q);
        if (!search.videos.length) {
            return await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❌ ɴᴏᴛ ꜰᴏᴜɴᴅ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ 😕 ɴᴏ ᴠɪᴅᴇᴏꜱ ꜰᴏᴜɴᴅ ꜰᴏʀ: ${q}
└────────────────────┘

📌 ᴛʀʏ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴋᴇʏᴡᴏʀᴅꜱ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const data = search.videos[0];
        const ytUrl = data.url;

        // Using working API
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ﹒✦ ───┐
│ 😵 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ
│ 💡 ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const result = apiRes.result.media;
        
        const caption = `╔════════════════════╗
║   🎬 ᴠɪᴅᴇᴏ ꜰᴏᴜɴᴅ 🎬
╚════════════════════╝

┌─── ✦﹒ᴠɪᴅᴇᴏ ɪɴꜰᴏ﹒✦ ───┐
│ 📌 ᴛɪᴛʟᴇ: ${data.title.substring(0, 50)}${data.title.length > 50 ? '...' : ''}
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${data.timestamp}
│ 👀 ᴠɪᴇᴡꜱ: ${data.views}
│ 🔗 ʟɪɴᴋ: ${data.url}
└────────────────────┘

┌─── ✦﹒ᴄʜᴏᴏꜱᴇ ᴏᴘᴛɪᴏɴ﹒✦ ───┐
│ 1️⃣ ꜱᴇɴᴅ ᴀꜱ ᴠɪᴅᴇᴏ
│ 2️⃣ ꜱᴇɴᴅ ᴀꜱ ᴅᴏᴄᴜᴍᴇɴᴛ
└────────────────────┘

📌 ʀᴇᴘʟʏ ᴡɪᴛʜ *1* ᴏʀ *2*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: result.thumbnail || VIDEO_IMAGE }, 
            caption: caption,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        const messageID = sentMsg.key.id;

        // Store handler for this specific message
        const messageHandler = async (msgData) => {
            if (!msgData.messages) return;
            
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
            const senderID = receivedMsg.key.remoteJid;

            if (isReplyToBot && senderID === from) {
                const choice = receivedText.trim();
                
                try {
                    if (choice === "1") {
                        // Send as video
                        await conn.sendMessage(senderID, { 
                            video: { url: result.video_url }, 
                            mimetype: "video/mp4",
                            caption: `╔════════════════════╗
║   ✅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴠɪᴅᴇᴏ﹒✦ ───┐
│ 📌 ${data.title}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                            contextInfo: getContextInfo({ sender: sender })
                        }, { quoted: mek });
                        
                    } else if (choice === "2") {
                        // Send as document
                        await conn.sendMessage(senderID, { 
                            document: { url: result.video_url }, 
                            mimetype: "video/mp4", 
                            fileName: `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
                            caption: `╔════════════════════╗
║   📄 ᴠɪᴅᴇᴏ ᴀꜱ ᴅᴏᴄᴜᴍᴇɴᴛ 📄
╚════════════════════╝

┌─── ✦﹒ꜰɪʟᴇ﹒✦ ───┐
│ 📌 ${data.title}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                            contextInfo: getContextInfo({ sender: sender })
                        }, { quoted: mek });
                        
                    } else {
                        await conn.sendMessage(senderID, { 
                            text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴄʜᴏɪᴄᴇ ❌
╚════════════════════╝

📌 ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ᴡɪᴛʜ *1* ᴏʀ *2*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                            contextInfo: getContextInfo({ sender: sender })
                        }, { quoted: mek });
                    }
                } catch (err) {
                    console.error("Video send error:", err.message);
                    await conn.sendMessage(senderID, { 
                        text: `╔════════════════════╗
║   ❌ ꜱᴇɴᴅ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ﹒✦ ───┐
│ 😵 ꜰᴀɪʟᴇᴅ ᴛᴏ ꜱᴇɴᴅ ᴠɪᴅᴇᴏ
│ 📋 ${err.message.substring(0, 50)}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                }
                
                // Remove listener
                conn.ev.off('messages.upsert', messageHandler);
            }
        };

        // Add listener
        conn.ev.on('messages.upsert', messageHandler);
        
        // Auto remove after 60 seconds
        setTimeout(() => {
            conn.ev.off('messages.upsert', messageHandler);
        }, 60000);

    } catch (error) {
        console.error('Video Error:', error.message);
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ﹒✦ ───┐
│ 😵 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ!
│ 📋 ${error.message.substring(0, 50)}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});