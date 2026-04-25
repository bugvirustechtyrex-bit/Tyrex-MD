// ANTILINK COMMAND - Version ya Heroku
// Weka kwenye: commands/antilink.js au plugins/antilink.js

const fs = require('fs');
const path = require('path');

// Dynamic require kutafuta command module
let cmdModule;
try {
    cmdModule = require('../command');
} catch (e) {
    try {
        cmdModule = require('../../command');
    } catch (e2) {
        try {
            cmdModule = require('../../../command');
        } catch (e3) {
            console.log("Command module not found, using global");
            cmdModule = { cmd: global.cmd };
        }
    }
}
const { cmd } = cmdModule;

// BOT NAME
const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";

// Simple antilink without external lib
const ANTILINK_STATUS = {}; // Store status per group

cmd({
    pattern: "antilink",
    alias: ["al"],
    react: "🛡️",
    desc: "Zuia viungo kwenye group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, args, sender, isAdmins }) => {
    
    if (!isGroup) return reply("❌ Command hii inatumika kwenye group pekee!");
    if (!isAdmins) return reply("❌ Admin tu ndio wanaweza kutumia command hii!");
    
    const type = args[0] ? args[0].toLowerCase() : '';
    const action = args[1] ? args[1].toLowerCase() : '';
    
    // Initialize group status if not exists
    if (!ANTILINK_STATUS[from]) {
        ANTILINK_STATUS[from] = { enabled: false, action: 'delete' };
    }
    
    // ON
    if (type === "on") {
        ANTILINK_STATUS[from].enabled = true;
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ ANTILINK IMEWASHWA
┣▣
┣▣ ✅ Viungo vitazuiliwa kwenye group!
┗▣`);
    }
    
    // OFF
    if (type === "off") {
        ANTILINK_STATUS[from].enabled = false;
        await conn.sendMessage(from, { react: { text: "🔓", key: mek.key } });
        return reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔓 ANTILINK IMEZIMWA
┣▣
┣▣ ❌ Viungo vinaruhusiwa sasa!
┗▣`);
    }
    
    // ACTION
    if (type === "action") {
        if (['delete', 'warn', 'kick'].includes(action)) {
            ANTILINK_STATUS[from].action = action;
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ✅ ACTION IMEWEKWA: *${action.toUpperCase()}*
┗▣`);
        } else {
            return reply(`📌 MATUMIZI:
.antilink action delete
.antilink action warn
.antilink action kick`);
        }
    }
    
    // HELP
    return reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ ANTILINK MENU
┣▣
┣▣ 📌 .antilink on - Washa
┣▣ 📌 .antilink off - Zima
┣▣ 📌 .antilink action delete
┣▣ 📌 .antilink action warn
┣▣ 📌 .antilink action kick
┣▣
┣▣ 📊 Status: ${ANTILINK_STATUS[from].enabled ? "✅ ON" : "❌ OFF"}
┣▣ ⚙️ Action: ${ANTILINK_STATUS[from].action}
┗▣`);
});

// Auto detect links (Body handler)
cmd({ on: "body" }, async (conn, mek, m, { from, isGroup, isAdmins, isCreator }) => {
    try {
        if (!isGroup) return;
        if (!ANTILINK_STATUS[from] || !ANTILINK_STATUS[from].enabled) return;
        
        const messageText = m.text || m.caption || '';
        
        // Check for links
        const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|org|net|tz|info|xyz|club|online)\b)/i;
        
        if (linkPattern.test(messageText)) {
            // Ignore admin
            if (isAdmins || isCreator) return;
            
            const action = ANTILINK_STATUS[from].action;
            const senderJid = m.sender || mek.key.remoteJid;
            
            // Delete message
            if (action === 'delete' || action === 'warn' || action === 'kick') {
                try {
                    await conn.sendMessage(from, { delete: mek.key });
                } catch (e) {}
            }
            
            // Warn
            if (action === 'warn') {
                await conn.sendMessage(from, {
                    text: `⚠️ *${botName}* ⚠️\n\n@${senderJid.split('@')[0]} tafadhari usitume viungo kwenye group!\n\nHii ni onyo!`,
                    mentions: [senderJid]
                });
            }
            
            // Kick
            if (action === 'kick') {
                await conn.sendMessage(from, {
                    text: `👢 *${botName}* 👢\n\n@${senderJid.split('@')[0]} umetolewa kwenye group kwa kutuma viungo!`,
                    mentions: [senderJid]
                });
                await conn.groupParticipantsUpdate(from, [senderJid], 'remove');
            }
        }
    } catch (e) {
        console.log('Antilink error:', e);
    }
});
