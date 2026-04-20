const fs = require('fs');
const path = require('path');
const config = require('../config');

// Define paths
const databaseDir = path.join(process.cwd(), 'data');
const warningsPath = path.join(databaseDir, 'warnings.json');

// Initialize warnings file if it doesn't exist
function initializeWarningsFile() {
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir, { recursive: true });
    }
    if (!fs.existsSync(warningsPath)) {
        fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8');
    }
}

async function warnCommand(sock, chatId, senderId, mentionedJids, message) {
    try {
        initializeWarningsFile();

        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ This command can only be used in groups!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
            });
            return;
        }

        // Check admin status
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participants = groupMetadata.participants;
            
            const isSenderAdmin = participants.some(p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin'));
            const isBotAdmin = participants.some(p => p.id === sock.user.id.split(':')[0] + '@s.whatsapp.net' && (p.admin === 'admin' || p.admin === 'superadmin'));
            
            if (!isBotAdmin) {
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Please make the bot an admin first to use this command.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
                });
                return;
            }
            
            if (!isSenderAdmin) {
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Only group admins can use the warn command.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
                });
                return;
            }
        } catch (adminError) {
            console.error('Error checking admin status:', adminError);
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Please make sure the bot is an admin of this group.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
            });
            return;
        }

        let userToWarn;

        if (mentionedJids && mentionedJids.length > 0) {
            userToWarn = mentionedJids[0];
        } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToWarn = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToWarn) {
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 Please mention the user or reply to their message to warn!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
            });
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            let warnings = {};
            try {
                warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
            } catch (error) {
                warnings = {};
            }

            if (!warnings[chatId]) warnings[chatId] = {};
            if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0;
            
            warnings[chatId][userToWarn]++;
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

            const warningCount = warnings[chatId][userToWarn];
            
            const warningMessage = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ WARNING ALERT
┣▣
┣▣ 👤 Warned User: @${userToWarn.split('@')[0]}
┣▣ ⚠️ Warning Count: ${warningCount}/3
┣▣ 👑 Warned By: @${senderId.split('@')[0]}
┣▣ 📅 Date: ${new Date().toLocaleString()}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`;

            await sock.sendMessage(chatId, {
                text: warningMessage,
                mentions: [userToWarn, senderId]
            });

            if (warningCount >= 3) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await sock.groupParticipantsUpdate(chatId, [userToWarn], "remove");
                delete warnings[chatId][userToWarn];
                fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

                const kickMessage = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔨 AUTO-KICK
┣▣
┣▣ @${userToWarn.split('@')[0]} has been removed from the group
┣▣ after receiving 3 warnings! ⚠️
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`;

                await sock.sendMessage(chatId, {
                    text: kickMessage,
                    mentions: [userToWarn]
                });
            }

        } catch (error) {
            console.error('Error in warn command:', error);
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ FAILED
┣▣ ⚠️ Failed to warn user!
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
            });
        }

    } catch (error) {
        console.error('Error in warn command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ RATE LIMIT
┣▣ ⏳ Please try again in a few seconds.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                await sock.sendMessage(chatId, {
                    text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ ⚠️ Failed to warn user. Make sure the bot is admin
┣▣    and has sufficient permissions.
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = warnCommand;