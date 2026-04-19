const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const os = require('os');

// RAM stats
const getSystemStats = () => {
    const totalMem = os.totalmem() / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024;
    const usedMem = totalMem - freeMem;
    const memPercent = ((usedMem / totalMem) * 100).toFixed(0);

    const barLength = 20;
    const filled = Math.floor((memPercent / 100) * barLength);
    const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

    return {
        totalMem: totalMem.toFixed(2),
        usedMem: usedMem.toFixed(2),
        memPercent,
        ramBar: bar,
        platform: os.platform(),
        arch: os.arch(),
        cpuCores: os.cpus().length
    };
};

// count plugins
const countPlugins = () => {
    const dir = path.join(__dirname, '../plugins');
    try {
        return fs.readdirSync(dir).filter(f => f.endsWith('.js')).length;
    } catch {
        return 0;
    }
};

// scan commands (safe version)
const scanPlugins = () => {
    const dir = path.join(__dirname, '../plugins');
    const categories = {};

    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            if (!file.endsWith('.js')) return;

            const content = fs.readFileSync(path.join(dir, file), 'utf8');

            const regex = /cmd\(\s*{\s*pattern:\s*["']([^"']+)["'][\s\S]*?category:\s*["']([^"']+)["']/g;

            let match;
            while ((match = regex.exec(content)) !== null) {
                const cmdName = match[1];
                const category = match[2].toLowerCase();

                if (!categories[category]) categories[category] = [];

                categories[category].push({ pattern: cmdName });
            }
        });

    } catch (e) {
        console.log(e);
    }

    return categories;
};

// Get current date
const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

cmd({
    pattern: "menu",
    alias: ["help", "cmds"],
    react: "📋",
    desc: "Menu list",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {

        const stats = getSystemStats();
        const plugins = countPlugins();
        const categories = scanPlugins();
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        // Count total commands
        let totalCommands = 0;
        Object.keys(categories).forEach(cat => {
            totalCommands += categories[cat].length;
        });

        // Format RAM display (usedMB / totalMB)
        const ramDisplay = `${stats.usedMem}MB / ${stats.totalMem}MB`;

        let text = `┌─▣ ◈ *${config.BOT_NAME} MENU* ◈ ┣▣
▣ ✪ Owner: TYREX TECH
▣ ✪ Tech: TYREX 
▣ ✪ Baileys: MULTI DEVICE
▣ ✪ Date: ${getCurrentDate()}
▣ ✪ Type: NODEJS
▣ ✪ Runtime: ${days}d ${hours}h ${minutes}m
▣ ✪ Prefix: ${config.PREFIX}
▣ ✪ Mode: ${config.MODE || "PUBLIC"}
▣ ✪ RAM: ${ramDisplay}
▣ ✪ Total Commands: ${totalCommands}
▣ ✪ Status: ONLINE
└─▣`;

        const sorted = Object.keys(categories).sort();

        for (let cat of sorted) {
            if (!categories[cat].length) continue;

            text += `\n\n┌─▣ ◈ *${cat.toUpperCase()}* ◈ ┣▣\n`;

            categories[cat].forEach(c => {
                text += `▣ ✪ ${config.PREFIX}${c.pattern}\n`;
            });

            text += `└─▣`;
        }

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg" },
            caption: text
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, {
            text: "❌ Menu error!"
        }, { quoted: mek });
    }
});