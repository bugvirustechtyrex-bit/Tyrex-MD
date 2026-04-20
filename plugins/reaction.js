const { cmd } = require("../command");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");
const axios = require("axios");
const config = require("../config");

// ContextInfo function
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

// ==============================================
// 1. CRY COMMAND
// ==============================================
cmd({
    pattern: "cry",
    desc: "Send a crying reaction GIF.",
    category: "fun",
    react: "😢",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is crying over @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is crying!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/cry";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .cry command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 2. CUDDLE COMMAND
// ==============================================
cmd({
    pattern: "cuddle",
    desc: "Send a cuddle reaction GIF.",
    category: "fun",
    react: "🤗",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} cuddled @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is cuddling everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/cuddle";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .cuddle command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 3. BULLY COMMAND
// ==============================================
cmd({
    pattern: "bully",
    desc: "Send a bully reaction GIF.",
    category: "fun",
    react: "😈",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is bullying @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is bullying everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/bully";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .bully command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 4. HUG COMMAND
// ==============================================
cmd({
    pattern: "hug",
    desc: "Send a hug reaction GIF.",
    category: "fun",
    react: "🤗",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} hugged @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is hugging everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/hug";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .hug command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 5. AWOO COMMAND
// ==============================================
cmd({
    pattern: "awoo",
    desc: "Send an awoo reaction GIF.",
    category: "fun",
    react: "🐺",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} awoos at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is awooing everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/awoo";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .awoo command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 6. LICK COMMAND
// ==============================================
cmd({
    pattern: "lick",
    desc: "Send a lick reaction GIF.",
    category: "fun",
    react: "👅",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

        let message = mentionedUser ? `${sender} licked @${mentionedUser.split("@")[0]}` : `${sender} licked themselves!`;

        const apiUrl = "https://api.waifu.pics/sfw/lick";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .lick command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 7. PAT COMMAND
// ==============================================
cmd({
    pattern: "pat",
    desc: "Send a pat reaction GIF.",
    category: "fun",
    react: "🫂",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} patted @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is patting everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/pat";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .pat command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 8. SMUG COMMAND
// ==============================================
cmd({
    pattern: "smug",
    desc: "Send a smug reaction GIF.",
    category: "fun",
    react: "😏",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is smug at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is feeling smug!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/smug";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .smug command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 9. BONK COMMAND
// ==============================================
cmd({
    pattern: "bonk",
    desc: "Send a bonk reaction GIF.",
    category: "fun",
    react: "🔨",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} bonked @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is bonking everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/bonk";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .bonk command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 10. YEET COMMAND
// ==============================================
cmd({
    pattern: "yeet",
    desc: "Send a yeet reaction GIF.",
    category: "fun",
    react: "💨",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} yeeted @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is yeeting everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/yeet";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .yeet command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 11. BLUSH COMMAND
// ==============================================
cmd({
    pattern: "blush",
    desc: "Send a blush reaction GIF.",
    category: "fun",
    react: "😊",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is blushing at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is blushing!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/blush";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .blush command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 12. HANDHOLD COMMAND
// ==============================================
cmd({
    pattern: "handhold",
    desc: "Send a hand-holding reaction GIF.",
    category: "fun",
    react: "🤝",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is holding hands with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} wants to hold hands with everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/handhold";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .handhold command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 13. HIGHFIVE COMMAND
// ==============================================
cmd({
    pattern: "highfive",
    desc: "Send a high-five reaction GIF.",
    category: "fun",
    react: "✋",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} gave a high-five to @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is high-fiving everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/highfive";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .highfive command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 14. NOM COMMAND
// ==============================================
cmd({
    pattern: "nom",
    desc: "Send a nom reaction GIF.",
    category: "fun",
    react: "🍽️",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is nomming @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is nomming everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/nom";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .nom command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 15. WAVE COMMAND
// ==============================================
cmd({
    pattern: "wave",
    desc: "Send a wave reaction GIF.",
    category: "fun",
    react: "👋",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} waved at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is waving at everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/wave";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .wave command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 16. SMILE COMMAND
// ==============================================
cmd({
    pattern: "smile",
    desc: "Send a smile reaction GIF.",
    category: "fun",
    react: "😁",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} smiled at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is smiling at everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/smile";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .smile command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 17. WINK COMMAND
// ==============================================
cmd({
    pattern: "wink",
    desc: "Send a wink reaction GIF.",
    category: "fun",
    react: "😉",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} winked at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is winking at everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/wink";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .wink command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 18. HAPPY COMMAND
// ==============================================
cmd({
    pattern: "happy",
    desc: "Send a happy reaction GIF.",
    category: "fun",
    react: "😊",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is happy with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is happy with everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/happy";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .happy command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 19. GLOMP COMMAND
// ==============================================
cmd({
    pattern: "glomp",
    desc: "Send a glomp reaction GIF.",
    category: "fun",
    react: "🤗",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} glomped @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is glomping everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/glomp";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .glomp command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 20. BITE COMMAND
// ==============================================
cmd({
    pattern: "bite",
    desc: "Send a bite reaction GIF.",
    category: "fun",
    react: "🦷",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} bit @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is biting everyone!`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/bite";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .bite command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 21. POKE COMMAND
// ==============================================
cmd({
    pattern: "poke",
    desc: "Send a poke reaction GIF.",
    category: "fun",
    react: "👉",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} poked @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} poked everyone`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/poke";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .poke command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 22. CRINGE COMMAND
// ==============================================
cmd({
    pattern: "cringe",
    desc: "Send a cringe reaction GIF.",
    category: "fun",
    react: "😬",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} thinks @${mentionedUser.split("@")[0]} is cringe`
            : isGroup
            ? `${sender} finds everyone cringe`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/cringe";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .cringe command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 23. DANCE COMMAND
// ==============================================
cmd({
    pattern: "dance",
    desc: "Send a dance reaction GIF.",
    category: "fun",
    react: "💃",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} danced with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is dancing with everyone`
            : `> © ${config.BOT_NAME} 🖤`;

        const apiUrl = "https://api.waifu.pics/sfw/dance";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .dance command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 24. KILL COMMAND
// ==============================================
cmd({
    pattern: "kill",
    desc: "Send a kill reaction GIF.",
    category: "fun",
    react: "🔪",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message;
        if (mentionedUser) {
            let target = `@${mentionedUser.split("@")[0]}`;
            message = `${sender} killed ${target}`;
        } else if (isGroup) {
            message = `${sender} killed everyone`;
        } else {
            message = `> © ${config.BOT_NAME} 🖤`;
        }

        const apiUrl = "https://api.waifu.pics/sfw/kill";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .kill command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 25. SLAP COMMAND
// ==============================================
cmd({
    pattern: "slap",
    desc: "Send a slap reaction GIF.",
    category: "fun",
    react: "✊",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message;
        if (mentionedUser) {
            let target = `@${mentionedUser.split("@")[0]}`;
            message = `${sender} slapped ${target}`;
        } else if (isGroup) {
            message = `${sender} slapped everyone`;
        } else {
            message = `> © ${config.BOT_NAME} 🖤`;
        }

        const apiUrl = "https://api.waifu.pics/sfw/slap";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .slap command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// 26. KISS COMMAND
// ==============================================
cmd({
    pattern: "kiss",
    desc: "Send a kiss reaction GIF.",
    category: "fun",
    react: "💋",
    filename: __filename,
    use: "@tag (optional)",
},
async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message;
        if (mentionedUser) {
            let target = `@${mentionedUser.split("@")[0]}`;
            message = `${sender} kissed ${target}`;
        } else if (isGroup) {
            message = `${sender} kissed everyone`;
        } else {
            message = `> © ${config.BOT_NAME} 🖤`;
        }

        const apiUrl = "https://api.waifu.pics/sfw/kiss";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean), contextInfo: getContextInfo(mek.sender) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .kiss command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// ==============================================
// REACTION MENU COMMAND
// ==============================================
cmd({
    pattern: "react",
    alias: ["reactions", "reactionmenu"],
    desc: "Show all reaction commands",
    category: "fun",
    react: "🎭",
    filename: __filename
},
async (conn, mek, m, { reply, sender }) => {
    try {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎭 REACTION MENU
┣▣
┣▣ 📌 Commands:
┣▣ 😢 *.cry* - Crying
┣▣ 🤗 *.cuddle* - Cuddle
┣▣ 😈 *.bully* - Bully
┣▣ 🤗 *.hug* - Hug
┣▣ 🐺 *.awoo* - Awoo
┣▣ 👅 *.lick* - Lick
┣▣ 🫂 *.pat* - Pat
┣▣ 😏 *.smug* - Smug
┣▣ 🔨 *.bonk* - Bonk
┣▣ 💨 *.yeet* - Yeet
┣▣ 😊 *.blush* - Blush
┣▣ 🤝 *.handhold* - Handhold
┣▣ ✋ *.highfive* - Highfive
┣▣ 🍽️ *.nom* - Nom
┣▣ 👋 *.wave* - Wave
┣▣ 😁 *.smile* - Smile
┣▣ 😉 *.wink* - Wink
┣▣ 😊 *.happy* - Happy
┣▣ 🤗 *.glomp* - Glomp
┣▣ 🦷 *.bite* - Bite
┣▣ 👉 *.poke* - Poke
┣▣ 😬 *.cringe* - Cringe
┣▣ 💃 *.dance* - Dance
┣▣ 🔪 *.kill* - Kill
┣▣ ✊ *.slap* - Slap
┣▣ 💋 *.kiss* - Kiss
┣▣
┣▣ 💡 Usage: *.hug @user* or *.kiss*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    } catch (error) {
        console.error("❌ Error in .react command:", error);
        reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${error.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});