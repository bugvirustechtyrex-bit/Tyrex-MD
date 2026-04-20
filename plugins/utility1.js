const { cmd } = require('../command');
const os = require('os');
const si = require('systeminformation');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

// Fake vCard kwa ajili ya owner
const ownerVcard = (ownerName, ownerNumber) => {
    return 'BEGIN:VCARD\n' +
           'VERSION:3.0\n' +
           `FN:${ownerName}\n` +
           `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n` +
           'END:VCARD';
};

// 1. PING COMMAND
cmd({
    pattern: "ping2",
    alias: ["pong", "latency"],
    react: "📶",
    desc: "Check bot response speed",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, startTime}) => {
    try{
        const start = Date.now();
        
        const response = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📶 PING RESULT
┣▣
┣▣ 📡 Response: ${Date.now() - start} ms
┣▣ ⚡ Latency: ${Math.round((Date.now() - start) / 2)} ms
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;
        
        await conn.sendMessage(from, { text: response, contextInfo: getContextInfo({ sender: sender }) }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// 2. ALIVE COMMAND
cmd({
    pattern: "alive2",
    alias: ["test2", "status"],
    react: "💚",
    desc: "Check if bot is alive",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const memoryUsage = process.memoryUsage();
        const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 💚 BOT IS ALIVE
┣▣
┣▣ 📊 SYSTEM STATUS
┣▣ ⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
┣▣ 📊 RSS: ${rss} MB
┣▣ 📦 Heap: ${heapUsed}/${heapTotal} MB
┣▣
┣▣ ℹ️ INFO
┣▣ 🤖 Bot: ${config.BOT_NAME}
┣▣ 🚀 Status: ONLINE ✅
┣▣ 📅 Date: ${new Date().toLocaleDateString()}
┣▣ ⏱️ Time: ${new Date().toLocaleTimeString()}
┣▣
┣▣ 💫 *READY TO SERVE YOU!*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// 3. OWNER COMMAND (WITH VCARD)
cmd({
    pattern: "owner2",
    alias: ["creator", "developer", "dev"],
    react: "👑",
    desc: "Get owner information",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const ownerName = config.OWNER_NAME || "Tyrex Tech";
        const ownerNumber = config.OWNER_NUMBER || "255628378557";
        
        const vcard = 'BEGIN:VCARD\n' +
                     'VERSION:3.0\n' +
                     `FN:${ownerName}\n` +
                     `ORG:${config.BOT_NAME} TECH\n` +
                     `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n` +
                     'EMAIL:tyrex@gmail.com\n' +
                     'URL:https://github.com/binadnan\n' +
                     'NOTE:Bot Developer | Creator\n' +
                     'X-SOCIAL:GitHub:https://github.com/binadnan\n' +
                     'END:VCARD';

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 👑 OWNER INFO
┣▣
┣▣ 📋 CONTACT INFO
┣▣ 🤵 NAME: ${ownerName}
┣▣ 📞 NUMBER: wa.me/${ownerNumber}
┣▣ 🎭 ROLE: Developer
┣▣
┣▣ 📧 CONTACT DETAILS
┣▣ 📧 EMAIL: tyrex@gmail.com
┣▣ 🌐 GITHUB: github.com/binadnan
┣▣ 💬 TELEGRAM: @tyrextech
┣▣
┣▣ 📌 Click the contact card below to save
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Send vCard contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// 4. UPTIME COMMAND
cmd({
    pattern: "uptime2",
    alias: ["runtime", "online"],
    react: "⏰",
    desc: "Check bot uptime",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const platform = os.platform();
        const arch = os.arch();
        const cpuCores = os.cpus().length;
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const hostname = os.hostname();
        const cpuModel = os.cpus()[0].model;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⏰ BOT UPTIME
┣▣
┣▣ 📊 TIME STATS
┣▣ 📅 Days: ${days}
┣▣ 🕐 Hours: ${hours}
┣▣ ⏱️ Minutes: ${minutes}
┣▣ ⏲️ Seconds: ${seconds}
┣▣
┣▣ 💻 SYSTEM INFO
┣▣ 💻 Platform: ${platform} ${arch}
┣▣ 🖥️ Hostname: ${hostname}
┣▣ ⚙️ CPU: ${cpuModel.substring(0, 30)}...
┣▣ 🧠 Cores: ${cpuCores}
┣▣ 💾 RAM: ${usedMem}GB / ${totalMem}GB
┣▣
┣▣ ⏳ Total Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// 5. RUNTIME COMMAND (Detailed)
cmd({
    pattern: "runtime",
    alias: ["run", "rt"],
    react: "⚙️",
    desc: "Detailed bot runtime information",
    category: "utility",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
    try{
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const runtimeString = [];
        if (days > 0) runtimeString.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) runtimeString.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) runtimeString.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0 || runtimeString.length === 0) runtimeString.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
        const formattedRuntime = runtimeString.join(', ');

        const startTime = new Date(Date.now() - (uptime * 1000));
        const startDateStr = startTime.toLocaleDateString();
        const startTimeStr = startTime.toLocaleTimeString();

        const memoryUsage = process.memoryUsage();
        const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const external = (memoryUsage.external / 1024 / 1024).toFixed(2);

        const cpuUsage = os.loadavg();
        const loadAvg1 = cpuUsage[0].toFixed(2);
        const loadAvg5 = cpuUsage[1].toFixed(2);
        const loadAvg15 = cpuUsage[2].toFixed(2);

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚙️ RUNTIME DETAILS
┣▣
┣▣ ⏱️ TIMELINE
┣▣ 🟢 Started: ${startDateStr} ${startTimeStr}
┣▣ 🔴 Current: ${new Date().toLocaleString()}
┣▣ ⏳ Total: ${formattedRuntime}
┣▣
┣▣ 📊 MEMORY USAGE
┣▣ 📊 RSS: ${rss} MB
┣▣ 📦 Heap Total: ${heapTotal} MB
┣▣ 📦 Heap Used: ${heapUsed} MB
┣▣ 🔌 External: ${external} MB
┣▣
┣▣ 💻 CPU LOAD
┣▣ ⏱️ 1 min: ${loadAvg1}
┣▣ ⏱️ 5 min: ${loadAvg5}
┣▣ ⏱️ 15 min: ${loadAvg15}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});