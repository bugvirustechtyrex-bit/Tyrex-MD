const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const {
    getAnti,
    setAnti,
    initializeAntiDeleteSettings
} = require('../data/antidel');

// ═══════════════════════════════════════════════════════════════
//                 🔄 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 - ANTI-DELETE SYSTEM 🔄
// ═══════════════════════════════════════════════════════════════

// Stylish fake contact
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "TYREX"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// Initialize AntiDelete settings on startup
initializeAntiDeleteSettings();

// ═══════════════════════════════════════════════════════════════
//                    🛡️ ANTI-DELETE COMMAND
// ═══════════════════════════════════════════════════════════════
cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad", "delprotect"],
    desc: "Configure AntiDelete protection system",
    category: "security",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe, sender }) => {

    // 🔐 Owner-only access
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "❌ This command is only for the bot owner!",
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {

            // 🔴 Turn OFF AntiDelete everywhere
            case "off":
                await setAnti("gc", false);
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🔴 ANTI-DELETE     ║
╠════════════════════════╣
║  Status: DISABLED ❌   ║
║                        ║
║  • Group Chats: OFF    ║
║  • Direct Msgs: OFF    ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Disable AntiDelete for Group Chats
            case "off gc":
                await setAnti("gc", false);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🔴 ANTI-DELETE     ║
╠════════════════════════╣
║  Group Chats: OFF ❌   ║
║                        ║
║  Deleted messages in   ║
║  groups will NOT be    ║
║  recovered.            ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Disable AntiDelete for DMs
            case "off dm":
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🔴 ANTI-DELETE     ║
╠════════════════════════╣
║  Direct Messages: OFF ❌║
║                        ║
║  Deleted messages in   ║
║  private chats will    ║
║  NOT be recovered.     ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔁 Toggle Group Chat AntiDelete
            case "toggle gc": {
                const gcStatus = await getAnti("gc");
                await setAnti("gc", !gcStatus);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🔄 ANTI-DELETE     ║
╠════════════════════════╣
║  Group Chats: ${!gcStatus ? "ON ✅" : "OFF ❌"}
║                        ║
║  Status changed        ║
║  successfully!         ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 🔁 Toggle DM AntiDelete
            case "toggle dm": {
                const dmStatus = await getAnti("dm");
                await setAnti("dm", !dmStatus);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🔄 ANTI-DELETE     ║
╠════════════════════════╣
║  Direct Messages: ${!dmStatus ? "ON ✅" : "OFF ❌"}
║                        ║
║  Status changed        ║
║  successfully!         ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // ✅ Enable AntiDelete everywhere
            case "on":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     🟢 ANTI-DELETE     ║
╠════════════════════════╣
║  Status: ENABLED ✅    ║
║                        ║
║  • Group Chats: ON     ║
║  • Direct Msgs: ON     ║
║                        ║
║  All deleted messages  ║
║  will be recovered!    ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 📊 Show current status
            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");

                return await conn.sendMessage(from, { 
                    text: `
╔════════════════════════╗
║     📊 ANTI-DELETE     ║
╠════════════════════════╣
║  ●─────────────────●   ║
║                        ║
║  📨 DIRECT MESSAGES    ║
║  ${currentDmStatus ? "🟢 ACTIVE ✅" : "🔴 INACTIVE ❌"}
║                        ║
║  👥 GROUP CHATS        ║
║  ${currentGcStatus ? "🟢 ACTIVE ✅" : "🔴 INACTIVE ❌"}
║                        ║
║  ●─────────────────●   ║
╠════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 📖 Help Menu
            default:
                return await conn.sendMessage(from, { 
                    text: `
╔══════════════════════════════╗
║     📖 ANTI-DELETE HELP      ║
╠══════════════════════════════╣
║  ●────────────────────────●  ║
║                             ║
║  🛡️ COMMANDS:               ║
║                             ║
║  📌 .antidelete on          ║
║     → Enable everywhere     ║
║                             ║
║  📌 .antidelete off         ║
║     → Disable everywhere    ║
║                             ║
║  📌 .antidelete off gc      ║
║     → Disable in groups     ║
║                             ║
║  📌 .antidelete off dm      ║
║     → Disable in DMs        ║
║                             ║
║  📌 .antidelete toggle gc   ║
║     → Toggle groups         ║
║                             ║
║  📌 .antidelete toggle dm   ║
║     → Toggle DMs            ║
║                             ║
║  📌 .antidelete status      ║
║     → View current status   ║
║                             ║
║  ●────────────────────────●  ║
╠══════════════════════════════╣
║  ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚══════════════════════════════╝`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
        }

    } catch (error) {
        console.error("AntiDelete Command Error:", error);
        return reply(`❌ Error: ${error.message}`);
    }
});