const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs-extra');
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

// ==============================================
// 1. BASE64 ENCODER/DECODER
// ==============================================
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
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.b64 encode hello world
┣▣ 📌 *.b64 decode aGVsbG8gd29ybGQ=
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const type = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        if (!text) return reply('❌ Please provide text to process');

        let result = '';
        let mode = '';

        if (type === 'encode' || type === 'enc') {
            result = Buffer.from(text).toString('base64');
            mode = 'ENCODED';
        } else if (type === 'decode' || type === 'dec') {
            try {
                result = Buffer.from(text, 'base64').toString('utf-8');
                mode = 'DECODED';
            } catch {
                return reply('❌ Invalid Base64 string');
            }
        } else {
            return reply('❌ Use *encode* or *decode*');
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔢 BASE64 TOOL
┣▣
┣▣ 📋 INPUT: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}
┣▣ 📋 RESULT (${mode}): ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 2. JSON FORMATTER/PRETTIFIER
// ==============================================
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

        if (m.quoted && m.quoted.message) {
            if (m.quoted.message.conversation) {
                jsonString = m.quoted.message.conversation;
            } else if (m.quoted.message.extendedTextMessage) {
                jsonString = m.quoted.message.extendedTextMessage.text;
            }
        } else {
            jsonString = args.join(' ');
        }

        if (!jsonString) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.json {"name":"tyrex","age":25}
