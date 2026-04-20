const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd , commands } = require('../command');

// Auto Reply Feature
cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner, sender }) => {
    try {
        const filePath = path.join(__dirname, '../assets/autoreply.json');
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error("❌ Auto Reply: autoreply.json file not found!");
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                if (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) {
                    // Reply with mention to the user who sent the message
                    await conn.sendMessage(from, {
                        text: `@${sender.split('@')[0]} ${data[text]}`,
                        mentions: [sender]
                    });
                }
            }
        }
    } catch (error) {
        console.error("❌ Auto Reply Error:", error);
    }
});

// Auto Reply Command to Toggle
cmd({
    pattern: "autoreply",
    alias: ["autores", "autorespond"],
    desc: "Toggle auto reply feature",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, isOwner, reply }) => {
    try {
        // Owner-only access
        if (!isOwner) {
            return await conn.sendMessage(from, {
                text: `❌ UNAUTHORIZED\n\nOnly the bot owner can use this command!`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }

        const action = args[0]?.toLowerCase();

        if (action === "on" || action === "enable") {
            config.AUTO_REPLY = true;
            await conn.sendMessage(from, {
                text: `✅ AUTO REPLY ENABLED\n\nAuto reply is now active.`
            }, { quoted: mek });
            await conn.sendMessage(from, {
                react: { text: "✅", key: mek.key }
            });
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_REPLY = false;
            await conn.sendMessage(from, {
                text: `❌ AUTO REPLY DISABLED\n\nAuto reply is now inactive.`
            }, { quoted: mek });
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
        } 
        else {
            // Show current status
            const currentStatus = (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) ? "ENABLED ✅" : "DISABLED ❌";
            await conn.sendMessage(from, {
                text: `🤖 AUTO REPLY STATUS\n\nCurrent Status: ${currentStatus}\n\n📌 Commands:\n.autoreply on - Enable\n.autoreply off - Disable`
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("❌ Auto Reply Command Error:", error);
        await conn.sendMessage(from, {
            text: `❌ ERROR\n\n${error.message}`
        }, { quoted: mek });
    }
});