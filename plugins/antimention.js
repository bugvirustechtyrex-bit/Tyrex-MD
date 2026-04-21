const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Paths for data files
const DATA_DIR = path.join(__dirname, '../data');
const ANTIMENTION_CONFIG_PATH = path.join(DATA_DIR, 'antimention_config.json');
const MENTION_WARNINGS_PATH = path.join(DATA_DIR, 'mention_warnings.json');

// Initialize data files
function initializeFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ANTIMENTION_CONFIG_PATH)) {
        fs.writeFileSync(ANTIMENTION_CONFIG_PATH, JSON.stringify({ enabled: false, action: 'warn', warnLimit: 3 }, null, 2));
    }
    if (!fs.existsSync(MENTION_WARNINGS_PATH)) {
        fs.writeFileSync(MENTION_WARNINGS_PATH, JSON.stringify({}, null, 2));
    }
}

// Load config
function loadConfig() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(ANTIMENTION_CONFIG_PATH, 'utf8'));
    } catch {
        return { enabled: false, action: 'warn', warnLimit: 3 };
    }
}

// Save config
function saveConfig(configData) {
    fs.writeFileSync(ANTIMENTION_CONFIG_PATH, JSON.stringify(configData, null, 2));
}

// Load warnings
function loadWarnings() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(MENTION_WARNINGS_PATH, 'utf8'));
    } catch {
        return {};
    }
}

// Save warnings
function saveWarnings(warnings) {
    fs.writeFileSync(MENTION_WARNINGS_PATH, JSON.stringify(warnings, null, 2));
}

// Add warning to user
function addWarning(groupId, userId) {
    const warnings = loadWarnings();
    if (!warnings[groupId]) warnings[groupId] = {};
    if (!warnings[groupId][userId]) warnings[groupId][userId] = 0;
    warnings[groupId][userId]++;
    saveWarnings(warnings);
    return warnings[groupId][userId];
}

// Reset warnings for user
function resetWarnings(groupId, userId) {
    const warnings = loadWarnings();
    if (warnings[groupId] && warnings[groupId][userId]) {
        delete warnings[groupId][userId];
        saveWarnings(warnings);
    }
}

// Reset all warnings in group
function resetAllWarnings(groupId) {
    const warnings = loadWarnings();
    if (warnings[groupId]) {
        delete warnings[groupId];
        saveWarnings(warnings);
        return true;
    }
    return false;
}

// Get warning count
function getWarningCount(groupId, userId) {
    const warnings = loadWarnings();
    if (warnings[groupId] && warnings[groupId][userId]) {
        return warnings[groupId][userId];
    }
    return 0;
}

// Get all warnings in group
function getGroupWarnings(groupId) {
    const warnings = loadWarnings();
    if (warnings[groupId]) {
        return warnings[groupId];
    }
    return {};
}

// Check if message mentions bot
function mentionsBot(message, botJid) {
    if (!message) return false;
    
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentionedJid.includes(botJid)) return true;
    
    const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant === botJid) return true;
    
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const botNumber = botJid.split('@')[0];
    if (text.includes(`@${botNumber}`)) return true;
    
    return false;
}

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

