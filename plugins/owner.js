const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    alias: ["creator", "dev"],
    desc: "Show owner contact",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Owner ${config.BOT_NAME}
ORG:SILA TECH
TEL;type=CELL;type=VOICE;waid=255628378557:+255 628 378 557END:VCARD`;

        await conn.sendMessage(from, {
            contacts: {
                displayName: "OWNER",
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, {
            text: "❌ Error sending owner contact!"
        }, { quoted: mek });
    }
});