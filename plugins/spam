const { cmd } = require('../command');
const config = require('../config');
const { jidDecode } = require('../lib/jid-utils');
const constants = require('../lib/constants');

// Encode binary node function
const encodeBinaryNode = ({ tag, attrs, content }, opts = constants, buffer = [0]) => {
    const { TAGS, TOKEN_MAP } = opts;
    
    const pushByte = (value) => buffer.push(value & 0xff);
    const pushInt = (value, n, littleEndian = false) => {
        for (let i = 0; i < n; i++) {
            const curShift = littleEndian ? i : n - 1 - i;
            buffer.push((value >> (curShift * 8)) & 0xff);
        }
    };
    const pushBytes = (bytes) => (bytes.forEach(b => buffer.push(b)));
    const pushInt16 = (value) => {
        pushBytes([(value >> 8) & 0xff, value & 0xff]);
    };
    const pushInt20 = (value) => (pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff]));
    
    const writeByteLength = (length) => {
        if (length >= 4294967296) {
            throw new Error('string too large to encode: ' + length);
        }
        if (length >= 1 << 20) {
            pushByte(TAGS.BINARY_32);
            pushInt(length, 4);
        } else if (length >= 256) {
            pushByte(TAGS.BINARY_20);
            pushInt20(length);
        } else {
            pushByte(TAGS.BINARY_8);
            pushByte(length);
        }
    };
    
    const writeStringRaw = (str) => {
        const bytes = Buffer.from(str, 'utf-8');
        writeByteLength(bytes.length);
        pushBytes(bytes);
    };
    
    const writeJid = ({ agent, device, user, server }) => {
        if (typeof agent !== 'undefined' || typeof device !== 'undefined') {
            pushByte(TAGS.AD_JID);
            pushByte(agent || 0);
            pushByte(device || 0);
            writeString(user);
        } else {
            pushByte(TAGS.JID_PAIR);
            if (user.length) {
                writeString(user);
            } else {
                pushByte(TAGS.LIST_EMPTY);
            }
            writeString(server);
        }
    };
    
    const packNibble = (char) => {
        switch (char) {
            case '-': return 10;
            case '.': return 11;
            case '\0': return 15;
            default:
                if (char >= '0' && char <= '9') {
                    return char.charCodeAt(0) - '0'.charCodeAt(0);
                }
                throw new Error(`invalid byte for nibble "${char}"`);
        }
    };
    
    const packHex = (char) => {
        if (char >= '0' && char <= '9') {
            return char.charCodeAt(0) - '0'.charCodeAt(0);
        }
        if (char >= 'A' && char <= 'F') {
            return 10 + char.charCodeAt(0) - 'A'.charCodeAt(0);
        }
        if (char >= 'a' && char <= 'f') {
            return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        if (char === '\0') {
            return 15;
        }
        throw new Error(`Invalid hex char "${char}"`);
    };
    
    const writePackedBytes = (str, type) => {
        if (str.length > TAGS.PACKED_MAX) {
            throw new Error('Too many bytes to pack');
        }
        pushByte(type === 'nibble' ? TAGS.NIBBLE_8 : TAGS.HEX_8);
        let roundedLength = Math.ceil(str.length / 2.0);
        if (str.length % 2 !== 0) {
            roundedLength |= 128;
        }
        pushByte(roundedLength);
        const packFunction = type === 'nibble' ? packNibble : packHex;
        const packBytePair = (v1, v2) => {
            return (packFunction(v1) << 4) | packFunction(v2);
        };
        const strLengthHalf = Math.floor(str.length / 2);
        for (let i = 0; i < strLengthHalf; i++) {
            pushByte(packBytePair(str[2 * i], str[2 * i + 1]));
        }
        if (str.length % 2 !== 0) {
            pushByte(packBytePair(str[str.length - 1], '\x00'));
        }
    };
    
    const isNibble = (str) => {
        if (str.length > TAGS.PACKED_MAX) {
            return false;
        }
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const isInNibbleRange = char >= '0' && char <= '9';
            if (!isInNibbleRange && char !== '-' && char !== '.') {
                return false;
            }
        }
        return true;
    };
    
    const isHex = (str) => {
        if (str.length > TAGS.PACKED_MAX) {
            return false;
        }
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const isInNibbleRange = char >= '0' && char <= '9';
            if (!isInNibbleRange && !(char >= 'A' && char <= 'F') && !(char >= 'a' && char <= 'f')) {
                return false;
            }
        }
        return true;
    };
    
    const writeString = (str) => {
        const tokenIndex = TOKEN_MAP[str];
        if (tokenIndex) {
            if (typeof tokenIndex.dict === 'number') {
                pushByte(TAGS.DICTIONARY_0 + tokenIndex.dict);
            }
            pushByte(tokenIndex.index);
        } else if (isNibble(str)) {
            writePackedBytes(str, 'nibble');
        } else if (isHex(str)) {
            writePackedBytes(str, 'hex');
        } else if (str) {
            const decodedJid = jidDecode(str);
            if (decodedJid) {
                writeJid(decodedJid);
            } else {
                writeStringRaw(str);
            }
        }
    };
    
    const writeListStart = (listSize) => {
        if (listSize === 0) {
            pushByte(TAGS.LIST_EMPTY);
        } else if (listSize < 256) {
            pushBytes([TAGS.LIST_8, listSize]);
        } else {
            pushByte(TAGS.LIST_16);
            pushInt16(listSize);
        }
    };
    
    const validAttributes = Object.keys(attrs).filter(k => (typeof attrs[k] !== 'undefined' && attrs[k] !== null));
    writeListStart(2 * validAttributes.length + 1 + (typeof content !== 'undefined' && content !== null ? 1 : 0));
    writeString(tag);
    
    for (const key of validAttributes) {
        if (typeof attrs[key] === 'string') {
            writeString(key);
            writeString(attrs[key]);
        }
    }
    
    if (typeof content === 'string') {
        writeString(content);
    } else if (Buffer.isBuffer(content) || content instanceof Uint8Array) {
        writeByteLength(content.length);
        pushBytes(content);
    } else if (Array.isArray(content)) {
        writeListStart(content.length);
        for (const item of content) {
            if (item) {
                encodeBinaryNode(item, opts, buffer);
            }
        }
    } else if (typeof content === 'undefined' || content === null) {
        // do nothing
    } else {
        throw new Error(`invalid children for header "${tag}": ${content} (${typeof content})`);
    }
    
    return Buffer.from(buffer);
};

