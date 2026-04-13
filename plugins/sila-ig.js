const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");

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

const processedMessages = new Set();

cmd({
    pattern: "ig",
    alias: ["insta", "instagram", "reels", "igdl"],
    desc: "Download Instagram media (posts, reels, stories)",
    category: "downloader",
    react: "📸",
    filename: __filename,
},
async (conn, mek, m, { from, q, sender }) => {
    try {
        if (processedMessages.has(m.key.id)) return;
        processedMessages.add(m.key.id);
        setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

        if (!q) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   📸 ɪɴꜱᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 📸
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 📌 *.ɪɢ https://www.instagram.com/p/xxxx*
│ 📌 *.ɪɴꜱᴛᴀ https://www.instagram.com/reel/xxxx*
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Send processing message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔄 ᴘʀᴏᴄᴇꜱꜱɪɴɢ... 🔄
╚════════════════════╝

⏳ ꜰᴇᴛᴄʜɪɴɢ ɪɴꜱᴛᴀɢʀᴀᴍ ᴍᴇᴅɪᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const downloadData = await igdl(q);
        
        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ɴᴏ ᴍᴇᴅɪᴀ ꜰᴏᴜɴᴅ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ʟɪɴᴋ ɪꜱ ᴘᴜʙʟɪᴄ ᴀɴᴅ ᴄᴏʀʀᴇᴄᴛ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const uniqueMedia = [];
        const seenUrls = new Set();
        for (const media of downloadData.data) {
            if (media.url && !seenUrls.has(media.url)) {
                seenUrls.add(media.url);
                uniqueMedia.push(media);
            }
        }

        // Send info about found media
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ✅ ꜰᴏᴜɴᴅ ${uniqueMedia.length} ᴍᴇᴅɪᴀ ✅
╚════════════════════╝

📤 ꜱᴇɴᴅɪɴɢ ${uniqueMedia.length} ꜰɪʟᴇ(ꜱ), ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        let videoCount = 0;
        let imageCount = 0;

        for (let i = 0; i < uniqueMedia.length; i++) {
            const media = uniqueMedia[i];
            
            const isVideo = 
                /\.(mp4|mov|avi|mkv|webm)/i.test(media.url) || 
                media.type === 'video' || 
                q.includes('/reel/') || 
                q.includes('/tv/');

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: media.url },
                    caption: `╔════════════════════╗
║   📸 ɪɴꜱᴛᴀɢʀᴀᴍ ᴠɪᴅᴇᴏ 📸
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎬 ꜰɪʟᴇ: ᴠɪᴅᴇᴏ ${i + 1}/${uniqueMedia.length}
│ 📊 ᴛʏᴘᴇ: ᴠɪᴅᴇᴏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    mimetype: "video/mp4",
                    fileName: `bin_adnan_ig_${Date.now()}_${i}.mp4`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                videoCount++;
            } else {
                await conn.sendMessage(from, {
                    image: { url: media.url },
                    caption: `╔════════════════════╗
║   📸 ɪɴꜱᴛᴀɢʀᴀᴍ ɪᴍᴀɢᴇ 📸
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🖼️ ꜰɪʟᴇ: ɪᴍᴀɢᴇ ${i + 1}/${uniqueMedia.length}
│ 📊 ᴛʏᴘᴇ: ᴘʜᴏᴛᴏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                imageCount++;
            }

            if (uniqueMedia.length > 1) await new Promise(r => setTimeout(r, 1500));
        }

        // Send completion message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ✅ ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴜᴍᴍᴀʀʏ﹒✦ ───┐
│ 🎬 ᴠɪᴅᴇᴏꜱ: ${videoCount}
│ 🖼️ ɪᴍᴀɢᴇꜱ: ${imageCount}
│ 📊 ᴛᴏᴛᴀʟ: ${uniqueMedia.length}
└────────────────────┘

📸 ᴛʜᴀɴᴋ ʏᴏᴜ ꜰᴏʀ ᴜꜱɪɴɢ ʙɪɴ-ᴀᴅɴᴀɴ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error("Instagram Download Error:", e);
        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ᴅᴏᴡɴʟᴏᴀᴅ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${e.message}
└────────────────────┘

💡 ᴘʟᴇᴀꜱᴇ ᴄʜᴇᴄᴋ ᴛʜᴇ ʟɪɴᴋ ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});