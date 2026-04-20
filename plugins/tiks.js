const fetch = require("node-fetch");
const { cmd } = require("../command");
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

cmd({
    pattern: "tiktoksearch",
    alias: ["tiktoks", "tiks", "ttsearch"],
    desc: "Search for TikTok videos using a query",
    react: '🔍',
    category: 'search',
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔍 TIKTOK SEARCH
┣▣
┣▣ 📋 HOW TO USE
┣▣ 📌 *.tiktoksearch [query]
┣▣ 📌 *.tiks dance videos
┣▣
┣▣ 📌 Example: *.tiktoksearch funny cats
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        const query = args.join(" ");

        const response = await fetch(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ NO RESULTS
┣▣
┣▣ 📋 SEARCH QUERY: "${query}"
┣▣
┣▣ 😕 No TikTok videos found for your search.
┣▣ 💡 Try different keywords.
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Get up to 7 random results
        const results = data.data.slice(0, 7).sort(() => Math.random() - 0.5);
        let sentCount = 0;

        for (const video of results) {
            try {
                const videoMessage = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎵 TIKTOK VIDEO
┣▣
┣▣ 📋 VIDEO INFO
┣▣ 📌 TITLE: ${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}
┣▣ 👤 AUTHOR: ${video.author || 'Unknown'}
┣▣ ⏱️ DURATION: ${video.duration || "Unknown"}
┣▣ 🔗 LINK: ${video.link}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

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
                        caption: videoMessage + "\n\n⚠️ *Video has watermark*",
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                    sentCount++;
                } else {
                    // Just send info if no video
                    await conn.sendMessage(from, {
                        text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ℹ️ VIDEO INFO
┣▣
┣▣ 📋 TITLE: ${video.title}
┣▣
┣▣ 🔗 LINK: ${video.link}
┣▣
┣▣ ⚠️ Video could not be downloaded
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                }
            } catch (videoError) {
                console.error("Error sending video:", videoError);
            }
        }

        // Send completion message
        if (sentCount > 0) {
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ SEARCH COMPLETE
┣▣
┣▣ 📊 SUMMARY
┣▣ 📤 Sent: ${sentCount} video(s)
┣▣ 🔍 Search: ${query}
┣▣
┣▣ 🎵 Thanks for using ${config.BOT_NAME}!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("Error in TikTokSearch command:", error);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ SEARCH ERROR
┣▣
┣▣ 📋 ERROR INFO
┣▣ 📋 ${error.message}
┣▣
┣▣ 💡 Please try again later
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});