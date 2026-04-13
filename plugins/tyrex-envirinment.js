//---------------------------------------------------------------------------
// ✨ SIN-ADNAN ✨
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

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

//=============================================
// 🛡️ ADMIN EVENTS
//=============================================
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 This command is only for the bot owner
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ ADMIN EVENTS ✦ ───┐
│ 📌 STATUS: ENABLED ✅
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ ADMIN EVENTS ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.ADMIN_EVENTS === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ⚙️ ADMIN EVENTS ⚙️
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.admin-events on*
│ 2️⃣ *.admin-events off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 👋 WELCOME
//=============================================
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only command
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ WELCOME ✦ ───┐
│ 📌 STATUS: ENABLED ✅
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.WELCOME = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ WELCOME ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.WELCOME === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 👋 WELCOME SETTINGS 👋
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.welcome on*
│ 2️⃣ *.welcome off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 🔧 SETPREFIX
//=============================================
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only command
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const newPrefix = args[0];
    if (!newPrefix) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🔧 CHANGE PREFIX 🔧
╚═══════════════════════════╝

┌─── ✦ CURRENT PREFIX ✦ ───┐
│ 📌 ${config.PREFIX}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ *.setprefix [new_prefix]*
│
│ 📌 Example: *.setprefix !*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    config.PREFIX = newPrefix;
    await conn.sendMessage(from, {
        text: `╔═══════════════════════════╗
║ ✅ PREFIX CHANGED ✅
╚═══════════════════════════╝

┌─── ✦ NEW PREFIX ✦ ───┐
│ 📌 ${newPrefix}
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
});

//=============================================
// 🫟 MODE
//=============================================
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only command
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🫟 BOT MODE 🫟
╚═══════════════════════════╝

┌─── ✦ CURRENT MODE ✦ ───┐
│ 📌 ${config.MODE}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.mode private*
│ 2️⃣ *.mode public*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const modeArg = args[0].toLowerCase();
    if (modeArg === "private") {
        config.MODE = "private";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ MODE CHANGED ✅
╚═══════════════════════════╝

┌─── ✦ NEW MODE ✦ ───┐
│ 📌 PRIVATE
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (modeArg === "public") {
        config.MODE = "public";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ MODE CHANGED ✅
╚═══════════════════════════╝

┌─── ✦ NEW MODE ✦ ───┐
│ 📌 PUBLIC
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ❌ INVALID MODE ❌
╚═══════════════════════════╝

┌─── ✦ USE ✦ ───┐
│ 📌 *.mode private*
│ 📌 *.mode public*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// ✍️ AUTO-TYPING
//=============================================
cmd({
    pattern: "auto-typing",
    alias: ["autotyping"],
    desc: "Enable or disable auto-typing feature",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_TYPING = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-TYPING ✦ ───┐
│ 📌 STATUS: ENABLED ✅
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_TYPING = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-TYPING ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_TYPING === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✍️ AUTO-TYPING ✍️
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.auto-typing on*
│ 2️⃣ *.auto-typing off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 👥 MENTION-REPLY
//=============================================
cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee"],
    desc: "Enable or disable mention reply feature",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.MENTION_REPLY = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ MENTION REPLY ✦ ───┐
│ 📌 STATUS: ENABLED ✅
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.MENTION_REPLY = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ MENTION REPLY ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.MENTION_REPLY === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 👥 MENTION REPLY 👥
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.mee on*
│ 2️⃣ *.mee off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 🌐 ALWAYS-ONLINE
//=============================================
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ ALWAYS ONLINE ✦ ───┐
│ 📌 STATUS: ENABLED ✅
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ ALWAYS ONLINE ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.ALWAYS_ONLINE === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🌐 ALWAYS ONLINE 🌐
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.always-online on*
│ 2️⃣ *.always-online off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 🎙️ AUTO-RECORDING
//=============================================
cmd({
    pattern: "auto-recording",
    alias: ["autorecording"],
    desc: "Enable or disable auto-recording feature",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_RECORDING = "true";
        await conn.sendPresenceUpdate("recording", from);
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-RECORDING ✦ ───┐
│ 📌 STATUS: ENABLED ✅
│ 🎙️ Bot is recording...
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_RECORDING = "false";
        await conn.sendPresenceUpdate("available", from);
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-RECORDING ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_RECORDING === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🎙️ AUTO-RECORDING 🎙️
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.auto-recording on*
│ 2️⃣ *.auto-recording off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 👀 AUTO-SEEN (STATUS)
//=============================================
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-SEEN ✦ ───┐
│ 📌 STATUS: ENABLED ✅
│ 👀 Bot will auto-view statuses
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-SEEN ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_STATUS_SEEN === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 👀 AUTO-SEEN 👀
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.auto-seen on*
│ 2️⃣ *.auto-seen off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// ❤️ STATUS-REACT
//=============================================
cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ STATUS REACT ✦ ───┐
│ 📌 STATUS: ENABLED ✅
│ ❤️ Bot will auto-like statuses
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ STATUS REACT ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_STATUS_REACT === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ❤️ STATUS REACT ❤️
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.status-react on*
│ 2️⃣ *.status-react off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
// 📖 READ-MESSAGE
//=============================================
cmd({
    pattern: "read-message",
    alias: ["readmsg", "autoread"],
    desc: "Enable or disable auto-read messages",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 🚫 UNAUTHORIZED 🚫
╚═══════════════════════════╝

┌─── ✦ REASON ✦ ───┐
│ 📋 Owner only command
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_READ = "true";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-READ ✦ ───┐
│ 📌 STATUS: ENABLED ✅
│ 📖 Bot will auto-read all messages
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_READ = "false";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ ✅ SETTING UPDATED ✅
╚═══════════════════════════╝

┌─── ✦ AUTO-READ ✦ ───┐
│ 📌 STATUS: DISABLED ❌
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_READ === "true" ? "ENABLED ✅" : "DISABLED ❌";
        return await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║ 📖 AUTO-READ MESSAGES 📖
╚═══════════════════════════╝

┌─── ✦ CURRENT STATUS ✦ ───┐
│ 📌 ${currentStatus}
└─────────────────────────┘

┌─── ✦ HOW TO USE ✦ ───┐
│ 1️⃣ *.read-message on*
│ 2️⃣ *.read-message off*
└─────────────────────────┘

⚡ ${config.BOT_NAME} ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});