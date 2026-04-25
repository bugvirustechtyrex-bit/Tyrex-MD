console.clear()
console.log("📳 Starting 𝐓𝐘𝐑𝐄𝐗-𝐌𝐃...")

// ============ GLOBAL ANTI-CRASH ============
process.on("uncaughtException", (err) {
  console.error("❌ Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason)
})

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const fs = require('fs')
const path = require('path')
const P = require('pino')
const config = require('./config')
const { sms, AntiDelete } = require('./lib')
const { getBuffer, sleep } = require('./lib/functions')
const { saveMessage } = require('./data')
const axios = require('axios')
const { File } = require('megajs')
const express = require('express')

const prefix = config.PREFIX || '.'

// ============ OWNER CONFIGURATION ============
const configOwnerNumbers = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',') : []
const ownerNumber = ['255628378557', ...configOwnerNumbers].map(num => num.trim())

const ownerJids = ownerNumber.map(num => {
  if (num.includes('@s.whatsapp.net')) return num
  if (num.includes('-')) return num
  return num + '@s.whatsapp.net'
})

console.log('👑 Owner Numbers:', ownerNumber)

// ============ CHATBOT CONSTANTS ============
const CHATBOT_STATE_PATH = './tyrex/chatbot.json';
const CHATBOT_NAME = "𝐓𝐘𝐑𝐄𝐗";
const COMPANY_NAME = "TYREX TECH";

// ============ SECURITY DATABASE ============
const securityDB = {
  antiMedia: { enabled: false, deleteSilently: true, mediaTypes: { image: true, video: true, audio: true, document: true, sticker: true, gif: true }, allowedGroups: [] },
  antiTag: { enabled: false, maxMentions: 5, action: 'warn', warnCount: 3 },
  antiBug: { enabled: false, blockBugMessages: true, logBugs: true },
  antiSpam: { enabled: false, maxMessages: 5, timeWindow: 5000, action: 'warn', warnCount: 3, userMessages: new Map() },
  antiBan: { enabled: true, protectOwner: true, protectAdmins: true, protectBot: true, blockDeleteGroup: true }
}

const securityFile = './security.json'
if (fs.existsSync(securityFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(securityFile))
    Object.assign(securityDB, loaded)
  } catch (e) {}
}

function saveSecurity() {
  fs.writeFileSync(securityFile, JSON.stringify(securityDB, null, 2))
}

// ============ ANTI-MEDIA SETUP ============
let antiMediaHandler = null;
let antiLinkHandler = null;

const antiMediaPluginPath = './plugins/antimedia.js';
if (fs.existsSync(antiMediaPluginPath)) {
  try {
    const antiMediaPlugin = require(antiMediaPluginPath);
    antiMediaHandler = antiMediaPlugin.handleAntiMedia;
    console.log('✅ Anti-Media plugin loaded');
  } catch (e) { console.error('Anti-Media error:', e); }
}

const antiLinkPluginPath = './plugins/antilink.js';
if (fs.existsSync(antiLinkPluginPath)) {
  try {
    const antiLinkPlugin = require(antiLinkPluginPath);
    antiLinkHandler = antiLinkPlugin.handleAntiLink;
    console.log('✅ Anti-Link plugin loaded');
  } catch (e) { console.error('Anti-Link error:', e); }
}

// ============ CHATBOT FUNCTIONS ============
function loadChatbotState() {
  try {
    if (!fs.existsSync(CHATBOT_STATE_PATH)) return { perGroup: {}, private: false };
    return JSON.parse(fs.readFileSync(CHATBOT_STATE_PATH, 'utf8'));
  } catch (e) {
    return { perGroup: {}, private: false };
  }
}

async function isChatbotEnabledForChat(state, chatId) {
  if (!state || !chatId) return false;
  if (chatId.endsWith('@g.us')) {
    return state.perGroup?.[chatId]?.enabled === true;
  }
  return state.private === true;
}

function extractMessageText(message) {
  if (!message?.message) return '';
  const msg = message.message;
  if (msg.conversation) return msg.conversation.trim();
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text.trim();
  if (msg.imageMessage?.caption) return msg.imageMessage.caption.trim();
  if (msg.videoMessage?.caption) return msg.videoMessage.caption.trim();
  return '';
}

