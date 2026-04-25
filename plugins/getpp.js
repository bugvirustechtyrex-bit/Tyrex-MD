const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    alias: ["pp", "profile", "dp"],
    desc: "Fetch user profile picture natively",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, botFooter }) => {
    try {
        // 1. Identify Target (Reply > Mention > Typed Number > Self)
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else if (q) {
            // Clean the input and format it for WhatsApp JID
            let num = q.replace(/[^0-9]/g, '');
            target = num + '@s.whatsapp.net';
        } else {
            target = m.sender; // Default to the person who sent the command
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // 2. Fetch the Profile Picture Link Natively
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            // Default placeholder image for TYREX MD
            ppUrl = 'https://i.ibb.co/PsJQ5wcQ/RD32353637343330363638313140732e77686174736170702e6e6574-634462.jpg';
        }

        const userNumber = target.split('@')[0];
        
        // Get user's name if available
        let userName = '';
        try {
            const contactInfo = await conn.contactQuery(target);
            userName = contactInfo.verifiedName || contactInfo.pushname || userNumber;
        } catch {
            userName = userNumber;
        }

        // 3. Craft the Stylish TYREX MD Message
        const stylishMsg = `
┏▣ ◈ *TYREX MD* ◈
┣▣ 👤 *USER PROFILE*
┣▣
┣▣ 📋 *DETAILS*
┣▣ 🔹 Name: ${userName}
┣▣ 🔹 Number: @${userNumber}
┣▣ 🔹 Status: ✅ Retrieved
┣▣
┣▣ 🖼️ *PROFILE PICTURE*
┣▣ 🔹 Source: WhatsApp Server
┣▣ 🔹 Quality: High Resolution
┣▣
┣▣ ⚡ *TYREX MD FEATURES*
┣▣ 🔹 Fast & Reliable
┣▣ 🔹 24/7 Active
┣▣ 🔹 Secure Connection
┣▣
┣▣ 📢 *CHANNEL*
┣▣ 🔗 https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02
┣▣
┣▣ 💻 *REPOSITORY*
┣▣ 🔗 https://github.com/bugvirustechtyrex-bit/TyrexBot
┣▣
┣▣ © *Powered By Tyrex Tech*
┗▣
`.trim();

        // 4. Send the result with TYREX styling
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: stylishMsg,
            mentions: [target],
            footer: botFooter || '✨ TYREX MD ✨ | Fast & Reliable'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("TYREX GETPP ERROR:", err);
        reply(`❌ *TYREX MD Error!* \n\n┏▣ ◈ *TYREX MD* ◈
┣▣ ⚠️ Couldn't fetch profile!
┣▣
┣▣ 🔹 User may have hidden their DP
┣▣ 🔹 Or number not on WhatsApp
┣▣
┣▣ 💡 Try: *.pp* [number]
┣▣
┗▣ © Tyrex Tech`);
    }
});
