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

// Add Command - Add member to group (Bot doesn't need to be admin)
cmd({
    pattern: "add",
    alias: ["invite", "adduser", "addmember"],
    react: "➕",
    desc: "Add a member to the group",
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

        // Only check if user is admin, bot doesn't need to be admin
        if (!isAdmins && !isCreator) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can add members!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.add 2557XXXXXXXX*
┣▣ 📌 *.add +2557XXXXXXXX*
┣▣ 📌 Example: *.add 255712345678*
┣▣
┣▣ 💡 Use country code without '+' or with '+'
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let phoneNumber = args[0].replace(/[^0-9]/g, '');
        
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
        }
        
        if (phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID NUMBER
┣▣
┣▣ 📋 Please provide a valid phone number!
┣▣ 📋 Minimum 10 digits, maximum 15 digits
┣▣
┣▣ 📌 Example: *.add 255712345678*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const userJid = phoneNumber + '@s.whatsapp.net';

        try {
            await conn.groupParticipantsUpdate(from, [userJid], 'add');
            
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ✅ USER ADDED
┣▣
┣▣ ➕ @${phoneNumber} has been added to the group!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender),
                mentions: [userJid]
            }, { quoted: mek });
            
        } catch (addError) {
            let errorMsg = '';
            
            if (addError.message.includes('not found') || addError.message.includes('invalid')) {
                errorMsg = `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ADD FAILED
┣▣
┣▣ 📋 User @${phoneNumber} is not on WhatsApp or
┣▣    the number is invalid!
┣▣
┣▣ 💡 Make sure the number is registered on WhatsApp
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
            } else if (addError.message.includes('rate overlimit')) {
                errorMsg = `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ADD FAILED
┣▣
┣▣ ⏳ Rate limit reached!
┣▣
┣▣ 💡 Please wait a few minutes and try again
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
            } else {
                errorMsg = `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ADD FAILED
┣▣
┣▣ 📋 ${addError.message.substring(0, 100)}
┣▣
┣▣ 💡 Possible reasons:
┣▣ • User left the group recently
┣▣ • User has privacy settings enabled
┣▣ • Invalid phone number
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
            }
            
            await conn.sendMessage(from, {
                text: errorMsg,
                contextInfo: getContextInfo(sender),
                mentions: [userJid]
            }, { quoted: mek });
        }

    } catch (e) {
        console.error('Add command error:', e);
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

// Add Multiple Members (Bot doesn't need to be admin)
cmd({
    pattern: "addall",
    alias: ["addmulti", "addmembers", "addlist"],
    react: "➕",
    desc: "Add multiple members to the group",
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
┣▣ 📋 Only group admins can add members!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.addall 255712345678,255787654321*
┣▣ 📌 Example: *.addall 255712345678,255798765432*
┣▣
┣▣ 💡 Separate numbers with commas
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let numbers = [];
        if (args[0].includes(',')) {
            numbers = args[0].split(',').map(n => n.trim());
        } else {
            numbers = args;
        }

        const validNumbers = [];
        const invalidNumbers = [];

        for (const num of numbers) {
            let cleaned = num.replace(/[^0-9]/g, '');
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }
            if (cleaned.length >= 10 && cleaned.length <= 15) {
                validNumbers.push(cleaned);
            } else {
                invalidNumbers.push(num);
            }
        }

        if (validNumbers.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID NUMBERS
┣▣
┣▣ 📋 No valid phone numbers found!
┣▣
┣▣ 💡 Numbers must be 10-15 digits
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const added = [];
        const failed = [];

        for (const num of validNumbers) {
            const userJid = num + '@s.whatsapp.net';
            try {
                await conn.groupParticipantsUpdate(from, [userJid], 'add');
                added.push(num);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (err) {
                failed.push(num);
                console.error(`Failed to add ${num}:`, err);
            }
        }

        let resultMsg = `┏▣ ◈ *${botName}* ◈
┣▣ 📊 ADD RESULT
┣▣
┣▣ ✅ Successfully added (${added.length}):
`;
        for (const num of added) {
            resultMsg += `┣▣ ➕ @${num}\n`;
        }

        if (failed.length > 0) {
            resultMsg += `┣▣
┣▣ ❌ Failed to add (${failed.length}):
`;
            for (const num of failed) {
                resultMsg += `┣▣ ❌ @${num}\n`;
            }
        }

        resultMsg += `┣▣
┣▣ 📊 Total: ${validNumbers.length} user(s)
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

        const allMentions = [...added, ...failed].map(num => num + '@s.whatsapp.net');

        await conn.sendMessage(from, {
            text: resultMsg,
            contextInfo: getContextInfo(sender),
            mentions: allMentions
        }, { quoted: mek });

    } catch (e) {
        console.error('Addall command error:', e);
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

// Get Group Invite Link
cmd({
    pattern: "link",
    alias: ["grouplink", "invitelink", "getlink"],
    react: "🔗",
    desc: "Get group invite link",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, sender, reply }) => {
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
┣▣ 📋 Only group admins can get the group link!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const inviteCode = await conn.groupInviteCode(from);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔗 GROUP INVITE LINK
┣▣
┣▣ 📎 ${inviteLink}
┣▣
┣▣ 💡 Share this link to invite members
┣▣ ⏰ Link never expires
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error('Link command error:', e);
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

// Revoke Group Invite Link (Bot needs to be admin for this action)
cmd({
    pattern: "revoke",
    alias: ["resetlink", "newlink", "renewlink"],
    react: "🔄",
    desc: "Revoke and generate new group invite link",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, isBotAdmins, sender, reply }) => {
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
┣▣ 📋 Only group admins can revoke the group link!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        // For revoke, bot needs to be admin (WhatsApp requirement)
        if (!isBotAdmins) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ BOT NOT ADMIN
┣▣
┣▣ 📋 To revoke the link, please make the bot an admin first!
┣▣
┣▣ 📌 HOW TO MAKE BOT ADMIN:
┣▣ 1️⃣ Open group info
┣▣ 2️⃣ Click on the bot's name
┣▣ 3️⃣ Select "Make Group Admin"
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        await conn.groupRevokeInvite(from);
        const newInviteCode = await conn.groupInviteCode(from);
        const newInviteLink = `https://chat.whatsapp.com/${newInviteCode}`;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔄 LINK REVOKED
┣▣
┣▣ 📎 NEW LINK: ${newInviteLink}
┣▣
┣▣ ⚠️ Old link has been invalidated
┣▣ 💡 Share the new link to invite members
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error('Revoke command error:', e);
        
        let errorMsg = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 Failed to revoke group link!
┣▣
┣▣ 💡 Possible reasons:
┣▣ • Bot needs to be an admin to revoke links
┣▣ • Please make the bot an admin first
┣▣
┣▣ 📌 HOW TO MAKE BOT ADMIN:
┣▣ 1️⃣ Open group info
┣▣ 2️⃣ Click on the bot's name
┣▣ 3️⃣ Select "Make Group Admin"
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
        
        await conn.sendMessage(from, {
            text: errorMsg,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    }
});