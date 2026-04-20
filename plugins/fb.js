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
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 ${config.BOT_NAME}`,
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
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📽️ FACEBOOK DOWNLOADER
┣▣ 📌 *.fb https://www.facebook.com/xxxx*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const fbUrl = q.trim();
        if (!fbUrl.includes("https://") || !fbUrl.includes("facebook.com")) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ INVALID URL
┣▣ 📋 Please provide a valid Facebook link
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const videoData = await getFBInfo(fbUrl);

        if (!videoData || !videoData.sd) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ FETCH FAILED
┣▣ 📋 The link might be private or invalid
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const caption = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📽️ FACEBOOK VIDEO
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 70) || 'No title'}${videoData.title?.length > 70 ? '...' : ''}
┣▣
┣▣ 📋 AVAILABLE OPTIONS
┣▣ 1️⃣ Send as Video (SD)
┣▣ 2️⃣ Send as Video (HD)
┣▣ 3️⃣ Send as Audio
┣▣ 4️⃣ Send as Document
┣▣ 5️⃣ Send as Voice Message
┣▣
┣▣ 📌 Reply with *1, 2, 3, 4, or 5*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoData.thumbnail || "https://files.catbox.moe/98k75b.jpeg" },
            caption,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Send reaction
        await conn.sendMessage(from, {
            react: { text: "📽️", key: mek.key }
        });

        // Reply handler: listen for reply with option
        conn.ev.on("messages.upsert", async update => {
            try {
                const msg = update.messages[0];
                if (!msg.message?.extendedTextMessage) return;
                
                const text = msg.message.extendedTextMessage.text.trim();
                const quotedMsg = msg.message.extendedTextMessage.contextInfo?.stanzaId;
                
                if (quotedMsg === sentMsg.key.id) {
                    await conn.sendMessage(from, {
                        react: { text: "⏳", key: msg.key }
                    });

                    switch (text) {
                        case "1":
                        case "1️⃣":
                            await conn.sendMessage(from, {
                                video: { url: videoData.sd },
                                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIDEO DOWNLOADED
┣▣ 🎬 QUALITY: SD (Standard)
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;

                        case "2":
                        case "2️⃣":
                            if (videoData.hd) {
                                await conn.sendMessage(from, {
                                    video: { url: videoData.hd },
                                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIDEO DOWNLOADED
┣▣ 🎬 QUALITY: HD (High Definition)
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                            } else {
                                await conn.sendMessage(from, {
                                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ HD NOT AVAILABLE
┣▣ 📤 Sending SD instead...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                                
                                await conn.sendMessage(from, {
                                    video: { url: videoData.sd },
                                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIDEO DOWNLOADED
┣▣ 🎬 QUALITY: SD (Standard)
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                                }, { quoted: msg });
                            }
                            break;

                        case "3":
                        case "3️⃣":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/mpeg",
                                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ AUDIO DOWNLOADED
┣▣ 🎵 Audio from Facebook video
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;

                        case "4":
                        case "4️⃣":
                            await conn.sendMessage(from, {
                                document: { url: videoData.sd },
                                mimetype: "video/mp4",
                                fileName: `${config.BOT_NAME}_FB_${Date.now()}.mp4`,
                                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📄 DOCUMENT SENT
┣▣ 🎬 Video as document
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;

                        case "5":
                        case "5️⃣":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/ogg; codecs=opus",
                                ptt: true,
                                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎤 VOICE MESSAGE
┣▣ 🔊 Audio as voice message
┣▣ 📌 TITLE: ${videoData.title?.substring(0, 50) || 'N/A'}...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;

                        default:
                            await conn.sendMessage(from, {
                                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ INVALID CHOICE
┣▣ 📌 Please reply with *1, 2, 3, 4, or 5*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid })
                            }, { quoted: msg });
                            break;
                    }
                    
                    await conn.sendMessage(from, {
                        react: { text: "✅", key: msg.key }
                    });
                }
            } catch (e) {
                console.error("❌ FB Reply Handler Error:", e);
            }
        });

    } catch (error) {
        console.error("❌ FB Command Error:", error);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ DOWNLOAD ERROR
┣▣ 📋 ${error.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});