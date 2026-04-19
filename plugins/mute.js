const config = require('../config');

async function muteCommand(sock, chatId, senderId, message, durationInMinutes) {
    const botName = config.BOT_NAME;

    try {
        // Get group metadata to check admin status
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        
        const isSenderAdmin = participants.some(p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin'));
        const isBotAdmin = participants.some(p => p.id === sock.user.id.split(':')[0] + '@s.whatsapp.net' && (p.admin === 'admin' || p.admin === 'superadmin'));

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Please make the bot an admin first!
┣▣
┣▣ ⚡ ${botName}
┗▣`
            }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use the mute command.
┣▣
┣▣ ⚡ ${botName}
┗▣`
            }, { quoted: message });
            return;
        }

        // Mute the group
        await sock.groupSettingUpdate(chatId, 'announcement');

        if (durationInMinutes !== undefined && durationInMinutes > 0) {
            const durationInMilliseconds = durationInMinutes * 60 * 1000;
            
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔇 GROUP MUTED
┣▣
┣▣ ⏰ The group has been muted for ${durationInMinutes} minute(s).
┣▣
┣▣ ⚡ ${botName}
┗▣`
            }, { quoted: message });

            // Set timeout to unmute after duration
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(chatId, 'not_announcement');
                    await sock.sendMessage(chatId, {
                        text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔊 GROUP UNMUTED
┣▣
┣▣ ✅ The group has been unmuted.
┣▣
┣▣ ⚡ ${botName}
┗▣`
                    });
                } catch (unmuteError) {
                    console.error('Error unmuting group:', unmuteError);
                }
            }, durationInMilliseconds);
        } else {
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔇 GROUP MUTED
┣▣
┣▣ ✅ The group has been muted.
┣▣
┣▣ 💡 Use *.unmute* to unmute the group.
┣▣
┣▣ ⚡ ${botName}
┗▣`
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Error muting/unmuting the group:', error);
        await sock.sendMessage(chatId, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 An error occurred while muting/unmuting the group.
┣▣ 💡 Please try again.
┣▣
┣▣ ⚡ ${botName}
┗▣`
        }, { quoted: message });
    }
}

module.exports = muteCommand;