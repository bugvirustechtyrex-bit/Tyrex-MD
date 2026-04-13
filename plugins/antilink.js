const { cmd } = require("../command");
const config = require("../config");

// ═══════════════════════════════════════════════════════════════
//                    🔒 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 - LINK SHIELD 🔒
// ═══════════════════════════════════════════════════════════════

// Stylish fake contact
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "TYREX"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// Warning tracker
const warningCount = {};

// ═══════════════════════════════════════════════════════════════
//              🛡️ LINK DETECTOR & PROTECTOR
// ═══════════════════════════════════════════════════════════════
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
  try {
    if (!isGroup || isAdmins || isOwner || !config.ANTI_LINK) return;

    // Smart link detection
    const linkRegex = /((https?:\/\/|www\.)[^\s]+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?)/gi;

    if (linkRegex.test(body)) {
      const mode = config.ANTILINK_MODE || 'delete';

      // Delete the offending message
      await client.sendMessage(from, { delete: message.key });

      if (mode === 'warn') {
        warningCount[sender] = (warningCount[sender] || 0) + 1;
        
        if (warningCount[sender] >= 3) {
            await client.sendMessage(from, { 
                text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
┃      
┃      ⚠️ 𝐅𝐈𝐍𝐀𝐋 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 ⚠️
┃      
┃      👤 @${sender.split("@")[0]}
┃      📊 3/3 Warnings
┃      🔨 Action: Removed
┃      
┃      ❌ "Links = Ban"
┃      
┃      ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
┃      
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            await client.groupParticipantsUpdate(from, [sender], "remove");
            delete warningCount[sender];
        } else {
            await client.sendMessage(from, { 
                text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
┃      
┃      🔗 𝐋𝐈𝐍𝐊 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃 🔗
┃      
┃      👤 @${sender.split("@")[0]}
┃      📊 Warning ${warningCount[sender]}/3
┃      
┃      🚫 Links are forbidden!
┃      💀 ${3 - warningCount[sender]} warnings left
┃      
┃      ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
┃      
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
      } 
      
      else if (mode === 'kick') {
        await client.sendMessage(from, { 
            text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
┃      
┃      🦶 𝐋𝐈𝐍𝐊 = 𝐊𝐈𝐂𝐊 🦶
┃      
┃      👤 @${sender.split("@")[0]}
┃      🔗 Link sent
┃      🚪 User removed
┃      
┃      ❌ No links allowed!
┃      
┃      ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
┃      
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`, 
          mentions: [sender],
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        await client.groupParticipantsUpdate(from, [sender], "remove");
      } 
      
      else {
        await client.sendMessage(from, { 
            text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
┃      
┃      🚫 𝐋𝐈𝐍𝐊 𝐁𝐋𝐎𝐂𝐊𝐄𝐃 🚫
┃      
┃      👤 @${sender.split("@")[0]}
┃      🔗 Link deleted
┃      
┃      📢 Warning: Next time = Kick
┃      
┃      ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
┃      
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
  }
});

// ═══════════════════════════════════════════════════════════════
//              ⚙️ LINK SHIELD CONTROL PANEL
// ═══════════════════════════════════════════════════════════════
cmd({
  pattern: "antilink",
  alias: ["linkshield", "shield"],
  desc: "Configure link protection system",
  category: "group",
  react: "🛡️",
  filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
  try {
    if (!isGroup) {
      return reply("❌ This command works only in groups!");
    }
    
    if (!isAdmins && !isOwner) {
      return reply("🔐 Admin only command!");
    }

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🛡️", additionalInfo = "";

    switch (action) {
      case 'on':
        config.ANTI_LINK = true;
        statusText = "✅ LINK SHIELD ACTIVATED";
        reaction = "✅";
        additionalInfo = "All links will be monitored and blocked";
        break;

      case 'off':
        config.ANTI_LINK = false;
        statusText = "❌ LINK SHIELD DEACTIVATED";
        reaction = "❌";
        additionalInfo = "Links are now allowed in this group";
        break;

      case 'warn':
      case 'kick':
      case 'delete':
        config.ANTI_LINK = true;
        config.ANTILINK_MODE = action;
        statusText = `⚙️ Mode: ${action.toUpperCase()}`;
        reaction = "⚙️";
        additionalInfo = `Bot will ${action} users who send links`;
        break;

      default:
        statusText = `🛡️ LINK SHIELD: ${config.ANTI_LINK ? "ACTIVE ✅" : "INACTIVE ❌"}`;
        additionalInfo = `Mode: ${config.ANTILINK_MODE || 'delete'}\n\nCommands:\n.antilink on/off\n.antilink warn/kick/delete`;
        break;
    }

    await client.sendMessage(from, {
      image: { url: "https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg" },
      caption: `
╔════════════════════════╗
║     🛡️ LINK SHIELD 🛡️     ║
╠════════════════════════╣
║ ${statusText}
║                        
║ 📋 ${additionalInfo}
║                        
╠════════════════════════╣
║ ⚡ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
╚════════════════════════╝
      `,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402325089913@newsletter',
          newsletterName: '© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: fkontak });

    await client.sendMessage(from, {
      react: { text: reaction, key: message.key }
    });

  } catch (error) {
    reply(`❌ Error: ${error.message}`);
  }
});