cmd({
    pattern: "menu3",
    alias: ["help3"],
    desc: "Show second bot menu",
    category: "main",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        let menu = `🔥 ${config.BOT_NAME} 🔥

👑 ${config.OWNER_NAME}

✅ SPAM PERMANENT
✅ SPAM 24 HOURS
✅ UNBAN
`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/xyz.jpg' },
            caption: menu
        });

    } catch (e) {
        console.log(e);
        reply("Error menu3");
    }
});
