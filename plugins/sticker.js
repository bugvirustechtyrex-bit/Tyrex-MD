const { cmd } = require('../command');
const config = require('../config');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { videoToWebp } = require('../lib/video-utils');

cmd({
    pattern: "sticker",
    alias: ["s", "stick"],
    desc: "Convert image/video/GIF to sticker",
    category: "sticker",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted, sender }) => {
    try {
        if (!mek.quoted) {
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 Reply to an image, video or GIF
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        }

        const mime = mek.quoted.mtype;
        
        // Download media
        const media = await mek.quoted.download();
        let stickerBuffer;

        // For video/GIF
        if (mime === 'videoMessage') {
            stickerBuffer = await videoToWebp(media);
        } 
        // For image
        else if (mime === 'imageMessage') {
            const sticker = new Sticker(media, {
                pack: config.STICKER_NAME || config.BOT_NAME,
                author: config.OWNER_NAME || 'Tyrex Tech',
                type: StickerTypes.FULL,
                quality: 75,
            });
            stickerBuffer = await sticker.toBuffer();
        }
        else {
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 Please reply to an image, video or GIF
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        }

        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});