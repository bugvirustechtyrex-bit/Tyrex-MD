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
        
        const aliveText = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 BOT: ${config.BOT_NAME}
┣▣ 📊 STATUS: ONLINE
┣▣ ⏰ UPTIME: ${uptimeString}
┣▣ 💻 PLATFORM: ${platform}
┣▣ 🧠 MEMORY: ${Math.round(usedMemory)}MB / ${Math.round(totalMemory)}MB (${memoryPercent}%)
┣▣ 📦 NODE: ${nodeVersion}
┣▣ 👤 USER: @${sender.split('@')[0]}
┣▣
┣▣ ⚡ POWERED BY ${config.BOT_NAME}
┗▣`;
        
        // Send with image from your link
        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg' },
            caption: aliveText,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: `${config.BOT_NAME}`,
                    body: '✅ Bot is running smoothly',
                    thumbnailUrl: 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg',
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