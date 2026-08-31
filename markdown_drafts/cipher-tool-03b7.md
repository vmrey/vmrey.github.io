---
title: TypeScript 轻量可逆加密与混淆工具实战
date: 2026-08-31
category: 前端开发
subcategory: JS 与工具函数
tags: 前端开发,TypeScript,加解密,工具函数,数据安全
summary: 深度解析基于 64 位随机打乱码表与动态异或偏移的纯 TypeScript 轻量可逆加密方案，零外部依赖，完美兼容中文、Emoji、URL 安全与自定义口令。
readTime: 6 分钟阅读
---

# 🔐 TypeScript 轻量可逆加密与混淆工具实战

在前端或全栈业务开发中，我们经常遇到一些**不需要引入笨重庞大的第三方加密库（如 crypto-js），但又需要对敏感字符串进行快速混淆防窥视**的场景：

* **URL 参数防窥视**：防止用户直接肉眼看懂 `userId`、`orderNo` 或关键 Query 参数；
* **二维码与防篡改传参**：生成轻量防爬虫抓取的密文字符串；
* **前端轻量缓存混淆**：避免明文直接暴露在 `localStorage` 或 `sessionStorage` 中；
* **纯 TypeScript、零外部依赖**：即拷即用，体积不到 2KB，性能达到毫秒级。

本文将为您分享一套经过工业级打磨的纯 TypeScript 轻量可逆加密工具库，提供在线交互演示、完整源码、调用示范与绝对路径下载地址。

---

## 一、在线交互演示面板 (Live Playground)

您可以在下方直接输入文本与自定义口令，实时体验加解密效果：

<div style="background: rgba(26, 115, 232, 0.04); border: 1px solid rgba(26, 115, 232, 0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
    <div style="margin-bottom: 14px;">
        <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;">🔑 自定义加密口令 (Key Phrase)：</label>
        <input type="text" id="demoKeyInput" placeholder="输入任意自定义文本（支持重复字符，如 my_super_key），留空使用默认" style="width: 100%; padding: 9px 12px; border: 1px solid #dcdcdc; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
        <div style="font-size: 12px; color: #666; margin-top: 4px;">💡 支持任意长度与重复字符，系统自动由此口令洗牌生成专属 64 位暗号表。</div>
    </div>

    <div style="margin-bottom: 14px;">
        <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;">📝 明文 / 密文字符串 (支持中文/Emoji/URL参数)：</label>
        <textarea id="demoPlainInput" style="width: 100%; height: 80px; padding: 9px 12px; border: 1px solid #dcdcdc; border-radius: 6px; font-size: 14px; box-sizing: border-box; resize: vertical; outline: none; font-family: inherit;">qrcodeNo=12345&name=张三😂&status=VIP</textarea>
    </div>

    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;">
        <button id="demoEncryptBtn" style="flex: 1; min-width: 120px; padding: 10px 16px; background-color: #1a73e8; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;">🔒 加密 (Encrypt)</button>
        <button id="demoDecryptBtn" style="flex: 1; min-width: 120px; padding: 10px 16px; background-color: #5f6368; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;">🔓 解密 (Decrypt)</button>
        <button id="demoCopyBtn" style="flex: 0.6; min-width: 100px; padding: 10px 16px; background-color: #f1f3f4; color: #3c4043; border: 1px solid #dadce0; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;">📋 复制结果</button>
    </div>

    <div>
        <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;">📊 输出结果：</label>
        <div id="demoResultOutput" style="background: rgba(0,0,0,0.03); border: 1px dashed #bbb; padding: 12px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 13px; min-height: 24px; color: #1a73e8; font-weight: 600;">点击上方按钮查看实时运行结果...</div>
    </div>
</div>

