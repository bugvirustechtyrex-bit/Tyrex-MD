'use strict';
const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const WAIFUPICS_SFW = new Set([
    'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'happy', 'wink', 'poke', 'dance', 'cringe', 'face-palm',
]);

const XWOLF_TYPES = new Set([
    'baka', 'bite', 'blush', 'bonk', 'cry', 'cuddle', 'dance', 'facepalm', 'happy', 'highfive', 'hug', 'kiss', 'laugh', 'megumin', 'neko', 'nervous', 'pat', 'poke', 'punch', 'shinobu', 'slap', 'sleep', 'smile', 'smug', 'stare', 'thumbsup', 'waifu', 'wave', 'wink', 'yawn',
]);

const OTAKUGIFS_TYPES = new Set([
    'agree', 'baka', 'bite', 'blush', 'bored', 'cry', 'dance', 'facepalm', 'happy', 'headbang', 'highfive', 'hug', 'kick', 'kiss', 'laugh', 'nom', 'pat', 'peek', 'poke', 'pout', 'run', 'shrug', 'sip', 'slap', 'smile', 'smug', 'wave', 'wink', 'yeet', 'yikes',
]);

const HMTAI_TYPES = new Set([
    'hug', 'kiss', 'slap', 'pat', 'cry', 'cuddle', 'blush', 'smile', 'wave', 'bonk', 'poke', 'bite', 'lick', 'nom', 'dance', 'happy', 'wink', 'highfive', 'baka', 'punch', 'stare', 'sleep', 'laugh', 'yeet', 'neko', 'waifu', 'smug',
]);

// Detect GIF from buffer magic bytes
function isGifBuf(buf) {
    return buf.length > 5 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
}

async function fetchAnimeImg(category) {
    const norm = category.toLowerCase().trim();
    const waifuType = norm === 'facepalm' ? 'face-palm' : norm;
    const xwolfType = norm === 'face-palm' ? 'facepalm' : norm;
    const otakuType = norm === 'face-palm' ? 'facepalm' : norm;
    const hmtaiType = norm;

    const apis = [
        async () => {
            if (!WAIFUPICS_SFW.has(waifuType)) throw new Error('not supported');
            const res = await axios.get(`https://api.waifu.pics/sfw/${waifuType}`, { timeout: 10000 });
            return res.data?.url || null;
        },
        async () => {
            if (!OTAKUGIFS_TYPES.has(otakuType)) throw new Error('not supported');
            const res = await axios.get(`https://otakugifs.xyz/gif?reaction=${otakuType}`, { timeout: 10000 });
            return res.data?.url || null;
        },
        async () => {
            const res = await axios.get(`https://nekos.best/api/v2/${norm}`, { timeout: 10000 });
            return res.data?.results?.[0]?.url || null;
        },
        async () => {
            if (!HMTAI_TYPES.has(hmtaiType)) throw new Error('not supported');
            const res = await axios.get(`https://hmtai.hatsunia.moe/v2/${hmtaiType}`, { timeout: 10000 });
            return res.data?.url || null;
        },
        async () => {
            if (!XWOLF_TYPES.has(xwolfType)) throw new Error('not supported');
            const res = await axios.get(`https://apis.xwolf.space/api/anime/${xwolfType}`, { timeout: 10000 });
            return res.data?.result?.url || null;
        },
    ];

    for (const api of apis) {
        try {
            const url = await api();
            if (url) return url;
        } catch {}
    }
    return null;
}

async function downloadImg(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(res.data);
}

// Helper function to create anime commands
function createAnimeCommand(name, aliases, description, animeType) {
    cmd({
        pattern: name,
        alias: aliases,
        react: "🎌",
        desc: description,
        category: "anime",
        filename: __filename
    },
    async(conn, mek, m, { from, sender, args, q, reply }) => {
        try {
            const imgUrl = await fetchAnimeImg(animeType);
            if (!imgUrl) throw new Error('No GIF/image found for this reaction');
            
            const buf = await downloadImg(imgUrl);
            const isGif = isGifBuf(buf) || imgUrl.toLowerCase().endsWith('.gif');

            if (isGif) {
                await conn.sendMessage(from, {
                    video: buf,
                    gifPlayback: true,
                    mimetype: 'image/gif',
                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎌 ${name.toUpperCase()}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    image: buf,
                    caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎌 ${name.toUpperCase()}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
                }, { quoted: mek });
            }
        } catch (err) {
            console.error(`Error in ${name} command:`, err);
            await reply(`❌ Failed: ${err.message}`);
        }
    });
}

