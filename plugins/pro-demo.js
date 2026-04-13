const { cmd } = require('../command');

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
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
    };
};

// PROMOTE COMMAND (IMEBORESHA)
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
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ʏᴏᴜ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ ꜱᴏᴍᴇᴏɴᴇ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let usersToPromote = [];
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        usersToPromote.push(m.quoted.sender);
    }
    // Check if mentioning someone
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToPromote = m.mentionedJid;
    }
    // Check if providing number in args
    else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToPromote.push(number);
        } else {
            return await conn.sendMessage(from, {
                text: `╭━━━⚠️━━━╮\n┃ ɪɴᴠᴀʟɪᴅ\n╰━━━━━━━━╯\n\n❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ ᴏʀ ᴛᴀɢ ᴛʜᴇ ᴜꜱᴇʀ\n\n📌 ᴇxᴀᴍᴘʟᴇ: *.ᴘʀᴏᴍᴏᴛᴇ @ᴜꜱᴇʀ*\nᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴜꜱᴇʀ'ꜱ ᴍᴇꜱꜱᴀɢᴇ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮\n┃ ᴀᴄᴛɪᴏɴ\n╰━━━━━━━━╯\n\n❌ ᴘʟᴇᴀꜱᴇ ᴛᴀɢ ᴛʜᴇ ᴜꜱᴇʀ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇɪʀ ᴍᴇꜱꜱᴀɢᴇ\n\n📌 ᴇxᴀᴍᴘʟᴇ: *.ᴘʀᴏᴍᴏᴛᴇ @ᴜꜱᴇʀ*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Filter out users who are already admins
    usersToPromote = usersToPromote.filter(user => !groupAdmins.includes(user));
    
    if (usersToPromote.length === 0) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮\n┃ ɴᴏᴛɪᴄᴇ\n╰━━━━━━━━╯\n\n❌ ꜱᴇʟᴇᴄᴛᴇᴅ ᴜꜱᴇʀ(ꜱ) ᴀʀᴇ ᴀʟʀᴇᴀᴅʏ ᴀᴅᴍɪɴꜱ ᴏʀ ɪɴᴠᴀʟɪᴅ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `╭━━━⏳━━━╮\n┃ ᴘʀᴏᴄᴇꜱꜱɪɴɢ\n╰━━━━━━━━╯\n\nᴘʀᴏᴍᴏᴛɪɴɢ ${usersToPromote.length} ᴜꜱᴇʀ(ꜱ)...\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Promote each user
    for (let user of usersToPromote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'promote');
            console.log(`✅ Promoted: ${user}`);
        } catch (promoteError) {
            console.log(`❌ Error promoting ${user}:`, promoteError);
            await conn.sendMessage(from, {
                text: `╭━━━❌━━━╮\n┃ ꜰᴀɪʟᴇᴅ\n╰━━━━━━━━╯\n\n❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ @${user.split('@')[0]}\n📋 ᴇʀʀᴏʀ: ${promoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Get usernames for mentioned users
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToPromote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   👑 ᴘʀᴏᴍᴏᴛᴇᴅ 👑
╚════════════════════╝

┌─── ✦﹒ᴀᴅᴍɪɴ(ꜱ)﹒✦ ───┐
│  ${mentionText}
└────────────────────┘

▸ ✅ ${usersToPromote.length} ᴜꜱᴇʀ(ꜱ) ᴘʀᴏᴍᴏᴛᴇᴅ ᴛᴏ ᴀᴅᴍɪɴ
▸ ⏰ ${new Date().toLocaleTimeString()}

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('PROMOTE ERROR:', e);
    await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ ᴜꜱᴇʀ(ꜱ)
📋 ᴇʀʀᴏʀ: ${e.message}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// DEMOTE COMMAND (IMEBORESHA)
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
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ʏᴏᴜ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ꜱᴏᴍᴇᴏɴᴇ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let usersToDemote = [];
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        usersToDemote.push(m.quoted.sender);
    }
    // Check if mentioning someone
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToDemote = m.mentionedJid;
    }
    // Check if providing number in args
    else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToDemote.push(number);
        } else {
            return await conn.sendMessage(from, {
                text: `╭━━━⚠️━━━╮
┃ ɪɴᴠᴀʟɪᴅ
╰━━━━━━━━╯

❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ ᴏʀ ᴛᴀɢ ᴛʜᴇ ᴜꜱᴇʀ

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴅᴇᴍᴏᴛᴇ @ᴜꜱᴇʀ*
ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴜꜱᴇʀ'ꜱ ᴍᴇꜱꜱᴀɢᴇ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴀᴄᴛɪᴏɴ
╰━━━━━━━━╯

❌ ᴘʟᴇᴀꜱᴇ ᴛᴀɢ ᴛʜᴇ ᴜꜱᴇʀ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇɪʀ ᴍᴇꜱꜱᴀɢᴇ

📌 ᴇxᴀᴍᴘʟᴇ: *.ᴅᴇᴍᴏᴛᴇ @ᴜꜱᴇʀ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Filter out users who are not admins
    usersToDemote = usersToDemote.filter(user => groupAdmins.includes(user));
    
    // Filter out bot from being demoted
    usersToDemote = usersToDemote.filter(user => user !== botNumber);
    
    if (usersToDemote.length === 0) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ɴᴏᴛɪᴄᴇ
╰━━━━━━━━╯

❌ ꜱᴇʟᴇᴄᴛᴇᴅ ᴜꜱᴇʀ(ꜱ) ᴀʀᴇ ɴᴏᴛ ᴀᴅᴍɪɴꜱ ᴏʀ ᴄᴀɴɴᴏᴛ ʙᴇ ᴅᴇᴍᴏᴛᴇᴅ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `╭━━━⏳━━━╮
┃ ᴘʀᴏᴄᴇꜱꜱɪɴɢ
╰━━━━━━━━╯

ᴅᴇᴍᴏᴛɪɴɢ ${usersToDemote.length} ᴜꜱᴇʀ(ꜱ)...

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Demote each user
    for (let user of usersToDemote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'demote');
            console.log(`✅ Demoted: ${user}`);
        } catch (demoteError) {
            console.log(`❌ Error demoting ${user}:`, demoteError);
            await conn.sendMessage(from, {
                text: `╭━━━❌━━━╮
┃ ꜰᴀɪʟᴇᴅ
╰━━━━━━━━╯

❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴅᴇᴍᴏᴛᴇ @${user.split('@')[0]}
📋 ᴇʀʀᴏʀ: ${demoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Get usernames for mentioned users
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToDemote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ⬇️ ᴅᴇᴍᴏᴛᴇᴅ ⬇️
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ(ꜱ)﹒✦ ───┐
│  ${mentionText}
└────────────────────┘

▸ ✅ ${usersToDemote.length} ᴜꜱᴇʀ(ꜱ) ᴅᴇᴍᴏᴛᴇᴅ ꜰʀᴏᴍ ᴀᴅᴍɪɴ
▸ ⏰ ${new Date().toLocaleTimeString()}

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('DEMOTE ERROR:', e);
    await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮
┃ ᴇʀʀᴏʀ
╰━━━━━━━━╯

❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ᴜꜱᴇʀ(ꜱ)
📋 ᴇʀʀᴏʀ: ${e.message}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});
