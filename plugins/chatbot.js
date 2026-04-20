const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Chatbot state path
const CHATBOT_STATE_PATH = './silatz/chatbot.json';
const CHATBOT_NAME = "ɴ o c т u r n a l";
const OWNER_NAME = "TYREX";
const COMPANY_NAME = "TYREX TECH";

// Load chatbot state
function loadChatbotState() {
    try {
        if (!fs.existsSync(CHATBOT_STATE_PATH)) return { perGroup: {}, private: false };
        const raw = fs.readFileSync(CHATBOT_STATE_PATH, 'utf8');
        const state = JSON.parse(raw || '{}');
        if (!state.perGroup) state.perGroup = {};
        if (typeof state.private !== 'boolean') state.private = false;
        return state;
    } catch (e) {
        return { perGroup: {}, private: false };
    }
}

// Save chatbot state
function saveChatbotState(state) {
    try {
        const dir = path.dirname(CHATBOT_STATE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CHATBOT_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
        console.error('Failed to save chatbot state:', e);
    }
}

cmd({
    pattern: "chatbot",
    alias: ["cb", "botchat", "ai"],
    desc: "Toggle AI chatbot on/off in group or private",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, args, sender }) => {
    try {
        const action = args[0]?.toLowerCase();
        const subCommand = args[1]?.toLowerCase();
        const state = loadChatbotState();

        // ============ PRIVATE MODE ============
        if (action === 'private') {
            if (!subCommand || !['on', 'off', 'status'].includes(subCommand)) {
                return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 CHATBOT PRIVATE MODE
┣▣
┣▣ 📝 Usage:
┣▣ .chatbot private on
┣▣ .chatbot private off
┣▣ .chatbot private status
┣▣
┣▣ 🤖 Bot: ${CHATBOT_NAME}
┣▣ 👑 Owner: ${OWNER_NAME}
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
            }

            if (!isOwner) {
                return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ OWNER ONLY
┣▣
┣▣ Only bot owner can toggle private chatbot!
┗▣`);
            }

            if (subCommand === 'status') {
                return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 PRIVATE CHATBOT STATUS
┣▣
┣▣ 📊 Status: ${state.private ? '✅ ENABLED' : '❌ DISABLED'}
┣▣
┣▣ ${CHATBOT_NAME} will ${state.private ? 'now' : 'not'} reply to your DMs.
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
            }

            state.private = subCommand === 'on';
            saveChatbotState(state);
            
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 PRIVATE CHATBOT
┣▣
┣▣ 📊 Status: ${state.private ? '✅ ENABLED' : '❌ DISABLED'}
┣▣
┣▣ ${CHATBOT_NAME} will now ${state.private ? 'reply' : 'not reply'} to private messages.
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
        }

        // ============ GROUP MODE ============
        if (!isGroup) {
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 CHATBOT COMMAND
┣▣
┣▣ Use in GROUP to toggle chatbot, or use:
┣▣ .chatbot private on/off/status
┣▣
┣▣ 🤖 Bot: ${CHATBOT_NAME}
┣▣ 👑 Owner: ${OWNER_NAME}
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
        }

        // Check admin for group commands
        if (!isAdmins && !isOwner) {
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ADMIN ONLY
┣▣
┣▣ Only admins can toggle chatbot in groups!
┗▣`);
        }

        if (!action || !['on', 'off', 'status'].includes(action)) {
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 CHATBOT GROUP COMMANDS
┣▣
┣▣ 📝 Usage:
┣▣ .chatbot on - Enable AI in this group
┣▣ .chatbot off - Disable AI in this group
┣▣ .chatbot status - Check current status
┣▣ .chatbot private on/off - DM mode
┣▣
┣▣ 🤖 Name: ${CHATBOT_NAME}
┣▣ 👑 Creator: ${OWNER_NAME}
┣▣ 🏢 CEO: ${COMPANY_NAME}
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
        }

        state.perGroup = state.perGroup || {};

        if (action === 'status') {
            const enabled = state.perGroup[from]?.enabled || false;
            return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 GROUP CHATBOT STATUS
┣▣
┣▣ 📊 Status: ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┣▣
┣▣ 🤖 ${CHATBOT_NAME}
┣▣ 👑 Creator: ${OWNER_NAME}
┣▣ 🏢 CEO: ${COMPANY_NAME}
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);
        }

        state.perGroup[from] = state.perGroup[from] || {};
        state.perGroup[from].enabled = action === 'on';
        saveChatbotState(state);

        return reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🤖 CHATBOT
┣▣
┣▣ 📊 Status: ${action === 'on' ? '✅ ENABLED' : '❌ DISABLED'} in this group
┣▣
┣▣ ${CHATBOT_NAME} will ${action === 'on' ? 'now' : 'not'} reply to messages here.
┣▣
┗▣ ${config.DESCRIPTION || 'Powered by TYREX MD'}`);

    } catch (e) {
        console.error('Chatbot command error:', e);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ ${e.message}
┗▣`);
    }
});
