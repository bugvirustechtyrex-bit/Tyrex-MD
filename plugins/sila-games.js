const { cmd } = require('../command');
const axios = require('axios');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
    };
};

// Store game data (in production, use a proper database)
const games = {
    trivia: {},
    tictactoe: {},
    wordchain: {},
    hangman: {},
    mathquiz: {},
    emojiriddle: {},
    wouldyourather: {},
    truthordare: {},
    flipcard: {},
    guessnumber: {}
};

// 1. TRIVIA QUIZ GAME
cmd({
    pattern: "trivia",
    alias: ["quiz", "triviagame"],
    react: "❓",
    desc: "Play trivia quiz game",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, args}) => {
try{
    const userId = sender;
    
    // Start new trivia
    if (!args[0] || args[0].toLowerCase() === 'start') {
        const categories = ['general', 'science', 'history', 'geography', 'sports', 'music', 'film'];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        
        try {
            const response = await axios.get(`https://opentdb.com/api.php?amount=1&category=9&type=multiple`);
            const question = response.data.results[0];
            
            // Store game data
            games.trivia[userId] = {
                question: question.question,
                correct: question.correct_answer,
                options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
                active: true,
                timestamp: Date.now()
            };
            
            const optionsText = games.trivia[userId].options.map((opt, i) => `   ${i + 1}. ${opt}`).join('\n');
            
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❓ ᴛʀɪᴠɪᴀ ǫᴜɪᴢ ❓
╚════════════════════╝

┌─── ✦﹒ǫᴜᴇꜱᴛɪᴏɴ﹒✦ ───┐
│ 📝 ${question.question}
└────────────────────┘

┌─── ✦﹒ᴏᴘᴛɪᴏɴꜱ﹒✦ ───┐
${optionsText}
└────────────────────┘

📌 ᴀɴꜱᴡᴇʀ ᴡɪᴛʜ: *.ᴛʀɪᴠɪᴀ 1/2/3/4*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
        } catch (apiError) {
            reply('❌ ᴛʀɪᴠɪᴀ ᴀᴘɪ ᴇʀʀᴏʀ, ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ');
        }
    }
    // Answer trivia
    else if (!isNaN(args[0]) && games.trivia[userId]?.active) {
        const answerIndex = parseInt(args[0]) - 1;
        const game = games.trivia[userId];
        
        if (answerIndex >= 0 && answerIndex < game.options.length) {
            const selectedAnswer = game.options[answerIndex];
            const isCorrect = selectedAnswer === game.correct;
            
            if (isCorrect) {
                await conn.sendMessage(from, {
                    text: `╔════════════════════╗
║   ✅ ᴄᴏʀʀᴇᴄᴛ! ✅
╚════════════════════╝

┌─── ✦﹒ᴀɴꜱᴡᴇʀ﹒✦ ───┐
│ 🎉 ${game.correct}
└────────────────────┘

🎊 ɢʀᴇᴀᴛ ᴊᴏʙ! ʏᴏᴜ ɢᴏᴛ ɪᴛ ʀɪɢʜᴛ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                
                // Award points (optional)
            } else {
                await conn.sendMessage(from, {
                    text: `╔════════════════════╗
║   ❌ ᴡʀᴏɴɢ! ❌
╚════════════════════╝

┌─── ✦﹒ᴄᴏʀʀᴇᴄᴛ ᴀɴꜱᴡᴇʀ﹒✦ ───┐
│ 📝 ${game.correct}
└────────────────────┘

💪 ᴛʀʏ ᴀɢᴀɪɴ ᴡɪᴛʜ *.ᴛʀɪᴠɪᴀ ꜱᴛᴀʀᴛ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            }
            
            // End game
            delete games.trivia[userId];
        }
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. TIC TAC TOE GAME
cmd({
    pattern: "ttt",
    alias: ["tictactoe", "xoxo"],
    react: "⭕",
    desc: "Play Tic Tac Toe with a friend",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, mentionedJid, isGroup}) => {
try{
    const userId = sender;
    const groupId = isGroup ? from : 'dm';
    const gameId = `${groupId}_${userId}`;
    
    // Initialize new game
    if (!games.tictactoe[gameId]) {
        // Check if opponent mentioned
        let opponent = null;
        if (mentionedJid && mentionedJid.length > 0) {
            opponent = mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            opponent = m.quoted.sender;
        } else {
            return await conn.sendMessage(from, {
                text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴛᴛᴛ @ᴏᴘᴘᴏɴᴇɴᴛ*
📌 ʀᴇᴘʟʏ ᴛᴏ ᴜꜱᴇʀ ᴡɪᴛʜ *.ᴛᴛᴛ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
        
        games.tictactoe[gameId] = {
            board: ['⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜'],
            players: [sender, opponent],
            turn: sender,
            active: true,
            moves: 0
        };
        
        const boardDisplay = displayTTTBoard(games.tictactoe[gameId].board);
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ⭕ ᴛɪᴄ ᴛᴀᴄ ᴛᴏᴇ ⭕
╚════════════════════╝

${boardDisplay}

┌─── ✦﹒ᴘʟᴀʏᴇʀꜱ﹒✦ ───┐
│ ❌ @${sender.split('@')[0]}
│ ⭕ @${opponent.split('@')[0]}
└────────────────────┘

🎮 *ᴛᴜʀɴ:* @${sender.split('@')[0]} (❌)
📌 ᴘʟᴀʏ ᴡɪᴛʜ: *.ᴘʟᴀʏ 1-9*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            mentions: [sender, opponent],
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// Helper function for TTT board
function displayTTTBoard(board) {
    return `┌───┬───┬───┐
│ ${board[0]} │ ${board[1]} │ ${board[2]} │
├───┼───┼───┤
│ ${board[3]} │ ${board[4]} │ ${board[5]} │
├───┼───┼───┤
│ ${board[6]} │ ${board[7]} │ ${board[8]} │
└───┴───┴───┘`;
}

// 3. PLAY MOVE FOR TTT
cmd({
    pattern: "play",
    alias: ["move", "place"],
    react: "🎯",
    desc: "Make a move in Tic Tac Toe",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply, isGroup}) => {
try{
    if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > 9) {
        return reply('❌ ᴘʟᴇᴀꜱᴇ ꜱᴘᴇᴄɪꜰʏ ᴀ ɴᴜᴍʙᴇʀ ʙᴇᴛᴡᴇᴇɴ 1-9');
    }
    
    const groupId = isGroup ? from : 'dm';
    const gameId = `${groupId}_${sender}`;
    const position = parseInt(args[0]) - 1;
    
    if (!games.tictactoe[gameId] || !games.tictactoe[gameId].active) {
        return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ᴛᴛᴛ*');
    }
    
    const game = games.tictactoe[gameId];
    
    if (game.turn !== sender) {
        return reply('❌ ɪᴛ\'ꜱ ɴᴏᴛ ʏᴏᴜʀ ᴛᴜʀɴ');
    }
    
    if (game.board[position] !== '⬜') {
        return reply('❌ ᴛʜᴀᴛ ᴘᴏꜱɪᴛɪᴏɴ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴛᴀᴋᴇɴ');
    }
    
    // Make move
    const symbol = game.players[0] === sender ? '❌' : '⭕';
    game.board[position] = symbol;
    game.moves++;
    
    // Check winner
    const winner = checkTTTWinner(game.board);
    
    if (winner) {
        const winnerName = winner === '❌' ? game.players[0] : game.players[1];
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🏆 ɢᴀᴍᴇ ᴏᴠᴇʀ 🏆
╚════════════════════╝

${displayTTTBoard(game.board)}

┌─── ✦﹒ᴡɪɴɴᴇʀ﹒✦ ───┐
│ 🎉 @${winnerName.split('@')[0]}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            mentions: [winnerName],
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        delete games.tictactoe[gameId];
        return;
    }
    
    // Check draw
    if (game.moves === 9) {
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🤝 ɪᴛ'ꜱ ᴀ ᴅʀᴀᴡ! 🤝
╚════════════════════╝

${displayTTTBoard(game.board)}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        delete games.tictactoe[gameId];
        return;
    }
    
    // Switch turn
    game.turn = game.players[0] === sender ? game.players[1] : game.players[0];
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎯 ᴍᴏᴠᴇ ᴍᴀᴅᴇ 🎯
╚════════════════════╝

${displayTTTBoard(game.board)}

🎮 *ɴᴇxᴛ ᴛᴜʀɴ:* @${game.turn.split('@')[0]}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: [game.turn],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// TTT Winner checker
function checkTTTWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== '⬜' && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// 4. TRUTH OR DARE
cmd({
    pattern: "tod",
    alias: ["truthordare", "truthdare"],
    react: "🎲",
    desc: "Play Truth or Dare",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴛᴏᴅ ᴛʀᴜᴛʜ*
📌 *.ᴛᴏᴅ ᴅᴀʀᴇ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
    
    const truths = [
        "What's the most embarrassing thing you've done in public?",
        "Have you ever lied to your best friend? What about?",
        "Who was your first crush?",
        "What's the biggest trouble you've ever gotten into?",
        "Have you ever stolen anything?",
        "What's your biggest fear in a relationship?",
        "Who do you secretly dislike?",
        "What's the weirdest dream you've ever had?",
        "Have you ever cheated on a test?",
        "What's the most childish thing you still do?",
        "Have you ever read someone's diary or messages without permission?",
        "What's the most embarrassing song you love?",
        "Who would you kiss out of everyone in this group?",
        "What's the biggest lie you've ever told?",
        "Have you ever broken something and blamed someone else?"
    ];
    
    const dares = [
        "Send a random cute message to your last chat",
        "Do 20 push-ups right now",
        "Send your most recent photo to the group",
        "Change your display name to 'BIN-ADNAN Fan' for an hour",
        "Say something nice about everyone in the group",
        "Send a voice message singing any song",
        "Do an impression of someone in the group",
        "Share your screen for 30 seconds",
        "Send a message to your ex (screenshot proof)",
        "Eat something without using your hands",
        "Do a funny dance and send a video",
        "Call someone and sing Happy Birthday to them",
        "Post an embarrassing story on your status",
        "Let someone go through your phone gallery",
        "Speak in a funny accent for the next 3 messages"
    ];
    
    const type = args[0].toLowerCase();
    let result = '';
    let title = '';
    
    if (type === 'truth' || type === 't') {
        result = truths[Math.floor(Math.random() * truths.length)];
        title = 'ʜᴏɴᴇꜱᴛʏ ᴛɪᴍᴇ';
    } else if (type === 'dare' || type === 'd') {
        result = dares[Math.floor(Math.random() * dares.length)];
        title = 'ᴄʜᴀʟʟᴇɴɢᴇ ᴀᴄᴄᴇᴘᴛᴇᴅ';
    } else {
        return reply('❌ ᴜꜱᴇ: *.ᴛᴏᴅ ᴛʀᴜᴛʜ* ᴏʀ *.ᴛᴏᴅ ᴅᴀʀᴇ*');
    }
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎲 ${title} 🎲
╚════════════════════╝

┌─── ✦﹒${type === 'truth' ? 'ᴛʀᴜᴛʜ' : 'ᴅᴀʀᴇ'}﹒✦ ───┐
│ 📝 ${result}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 5. WOULD YOU RATHER
cmd({
    pattern: "wyr",
    alias: ["wouldyourather", "rather"],
    react: "🤔",
    desc: "Would You Rather game",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const questions = [
        {
            q1: "Have the ability to fly",
            q2: "Have the ability to be invisible"
        },
        {
            q1: "Be extremely rich but unhappy",
            q2: "Be poor but extremely happy"
        },
        {
            q1: "Never use social media again",
            q2: "Never watch TV or movies again"
        },
        {
            q1: "Always be 10 minutes late",
            q2: "Always be 20 minutes early"
        },
        {
            q1: "Give up eating for a month",
            q2: "Give up sleeping for a month"
        },
        {
            q1: "Live without music",
            q2: "Live without games"
        },
        {
            q1: "Be famous for something embarrassing",
            q2: "Be completely unknown your whole life"
        },
        {
            q1: "Talk like Yoda",
            q2: "Walk like a penguin forever"
        },
        {
            q1: "Know the history of every object you touch",
            q2: "Know the future of every person you meet"
        },
        {
            q1: "Be able to talk to animals",
            q2: "Be able to speak all human languages"
        }
    ];
    
    const random = questions[Math.floor(Math.random() * questions.length)];
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🤔 ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ... 🤔
╚════════════════════╝

┌─── ✦﹒ᴏᴘᴛɪᴏɴ ᴀ﹒✦ ───┐
│ 1️⃣ ${random.q1}
└────────────────────┘

┌─── ✦﹒ᴏʀ﹒✦ ───┐
│ ✨
└────────────────────┘

┌─── ✦﹒ᴏᴘᴛɪᴏɴ ʙ﹒✦ ───┐
│ 2️⃣ ${random.q2}
└────────────────────┘

📌 ᴀɴꜱᴡᴇʀ ᴡɪᴛʜ: 1 ᴏʀ 2

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 6. EMOJI RIDDLES
cmd({
    pattern: "emojiriddle",
    alias: ["emojigame", "emojipuzzle"],
    react: "😀",
    desc: "Guess the word/phrase from emojis",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const userId = sender;
    
    const riddles = [
        { emoji: "🐶🐱🐭🐹🐰", answer: "pets" },
        { emoji: "🍕🍔🌭🍟🍗", answer: "fast food" },
        { emoji: "🌍🌎🌏", answer: "earth" },
        { emoji: "🎬🍿🎥🎭", answer: "movies" },
        { emoji: "⚽🏀🏈⚾🎾", answer: "sports" },
        { emoji: "🎵🎶🎤🎧💿", answer: "music" },
        { emoji: "📚📖📕📗📘", answer: "books" },
        { emoji: "🚗🚕🚙🚌🚎", answer: "vehicles" },
        { emoji: "☀️🌧️❄️🌈🌪️", answer: "weather" },
        { emoji: "👨‍👩‍👧‍👦🏠❤️", answer: "family" },
        { emoji: "💻⌨️🖥️🖱️📱", answer: "technology" },
        { emoji: "✈️🌴🏖️🌊🧳", answer: "vacation" },
        { emoji: "🥇🥈🥉🏆🎖️", answer: "award" },
        { emoji: "🌙⭐✨☄️🚀", answer: "space" },
        { emoji: "💰💎👑💸💳", answer: "money" }
    ];
    
    if (!args[0] || args[0].toLowerCase() === 'play') {
        const random = riddles[Math.floor(Math.random() * riddles.length)];
        
        games.emojiriddle[userId] = {
            answer: random.answer,
            active: true,
            timestamp: Date.now()
        };
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   😀 ᴇᴍᴏᴊɪ ʀɪᴅᴅʟᴇ 😀
╚════════════════════╝

┌─── ✦﹒ᴇᴍᴏᴊɪꜱ﹒✦ ───┐
│ ${random.emoji}
└────────────────────┘

📌 ɢᴜᴇꜱꜱ ᴛʜᴇ ᴡᴏʀᴅ/ᴘʜʀᴀꜱᴇ
✍️ ᴀɴꜱᴡᴇʀ ᴡɪᴛʜ: *.ᴇᴍᴏᴊɪʀɪᴅᴅʟᴇ ʏᴏᴜʀ_ᴀɴꜱᴡᴇʀ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } else {
        if (!games.emojiriddle[userId]?.active) {
            return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ᴇᴍᴏᴊɪʀɪᴅᴅʟᴇ ᴘʟᴀʏ*');
        }
        
        const guess = args.join(' ').toLowerCase();
        const correct = games.emojiriddle[userId].answer.toLowerCase();
        
        if (guess === correct) {
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ✅ ᴄᴏʀʀᴇᴄᴛ! ✅
╚════════════════════╝

┌─── ✦﹒ᴀɴꜱᴡᴇʀ﹒✦ ───┐
│ 🎉 ${games.emojiriddle[userId].answer}
└────────────────────┘

🎊 ɢʀᴇᴀᴛ ɢᴜᴇꜱꜱ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            delete games.emojiriddle[userId];
        } else {
            reply('❌ ᴡʀᴏɴɢ, ᴛʀʏ ᴀɢᴀɪɴ!');
        }
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 7. MATH QUIZ GAME
cmd({
    pattern: "mathgame",
    alias: ["mathquiz", "maths"],
    react: "🧮",
    desc: "Test your math skills",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const userId = sender;
    const difficulties = ['easy', 'medium', 'hard'];
    
    if (!args[0] || args[0].toLowerCase() === 'play') {
        // Generate random math problem
        const operations = ['+', '-', '*'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;
        
        const difficulty = args[1] || 'medium';
        let maxNum = 10;
        
        if (difficulty === 'easy') maxNum = 10;
        else if (difficulty === 'medium') maxNum = 25;
        else if (difficulty === 'hard') maxNum = 50;
        
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        
        switch(op) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
        }
        
        games.mathquiz[userId] = {
            answer: answer,
            active: true,
            timestamp: Date.now()
        };
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🧮 ᴍᴀᴛʜ ǫᴜɪᴢ 🧮
╚════════════════════╝

┌─── ✦﹒ǫᴜᴇꜱᴛɪᴏɴ﹒✦ ───┐
│ 🔢 ${num1} ${op} ${num2} = ?
└────────────────────┘

┌─── ✦﹒ᴅɪꜰꜰɪᴄᴜʟᴛʏ﹒✦ ───┐
│ 📊 ${difficulty}
└────────────────────┘

✍️ ᴀɴꜱᴡᴇʀ ᴡɪᴛʜ: *.ᴍᴀᴛʜɢᴀᴍᴇ ʏᴏᴜʀ_ᴀɴꜱᴡᴇʀ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } else if (!isNaN(args[0])) {
        if (!games.mathquiz[userId]?.active) {
            return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ᴍᴀᴛʜɢᴀᴍᴇ ᴘʟᴀʏ*');
        }
        
        const userAnswer = parseInt(args[0]);
        
        if (userAnswer === games.mathquiz[userId].answer) {
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ✅ ᴄᴏʀʀᴇᴄᴛ! ✅
╚════════════════════╝

┌─── ✦﹒ᴀɴꜱᴡᴇʀ﹒✦ ───┐
│ 🎉 ${games.mathquiz[userId].answer}
└────────────────────┘

🧠 ʏᴏᴜ'ʀᴇ ᴀ ᴍᴀᴛʜ ɢᴇɴɪᴜꜱ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            delete games.mathquiz[userId];
        } else {
            reply(`❌ ᴡʀᴏɴɢ! ᴛʀʏ ᴀɢᴀɪɴ`);
        }
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 8. WORD CHAIN GAME
cmd({
    pattern: "wordchain",
    alias: ["wordgame", "chain"],
    react: "🔤",
    desc: "Play word chain game",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const userId = sender;
    
    if (!args[0]) {
        // Start new game
        const startWords = ['apple', 'elephant', 'tiger', 'rabbit', 'table', 'chair', 'house', 'yellow'];
        const startWord = startWords[Math.floor(Math.random() * startWords.length)];
        
        games.wordchain[userId] = {
            lastWord: startWord,
            lastLetter: startWord.slice(-1),
            usedWords: [startWord],
            active: true,
            timestamp: Date.now()
        };
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🔤 ᴡᴏʀᴅ ᴄʜᴀɪɴ 🔤
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀʀᴛ ᴡᴏʀᴅ﹒✦ ───┐
│ 📝 ${startWord}
└────────────────────┘

📌 ɴᴇxᴛ ᴡᴏʀᴅ ᴍᴜꜱᴛ ꜱᴛᴀʀᴛ ᴡɪᴛʜ: *${startWord.slice(-1)}*
✍️ ᴘʟᴀʏ ᴡɪᴛʜ: *.ᴡᴏʀᴅᴄʜᴀɪɴ ʏᴏᴜʀ_ᴡᴏʀᴅ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } else {
        if (!games.wordchain[userId]?.active) {
            return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ᴡᴏʀᴅᴄʜᴀɪɴ*');
        }
        
        const word = args[0].toLowerCase();
        const game = games.wordchain[userId];
        
        // Check if word starts with correct letter
        if (word[0] !== game.lastLetter) {
            return reply(`❌ ᴡᴏʀᴅ ᴍᴜꜱᴛ ꜱᴛᴀʀᴛ ᴡɪᴛʜ *${game.lastLetter}*`);
        }
        
        // Check if word already used
        if (game.usedWords.includes(word)) {
            return reply('❌ ᴛʜɪꜱ ᴡᴏʀᴅ ʜᴀꜱ ᴀʟʀᴇᴀᴅʏ ʙᴇᴇɴ ᴜꜱᴇᴅ');
        }
        
        // Add word to chain
        game.usedWords.push(word);
        game.lastWord = word;
        game.lastLetter = word.slice(-1);
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ✅ ɢᴏᴏᴅ ᴍᴏᴠᴇ! ✅
╚════════════════════╝

┌─── ✦﹒ʏᴏᴜʀ ᴡᴏʀᴅ﹒✦ ───┐
│ 📝 ${word}
└────────────────────┘

┌─── ✦﹒ᴡᴏʀᴅꜱ ᴜꜱᴇᴅ﹒✦ ───┐
│ 📋 ${game.usedWords.length}
└────────────────────┘

📌 ɴᴇxᴛ ᴡᴏʀᴅ ᴍᴜꜱᴛ ꜱᴛᴀʀᴛ ᴡɪᴛʜ: *${game.lastLetter}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 9. FLIP CARD MEMORY GAME
cmd({
    pattern: "flip",
    alias: ["memory", "cardgame"],
    react: "🎴",
    desc: "Play memory card flip game",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const userId = sender;
    
    if (!args[0] || args[0].toLowerCase() === 'start') {
        // Create memory cards
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const cards = [...emojis, ...emojis]; // Duplicate for pairs
        const shuffled = cards.sort(() => Math.random() - 0.5);
        
        games.flipcard[userId] = {
            cards: shuffled,
            flipped: [],
            matched: [],
            attempts: 0,
            active: true,
            timestamp: Date.now()
        };
        
        let display = '';
        for (let i = 0; i < shuffled.length; i++) {
            if (i % 4 === 0) display += '┌───┬───┬───┬───┐\n';
            display += `│ ❓ `;
            if (i % 4 === 3) display += '│\n└───┴───┴───┴───┘\n';
        }
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🎴 ᴍᴇᴍᴏʀʏ ɢᴀᴍᴇ 🎴
╚════════════════════╝

${display}

📌 ꜰʟɪᴘ ᴄᴀʀᴅꜱ ᴡɪᴛʜ: *.ꜰʟɪᴘ 1-16*
🎯 ᴍᴀᴛᴄʜ ᴀʟʟ ᴘᴀɪʀꜱ ᴛᴏ ᴡɪɴ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } else if (!isNaN(args[0])) {
        const position = parseInt(args[0]) - 1;
        
        if (!games.flipcard[userId]?.active) {
            return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ꜰʟɪᴘ ꜱᴛᴀʀᴛ*');
        }
        
        const game = games.flipcard[userId];
        
        if (position < 0 || position > 15) {
            return reply('❌ ᴄʜᴏᴏꜱᴇ ᴀ ɴᴜᴍʙᴇʀ ʙᴇᴛᴡᴇᴇɴ 1-16');
        }
        
        if (game.flipped.includes(position) || game.matched.includes(position)) {
            return reply('❌ ᴛʜɪꜱ ᴄᴀʀᴅ ɪꜱ ᴀʟʀᴇᴀᴅʏ ꜰʟɪᴘᴘᴇᴅ ᴏʀ ᴍᴀᴛᴄʜᴇᴅ');
        }
        
        game.flipped.push(position);
        game.attempts++;
        
        // Check if we have two flipped cards
        if (game.flipped.length === 2) {
            const [pos1, pos2] = game.flipped;
            
            if (game.cards[pos1] === game.cards[pos2]) {
                // Match found
                game.matched.push(pos1, pos2);
                game.flipped = [];
                
                if (game.matched.length === 16) {
                    // Game won
                    await conn.sendMessage(from, {
                        text: `╔════════════════════╗
║   🏆 ʏᴏᴜ ᴡᴏɴ! 🏆
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛꜱ﹒✦ ───┐
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${game.attempts}
└────────────────────┘

🎉 ᴄᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴꜱ! ʏᴏᴜ ᴍᴀᴛᴄʜᴇᴅ ᴀʟʟ ᴘᴀɪʀꜱ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                    
                    delete games.flipcard[userId];
                    return;
                }
            } else {
                // No match, flip back after 2 seconds
                setTimeout(() => {
                    game.flipped = [];
                }, 2000);
            }
        }
        
        // Display current board
        let display = '';
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) display += '┌───┬───┬───┬───┐\n';
            
            if (game.matched.includes(i) || game.flipped.includes(i)) {
                display += `│ ${game.cards[i]} `;
            } else {
                display += `│ ❓ `;
            }
            
            if (i % 4 === 3) display += '│\n└───┴───┴───┴───┘\n';
        }
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🎴 ᴍᴇᴍᴏʀʏ ɢᴀᴍᴇ 🎴
╚════════════════════╝

${display}

┌─── ✦﹒ꜱᴛᴀᴛꜱ﹒✦ ───┐
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${game.attempts}
│ ✅ ᴍᴀᴛᴄʜᴇᴅ: ${game.matched.length/2}/8
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 10. NUMBER GUESSING GAME
cmd({
    pattern: "guess",
    alias: ["guessnumber", "numbergame"],
    react: "🎯",
    desc: "Guess the number game",
    category: "game",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    const userId = sender;
    
    if (!args[0] || args[0].toLowerCase() === 'start') {
        // Set difficulty
        let maxNum = 100;
        let attempts = 10;
        const difficulty = args[1] || 'medium';
        
        if (difficulty === 'easy') {
            maxNum = 50;
            attempts = 7;
        } else if (difficulty === 'medium') {
            maxNum = 100;
            attempts = 10;
        } else if (difficulty === 'hard') {
            maxNum = 200;
            attempts = 12;
        }
        
        const secretNumber = Math.floor(Math.random() * maxNum) + 1;
        
        games.guessnumber[userId] = {
            secret: secretNumber,
            maxNum: maxNum,
            attempts: attempts,
            attemptsUsed: 0,
            active: true,
            timestamp: Date.now()
        };
        
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🎯 ɴᴜᴍʙᴇʀ ɢᴜᴇꜱꜱɪɴɢ ɢᴀᴍᴇ 🎯
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 🔢 ʀᴀɴɢᴇ: 1-${maxNum}
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${attempts}
│ 📊 ᴅɪꜰꜰɪᴄᴜʟᴛʏ: ${difficulty}
└────────────────────┘

📌 ɢᴜᴇꜱꜱ ᴡɪᴛʜ: *.ɢᴜᴇꜱꜱ ʏᴏᴜʀ_ɴᴜᴍʙᴇʀ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } else if (!isNaN(args[0])) {
        if (!games.guessnumber[userId]?.active) {
            return reply('❌ ɴᴏ ᴀᴄᴛɪᴠᴇ ɢᴀᴍᴇ. ꜱᴛᴀʀᴛ ᴏɴᴇ ᴡɪᴛʜ *.ɢᴜᴇꜱꜱ ꜱᴛᴀʀᴛ*');
        }
        
        const guess = parseInt(args[0]);
        const game = games.guessnumber[userId];
        
        game.attemptsUsed++;
        
        if (guess === game.secret) {
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   🎉 ʏᴏᴜ ɢᴜᴇꜱꜱᴇᴅ ɪᴛ! 🎉
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛꜱ﹒✦ ───┐
│ 🔢 ɴᴜᴍʙᴇʀ: ${game.secret}
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${game.attemptsUsed}/${game.attempts}
└────────────────────┘

🏆 ɢʀᴇᴀᴛ ᴊᴏʙ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            delete games.guessnumber[userId];
            
        } else if (game.attemptsUsed >= game.attempts) {
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❌ ɢᴀᴍᴇ ᴏᴠᴇʀ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ 🔢 ɴᴜᴍʙᴇʀ ᴡᴀꜱ: ${game.secret}
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${game.attemptsUsed}/${game.attempts}
└────────────────────┘

💪 ʙᴇᴛᴛᴇʀ ʟᴜᴄᴋ ɴᴇxᴛ ᴛɪᴍᴇ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            delete games.guessnumber[userId];
            
        } else {
            let hint = guess < game.secret ? 'ʜɪɢʜᴇʀ ⬆️' : 'ʟᴏᴡᴇʀ ⬇️';
            
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   🎯 ɢᴜᴇꜱꜱ ʀᴇꜱᴜʟᴛ 🎯
╚════════════════════╝

┌─── ✦﹒ʜɪɴᴛ﹒✦ ───┐
│ 💡 ɢᴏ ${hint}
└────────────────────┘

┌─── ✦﹒ᴘʀᴏɢʀᴇꜱꜱ﹒✦ ───┐
│ 🎯 ᴀᴛᴛᴇᴍᴘᴛꜱ: ${game.attemptsUsed}/${game.attempts}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});