const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const config = require('../config');

// ContextInfo function
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

// ============================================
// SONG COMMAND - ${config.BOT_NAME} VERSION
// ============================================
cmd({
    pattern: "song",
    alias: ["mp3", "play", "audio", "music"],
    react: "🎵",
    desc: "Download song from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, prefix, q, sender, reply }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎵 SONG DOWNLOADER
┣▣
┣▣ 📌 ${prefix}song shape of you
┣▣ 📌 ${prefix}song https://youtube.com/...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let videoData = null;

        if (q.includes('youtube.com') || q.includes('youtu.be')) {
            const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
            if (!videoId) {
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 Invalid YouTube link!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                    contextInfo: getContextInfo(sender)
                }, { quoted: mek });
            }
            const search = await yts({ videoId: videoId });
            if (search) videoData = search;
        } else {
            const search = await yts(q);
            if (!search || !search.all || search.all.length === 0) {
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ NOT FOUND
┣▣ 📋 No results found for "${q}"
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                    contextInfo: getContextInfo(sender)
                }, { quoted: mek });
            }
            videoData = search.all[0];
        }

        if (!videoData) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 Could not get video information!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const videoUrl = videoData.url;
        const title = videoData.title || 'Unknown Title';
        const thumbnail = videoData.thumbnail || videoData.image;
        const duration = videoData.timestamp || videoData.duration || 'N/A';
        const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
        const author = videoData.author?.name || 'Unknown Artist';

        // Send the cover art/thumbnail with song info
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎵 SONG INFO
┣▣
┣▣ 🎤 TITLE: ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
┣▣ 🎸 ARTIST: ${author}
┣▣ ⏱️ DURATION: ${duration}
┣▣ 👁️ VIEWS: ${views}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

        try {
            const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
            const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
            const fallbackData = fallbackResponse.data;

            if (fallbackData?.status && fallbackData.audio) {
                await conn.sendMessage(from, {
                    audio: { url: fallbackData.audio },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                    ptt: false,
                    contextInfo: getContextInfo(sender)
                }, { quoted: mek });
            } else {
                const apiUrl = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
                const response = await axios.get(apiUrl, { timeout: 30000 });
                const data = response.data;
                let audioUrl = data?.result?.audio || data?.result?.url;

                if (audioUrl) {
                    await conn.sendMessage(from, {
                        audio: { url: audioUrl },
                        mimetype: "audio/mpeg",
                        fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                        ptt: false,
                        contextInfo: getContextInfo(sender)
                    }, { quoted: mek });
                } else {
                    throw new Error('No audio URL found');
                }
            }
        } catch (error) {
            console.error('Download error:', error.message);
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ DOWNLOAD FAILED
┣▣ 📋 ${error.message.substring(0, 50)}${error.message.length > 50 ? '...' : ''}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ COMMAND ERROR
┣▣ 📋 ${e.message.substring(0, 50)}${e.message.length > 50 ? '...' : ''}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});