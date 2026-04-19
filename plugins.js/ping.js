const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "latency"],
    desc: "Check bot speed",
    category: "main",
    react: "❤️",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const start = Date.now();
        
        // Tuma ujumbe wa kwanza (processing)
        const msg = await conn.sendMessage(from, { text: "⏳" }, { quoted: mek });
        
        const end = Date.now();
        const speed = end - start;
        
        const response = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❤️ PING RESULT
┣▣
┣▣ ⚡ Speed: ${speed} ms
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
        
        // Badilisha ujumbe uliopita
        await conn.sendMessage(from, { text: response, edit: msg.key });

    } catch (e) {
        console.log(e);
        
        // Fallback kama edit haifanyi kazi
        const end = Date.now();
        const speed = end - start;
        
        await conn.sendMessage(from, { 
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❤️ PING RESULT
┣▣
┣▣ ⚡ Speed: ${speed} ms
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`
        }, { quoted: mek });
    }
});