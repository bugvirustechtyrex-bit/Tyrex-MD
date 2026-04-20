const { cmd } = require('../command');
const config = require('../config');

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

// Kick Command - Remove member from group
cmd({
    pattern: "kick",
    alias: ["remove", "ban", "rm"],
    react: "👢",
    desc: "Remove a member from the group",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, sender, participants, groupAdmins, reply, quoted, mentionedJid }) => {
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
┣▣ 📋 Only group admins can kick members!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let usersToKick = [];

        if (mek.quoted && mek.quoted.sender) {
            usersToKick.push(mek.quoted.sender);
        }
        else if (mentionedJid && mentionedJid.length > 0) {
            usersToKick = mentionedJid;
        }
        else if (mek.message?.extendedTextMessage?.text) {
            const text = mek.message.extendedTextMessage.text;
            const args = text.split(' ');
            if (args[1]) {
                let input = args[1].replace(/[^0-9]/g, '');
                if (input.length >= 10 && input.length <= 15) {
                    let number = input + '@s.whatsapp.net';
                    usersToKick.push(number);
                } else {
                    return await conn.sendMessage(from, {
                        text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID NUMBER
┣▣
┣▣ 📋 Phone number must be 10-15 digits!
┣▣ 📌 Example: *.kick 255712345678*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                        contextInfo: getContextInfo(sender)
                    }, { quoted: mek });
                }
            }
        }

        if (usersToKick.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.kick @user* - Mention the user
┣▣ 📌 *.kick 2557XXXXXXXX* - Use phone number
┣▣ 📌 Reply to user's message with *.kick*
┣▣
┣▣ 📌 Example: *.kick @username*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        usersToKick = usersToKick.filter(user => user !== botJid);
        usersToKick = usersToKick.filter(user => user !== sender);

        if (usersToKick.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ NOTICE
┣▣
┣▣ 📋 Cannot kick:
┣▣ 👤 Yourself
┣▣ 🤖 The bot
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        // Check if users exist in the group
        const existingMembers = participants.map(p => p.id);
        const validUsers = [];
        const invalidUsers = [];

        for (const user of usersToKick) {
            if (existingMembers.includes(user)) {
                validUsers.push(user);
            } else {
                invalidUsers.push(user);
            }
        }

        if (validUsers.length === 0) {
            let invalidList = '';
            for (const user of invalidUsers) {
                invalidList += `┣▣ ❌ @${user.split('@')[0]} (Not in group)\n`;
            }
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ USER NOT FOUND
┣▣
┣▣ 📋 The following users are not in this group:
${invalidList}┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                mentions: invalidUsers,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let kickedUsers = [];
        let failedUsers = [];

        for (const user of validUsers) {
            try {
                await conn.groupParticipantsUpdate(from, [user], 'remove');
                kickedUsers.push(user);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.error(`Failed to kick ${user}:`, err);
                failedUsers.push(user);
            }
        }

        // Add invalid users to failed list
        for (const user of invalidUsers) {
            failedUsers.push(user);
        }

        let kickedMention = '';
        for (const user of kickedUsers) {
            kickedMention += `┣▣ 👢 @${user.split('@')[0]}\n`;
        }

        let failedMention = '';
        for (const user of failedUsers) {
            if (invalidUsers.includes(user)) {
                failedMention += `┣▣ ❌ @${user.split('@')[0]} (Not in group)\n`;
            } else {
                failedMention += `┣▣ ❌ @${user.split('@')[0]}\n`;
            }
        }

        let resultMessage = `┏▣ ◈ *${botName}* ◈
┣▣ 👢 KICK RESULT
┣▣
┣▣ ✅ Successfully kicked (${kickedUsers.length}):
${kickedMention}`;

        if (failedUsers.length > 0) {
            resultMessage += `┣▣
┣▣ ❌ Failed to kick (${failedUsers.length}):
${failedMention}`;
        }

        resultMessage += `┣▣
┣▣ 📊 Total: ${usersToKick.length} user(s)
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

        await conn.sendMessage(from, {
            text: resultMessage,
            mentions: [...kickedUsers, ...failedUsers],
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error('Kick command error:', e);
        
        if (e.message.includes('not an admin') || e.message.includes('403')) {
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ BOT NOT ADMIN
┣▣
┣▣ 📋 To kick members, the bot needs to be an admin!
┣▣
┣▣ 📌 HOW TO MAKE BOT ADMIN:
┣▣ 1️⃣ Open group info
┣▣ 2️⃣ Click on the bot's name
┣▣ 3️⃣ Select "Make Group Admin"
┣▣
┣▣ 💡 As a group admin, you can make the bot admin
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }
    }
});