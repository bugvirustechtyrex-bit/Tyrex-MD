const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "repo",
    alias: ["git", "source"],
    react: "📂",
    desc: "Get bot repository link",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const repoUrl = "https://github.com/bugvirustechtyrex-bit/TyrexBot";
    
    try {
        const response = await axios.get(`https://api.github.com/repos/bugvirustechtyrex-bit/TyrexBot`, {
            timeout: 5000
        });
        const stars = response.data.stargazers_count || 0;
        const forks = response.data.forks_count || 0;
        
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📂 GITHUB REPO
┣▣
┣▣ 🔗 ${repoUrl}
┣▣
┣▣ ⭐ Stars: ${stars}
┣▣ 🍴 Forks: ${forks}
┣▣
┣▣ 💡 Star and fork to support!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    } catch (error) {
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ 📂 MY GITHUB
┣▣
┣▣ 🔗 ${repoUrl}
┣▣
┣▣ 💡 Give a ⭐ to support this project!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});
