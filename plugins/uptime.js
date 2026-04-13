const { cmd } = require("../command");
const os = require("os");
const config = require("../config");

// Store bot start time
const startTime = Date.now();

// Function to format uptime
function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    
    return parts.join(', ');
}

// Get system info
function getSystemInfo() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        cpuCores: os.cpus().length,
        totalMemory: (os.totalmem() / (1024 ** 3)).toFixed(2),
        freeMemory: (os.freemem() / (1024 ** 3)).toFixed(2),
        usedMemory: ((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2),
        memoryUsagePercent: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(1),
        hostname: os.hostname(),
        loadAverage: os.loadavg().map(load => load.toFixed(2))
    };
}

cmd({
    pattern: "uptime",
    alias: ["runtime", "status", "alive"],
    desc: "Check bot uptime and system status",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const uptimeMs = Date.now() - startTime;
        const uptimeString = formatUptime(uptimeMs);
        const sysInfo = getSystemInfo();
        
        const uptimeMessage = `╭───⦁ 『 𝐔𝐏𝐓𝐈𝐌𝐄 𝐒𝐓𝐀𝐓𝐔𝐒 』
│
├─⦁ 🤖 *Bot Name:* ${config.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃"}
├─⦁ ⏱️ *Uptime:* ${uptimeString}
├─⦁ 🕐 *Started:* ${new Date(startTime).toLocaleString()}
├─⦁ 🟢 *Status:* Online
│
├─⦁ *💻 System Information:*
├─⦁ 🖥️ *Platform:* ${sysInfo.platform}
├─⦁ 🔧 *Architecture:* ${sysInfo.arch}
├─⦁ 🧠 *CPU Cores:* ${sysInfo.cpuCores}
├─⦁ 💾 *Total RAM:* ${sysInfo.totalMemory} GB
├─⦁ 📊 *Used RAM:* ${sysInfo.usedMemory} GB (${sysInfo.memoryUsagePercent}%)
├─⦁ 🟢 *Free RAM:* ${sysInfo.freeMemory} GB
│
├─⦁ *📈 Performance:*
├─⦁ ⚡ *Load Average:* ${sysInfo.loadAverage.join(', ')}
│
╰───⦁ *Powered by ${config.OWNER_NAME || "Tyrex Tech"}*

> _Bot is running smoothly!_ 🚀`;

        await reply(uptimeMessage);
        
    } catch (error) {
        console.error("Uptime command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});