const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const config = require('../config');

const PICHA_VIDEO = 'https://files.catbox.moe/36vahk.png';

const pataMaelezoYaUjumbe = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `✨ ${config.BOT_NAME} ✨`,
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv"],
    desc: "Pakua video kutoka YouTube",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎥 TUMIA VIDEO
┣▣
┣▣ 📌 Tuma URL ya video
┣▣ 📌 Mfano: *.video https://youtu.be/xxx*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: pataMaelezoYaUjumbe({ sender: sender })
            }, { quoted: mek });
        }

        // Tafuta video kwenye YouTube
        const utafutaji = await yts(q);
        
        if (!utafutaji.videos.length) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ HAKUKUPATIKANA
┣▣
┣▣ 📋 Hakupatikana: ${q}
┣▣
┣▣ 💡 Jaribu tena kwa maneno tofauti
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: pataMaelezoYaUjumbe({ sender: sender })
            }, { quoted: mek });
        }

        const data = utafutaji.videos[0];
        const urlYaYt = data.url;

        // Tumia API inayofanya kazi
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(urlYaYt)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ IMESHINDWA KUPATIKANA
┣▣
┣▣ 📋 Video haikupatikana
┣▣ 💡 Jaribu tena baadaye
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: pataMaelezoYaUjumbe({ sender: sender })
            }, { quoted: mek });
        }

        const matokeo = apiRes.result.media;

        const maelezo = `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎬 VIDEO IMEPATIKANA
┣▣
┣▣ 📋 MAELEZO
┣▣ 📌 Kichwa: ${data.title.substring(0, 50)}${data.title.length > 50 ? '...' : ''}
┣▣ ⏱️ Muda: ${data.timestamp}
┣▣ 👀 Mara: ${data.views}
┣▣ 🔗 Kiungo: ${data.url}
┣▣
┣▣ 📌 CHAGUA:
┣▣ 1️⃣ Tuma kama VIDEO
┣▣ 2️⃣ Tuma kama HATI
┣▣
┣▣ 💡 Jibu kwa *1* au *2*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`;

        const ujumbeUliotumwa = await conn.sendMessage(from, {
            image: { url: matokeo.thumbnail || PICHA_VIDEO },
            caption: maelezo,
            contextInfo: pataMaelezoYaUjumbe({ sender: sender })
        }, { quoted: mek });

        const kitambulishoChaUjumbe = ujumbeUliotumwa.key.id;

        // Kipokezi cha ujumbe
        const kipokeziChaUjumbe = async (dataZaUjumbe) => {
            if (!dataZaUjumbe.messages) return;
            
            const ujumbeUlipokea = dataZaUjumbe.messages[0];
            if (!ujumbeUlipokea?.message) return;
            
            const maandishiYaliyopokea = ujumbeUlipokea.message.conversation || ujumbeUlipokea.message.extendedTextMessage?.text;
            const niJibuKwaBot = ujumbeUlipokea.message.extendedTextMessage?.contextInfo?.stanzaId === kitambulishoChaUjumbe;
            const mtumajiID = ujumbeUlipokea.key.remoteJid;

            if (niJibuKwaBot && mtumajiID === from) {
                const chaguo = maandishiYaliyopokea.trim();
                
                try {
                    if (chaguo === "1") {
                        await conn.sendMessage(mtumajiID, {
                            video: { url: matokeo.video_url },
                            mimetype: "video/mp4",
                            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ✅ VIDEO IMETUMWA
┣▣
┣▣ 📌 ${data.title}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                            contextInfo: pataMaelezoYaUjumbe({ sender: sender })
                        }, { quoted: mek });
                    } 
                    else if (chaguo === "2") {
                        await conn.sendMessage(mtumajiID, {
                            document: { url: matokeo.video_url },
                            mimetype: "video/mp4",
                            fileName: `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
                            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📄 VIDEO KAMA HATI
┣▣
┣▣ 📌 ${data.title}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                            contextInfo: pataMaelezoYaUjumbe({ sender: sender })
                        }, { quoted: mek });
                    } 
                    else {
                        await conn.sendMessage(mtumajiID, {
                            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ CHAGUO SIO SAHIHI
┣▣
┣▣ 💡 Tafadhali jibu kwa *1* au *2*
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                            contextInfo: pataMaelezoYaUjumbe({ sender: sender })
                        }, { quoted: mek });
                    }
                } 
                catch (kosa) {
                    console.error("Kosa la kutuma video:", kosa.message);
                    await conn.sendMessage(mtumajiID, {
                        text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ KOSA LA KUTUMA
┣▣
┣▣ 📋 ${kosa.message.substring(0, 50)}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                        contextInfo: pataMaelezoYaUjumbe({ sender: sender })
                    }, { quoted: mek });
                }
                
                conn.ev.off('messages.upsert', kipokeziChaUjumbe);
            }
        };

        conn.ev.on('messages.upsert', kipokeziChaUjumbe);

        setTimeout(() => {
            conn.ev.off('messages.upsert', kipokeziChaUjumbe);
        }, 60000);

    } catch (kosa) {
        console.error('Kosa la Video:', kosa.message);
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ IMESHINDWA KUPATIKANA
┣▣
┣▣ 📋 ${kosa.message.substring(0, 50)}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: pataMaelezoYaUjumbe({ sender: sender })
        }, { quoted: mek });
    }
});