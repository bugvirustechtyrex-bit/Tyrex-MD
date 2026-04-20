const { cmd } = require('../command');
const config = require('../config');

// Fake message generator function
function generateFakeMessage(number) {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const lid = cleanNumber + Date.now();
    
    const encodedPayload = 'ewpfYXI6IDEsCnBheWxvYWQ6IHRydWUsIApkb25vcnM6IHxbICdyZXBsYWNlJywKJyNjb250YWN0Rm9ybUNvbnRlbnRBcmVhJywgZmFsc2UsIApbT2JqZWN0XSBdIF0sIApoYXJwOiB7IGhibHA6IHtjb25zaXN0ZW5jeTogW09iamVjdF0sIApyc3JjTWFwOiBbT2JqZWN0XSB9IH0sIAphbGxSZXNvdXJjZXM6IFsgJ0ZXK0doT2InLCAKJ3MxTmRRSXYnLCAnSkk3RGhDNCcgXSwgCmxpZDogJ0xJRF9IRVJFJwp9';
    
    const decoded = Buffer.from(encodedPayload, 'base64').toString('utf-8');
    const result = decoded.replace('LID_HERE', lid);
    const spacing = '\n'.repeat(20);
    
    return result + spacing;
}

cmd({
    pattern: "kenon",
    alias: ["fake", "fakeid", "generatelid"],
    desc: "Generate fake WhatsApp LID/ID",
    category: "tools",
    react: "🎭",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!args[0]) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🎭 FAKE ID GENERATOR
┣▣
┣▣ 📋 USAGE:
┣▣ *.kenon 2557XXXXXXXX
┣▣
┣▣ 📌 Example:
┣▣ *.kenon 255712345678
┣▣
┣▣ 💡 Generates a fake WhatsApp LID
┣▣
┣▣ ⚠️ This is for educational/entertainment
┣▣    purposes only!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        }

        let number = args[0];
        let cleanNumber = number.replace(/[^0-9]/g, '');
        
        if (cleanNumber.length < 10) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID NUMBER
┣▣
┣▣ 📋 Please provide a valid phone number
┣▣    with at least 10 digits!
┣▣
┣▣ 📌 Example: .kenon 255712345678
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        }

        const fakeResult = generateFakeMessage(cleanNumber);
        
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🎭 FAKE ID GENERATED
┣▣
┣▣ 📱 Number: ${cleanNumber}
┣▣ 🆔 LID: ${cleanNumber}${Date.now()}
┣▣
┣▣ 📋 Generated Payload:
┣▣
${fakeResult}
┣▣
┣▣ ⚠️ This is a fake/educational payload
┣▣    Not for malicious use!
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);

    } catch (e) {
        console.error('Kenon command error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});
