const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');

// Anti-Media Settings Database
let antiMediaDB = {
    enabled: false,
    deleteSilently: true,
    mediaTypes: {
        image: true,
        video: true,
        audio: true,
        document: true,
        sticker: true,
        gif: true
    },
    allowedGroups: [],
    warningCount: 3,
    userWarnings: new Map(),
    action: 'delete' // delete, warn, kick, mute
};

// Load anti-media settings
const antiMediaFile = './anti-media.json';
if (fs.existsSync(antiMediaFile)) {
    try {
        const loaded = JSON.parse(fs.readFileSync(antiMediaFile));
        antiMediaDB.enabled = loaded.enabled || false;
        antiMediaDB.deleteSilently = loaded.deleteSilently !== undefined ? loaded.deleteSilently : true;
        antiMediaDB.mediaTypes = loaded.mediaTypes || antiMediaDB.mediaTypes;
        antiMediaDB.allowedGroups = loaded.allowedGroups || [];
        antiMediaDB.warningCount = loaded.warningCount || 3;
        antiMediaDB.action = loaded.action || 'delete';
    } catch (e) {
        console.error('Error loading anti-media settings:', e);
    }
}

// Save anti-media settings
function saveAntiMediaSettings() {
    const toSave = {
        enabled: antiMediaDB.enabled,
        deleteSilently: antiMediaDB.deleteSilently,
        mediaTypes: antiMediaDB.mediaTypes,
        allowedGroups: antiMediaDB.allowedGroups,
        warningCount: antiMediaDB.warningCount,
        action: antiMediaDB.action
    };
    fs.writeFileSync(antiMediaFile, JSON.stringify(toSave, null, 2));
}

// Get media type from message
function getMediaType(message) {
    if (!message.message) return null;
    const type = Object.keys(message.message)[0];
    
    if (type === 'imageMessage') return 'image';
    if (type === 'videoMessage') return 'video';
    if (type === 'audioMessage') return 'audio';
    if (type === 'documentMessage') return 'document';
    if (type === 'stickerMessage') return 'sticker';
    if (type === 'gifMessage') return 'gif';
    
    // Check for extended text message with media
    if (type === 'extendedTextMessage') {
        const extMsg = message.message.extendedTextMessage;
        if (extMsg && extMsg.contextInfo && extMsg.contextInfo.quotedMessage) {
            const quotedType = Object.keys(extMsg.contextInfo.quotedMessage)[0];
            if (quotedType === 'imageMessage') return 'image';
            if (quotedType === 'videoMessage') return 'video';
            if (quotedType === 'audioMessage') return 'audio';
            if (quotedType === 'documentMessage') return 'document';
            if (quotedType === 'stickerMessage') return 'sticker';
        }
    }
    
    return null;
}

// Handle anti-media action
async function handleAntiMediaAction(conn, from, sender, mediaType, mek) {
    const warns = antiMediaDB.userWarnings.get(sender) || 0;
    const newWarns = warns + 1;
    antiMediaDB.userWarnings.set(sender, newWarns);
    
    // Delete the message
    await conn.sendMessage(from, { delete: mek.key });
    
    if (antiMediaDB.action === 'delete') {
        if (!antiMediaDB.deleteSilently) {
            await conn.sendMessage(from, {
                text: `⚠️ *ANTI-MEDIA*\n\n@${sender.split('@')[0]} media ya *${mediaType}* imefutwa!\n⚠️ Onyo: ${newWarns}/${antiMediaDB.warningCount}`,
                contextInfo: { mentionedJid: [sender] }
            });
        }
    } 
    else if (antiMediaDB.action === 'warn') {
        if (newWarns >= antiMediaDB.warningCount) {
            await conn.groupParticipantsUpdate(from, [sender], 'remove');
            antiMediaDB.userWarnings.delete(sender);
            await conn.sendMessage(from, {
                text: `🚫 *ANTI-MEDIA*\n\n@${sender.split('@')[0]} amefukuzwa kwa kutuma media mara ${antiMediaDB.warningCount}.`,
                contextInfo: { mentionedJid: [sender] }
            });
        } else {
            await conn.sendMessage(from, {
                text: `⚠️ *ANTI-MEDIA WARNING (${newWarns}/${antiMediaDB.warningCount})*\n\n@${sender.split('@')[0]} media ya *${mediaType}* imefutwa!\n⚠️ Usitume media tena utafukuzwa!`,
                contextInfo: { mentionedJid: [sender] }
            });
        }
    }
    else if (antiMediaDB.action === 'kick') {
        await conn.groupParticipantsUpdate(from, [sender], 'remove');
        antiMediaDB.userWarnings.delete(sender);
        await conn.sendMessage(from, {
            text: `🚫 *ANTI-MEDIA*\n\n@${sender.split('@')[0]} amefukuzwa kwa kutuma *${mediaType}*.`,
            contextInfo: { mentionedJid: [sender] }
        });
    }
    else if (antiMediaDB.action === 'mute') {
        // Mute for 5 minutes
        await conn.groupParticipantsUpdate(from, [sender], 'mute');
        setTimeout(async () => {
            await conn.groupParticipantsUpdate(from, [sender], 'unmute');
        }, 300000);
        await conn.sendMessage(from, {
            text: `🔇 *ANTI-MEDIA*\n\n@${sender.split('@')[0]} amenyamazishwa kwa dakika 5 kwa kutuma *${mediaType}*.`,
            contextInfo: { mentionedJid: [sender] }
        });
    }
    
    return true;
}

