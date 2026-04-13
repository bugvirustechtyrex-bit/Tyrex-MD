const { cmd } = require("../command");
const axios = require("axios");

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
    pattern: "tiktok",
    alias: ["tt", "tiktokdl", "ttdl", "tiktokvideo"],
    desc: "Download TikTok videos without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename,
},
async (conn, mek, m, { from, q, sender, args }) => {
    try {
        if (processedMessages.has(m.key.id)) return;
        processedMessages.add(m.key.id);
        setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

        if (!q) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   🎵 ᴛɪᴋᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎵
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴛɪᴋᴛᴏᴋ https://www.tiktok.com/...*
│ 2️⃣ *.ᴛᴛ ʜᴅ https://www.tiktok.com/...*
│ 3️⃣ *.ᴛᴛ ᴀᴜᴅɪᴏ https://www.tiktok.com/...*
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Extract quality option if provided (hd, nowm, wm, audio)
        let quality = "no_watermark"; // default
        let url = q;
        
        // Check if user specified quality (format: .tiktok hd <url> or .tiktok audio <url>)
        const parts = q.split(' ');
        if (parts.length > 1) {
            const possibleQuality = parts[0].toLowerCase();
            if (possibleQuality === 'hd' || possibleQuality === 'nowm' || 
                possibleQuality === 'wm' || possibleQuality === 'audio') {
                quality = possibleQuality === 'nowm' ? 'no_watermark' : possibleQuality;
                url = parts.slice(1).join(' ');
            }
        }

        // Clean URL - remove any extra spaces
        const tiktokUrl = url.trim();
        
        // Validate URL
        if (!tiktokUrl.includes('tiktok.com')) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴜʀʟ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛɪᴋᴛᴏᴋ ʟɪɴᴋ
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

⏳ ꜰᴇᴛᴄʜɪɴɢ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ᴅᴀᴛᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // API request
        const apiUrl = `https://api.bk9.dev/download/tiktok3?url=${encodeURIComponent(tiktokUrl)}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.status) {
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ꜰᴇᴛᴄʜ ꜰᴀɪʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ${response.data?.message || 'Invalid URL or video not found'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const tiktokData = response.data.BK9;
        
        // Find the requested quality
        let selectedFormat = null;
        let qualityDisplay = "";
        
        switch(quality) {
            case 'hd':
                selectedFormat = tiktokData.formats.find(f => f.quality === 'hd_no_watermark');
                qualityDisplay = "ʜᴅ (ɴᴏ ᴡᴀᴛᴇʀᴍᴀʀᴋ)";
                break;
            case 'no_watermark':
            case 'nowm':
                selectedFormat = tiktokData.formats.find(f => f.quality === 'no_watermark');
                qualityDisplay = "ɴᴏ ᴡᴀᴛᴇʀᴍᴀʀᴋ";
                break;
            case 'wm':
            case 'watermark':
                selectedFormat = tiktokData.formats.find(f => f.quality === 'watermark');
                qualityDisplay = "ᴡɪᴛʜ ᴡᴀᴛᴇʀᴍᴀʀᴋ";
                break;
            case 'audio':
                selectedFormat = tiktokData.formats.find(f => f.type === 'audio');
                qualityDisplay = "ᴀᴜᴅɪᴏ ᴏɴʟʏ";
                break;
            default:
                selectedFormat = tiktokData.formats[1] || tiktokData.formats[0]; // Default to no watermark
                qualityDisplay = "ɴᴏ ᴡᴀᴛᴇʀᴍᴀʀᴋ";
        }

        if (!selectedFormat) {
            // Fallback to first available format
            selectedFormat = tiktokData.formats[0];
            qualityDisplay = "ᴅᴇꜰᴀᴜʟᴛ";
        }

        // Send video info with thumbnail
        const caption = `╔════════════════════╗
║   🎵 ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ 🎵
╚════════════════════╝

┌─── ✦﹒ᴠɪᴅᴇᴏ ɪɴꜰᴏ﹒✦ ───┐
│ 📌 ᴛɪᴛʟᴇ: ${tiktokData.title || 'ɴ/ᴀ'.substring(0, 50)}${tiktokData.title?.length > 50 ? '...' : ''}
│ 👤 ᴀᴜᴛʜᴏʀ: ${tiktokData.author || 'ɴ/ᴀ'}
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${tiktokData.duration || 'ɴ/ᴀ'}
│ 🎚️ ǫᴜᴀʟɪᴛʏ: ${qualityDisplay}
└────────────────────┘

⬇️ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

        // Send thumbnail
        if (tiktokData.thumbnail) {
            await conn.sendMessage(from, {
                image: { url: tiktokData.thumbnail },
                caption: caption,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { 
                text: caption,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Send media based on type
        if (selectedFormat.type === 'audio') {
            await conn.sendMessage(from, {
                audio: { url: selectedFormat.url },
                mimetype: "audio/mpeg",
                fileName: `tiktok_audio_${Date.now()}.mp3`,
                caption: `╔════════════════════╗
║   ✅ ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎵 ᴀᴜᴅɪᴏ ꜰʀᴏᴍ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                video: { url: selectedFormat.url },
                caption: `╔════════════════════╗
║   ✅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🎚️ ǫᴜᴀʟɪᴛʏ: ${qualityDisplay}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                mimetype: "video/mp4",
                fileName: `tiktok_${Date.now()}.mp4`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error("TikTok Download Error:", e);
        
        let errorMessage = e.message;
        if (e.response?.status === 404) {
            errorMessage = "Video not found. Make sure the URL is correct and the video is public.";
        } else if (e.code === 'ECONNREFUSED') {
            errorMessage = "Connection to API server failed.";
        }

        await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 📋 ${errorMessage}
└────────────────────┘

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴛɪᴋᴛᴏᴋ https://www.tiktok.com/@user/video/123456789*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});