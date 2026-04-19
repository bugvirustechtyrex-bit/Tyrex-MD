const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");
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
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📸 INSTAGRAM DOWNLOADER
┣▣
┣▣ 📋 HOW TO USE
┣▣ 📌 *.ig https://www.instagram.com/p/xxxx*
┣▣ 📌 *.insta https://www.instagram.com/reel/xxxx*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        const downloadData = await igdl(q);

        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ NO MEDIA FOUND
┣▣
┣▣ 📋 REASON
┣▣ 📋 Make sure the link is public
┣▣    and correct.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
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

        let videoCount = 0;
        let imageCount = 0;

        for (let i = 0; i < uniqueMedia.length; i++) {
            const media = uniqueMedia[i];
            const isVideo = /\.(mp4|mov|avi|mkv|webm)/i.test(media.url) || media.type === 'video' || q.includes('/reel/') || q.includes('/tv/');

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: media.url },
                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📸 INSTAGRAM VIDEO
┣▣
┣▣ 📋 DETAILS
┣▣ 🎬 FILE: Video ${i + 1}/${uniqueMedia.length}
┣▣ 📌 TYPE: Video
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                    mimetype: "video/mp4",
                    fileName: `${config.BOT_NAME}_ig_${Date.now()}_${i}.mp4`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                videoCount++;
            } else {
                await conn.sendMessage(from, {
                    image: { url: media.url },
                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📸 INSTAGRAM IMAGE
┣▣
┣▣ 📋 DETAILS
┣▣ 🖼️ FILE: Image ${i + 1}/${uniqueMedia.length}
┣▣ 📌 TYPE: Photo
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                imageCount++;
            }

            if (uniqueMedia.length > 1) await new Promise(r => setTimeout(r, 1500));
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("Instagram Download Error:", e);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ DOWNLOAD ERROR
┣▣
┣▣ 📋 ERROR INFO
┣▣ 📋 ${e.message}
┣▣
┣▣ 💡 Please check the link and try again
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});