const { cmd } = require('../command');
const config = require('../config');

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "⚡"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

// ============================================
// PROMOTE COMMAND
// ============================================
cmd({
    pattern: "promote",
    alias: ["admin", "makeadmin", "prom"],
    react: "👑",
    desc: "Promote a member to admin",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
    try{
        if (!isGroup) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ This command can only be used in groups!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        if (!isAdmins) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Only admins can promote members!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        let usersToPromote = [];

        if (m.quoted && m.quoted.sender) {
            usersToPromote.push(m.quoted.sender);
        }
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            usersToPromote = m.mentionedJid;
        }
        else if (m.args && m.args[0]) {
            let input = m.args[0].replace(/[^0-9]/g, '');
            if (input.length >= 10) {
                let number = input + '@s.whatsapp.net';
                usersToPromote.push(number);
            } else {
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ INVALID
┣▣
┣▣ 📌 Please provide a valid phone number or
┣▣    tag the user to promote.
┣▣
┣▣ 📌 Example: *.promote @user*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
        } else {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ ACTION NEEDED
┣▣
┣▣ 📌 Please tag or reply to the user to promote
┣▣
┣▣ 📌 Example: *.promote @user*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Filter out users who are already admins
        usersToPromote = usersToPromote.filter(user => !groupAdmins.includes(user));

        if (usersToPromote.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ NOTICE
┣▣
┣▣ 📌 Selected user(s) are already admins or invalid.
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Promote each user
        for (let user of usersToPromote) {
            try {
                await conn.groupParticipantsUpdate(from, [user], 'promote');
                console.log(`✅ Promoted: ${user}`);
            } catch (promoteError) {
                console.log(`❌ Error promoting ${user}:`, promoteError);
                await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ FAILED
┣▣
┣▣ ❌ Failed to promote @${user.split('@')[0]}
┣▣ 📋 Error: ${promoteError.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    mentions: [user],
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
        }

        let mentions = [];
        let mentionText = '';
        for (let user of usersToPromote) {
            mentions.push(user);
            mentionText += `@${user.split('@')[0]} `;
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 👑 PROMOTED
┣▣
┣▣ 📋 ADMIN(S)
┣▣ ${mentionText}
┣▣
┣▣ ✅ ${usersToPromote.length} user(s) promoted to admin
┣▣ 🕐 ${new Date().toLocaleTimeString()}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            mentions: mentions,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (e) {
        console.log('PROMOTE ERROR:', e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ COMMAND ERROR
┣▣
┣▣ 📋 ${e.message.substring(0, 50)}${e.message.length > 50 ? '...' : ''}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

// ============================================
// DEMOTE COMMAND
// ============================================
cmd({
    pattern: "demote",
    alias: ["removeadmin", "unadmin", "dem"],
    react: "⬇️",
    desc: "Demote an admin to regular member",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
    try{
        if (!isGroup) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ This command can only be used in groups!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        if (!isAdmins) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Only admins can demote members!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        let usersToDemote = [];

        if (m.quoted && m.quoted.sender) {
            usersToDemote.push(m.quoted.sender);
        }
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            usersToDemote = m.mentionedJid;
        }
        else if (m.args && m.args[0]) {
            let input = m.args[0].replace(/[^0-9]/g, '');
            if (input.length >= 10) {
                let number = input + '@s.whatsapp.net';
                usersToDemote.push(number);
            } else {
                return await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ INVALID
┣▣
┣▣ 📌 Please provide a valid phone number or
┣▣    tag the user to demote.
┣▣
┣▣ 📌 Example: *.demote @user*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
        } else {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ ACTION NEEDED
┣▣
┣▣ 📌 Please tag or reply to the user to demote
┣▣
┣▣ 📌 Example: *.demote @user*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Filter out users who are not admins
        usersToDemote = usersToDemote.filter(user => groupAdmins.includes(user));
        // Filter out bot from being demoted
        usersToDemote = usersToDemote.filter(user => user !== botNumber);

        if (usersToDemote.length === 0) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ NOTICE
┣▣
┣▣ 📌 Selected user(s) are not admins or cannot be demoted.
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Demote each user
        for (let user of usersToDemote) {
            try {
                await conn.groupParticipantsUpdate(from, [user], 'demote');
                console.log(`✅ Demoted: ${user}`);
            } catch (demoteError) {
                console.log(`❌ Error demoting ${user}:`, demoteError);
                await conn.sendMessage(from, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ FAILED
┣▣
┣▣ ❌ Failed to demote @${user.split('@')[0]}
┣▣ 📋 Error: ${demoteError.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                    mentions: [user],
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
        }

        let mentions = [];
        let mentionText = '';
        for (let user of usersToDemote) {
            mentions.push(user);
            mentionText += `@${user.split('@')[0]} `;
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⬇️ DEMOTED
┣▣
┣▣ 📋 USER(S)
┣▣ ${mentionText}
┣▣
┣▣ ✅ ${usersToDemote.length} user(s) demoted from admin
┣▣ 🕐 ${new Date().toLocaleTimeString()}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            mentions: mentions,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (e) {
        console.log('DEMOTE ERROR:', e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ COMMAND ERROR
┣▣
┣▣ 📋 ${e.message.substring(0, 50)}${e.message.length > 50 ? '...' : ''}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});