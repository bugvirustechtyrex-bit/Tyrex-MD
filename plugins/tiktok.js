const { cmd } = require("../command");
const axios = require("axios");
const config = require("../config");

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
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎵 TIKTOK DOWNLOADER
┣▣
┣▣ 📋 HOW TO USE
┣▣ 1️⃣ *.tiktok https://www.tiktok.com/...
┣▣ 2️⃣ *.tt hd https://www.tiktok.com/...
┣▣ 3️⃣ *.tt audio https://www.tiktok.com/...
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        // Extract quality option if provided (hd, nowm, wm, audio)
        let quality = "no_watermark";
        let url = q;

        const parts = q.split(' ');
        if (parts.length > 1) {
            const possibleQuality = parts[0].toLowerCase();
            if (possibleQuality === 'hd' || possibleQuality === 'nowm' || possibleQuality === 'wm' || possibleQuality === 'audio') {
                quality = possibleQuality === 'nowm' ? 'no_watermark' : possibleQuality;
                url = parts.slice(1).join(' ');
            }
        }

        const tiktokUrl = url.trim();

        // Validate URL
        if (!tiktokUrl.includes('tiktok.com')) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ INVALID URL
┣▣
┣▣ 📋 Please provide a valid TikTok link
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // API request
        const apiUrl = `https://api.bk9.dev/download/tiktok3?url=${encodeURIComponent(tiktokUrl)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.status) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ FETCH FAILED
┣▣
┣▣ 📋 ${response.data?.message || 'Invalid URL or video not found'}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
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
                qualityDisplay = "HD (No Watermark)";
                break;
            case 'no_watermark':
            case 'nowm':
                selectedFormat = tiktokData.formats.find(f => f.quality === 'no_watermark');
                qualityDisplay = "No Watermark";
                break;
            case 'wm':
            case 'watermark':
                selectedFormat = tiktokData.formats.find(f => f.quality === 'watermark');
                qualityDisplay = "With Watermark";
                break;
            case 'audio':
                selectedFormat = tiktokData.formats.find(f => f.type === 'audio');
                qualityDisplay = "Audio Only";
                break;
            default:
                selectedFormat = tiktokData.formats[1] || tiktokData.formats[0];
                qualityDisplay = "No Watermark";
        }

        if (!selectedFormat) {
            selectedFormat = tiktokData.formats[0];
            qualityDisplay = "Default";
        }

        // Send video info with thumbnail
        const caption = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎵 TIKTOK VIDEO
┣▣
┣▣ 📋 VIDEO INFO
┣▣ 📌 TITLE: ${tiktokData.title?.substring(0, 50) || 'N/A'}${tiktokData.title?.length > 50 ? '...' : ''}
┣▣ 👤 AUTHOR: ${tiktokData.author || 'N/A'}
┣▣ ⏱️ DURATION: ${tiktokData.duration || 'N/A'}
┣▣ 🎚️ QUALITY: ${qualityDisplay}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

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
                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ AUDIO DOWNLOADED
┣▣
┣▣ 🎵 Audio from TikTok video
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                video: { url: selectedFormat.url },
                caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIDEO DOWNLOADED
┣▣
┣▣ 📋 QUALITY: ${qualityDisplay}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                mimetype: "video/mp4",
                fileName: `tiktok_${Date.now()}.mp4`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("TikTok Download Error:", e);
        
        let errorMessage = e.message;
        if (e.response?.status === 404) {
            errorMessage = "Video not found. Make sure the URL is correct and the video is public.";
        } else if (e.code === 'ECONNREFUSED') {
            errorMessage = "Connection to API server failed.";
        }
        
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ DOWNLOAD ERROR
┣▣
┣▣ 📋 ERROR INFO
┣▣ 📋 ${errorMessage}
┣▣
┣▣ 📌 Example: *.tiktok https://www.tiktok.com/@user/video/123456789
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});