const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "ch",
    alias: ["chreact", "bomb", "channelreact"],
    react: "🚀",
    desc: "Send a specific number of reactions to a channel message",
    category: "owner",
    use: '.ch <link> <emoji> <number>',
    filename: __filename
},
async (conn, mek, m, { from, q, isCreator, reply, command }) => {
    const botName = config.BOT_NAME;
    
    try {
        // 1. Security Check
        if (!isCreator) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 This power is for the Owner only.
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        // 2. Parse the Input (Split by space)
        const args = q.trim().split(/\s+/);
        if (args.length < 3) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ MISSING INFORMATION
┣▣
┣▣ 📋 Format: *.${command} <link> <emoji> <count>*
┣▣ 📌 Example: *.${command} https://whatsapp.com/channel/xxx/123 🔥 50*
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        const link = args[0];
        const emoji = args[1];
        const count = parseInt(args[2]);

        // 3. Validation Logic
        if (!link.includes("whatsapp.com/channel/")) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID LINK
┣▣ 📋 That doesn't look like a valid WhatsApp Channel link.
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        if (isNaN(count) || count <= 0) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID NUMBER
┣▣ 📋 Please provide a valid number (e.g., 100).
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        if (count > 500) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ SAFETY LIMIT
┣▣ 📋 Please keep it under 500 to avoid account bans.
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        // 4. Extract IDs from the Link
        const linkParts = link.split('/');
        const channelId = linkParts[4];
        const messageId = linkParts[5];

        if (!channelId || !messageId) {
            return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ LINK ERROR
┣▣ 📋 Could not find the Channel or Message ID.
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }

        // 5. Get Channel Metadata (Internal ID)
        const channelMeta = await conn.newsletterMetadata("invite", channelId);

        // Let the user know the process has started
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🚀 STARTING REACTION BOMB
┣▣
┣▣ 📋 Target: ${channelMeta.name || channelId}
┣▣ 😀 Emoji: ${emoji}
┣▣ 🔢 Amount: ${count}
┣▣
┣▣ ⏳ Processing...
┣▣
┣▣ ⚡ ${botName}
┗▣`);

        // 6. The Execution Loop
        let successCount = 0;
        for (let i = 1; i <= count; i++) {
            try {
                await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);
                successCount++;
                // This 300ms pause keeps the bot "under the radar" of WhatsApp's spam filters
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (err) {
                console.error(`Reaction ${i} failed:`, err);
            }
        }

        // 7. Success Notification
        return reply(`┏▣ ◈ *${botName}* ◈
┣▣ ✅ REACTION BOMB COMPLETED
┣▣
┣▣ 📋 Target: ${channelMeta.name || channelId}
┣▣ 😀 Emoji: ${emoji}
┣▣ 🔢 Sent: ${successCount}/${count} reactions
┣▣
┣▣ ⚡ ${botName}
┗▣`);

    } catch (e) {
        console.error(e);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ SYSTEM ERROR
┣▣ 📋 ${e.message || "Operation failed."}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});