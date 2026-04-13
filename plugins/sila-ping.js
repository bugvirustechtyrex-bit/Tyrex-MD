const { cmd } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot speed",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    try {
        const start = Date.now();

        // send temporary message
        const msg = await conn.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: mek });

        const end = Date.now();

        const speed = end - start;
        const uptime = process.uptime().toFixed(0);
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        let response = `
╭━━━〔 🏓 PING STATUS 〕━━━╮
┃ ⚡ Speed   : ${speed} ms
┃ ⏱️ Uptime : ${uptime}s
┃ 💾 RAM    : ${ram} MB
╰━━━━━━━━━━━━━━━━━━━━━━━╯

✅ Bot is running smoothly!
`;

        // edit message (clean result)
        await conn.sendMessage(from, { text: response }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