<script>
(() => {
    const BASE_ALPHABET = 'X0qP-4iIdcUrmtGnLWw531shzKavoT8bufRMZlDHSFye2Q76CgxjBpA_Vk9YNOJE';

    const deriveKeys = (keyPhrase = '') => {
        const text = String(keyPhrase).trim();
        if (!text) return { cipherMap: BASE_ALPHABET, xorKey: 88 };
        const chars = BASE_ALPHABET.split('');
        let seed = 0x811c9dc5;
        for (let i = 0; i < text.length; i++) {
            seed ^= text.charCodeAt(i);
            seed = Math.imul(seed, 0x01000193) >>> 0;
        }
        const xorKey = seed & 0xff;
        const prng = () => {
            seed = (seed + 0x6D2B79F5) >>> 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(prng() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return { cipherMap: chars.join(''), xorKey };
    };

    const utf8ToBytes = (str) => {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code >= 0xd800 && code <= 0xdbff) {
                const low = str.charCodeAt(++i);
                code = (code - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
            }
            if (code < 0x80) bytes.push(code);
            else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            else if (code < 0x10000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            else bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
        return bytes;
    };

    const bytesToUtf8 = (bytes) => {
        const chars = [];
        let i = 0;
        while (i < bytes.length) {
            const b = bytes[i];
            let code, extra;
            if (b < 0x80) { code = b; extra = 0; }
            else if ((b & 0xe0) === 0xc0) { code = b & 0x1f; extra = 1; }
            else if ((b & 0xf0) === 0xe0) { code = b & 0x0f; extra = 2; }
            else if ((b & 0xf8) === 0xf0) { code = b & 0x07; extra = 3; }
            else { chars.push(''); i++; continue; }
            if (i + extra >= bytes.length) { chars.push(''); break; }
            for (let j = 0; j < extra; j++) code = (code << 6) | (bytes[++i] & 0x3f);
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

    const bytesToBase64 = (bytes, cipherMap) => {
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

    const base64ToBytes = (base64, cipherMap) => {
        if (!base64) return null;
        let clean = String(base64).trim();
        while (clean.endsWith('=')) clean = clean.slice(0, -1);
        if (!clean) return null;
        const bytes = [];
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

    const encryptCore = (str, keyPhrase = '') => {
        if (!str) return '';
        const { cipherMap, xorKey } = deriveKeys(keyPhrase);
        const bytes = utf8ToBytes(str);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = (bytes[i] ^ ((xorKey + i) & 0xff)) & 0xff;
        }
        return bytesToBase64(bytes, cipherMap);
    };

    const decryptCore = (cipher, keyPhrase = '') => {
        if (!cipher) return '';
        const { cipherMap, xorKey } = deriveKeys(keyPhrase);
        const bytes = base64ToBytes(cipher, cipherMap);
        if (!bytes) return '';
        const decoded = [];
        for (let i = 0; i < bytes.length; i++) {
            decoded.push((bytes[i] ^ ((xorKey + i) & 0xff)) & 0xff);
        }
        return bytesToUtf8(decoded);
    };

    window.addEventListener('DOMContentLoaded', () => {
        const keyEl = document.getElementById('demoKeyInput');
        const plainEl = document.getElementById('demoPlainInput');
        const outputEl = document.getElementById('demoResultOutput');
        const encBtn = document.getElementById('demoEncryptBtn');
        const decBtn = document.getElementById('demoDecryptBtn');
        const copyBtn = document.getElementById('demoCopyBtn');

        if (!encBtn) return;

        encBtn.addEventListener('click', () => {
            try {
                const res = encryptCore(plainEl.value, keyEl.value);
                outputEl.style.color = '#137333';
                outputEl.innerText = res || '(明文为空)';
                plainEl.value = res;
            } catch (e) {
                outputEl.style.color = '#c5221f';
                outputEl.innerText = '加密失败: ' + e.message;
            }
        });

        decBtn.addEventListener('click', () => {
            try {
                const res = decryptCore(plainEl.value, keyEl.value);
                if (!res) {
                    outputEl.style.color = '#c5221f';
                    outputEl.innerText = '解密失败：密文不合法或口令不匹配';
                } else {
                    outputEl.style.color = '#137333';
                    outputEl.innerText = res;
                }
            } catch (e) {
                outputEl.style.color = '#c5221f';
                outputEl.innerText = '解密失败: ' + e.message;
            }
        });

        copyBtn.addEventListener('click', () => {
            const txt = outputEl.innerText;
            if (!txt || txt.includes('点击上方') || txt.includes('失败')) return;
            navigator.clipboard.writeText(txt).then(() => {
                const old = copyBtn.innerText;
                copyBtn.innerText = '已复制!';
                setTimeout(() => copyBtn.innerText = old, 1500);
            });
        });
    });
})();
</script>

---

## 二、资源文件与快速进入

该工具已收录至本站文件管理中心，支持在线高亮预览与直接下载：

* 🌐 **文件管理中心在线预览**：[https://vmrey.github.io/files.html](https://vmrey.github.io/files.html)
* 📥 **TypeScript 源码文件直接下载**：[https://vmrey.github.io/assets/files/cipherTool.ts](https://vmrey.github.io/assets/files/cipherTool.ts)

---

## 三、调用示范与实战代码

在项目中将 `cipherTool.ts` 放置于工具目录（例如 `src/utils/cipherTool.ts`），即可直接导入并调用：

```typescript
// 导入 encrypt 和 decrypt 函数（根据你的文件实际路径调整相对路径）
import { encrypt, decrypt } from './utils/cipherTool';

// 示例 1：不使用口令（默认混淆）
const originalText = "Hello, TypeScript!";
const cipherText = encrypt(originalText);
console.log("密文:", cipherText);

const decryptedText = decrypt(cipherText);
console.log("明文:", decryptedText);

// 示例 2：使用自定义加密口令
const secretKey = "my_super_secure_key";
const secureCipher = encrypt("敏感数据：123456", secretKey);
console.log("带口令密文:", secureCipher);

const securePlain = decrypt(secureCipher, secretKey);
console.log("带口令解密:", securePlain);
```

### 进阶用例：中文、Emoji 表情与 URL 参数

```typescript
// 示例 3：原生支持中文、Emoji 与 URL Query 串
const queryParam = "qrcodeNo=88888&user=张三&status=VIP🎉";
const customPassword = "我的专属口令_2026";

// 加密
const encryptedUrlParam = encrypt(queryParam, customPassword);
console.log("URL安全密文:", encryptedUrlParam);
// 输出类似: WHbvsquyz1YNcE_n1xxC7_fKxHxaJwMJ...（完全由 URL-Safe 字符组成）

// 解密还原
const restoredParam = decrypt(encryptedUrlParam, customPassword);
console.log("完美还原:", restoredParam);
// 输出: qrcodeNo=88888&user=张三&status=VIP🎉
```

---

## 四、完整 TypeScript 工具源码 (`cipherTool.ts`)

以下是该工具库的完整源代码实现：

```typescript
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
```

---

## 五、核心技术设计与亮点

1. **口令衍生字典（Key-to-Alphabet Derivation）**：
   * 区别于传统算法要求用户记忆复杂的无重复密钥，本工具允许用户随心输入包含**中文、特殊符号、重复字符**的口令；
   * 通过 FNV-1a 产生 32 位种子，再驱动 Mulberry32 发生器和 Fisher-Yates 算法，自动生成**严格 64 位无碰撞**的专属暗号映射表。

2. **动态异或偏移（Dynamic XOR Offset）**：
   * 采用 `bytes[i] ^ ((xorKey + i) & 0xff)` 公式，引入了位置变量 `i`；
   * 彻底消除了简单静态异或的规律性，相同明文字符在不同位置的密文截然不同。

3. **URL-Safe 与二维码零转义**：
   * 码表严格选用 `A-Z, a-z, 0-9, -, _`；
   * 产生的密文不需要调用 `encodeURIComponent`，可直接作为 GET 参数、二维码内容或文件名称传输。

---

## 六、总结与适用边界

* **推荐场景**：业务 Query 参数防直视、二维码混淆、防初级爬虫、轻量级敏感标记；
* **注意事项**：本工具主要定位为**强力混淆（Heavy Obfuscation）**，兼顾极致轻量与易用性。若涉及银行密码、资金交易等极高安全等级场景，建议配合服务端非对称加密或 AES-GCM 协议使用。
