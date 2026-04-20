const { cmd } = require('../command');
const config = require('../config');

// Font styles mapping
const fontStyles = {
    // Bold
    bold: {
        name: "𝐁𝐨𝐥𝐝",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 119743);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119737);
            return char;
        }).join('')
    },
    // Italic
    italic: {
        name: "𝐼𝑡𝑎𝑙𝑖𝑐",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 119795);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119789);
            return char;
        }).join('')
    },
    // Bold Italic
    bolditalic: {
        name: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 119847);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119841);
            return char;
        }).join('')
    },
    // Script Bold
    scriptbold: {
        name: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 119899);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119893);
            return char;
        }).join('')
    },
    // Fraktur
    fraktur: {
        name: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 119951);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119945);
            return char;
        }).join('')
    },
    // Double Struck
    doublestruck: {
        name: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120003);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 119997);
            return char;
        }).join('')
    },
    // Monospace
    monospace: {
        name: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120055);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 120049);
            return char;
        }).join('')
    },
    // Sans Serif
    sansserif: {
        name: "𝖲𝖺𝗇𝗌 𝖲𝖾𝗋𝗂𝖿",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120107);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 120101);
            return char;
        }).join('')
    },
    // Sans Serif Bold
    sansserifbold: {
        name: "𝗦𝗮𝗻𝘀 𝗦𝗲𝗿𝗶𝗳 𝗕𝗼𝗹𝗱",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120159);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 120153);
            return char;
        }).join('')
    },
    // Sans Serif Italic
    sansserifitalic: {
        name: "𝘚𝘢𝘯𝘴 𝘚𝘦𝘳𝘪𝘧 𝘐𝘵𝘢𝘭𝘪𝘤",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120211);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 120205);
            return char;
        }).join('')
    },
    // Sans Serif Bold Italic
    sansserifbolditalic: {
        name: "𝙎𝙖𝙣𝙨 𝙎𝙚𝙧𝙞𝙛 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 120263);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 120257);
            return char;
        }).join('')
    },
    // Circle
    circle: {
        name: "🄲🄸🅁🄲🄻🄴",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 9333);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 9327);
            return char;
        }).join('')
    },
    // Parenthesis
    parenthesis: {
        name: "⒫⒜⒭⒠⒩⒯⒣⒠⒮⒤⒮",
        convert: (text) => text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code + 9339);
            if (code >= 97 && code <= 122) return String.fromCharCode(code + 9333);
            return char;
        }).join('')
    },
    // Small Caps
    smallcaps: {
        name: "Sᴍᴀʟʟ Cᴀᴘs",
        convert: (text) => {
            const smallCaps = {
                'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ',
                'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ',
                'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ',
                'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
            };
            return text.split('').map(char => {
                const lower = char.toLowerCase();
                return smallCaps[lower] || char;
            }).join('');
        }
    },
    // Flip
    flip: {
        name: "ꟻꞁᴉԀ",
        convert: (text) => {
            const flipMap = {
                'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ɓ',
                'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'ʃ', 'm': 'ɯ', 'n': 'u',
                'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
                'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z'
            };
            return text.split('').reverse().map(char => {
                const lower = char.toLowerCase();
                return flipMap[lower] || char;
            }).join('');
        }
    }
};

// Main font command
cmd({
    pattern: "font",
    alias: ["f", "fonts", "style", "textstyle"],
    react: "🔤",
    desc: "Convert text to different font styles",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!q) {
            const styleList = Object.keys(fontStyles).map((key, i) => `┣▣ ${i + 1}. ${fontStyles[key].name}`).join('\n');
            
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔤 FONT CONVERTER
┣▣
┣▣ 📋 Available Styles:
${styleList}
┣▣
┣▣ 📌 Usage: *.font [style] [text]*
┣▣ 📌 Example: *.font bold Hello World*
┣▣ 📌 Example: *.font circle TYREX*
┣▣
┣▣ 💡 Or use: *.font [text]* to see all styles
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const parts = q.split(' ');
        const firstArg = parts[0].toLowerCase();
        
        // Check if first argument is a valid style
        if (fontStyles[firstArg]) {
            const style = firstArg;
            const text = parts.slice(1).join(' ');
            
            if (!text) {
                return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣ 📌 *.font ${style} [your text]*
┣▣ 📌 Example: *.font ${style} Hello World*
┣▣
┣▣ ⚡ ${botName}
┗▣`);
            }
            
            const converted = fontStyles[style].convert(text);
            
            await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔤 ${fontStyles[style].name}
┣▣
┣▣ 📝 Input: ${text}
┣▣
┣▣ ✨ Result:
┣▣ ${converted}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        } 
        else {
            // Show all styles for the given text
            const text = q;
            
            let response = `┏▣ ◈ *${botName}* ◈
┣▣ 🔤 FONT STYLES
┣▣
┣▣ 📝 Original: ${text}
┣▣
`;
            
            for (const [key, style] of Object.entries(fontStyles)) {
                const converted = style.convert(text);
                response += `┣▣ ${style.name}:
┣▣ ${converted}
┣▣
`;
            }
            
            response += `┣▣ ⚡ ${botName}
┗▣`;
            
            // Check if response is too long
            if (response.length > 4000) {
                return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ TEXT TOO LONG
┣▣ 📋 Please use a shorter text or specify a style.
┣▣
┣▣ 📌 Example: *.font bold ${text.substring(0, 20)}*
┣▣
┣▣ ⚡ ${botName}
┗▣`);
            }
            
            await reply(response);
        }
        
    } catch (e) {
        console.error('Font command error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// Individual font commands for quick access
cmd({
    pattern: "bold",
    alias: ["b"],
    react: "𝐁",
    desc: "Convert text to bold font",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.bold [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.bold.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ 𝐁𝐨𝐥𝐝\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});

cmd({
    pattern: "italic",
    alias: ["i"],
    react: "𝐼",
    desc: "Convert text to italic font",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.italic [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.italic.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ 𝐼𝑡𝑎𝑙𝑖𝑐\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});

cmd({
    pattern: "mono",
    alias: ["monospace"],
    react: "𝙼",
    desc: "Convert text to monospace font",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.mono [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.monospace.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ 𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});

cmd({
    pattern: "circle",
    alias: ["circ"],
    react: "🄲",
    desc: "Convert text to circle font",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.circle [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.circle.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ 🄲🄸🅁🄲🄻🄴\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});

cmd({
    pattern: "flip",
    alias: ["reverse", "upside"],
    react: "🔄",
    desc: "Flip text upside down",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.flip [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.flip.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ꟻꞁᴉԀ\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});

cmd({
    pattern: "sans",
    alias: ["sansserif"],
    react: "𝖲",
    desc: "Convert text to sans serif font",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    const botName = config.BOT_NAME;
    if (!q) return reply(`┏▣ ◈ *${botName}* ◈\n┣▣ ⚠️ Usage: *.sans [text]*\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
    const result = fontStyles.sansserif.convert(q);
    await reply(`┏▣ ◈ *${botName}* ◈\n┣▣ 𝖲𝖺𝗇𝗌 𝖲𝖾𝗋𝗂𝖿\n┣▣ ${result}\n┣▣\n┣▣ ⚡ ${botName}\n┗▣`);
});