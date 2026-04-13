const { cmd } = require('../command');
const os = require('os');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["a", "status", "runtime", "uptime"],
    desc: "Check if bot is alive and running",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushname }) => {
    try {
        // Calculate uptime
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeString = `${hours}h ${minutes}m ${seconds}s`;
        
        // Get memory usage
        const usedMemory = (os.totalmem() - os.freemem()) / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        const memoryPercent = Math.round((usedMemory / totalMemory) * 100);
        
        // Get platform info
        const platform = os.platform();
        const nodeVersion = process.version;
        
        // Stylish alive message with config values
        const aliveText = 
`╔══════════════════════════════════════╗
║     🟢 ${config.BOT_NAME} IS ALIVE 🟢     
╠══════════════════════════════════════╣
║  🤖 BOT: ${config.BOT_NAME}              
║  📊 STATUS: ONLINE              
║  ⏰ UPTIME: ${uptimeString}${' '.repeat(18 - uptimeString.length)}║
╠══════════════════════════════════════╣
║  💻 PLATFORM: ${platform}${' '.repeat(17 - platform.length)}║
║  🧠 MEMORY: ${Math.round(usedMemory)}MB / ${Math.round(totalMemory)}MB (${memoryPercent}%)  ║
║  📦 NODE: ${nodeVersion}${' '.repeat(19 - nodeVersion.length)}║
╠══════════════════════════════════════╣
║  👤 USER: @${sender.split('@')[0]}${' '.repeat(16 - sender.split('@')[0].length)}║
╚══════════════════════════════════════╝

⚡ POWERED BY: ✨ ${config.BOT_NAME} ✨`;
        
        // Send with image and external ad reply
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/8a9abd.png' },
            caption: aliveText,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: `${config.BOT_NAME}`,
                    body: '✅ Bot is running smoothly',
                    thumbnailUrl: 'https://files.catbox.moe/8a9abd.png',
                    sourceUrl: 'https://github.com/binadnan',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } catch (e) {
        console.log("Alive Error:", e);
        reply(`❌ Error checking status!\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});