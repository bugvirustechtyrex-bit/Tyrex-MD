const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

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
            title: `✨ ${config.BOT_NAME}`,
            body: `🤖 Premium Bot`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/98k75b.jpeg',
            sourceUrl: `https://github.com/binadnan`,
            renderLargerThumbnail: false,
        }
    };
};

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "config",
    alias: ["varlist", "envlist", "settings"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "owner",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, isCreator, sender }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🚫 UNAUTHORIZED
┣▣ 📋 Owner only command
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        let envSettings = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚙️ BOT CONFIG
┣▣
┣▣ 🤖 BOT INFO
┣▣ 🤖 NAME: ${config.BOT_NAME}
┣▣ 🔧 PREFIX: ${config.PREFIX}
┣▣ 👑 OWNER: ${config.OWNER_NAME}
┣▣ 📞 NUMBER: ${config.OWNER_NUMBER}
┣▣ 🎯 MODE: ${config.MODE.toUpperCase()}
┣▣
┣▣ ⚙️ CORE SETTINGS
┣▣ 🌐 PUBLIC MODE: ${isEnabled(config.PUBLIC_MODE) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🌐 ALWAYS ONLINE: ${isEnabled(config.ALWAYS_ONLINE) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 📖 READ MESSAGE: ${isEnabled(config.READ_MESSAGE) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 📝 READ CMD: ${isEnabled(config.READ_CMD) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣
┣▣ 🤖 AUTO FEATURES
┣▣ 🤖 AUTO REPLY: ${isEnabled(config.AUTO_REPLY) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 😊 AUTO REACT: ${isEnabled(config.AUTO_REACT) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🎨 CUSTOM REACT: ${isEnabled(config.CUSTOM_REACT) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 😍 REACT EMOJIS: ${config.CUSTOM_REACT_EMOJIS}
┣▣ 🖼️ AUTO STICKER: ${isEnabled(config.AUTO_STICKER) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣
┣▣ 📢 STATUS SETTINGS
┣▣ 👁️ STATUS SEEN: ${isEnabled(config.AUTO_STATUS_SEEN) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 💬 STATUS REPLY: ${isEnabled(config.AUTO_STATUS_REPLY) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ ❤️ STATUS REACT: ${isEnabled(config.AUTO_STATUS_REACT) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 📝 STATUS MSG: ${config.AUTO_STATUS_MSG}
┣▣
┣▣ 🛡️ SECURITY
┣▣ 🔗 ANTI-LINK: ${isEnabled(config.ANTI_LINK) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🚫 ANTI-BAD: ${isEnabled(config.ANTI_BAD) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 👁️ ANTI-VV: ${isEnabled(config.ANTI_VV) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🗑️ DELETE LINKS: ${isEnabled(config.DELETE_LINKS) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣
┣▣ 🎨 MEDIA
┣▣ 🖼️ ALIVE IMG: ${config.ALIVE_IMG.substring(0, 50)}${config.ALIVE_IMG.length > 50 ? '...' : ''}
┣▣ 📋 MENU IMG: ${config.MENU_IMAGE_URL.substring(0, 50)}${config.MENU_IMAGE_URL.length > 50 ? '...' : ''}
┣▣ 💬 ALIVE MSG: ${config.LIVE_MSG}
┣▣ 🖼️ STICKER PACK: ${config.STICKER_NAME}
┣▣
┣▣ ⏳ MISC
┣▣ ✍️ AUTO TYPING: ${isEnabled(config.AUTO_TYPING) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🎙️ AUTO RECORD: ${isEnabled(config.AUTO_RECORDING) ? "ENABLED ✅" : "DISABLED ❌"}
┣▣ 🗂️ ANTI-DEL PATH: ${config.ANTI_DEL_PATH}
┣▣ 👨‍💻 DEV NUMBER: ${config.DEV}
┣▣
┣▣ 📝 ${config.DESCRIPTION}
┣▣
┣▣ ⚡ POWERED BY ${config.BOT_NAME}
┗▣`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: envSettings,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Env command error:', error);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ COMMAND ERROR
┣▣ 📋 ${error.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});