const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (!args[0]) {
        return reply(`🎵 *TIKTOK DOWNLOADER*\n\n📌 *.tiktok [url]\n📌 Example: *.tiktok https://vm.tiktok.com/xxxxx`);
    }
    
    const url = args[0];
    
    // Check if it's a valid TikTok URL
    if (!url.includes('tiktok.com')) {
        return reply('❌ Tafadhali ingiza TikTok URL halali!');
    }
    
    await reply('⏳ Inapakua video...');
    
    try {
        // Using public TikTok API
        const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.video) {
            const videoUrl = response.data.video.noWatermark || response.data.video;
            await conn.sendMessage(from, { 
                video: { url: videoUrl }, 
                caption: `🎵 *TikTok Video*\n🔗 ${url}`
            }, { quoted: mek });
        } else {
            reply('❌ Haiwezi kupakua video. Jaribu tena baadaye.');
        }
    } catch (e) {
        console.error(e);
        reply('❌ Error: API ina shida. Jaribu tena baadaye.');
    }
});
