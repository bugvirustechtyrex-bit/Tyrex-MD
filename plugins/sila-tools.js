const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs-extra');

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

// 1. BASE64 ENCODER/DECODER
cmd({
    pattern: "b64",
    alias: ["base64", "base64tool"],
    react: "🔢",
    desc: "Encode or decode Base64",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʙ64 ᴇɴᴄᴏᴅᴇ ʜᴇʟʟᴏ*
📌 *.ʙ64 ᴅᴇᴄᴏᴅᴇ aGVsbG8=*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const type = args[0].toLowerCase();
    const text = args.slice(1).join(' ');

    if (!text) return reply('❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴛᴏ ᴘʀᴏᴄᴇꜱꜱ');

    let result = '';
    let mode = '';

    if (type === 'encode' || type === 'enc') {
        result = Buffer.from(text).toString('base64');
        mode = 'ᴇɴᴄᴏᴅᴇᴅ';
    } else if (type === 'decode' || type === 'dec') {
        try {
            result = Buffer.from(text, 'base64').toString('utf-8');
            mode = 'ᴅᴇᴄᴏᴅᴇᴅ';
        } catch {
            return reply('❌ ɪɴᴠᴀʟɪᴅ ʙᴀꜱᴇ64 ꜱᴛʀɪɴɢ');
        }
    } else {
        return reply('❌ ᴜꜱᴇ *ᴇɴᴄᴏᴅᴇ* ᴏʀ *ᴅᴇᴄᴏᴅᴇ*');
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔢 ʙᴀꜱᴇ64 ᴛᴏᴏʟ 🔢
╚════════════════════╝

┌─── ✦﹒ɪɴᴘᴜᴛ﹒✦ ───┐
│ 📝 ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ʀᴇꜱᴜʟᴛ (${mode})﹒✦ ───┐
│ 💾 ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. JSON FORMATTER/PRETTIFIER
cmd({
    pattern: "json",
    alias: ["formatjson", "prettyjson"],
    react: "📋",
    desc: "Format and prettify JSON",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply, quoted}) => {
try{
    let jsonString = '';

    // Get JSON from quoted message or args
    if (m.quoted && m.quoted.message) {
        if (m.quoted.message.conversation) {
            jsonString = m.quoted.message.conversation;
        } else if (m.quoted.message.extendedTextMessage) {
            jsonString = m.quoted.message.extendedTextMessage.text;
        }
    } else {
        jsonString = args.join(' ');
    }

    if (!jsonString) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴊꜱᴏɴ {"name":"binadnan","age":25}*
📌 ʀᴇᴘʟʏ ᴛᴏ ᴊꜱᴏɴ ᴛᴇxᴛ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    try {
        const parsedJson = JSON.parse(jsonString);
        const prettyJson = JSON.stringify(parsedJson, null, 2);
        
        // Check if result is too long
        if (prettyJson.length > 4000) {
            return reply('❌ ᴊꜱᴏɴ ɪꜱ ᴛᴏᴏ ʟᴏɴɢ ᴛᴏ ᴅɪꜱᴘʟᴀʏ');
        }

        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   📋 ꜰᴏʀᴍᴀᴛᴛᴇᴅ ᴊꜱᴏɴ 📋
╚════════════════════╝

\`\`\`${prettyJson}\`\`\`

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (jsonError) {
        reply(`❌ ɪɴᴠᴀʟɪᴅ ᴊꜱᴏɴ: ${jsonError.message}`);
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 3. TEXT TO BINARY
cmd({
    pattern: "binary",
    alias: ["bin", "text2bin"],
    react: "0️⃣1️⃣",
    desc: "Convert text to binary",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʙɪɴᴀʀʏ ʜᴇʟʟᴏ ᴡᴏʀʟᴅ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const text = args.join(' ');
    
    // Convert to binary
    const binaryResult = text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   0️⃣1️⃣ ᴛᴇxᴛ ᴛᴏ ʙɪɴᴀʀʏ 0️⃣1️⃣
╚════════════════════╝

┌─── ✦﹒ᴛᴇxᴛ﹒✦ ───┐
│ 📝 ${text}
└────────────────────┘

┌─── ✦﹒ʙɪɴᴀʀʏ﹒✦ ───┐
│ 💾 ${binaryResult.substring(0, 200)}${binaryResult.length > 200 ? '...' : ''}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 4. BINARY TO TEXT
cmd({
    pattern: "frombin",
    alias: ["bin2text", "binarytotext"],
    react: "🔤",
    desc: "Convert binary to text",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ꜰʀᴏᴍʙɪɴ 01101000 01100101 01101100 01101100 01101111*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const binaryString = args.join(' ');
    
    // Remove spaces and validate
    const binaryArray = binaryString.split(' ');
    
    try {
        const textResult = binaryArray.map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');

        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔤 ʙɪɴᴀʀʏ ᴛᴏ ᴛᴇxᴛ 🔤
╚════════════════════╝

┌─── ✦﹒ʙɪɴᴀʀʏ﹒✦ ───┐
│ 0️⃣1️⃣ ${binaryString.substring(0, 50)}${binaryString.length > 50 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ᴛᴇxᴛ﹒✦ ───┐
│ 📝 ${textResult}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (binError) {
        reply('❌ ɪɴᴠᴀʟɪᴅ ʙɪɴᴀʀʏ ꜰᴏʀᴍᴀᴛ');
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 5. COLOR CONVERTER (HEX to RGB / RGB to HEX)
cmd({
    pattern: "color",
    alias: ["hex2rgb", "rgb2hex"],
    react: "🎨",
    desc: "Convert between HEX and RGB colors",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴄᴏʟᴏʀ #FF5733*  (ʜᴇx ᴛᴏ ʀɢʙ)
📌 *.ᴄᴏʟᴏʀ 255 87 51*  (ʀɢʙ ᴛᴏ ʜᴇx)

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    let input = args.join(' ');
    let result = '';
    let type = '';

    // Check if HEX (starts with #)
    if (input.startsWith('#')) {
        // HEX to RGB
        let hex = input.substring(1);
        
        // Handle 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        
        if (hex.length !== 6) {
            return reply('❌ ɪɴᴠᴀʟɪᴅ ʜᴇx ᴄᴏʟᴏʀ. ᴜꜱᴇ #RRGGBB ᴏʀ #RGB');
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        result = `ʀɢʙ(${r}, ${g}, ${b})`;
        type = 'ʜᴇx → ʀɢʙ';
    } 
    // Check if RGB (three numbers)
    else {
        const rgbMatch = input.match(/(\d+)\s+(\d+)\s+(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            // Validate RGB values
            if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
                return reply('❌ ʀɢʙ ᴠᴀʟᴜᴇꜱ ᴍᴜꜱᴛ ʙᴇ ʙᴇᴛᴡᴇᴇɴ 0-255');
            }
            
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
            result = hex;
            type = 'ʀɢʙ → ʜᴇx';
        } else {
            return reply('❌ ɪɴᴠᴀʟɪᴅ ꜰᴏʀᴍᴀᴛ. ᴜꜱᴇ #ʜᴇx ᴏʀ ʀ ɢ ʙ');
        }
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎨 ᴄᴏʟᴏʀ ᴄᴏɴᴠᴇʀᴛᴇʀ 🎨
╚════════════════════╝

┌─── ✦﹒ᴄᴏɴᴠᴇʀꜱɪᴏɴ﹒✦ ───┐
│ 🔄 ${type}
└────────────────────┘

┌─── ✦﹒ɪɴᴘᴜᴛ﹒✦ ───┐
│ 📥 ${input}
└────────────────────┘

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ 🎯 ${result}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 6. TEXT CASE CONVERTER
cmd({
    pattern: "case",
    alias: ["textcase", "convertcase"],
    react: "🔠",
    desc: "Convert text case (upper, lower, title, reverse)",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (args.length < 2) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴄᴀꜱᴇ ᴜᴘᴘᴇʀ ʜᴇʟʟᴏ*
📌 *.ᴄᴀꜱᴇ ʟᴏᴡᴇʀ ʜᴇʟʟᴏ*
📌 *.ᴄᴀꜱᴇ ᴛɪᴛʟᴇ ʜᴇʟʟᴏ ᴡᴏʀʟᴅ*
📌 *.ᴄᴀꜱᴇ ʀᴇᴠᴇʀꜱᴇ ʜᴇʟʟᴏ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const type = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    let result = '';
    let mode = '';

    switch(type) {
        case 'upper':
        case 'uppercase':
            result = text.toUpperCase();
            mode = 'ᴜᴘᴘᴇʀᴄᴀꜱᴇ';
            break;
        case 'lower':
        case 'lowercase':
            result = text.toLowerCase();
            mode = 'ʟᴏᴡᴇʀᴄᴀꜱᴇ';
            break;
        case 'title':
        case 'titlecase':
            result = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            mode = 'ᴛɪᴛʟᴇ ᴄᴀꜱᴇ';
            break;
        case 'reverse':
        case 'rev':
            result = text.split('').reverse().join('');
            mode = 'ʀᴇᴠᴇʀꜱᴇ';
            break;
        default:
            return reply('❌ ɪɴᴠᴀʟɪᴅ ᴛʏᴘᴇ. ᴜꜱᴇ: ᴜᴘᴘᴇʀ, ʟᴏᴡᴇʀ, ᴛɪᴛʟᴇ, ʀᴇᴠᴇʀꜱᴇ');
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔠 ᴛᴇxᴛ ᴄᴀꜱᴇ ᴄᴏɴᴠᴇʀᴛᴇʀ 🔠
╚════════════════════╝

┌─── ✦﹒ᴍᴏᴅᴇ﹒✦ ───┐
│ ⚙️ ${mode}
└────────────────────┘

┌─── ✦﹒ɪɴᴘᴜᴛ﹒✦ ───┐
│ 📥 ${text}
└────────────────────┘

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ 📤 ${result}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 7. CHARACTER COUNTER
cmd({
    pattern: "count",
    alias: ["charcount", "wordcount"],
    react: "🔢",
    desc: "Count characters, words, and lines in text",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply, quoted}) => {
try{
    let text = '';

    // Get text from quoted message or args
    if (m.quoted && m.quoted.message) {
        if (m.quoted.message.conversation) {
            text = m.quoted.message.conversation;
        } else if (m.quoted.message.extendedTextMessage) {
            text = m.quoted.message.extendedTextMessage.text;
        }
    } else {
        text = args.join(' ');
    }

    if (!text) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴄᴏᴜɴᴛ ʏᴏᴜʀ ᴛᴇxᴛ ʜᴇʀᴇ*
📌 ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ᴡɪᴛʜ *.ᴄᴏᴜɴᴛ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split('\n').length;
    const spaceCount = (text.match(/\s/g) || []).length;
    const numberCount = (text.match(/\d/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔢 ᴛᴇxᴛ ꜱᴛᴀᴛɪꜱᴛɪᴄꜱ 🔢
╚════════════════════╝

┌─── ✦﹒ʙᴀꜱɪᴄ﹒✦ ───┐
│ 📝 ᴄʜᴀʀᴀᴄᴛᴇʀꜱ: ${charCount}
│ 🔤 ᴄʜᴀʀꜱ (ɴᴏ ꜱᴘᴀᴄᴇ): ${charCountNoSpaces}
│ 📚 ᴡᴏʀᴅꜱ: ${wordCount}
│ 📏 ʟɪɴᴇꜱ: ${lineCount}
└────────────────────┘

┌─── ✦﹒ᴅᴇᴛᴀɪʟᴇᴅ﹒✦ ───┐
│ ␣ ꜱᴘᴀᴄᴇꜱ: ${spaceCount}
│ 🔢 ɴᴜᴍʙᴇʀꜱ: ${numberCount}
│ 🔤 ʟᴇᴛᴛᴇʀꜱ: ${letterCount}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 8. TIMESTAMP CONVERTER
cmd({
    pattern: "timestamp",
    alias: ["time2date", "unixtime"],
    react: "⏱️",
    desc: "Convert Unix timestamp to readable date",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴛɪᴍᴇꜱᴛᴀᴍᴘ 1678901234*
📌 *.ᴛɪᴍᴇꜱᴛᴀᴍᴘ ɴᴏᴡ* (ᴛᴏ ɢᴇᴛ ᴄᴜʀʀᴇɴᴛ)

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    let timestamp;
    
    if (args[0].toLowerCase() === 'now') {
        timestamp = Math.floor(Date.now() / 1000);
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ⏱️ ᴄᴜʀʀᴇɴᴛ ᴛɪᴍᴇꜱᴛᴀᴍᴘ ⏱️
╚════════════════════╝

┌─── ✦﹒ᴛɪᴍᴇꜱᴛᴀᴍᴘ﹒✦ ───┐
│ 🔢 ${timestamp}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        return;
    }

    // Check if timestamp is valid
    if (!/^\d+$/.test(args[0])) {
        return reply('❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ');
    }

    timestamp = parseInt(args[0]);
    
    // Check if timestamp is in seconds or milliseconds
    let date;
    if (timestamp > 1000000000000) {
        // Milliseconds
        date = new Date(timestamp);
    } else {
        // Seconds
        date = new Date(timestamp * 1000);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return reply('❌ ɪɴᴠᴀʟɪᴅ ᴛɪᴍᴇꜱᴛᴀᴍᴘ');
    }

    const formats = {
        'ᴜᴛᴄ': date.toUTCString(),
        'ʟᴏᴄᴀʟ': date.toLocaleString(),
        'ɪꜱᴏ': date.toISOString(),
        'ʏᴇᴀʀ': date.getFullYear(),
        'ᴍᴏɴᴛʜ': date.getMonth() + 1,
        'ᴅᴀʏ': date.getDate(),
        'ʜᴏᴜʀ': date.getHours(),
        'ᴍɪɴᴜᴛᴇ': date.getMinutes(),
        'ꜱᴇᴄᴏɴᴅ': date.getSeconds()
    };

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ⏱️ ᴛɪᴍᴇꜱᴛᴀᴍᴘ ᴄᴏɴᴠᴇʀᴛᴇʀ ⏱️
╚════════════════════╝

┌─── ✦﹒ɪɴᴘᴜᴛ﹒✦ ───┐
│ 🔢 ${timestamp}
└────────────────────┘

┌─── ✦﹒ᴄᴏɴᴠᴇʀᴛᴇᴅ﹒✦ ───┐
│ 🌍 ᴜᴛᴄ: ${formats['ᴜᴛᴄ']}
│ 🏠 ʟᴏᴄᴀʟ: ${formats['ʟᴏᴄᴀʟ']}
│ 📅 ɪꜱᴏ: ${formats['ɪꜱᴏ']}
└────────────────────┘

┌─── ✦﹒ʙʀᴇᴀᴋᴅᴏᴡɴ﹒✦ ───┐
│ 📆 ${formats['ʏᴇᴀʀ']}-${formats['ᴍᴏɴᴛʜ']}-${formats['ᴅᴀʏ']}
│ ⏰ ${formats['ʜᴏᴜʀ']}:${formats['ᴍɪɴᴜᴛᴇ']}:${formats['ꜱᴇᴄᴏɴᴅ']}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 9. HASH GENERATOR
cmd({
    pattern: "hash",
    alias: ["generatehash", "md5", "sha1", "sha256"],
    react: "🔐",
    desc: "Generate hash (MD5, SHA1, SHA256)",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (args.length < 2) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʜᴀꜱʜ ᴍᴅ5 ʜᴇʟʟᴏ*
📌 *.ʜᴀꜱʜ ꜱʜᴀ1 ʜᴇʟʟᴏ*
📌 *.ʜᴀꜱʜ ꜱʜᴀ256 ʜᴇʟʟᴏ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const crypto = require('crypto');
    const type = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    let hash = '';
    let algorithm = '';

    try {
        switch(type) {
            case 'md5':
                hash = crypto.createHash('md5').update(text).digest('hex');
                algorithm = 'ᴍᴅ5';
                break;
            case 'sha1':
                hash = crypto.createHash('sha1').update(text).digest('hex');
                algorithm = 'ꜱʜᴀ1';
                break;
            case 'sha256':
                hash = crypto.createHash('sha256').update(text).digest('hex');
                algorithm = 'ꜱʜᴀ256';
                break;
            default:
                return reply('❌ ᴜꜱᴇ: ᴍᴅ5, ꜱʜᴀ1, ᴏʀ ꜱʜᴀ256');
        }

        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔐 ʜᴀꜱʜ ɢᴇɴᴇʀᴀᴛᴏʀ 🔐
╚════════════════════╝

┌─── ✦﹒ᴀʟɢᴏʀɪᴛʜᴍ﹒✦ ───┐
│ ⚙️ ${algorithm}
└────────────────────┘

┌─── ✦﹒ɪɴᴘᴜᴛ﹒✦ ───┐
│ 📥 ${text}
└────────────────────┘

┌─── ✦﹒ʜᴀꜱʜ﹒✦ ───┐
│ 🔑 ${hash}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (hashError) {
        reply(`❌ ʜᴀꜱʜ ɢᴇɴᴇʀᴀᴛɪᴏɴ ꜰᴀɪʟᴇᴅ`);
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 10. UUID/GENERATOR
cmd({
    pattern: "uuid",
    alias: ["generateuuid", "guid"],
    react: "🆔",
    desc: "Generate random UUID/GUID",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const crypto = require('crypto');
    
    // Generate UUID v4
    const uuid = crypto.randomUUID();
    
    // Generate multiple UUIDs if requested
    let count = 1;
    if (args[0] && !isNaN(args[0])) {
        count = Math.min(parseInt(args[0]), 10); // Max 10 UUIDs
    }

    let uuidList = [];
    for (let i = 0; i < count; i++) {
        uuidList.push(crypto.randomUUID());
    }

    const uuidText = uuidList.join('\n');

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🆔 ᴜᴜɪᴅ ɢᴇɴᴇʀᴀᴛᴏʀ 🆔
╚════════════════════╝

┌─── ✦﹒ɢᴇɴᴇʀᴀᴛᴇᴅ﹒✦ ───┐
│ 📋 ${count} ᴜᴜɪᴅ(ꜱ) ɢᴇɴᴇʀᴀᴛᴇᴅ
└────────────────────┘

┌─── ✦﹒ᴜᴜɪᴅ(ꜱ)﹒✦ ───┐
│ 🔑 ${uuidText}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});