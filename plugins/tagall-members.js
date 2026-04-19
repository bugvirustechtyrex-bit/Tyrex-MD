const { cmd } = require('../command');
const config = require('../config');

// Tag All Members Command
cmd({
    pattern: "tagall",
    alias: ["everyone", "mentionall", "all"],
    react: "📢",
    desc: "Mention all group members",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, groupAdmins, reply, args }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const customMessage = args.join(' ') || '📢 *TAG ALL*';

        const allMembers = participants.map(p => p.id);
        
        if (allMembers.length === 0) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ NO MEMBERS
┣▣ 📋 No members found in this group!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const admins = [];
        const regularMembers = [];
        
        for (const member of allMembers) {
            if (groupAdmins.includes(member)) {
                admins.push(member);
            } else {
                regularMembers.push(member);
            }
        }

        let memberList = '';
        
        if (admins.length > 0) {
            memberList += `\n👑 *ADMINS* 👑\n`;
            for (const admin of admins) {
                memberList += `┣▣ @${admin.split('@')[0]}\n`;
            }
            memberList += `┣▣\n`;
        }
        
        if (regularMembers.length > 0) {
            memberList += `👥 *MEMBERS* 👥\n`;
            for (const member of regularMembers) {
                memberList += `┣▣ @${member.split('@')[0]}\n`;
            }
        }

        const fullMessage = `┏▣ ◈ *${botName}* ◈
┣▣ ${customMessage}
┣▣
${memberList}┣▣
┣▣ 📊 Total: ${allMembers.length} members (👑 ${admins.length} admins)
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await conn.sendMessage(from, {
            text: fullMessage,
            mentions: allMembers
        }, { quoted: mek });

    } catch (e) {
        console.error('Tagall error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// Tag Admins Only - Same style as tagall
cmd({
    pattern: "tagadmin",
    alias: ["admins", "mentionadmin", "tagadmins"],
    react: "👑",
    desc: "Mention all group admins only",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, groupAdmins, reply, args }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const customMessage = args.join(' ') || '👑 *ADMIN TAG*';
        
        if (groupAdmins.length === 0) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ NO ADMINS
┣▣ 📋 No admins found in this group!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        let adminList = '';
        for (const admin of groupAdmins) {
            adminList += `┣▣ 👑 @${admin.split('@')[0]}\n`;
        }

        const fullMessage = `┏▣ ◈ *${botName}* ◈
┣▣ ${customMessage}
┣▣
┣▣ 👑 *ADMINS LIST* 👑
${adminList}┣▣
┣▣ 📊 Total: ${groupAdmins.length} admin(s)
┣▣
┣▣ ⚡ ${botName}
┗▣`;

        await conn.sendMessage(from, {
            text: fullMessage,
            mentions: groupAdmins
        }, { quoted: mek });

    } catch (e) {
        console.error('Tagadmin error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// Tag Admins Only - Simple version (no box)
cmd({
    pattern: "tagadmins",
    alias: ["admins2", "simpleadmin"],
    react: "👑",
    desc: "Mention all group admins only (simple style)",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, groupAdmins, reply, args }) => {
    try {
        if (!isGroup) {
            return await reply("❌ This command can only be used in groups!");
        }

        const customMessage = args.join(' ') || '👑 *ADMIN TAG*';
        
        if (groupAdmins.length === 0) {
            return await reply("⚠️ No admins found in this group!");
        }

        let adminList = '';
        for (const admin of groupAdmins) {
            adminList += `👑 @${admin.split('@')[0]}\n`;
        }

        const fullMessage = `${customMessage}\n\n👑 *ADMINS* 👑\n${adminList}\n📊 Total: ${groupAdmins.length} admin(s)`;

        await conn.sendMessage(from, {
            text: fullMessage,
            mentions: groupAdmins
        }, { quoted: mek });

    } catch (e) {
        console.error('Tagadmins error:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});

// Tag All Members - Simple version (no box)
cmd({
    pattern: "tagalls",
    alias: ["everyone2", "mentionalls"],
    react: "📢",
    desc: "Mention all group members (simple style)",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, groupAdmins, reply, args }) => {
    try {
        if (!isGroup) {
            return await reply("❌ This command can only be used in groups!");
        }

        const customMessage = args.join(' ') || '📢 *TAG ALL*';
        const allMembers = participants.map(p => p.id);
        
        if (allMembers.length === 0) {
            return await reply("⚠️ No members found in this group!");
        }

        const admins = [];
        const regularMembers = [];
        
        for (const member of allMembers) {
            if (groupAdmins.includes(member)) {
                admins.push(member);
            } else {
                regularMembers.push(member);
            }
        }

        let memberList = '';
        
        if (admins.length > 0) {
            memberList += `\n👑 *ADMINS* 👑\n`;
            for (const admin of admins) {
                memberList += `@${admin.split('@')[0]}\n`;
            }
            memberList += `\n`;
        }
        
        if (regularMembers.length > 0) {
            memberList += `👥 *MEMBERS* 👥\n`;
            for (const member of regularMembers) {
                memberList += `@${member.split('@')[0]}\n`;
            }
        }

        const fullMessage = `${customMessage}\n\n${memberList}\n\n📊 Total: ${allMembers.length} members (👑 ${admins.length} admins)`;
        
        await conn.sendMessage(from, {
            text: fullMessage,
            mentions: allMembers
        }, { quoted: mek });

    } catch (e) {
        console.error('Tagalls error:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});

// Tag All with Custom Title
cmd({
    pattern: "tagtitle",
    alias: ["tagmsg", "announce"],
    react: "📢",
    desc: "Tag all members with custom title and message",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, groupAdmins, reply, args }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        if (args.length === 0) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.tagtitle [title] | [message]*
┣▣ 📌 Example: *.tagtitle IMPORTANT | Please read the group rules*
┣▣
┣▣ 💡 Use | to separate title and message
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const fullArgs = args.join(' ');
        const parts = fullArgs.split('|');
        let title = '📢 *TAG ALL*';
        let message = '';
        
        if (parts.length >= 2) {
            title = parts[0].trim().toUpperCase();
            message = parts.slice(1).join('|').trim();
        } else {
            message = fullArgs;
        }

        const allMembers = participants.map(p => p.id);
        
        if (allMembers.length === 0) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ NO MEMBERS
┣▣ 📋 No members found in this group!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const admins = [];
        const regularMembers = [];
        
        for (const member of allMembers) {
            if (groupAdmins.includes(member)) {
                admins.push(member);
            } else {
                regularMembers.push(member);
            }
        }

        let memberList = '';
        
        if (admins.length > 0) {
            memberList += `\n👑 *ADMINS* 👑\n`;
            for (const admin of admins) {
                memberList += `┣▣ @${admin.split('@')[0]}\n`;
            }
            memberList += `┣▣\n`;
        }
        
        if (regularMembers.length > 0) {
            memberList += `👥 *MEMBERS* 👥\n`;
            for (const member of regularMembers) {
                memberList += `┣▣ @${member.split('@')[0]}\n`;
            }
        }

        const fullMessage = `┏▣ ◈ *${botName}* ◈
┣▣ 📢 *${title}* 📢
┣▣
┣▣ ${message ? `📝 ${message}\n┣▣\n` : ''}${memberList}┣▣
┣▣ 📊 Total: ${allMembers.length} members (👑 ${admins.length} admins)
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await conn.sendMessage(from, {
            text: fullMessage,
            mentions: allMembers
        }, { quoted: mek });

    } catch (e) {
        console.error('Tagtitle error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// Member Count
cmd({
    pattern: "membercount",
    alias: ["totalmembers", "groupcount"],
    react: "👥",
    desc: "Show total number of members in the group",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, groupAdmins, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const memberCount = participants.length;
        const adminCount = groupAdmins.length;
        
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 👥 GROUP STATS
┣▣
┣▣ 📊 Total Members: ${memberCount}
┣▣ 👑 Total Admins: ${adminCount}
┣▣ 👤 Regular Members: ${memberCount - adminCount}
┣▣
┣▣ ⚡ ${botName}
┗▣`);

    } catch (e) {
        console.error('Membercount error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});