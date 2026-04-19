const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const getContextInfo = (m) => {
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

const flags = {
    china: '🇨🇳',
    indonesia: '🇮🇩',
    japan: '🇯🇵',
    korea: '🇰🇷',
    thailand: '🇹🇭'
};

cmd({
    pattern: "beauty",
    alias: ["china", "indonesia", "japan", "korea", "thailand", "chinese", "indo", "japanese", "korean", "thai"],
    react: "😍",
    desc: "Get random beauty image by country",
    category: "fun",
    filename: __filename
},
async(conn, mek, m, {from, command, args, q, sender}) => {
    try{
        // Get country from command or parameter
        let country = q?.trim() || command;
        country = country.toLowerCase();

        // Map aliases to country names
        const countryMap = {
            'chinese': 'china',
            'indo': 'indonesia',
            'jp': 'japan',
            'japanese': 'japan',
            'korean': 'korea',
            'kr': 'korea',
            'thai': 'thailand'
        };

        if (countryMap[country]) {
            country = countryMap[country];
        }

        // Validate country
        const validCountries = ['china', 'indonesia', 'japan', 'korea', 'thailand'];
        if (!validCountries.includes(country)) {
            return await conn.sendMessage(from, {
                text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ INVALID COUNTRY
┣▣
┣▣ 📋 AVAILABLE COUNTRIES
┣▣ 📌 china 🇨🇳
┣▣ 📌 indonesia 🇮🇩
┣▣ 📌 japan 🇯🇵
┣▣ 📌 korea 🇰🇷
┣▣ 📌 thailand 🇹🇭
┣▣
┣▣ 📌 Example: *.beauty china
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Call API with country parameter
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/${country}`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });

        if (!response.data) {
            throw new Error('No response from API');
        }

        const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

        // Send image
        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 😍 RANDOM BEAUTY
┣▣
┣▣ 📋 IMAGE INFO
┣▣ 🌍 COUNTRY: ${countryCapitalized} ${flags[country]}
┣▣ 🎲 TYPE: Random
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (e) {
        let errorMsg = '❌ API service is currently unavailable';
        if (e.response?.status === 429) {
            errorMsg = '❌ Rate limit exceeded';
        } else if (e.response?.status === 500) {
            errorMsg = '❌ Server error';
        } else if (e.code === 'ECONNABORTED') {
            errorMsg = '❌ Request timed out';
        }

        await conn.sendMessage(from, {
            text: `┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ERROR INFO
┣▣ 📋 ${errorMsg}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});