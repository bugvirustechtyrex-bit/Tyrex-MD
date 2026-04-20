const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Paths for data files
const DATA_DIR = path.join(__dirname, '../data');
const BADWORDS_PATH = path.join(DATA_DIR, 'badwords.json');
const BADWORD_CONFIG_PATH = path.join(DATA_DIR, 'badword_config.json');

// Initialize data files
function initializeFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BADWORDS_PATH)) {
        fs.writeFileSync(BADWORDS_PATH, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(BADWORD_CONFIG_PATH)) {
        fs.writeFileSync(BADWORD_CONFIG_PATH, JSON.stringify({ enabled: false, action: 'warn' }, null, 2));
    }
}

// Load badwords
function loadBadwords() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(BADWORDS_PATH, 'utf8'));
    } catch {
        return [];
    }
}

// Save badwords
function saveBadwords(badwords) {
    fs.writeFileSync(BADWORDS_PATH, JSON.stringify(badwords, null, 2));
}

// Load config
function loadConfig() {
    initializeFiles();
    try {
        return JSON.parse(fs.readFileSync(BADWORD_CONFIG_PATH, 'utf8'));
    } catch {
        return { enabled: false, action: 'warn' };
    }
}

// Save config
function saveConfig(configData) {
    fs.writeFileSync(BADWORD_CONFIG_PATH, JSON.stringify(configData, null, 2));
}

// Add badword
function addBadword(word) {
    const badwords = loadBadwords();
    const lowerWord = word.toLowerCase();
    if (!badwords.includes(lowerWord)) {
        badwords.push(lowerWord);
        saveBadwords(badwords);
        return true;
    }
    return false;
}

// Add multiple badwords
function addMultipleBadwords(words) {
    const badwords = loadBadwords();
    const added = [];
    const alreadyExist = [];
    
    for (const word of words) {
        const lowerWord = word.toLowerCase();
        if (!badwords.includes(lowerWord)) {
            badwords.push(lowerWord);
            added.push(word);
        } else {
            alreadyExist.push(word);
        }
    }
    
    if (added.length > 0) {
        saveBadwords(badwords);
    }
    
    return { added, alreadyExist };
}

// Remove badword
function removeBadword(word) {
    const badwords = loadBadwords();
    const lowerWord = word.toLowerCase();
    const index = badwords.indexOf(lowerWord);
    if (index !== -1) {
        badwords.splice(index, 1);
        saveBadwords(badwords);
        return true;
    }
    return false;
}

// Remove multiple badwords
function removeMultipleBadwords(words) {
    const badwords = loadBadwords();
    const removed = [];
    const notFound = [];
    
    for (const word of words) {
        const lowerWord = word.toLowerCase();
        const index = badwords.indexOf(lowerWord);
        if (index !== -1) {
            badwords.splice(index, 1);
            removed.push(word);
        } else {
            notFound.push(word);
        }
    }
    
    if (removed.length > 0) {
        saveBadwords(badwords);
    }
    
    return { removed, notFound };
}

// List badwords
function listBadwords() {
    return loadBadwords();
}

// Check if message contains badword
function containsBadword(text) {
    if (!text) return false;
    const badwords = loadBadwords();
    const lowerText = text.toLowerCase();
    return badwords.some(badword => lowerText.includes(badword));
}

// Get the badword found in message
function getFoundBadword(text) {
    if (!text) return null;
    const badwords = loadBadwords();
    const lowerText = text.toLowerCase();
    return badwords.find(badword => lowerText.includes(badword));
}

