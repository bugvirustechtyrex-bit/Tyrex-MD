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
    action: 'delete'
};

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

function getMediaType(message) {
    if (!message.message) return null;
    const type = Object.keys(message.message)[0];
    
    if (type === 'imageMessage') return 'image';
    if (type === 'videoMessage') return 'video';
    if (type === 'audioMessage') return 'audio';
    if (type === 'documentMessage') return 'document';
    if (type === 'stickerMessage') return 'sticker';
    if (type === 'gifMessage') return 'gif';
    
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

async function handleAntiMediaAction(conn, from, sender, mediaType, mek) {
    const warns = antiMediaDB.userWarnings.get(sender) || 0;
    const newWarns = warns + 1;
    antiMediaDB.userWarnings.set(sender, newWarns);
    
    await conn.sendMessage(from, { delete: mek.key });
    
    if (antiMediaDB.action === 'delete') {
        if (!antiMediaDB.deleteSilently) {
            await conn.sendMessage(from, {
                text: `⚠️ *ANTI-MEDIA TYREX-MD*\n\n@${sender.split('@')[0]} media ya *${mediaType}* imefutwa!\n⚠️ Onyo: ${newWarns}/${antiMediaDB.warningCount}`,
                contextInfo: { mentionedJid: [sender] }
            });
        }
    } 
    else if (antiMediaDB.action === 'warn') {
        if (newWarns >= antiMediaDB.warningCount) {
            await conn.groupParticipantsUpdate(from, [sender], 'remove');
            antiMediaDB.userWarnings.delete(sender);
            await conn.sendMessage(from, {
                text: `🚫 *ANTI-MEDIA TYREX-MD*\n\n@${sender.split('@')[0]} amefukuzwa kwa kutuma media mara ${antiMediaDB.warningCount}.`,
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
            text: `🚫 *ANTI-MEDIA TYREX-MD*\n\n@${sender.split('@')[0]} amefukuzwa kwa kutuma *${mediaType}*.`,
            contextInfo: { mentionedJid: [sender] }
        });
    }
    else if (antiMediaDB.action === 'mute') {
        await conn.groupParticipantsUpdate(from, [sender], 'mute');
        setTimeout(async () => {
            await conn.groupParticipantsUpdate(from, [sender], 'unmute');
        }, 300000);
        await conn.sendMessage(from, {
            text: `🔇 *ANTI-MEDIA TYREX-MD*\n\n@${sender.split('@')[0]} amenyamazishwa kwa dakika 5 kwa kutuma *${mediaType}*.`,
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
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, isOwner, isCreator, reply, args }) => {
    if (!isGroup) return reply("❌ Command hii ni kwa groups tu!");
    
    // Allow owners and creators to bypass admin check
    const isAdminOrOwner = isAdmins || isOwner || isCreator;
    if (!isAdminOrOwner) return reply("❌ Command hii ni kwa admins na owner tu!");
    if (!isBotAdmins) return reply("❌ Nihonge ni admin ili nifanye kazi yangu!");
    
    const subCommand = args[0]?.toLowerCase();
    
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
        
        const helpText = `┏━━━〔 🛡️ TYREX-MD ANTI-MEDIA 〕━━━┓
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
┃ 🟢 .antimedia on
┃ 🔴 .antimedia off
┃ ⚙️ .antimedia action delete/warn/kick/mute
┃ 🔇 .antimedia silent on/off
┃ 🎯 .antimedia maxwarn <number>
┃ 📷 .antimedia media image on/off
┃ ✅ .antimedia allow
┃ ❌ .antimedia disallow
┃ 📋 .antimedia settings
┃ 🔄 .antimedia resetwarns
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        return reply(helpText);
    }
    
    if (subCommand === 'on') {
        antiMediaDB.enabled = true;
        saveAntiMediaSettings();
        reply(`✅ *ANTI-MEDIA ENABLED*\n\n🛡️ TYREX-MD itazuia media zote zilizochaguliwa.`);
    }
    else if (subCommand === 'off') {
        antiMediaDB.enabled = false;
        saveAntiMediaSettings();
        reply(`❌ *ANTI-MEDIA DISABLED*\n\nMedia zinaruhusiwa tena.`);
    }
    else if (subCommand === 'action') {
        const action = args[1]?.toLowerCase();
        if (!['delete', 'warn', 'kick', 'mute'].includes(action)) {
            return reply(`❌ Action invalid!\n\nOptions: delete, warn, kick, mute`);
        }
        antiMediaDB.action = action;
        saveAntiMediaSettings();
        reply(`✅ *Action Updated:* ${action}`);
    }
    else if (subCommand === 'silent') {
        const option = args[1]?.toLowerCase();
        if (option === 'on') {
            antiMediaDB.deleteSilently = true;
            reply(`✅ *Silent Delete Enabled*`);
        } else if (option === 'off') {
            antiMediaDB.deleteSilently = false;
            reply(`⚠️ *Silent Delete Disabled*`);
        } else {
            return reply(`❌ Use: .antimedia silent on/off`);
        }
        saveAntiMediaSettings();
    }
    else if (subCommand === 'maxwarn') {
        const num = parseInt(args[1]);
        if (isNaN(num) || num < 1 || num > 10) {
            return reply(`❌ Tafadhali ingiza namba kati ya 1 na 10.`);
        }
        antiMediaDB.warningCount = num;
        saveAntiMediaSettings();
        reply(`✅ *Max Warnings:* ${num}`);
    }
    else if (subCommand === 'media') {
        const mediaType = args[1]?.toLowerCase();
        const option = args[2]?.toLowerCase();
        
        if (!['image', 'video', 'audio', 'sticker', 'document'].includes(mediaType)) {
            return reply(`❌ Media types: image, video, audio, sticker, document`);
        }
        
        if (option === 'on') {
            antiMediaDB.mediaTypes[mediaType] = true;
            reply(`✅ *${mediaType} blocked*`);
        } else if (option === 'off') {
            antiMediaDB.mediaTypes[mediaType] = false;
            reply(`✅ *${mediaType} allowed*`);
        } else {
            return reply(`❌ Use: .antimedia media ${mediaType} on/off`);
        }
        saveAntiMediaSettings();
    }
    else if (subCommand === 'allow') {
        if (!antiMediaDB.allowedGroups.includes(from)) {
            antiMediaDB.allowedGroups.push(from);
            saveAntiMediaSettings();
            reply(`✅ *Group Allowed*\n\nAnti-Media haitafanya kazi kwenye group hili.`);
        } else {
            reply(`⚠️ Group tayari iko kwenye allowed list.`);
        }
    }
    else if (subCommand === 'disallow') {
        const index = antiMediaDB.allowedGroups.indexOf(from);
        if (index !== -1) {
            antiMediaDB.allowedGroups.splice(index, 1);
            saveAntiMediaSettings();
            reply(`✅ *Group Disallowed*\n\nAnti-Media itafanya kazi tena.`);
        } else {
            reply(`⚠️ Group haipo kwenye allowed list.`);
        }
    }
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
        
        const settingsText = `┏━━━〔 🛡️ TYREX-MD SETTINGS 〕━━━┓
┃
┃ 📊 Status: ${antiMediaDB.enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃ 🎯 Group Allowed: ${isAllowed ? '✅ YES' : '❌ NO'}
┃
┃ ⚙️ Action: ${actionText[antiMediaDB.action]}
┃ 🔇 Silent Delete: ${antiMediaDB.deleteSilently ? '✅ Yes' : '❌ No'}
┃ ⚠️ Max Warnings: ${antiMediaDB.warningCount}
┃
┃ 🚫 Blocked Media:
┃   ${mediaBlocked.join(', ')}
┃
┃ 📊 Warnings: ${antiMediaDB.userWarnings.size} users
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        reply(settingsText);
    }
    else if (subCommand === 'resetwarns') {
        antiMediaDB.userWarnings.clear();
        saveAntiMediaSettings();
        reply(`✅ *Warnings Reset*`);
    }
    else {
        reply(`❌ Command unknown!\n\nTumia .antimedia help`);
    }
});

async function handleAntiMedia(conn, mek, from, sender, isOwner, isAdmins) {
    if (!antiMediaDB.enabled) return false;
    if (antiMediaDB.allowedGroups.includes(from)) return false;
    if (isOwner || isAdmins) return false;
    
    const mediaType = getMediaType(mek);
    if (!mediaType) return false;
    if (!antiMediaDB.mediaTypes[mediaType]) return false;
    
    await handleAntiMediaAction(conn, from, sender, mediaType, mek);
    return true;
}

module.exports = { handleAntiMedia, antiMediaDB, saveAntiMediaSettings };