// ==============================================
// ANTI-MENTION COMMAND
// ==============================================
cmd({
    pattern: "antimention",
    alias: ["amention", "anti-mention", "ament"],
    react: "🚫",
    desc: "Enable or disable anti-mention protection",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, sender, args, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!isAdmins && !isCreator) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const configData = loadConfig();
        const action = args[0]?.toLowerCase();
        
        // Handle on/off
        if (action === 'on') {
            saveConfig({ ...configData, enabled: true });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ✅ ANTI-MENTION ENABLED
┣▣
┣▣ 🛡️ Protection is now ACTIVE
┣▣ ⚡ Action: ${configData.action === 'kick' ? 'KICK' : 'WARN'}
┣▣ 📊 Warn Limit: ${configData.warnLimit}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
        else if (action === 'off') {
            saveConfig({ ...configData, enabled: false });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ANTI-MENTION DISABLED
┣▣
┣▣ 🛡️ Protection is now INACTIVE
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
        // Handle action warn/kick
        else if (action === 'warn' || action === 'kick') {
            saveConfig({ ...configData, action: action });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚙️ ACTION UPDATED
┣▣
┣▣ ⚡ New Action: ${action.toUpperCase()}
┣▣
┣▣ ${action === 'kick' ? '👢 Users will be kicked immediately' : '⚠️ Users will be warned first, then kicked'}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
        // Handle limit
        else if (action === 'limit') {
            const limit = parseInt(args[1]);
            if (isNaN(limit) || limit < 1 || limit > 10) {
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ INVALID LIMIT
┣▣
┣▣ 📌 *.antimention limit [1-10]*
┣▣ 📌 Example: *.antimention limit 5*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    contextInfo: getContextInfo(sender)
                }, { quoted: mek });
            }
            saveConfig({ ...configData, warnLimit: limit });
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 📊 WARN LIMIT UPDATED
┣▣
┣▣ 📌 New Limit: ${limit} warnings before kick
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
        // Handle reset
        else if (action === 'reset') {
            resetAllWarnings(from);
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔄 WARNINGS RESET
┣▣
┣▣ ✅ All warnings have been reset for this group!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
        // Handle status
        else {
            const status = configData.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const actionType = configData.action === 'kick' ? '👢 KICK' : '⚠️ WARN';
            
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ ANTI-MENTION STATUS
┣▣
┣▣ 📋 Status: ${status}
┣▣ ⚡ Action: ${actionType}
┣▣ 📊 Warn Limit: ${configData.warnLimit}
┣▣
┣▣ 📌 COMMANDS:
┣▣ *.antimention on* - Enable protection
┣▣ *.antimention off* - Disable protection
┣▣ *.antimention warn* - Set to warn mode
┣▣ *.antimention kick* - Set to kick mode
┣▣ *.antimention limit [1-10]* - Set warn limit
┣▣ *.antimention reset* - Reset all warnings
┣▣ *.antimention* - Show this menu
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

    } catch (e) {
        console.error('Antimention command error:', e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});

// ==============================================
// CHECK MENTION WARNINGS COMMAND
// ==============================================
cmd({
    pattern: "mentionwarns",
    alias: ["mwarns", "checkmwarn"],
    react: "📊",
    desc: "Check mention warnings for a user",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, sender, mentionedJid, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!isAdmins && !isCreator) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let targetUser = sender;
        if (mentionedJid && mentionedJid.length > 0) {
            targetUser = mentionedJid[0];
        }

        const configData = loadConfig();
        const warningCount = getWarningCount(from, targetUser);

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 📊 MENTION WARNINGS
┣▣
┣▣ 👤 User: @${targetUser.split('@')[0]}
┣▣ 📊 Warnings: ${warningCount}/${configData.warnLimit}
┣▣ ⚠️ Remaining: ${configData.warnLimit - warningCount}
┣▣ ⚡ Action: ${configData.action.toUpperCase()}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            mentions: [targetUser],
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error('Mentionwarns error:', e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});

// ==============================================
// RESET MENTION WARNINGS COMMAND
// ==============================================
cmd({
    pattern: "resetmwarn",
    alias: ["resetmention", "clearmwarn"],
    react: "🔄",
    desc: "Reset mention warnings for a user",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, sender, mentionedJid, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!isAdmins && !isCreator) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!mentionedJid || mentionedJid.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.resetmwarn @user*
┣▣ 📌 Example: *.resetmwarn @username*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const targetUser = mentionedJid[0];
        resetWarnings(from, targetUser);

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔄 WARNINGS RESET
┣▣
┣▣ ✅ Warnings reset for @${targetUser.split('@')[0]}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            mentions: [targetUser],
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error('Resetmwarn error:', e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});

// ==============================================
// ANTI-MENTION MESSAGE HANDLER
// ==============================================
async function handleAntiMention(sock, chatId, message, senderId, isAdmin, isBotAdmin) {
    const configData = loadConfig();
    if (!configData.enabled) return;
    if (isAdmin) return;
    
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    
    if (mentionsBot(message, botJid)) {
        const action = configData.action;
        const warnLimit = configData.warnLimit;
        
        // Delete the message
        try {
            await sock.sendMessage(chatId, { delete: message.key });
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
        
        if (action === 'kick') {
            try {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🦶 ANTI-MENTION
┣▣
┣▣ 👤 @${senderId.split('@')[0]}
┣▣ 📋 User has been removed for mentioning the bot!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    mentions: [senderId],
                    contextInfo: getContextInfo(senderId)
                });
            } catch (err) {
                console.error('Failed to kick user:', err);
            }
        } 
        else if (action === 'warn') {
            const warningCount = addWarning(chatId, senderId);
            
            if (warningCount >= warnLimit) {
                try {
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                    resetWarnings(chatId, senderId);
                    await sock.sendMessage(chatId, {
                        text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 👢 ANTI-MENTION
┣▣
┣▣ 👤 @${senderId.split('@')[0]}
┣▣ 📊 Warnings: ${warningCount}/${warnLimit}
┣▣ 🔨 Action: REMOVED
┣▣
┣▣ ⚠️ User has been removed after ${warnLimit} warnings!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                        mentions: [senderId],
                        contextInfo: getContextInfo(senderId)
                    });
                } catch (err) {
                    console.error('Failed to kick user:', err);
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ ANTI-MENTION WARNING
┣▣
┣▣ 👤 @${senderId.split('@')[0]}
┣▣ 📊 Warning: ${warningCount}/${warnLimit}
┣▣
┣▣ 🚫 Please do not mention the bot!
┣▣ 💀 ${warnLimit - warningCount} warning(s) left before removal.
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    mentions: [senderId],
                    contextInfo: getContextInfo(senderId)
                });
            }
        }
    }
}

// Export handler for use in index.js
module.exports = { 
    handleAntiMention,
    loadConfig,
    saveConfig,
    loadWarnings,
    saveWarnings,
    addWarning,
    resetWarnings,
    resetAllWarnings,
    getWarningCount,
    getGroupWarnings,
    mentionsBot
};
