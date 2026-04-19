const { cmd } = require("../command");
const config = require("../config");
const isAdmin = require("../lib/isAdmin");

// Warning tracker
const warningCount = {};

//==============================================================================
// 🛡️ LINK DETECTOR & PROTECTOR - SILENT MODE
//==============================================================================
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
    try {
        if (!isGroup) return;
        if (!config.ANTI_LINK) return;
        
        // Check if bot is admin in the group
        let botIsAdmin = false;
        try {
            const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
            const { isAdmin: isBotAdmin } = await isAdmin(client, from, botNumber);
            botIsAdmin = isBotAdmin;
        } catch (err) {
            console.log('Error checking bot admin status:', err);
        }
        
        // If bot is not admin, do nothing (can't delete messages or kick)
        if (!botIsAdmin) return;
        
        // Check if sender is admin or owner
        if (isAdmins || isOwner) return;
        
        const linkRegex = /((https?:\/\/|www\.)[^\s]+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?)/gi;
        
        if (linkRegex.test(body)) {
            const mode = config.ANTILINK_MODE || 'delete';
            
            // Delete link silently first
            await client.sendMessage(from, { delete: message.key });
            
            // Extract clean username without special characters
            let cleanSender = sender.split('@')[0];
            
            if (mode === 'warn') {
                warningCount[sender] = (warningCount[sender] || 0) + 1;
                if (warningCount[sender] >= 3) {
                    // Send short kick message with mention
                    await client.sendMessage(from, {
                        text: `⚠️ @${cleanSender} has been kicked for sending links (3/3 warnings)`,
                        mentions: [sender]
                    });
                    await client.groupParticipantsUpdate(from, [sender], 'remove');
                    delete warningCount[sender];
                } else {
                    // Send short warning message with mention only
                    await client.sendMessage(from, {
                        text: `⚠️ @${cleanSender} Warning ${warningCount[sender]}/3 - Links are not allowed`,
                        mentions: [sender]
                    });
                }
            } else if (mode === 'kick') {
                // Send short kick message with mention
                await client.sendMessage(from, {
                    text: `⚠️ @${cleanSender} has been kicked for sending a link`,
                    mentions: [sender]
                });
                await client.groupParticipantsUpdate(from, [sender], 'remove');
            } else {
                // Delete mode - send short warning message with mention only
                await client.sendMessage(from, {
                    text: `⚠️ @${cleanSender} links are not allowed here`,
                    mentions: [sender]
                });
            }
        }
    } catch (error) {
        console.error("Anti-link error:", error);
    }
});

//==============================================================================
// ⚙️ LINK SHIELD CONTROL PANEL
//==============================================================================
cmd({
    pattern: "antilink",
    alias: ["linkshield", "shield"],
    desc: "Configure link protection system",
    category: "group",
    react: "🛡️",
    filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
    try {
        if (!isGroup) {
            return reply(`❌ This command works only in groups!`);
        }

        if (!isAdmins && !isOwner) {
            return reply(`❌ Admin only command!`);
        }

        const action = args[0]?.toLowerCase() || 'status';
        let statusText = "";
        let additionalInfo = "";

        switch (action) {
            case 'on':
                config.ANTI_LINK = true;
                statusText = "✅ LINK SHIELD ACTIVATED";
                additionalInfo = "All links will be monitored and blocked silently";
                break;
            case 'off':
                config.ANTI_LINK = false;
                statusText = "❌ LINK SHIELD DEACTIVATED";
                additionalInfo = "Links are now allowed in this group";
                break;
            case 'warn':
            case 'kick':
            case 'delete':
                config.ANTI_LINK = true;
                config.ANTILINK_MODE = action;
                statusText = `⚙️ Mode: ${action.toUpperCase()}`;
                additionalInfo = `Bot will ${action} users who send links`;
                break;
            default:
                statusText = `🛡️ LINK SHIELD: ${config.ANTI_LINK ? "ACTIVE ✅" : "INACTIVE ❌"}`;
                additionalInfo = `Mode: ${config.ANTILINK_MODE || 'delete'}\n\n📌 Commands:\n.antilink on/off\n.antilink warn/kick/delete`;
                break;
        }

        await reply(`🛡️ *LINK SHIELD*\n${statusText}\n📋 ${additionalInfo}`);

    } catch (error) {
        reply(`❌ Error: ${error.message}`);
    }
});