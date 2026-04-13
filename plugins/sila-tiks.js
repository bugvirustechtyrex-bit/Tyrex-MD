const fetch = require("node-fetch");
const { cmd } = require("../command");

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
    pattern: "tiktoksearch",
    alias: ["tiktoks", "tiks", "ttsearch"],
    desc: "Search for TikTok videos using a query",
    react: '🔍',
    category: 'search',
    filename: __filename
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        if (!args[0]) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   🔍 ᴛɪᴋᴛᴏᴋ ꜱᴇᴀʀᴄʜ 🔍
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 📝 *.ᴛɪᴋᴛᴏᴋꜱᴇᴀʀᴄʜ [ǫᴜᴇʀʏ]*
│ 📝 *.ᴛɪᴋꜱ ᴄᴏᴍᴇᴅʏ ᴠɪᴅᴇᴏꜱ*
└────────────────────┘

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴛɪᴋᴛᴏᴋꜱᴇᴀʀᴄʜ ᴅᴀɴᴄᴇ*

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const query = args.join(" ");
        
        // Send searching message
        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🔍 ꜱᴇᴀʀᴄʜɪɴɢ... 🔍
╚════════════════════╝

⏳ ʟᴏᴏᴋɪɴɢ ꜰᴏʀ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏꜱ: *${query}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        const response = await fetch(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ɴᴏ ʀᴇꜱᴜʟᴛꜱ ❌
╚════════════════════╝

┌─── ✦﹒ǫᴜᴇʀʏ﹒✦ ───┐
│ 📝 ${query}
└────────────────────┘

😕 ɴᴏ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏꜱ ꜰᴏᴜɴᴅ ꜰᴏʀ ʏᴏᴜʀ ꜱᴇᴀʀᴄʜ

💡 ᴛʀʏ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴋᴇʏᴡᴏʀᴅꜱ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Send result count message
        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜰᴏᴜɴᴅ ${Math.min(data.data.length, 7)} ʀᴇꜱᴜʟᴛꜱ ✅
╚════════════════════╝

📤 ꜱᴇɴᴅɪɴɢ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏꜱ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Get up to 7 random results
        const results = data.data.slice(0, 7).sort(() => Math.random() - 0.5);
        let sentCount = 0;

        for (const video of results) {
            try {
                const videoMessage = `╔════════════════════╗
║   🎵 ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ 🎵
╚════════════════════╝

┌─── ✦﹒ᴠɪᴅᴇᴏ ɪɴꜰᴏ﹒✦ ───┐
│ 📌 ᴛɪᴛʟᴇ: ${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}
│ 👤 ᴀᴜᴛʜᴏʀ: ${video.author || 'ᴜɴᴋɴᴏᴡɴ'}
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${video.duration || "ᴜɴᴋɴᴏᴡɴ"}
│ 🔗 ʟɪɴᴋ: ${video.link}
└────────────────────┘

⬇️ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴠɪᴅᴇᴏ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

                if (video.nowm) {
                    await conn.sendMessage(from, {
                        video: { url: video.nowm },
                        caption: videoMessage,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                    sentCount++;
                } else if (video.watermark) {
                    await conn.sendMessage(from, {
                        video: { url: video.watermark },
                        caption: videoMessage + "\n\n⚠️ *ᴠɪᴅᴇᴏ ᴡɪᴛʜ ᴡᴀᴛᴇʀᴍᴀʀᴋ*",
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                    sentCount++;
                } else {
                    // Just send info if no video
                    await conn.sendMessage(from, { 
                        text: `╔════════════════════╗
║   ℹ️ ᴠɪᴅᴇᴏ ɪɴꜰᴏ ℹ️
╚════════════════════╝

┌─── ✦﹒ᴛɪᴛʟᴇ﹒✦ ───┐
│ 📝 ${video.title}
└────────────────────┘

┌─── ✦﹒ʟɪɴᴋ﹒✦ ───┐
│ 🔗 ${video.link}
└────────────────────┘

⚠️ ᴠɪᴅᴇᴏ ᴄᴏᴜʟᴅ ɴᴏᴛ ʙᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                }
            } catch (videoError) {
                console.error("Error sending video:", videoError);
                // Continue with next video
            }
        }

        // Send completion message
        if (sentCount > 0) {
            await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ✅ ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴜᴍᴍᴀʀʏ﹒✦ ───┐
│ 📤 ꜱᴇɴᴛ: ${sentCount} ᴠɪᴅᴇᴏ(ꜱ)
│ 🔍 ꜱᴇᴀʀᴄʜ: ${query}
└────────────────────┘

🎵 ᴛʜᴀɴᴋ ʏᴏᴜ ꜰᴏʀ ᴜꜱɪɴɢ ʙɪɴ-ᴀᴅɴᴀɴ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("Error in TikTokSearch command:", error);
        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ꜱᴇᴀʀᴄʜ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

💡 ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});