┣▣ 📌 Reply to JSON message with *.json*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        try {
            const parsedJson = JSON.parse(jsonString);
            const prettyJson = JSON.stringify(parsedJson, null, 2);

            if (prettyJson.length > 4000) {
                return reply('❌ JSON is too long to display');
            }

            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📋 FORMATTED JSON
┣▣
┣▣ \`\`\`${prettyJson}\`\`\`
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } catch (jsonError) {
            reply(`❌ Invalid JSON: ${jsonError.message}\n\n⚡ ${config.BOT_NAME} ✨`);
        }
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 3. TEXT TO BINARY
// ==============================================
cmd({
    pattern: "binary",
    alias: ["bin", "text2bin"],
    react: "01",
    desc: "Convert text to binary",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
    try{
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.binary hello world
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const text = args.join(' ');
        const binaryResult = text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 01 TEXT TO BINARY
┣▣
┣▣ 📋 INPUT: ${text}
┣▣ 📋 BINARY: ${binaryResult.substring(0, 200)}${binaryResult.length > 200 ? '...' : ''}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 4. BINARY TO TEXT
// ==============================================
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
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.frombin 01101000 01100101 01101100 01101100 01101111
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const binaryString = args.join(' ');
        const binaryArray = binaryString.split(' ');

        try {
            const textResult = binaryArray.map(bin => {
                return String.fromCharCode(parseInt(bin, 2));
            }).join('');

            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔤 BINARY TO TEXT
┣▣
┣▣ 📋 BINARY: ${binaryString.substring(0, 50)}${binaryString.length > 50 ? '...' : ''}
┣▣ 📋 TEXT: ${textResult}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } catch (binError) {
            reply('❌ Invalid binary format\n\n⚡ ${config.BOT_NAME} ✨');
        }
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 5. COLOR CONVERTER (HEX to RGB / RGB to HEX)
// ==============================================
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
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.color #FF5733 (HEX to RGB)
┣▣ 📌 *.color 255 87 51 (RGB to HEX)
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let input = args.join(' ');
        let result = '';
        let type = '';

        if (input.startsWith('#')) {
            let hex = input.substring(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            if (hex.length !== 6) {
                return reply('❌ Invalid HEX color. Use #RRGGBB or #RGB');
            }
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            result = `RGB(${r}, ${g}, ${b})`;
            type = 'HEX → RGB';
        } else {
            const rgbMatch = input.match(/(\d+)\s+(\d+)\s+(\d+)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
                    return reply('❌ RGB values must be between 0-255');
                }
                const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                result = hex;
                type = 'RGB → HEX';
            } else {
                return reply('❌ Invalid format. Use HEX (#RRGGBB) or RGB (255 87 51)');
            }
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎨 COLOR CONVERTER
┣▣
┣▣ 📋 CONVERSION: ${type}
┣▣ 🔄 INPUT: ${input}
┣▣ 🎯 RESULT: ${result}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 6. TEXT CASE CONVERTER
// ==============================================
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
        if (args.length < 2) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.case upper hello world
┣▣ 📌 *.case lower HELLO WORLD
┣▣ 📌 *.case title hello world
┣▣ 📌 *.case reverse hello world
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const type = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        let result = '';
        let mode = '';

        switch(type) {
            case 'upper':
            case 'uppercase':
                result = text.toUpperCase();
                mode = 'UPPERCASE';
                break;
            case 'lower':
            case 'lowercase':
                result = text.toLowerCase();
                mode = 'LOWERCASE';
                break;
            case 'title':
            case 'titlecase':
                result = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                mode = 'TITLE CASE';
                break;
            case 'reverse':
            case 'rev':
                result = text.split('').reverse().join('');
                mode = 'REVERSE';
                break;
            default:
                return reply('❌ Invalid type. Use: upper, lower, title, reverse');
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔠 TEXT CASE CONVERTER
┣▣
┣▣ 📋 MODE: ${mode}
┣▣ 📥 INPUT: ${text}
┣▣ 📤 RESULT: ${result}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 7. CHARACTER COUNTER
// ==============================================
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

        if (m.quoted && m.quoted.message) {
            if (m.quoted.message.conversation) {
                text = m.quoted.message.conversation;
            } else if (m.quoted.message.extendedTextMessage) {
                text = m.quoted.message.extendedTextMessage.text;
            }
        } else {
            text = args.join(' ');
        }

        if (!text) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.count your text here
┣▣ 📌 Reply to a message with *.count*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const charCount = text.length;
        const charCountNoSpaces = text.replace(/\s/g, '').length;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const lineCount = text.split('\n').length;
        const spaceCount = (text.match(/\s/g) || []).length;
        const numberCount = (text.match(/\d/g) || []).length;
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔢 TEXT STATISTICS
┣▣
┣▣ 📊 BASIC STATS
┣▣ 📝 Characters: ${charCount}
┣▣ 🔤 Characters (no spaces): ${charCountNoSpaces}
┣▣ 📚 Words: ${wordCount}
┣▣ 📄 Lines: ${lineCount}
┣▣
┣▣ 📊 DETAILED STATS
┣▣ ␣ Spaces: ${spaceCount}
┣▣ 🔢 Numbers: ${numberCount}
┣▣ 🔤 Letters: ${letterCount}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 8. TIMESTAMP CONVERTER
// ==============================================
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
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.timestamp 1678901234
┣▣ 📌 *.timestamp now (current timestamp)
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        let timestamp;
        
        if (args[0].toLowerCase() === 'now') {
            timestamp = Math.floor(Date.now() / 1000);
            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⏱️ CURRENT TIMESTAMP
┣▣
┣▣ 🔢 ${timestamp}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
            return;
        }

        if (!/^\d+$/.test(args[0])) {
            return reply('❌ Please provide a valid number');
        }

        timestamp = parseInt(args[0]);
        let date;
        
        if (timestamp > 1000000000000) {
            date = new Date(timestamp);
        } else {
            date = new Date(timestamp * 1000);
        }

        if (isNaN(date.getTime())) {
            return reply('❌ Invalid timestamp');
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⏱️ TIMESTAMP CONVERTER
┣▣
┣▣ 📋 INPUT: ${timestamp}
┣▣
┣▣ 📋 CONVERTED DATE
┣▣ 🌍 UTC: ${date.toUTCString()}
┣▣ 🏠 LOCAL: ${date.toLocaleString()}
┣▣ 📅 ISO: ${date.toISOString()}
┣▣
┣▣ 📊 BREAKDOWN
┣▣ 📆 Year: ${date.getFullYear()}
┣▣ 📅 Month: ${date.getMonth() + 1}
┣▣ 🗓️ Day: ${date.getDate()}
┣▣ 🕐 Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 9. HASH GENERATOR
// ==============================================
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
        if (args.length < 2) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.hash md5 hello world
┣▣ 📌 *.hash sha1 hello world
┣▣ 📌 *.hash sha256 hello world
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const crypto = require('crypto');
        const type = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        let hash = '';
        let algorithm = '';

        try {
            switch(type) {
                case 'md5':
                    hash = crypto.createHash('md5').update(text).digest('hex');
                    algorithm = 'MD5';
                    break;
                case 'sha1':
                    hash = crypto.createHash('sha1').update(text).digest('hex');
                    algorithm = 'SHA1';
                    break;
                case 'sha256':
                    hash = crypto.createHash('sha256').update(text).digest('hex');
                    algorithm = 'SHA256';
                    break;
                default:
                    return reply('❌ Use: md5, sha1, or sha256');
            }

            await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🔐 HASH GENERATOR
┣▣
┣▣ 📋 ALGORITHM: ${algorithm}
┣▣ 📋 INPUT: ${text}
┣▣ 🔑 HASH: ${hash}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } catch (hashError) {
            reply(`❌ Hash generation failed\n\n⚡ ${config.BOT_NAME} ✨`);
        }
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});

// ==============================================
// 10. UUID GENERATOR
// ==============================================
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
        
        let count = 1;
        if (args[0] && !isNaN(args[0])) {
            count = Math.min(parseInt(args[0]), 10);
        }
        
        let uuidList = [];
        for (let i = 0; i < count; i++) {
            uuidList.push(crypto.randomUUID());
        }
        
        const uuidText = uuidList.join('\n');
        
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🆔 UUID GENERATOR
┣▣
┣▣ 📋 GENERATED: ${count} UUID(s)
┣▣
┣▣ 🔑 ${uuidText}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ ERROR: ${e.message}\n\n⚡ ${config.BOT_NAME} ✨`);
    }
});