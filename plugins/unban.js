const { cmd } = require('../command');
const config = require('../config');

// Unban request texts in different languages
const teksUnban1 = () => {
    return 'Hello WhatsApp team, recently my WhatsApp number was suddenly blocked and I couldnt log into my account, in my account there is an important group like a school group and I have to read it but the account My WhatsApp is suddenly blocked, please restore my numbers';
};

const teksUnban2 = () => {
    return 'Equipe, o sistema de vocês baniram meu número por engano. Peço que vocês reativem meu número pois tenho família em outro país e preciso me comunicar com eles';
};

const teksUnban3 = () => {
    return 'Kepada pihak WhatsApp yang bijak Sana kenapa akun WhatsApp saya terblokir padahal aktifitas WhatsApp messenger saya normal normal saja mohon dibukakan kembali akun WhatsApp saya dengan ini saya cantumkan kode nomor akun WhatsApp messenger saya sekian banyak Terimakasih';
};

const teksUnban4 = () => {
    return 'مرحبًا whatsapp ، تم حظر حسابي بشكل دائم أو مؤقت ، يرجى إلغاء حظر حسابي\nالرقم';
};

const teksUnban5 = () => {
    return 'perdi meus documentos junto com meu telefone e cartão SIM. então eu quero que você desative meu número imediatamente fui hackeado tenho medo que alguém possa entrar na minha conta do whatsapp porque tem informações importantes sobre mim o número é';
};

const teksUnban6 = () => {
    return 'Halo pak, Akun Whatsapp Saya diblokir Saya Maaf Saya Telah Menginstal Aplikasi Pihak Ketiga Secara Tidak Sengaja. Harap Buka Blokir Akun Saya Sesegera Mungkin. Terimakasih';
};

const teksUnban7 = () => {
    return 'Dear WhatsApp, wise Sana, why is my WhatsApp account blocked, even though my WhatsApp messenger activities are normal, please reopen my WhatsApp account, I hereby include My WhatsApp messenger account number code, many thanks';
};

const teksUnban8 = () => {
    return 'Olá, equipe do WhatsApp, meu número especial foi banido do whatsapp. Não fiz nada de errado ou não violei os termos e regras da política do WhatsApp. Meu número é';
};

// Command to get unban message
cmd({
    pattern: "unban",
    alias: ["unbanmsg", "unbantext", "ub"],
    react: "🔓",
    desc: "Get WhatsApp unban request message templates",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        const option = args[0]?.toLowerCase();
        
        if (!option) {
            // Show menu
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔓 UNBAN REQUEST TEMPLATES
┣▣
┣▣ 📋 Available templates:
┣▣
┣▣ 1️⃣ *.unban 1* - English
┣▣ 2️⃣ *.unban 2* - Portuguese
┣▣ 3️⃣ *.unban 3* - Indonesian
┣▣ 4️⃣ *.unban 4* - Arabic
┣▣ 5️⃣ *.unban 5* - Portuguese (Hacked)
┣▣ 6️⃣ *.unban 6* - Indonesian (Apology)
┣▣ 7️⃣ *.unban 7* - English (Formal)
┣▣ 8️⃣ *.unban 8* - Portuguese (Appeal)
┣▣
┣▣ 📌 Usage: *.unban [number 1-8]*
┣▣ 📌 Example: *.unban 1*
┣▣
┣▣ 💡 Copy the text and send to WhatsApp support
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        let title = '';
        let message = '';
        
        switch(option) {
            case '1':
                title = '🇬🇧 ENGLISH VERSION';
                message = teksUnban1();
                break;
            case '2':
                title = '🇵🇹 PORTUGUESE VERSION';
                message = teksUnban2();
                break;
            case '3':
                title = '🇮🇩 INDONESIAN VERSION';
                message = teksUnban3();
                break;
            case '4':
                title = '🇸🇦 ARABIC VERSION';
                message = teksUnban4();
                break;
            case '5':
                title = '🇵🇹 PORTUGUESE (HACKED)';
                message = teksUnban5();
                break;
            case '6':
                title = '🇮🇩 INDONESIAN (APOLOGY)';
                message = teksUnban6();
                break;
            case '7':
                title = '🇬🇧 ENGLISH (FORMAL)';
                message = teksUnban7();
                break;
            case '8':
                title = '🇵🇹 PORTUGUESE (APPEAL)';
                message = teksUnban8();
                break;
            default:
                return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ INVALID OPTION
┣▣ 📋 Please choose a number between 1-8
┣▣
┣▣ 📌 Example: *.unban 1*
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        }
        
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔓 UNBAN REQUEST
┣▣
┣▣ 📋 ${title}
┣▣
┣▣ 📝 Message:
┣▣ ${message}
┣▣
┣▣ 💡 Replace with your number where needed
┣▣
┣▣ ⚡ ${botName}
┗▣`);
        
    } catch (e) {
        console.error('Unban command error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// Command to get all unban messages at once
cmd({
    pattern: "allunban",
    alias: ["unbanall", "uball"],
    react: "📚",
    desc: "Get all WhatsApp unban request templates",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const botName = config.BOT_NAME;
    
    try {
        const allMessages = `┏▣ ◈ *${botName}* ◈
┣▣ 📚 ALL UNBAN TEMPLATES
┣▣
┣▣ 1️⃣ ENGLISH:
┣▣ ${teksUnban1().substring(0, 100)}...
┣▣
┣▣ 2️⃣ PORTUGUESE:
┣▣ ${teksUnban2().substring(0, 100)}...
┣▣
┣▣ 3️⃣ INDONESIAN:
┣▣ ${teksUnban3().substring(0, 100)}...
┣▣
┣▣ 4️⃣ ARABIC:
┣▣ ${teksUnban4().substring(0, 100)}...
┣▣
┣▣ 5️⃣ PORTUGUESE (HACKED):
┣▣ ${teksUnban5().substring(0, 100)}...
┣▣
┣▣ 6️⃣ INDONESIAN (APOLOGY):
┣▣ ${teksUnban6().substring(0, 100)}...
┣▣
┣▣ 7️⃣ ENGLISH (FORMAL):
┣▣ ${teksUnban7().substring(0, 100)}...
┣▣
┣▣ 8️⃣ PORTUGUESE (APPEAL):
┣▣ ${teksUnban8().substring(0, 100)}...
┣▣
┣▣ 📌 Use *.unban [1-8]* to get full message
┣▣
┣▣ ⚡ ${botName}
┗▣`;
        
        await reply(allMessages);
        
    } catch (e) {
        console.error('Allunban command error:', e);
        await reply(`┏▣ ◈ *${config.BOT_NAME}* ◈
┣▣ ❌ ERROR
┣▣ 📋 ${e.message}
┣▣
┣▣ ⚡ ${config.BOT_NAME}
┗▣`);
    }
});

// Export functions for use in other files
module.exports = {
    teksUnban1,
    teksUnban2,
    teksUnban3,
    teksUnban4,
    teksUnban5,
    teksUnban6,
    teksUnban7,
    teksUnban8
};