const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

// Stylish fake contact
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "TYREX"
    },
    "message": {
        "conversation": `${config.BOT_NAME}`
    }
};

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
    };
};

// Initialize AntiDelete settings on startup
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad", "delprotect"],
    desc: "Configure AntiDelete protection system",
    category: "security",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 This command is only for the bot owner!
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {
            case "off":
                await setAnti("gc", false);
                await setAnti("dm", false);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔴 ANTI-DELETE
┣▣ Status: DISABLED ❌
┣▣ • Group Chats: OFF
┣▣ • Direct Msgs: OFF
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            case "off gc":
                await setAnti("gc", false);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔴 ANTI-DELETE
┣▣ Group Chats: OFF ❌
┣▣ Deleted messages in groups
┣▣ will NOT be recovered.
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            case "off dm":
                await setAnti("dm", false);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔴 ANTI-DELETE
┣▣ Direct Messages: OFF ❌
┣▣ Deleted messages in private
┣▣ chats will NOT be recovered.
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            case "toggle gc": {
                const gcStatus = await getAnti("gc");
                await setAnti("gc", !gcStatus);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔄 ANTI-DELETE
┣▣ Group Chats: ${!gcStatus ? "ON ✅" : "OFF ❌"}
┣▣ Status changed successfully!
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            case "toggle dm": {
                const dmStatus = await getAnti("dm");
                await setAnti("dm", !dmStatus);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔄 ANTI-DELETE
┣▣ Direct Messages: ${!dmStatus ? "ON ✅" : "OFF ❌"}
┣▣ Status changed successfully!
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            case "on":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🟢 ANTI-DELETE
┣▣ Status: ENABLED ✅
┣▣ • Group Chats: ON
┣▣ • Direct Msgs: ON
┣▣ All deleted messages will be recovered!
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📊 ANTI-DELETE
┣▣ 📨 DIRECT MESSAGES: ${currentDmStatus ? "🟢 ACTIVE ✅" : "🔴 INACTIVE ❌"}
┣▣ 👥 GROUP CHATS: ${currentGcStatus ? "🟢 ACTIVE ✅" : "🔴 INACTIVE ❌"}
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            default:
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📖 ANTI-DELETE HELP
┣▣
┣▣ 📌 .antidelete on → Enable everywhere
┣▣ 📌 .antidelete off → Disable everywhere
┣▣ 📌 .antidelete off gc → Disable in groups
┣▣ 📌 .antidelete off dm → Disable in DMs
┣▣ 📌 .antidelete toggle gc → Toggle groups
┣▣ 📌 .antidelete toggle dm → Toggle DMs
┣▣ 📌 .antidelete status → View current status
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
        }
    } catch (error) {
        console.error("AntiDelete Command Error:", error);
        return reply(`❌ Error: ${error.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});