const { cmd, commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const { sleep } = require('../lib/functions');

// 1. Shutdown Bot
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🛑 SHUTTING DOWN
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    setTimeout(() => process.exit(), 2000);
});

// 2. Broadcast Message to All Groups
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    if (args.length === 0) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 *.broadcast [message]*
┣▣ 📌 Example: *.broadcast Hello everyone!*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📢 BROADCASTING
┣▣
┣▣ 📋 Message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}
┣▣ 👥 Groups: ${groups.length}
┣▣
┣▣ ⏳ Sending to all groups...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    
    let sent = 0;
    for (const groupId of groups) {
        try {
            await conn.sendMessage(groupId, { text: message });
            sent++;
            await sleep(500);
        } catch (e) {
            console.error(`Failed to send to ${groupId}:`, e);
        }
    }
    
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ BROADCAST COMPLETE
┣▣
┣▣ 📋 Message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}
┣▣ ✅ Sent: ${sent}/${groups.length} groups
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
});

// 3. Set Profile Picture
cmd({
    pattern: "setpp",
    alias: ["nulpp", "setprofilepic"],
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    if (!quoted || !quoted.message.imageMessage) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 Reply to an image with *.setpp*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ PROFILE PICTURE UPDATED
┣▣
┣▣ 🖼️ Profile picture updated successfully!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    } catch (error) {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${error.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// 4. Clear All Chats
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ CHATS CLEARED
┣▣
┣▣ 🧹 All chats cleared successfully!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    } catch (error) {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${error.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// 5. Group JIDs List
cmd({
    pattern: "gjid",
    alias: ["grouplist", "groups"],
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups);
    const groupList = groupJids.map((jid, i) => `┣▣ ${i + 1}. ${jid}`).join('\n');
    
    if (groupJids.length === 0) {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📋 GROUP JIDS
┣▣
┣▣ 📌 No groups found!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
        return;
    }
    
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📋 GROUP JIDS
┣▣
${groupList}
┣▣
┣▣ 📌 Total: ${groupJids.length} groups
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
});

// 6. Delete Message Command
cmd({
    pattern: "delete",
    alias: ["del", "delforward"],
    react: "🗑️",
    desc: "Delete bot's or user's message",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isAdmins, quoted, reply }) => {
    if (!isOwner && !isAdmins) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only admins and owner can use this command!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    if (!m.quoted) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 Reply to a message with *.delete* or *.del*
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    try {
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        await conn.sendMessage(m.chat, { delete: key });
        
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ MESSAGE DELETED
┣▣
┣▣ 🗑️ Message deleted successfully!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    } catch (e) {
        console.log(e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ MESSAGE DELETED
┣▣
┣▣ 🗑️ Message deleted successfully!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// 7. Restart Bot
cmd({
    pattern: "restart",
    desc: "Restart the bot.",
    category: "owner",
    react: "🔄",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔄 RESTARTING
┣▣
┣▣ ⏳ Bot is restarting...
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    
    setTimeout(() => {
        process.exit();
    }, 2000);
});

// 8. Leave Group
cmd({
    pattern: "leave",
    alias: ["leavegroup", "exit"],
    desc: "Bot leaves the group.",
    category: "owner",
    react: "🚪",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isGroup, reply, args }) => {
    if (!isOwner) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 You are not the owner!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    let targetGroup = from;
    if (args[0] && isOwner) {
        targetGroup = args[0];
    }
    
    if (!targetGroup.endsWith('@g.us')) {
        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 *.leave* - Leave current group
┣▣ 📌 *.leave [groupJID]* - Leave specific group
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
    
    try {
        await conn.groupLeave(targetGroup);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🚪 LEFT GROUP
┣▣
┣▣ ✅ Bot has left the group.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    } catch (error) {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${error.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// 9. Get Bot Info
cmd({
    pattern: "botinfo",
    alias: ["botstatus", "info"],
    desc: "Get bot information.",
    category: "main",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;
    
    await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 BOT INFORMATION
┣▣
┣▣ 📋 Name: ${config.BOT_NAME}
┣▣ 👑 Owner: ${config.OWNER_NAME}
┣▣ 📞 Number: ${config.OWNER_NUMBER}
┣▣ 🔧 Prefix: ${config.PREFIX}
┣▣ 🎯 Mode: ${config.MODE || 'PUBLIC'}
┣▣ ⏱️ Uptime: ${uptimeString}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
});