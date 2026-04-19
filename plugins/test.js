const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "test",
    desc: "System test info",
    category: "main",
    react: "🧪",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {

        const start = Date.now();

        const uptime = process.uptime();
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpu = os.cpus().length;

        const end = Date.now();
        const speed = end - start;

        const text = `
┏▣ ◈ *${process.env.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃"}* ◈
┣▣ *Speed* : ${speed} ms
┣▣ *Uptime* : ${Math.floor(uptime)} sec
┣▣ *RAM* : ${ram} MB
┣▣ *CPU* : ${cpu} cores
┣▣ *Platform* : ${os.platform()}
┗▣
        `;

        await conn.sendMessage(from, { text }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ Error: ${e.message}`
        }, { quoted: mek });
    }
});