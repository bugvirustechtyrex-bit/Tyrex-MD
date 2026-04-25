const config = require('../config');
const { cmd } = require('../command');
const { handleAntilink } = require('../lib/antilink');

// BOT NAME
const botName = "꧁༒☬ 𝐓𝐘𝐑𝐄𝐗_MD ☬༒꧂";

cmd({
    pattern: "antilink",
    alias: ["antilink", "al", "linkguard"],
    react: "🛡️",
    desc: "Zuia viungo kwenye group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, args, sender, isAdmins, isCreator }) => {
    
    // Check if in group
    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣ 📋 Command hii inatumika kwenye group pekee!
┣▣
┗▣`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // Check if user is admin (only admins can change antilink settings)
    if (!isAdmins && !isCreator) {
        return await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ ❌ UNAUTHORIZED
┣▣ 📋 Watu walioteuliwa (admins) tu ndio wanaweza kudhibiti antilink!
┣▣
┗▣`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    const type = args[0] ? args[0].toLowerCase() : '';
    const action = args[1] ? args[1].toLowerCase() : '';

    // ========== ANTILINK ON ==========
    if (type === "on") {
        config.ANTILINK = "true";
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ ANTILINK IMEWASHWA
┣▣
┣▣ ✅ Sasa viungo vitazuiliwa kwenye group!
┣▣
┣▣ 📋 Watumiaji wanaotuma viungo:
┣▣ ⚠️ Watachukuliwa hatua kulingana na action
┣▣
┗▣`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // ========== ANTILINK OFF ==========
    if (type === "off") {
        config.ANTILINK = "false";
        await conn.sendMessage(from, { react: { text: "🔓", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `┏▣ ◈ *${botName}* ◈
┣▣ 🔓 ANTILINK IMEZIMWA
┣▣
┣▣ ❌ Viungo vinaruhusiwa sasa kwenye group!
┣▣
┗▣`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });
    }

    // ========== SET ACTION ==========
    if (type === "action") {
        if (['delete', 'warn', 'kick'].includes(action)) {
            config.ANTILINK_ACTION = action;
            
            let actionEmoji = "";
            let actionDesc = "";
            if (action === "delete") {
                actionEmoji = "🗑️";
                actionDesc = "Ujumbe wenye viungo utafutwa tu";
            } else if (action === "warn") {
                actionEmoji = "⚠️";
                actionDesc = "Mtumiaji ataonywa kwanza";
            } else if (action === "kick") {
                actionEmoji = "👢";
                actionDesc = "Mtumiaji atatolewa kwenye group";
            }
            
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ${actionEmoji} ACTION IMEWEKWA
┣▣
┣▣ 📌 Hatua: *${action.toUpperCase()}*
┣▣ 📋 ${actionDesc}
┣▣
┗▣`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        } else {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${botName}* ◈
┣▣ ⚠️ MATUMIZI
┣▣
┣▣ 📌 *.antilink action delete*
┣▣ 📌 *.antilink action warn*
┣▣ 📌 *.antilink action kick*
┣▣
┣▣ 📋 delete - Futa ujumbe tu
┣▣ 📋 warn - Onya mtumiaji
┣▣ 📋 kick - Toa mtumiaji kwenye group
┣▣
┗▣`,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: mek });
        }
    }
    
    // ========== HELP MENU ==========
    return await conn.sendMessage(from, {
        text: `┏▣ ◈ *${botName}* ◈
┣▣ 🛡️ *ANTILINK COMMANDS*
┣▣
┣▣ 📌 *.antilink on*
┣▣    ✅ Washa ulinzi wa viungo
┣▣
┣▣ 📌 *.antilink off*
┣▣    ❌ Zima ulinzi wa viungo
┣▣
┣▣ 📌 *.antilink action delete*
┣▣    🗑️ Futa viungo tu
┣▣
┣▣ 📌 *.antilink action warn*
┣▣    ⚠️ Onya mtumiaji
┣▣
┣▣ 📌 *.antilink action kick*
┣▣    👢 Toa mtumiaji kwenye group
┣▣
┣▣ 💡 *Current Status:*
┣▣ 🛡️ Antilink: ${config.ANTILINK === "true" ? "✅ ON" : "❌ OFF"}
┣▣ ⚙️ Action: ${config.ANTILINK_ACTION || "delete"}
┣▣
┗▣`,
        contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });
});

// ========== AUTO DETECTOR (Body) ==========
cmd({ on: "body" }, async (conn, mek, m, { isGroup, isAdmins, isOwner, isCreator }) => {
    // Check if antilink is enabled
    if (config.ANTILINK !== "true") return;
    
    // Process the message for links
    await handleAntilink(conn, m, { isAdmins, isOwner });
});