async function handleChatbotMessage(conn, chatId, message) {
  try {
    if (!chatId || message.key?.fromMe) return;
    const state = loadChatbotState();
    if (!(await isChatbotEnabledForChat(state, chatId))) return;
    
    const userText = extractMessageText(message);
    if (!userText) return;
    
    console.log(`[Chatbot] ${chatId}: "${userText.substring(0, 50)}"`);
    
    try {
      await conn.sendPresenceUpdate('composing', chatId);
      await sleep(800);
    } catch(e) {}
    
    const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(userText)}`;
    
    let apiResult = null;
    try {
      const fetch = require('node-fetch');
      const res = await fetch(apiUrl, { timeout: 30000 });
      const data = await res.json();
      apiResult = data?.response || data?.message || data?.result;
    } catch (err) {
      console.error('AI API error:', err.message);
    }
    
    if (!apiResult) {
      await conn.sendMessage(chatId, { text: 'Pole, jaribu tena 😅' }, { quoted: message });
      return;
    }
    
    await conn.sendMessage(chatId, { text: String(apiResult).trim() }, { quoted: message });
  } catch (err) {
    console.error('Chatbot error:', err);
  }
}

// ============ SECURITY FUNCTIONS ============
async function handleAntiMediaFallback(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiMedia.enabled) return false;
  if (isOwner || isAdmins) return false;
  if (securityDB.antiMedia.allowedGroups.includes(from)) return false;
  
  const type = getContentType(mek.message);
  if (!type) return false;
  
  let mediaType = '';
  if (type.includes('image')) mediaType = 'image';
  else if (type.includes('video')) mediaType = 'video';
  else if (type.includes('audio')) mediaType = 'audio';
  else if (type.includes('document')) mediaType = 'document';
  else if (type.includes('sticker')) mediaType = 'sticker';
  else return false;
  
  if (securityDB.antiMedia.mediaTypes[mediaType]) {
    await conn.sendMessage(from, { delete: mek.key });
    if (!securityDB.antiMedia.deleteSilently) {
      await conn.sendMessage(from, { text: `⚠️ Anti-Media: ${mediaType} imefutwa!`, contextInfo: { mentionedJid: [sender] } });
    }
    return true;
  }
  return false;
}

const antiTagWarns = new Map();

async function handleAntiTag(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiTag.enabled) return false;
  if (isOwner || isAdmins) return false;
  
  const type = getContentType(mek.message);
  let mentions = [];
  if (type === 'extendedTextMessage' && mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
    mentions = mek.message.extendedTextMessage.contextInfo.mentionedJid;
  }
  
  if (mentions.length > securityDB.antiTag.maxMentions) {
    await conn.sendMessage(from, { delete: mek.key });
    return true;
  }
  return false;
}

async function handleAntiBug(conn, mek, from, sender) {
  if (!securityDB.antiBug.enabled) return false;
  
  const type = getContentType(mek.message);
  let text = '';
  if (type === 'conversation') text = mek.message.conversation;
  else if (type === 'extendedTextMessage') text = mek.message.extendedTextMessage.text;
  else return false;
  
  const bugPatterns = [/[\u0000-\u001F]/, /.{1000,}/, /<script/i];
  for (const pattern of bugPatterns) {
    if (pattern.test(text)) {
      await conn.sendMessage(from, { delete: mek.key });
      return true;
    }
  }
  return false;
}

async function handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiSpam.enabled) return false;
  if (isOwner || isAdmins) return false;
  
  const now = Date.now();
  const userData = securityDB.antiSpam.userMessages.get(sender) || { count: 0, firstMsg: now };
  
  if (now - userData.firstMsg < securityDB.antiSpam.timeWindow) {
    userData.count++;
    securityDB.antiSpam.userMessages.set(sender, userData);
    
    if (userData.count > securityDB.antiSpam.maxMessages) {
      await conn.sendMessage(from, { delete: mek.key });
      return true;
    }
  } else {
    securityDB.antiSpam.userMessages.set(sender, { count: 1, firstMsg: now });
  }
  return false;
}

// ============ SESSION SETUP ============
const sessionDir = './sessions'
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir)

if (!fs.existsSync('./sessions/creds.json')) {
  if (!config.SESSION_ID || config.SESSION_ID.trim() === '') {
    console.log('❌ SESSION_ID haipo! Ongeza kwenye config.js');
    process.exit(1);
  }
  const sessdata = config.SESSION_ID.replace('tyrex~', '').trim();
  console.log('📥 Downloading session...');
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) { console.log('❌ Session download failed:', err.message); process.exit(1); }
    fs.writeFileSync('./sessions/creds.json', data);
    console.log('✅ Session downloaded! Restarting...');
    process.exit(0);
  });
}

// ============ EXPRESS SERVER ============
const app = express();
const port = process.env.PORT || 9090;

app.get('/', (req, res) => {
  res.send('𝐓𝐘𝐑𝐄𝐗-𝐌𝐃 STARTED ✅');
});
app.listen(port, '0.0.0.0', () => console.log(`Server on port ${port}`));

// ============ MAIN CONNECTION ============
let conn;

async function connectToWA() {
  try {
    console.log("[♻] Connecting to WhatsApp...");
    const { state, saveCreds } = await useMultiFileAuthState('./sessions/');
    const { version } = await fetchLatestBaileysVersion();
    
    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('TYREX-MD'),
      auth: state,
      version,
      syncFullHistory: false
    });
    
    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('[⚠️] Connection closed');
        if (shouldReconnect) {
          console.log('[♻] Reconnecting...');
          setTimeout(connectToWA, 5000);
        }
      } else if (connection === 'open') {
        console.log('[✅] TYREX-MD Connected Successfully!');
        
        // Load commands
        if (fs.existsSync('./command')) {
          const commandFiles = fs.readdirSync('./command').filter(f => f.endsWith('.js'));
          for (const file of commandFiles) {
            require('./command/' + file);
          }
          console.log(`[✅] Loaded ${commandFiles.length} commands`);
        }
        
        // Load plugins
        if (fs.existsSync('./plugins')) {
          const pluginFiles = fs.readdirSync('./plugins').filter(f => f.endsWith('.js'));
          for (const file of pluginFiles) {
            require('./plugins/' + file);
          }
          console.log(`[✅] Loaded ${pluginFiles.length} plugins`);
        }
        
        // Send startup message
        const startupMsg = `╭━━━━━━━━━━━━━━━━━━╮
┃  🤖 TYREX-MD ONLINE 🤖
┃━━━━━━━━━━━━━━━━━━━
┃  📡 Status: ACTIVE
┃  🔖 Prefix: ${prefix}
┃  👑 Owner: TYREX
┃  💻 Version: 2.0.0
┃━━━━━━━━━━━━━━━━━━━
┃  ⚡ Powered by TYREX TECH
╰━━━━━━━━━━━━━━━━━━╯`;
        
        try {
          await conn.sendMessage(conn.user.id, { text: startupMsg });
        } catch(e) {}
        
        // Follow newsletter
        try {
          await conn.newsletterFollow('120363424973782944@newsletter');
          console.log('[✅] Followed newsletter');
        } catch(e) {}
      }
    });
    
    conn.ev.on('creds.update', saveCreds);
    
    // Auto bio
    setInterval(async () => {
      if (config.AUTO_BIO === 'true') {
        const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' });
        try {
          await conn.setStatus(`𝐓𝐘𝐑𝐄𝐗-𝐌𝐃 | ⚡ ${time}`);
        } catch(e) {}
      }
    }, 60000);
    
    // Anti-delete
    conn.ev.on('messages.update', async (updates) => {
      for (const update of updates) {
        if (update.update.message === null) {
          await AntiDelete(conn, updates);
        }
      }
    });
    
    // ============ MESSAGE HANDLER ============
    conn.ev.on('messages.upsert', async (mek) => {
      try {
        mek = mek.messages[0];
        if (!mek.message) return;
        
        // Handle status
        if (mek.key?.remoteJid === 'status@broadcast') {
          if (config.AUTO_STATUS_SEEN === 'true') {
            try { await conn.readMessages([mek.key]); } catch(e) {}
          }
          return;
        }
        
        // Handle view once
        if (mek.message?.viewOnceMessageV2) {
          mek.message = mek.message.viewOnceMessageV2.message;
        }
        if (getContentType(mek.message) === 'ephemeralMessage') {
          mek.message = mek.message.ephemeralMessage.message;
        }
        
        // Read message
        if (config.READ_MESSAGE === 'true') {
          try { await conn.readMessages([mek.key]); } catch(e) {}
        }
        
        await saveMessage(mek);
        
        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const from = mek.key.remoteJid;
        const body = (type === 'conversation') ? mek.message.conversation : 
                     (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
        const isCmd = body.startsWith(prefix);
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        
        // Owner check
        const isOwner = ownerJids.includes(sender) || ownerNumber.includes(senderNumber);
        
        // Group metadata & admin check
        let groupMetadata = null;
        let groupAdmins = [];
        let isAdmins = false;
        let isBotAdmins = false;
        
        if (isGroup) {
          groupMetadata = await conn.groupMetadata(from).catch(() => null);
          if (groupMetadata && groupMetadata.participants) {
            groupAdmins = groupMetadata.participants
              .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
              .map(p => p.id.includes(':') ? p.id.split(':')[0] + '@s.whatsapp.net' : p.id);
            const normSender = sender.includes(':') ? sender.split(':')[0] + '@s.whatsapp.net' : sender;
            isAdmins = groupAdmins.includes(normSender);
            isBotAdmins = groupAdmins.includes(botNumber + '@s.whatsapp.net');
          }
        }
        
        const reply = (text) => conn.sendMessage(from, { text }, { quoted: mek });
        
        // ============ SECURITY CHECKS ============
        if (isGroup) {
          // Anti-Link
          if (antiLinkHandler) {
            if (await antiLinkHandler(conn, mek, from, sender, isOwner, isAdmins)) return;
          }
          // Anti-Media
          if (antiMediaHandler) {
            if (await antiMediaHandler(conn, mek, from, sender, isOwner, isAdmins)) return;
          } else {
            if (await handleAntiMediaFallback(conn, mek, from, sender, isOwner, isAdmins)) return;
          }
          if (await handleAntiTag(conn, mek, from, sender, isOwner, isAdmins)) return;
          if (await handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins)) return;
        }
        if (await handleAntiBug(conn, mek, from, sender)) return;
        
        // Chatbot
        if (!isCmd && body && body.length > 0 && body.length < 500) {
          await handleChatbotMessage(conn, from, mek);
        }
        
        // Work mode
        if (!isOwner) {
          if (config.MODE === 'private') return;
          if (isGroup && config.MODE === 'inbox') return;
          if (!isGroup && config.MODE === 'groups') return;
        }
        
        // ============ COMMANDS ============
        if (isCmd) {
          const commandName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
          const commands = require('./command');
          const cmd = commands.commands.find(c => c.pattern === commandName) || 
                      commands.commands.find(c => c.alias && c.alias.includes(commandName));
          
          if (cmd) {
            if (cmd.react) {
              try { await conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } }); } catch(e) {}
            }
            try {
              await cmd.function(conn, mek, m, {
                from, body, isCmd, command: commandName, args: [], q: '', text: '',
                isGroup, sender, senderNumber, botNumber, pushname: '', isMe: false,
                isOwner, isCreator: isOwner, groupMetadata, groupName: groupMetadata?.subject || '',
                participants: [], groupAdmins, isBotAdmins, isAdmins, reply, securityDB, saveSecurity
              });
            } catch(e) {
              console.error('Command error:', e);
            }
          }
        }
        
      } catch (err) {
        console.error('Messages error:', err);
      }
    });
    
    // Helper functions
    conn.sendText = (jid, text, quoted) => conn.sendMessage(jid, { text }, { quoted });
    conn.sendImage = async (jid, path, caption, quoted) => {
      const buffer = /^https?:\/\//.test(path) ? await getBuffer(path) : fs.readFileSync(path);
      return conn.sendMessage(jid, { image: buffer, caption }, { quoted });
    };
    conn.setStatus = (status) => {
      conn.query({ tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' }, content: [{ tag: 'status', attrs: {}, content: Buffer.from(status, 'utf-8') }] });
    };
    conn.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
      }
      return jid;
    };
    
  } catch (err) {
    console.error('[❌] Connection error:', err);
    setTimeout(connectToWA, 5000);
  }
}

connectToWA();
