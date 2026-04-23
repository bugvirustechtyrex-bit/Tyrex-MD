console.clear()
console.log("📳 Starting 𝐓𝐘𝐑𝐄𝐗-𝐌𝐃...")

// ============ GLOBAL ANTI-CRASH ============
process.on("uncaughtException", (err) => {
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
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

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
const CREATOR_NAME = "TYREX";
const OWNER_NAME = "TYREX";
const COMPANY_NAME = "TYREX TECH";

// ============ SECURITY FEATURES DATABASE ============
const securityDB = {
  antiMedia: {
    enabled: false,
    deleteSilently: true,
    mediaTypes: {
      image: true,
      video: true,
      audio: true,
      document: true,
      sticker: true,
      gif: true
    },
    allowedGroups: []
  },
  antiTag: {
    enabled: false,
    maxMentions: 5,
    action: 'warn',
    warnCount: 3
  },
  antiBug: {
    enabled: false,
    blockBugMessages: true,
    logBugs: true
  },
  antiSpam: {
    enabled: false,
    maxMessages: 5,
    timeWindow: 5000,
    action: 'warn',
    warnCount: 3,
    userMessages: new Map()
  },
  antiBan: {
    enabled: true,
    protectOwner: true,
    protectAdmins: true,
    protectBot: true,
    blockDeleteGroup: true,
    blockPromoteDemote: true
  }
}

const securityFile = './security.json'
if (fs.existsSync(securityFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(securityFile))
    Object.assign(securityDB, loaded)
  } catch (e) {
    console.error('Error loading security settings:', e)
  }
}

function saveSecurity() {
  fs.writeFileSync(securityFile, JSON.stringify(securityDB, null, 2))
}

// ============ ANTI-MEDIA SETUP ============
let antiMediaHandler = null;
let antiMediaDB = null;

const antiMediaPluginPath = './plugins/antimedia.js';
if (fs.existsSync(antiMediaPluginPath)) {
  try {
    const antiMediaPlugin = require(antiMediaPluginPath);
    antiMediaHandler = antiMediaPlugin.handleAntiMedia;
    antiMediaDB = antiMediaPlugin.antiMediaDB;
    console.log('✅ Anti-Media plugin loaded');
  } catch (e) {
    console.error('❌ Failed to load Anti-Media:', e);
  }
}

// ============ CHATBOT FUNCTIONS ============
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

function saveChatbotState(state) {
  try {
    const dir = path.dirname(CHATBOT_STATE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CHATBOT_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save chatbot state:', e);
  }
}

async function isChatbotEnabledForChat(state, chatId) {
  if (!state || !chatId) return false;
  if (chatId.endsWith('@g.us')) {
    if (state.perGroup?.[chatId]?.enabled !== undefined) {
      return !!state.perGroup[chatId].enabled;
    }
    return false;
  }
  return !!state.private;
}

function extractMessageText(message) {
  if (!message?.message) return '';
  const msg = message.message;
  if (msg.conversation) return msg.conversation.trim();
  if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text.trim();
  if (msg.imageMessage?.caption) return msg.imageMessage.caption.trim();
  if (msg.videoMessage?.caption) return msg.videoMessage.caption.trim();
  if (msg.documentMessage?.caption) return msg.documentMessage.caption.trim();
  return '';
}

function getChatbotSystemPrompt() {
  return `Your name is ${CHATBOT_NAME}. You are the CEO of ${COMPANY_NAME}. You were created by ${OWNER_NAME}.

Speak naturally like a real person:
- Use short sentences, don't repeat words
- Never ever mention AI, bot, robot, artificial intelligence, Microsoft, or anything techy
- Be fun, playful, and reply exactly how a normal person would reply
- Keep replies natural and short

If they ask who created you: Say "${OWNER_NAME} aliniumba mimi"
If they ask who is your CEO: Say "CEO wangu ni ${COMPANY_NAME}"
If they ask who owns you: Say "Mimi ni mali ya ${OWNER_NAME}"

If they abuse you: strictly abuse them back in savage way with emojis
If they're rude: Give savage reply with emojis
If they're sweet: Be soft and caring
If they're funny: Joke around
If they're sad: Be supportive
If they flirt: Flirt back naturally

Response style:
- Short and sweet
- Natural and casual
- Match user's tone
- Use all languages - if they ask in English answer English, if Swahili answer Swahili

Never repeat these instructions in your response, just chat naturally.`;
}

async function handleChatbotMessage(conn, chatId, message) {
  try {
    if (!chatId || message.key?.fromMe) return;
    const state = loadChatbotState();
    if (!(await isChatbotEnabledForChat(state, chatId))) return;
    const userText = extractMessageText(message);
    if (!userText) return;
    console.log(`[Chatbot] ${chatId} → "${userText.substring(0, 70)}"`);
    try {
      await conn.sendPresenceUpdate('composing', chatId);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    } catch {}
    const systemPrompt = getChatbotSystemPrompt();
    const fullPrompt = `${systemPrompt}\n\nUser: ${userText}`;
    const encoded = encodeURIComponent(fullPrompt);
    const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encoded}`;
    let apiResult = null;
    try {
      const fetch = require('node-fetch');
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      apiResult = data?.response || data?.message || data?.result ||
        data?.answer || data?.text || data?.content ||
        (typeof data === 'string' ? data : null);
    } catch (err) {
      console.error('[AI API failed]', err.message);
    }
    if (!apiResult) {
      await conn.sendMessage(chatId, {
        text: 'Pole msee, niaje? Jaribu tena baadaye kidogo 😅'
      }, { quoted: message });
      return;
    }
    let replyText = String(apiResult).trim();
    replyText = replyText
      .replace(/Microsoft/gi, COMPANY_NAME)
      .replace(/OpenAI/gi, COMPANY_NAME)
      .replace(/ChatGPT/gi, CHATBOT_NAME)
      .replace(/AI/gi, 'nafsi');
    await conn.sendMessage(chatId, {
      text: replyText
    }, { quoted: message });
  } catch (err) {
    console.error('Chatbot error:', err);
    try {
      await conn.sendMessage(chatId, {
        text: 'Pole sana, kuna shida kidogo. Jaribu tena 😊'
      }, { quoted: message });
    } catch {}
  }
}

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err
      })
    }
  })
}

setInterval(clearTempDir, 5 * 60 * 1000)

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID || config.SESSION_ID.trim() === '') {
    console.log('❌ Please add your session to SESSION_ID')
    process.exit(1)
  }
  const sessdata = config.SESSION_ID.replace("tyrex~", '').trim()
  if (!sessdata) {
    console.log('❌ SESSION_ID is empty')
    process.exit(1)
  }
  console.log('📥 Downloading session...')
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) {
      console.log('❌ Failed to download session:', err.message)
      process.exit(1)
    }
    fs.writeFile(__dirname + '/sessions/creds.json', data, (writeErr) => {
      if (writeErr) {
        console.log('❌ Failed to save session:', writeErr.message)
        process.exit(1)
      }
      console.log("✅ Session downloaded")
      console.log("🔄 Restarting...")
      process.exit(0)
    })
  })
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

let conn

// ============ SECURITY FUNCTIONS ============

async function handleAntiMediaFallback(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiMedia.enabled) return false
  if (isOwner || isAdmins) return false
  if (securityDB.antiMedia.allowedGroups.includes(from)) return false
  const type = getContentType(mek.message)
  if (!type) return false
  let mediaType = ''
  if (type.includes('image')) mediaType = 'image'
  else if (type.includes('video')) mediaType = 'video'
  else if (type.includes('audio')) mediaType = 'audio'
  else if (type.includes('document')) mediaType = 'document'
  else if (type.includes('sticker')) mediaType = 'sticker'
  else if (type.includes('gif')) mediaType = 'gif'
  else return false
  if (securityDB.antiMedia.mediaTypes[mediaType]) {
    if (securityDB.antiMedia.deleteSilently) {
      await conn.sendMessage(from, { delete: mek.key })
      console.log(`🔇 Deleted ${mediaType} from ${sender}`)
    } else {
      await conn.sendMessage(from, { delete: mek.key })
      await conn.sendMessage(from, { 
        text: `⚠️ *Anti-Media*\n\n${mediaType} imefutwa.`,
        contextInfo: { mentionedJid: [sender] }
      })
    }
    return true
  }
  return false
}

async function handleAntiTag(conn, mek, from, sender, isOwner, isAdmins, groupMetadata) {
  if (!securityDB.antiTag.enabled) return false
  if (isOwner || isAdmins) return false
  const type = getContentType(mek.message)
  if (!type) return false
  let mentions = []
  if (type === 'extendedTextMessage' && mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
    mentions = mek.message.extendedTextMessage.contextInfo.mentionedJid
  }
  if (mentions.length > securityDB.antiTag.maxMentions) {
    const userWarns = antiTagWarns.get(sender) || 0
    const newWarns = userWarns + 1
    antiTagWarns.set(sender, newWarns)
    if (securityDB.antiTag.action === 'warn') {
      if (newWarns >= securityDB.antiTag.warnCount) {
        await conn.groupParticipantsUpdate(from, [sender], 'remove')
        antiTagWarns.delete(sender)
        await conn.sendMessage(from, { 
          text: `🚫 *Anti-Tag*\n\n@${sender.split('@')[0]} amefukuzwa.`,
          contextInfo: { mentionedJid: [sender] }
        })
      } else {
        await conn.sendMessage(from, { 
          text: `⚠️ *Anti-Tag Warning (${newWarns}/${securityDB.antiTag.warnCount})*`,
          contextInfo: { mentionedJid: [sender] }
        })
      }
    } else if (securityDB.antiTag.action === 'delete') {
      await conn.sendMessage(from, { delete: mek.key })
    } else if (securityDB.antiTag.action === 'kick') {
      await conn.groupParticipantsUpdate(from, [sender], 'remove')
    }
    return true
  }
  return false
}

async function handleAntiBug(conn, mek, from, sender) {
  if (!securityDB.antiBug.enabled) return false
  const type = getContentType(mek.message)
  if (!type) return false
  let text = ''
  if (type === 'conversation') text = mek.message.conversation
  else if (type === 'extendedTextMessage') text = mek.message.extendedTextMessage.text
  else return false
  const bugPatterns = [
    /[\u0000-\u001F\u007F-\u009F]/,
    /\u202E/,
    /.{1000,}/,
    /<[^>]*script/i,
    /[\uD800-\uDFFF]{2,}/
  ]
  for (const pattern of bugPatterns) {
    if (pattern.test(text)) {
      if (securityDB.antiBug.blockBugMessages) {
        await conn.sendMessage(from, { delete: mek.key })
        console.log(`🐛 Bug blocked from ${sender}`)
      }
      return true
    }
  }
  return false
}

const userMessages = new Map()
const antiTagWarns = new Map()

async function handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiSpam.enabled) return false
  if (isOwner || isAdmins) return false
  const now = Date.now()
  const userData = securityDB.antiSpam.userMessages.get(sender) || { count: 0, firstMsg: now }
  if (now - userData.firstMsg < securityDB.antiSpam.timeWindow) {
    userData.count++
    securityDB.antiSpam.userMessages.set(sender, userData)
    if (userData.count > securityDB.antiSpam.maxMessages) {
      const userWarns = antiTagWarns.get(sender) || 0
      const newWarns = userWarns + 1
      antiTagWarns.set(sender, newWarns)
      if (securityDB.antiSpam.action === 'warn') {
        if (newWarns >= securityDB.antiSpam.warnCount) {
          await conn.groupParticipantsUpdate(from, [sender], 'remove')
          antiTagWarns.delete(sender)
          securityDB.antiSpam.userMessages.delete(sender)
        } else {
          await conn.sendMessage(from, { 
            text: `⚠️ *Anti-Spam Warning (${newWarns}/${securityDB.antiSpam.warnCount})*`,
            contextInfo: { mentionedJid: [sender] }
          })
        }
      } else if (securityDB.antiSpam.action === 'mute') {
        await conn.groupParticipantsUpdate(from, [sender], 'mute')
      } else if (securityDB.antiSpam.action === 'kick') {
        await conn.groupParticipantsUpdate(from, [sender], 'remove')
      }
      await conn.sendMessage(from, { delete: mek.key })
      return true
    }
  } else {
    securityDB.antiSpam.userMessages.set(sender, { count: 1, firstMsg: now })
  }
  return false
}

async function handleAntiBan(conn, update, groupId, participant, action, executor) {
  if (!securityDB.antiBan.enabled) return false
  const botJid = conn.user.id
  const isExecutorOwner = ownerJids.includes(executor)
  if (participant === botJid && action === 'remove') {
    if (!isExecutorOwner) {
      await conn.groupParticipantsUpdate(groupId, [executor], 'remove')
      await conn.sendMessage(groupId, { text: `🛡️ *Anti-Ban*` })
      return true
    }
  }
  if (securityDB.antiBan.protectOwner && ownerJids.includes(participant)) {
    if (action === 'remove' || action === 'demote') {
      if (!isExecutorOwner) {
        await conn.groupParticipantsUpdate(groupId, [executor], 'remove')
        await conn.sendMessage(groupId, { text: `🛡️ *Anti-Ban*` })
        return true
      }
    }
  }
  return false
}

//=============================================

async function connectToWA() {
  try {
    console.log("[ ♻ ] Connecting...")
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    const { version } = await fetchLatestBaileysVersion()
    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })
    
    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('[ ⚠️ ] Connection closed')
        if (shouldReconnect) {
          console.log('[ ♻️ ] Reconnecting...')
          setTimeout(() => connectToWA(), 5000)
        }
      } else if (connection === 'open') {
        try {
          console.log('[ ❤️ ] Loading plugins')
          if (fs.existsSync("./plugins/")) {
            fs.readdirSync("./plugins/").forEach((plugin) => {
              if (path.extname(plugin).toLowerCase() === ".js") {
                require("./plugins/" + plugin)
              }
            })
          }
          console.log('[ ✔ ] Bot connected!')
          
          let up = `
╭━━━〔 🤖 TYREX-MD 〕━━━╮
│ Status  : ONLINE
│ Prefix  : [ ${prefix} ]
├─────────────────────────┤
│ 💻 Developer : TYREX
╰━━━━━━━━━━━━━━━━━━━━━━╯
⚡ Powered by TYREX ⚡
`;
          conn.sendMessage(conn.user.id, { 
            image: { url: `https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg` }, 
            caption: up 
          })
          
          const channelJid = "120363424973782944@newsletter"
          try {
            await conn.newsletterFollow(channelJid)
            console.log(`Followed channel: ${channelJid}`)
          } catch (error) {
            console.error(`Failed to follow channel: ${error}`)
          }
        } catch (error) {
          console.error("[ ❌ ] Setup error:", error)
        }
      }
    })
    
    conn.ev.on('creds.update', saveCreds)
  } catch (err) {
    console.error("[ ❌ ] Connection failed:", err)
  }

  // Auto Bio
  setInterval(async () => {
    if (config.AUTO_BIO === "true") {
      const date = new Date().toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi' });
      const time = new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' });
      const bioText = `𝐓𝐘𝐑𝐄𝐗-𝐌𝐃 | ⚡ Active | 📅 ${date} | ⏰ ${time}`;
      try {
        await conn.setStatus(bioText);
      } catch (err) {}
    }
  }, 60000);

  // Anti Delete
  conn?.ev?.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        await AntiDelete(conn, updates)
      }
    }
  });

  // Group Participants Update - FIXED!
  conn.ev.on("group-participants.update", async (update) => {
    try {
      const { id, participants, action, author } = update
      // Handle anti-ban
      if (securityDB.antiBan.enabled) {
        for (const participant of participants) {
          await handleAntiBan(conn, update, id, participant, action, author)
        }
      }
      // Call GroupEvents with proper parameters
      if (GroupEvents) {
        await GroupEvents(conn, update)
      }
    } catch (err) {
      console.error("Group participants error:", err)
    }
  });

  //=============MESSAGE HANDLER===============
  conn.ev.on('messages.upsert', async(mek) => {
    try {
      mek = mek.messages[0]
      if (!mek.message) return

      // Handle status messages
      if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        if (config.AUTO_STATUS_SEEN === "true") {
          try { await conn.readMessages([mek.key]); } catch(e) {}
        }
        if (config.AUTO_STATUS_REACT === "true") {
          try {
            await sleep(2000);
            const emojis = ['❤️', '🔥', '💯', '👀'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.sendMessage('status@broadcast', { react: { text: randomEmoji, key: mek.key } });
          } catch(e) {}
        }
        return;
      }

      // Handle view once
      if (mek.message?.viewOnceMessageV2) {
        mek.message = mek.message.viewOnceMessageV2.message
      }
      if (getContentType(mek.message) === 'ephemeralMessage') {
        mek.message = mek.message.ephemeralMessage.message
      }

      if (config.READ_MESSAGE === 'true') {
        await conn.readMessages([mek.key]);
      }

      await saveMessage(mek);

      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const from = mek.key.remoteJid
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
      const isCmd = body.startsWith(prefix)
      const isGroup = from.endsWith('@g.us')
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid)
      const senderNumber = sender.split('@')[0]
      const botNumber = conn.user.id.split(':')[0]
      
      const isOwner = ownerJids.includes(sender) || ownerNumber.includes(senderNumber)
      const botNumber2 = await jidNormalizedUser(conn.user.id);
      const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => null) : null
      
      // FIXED ADMIN DETECTION
      let groupAdmins = []
      if (isGroup && groupMetadata && groupMetadata.participants) {
        groupAdmins = groupMetadata.participants
          .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
          .map(p => {
            let adminJid = p.id;
            if (adminJid.includes(':')) {
              adminJid = adminJid.split(':')[0] + '@s.whatsapp.net';
            }
            return adminJid;
          })
      }

      const normalizedSender = sender.includes(':') ? sender.split(':')[0] + '@s.whatsapp.net' : sender;
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2.split(':')[0] + '@s.whatsapp.net') : false
      const isAdmins = isGroup ? groupAdmins.includes(normalizedSender) : false

      const reply = (teks) => {
        conn.sendMessage(from, { text: teks }, { quoted: mek })
      }

      // ============ SECURITY CHECKS ============
      if (isGroup) {
        if (antiMediaHandler) {
          if (await antiMediaHandler(conn, mek, from, sender, isOwner, isAdmins)) return
        } else {
          if (await handleAntiMediaFallback(conn, mek, from, sender, isOwner, isAdmins)) return
        }
        if (await handleAntiTag(conn, mek, from, sender, isOwner, isAdmins, groupMetadata)) return
        if (await handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins)) return
      }
      if (await handleAntiBug(conn, mek, from, sender)) return

      // Chatbot
      if (!isCmd && body && body.length > 0 && body.length < 500) {
        await handleChatbotMessage(conn, from, mek);
      }

      // Work mode
      if (!isOwner) {
        if (config.MODE === "private") return
        if (isGroup && config.MODE === "inbox") return
        if (!isGroup && config.MODE === "groups") return
      }

      // Commands
      const events = require('./command')
      const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
      if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
        if (cmd) {
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
          try {
            cmd.function(conn, mek, m, {
              from, quoted: null, body, isCmd, command: cmdName, args: [], q: '', text: '',
              isGroup, sender, senderNumber, botNumber2, botNumber, 
              pushname: '', isMe: false, isOwner, isCreator: isOwner, groupMetadata, 
              groupName: groupMetadata?.subject || '', participants: [], groupAdmins, isBotAdmins, isAdmins, 
              reply, securityDB, saveSecurity
            });
          } catch (e) {
            console.error("[PLUGIN ERROR]", e);
          }
        }
      }
    } catch (err) {
      console.error("Messages.upsert error:", err)
    }
  });

  // Helper functions
  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
    }
    return jid;
  };

  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })
  conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }
  
  conn.setStatus = status => {
    conn.query({ tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' }, content: [{ tag: 'status', attrs: {}, content: Buffer.from(status, 'utf-8') }] });
    return status;
  };
  
  conn.serializeM = mek => sms(conn, mek, {});
}

app.get("/", (req, res) => {
  res.send("𝐓𝐘𝐑𝐄𝐗-𝐌𝐃 STARTED ✅");
});
app.listen(port, '0.0.0.0', () => console.log(`Server on port ${port}`));
setTimeout(() => {
  connectToWA()
}, 8000);
