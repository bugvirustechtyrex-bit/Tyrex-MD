const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

// Define combined fakevCard
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃 𝐁𝐎𝐓\nORG:𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255770100487:+255770100487\nEND:VCARD`
    }
  }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============================================
// SONG COMMAND - 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃 VERSION
// ============================================
cmd({
    pattern: "song",
    alias: ["mp3", "play", "audio", "music"],
    react: "🎵",
    desc: "Download song from YouTube",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!q) return await conn.sendMessage(from, {
        text: `╔══════════════════════════════════╗
║     🎵 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄 🎵              ║
╠══════════════════════════════════╣
║  ${prefix}song shape of you          ║
║  ${prefix}song https://youtube.com/...║
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    
    // First, search for the song
    let videoData = null;
    let isDirectUrl = false;
    
    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        // It's a direct URL
        isDirectUrl = true;
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        
        if (!videoId) {
            return await conn.sendMessage(from, {
                text: `╔══════════════════════════════════╗
║     ❌ 𝐄𝐑𝐑𝐎𝐑 ❌                   ║
╠══════════════════════════════════╣
║  Invalid YouTube link!             ║
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fakevCard });
        }
        
        // Search to get video info
        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        // It's a search query
        await conn.sendMessage(from, {
            text: `🔍 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐟𝐨𝐫 "${q}"...`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
        
        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return await conn.sendMessage(from, {
                text: `╔══════════════════════════════════╗
║     ❌ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃 ❌                ║
╠══════════════════════════════════╣
║  No results found for "${q}"       ║
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fakevCard });
        }
        
        videoData = search.all[0];
    }
    
    if (!videoData) {
        return await conn.sendMessage(from, {
            text: `╔══════════════════════════════════╗
║     ❌ 𝐄𝐑𝐑𝐎𝐑 ❌                   ║
╠══════════════════════════════════╣
║  Could not get video information!║
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }
    
    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.timestamp || videoData.duration || 'N/A';
    const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
    const author = videoData.author?.name || 'Unknown Artist';
    
    // Send the cover art/thumbnail with song info
    await conn.sendMessage(from, {
        image: { url: thumbnail },
        caption: `╔══════════════════════════════════╗
║     🎵 𝐒𝐎𝐍𝐆 𝐈𝐍𝐅𝐎 🎵               ║
╠══════════════════════════════════╣
║  🎤 *Title:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
║  🎸 *Artist:* ${author}
║  ⏱️ *Duration:* ${duration}
║  👁️ *Views:* ${views}
╚══════════════════════════════════╝

⏳ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐀𝐮𝐝𝐢𝐨...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    
    try {
        // Try using the alternative API first
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData?.status && fallbackData.audio) {
            // Send as audio file ONLY (with metadata)
            await conn.sendMessage(from, {
                audio: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                ptt: false, // Set to true if you want voice note format
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fakevCard });
            
        } else {
            // Fallback to other method
            const apiUrl = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;
            
            let audioUrl = data?.result?.audio || data?.result?.url;
            
            if (audioUrl) {
                // Send as audio file ONLY
                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                    ptt: false,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fakevCard });
                
            } else {
                throw new Error('No audio URL found');
            }
        }
        
    } catch (error) {
        console.error('Download error:', error.message);
        
        // Send error message
        await conn.sendMessage(from, {
            text: `╔══════════════════════════════════╗
║     ❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 ❌          ║
╠══════════════════════════════════╣
║  Reason: ${error.message.substring(0, 30)}${error.message.length > 30 ? '...' : ''}
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }
    
} catch (e) {
    await conn.sendMessage(from, {
        text: `╔══════════════════════════════════╗
║     ❌ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 ❌           ║
╠══════════════════════════════════╣
║  ${e.message.substring(0, 35)}${e.message.length > 35 ? '...' : ''}
╚══════════════════════════════════╝

⚡𝐏𝐨𝐰𝐞𝐫 𝐛𝐲 ʟᴜᴋᴀ ιт⚡`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    l(e);
}
});
