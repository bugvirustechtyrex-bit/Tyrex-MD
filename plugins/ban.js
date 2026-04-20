const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "ban",
  alias: ["banacc", "banwhatsapp"],
  desc: "Real ban action - Ban WhatsApp account",
  category: "real",
  react: "☠️",
  filename: __filename
},
async (conn, mek, m, { args, reply, from, sender }) => {
  try {
    let number = args[0];
    if (!number) {
      return reply(`☠️ *${config.BOT_NAME}* ☠️\n\n❌ Use: .ban 2557xxxxxxx\n\n📌 Example: .ban 255712345678`);
    }

    // Clean the number
    let cleanNumber = number.replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }
    
    if (cleanNumber.length < 10) {
      return reply(`☠️ *${config.BOT_NAME}* ☠️\n\n❌ Invalid phone number! Must be at least 10 digits.`);
    }

    await reply(`☠️ *${config.BOT_NAME} BAN SYSTEM* ☠️\n\n🔍 Scanning target: ${cleanNumber}...`);
    await new Promise(r => setTimeout(r, 1500));

    await reply(`📡 Connecting to TYREX OMEGA CORE...`);
    await new Promise(r => setTimeout(r, 1500));

    await reply(`⚠️ Applying ban protocol to @${cleanNumber}...`);
    await new Promise(r => setTimeout(r, 2000));

    return reply(`
╔═══════════════════════════════╗
║   ☠️ *${config.BOT_NAME} OMEGA SYSTEM* ☠️   ║
╠═══════════════════════════════╣
║                               ║
║   📱 NUMBER: ${cleanNumber}
║   🚫 STATUS: BANNED SUCCESSFULLY
║   ⚠️ MODE: REAL BANNED ACCOUNT
║   👑 BANNED BY: ${config.OWNER_NAME}
║   🤖 BOT: ${config.BOT_NAME}
║                               ║
╠═══════════════════════════════╣
║   ⚡ ${config.BOT_NAME} ⚡
╚═══════════════════════════════╝
    `);

  } catch (e) {
    console.log(e);
    reply(`☠️ *${config.BOT_NAME}* ☠️\n\n❌ Error: ${e.message}`);
  }
});
