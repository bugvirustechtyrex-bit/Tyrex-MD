const { cmd } = require('../command');
const os = require('os');
const si = require('systeminformation');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
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
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📶 ᴄʜᴇᴄᴋɪɴɢ... 📶
╚════════════════════╝

▸ ᴍᴇᴀꜱᴜʀɪɴɢ ʟᴀᴛᴇɴᴄʏ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    const end = Date.now();
    const responseTime = end - start;
    const latency = Math.round(responseTime / 2); // Approximate server latency
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📊 ᴘɪɴɢ ʀᴇꜱᴜʟᴛ 📊
╚════════════════════╝

┌─── ✦﹒ʀᴇꜱᴘᴏɴꜱᴇ﹒✦ ───┐
│ 📡 ʀᴇꜱᴘᴏɴꜱᴇ: ${responseTime}ᴍꜱ
│ ⚡ ʟᴀᴛᴇɴᴄʏ: ${latency}ᴍꜱ
└────────────────────┘

📶 ʙᴏᴛ ɪꜱ ᴀᴄᴛɪᴠᴇ ᴀɴᴅ ꜰᴀꜱᴛ! 🚀

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. ALIVE COMMAND
cmd({
    pattern: "alive2",
    alias: ["test", "status"],
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
        text: `╔════════════════════╗
║   💚 ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ 💚
╚════════════════════╝

┌─── ✦﹒ꜱʏꜱᴛᴇᴍ﹒✦ ───┐
│ ⏰ ᴜᴘᴛɪᴍᴇ: ${hours}ʜ ${minutes}ᴍ ${seconds}ꜱ
│ 📊 ʀꜱꜱ: ${rss} MB
│ 📦 ʜᴇᴀᴘ: ${heapUsed}/${heapTotal} MB
└────────────────────┘

┌─── ✦﹒ɪɴꜰᴏ﹒✦ ───┐
│ 🤖 ʙᴏᴛ: ʙɪɴ-ᴀᴅɴᴀɴ
│ 🚀 ꜱᴛᴀᴛᴜꜱ: ᴏɴʟɪɴᴇ ✅
│ 📅 ᴅᴀᴛᴇ: ${new Date().toLocaleDateString()}
│ ⏱️ ᴛɪᴍᴇ: ${new Date().toLocaleTimeString()}
└────────────────────┘

> 💫 *ʀᴇᴀᴅʏ ᴛᴏ ꜱᴇʀᴠᴇ ʏᴏᴜ!*

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
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
    const ownerName = "BIN-ADNAN"; // Badilisha na jina lako
    const ownerNumber = "2557XXXXXXXX"; // Badilisha na namba yako (bila +)
    
    const vcard = 'BEGIN:VCARD\n' +
                  'VERSION:3.0\n' +
                  `FN:${ownerName}\n` +
                  'ORG:ʙɪɴ-ᴀᴅɴᴀɴ ᴛᴇᴄʜ\n' +
                  `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n` +
                  'EMAIL:binadnan@gmail.com\n' +
                  'URL:https://github.com/binadnan\n' +
                  'NOTE:ʙᴏᴛ ᴅᴇᴠᴇʟᴏᴘᴇʀ | ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴏʀ\n' +
                  'X-SOCIAL:GitHub:https://github.com/binadnan\n' +
                  'X-SOCIAL:Telegram:@binadnan\n' +
                  'END:VCARD';
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   👑 ᴏᴡɴᴇʀ ɪɴꜰᴏ 👑
╚════════════════════╝

┌─── ✦﹒ᴀʙᴏᴜᴛ﹒✦ ───┐
│ 🤵 *ɴᴀᴍᴇ:* ${ownerName}
│ 📞 *ɴᴜᴍʙᴇʀ:* wa.me/${ownerNumber}
│ 🏷️ *ʀᴏʟᴇ:* ᴅᴇᴠᴇʟᴏᴘᴇʀ
└────────────────────┘

┌─── ✦﹒ᴄᴏɴᴛᴀᴄᴛ﹒✦ ───┐
│ 📧 ᴇᴍᴀɪʟ: binadnan@gmail.com
│ 🌐 ɢɪᴛʜᴜʙ: github.com/binadnan
│ 💬 ᴛᴇʟᴇɢʀᴀᴍ: @binadnan
└────────────────────┘

▸ ᴄʟɪᴄᴋ ᴛʜᴇ ᴄᴏɴᴛᴀᴄᴛ ᴄᴀʀᴅ ʙᴇʟᴏᴡ ᴛᴏ ꜱᴀᴠᴇ

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
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
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
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
    const uptimeSeconds = process.uptime();
    const uptime = process.uptime();
    
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    // System information
    const platform = os.platform();
    const arch = os.arch();
    const cpuCores = os.cpus().length;
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const hostname = os.hostname();
    
    // Get CPU info
    const cpuModel = os.cpus()[0].model;
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ⏰ ʙᴏᴛ ᴜᴘᴛɪᴍᴇ ⏰
╚════════════════════╝

┌─── ✦﹒ᴛɪᴍᴇ﹒✦ ───┐
│ 📅 ᴅᴀʏꜱ: ${days}
│ 🕐 ʜᴏᴜʀꜱ: ${hours}
│ ⏱️ ᴍɪɴᴜᴛᴇꜱ: ${minutes}
│ ⏲️ ꜱᴇᴄᴏɴᴅꜱ: ${seconds}
└────────────────────┘

┌─── ✦﹒ꜱʏꜱᴛᴇᴍ﹒✦ ───┐
│ 💻 ᴘʟᴀᴛꜰᴏʀᴍ: ${platform} ${arch}
│ 🖥️ ʜᴏꜱᴛ: ${hostname}
│ ⚙️ ᴄᴘᴜ: ${cpuModel.substring(0, 30)}...
│ 🧠 ᴄᴏʀᴇꜱ: ${cpuCores}
│ 💾 ʀᴀᴍ: ${usedMem}GB / ${totalMem}GB
└────────────────────┘

⏳ ᴛᴏᴛᴀʟ ᴜᴘᴛɪᴍᴇ: ${days}d ${hours}h ${minutes}m ${seconds}s

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
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
    
    // Format runtime string
    const runtimeString = [];
    if (days > 0) runtimeString.push(`${days} ᴅᴀʏ${days > 1 ? 'ꜱ' : ''}`);
    if (hours > 0) runtimeString.push(`${hours} ʜᴏᴜʀ${hours > 1 ? 'ꜱ' : ''}`);
    if (minutes > 0) runtimeString.push(`${minutes} ᴍɪɴᴜᴛᴇ${minutes > 1 ? 'ꜱ' : ''}`);
    if (seconds > 0 || runtimeString.length === 0) runtimeString.push(`${seconds} ꜱᴇᴄᴏɴᴅ${seconds > 1 ? 'ꜱ' : ''}`);
    
    const formattedRuntime = runtimeString.join(', ');
    
    // Get more detailed metrics
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
        text: `╔════════════════════╗
║   ⚙️ ʀᴜɴᴛɪᴍᴇ ᴅᴇᴛᴀɪʟꜱ ⚙️
╚════════════════════╝

┌─── ✦﹒ᴛɪᴍᴇʟɪɴᴇ﹒✦ ───┐
│ 🟢 ꜱᴛᴀʀᴛᴇᴅ: ${startDateStr} ${startTimeStr}
│ 🔴 ᴄᴜʀʀᴇɴᴛ: ${new Date().toLocaleString()}
│ ⏳ ᴛᴏᴛᴀʟ: ${formattedRuntime}
└────────────────────┘

┌─── ✦﹒ᴍᴇᴍᴏʀʏ﹒✦ ───┐
│ 📊 ʀꜱꜱ: ${rss} MB
│ 📦 ʜᴇᴀᴘ ᴛᴏᴛᴀʟ: ${heapTotal} MB
│ 📌 ʜᴇᴀᴘ ᴜꜱᴇᴅ: ${heapUsed} MB
│ 🔌 ᴇxᴛᴇʀɴᴀʟ: ${external} MB
└────────────────────┘

┌─── ✦﹒ᴄᴘᴜ ʟᴏᴀᴅ﹒✦ ───┐
│ ⏱️ 1 ᴍɪɴ: ${loadAvg1}
│ ⏱️ 5 ᴍɪɴ: ${loadAvg5}
│ ⏱️ 15 ᴍɪɴ: ${loadAvg15}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});