// Command to test binary node encoding
cmd({
    pattern: "binaryencode",
    alias: ["bencode", "encodenode"],
    desc: "Encode a binary node (WhatsApp protocol)",
    category: "tools",
    react: "🔢",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    const botName = config.BOT_NAME;
    
    try {
        if (!args[0]) {
            return await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔢 BINARY NODE ENCODER
┣▣
┣▣ 📋 USAGE:
┣▣ *.binaryencode <tag> <attr> <value>
┣▣
┣▣ 📌 Example:
┣▣ *.binaryencode message to jid
┣▣
┣▣ 💡 Encodes WhatsApp binary protocol nodes
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        }

        const tag = args[0];
        const attrs = {};
        let content = null;

        // Parse simple attributes (key=value format)
        for (let i = 1; i < args.length; i++) {
            if (args[i].includes('=')) {
                const [key, value] = args[i].split('=');
                attrs[key] = value;
            } else if (!content) {
                content = args[i];
            } else {
                content += ' ' + args[i];
            }
        }

        const node = { tag, attrs, content };
        
        const encoded = encodeBinaryNode(node);
        const hexOutput = encoded.toString('hex').toUpperCase();
        
        // Show preview
        const preview = hexOutput.substring(0, 100) + (hexOutput.length > 100 ? '...' : '');
        
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ 🔢 ENCODED BINARY NODE
┣▣
┣▣ 📋 TAG: ${tag}
┣▣ 📋 ATTRS: ${JSON.stringify(attrs)}
┣▣ 📋 CONTENT: ${content || 'null'}
┣▣
┣▣ 📊 SIZE: ${encoded.length} bytes
┣▣ 🔢 HEX: ${preview}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
        
    } catch (e) {
        console.error('Binary encode error:', e);
        await reply(`┏▣ ◈ *${botName}* ◈
┣▣ ❌ ERROR
┣▣
┣▣ 📋 ${e.message}
┣▣
┣▣ ${config.DESCRIPTION}
┗▣`);
    }
});

// Export the encoder function for use in other modules
module.exports = {
    encodeBinaryNode
};