// ==============================================
// ANTI-BADWORD MESSAGE HANDLER (to be used in index.js)
// ==============================================
async function handleAntiBadword(sock, chatId, message, senderId, isAdmin, isBotAdmin) {
    const configData = loadConfig();
    if (!configData.enabled) return;
    
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    if (!text) return;
    
    // Skip if sender is admin
    if (isAdmin) return;
    
    const foundBadword = getFoundBadword(text);
    if (foundBadword) {
        try {
            // Delete the message
            await sock.sendMessage(chatId, { delete: message.key });
            
            const botName = config.BOT_NAME;
            
            // Send warning
            await sock.sendMessage(chatId, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ 🚫 BADWORD DETECTED
┣▣
┣▣ 👤 User: @${senderId.split('@')[0]}
┣▣ 📝 Badword: ${foundBadword}
┣▣
┣▣ ⚠️ Message has been deleted!
┣▣
┣▣ ⚡ ${botName}
┗▣`,
                mentions: [senderId]
            });
            
        } catch (err) {
            console.error('Anti-badword error:', err);
        }
    }
}

// ==============================================
// ADD BADWORD COMMAND
// ==============================================
cmd({
    pattern: "addbadword",
    alias: ["abw", "addbw"],
    react: "➕",
    desc: "Add badword(s) to the filter list",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, args, reply, q }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!isAdmins && !isCreator) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!q) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.addbadword [word]*
┣▣ 📌 *.addbadword word1,word2,word3*
┣▣
┣▣ 📌 Example: *.addbadword stupid*
┣▣ 📌 Example: *.addbadword stupid,idiot,fool*
┣▣
┣▣ 💡 Separate multiple words with commas
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const words = q.split(',').map(w => w.trim().toLowerCase());
        const { added, alreadyExist } = addMultipleBadwords(words);
        
        let response = `┏▣ ◈ *${botName}* ◈
┣▣ ➕ ADD BADWORD
┣▣
┣▣ 📋 Requested: ${words.length} word(s)
┣▣`;
        
        if (added.length > 0) {
            response += `\n┣▣ ✅ Added: ${added.join(', ')}`;
        }
        if (alreadyExist.length > 0) {
            response += `\n┣▣ ⚠️ Already exist: ${alreadyExist.join(', ')}`;
        }
        
        const totalBadwords = loadBadwords().length;
        response += `\n┣▣
┣▣ 📊 Total badwords: ${totalBadwords}
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await reply(response);
        
    } catch (e) {
        console.error('Addbadword error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// ==============================================
// REMOVE BADWORD COMMAND
// ==============================================
cmd({
    pattern: "delbadword",
    alias: ["dbw", "removebw", "deletebadword"],
    react: "➖",
    desc: "Remove badword(s) from the filter list",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, args, reply, q }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!isAdmins && !isCreator) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!q) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ USAGE
┣▣
┣▣ 📌 *.delbadword [word]*
┣▣ 📌 *.delbadword word1,word2,word3*
┣▣
┣▣ 📌 Example: *.delbadword stupid*
┣▣ 📌 Example: *.delbadword stupid,idiot,fool*
┣▣
┣▣ 💡 Separate multiple words with commas
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const words = q.split(',').map(w => w.trim().toLowerCase());
        const { removed, notFound } = removeMultipleBadwords(words);
        
        let response = `┏▣ ◈ *${botName}* ◈
┣▣ ➖ REMOVE BADWORD
┣▣
┣▣ 📋 Requested: ${words.length} word(s)
┣▣`;
        
        if (removed.length > 0) {
            response += `\n┣▣ ✅ Removed: ${removed.join(', ')}`;
        }
        if (notFound.length > 0) {
            response += `\n┣▣ ⚠️ Not found: ${notFound.join(', ')}`;
        }
        
        const totalBadwords = loadBadwords().length;
        response += `\n┣▣
┣▣ 📊 Total badwords: ${totalBadwords}
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await reply(response);
        
    } catch (e) {
        console.error('Delbadword error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// ==============================================
// LIST BADWORDS COMMAND
// ==============================================
cmd({
    pattern: "listbadword",
    alias: ["lbw", "badwordlist", "bwlist"],
    react: "📋",
    desc: "List all badwords in the filter",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!isAdmins && !isCreator) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const badwords = listBadwords();
        
        if (badwords.length === 0) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 📋 BADWORD LIST
┣▣
┣▣ 📌 No badwords found!
┣▣
┣▣ 💡 Use *.addbadword [word]* to add badwords
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        // Show first 50 badwords to avoid message too long
        const displayBadwords = badwords.slice(0, 50);
        const badwordList = displayBadwords.map((word, i) => `┣▣ ${i + 1}. ${word}`).join('\n');
        
        let response = `┏▣ ◈ *${botName}* ◈
┣▣ 📋 BADWORD LIST
┣▣
${badwordList}`;
        
        if (badwords.length > 50) {
            response += `\n┣▣
┣▣ 📌 And ${badwords.length - 50} more...`;
        }
        
        response += `\n┣▣
┣▣ 📊 Total: ${badwords.length} badwords
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await reply(response);
        
    } catch (e) {
        console.error('Listbadword error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// ==============================================
// CLEAR ALL BADWORDS COMMAND
// ==============================================
cmd({
    pattern: "clearallbadword",
    alias: ["clbw", "resetbadwords", "clearbadwords"],
    react: "🗑️",
    desc: "Clear all badwords from the filter",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isCreator) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only the bot owner can use this command!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const oldCount = loadBadwords().length;
        saveBadwords([]);
        
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🗑️ CLEAR ALL BADWORDS
┣▣
┣▣ ✅ ${oldCount} badword(s) have been cleared!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        
    } catch (e) {
        console.error('Clearallbadword error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// ==============================================
// ANTI-BADWORD SETTINGS COMMAND
// ==============================================
cmd({
    pattern: "antibadword",
    alias: ["abwset", "badwordset"],
    react: "🛡️",
    desc: "Enable or disable anti-badword protection",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isCreator, args, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!isGroup) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 This command can only be used in groups!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        if (!isAdmins && !isCreator) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Only group admins can use this command!
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        const action = args[0]?.toLowerCase();
        const configData = loadConfig();
        
        if (action === 'on') {
            saveConfig({ ...configData, enabled: true });
            await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ✅ ANTI-BADWORD ENABLED
┣▣
┣▣ 🛡️ Badword protection is now ACTIVE
┣▣
┣▣ ⚠️ Users who send badwords will be warned
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        } 
        else if (action === 'off') {
            saveConfig({ ...configData, enabled: false });
            await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ANTI-BADWORD DISABLED
┣▣
┣▣ 🛡️ Badword protection is now INACTIVE
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        else {
            const status = configData.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const totalBadwords = loadBadwords().length;
            
            await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ ANTI-BADWORD STATUS
┣▣
┣▣ 📋 Status: ${status}
┣▣ 📊 Badwords: ${totalBadwords}
┣▣
┣▣ 📌 Commands:
┣▣ *.antibadword on* - Enable protection
┣▣ *.antibadword off* - Disable protection
┣▣ *.addbadword [word]* - Add badword(s)
┣▣ *.delbadword [word]* - Remove badword(s)
┣▣ *.listbadword* - Show all badwords
┣▣ *.clearallbadword* - Clear all badwords (owner only)
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
    } catch (e) {
        console.error('Antibadword error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${botName}
┗▣`);
    }
});

// Export functions for use in index.js
module.exports = {
    handleAntiBadword,
    containsBadword,
    getFoundBadword,
    loadBadwords,
    addBadword,
    removeBadword,
    listBadwords,
    loadConfig,
    saveConfig
};