// Export all commands as module.exports
module.exports = () => {
    // Anime Menu Command
    cmd({
        pattern: "animemenu",
        alias: ["animes", "animelist"],
        react: "🎌",
        desc: "Show all anime commands",
        category: "anime",
        filename: __filename
    },
    async(conn, mek, m, { from, sender, args, q, reply }) => {
        const prefix = global.prefix || '.';
        
        const allCommands = [
            'waifu', 'neko', 'kitsune', 'husbando', 'shinobu', 'megumin',
            'hug', 'kiss', 'slap', 'pat', 'cry', 'cuddle', 'blush', 'smile',
            'wave', 'bonk', 'yeet', 'poke', 'bully', 'bite', 'lick', 'nom',
            'glomp', 'dance', 'happy', 'wink', 'highfive', 'handhold', 'awoo',
            'smug', 'cringe', 'kick', 'baka', 'laugh', 'nervous', 'punch',
            'sleep', 'stare', 'thumbsup', 'yawn', 'facepalm'
        ];
        
        const cats = allCommands.map(c => `┣▣ 📌 ${prefix}${c}`).join('\n');
        
        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 🎌 ANIME COMMANDS
┣▣
${cats}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`,
        }, { quoted: mek });
    });

    // Create all anime commands
    createAnimeCommand('waifu', ['wife', 'waifupic'], 'Random waifu image', 'waifu');
    createAnimeCommand('neko', ['catgirl', 'nekogirl'], 'Random neko/catgirl image', 'neko');
    createAnimeCommand('kitsune', ['foxgirl'], 'Random kitsune/fox girl', 'kitsune');
    createAnimeCommand('husbando', ['husband'], 'Random husbando image', 'husbando');
    createAnimeCommand('shinobu', [], 'Shinobu from Demon Slayer', 'shinobu');
    createAnimeCommand('megumin', [], 'Megumin from KonoSuba', 'megumin');
    createAnimeCommand('hug', ['abraco'], 'Send an anime hug GIF', 'hug');
    createAnimeCommand('kiss', ['beso'], 'Send an anime kiss GIF', 'kiss');
    createAnimeCommand('slap', ['bofetada'], 'Slap someone anime style', 'slap');
    createAnimeCommand('pat', ['patpat', 'headpat'], 'Pat someone on the head', 'pat');
    createAnimeCommand('cry', ['llora', 'crying'], 'Anime crying GIF', 'cry');
    createAnimeCommand('cuddle', ['snuggle'], 'Anime cuddle GIF', 'cuddle');
    createAnimeCommand('blush', ['rubor'], 'Anime blushing GIF', 'blush');
    createAnimeCommand('smile', ['sonrisa'], 'Anime smile GIF', 'smile');
    createAnimeCommand('wave', ['ola', 'hello'], 'Anime wave GIF', 'wave');
    createAnimeCommand('bonk', ['bop'], 'Bonk anime style', 'bonk');
    createAnimeCommand('yeet', [], 'Yeet anime style', 'yeet');
    createAnimeCommand('poke', ['pegar'], 'Poke someone anime style', 'poke');
    createAnimeCommand('bully', ['bully'], 'Anime bully GIF', 'bully');
    createAnimeCommand('bite', ['morder'], 'Anime bite GIF', 'bite');
    createAnimeCommand('lick', ['lamer'], 'Anime lick GIF', 'lick');
    createAnimeCommand('nom', ['chomp'], 'Nom nom anime style', 'nom');
    createAnimeCommand('glomp', ['tackle'], 'Anime glomp GIF', 'glomp');
    createAnimeCommand('dance', ['bailar'], 'Anime dance GIF', 'dance');
    createAnimeCommand('happy', ['feliz'], 'Anime happy GIF', 'happy');
    createAnimeCommand('wink', ['guinar'], 'Anime wink GIF', 'wink');
    createAnimeCommand('highfive', ['choca'], 'Anime high five GIF', 'highfive');
    createAnimeCommand('handhold', ['tomar'], 'Anime hand holding GIF', 'handhold');
    createAnimeCommand('awoo', ['howl'], 'Anime awoo GIF', 'awoo');
    createAnimeCommand('smug', [], 'Anime smug face', 'smug');
    createAnimeCommand('cringe', [], 'Anime cringe GIF', 'cringe');
    createAnimeCommand('kick', ['patada'], 'Anime kick GIF', 'kick');
    createAnimeCommand('baka', ['idiot', 'bakabaka'], 'Anime baka GIF', 'baka');
    createAnimeCommand('laugh', ['lol', 'haha'], 'Anime laugh GIF', 'laugh');
    createAnimeCommand('nervous', ['shy', 'anxious'], 'Anime nervous GIF', 'nervous');
    createAnimeCommand('punch', ['hit', 'fist'], 'Anime punch GIF', 'punch');
    createAnimeCommand('sleep', ['sleepy', 'nap'], 'Anime sleep GIF', 'sleep');
    createAnimeCommand('stare', ['glare', 'gaze'], 'Anime stare GIF', 'stare');
    createAnimeCommand('thumbsup', ['thumbup', 'goodjob'], 'Anime thumbs up GIF', 'thumbsup');
    createAnimeCommand('yawn', ['tired', 'bored'], 'Anime yawn GIF', 'yawn');
    createAnimeCommand('facepalm', ['fp', 'facepalm2'], 'Anime facepalm GIF', 'facepalm');
};