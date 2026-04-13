const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "owner",
    alias: ["mods", "developer", "creator"],
    desc: "Contact the bot owner",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Get owner details from config
        const ownerNumber = config.OWNER_NUMBER || "255628378557";
        const ownerName = config.OWNER_NAME || "𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡";
        const botName = config.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        
        // Clean owner number (remove spaces and +)
        const cleanNumber = ownerNumber.replace(/[^0-9]/g, '');
        
        // Create vCard
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:${botName}
TEL;type=CELL;type=VOICE;waid=${cleanNumber}:+${cleanNumber}
NOTE:Bot Developer & Owner
END:VCARD`;

        // Send contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard: vcard }]
            }
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Owner command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});