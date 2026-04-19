const { cmd } = require('../command');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "system",
    alias: ["sys", "status"],
    desc: "Show full system info",
    category: "main",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {

        const start = Date.now();

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const mem = process.memoryUsage();
        const ramUsed = (mem.heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = (mem.heapTotal / 1024 / 1024).toFixed(2);
        const rss = (mem.rss / 1024 / 1024).toFixed(2);

        const speed = Date.now() - start;

        const cpuModel = os.cpus()[0].model;
        const cpuCount = os.cpus().length;
        const load = os.loadavg();

        let response = `
┏▣ ◈ *${config.BOT_NAME} SYSTEM PANEL* ◈
||
|| ⚡ *Speed* : ${speed} ms
|| ⏱️ *Uptime* : ${hours}h ${minutes}m ${seconds}s
||
|| 💾 *RAM Used* : ${ramUsed} MB
|| 💾 *RAM Total* : ${ramTotal} MB
|| 📦 *RSS Memory* : ${rss} MB
||
|| 🖥️ *Platform* : ${process.platform}
|| 📟 *Node* : ${process.version}
|| 🧠 *Arch* : ${process.arch}
||
|| ⚙️ *CPU Model* : ${cpuModel}
|| 🔢 *CPU Cores* : ${cpuCount}
|| 📊 *Load Avg* : ${load[0].toFixed(2)} ${load[1].toFixed(2)} ${load[2].toFixed(2)}
||
┗▣
        `.trim();

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg" },
            caption: response
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, {
            text: "❌ System error!"
        }, { quoted: mek });
    }
});