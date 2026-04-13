const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
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
        externalAdReply: {
            title: `✨ ${config.BOT_NAME}`,
            body: `📋 ᴍᴇɴᴜ ᴍᴇɴᴜ`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg',
            sourceUrl: `https://github.com/binadnan`,
            renderLargerThumbnail: false,
        }
    };
};

// Function to scan all plugin files and extract commands
const scanPlugins = () => {
    const pluginsDir = path.join(__dirname, '../plugins');
    const categories = {};
    
    try {
        const files = fs.readdirSync(pluginsDir);
        
        files.forEach(file => {
            if (file.endsWith('.js')) {
                try {
                    const filePath = path.join(pluginsDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Extract cmd patterns and categories
                    const cmdRegex = /cmd\(\s*{\s*pattern:\s*["']([^"']+)["'][^}]*category:\s*["']([^"']+)["']/gs;
                    const reactRegex = /react:\s*["']([^"']+)["']/g;
                    
                    let match;
                    
                    while ((match = cmdRegex.exec(content)) !== null) {
                        const pattern = match[1];
                        const category = match[2].toLowerCase();
                        
                        // Find react for this command
                        const cmdBlock = content.substring(match.index, content.indexOf('}', match.index) + 1);
                        
                        let react = '🔹';
                        const reactMatch = reactRegex.exec(cmdBlock);
                        if (reactMatch) {
                            react = reactMatch[1];
                        }
                        
                        if (!categories[category]) {
                            categories[category] = [];
                        }
                        
                        categories[category].push({
                            pattern: pattern,
                            react: react
                        });
                    }
                    
                } catch (fileError) {
                    console.error(`Error reading file ${file}:`, fileError.message);
                }
            }
        });
        
    } catch (error) {
        console.error('Error scanning plugins:', error.message);
    }
    
    return categories;
};

// Format menu text - ALL COMMANDS VERTICAL (ONE PER LINE)
const formatMenu = (categories, pushname) => {
    let menuText = `╔═══════════════════════════╗
║   📋 *${config.BOT_NAME} ᴍᴇɴᴜ* 📋
╚═══════════════════════════╝

┌─── ✦ *ᴜsᴇʀ ɪɴғᴏ* ✦ ───┐
│ 👤 *ɴᴀᴍᴇ:* ${pushname || 'User'}
│ 🤖 *ʙᴏᴛ:* ${config.BOT_NAME}
│ 🔧 *ᴘʀᴇғɪx:* ${config.PREFIX}
│ 👑 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME || 'Tyrex Tech'}
└─────────────────────────┘

`;

    // Sort categories
    const sortedCategories = Object.keys(categories).sort();
    
    for (const category of sortedCategories) {
        if (categories[category].length === 0) continue;
        
        // Category header with icon
        let categoryIcon = '📁';
        switch(category) {
            case 'group': categoryIcon = '👥'; break;
            case 'downloader': categoryIcon = '📥'; break;
            case 'utility': categoryIcon = '🛠️'; break;
            case 'owner': categoryIcon = '👑'; break;
            case 'game': categoryIcon = '🎮'; break;
            case 'fun': categoryIcon = '🎉'; break;
            case 'ai': categoryIcon = '🤖'; break;
            case 'settings': categoryIcon = '⚙️'; break;
            case 'search': categoryIcon = '🔍'; break;
            case 'tools': categoryIcon = '🔧'; break;
            case 'main': categoryIcon = '🏠'; break;
            case 'general': categoryIcon = '📌'; break;
            case 'wakubwa': categoryIcon = '🔞'; break;
        }
        
        menuText += `┌─── ✦ *${categoryIcon} ${category.toUpperCase()}* ✦ ───┐\n`;
        
        // Add commands in this category - EACH COMMAND ON ITS OWN LINE
        categories[category].forEach(cmd => {
            menuText += `│ ${cmd.react} *${config.PREFIX}${cmd.pattern}*\n`;
        });
        
        menuText += `└─────────────────────────┘\n\n`;
    }

    // Add stats
    const totalCommands = Object.values(categories).reduce((acc, cat) => acc + cat.length, 0);
    
    menuText += `╔═══════════════════════════╗
║   *📊 sᴛᴀᴛɪsᴛɪᴄs* 📊
╚═══════════════════════════╝

┌─── ✦ *ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs* ✦ ───┐
│ 📌 *${totalCommands} ᴄᴏᴍᴍᴀɴᴅs*
│ 📂 *${sortedCategories.length} ᴄᴀᴛᴇɢᴏʀɪᴇs*
└─────────────────────────┘

⚡ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ:* ✨ *${config.BOT_NAME}* ✨`;

    return menuText;
};

cmd({
    pattern: "menu",
    alias: ["help", "commands", "cmdlist"],
    react: "📋",
    desc: "Show all available commands",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Send processing message
        await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║   *📋 ɢᴇɴᴇʀᴀᴛɪɴɢ ᴍᴇɴᴜ...* 📋
╚═══════════════════════════╝

⏳ *sᴄᴀɴɴɪɴɢ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs, ᴘʟᴇᴀsᴇ ᴘᴀɪᴛ...*

⚡ *${config.BOT_NAME}* ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Scan all plugins and get categories
        const categories = scanPlugins();
        
        // Format menu text
        const menuText = formatMenu(categories, pushname);

        // Send menu with image from config
        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg' },
            caption: menuText,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Menu Error:', error);
        await conn.sendMessage(from, {
            text: `╔═══════════════════════════╗
║   *❌ ᴍᴇɴᴜ ᴇʀʀᴏʀ* ❌
╚═══════════════════════════╝

┌─── ✦ *ᴇʀʀᴏʀ ɪɴғᴏ* ✦ ───┐
│ 📋 *${error.message}*
└─────────────────────────┘

⚡ *${config.BOT_NAME}* ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});