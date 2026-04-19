const { cmd } = require('../command');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up", "uptime3"],
    react: "⏳",
    desc: "Show bot uptime and system status",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender }) => {
    try {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        // Create progress bar (based on uptime seconds)
        const barLength = 20;
        const maxUptime = 86400; // 24 hours as reference
        const filled = Math.min(Math.floor((uptime / maxUptime) * barLength), barLength);
        const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
        
        // Get memory usage
        const usedMemory = (os.totalmem() - os.freemem()) / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        const memoryPercent = Math.round((usedMemory / totalMemory) * 100);
        
        // Get CPU info
        const cpuCores = os.cpus().length;
        const cpuModel = os.cpus()[0].model.substring(0, 30);
        
        // Format uptime string
        let uptimeString = "";
        if (days > 0) uptimeString += `${days}d `;
        if (hours > 0) uptimeString += `${hours}h `;
        if (minutes > 0) uptimeString += `${minutes}m `;
        uptimeString += `${seconds}s`;
        
        const response = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⏳ SYSTEM UPTIME
┣▣
┣▣ 📊 Uptime: ${uptimeString}
┣▣ 📈 Progress: [${bar}] ${Math.round((uptime / maxUptime) * 100)}%
┣▣
┣▣ 💾 RAM: ${usedMemory.toFixed(1)}MB / ${totalMemory.toFixed(0)}MB (${memoryPercent}%)
┣▣ 🧠 CPU: ${cpuCores} cores
┣▣ 💻 Model: ${cpuModel}...
┣▣
┣▣ 🟢 Status: ONLINE & STABLE
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

        await conn.sendMessage(from, { text: response }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 Uptime error!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`
        }, { quoted: mek });
    }
});