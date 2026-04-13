const { cmd } = require("../command");
const getFBInfo = require("@xaviabot/fb-downloader");
const config = require("../config");
const fs = require("fs");
const path = require("path");

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
        externalAdReply: {
            title: `👑 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍`,
            body: `📞 Premium Bot`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/98k75b.jpeg',
            sourceUrl: `https://github.com/binadnan`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl", "facebookdl"],
    desc: "Download Facebook videos/audios",
    category: "downloader",
    react: "📽️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   📽️ ꜰᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 📽️
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 📌 *.ꜰʙ https://www.facebook.com/xxxx*
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
        
        const fbUrl = q.trim();
        
        if (!fbUrl.includes("https://") || !fbUrl.includes("facebook.com")) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴜʀʟ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ꜰᴀᴄᴇʙᴏᴏᴋ ʟɪɴᴋ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Send processing message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔄 ᴘʀᴏᴄᴇꜱꜱɪɴɢ... 🔄
╚════════════════════╝

⏳ ꜰᴇᴛᴄʜɪɴɢ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ ᴅᴀᴛᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const videoData = await getFBInfo(fbUrl);

        if (!videoData || !videoData.sd) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ꜰᴇᴛᴄʜ ꜰᴀɪʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴛʜᴇ ʟɪɴᴋ ᴍɪɢʜᴛ ʙᴇ ᴘʀɪᴠᴀᴛᴇ ᴏʀ ɪɴᴠᴀʟɪᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const caption = `╔════════════════════╗
║   📽️ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ 📽️
╚════════════════════╝

┌─── ✦﹒ᴠɪᴅᴇᴏ ɪɴꜰᴏ﹒✦ ───┐
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 70) || 'ɴᴏ ᴛɪᴛʟᴇ'}${videoData.title?.length > 70 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ᴀᴠᴀɪʟᴀʙʟᴇ ᴏᴘᴛɪᴏɴꜱ﹒✦ ───┐
│
│ 1️⃣ ꜱᴇɴᴅ ᴀꜱ ᴠɪᴅᴇᴏ (ꜱᴅ)
│ 2️⃣ ꜱᴇɴᴅ ᴀꜱ ᴠɪᴅᴇᴏ (ʜᴅ)
│ 3️⃣ ꜱᴇɴᴅ ᴀꜱ ᴀᴜᴅɪᴏ ᴏɴʟʏ
│ 4️⃣ ꜱᴇɴᴅ ᴀꜱ ᴅᴏᴄᴜᴍᴇɴᴛ
│ 5️⃣ ꜱᴇɴᴅ ᴀꜱ ᴠᴏɪᴄᴇ ᴍᴇꜱꜱᴀɢᴇ
│
└────────────────────┘

📌 ʀᴇᴘʟʏ ᴡɪᴛʜ *1, 2, 3, 4, ᴏʀ 5*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoData.thumbnail || "https://files.catbox.moe/98k75b.jpeg" },
            caption,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Send reaction
        await conn.sendMessage(from, { react: { text: "📽️", key: mek.key } });

        // Reply handler: listen for reply with option
        conn.ev.on("messages.upsert", async update => {
            try {
                const msg = update.messages[0];
                if (!msg.message?.extendedTextMessage) return;
                
                const text = msg.message.extendedTextMessage.text.trim();
                const quotedMsg = msg.message.extendedTextMessage.contextInfo?.stanzaId;
                
                if (quotedMsg === sentMsg.key.id) {
                    await conn.sendMessage(from, { react: { text: "⏳", key: msg.key } });

                    switch (text) {
                        case "1":
                        case "1️⃣":
                            await conn.sendMessage(from, {
                                video: { url: videoData.sd },
                                caption: `╔════════════════════╗
║   ✅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎬 ǫᴜᴀʟɪᴛʏ: ꜱᴅ (ꜱᴛᴀɴᴅᴀʀᴅ)
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                            
                        case "2":
                        case "2️⃣":
                            if (videoData.hd) {
                                await conn.sendMessage(from, {
                                    video: { url: videoData.hd },
                                    caption: `╔════════════════════╗
║   ✅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎬 ǫᴜᴀʟɪᴛʏ: ʜᴅ (ʜɪɢʜ ᴅᴇꜰɪɴɪᴛɪᴏɴ)
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                            } else {
                                await conn.sendMessage(from, { 
                                    text: `╔════════════════════╗
║   ⚠️ ʜᴅ ɴᴏᴛ ᴀᴠᴀɪʟᴀʙʟᴇ ⚠️
╚════════════════════╝

📤 ꜱᴇɴᴅɪɴɢ ꜱᴅ ɪɴꜱᴛᴇᴀᴅ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                                
                                await conn.sendMessage(from, {
                                    video: { url: videoData.sd },
                                    caption: `╔════════════════════╗
║   ✅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎬 ǫᴜᴀʟɪᴛʏ: ꜱᴅ (ꜱᴛᴀɴᴅᴀʀᴅ)
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                            }
                            break;
                            
                        case "3":
                        case "3️⃣":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/mpeg",
                                caption: `╔════════════════════╗
║   ✅ ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎵 ᴀᴜᴅɪᴏ ꜰʀᴏᴍ ꜰᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                            
                        case "4":
                        case "4️⃣":
                            await conn.sendMessage(from, {
                                document: { url: videoData.sd },
                                mimetype: "video/mp4",
                                fileName: `BIN_ADNAN_FB_${Date.now()}.mp4`,
                                caption: `╔════════════════════╗
║   📄 ᴅᴏᴄᴜᴍᴇɴᴛ ꜰɪʟᴇ 📄
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎬 ᴠɪᴅᴇᴏ ᴀꜱ ᴅᴏᴄᴜᴍᴇɴᴛ
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                            
                        case "5":
                        case "5️⃣":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/ogg; codecs=opus",
                                ptt: true,
                                caption: `╔════════════════════╗
║   🎤 ᴠᴏɪᴄᴇ ᴍᴇꜱꜱᴀɢᴇ 🎤
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🔊 ᴀᴜᴅɪᴏ ᴀꜱ ᴠᴏɪᴄᴇ ᴍᴇꜱꜱᴀɢᴇ
│ 📌 ᴛɪᴛʟᴇ: ${videoData.title?.substring(0, 50) || 'ɴ/ᴀ'}...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                            
                        default:
                            await conn.sendMessage(from, { 
                                text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴄʜᴏɪᴄᴇ ❌
╚════════════════════╝

📌 ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ᴡɪᴛʜ *1, 2, 3, 4, ᴏʀ 5*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                    }
                    
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }
            } catch (e) {
                console.error("❌ FB Reply Handler Error:", e);
            }
        });

    } catch (error) {
        console.error("❌ FB Command Error:", error);
        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ᴅᴏᴡɴʟᴏᴀᴅ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});