// MAIN ANTI-MEDIA COMMAND
cmd({
    pattern: "antimedia",
    alias: ["am", "mediaprotect", "mp"],
    desc: "Configure anti-media protection for groups",
    category: "group",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, isOwner, reply, args }) => {
    if (!isGroup) return reply("❌ Command hii ni kwa groups tu!");
    if (!isAdmins && !isOwner) return reply("❌ Command hii ni kwa admins tu!");
    if (!isBotAdmins) return reply("❌ Nihonge ni admin ili nifanye kazi yangu!");
    
    const subCommand = args[0]?.toLowerCase();
    
    // HELP MENU
    if (!subCommand || subCommand === 'help') {
        const status = antiMediaDB.enabled ? '✅ ENABLED' : '❌ DISABLED';
        const actionText = {
            'delete': '🗑️ Futa tu',
            'warn': '⚠️ Onyo kisha Fukuza',
            'kick': '🚫 Fukuza mara moja',
            'mute': '🔇 Nyamazisha'
        };
        
        const mediaStatus = [];
        if (antiMediaDB.mediaTypes.image) mediaStatus.push('📷 Image');
        if (antiMediaDB.mediaTypes.video) mediaStatus.push('🎥 Video');
        if (antiMediaDB.mediaTypes.audio) mediaStatus.push('🎵 Audio');
        if (antiMediaDB.mediaTypes.sticker) mediaStatus.push('🏷️ Sticker');
        if (antiMediaDB.mediaTypes.document) mediaStatus.push('📄 Document');
        if (antiMediaDB.mediaTypes.gif) mediaStatus.push('🎬 GIF');
        
        const helpText = `┏━━━〔 🛡️ ANTI-MEDIA 〕━━━┓
┃
┃ 📊 Status: ${status}
┃ ⚙️ Action: ${actionText[antiMediaDB.action]}
┃ 🔇 Silent Delete: ${antiMediaDB.deleteSilently ? '✅' : '❌'}
┃ ⚠️ Max Warnings: ${antiMediaDB.warningCount}
┃
┃ 🚫 Blocked Media:
┃   ${mediaStatus.join(', ')}
┃
┣━━━〔 📝 COMMANDS 〕━━━┛
┃
┃ 🟢 *Enable Protection*
┃   .antimedia on
┃
┃ 🔴 *Disable Protection*
┃   .antimedia off
┃
┃ ⚙️ *Set Action*
┃   .antimedia action delete/warn/kick/mute
┃
┃ 🔇 *Toggle Silent Delete*
┃   .antimedia silent on/off
┃
┃ 🎯 *Set Max Warnings*
┃   .antimedia maxwarn <number>
┃
┃ 📷 *Toggle Media Types*
┃   .antimedia media image on/off
┃   .antimedia media video on/off
┃   .antimedia media audio on/off
┃   .antimedia media sticker on/off
┃   .antimedia media document on/off
┃
┃ ✅ *Allow This Group*
┃   .antimedia allow
┃
┃ ❌ *Remove Allow*
┃   .antimedia disallow
┃
┃ 📋 *View Settings*
┃   .antimedia settings
┗━━━━━━━━━━━━━━━━━━`;
        
        return reply(helpText);
    }
    
    // ENABLE/DISABLE
    if (subCommand === 'on') {
        antiMediaDB.enabled = true;
        saveAntiMediaSettings();
        reply(`✅ *Anti-Media Enabled*\n\n🛡️ Media zote zilizozuiliwa zitafutwa automatically.\n📊 Action: ${antiMediaDB.action}\n🔇 Silent: ${antiMediaDB.deleteSilently ? 'Yes' : 'No'}`);
    }
    else if (subCommand === 'off') {
        antiMediaDB.enabled = false;
        saveAntiMediaSettings();
        reply(`❌ *Anti-Media Disabled*\n\nMedia zinaruhusiwa tena kwenye group hili.`);
    }
    
    // SET ACTION
    else if (subCommand === 'action') {
        const action = args[1]?.toLowerCase();
        if (!['delete', 'warn', 'kick', 'mute'].includes(action)) {
            return reply(`❌ Action invalid!\n\nOptions: delete, warn, kick, mute\n\nCurrent: ${antiMediaDB.action}`);
        }
        antiMediaDB.action = action;
        saveAntiMediaSettings();
        reply(`✅ *Action Updated*\n\n⚙️ New Action: ${action}\n\n${action === 'delete' ? '🗑️ Media itafutwa tu' : action === 'warn' ? '⚠️ Onyo na kufukuzwa baada ya warnings' : action === 'kick' ? '🚫 Fukuza mara moja' : '🔇 Nyamazisha kwa dakika 5'}`);
    }
    
    // TOGGLE SILENT DELETE
    else if (subCommand === 'silent') {
        const option = args[1]?.toLowerCase();
        if (option === 'on') {
            antiMediaDB.deleteSilently = true;
            reply(`✅ *Silent Delete Enabled*\n\nMedia zinafutwa kimya kimya bila taarifa.`);
        } else if (option === 'off') {
            antiMediaDB.deleteSilently = false;
            reply(`⚠️ *Silent Delete Disabled*\n\nWatu watajulishwa wakati media inafutwa.`);
        } else {
            return reply(`❌ Use: .antimedia silent on/off\nCurrent: ${antiMediaDB.deleteSilently ? 'ON' : 'OFF'}`);
        }
        saveAntiMediaSettings();
    }
    
    // SET MAX WARNINGS
    else if (subCommand === 'maxwarn') {
        const num = parseInt(args[1]);
        if (isNaN(num) || num < 1 || num > 10) {
            return reply(`❌ Tafadhali ingiza namba kati ya 1 na 10.\nCurrent: ${antiMediaDB.warningCount}`);
        }
        antiMediaDB.warningCount = num;
        saveAntiMediaSettings();
        reply(`✅ *Max Warnings Updated*\n\n⚠️ Warnings limit: ${num}\nBaada ya warnings ${num}, mtumiaji atafukuzwa.`);
    }
    
    // TOGGLE MEDIA TYPES
    else if (subCommand === 'media') {
        const mediaType = args[1]?.toLowerCase();
        const option = args[2]?.toLowerCase();
        
        if (!['image', 'video', 'audio', 'sticker', 'document'].includes(mediaType)) {
            return reply(`❌ Media types: image, video, audio, sticker, document`);
        }
        
        if (option === 'on') {
            antiMediaDB.mediaTypes[mediaType] = true;
            reply(`✅ *${mediaType} Blocked*\n\nSasa ${mediaType} itazuiliwa.`);
        } else if (option === 'off') {
            antiMediaDB.mediaTypes[mediaType] = false;
            reply(`✅ *${mediaType} Allowed*\n\nSasa ${mediaType} inaruhusiwa.`);
        } else {
            return reply(`❌ Use: .antimedia media ${mediaType} on/off\nCurrent: ${antiMediaDB.mediaTypes[mediaType] ? 'BLOCKED' : 'ALLOWED'}`);
        }
        saveAntiMediaSettings();
    }
    
    // ALLOW GROUP
    else if (subCommand === 'allow') {
        if (!antiMediaDB.allowedGroups.includes(from)) {
            antiMediaDB.allowedGroups.push(from);
            saveAntiMediaSettings();
            reply(`✅ *Group Allowed*\n\nAnti-Media haitafanya kazi kwenye group hili.\n\nIli kuondoa ruhusa tumia: .antimedia disallow`);
        } else {
            reply(`⚠️ Group hili tayari liko kwenye allowed list.`);
        }
    }
    
    // DISALLOW GROUP
    else if (subCommand === 'disallow') {
        const index = antiMediaDB.allowedGroups.indexOf(from);
        if (index !== -1) {
            antiMediaDB.allowedGroups.splice(index, 1);
            saveAntiMediaSettings();
            reply(`✅ *Group Disallowed*\n\nAnti-Media itafanya kazi kwenye group hili tena.`);
        } else {
            reply(`⚠️ Group hili haipo kwenye allowed list.`);
        }
    }
    
    // VIEW SETTINGS
    else if (subCommand === 'settings') {
        const isAllowed = antiMediaDB.allowedGroups.includes(from);
        const actionText = {
            'delete': '🗑️ Delete Only',
            'warn': '⚠️ Warn then Kick',
            'kick': '🚫 Instant Kick',
            'mute': '🔇 Temporary Mute'
        };
        
        const mediaBlocked = [];
        if (antiMediaDB.mediaTypes.image) mediaBlocked.push('📷 Image');
        if (antiMediaDB.mediaTypes.video) mediaBlocked.push('🎥 Video');
        if (antiMediaDB.mediaTypes.audio) mediaBlocked.push('🎵 Audio');
        if (antiMediaDB.mediaTypes.sticker) mediaBlocked.push('🏷️ Sticker');
        if (antiMediaDB.mediaTypes.document) mediaBlocked.push('📄 Document');
        
        const settingsText = `┏━━━〔 🛡️ ANTI-MEDIA SETTINGS 〕━━━┓
┃
┃ 📊 Status: ${antiMediaDB.enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃ 🎯 Group Allowed: ${isAllowed ? '✅ YES' : '❌ NO'}
┃
┃ ⚙️ Action: ${actionText[antiMediaDB.action]}
┃ 🔇 Silent Delete: ${antiMediaDB.deleteSilently ? '✅ Yes' : '❌ No'}
┃ ⚠️ Max Warnings: ${antiMediaDB.warningCount}
┃
┃ 🚫 Blocked Media Types:
┃   ${mediaBlocked.join(', ')}
┃
┃ 📊 Current Group Warnings:
┃   ${antiMediaDB.userWarnings.size} users have warnings
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        reply(settingsText);
    }
    
    // RESET WARNINGS FOR GROUP
    else if (subCommand === 'resetwarns') {
        antiMediaDB.userWarnings.clear();
        saveAntiMediaSettings();
        reply(`✅ *Warnings Reset*\n\nWarnings zote kwenye group hili zimefutwa.`);
    }
    
    else {
        reply(`❌ Command unknown!\n\nTumia .antimedia help kuona commands zote.`);
    }
});

// ANTI-MEDIA MESSAGE HANDLER (This will be called from main index.js)
async function handleAntiMedia(conn, mek, from, sender, isOwner, isAdmins) {
    // Check if anti-media is enabled
    if (!antiMediaDB.enabled) return false;
    
    // Check if group is allowed
    if (antiMediaDB.allowedGroups.includes(from)) return false;
    
    // Owners and admins can bypass
    if (isOwner || isAdmins) return false;
    
    // Get media type
    const mediaType = getMediaType(mek);
    if (!mediaType) return false;
    
    // Check if this media type is blocked
    if (!antiMediaDB.mediaTypes[mediaType]) return false;
    
    // Handle the action
    await handleAntiMediaAction(conn, from, sender, mediaType, mek);
    return true;
}

// Export the handler for main index.js
module.exports = { handleAntiMedia, antiMediaDB, saveAntiMediaSettings };
