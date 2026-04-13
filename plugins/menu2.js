const { cmd, commands } = require("../command");
const config = require("../config");
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "menu2",
    alias: ["allmenu", "commands", "help2", "list"],
    desc: "Show all bot commands with categories",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, sender, isOwner }) => {
    try {
        // Get bot details from config
        const botName = config.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const ownerName = config.OWNER_NAME || "𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡";
        const prefix = config.PREFIX || ".";
        
        // Group commands by category
        const categories = {};
        
        commands.forEach((cmd) => {
            if (!cmd.pattern) return;
            
            const category = cmd.category || "uncategorized";
            if (!categories[category]) {
                categories[category] = [];
            }
            
            // Get command name (first alias or pattern)
            const cmdName = cmd.alias && cmd.alias[0] ? cmd.alias[0] : cmd.pattern;
            
            categories[category].push({
                name: cmdName,
                desc: cmd.desc || "No description",
                react: cmd.react || "📌"
            });
        });
        
        // Define category display names and icons
        const categoryIcons = {
            "main": "🏠",
            "group": "👥",
            "owner": "👑",
            "security": "🛡️",
            "download": "📥",
            "convert": "🔄",
            "fun": "🎮",
            "education": "📚",
            "tools": "🔧",
            "misc": "📦",
            "ai": "🤖",
            "uncategorized": "📁"
        };
        
        const categoryNames = {
            "main": "MAIN",
            "group": "GROUP",
            "owner": "OWNER",
            "security": "SECURITY",
            "download": "DOWNLOAD",
            "convert": "CONVERT",
            "fun": "FUN",
            "education": "EDUCATION",
            "tools": "TOOLS",
            "misc": "MISC",
            "ai": "AI",
            "uncategorized": "OTHER"
        };
        
        // Build menu text
        let totalCommands = 0;
        let menuText = `╔══════════════════════════════╗
║      📜 ${botName} 📜      ║
╠══════════════════════════════╣
║  👑 Owner: ${ownerName}
║  ⚡ Prefix: ${prefix}
║  📊 Total: ${commands.length} commands
╠══════════════════════════════╣
`;
        
        // Sort categories
        const sortedCategories = Object.keys(categories).sort();
        
        for (const category of sortedCategories) {
            const cmds = categories[category];
            const icon = categoryIcons[category] || "📌";
            const displayName = categoryNames[category] || category.toUpperCase();
            
            menuText += `
║  ${icon} ${displayName} (${cmds.length})
║  ──────────────────────────
`;
            
            cmds.forEach((cmd) => {
                menuText += `║  ${cmd.react} ${prefix}${cmd.name}
║     → ${cmd.desc}
`;
                totalCommands++;
            });
        }
        
        menuText += `
╠══════════════════════════════╣
║  💡 Tip: Use ${prefix}help <command>
║      for more details!
╠══════════════════════════════╣
║  ⚡ Powered by ${ownerName}
╚══════════════════════════════╝`;

        // Send menu with image
        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg" },
            caption: menuText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Menu2 command error:", error);
        
        // Fallback menu without image if error occurs
        const prefix = config.PREFIX || ".";
        const botName = config.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        
        let fallbackText = `📜 *${botName} MENU*\n\n`;
        fallbackText += `👑 Owner: ${config.OWNER_NAME || "Tyrex Tech"}\n`;
        fallbackText += `⚡ Prefix: ${prefix}\n`;
        fallbackText += `📊 Total: ${commands.length} commands\n\n`;
        
        const categories = {};
        commands.forEach((cmd) => {
            if (!cmd.pattern) return;
            const cat = cmd.category || "other";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.alias?.[0] || cmd.pattern);
        });
        
        for (const [cat, cmds] of Object.entries(categories)) {
            fallbackText += `┌─〔${cat.toUpperCase()}〕\n`;
            fallbackText += `│ ${cmds.map(c => prefix + c).join(", ")}\n`;
            fallbackText += `└───────────────────\n\n`;
        }
        
        fallbackText += `⚡ Powered by ${config.OWNER_NAME || "Tyrex Tech"}`;
        reply(fallbackText);
    }
});