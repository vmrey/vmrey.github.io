/**
 * 轻量可逆加密工具库 (TypeScript 版)
 * 特性：
 * 1. 纯 TypeScript 实现，零外部依赖，极度轻量；
 * 2. 基于 64 位打乱码表 + 动态异或 (XOR) 双重混淆；
 * 3. 完美兼容中文、Emoji、URL 参数串及各类特殊符号；
 * 4. 支持任意文本口令（支持重复字符），自动衍生专属暗号字典。
 */

interface DerivedKeys {
    cipherMap: string;
    xorKey: number;
}

// 基础 64 位 URL-Safe 字符原料（已随机打乱顺序，即使不输入口令也是混淆暗号表）
const BASE_ALPHABET: string = 'X0qP-4iIdcUrmtGnLWw531shzKavoT8bufRMZlDHSFye2Q76CgxjBpA_Vk9YNOJE';

/**
 * 根据用户输入的任意口令，确定性衍生出专属暗号表与异或密钥
 */
const deriveKeys = (keyPhrase: string = ''): DerivedKeys => {
    const text: string = String(keyPhrase).trim();
    if (!text) {
        return {
            cipherMap: BASE_ALPHABET,
            xorKey: 88
        };
    }

    const chars: string[] = BASE_ALPHABET.split('');

    // FNV-1a 哈希生成 32 位种子
    let seed: number = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
        seed ^= text.charCodeAt(i);
        seed = Math.imul(seed, 0x01000193) >>> 0;
    }

    // 异或动态扰动偏置 (0~255)
    const xorKey: number = seed & 0xff;

    // Mulberry32 确定性随机数发生器
    const prng = (): number => {
        seed = (seed + 0x6D2B79F5) >>> 0;
        let t: number = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Fisher-Yates 确定性洗牌算法
    for (let i = chars.length - 1; i > 0; i--) {
        const j: number = Math.floor(prng() * (i + 1));
        const temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
    }

    return {
        cipherMap: chars.join(''),
        xorKey
    };
};

/**
 * 字符串 -> UTF-8 字节数组
 */
const utf8ToBytes = (str: string): number[] => {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
        let code: number = str.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff) {
            const low: number = str.charCodeAt(++i);
            code = (code - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
        }
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
    }
    return bytes;
};

/**
 * UTF-8 字节数组 -> 还原为字符串
 */
const bytesToUtf8 = (bytes: number[]): string => {
    const chars: string[] = [];
    let i = 0;
    while (i < bytes.length) {
        const b = bytes[i];
        let code: number, extra: number;
        if (b < 0x80) {
            code = b; extra = 0;
        } else if ((b & 0xe0) === 0xc0) {
            code = b & 0x1f; extra = 1;
        } else if ((b & 0xf0) === 0xe0) {
            code = b & 0x0f; extra = 2;
        } else if ((b & 0xf8) === 0xf0) {
            code = b & 0x07; extra = 3;
        } else {
            chars.push(''); i++; continue;
        }
        if (i + extra >= bytes.length) {
            chars.push(''); break;
        }
        for (let j = 0; j < extra; j++) {
            code = (code << 6) | (bytes[++i] & 0x3f);
        }
        i++;
        if (code > 0xffff) {
            code -= 0x10000;
            chars.push(String.fromCharCode(0xd800 | (code >> 10), 0xdc00 | (code & 0x3ff)));
        } else {
            chars.push(String.fromCharCode(code));
        }
    }
    return chars.join('');
};

/**
 * 字节数组 -> Base64 密文字符串
 */
const bytesToBase64 = (bytes: number[], cipherMap: string): string => {
    let out = '';
    for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i];
        const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
        out += cipherMap[b0 >> 2];
        out += cipherMap[((b0 & 0x03) << 4) | (b1 >> 4)];
        out += i + 1 < bytes.length ? cipherMap[((b1 & 0x0f) << 2) | (b2 >> 6)] : '=';
        out += i + 2 < bytes.length ? cipherMap[b2 & 0x3f] : '=';
    }
    return out;
};

/**
 * Base64 密文字符串 -> 还原为字节数组
 */
const base64ToBytes = (base64: string, cipherMap: string): number[] | null => {
    if (!base64) return null;
    let clean = String(base64).trim();
    while (clean.endsWith('=')) clean = clean.slice(0, -1);
    if (!clean) return null;
    const bytes: number[] = [];
    let buffer = 0, bits = 0;
    for (let i = 0; i < clean.length; i++) {
        const value = cipherMap.indexOf(clean[i]);
        if (value < 0) return null;
        buffer = ((buffer << 6) | value) & 0xffffffff;
        bits += 6;
        if (bits >= 8) {
            bits -= 8;
            bytes.push((buffer >> bits) & 0xff);
        }
    }
    return bytes;
};

/**
 * 加密函数
 * @param str 需要加密的明文（支持中文、Emoji、URL 参数等）
 * @param keyPhrase 可选的加密口令（支持任意长度与重复字符）
 * @returns 经过混淆编码后的密文字符串
 */
export const encrypt = (str: string, keyPhrase: string = ''): string => {
    if (!str) return '';
    const { cipherMap, xorKey } = deriveKeys(keyPhrase);
    const bytes = utf8ToBytes(str);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = (bytes[i] ^ ((xorKey + i) & 0xff)) & 0xff;
    }
    return bytesToBase64(bytes, cipherMap);
};

/**
 * 解密函数
 * @param cipher 需要解密的密文
 * @param keyPhrase 可选的解密口令（必须与加密时一致）
 * @returns 还原出的原始明文字符串，失败返回空字符串
 */
export const decrypt = (cipher: string, keyPhrase: string = ''): string => {
    if (!cipher) return '';
    const { cipherMap, xorKey } = deriveKeys(keyPhrase);
    const bytes = base64ToBytes(cipher, cipherMap);
    if (!bytes) return '';
    const decoded: number[] = [];
    for (let i = 0; i < bytes.length; i++) {
        decoded.push((bytes[i] ^ ((xorKey + i) & 0xff)) & 0xff);
    }
    return bytesToUtf8(decoded);
};
