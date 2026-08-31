/**
 * vmrey.github.io 全局全文检索索引数据库
 * 由 build.js 自动生成构建 (全量收录文章、AI导航、工具、GitHub与附件)
 */
window.SEARCH_DATABASE = window.BLOG_SEARCH_INDEX = [
  {
    "id": "cipher-tool-03b7",
    "type": "post",
    "title": "TypeScript 轻量可逆加密与混淆工具实战",
    "url": "posts/cipher-tool-03b7.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-08-31",
    "tags": [
      "前端开发",
      "TypeScript",
      "加解密",
      "工具函数",
      "数据安全"
    ],
    "summary": "深度解析基于 64 位随机打乱码表与动态异或偏移的纯 TypeScript 轻量可逆加密方案，零外部依赖，完美兼容中文、Emoji、URL 安全与自定义口令。",
    "content": "🔐 TypeScript 轻量可逆加密与混淆工具实战 在前端或全栈业务开发中，我们经常遇到一些 不需要引入笨重庞大的第三方加密库（如 crypto-js），但又需要对敏感字符串进行快速混淆防窥视 的场景： URL 参数防窥视 ：防止用户直接肉眼看懂 userId 、 orderNo 或关键 Query 参数； 二维码与防篡改传参 ：生成轻量防爬虫抓取的密文字符串； 前端轻量缓存混淆 ：避免明文直接暴露在 localStorage 或 sessionStorage 中； 纯 TypeScript、零外部依赖 ：即拷即用，体积不到 2KB，性能达到毫秒级。 本文将为您分享一套经过工业级打磨的纯 TypeScript 轻量可逆加密工具库，提供在线交互演示、完整源码、调用示范与绝对路径下载地址。 --- 一、在线交互演示面板 Live Playground 您可以在下方直接输入文本与自定义口令，实时体验加解密效果： <div style=\"background: rgba 26, 115, 232, 0.04 ; border: 1px solid rgba 26, 115, 232, 0.2 ; border-radius: 12px; padding: 20px; margin: 24px 0;\"> <div style=\"margin-bottom: 14px;\"> <label style=\"display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;\">🔑 自定义加密口令 Key Phrase ：</label> <input type=\"text\" id=\"demoKeyInput\" placeholder=\"输入任意自定义文本（支持重复字符，如 my_super_key），留空使用默认\" style=\"width: 100%; padding: 9px 12px; border: 1px solid dcdcdc; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;\"> <div style=\"font-size: 12px; color: 666; margin-top: 4px;\">💡 支持任意长度与重复字符，系统自动由此口令洗牌生成专属 64 位暗号表。</div> </div> <div style=\"margin-bottom: 14px;\"> <label style=\"display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;\">📝 明文 / 密文字符串 支持中文/Emoji/URL参数 ：</label> <textarea id=\"demoPlainInput\" style=\"width: 100%; height: 80px; padding: 9px 12px; border: 1px solid dcdcdc; border-radius: 6px; font-size: 14px; box-sizing: border-box; resize: vertical; outline: none; font-family: inherit;\">qrcodeNo=12345&name=张三😂&status=VIP</textarea> </div> <div style=\"display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;\"> <button id=\"demoEncryptBtn\" style=\"flex: 1; min-width: 120px; padding: 10px 16px; background-color: 1a73e8; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;\">🔒 加密 Encrypt </button> <button id=\"demoDecryptBtn\" style=\"flex: 1; min-width: 120px; padding: 10px 16px; background-color: 5f6368; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;\">🔓 解密 Decrypt </button> <button id=\"demoCopyBtn\" style=\"flex: 0.6; min-width: 100px; padding: 10px 16px; background-color: f1f3f4; color: 3c4043; border: 1px solid dadce0; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;\">📋 复制结果</button> </div> <div> <label style=\"display: block; font-weight: 600; margin-bottom: 6px; font-size: 14px;\">📊 输出结果：</label> <div id=\"demoResultOutput\" style=\"background: rgba 0,0,0,0.03 ; border: 1px dashed bbb; padding: 12px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 13px; min-height: 24px; color: 1a73e8; font-weight: 600;\">点击上方按钮查看实时运行结果...</div> </div> </div> <script> => { const BASE_ALPHABET = 'X0qP-4iIdcUrmtGnLWw531shzKavoT8bufRMZlDHSFye2Q76CgxjBpA_Vk9YNOJE'; const deriveKeys = keyPhrase = '' => { const text = String keyPhrase .trim ; if !text return { cipherMap: BASE_ALPHABET, xorKey: 88 }; const chars = BASE_ALPHABET.split '' ; let seed = 0x811c9dc5; for let i = 0; i < text.length; i++ { seed ^= text.charCodeAt i ; seed = Math.imul seed, 0x01000193 >>> 0; } const xorKey = seed & 0xff; const prng = => { seed = seed + 0x6D2B79F5 >>> 0; let t = Math.imul seed ^ seed >>> 15 , 1 | seed ; t = t + Math.imul t ^ t >>> 7 , 61 | t ^ t; return t ^ t >>> 14 >>> 0 / 4294967296; }; for let i = chars.length - 1; i > 0; i-- { const j = Math.floor prng i + 1 ; chars i , chars j = chars j , chars i ; } return { cipherMap: chars.join '' , xorKey }; }; const utf8ToBytes = str => { const bytes = ; for let i = 0; i < str.length; i++ { let code = str.charCodeAt i ; if code >= 0xd800 && code <= 0xdbff { const low = str.charCodeAt ++i ; code = code - 0xd800 0x400 + low - 0xdc00 + 0x10000; } if code < 0x80 bytes.push code ; else if code < 0x800 bytes.push 0xc0 | code >> 6 , 0x80 | code & 0x3f ; else if code < 0x10000 bytes.push 0xe0 | code >> 12 , 0x80 | code >> 6 & 0x3f , 0x80 | code & 0x3f ; else bytes.push 0xf0 | code >> 18 , 0x80 | code >> 12 & 0x3f , 0x80 | code >> 6 & 0x3f , 0x80 | code & 0x3f ; } return bytes; }; const bytesToUtf8 = bytes => { const chars = ; let i = 0; while i < bytes.length { const b = bytes i ; let code, extra; if b < 0x80 { code = b; extra = 0; } else if b & 0xe0 === 0xc0 { code = b & 0x1f; extra = 1; } else if b & 0xf0 === 0xe0 { code = b & 0x0f; extra = 2; } else if b & 0xf8 === 0xf0 { code = b & 0x07; extra = 3; } else { chars.push '' ; i++; continue; } if i + extra >= bytes.length { chars.push '' ; break; } for let j = 0; j < extra; j++ code = code << 6 | bytes ++i & 0x3f ; i++; if code > 0xffff { code -= 0x10000; chars.push String.fromCharCode 0xd800 | code >> 10 , 0xdc00 | code & 0x3ff ; } else { chars.push String.fromCharCode code ; } } return chars.join '' ; }; const bytesToBase64 = bytes, cipherMap => { let out = ''; for let i = 0; i < bytes.length; i += 3 { const b0 = bytes i ; const b1 = i + 1 < bytes.length ? bytes i + 1 : 0; const b2 = i + 2 < bytes.length ? bytes i + 2 : 0; out += cipherMap b0 >> 2 ; out += cipherMap b0 & 0x03 << 4 | b1 >> 4 ; out += i + 1 < bytes.length ? cipherMap b1 & 0x0f << 2 | b2 >> 6 : '='; out += i + 2 < bytes.length ? cipherMap b2 & 0x3f : '='; } return out; }; const base64ToBytes = base64, cipherMap => { if !base64 return null; let clean = String base64 .trim ; while clean.endsWith '=' clean = clean.slice 0, -1 ; if !clean return null; const bytes = ; let buffer = 0, bits = 0; for let i = 0; i < clean.length; i++ { const value = cipherMap.indexOf clean i ; if value < 0 return null; buffer = buffer << 6 | value & 0xffffffff; bits += 6; if bits >= 8 { bits -= 8; bytes.push buffer >> bits & 0xff ; } } return bytes; }; const encryptCore = str, keyPhrase = '' => { if !str return ''; const { cipherMap, xorKey } = deriveKeys keyPhrase ; const bytes = utf8ToBytes str ; for let i = 0; i < bytes.length; i++ { bytes i = bytes i ^ xorKey + i & 0xff & 0xff; } return bytesToBase64 bytes, cipherMap ; }; const decryptCore = cipher, keyPhrase = '' => { if !cipher return ''; const { cipherMap, xorKey } = deriveKeys keyPhrase ; const bytes = base64ToBytes cipher, cipherMap ; if !bytes return ''; const decoded = ; for let i = 0; i < bytes.length; i++ { decoded.push bytes i ^ xorKey + i & 0xff & 0xff ; } return bytesToUtf8 decoded ; }; window.addEventListener 'DOMContentLoaded', => { const keyEl = document.getElementById 'demoKeyInput' ; const plainEl = document.getElementById 'demoPlainInput' ; const outputEl = document.getElementById 'demoResultOutput' ; const encBtn = document.getElementById 'demoEncryptBtn' ; const decBtn = document.getElementById 'demoDecryptBtn' ; const copyBtn = document.getElementById 'demoCopyBtn' ; if !encBtn return; encBtn.addEventListener 'click', => { try { const res = encryptCore plainEl.value, keyEl.value ; outputEl.style.color = ' 137333'; outputEl.innerText = res || ' 明文为空 '; plainEl.value = res; } catch e { outputEl.style.color = ' c5221f'; outputEl.innerText = '加密失败: ' + e.message; } } ; decBtn.addEventListener 'click', => { try { const res = decryptCore plainEl.value, keyEl.value ; if !res { outputEl.style.color = ' c5221f'; outputEl.innerText = '解密失败：密文不合法或口令不匹配'; } else { outputEl.style.color = ' 137333'; outputEl.innerText = res; } } catch e { outputEl.style.color = ' c5221f'; outputEl.innerText = '解密失败: ' + e.message; } } ; copyBtn.addEventListener 'click', => { const txt = outputEl.innerText; if !txt || txt.includes '点击上方' || txt.includes '失败' return; navigator.clipboard.writeText txt .then => { const old = copyBtn.innerText; copyBtn.innerText = '已复制!'; setTimeout => copyBtn.innerText = old, 1500 ; } ; } ; } ; } ; </script> --- 二、资源文件与快速进入 该工具已收录至本站文件管理中心，支持在线高亮预览与直接下载： 🌐 文件管理中心在线预览 ： https://vmrey.github.io/files.html https://vmrey.github.io/files.html 📥 TypeScript 源码文件直接下载 ： https://vmrey.github.io/assets/files/cipherTool.ts https://vmrey.github.io/assets/files/cipherTool.ts --- 三、调用示范与实战代码 在项目中将 cipherTool.ts 放置于工具目录（例如 src/utils/cipherTool.ts ），即可直接导入并调用： typescript // 导入 encrypt 和 decrypt 函数（根据你的文件实际路径调整相对路径） import { encrypt, decrypt } from './utils/cipherTool'; // 示例 1：不使用口令（默认混淆） const originalText = \"Hello, TypeScript!\"; const cipherText = encrypt originalText ; console.log \"密文:\", cipherText ; const decryptedText = decrypt cipherText ; console.log \"明文:\", decryptedText ; // 示例 2：使用自定义加密口令 const secretKey = \"my_super_secure_key\"; const secureCipher = encrypt \"敏感数据：123456\", secretKey ; console.log \"带口令密文:\", secureCipher ; const securePlain = decrypt secureCipher, secretKey ; console.log \"带口令解密:\", securePlain ; 进阶用例：中文、Emoji 表情与 URL 参数 typescript // 示例 3：原生支持中文、Emoji 与 URL Query 串 const queryParam = \"qrcodeNo=88888&user=张三&status=VIP🎉\"; const customPassword = \"我的专属口令_2026\"; // 加密 const encryptedUrlParam = encrypt queryParam, customPassword ; console.log \"URL安全密文:\", encryptedUrlParam ; // 输出类似: WHbvsquyz1YNcE_n1xxC7_fKxHxaJwMJ...（完全由 URL-Safe 字符组成） // 解密还原 const restoredParam = decrypt encryptedUrlParam, customPassword ; console.log \"完美还原:\", restoredParam ; // 输出: qrcodeNo=88888&user=张三&status=VIP🎉 --- 四、完整 TypeScript 工具源码 cipherTool.ts 以下是该工具库的完整源代码实现： typescript / 轻量可逆加密工具库 TypeScript 版 特性： 1. 纯 TypeScript 实现，零外部依赖，极度轻量； 2. 基于 64 位打乱码表 + 动态异或 XOR 双重混淆； 3. 完美兼容中文、Emoji、URL 参数串及各类特殊符号； 4. 支持任意文本口令（支持重复字符），自动衍生专属暗号字典。 / interface DerivedKeys { cipherMap: string; xorKey: number; } // 基础 64 位 URL-Safe 字符原料（已随机打乱顺序，即使不输入口令也是混淆暗号表） const BASE_ALPHABET: string = 'X0qP-4iIdcUrmtGnLWw531shzKavoT8bufRMZlDHSFye2Q76CgxjBpA_Vk9YNOJE'; / 根据用户输入的任意口令，确定性衍生出专属暗号表与异或密钥 / const deriveKeys = keyPhrase: string = '' : DerivedKeys => { const text: string = String keyPhrase .trim ; if !text { return { cipherMap: BASE_ALPHABET, xorKey: 88 }; } const chars: string = BASE_ALPHABET.split '' ; // FNV-1a 哈希生成 32 位种子 let seed: number = 0x811c9dc5; for let i = 0; i < text.length; i++ { seed ^= text.charCodeAt i ; seed = Math.imul seed, 0x01000193 >>> 0; } // 异或动态扰动偏置 0~255 const xorKey: number = seed & 0xff; // Mulberry32 确定性随机数发生器 const prng = : number => { seed = seed + 0x6D2B79F5 >>> 0; let t: number = Math.imul seed ^ seed >>> 15 , 1 | seed ; t = t + Math.imul t ^ t >>> 7 , 61 | t ^ t; return t ^ t >>> 14 >>> 0 / 4294967296; }; // Fisher-Yates 确定性洗牌算法 for let i = chars.length - 1; i > 0; i-- { const j: number = Math.floor prng i + 1 ; const temp = chars i ; chars i = chars j ; chars j = temp; } return { cipherMap: chars.join '' , xorKey }; }; / 字符串 -> UTF-8 字节数组 / const utf8ToBytes = str: string : number => { const bytes: number = ; for let i = 0; i < str.length; i++ { let code: number = str.charCodeAt i ; if code >= 0xd800 && code <= 0xdbff { const low: number = str.charCodeAt ++i ; code = code - 0xd800 0x400 + low - 0xdc00 + 0x10000; } if code < 0x80 { bytes.push code ; } else if code < 0x800 { bytes.push 0xc0 | code >> 6 , 0x80 | code & 0x3f ; } else if code < 0x10000 { bytes.push 0xe0 | code >> 12 , 0x80 | code >> 6 & 0x3f , 0x80 | code & 0x3f ; } else { bytes.push 0xf0 | code >> 18 , 0x80 | code >> 12 & 0x3f , 0x80 | code >> 6 & 0x3f , 0x80 | code & 0x3f ; } } return bytes; }; / UTF-8 字节数组 -> 还原为字符串 / const bytesToUtf8 = bytes: number : string => { const chars: string = ; let i = 0; while i < bytes.length { const b = bytes i ; let code: number, extra: number; if b < 0x80 { code = b; extra = 0; } else if b & 0xe0 === 0xc0 { code = b & 0x1f; extra = 1; } else if b & 0xf0 === 0xe0 { code = b & 0x0f; extra = 2; } else if b & 0xf8 === 0xf0 { code = b & 0x07; extra = 3; } else { chars.push '' ; i++; continue; } if i + extra >= bytes.length { chars.push '' ; break; } for let j = 0; j < extra; j++ { code = code << 6 | bytes ++i & 0x3f ; } i++; if code > 0xffff { code -= 0x10000; chars.push String.fromCharCode 0xd800 | code >> 10 , 0xdc00 | code & 0x3ff ; } else { chars.push String.fromCharCode code ; } } return chars.join '' ; }; / 字节数组 -> Base64 密文字符串 / const bytesToBase64 = bytes: number , cipherMap: string : string => { let out = ''; for let i = 0; i < bytes.length; i += 3 { const b0 = bytes i ; const b1 = i + 1 < bytes.length ? bytes i + 1 : 0; const b2 = i + 2 < bytes.length ? bytes i + 2 : 0; out += cipherMap b0 >> 2 ; out += cipherMap b0 & 0x03 << 4 | b1 >> 4 ; out += i + 1 < bytes.length ? cipherMap b1 & 0x0f << 2 | b2 >> 6 : '='; out += i + 2 < bytes.length ? cipherMap b2 & 0x3f : '='; } return out; }; / Base64 密文字符串 -> 还原为字节数组 / const base64ToBytes = base64: string, cipherMap: string : number | null => { if !base64 return null; let clean = String base64 .trim ; while clean.endsWith '=' clean = clean.slice 0, -1 ; if !clean return null; const bytes: number = ; let buffer = 0, bits = 0; for let i = 0; i < clean.length; i++ { const value = cipherMap.indexOf clean i ; if value < 0 return null; buffer = buffer << 6 | value & 0xffffffff; bits += 6; if bits >= 8 { bits -= 8; bytes.push buffer >> bits & 0xff ; } } return bytes; }; / 加密函数 @param str 需要加密的明文（支持中文、Emoji、URL 参数等） @param keyPhrase 可选的加密口令（支持任意长度与重复字符） @returns 经过混淆编码后的密文字符串 / export const encrypt = str: string, keyPhrase: string = '' : string => { if !str return ''; const { cipherMap, xorKey } = deriveKeys keyPhrase ; const bytes = utf8ToBytes str ; for let i = 0; i < bytes.length; i++ { bytes i = bytes i ^ xorKey + i & 0xff & 0xff; } return bytesToBase64 bytes, cipherMap ; }; / 解密函数 @param cipher 需要解密的密文 @param keyPhrase 可选的解密口令（必须与加密时一致） @returns 还原出的原始明文字符串，失败返回空字符串 / export const decrypt = cipher: string, keyPhrase: string = '' : string => { if !cipher return ''; const { cipherMap, xorKey } = deriveKeys keyPhrase ; const bytes = base64ToBytes cipher, cipherMap ; if !bytes return ''; const decoded: number = ; for let i = 0; i < bytes.length; i++ { decoded.push bytes i ^ xorKey + i & 0xff & 0xff ; } return bytesToUtf8 decoded ; }; --- 五、核心技术设计与亮点 1. 口令衍生字典（Key-to-Alphabet Derivation） ： 区别于传统算法要求用户记忆复杂的无重复密钥，本工具允许用户随心输入包含 中文、特殊符号、重复字符 的口令； 通过 FNV-1a 产生 32 位种子，再驱动 Mulberry32 发生器和 Fisher-Yates 算法，自动生成 严格 64 位无碰撞 的专属暗号映射表。 2. 动态异或偏移（Dynamic XOR Offset） ： 采用 bytes i ^ xorKey + i & 0xff 公式，引入了位置变量 i ； 彻底消除了简单静态异或的规律性，相同明文字符在不同位置的密文截然不同。 3. URL-Safe 与二维码零转义 ： 码表严格选用 A-Z, a-z, 0-9, -, _ ； 产生的密文不需要调用 encodeURIComponent ，可直接作为 GET 参数、二维码内容或文件名称传输。 --- 六、总结与适用边界 推荐场景 ：业务 Query 参数防直视、二维码混淆、防初级爬虫、轻量级敏感标记； 注意事项 ：本工具主要定位为 强力混淆（Heavy Obfuscation） ，兼顾极致轻量与易用性。若涉及银行密码、资金交易等极高安全等级场景，建议配合服务端非对称加密或 AES-GCM 协议使用。",
    "sections": [
      {
        "title": "一、在线交互演示面板 (Live Playground)",
        "anchor": "#一-在线交互演示面板-live-playground",
        "id": "一-在线交互演示面板-live-playground"
      },
      {
        "title": "二、资源文件与快速进入",
        "anchor": "#二-资源文件与快速进入",
        "id": "二-资源文件与快速进入"
      },
      {
        "title": "三、调用示范与实战代码",
        "anchor": "#三-调用示范与实战代码",
        "id": "三-调用示范与实战代码"
      },
      {
        "title": "进阶用例：中文、Emoji 表情与 URL 参数",
        "anchor": "#进阶用例-中文-emoji-表情与-url-参数",
        "id": "进阶用例-中文-emoji-表情与-url-参数"
      },
      {
        "title": "四、完整 TypeScript 工具源码 (`cipherTool.ts`)",
        "anchor": "#四-完整-typescript-工具源码-ciphertool-ts",
        "id": "四-完整-typescript-工具源码-ciphertool-ts"
      },
      {
        "title": "五、核心技术设计与亮点",
        "anchor": "#五-核心技术设计与亮点",
        "id": "五-核心技术设计与亮点"
      },
      {
        "title": "六、总结与适用边界",
        "anchor": "#六-总结与适用边界",
        "id": "六-总结与适用边界"
      }
    ]
  },
  {
    "id": "miniprogram-form-bugs-248d",
    "type": "post",
    "title": "微信小程序与跨端开发排坑：彻底搞定键盘遮挡与输入框文字溢出（全平台兼容指南）",
    "url": "posts/miniprogram-form-bugs-248d.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-08-29",
    "tags": [
      "前端开发",
      "微信小程序",
      "uni-app",
      "跨端开发",
      "CSS",
      "避坑指南"
    ],
    "summary": "深入剖析微信小程序与移动端跨端（uni-app/H5）开发中两大高频表单交互 Bug——软键盘遮挡输入框与 Flex 占位符溢出挤压，提供小程序、iOS、Android、HarmonyOS 与 H5 全系统兼容解决方案与避坑清单。",
    "content": "微信小程序与跨端开发排坑：彻底搞定键盘遮挡与输入框文字溢出（全平台兼容指南） 在移动端与跨端开发（微信小程序、uni-app、移动端 H5、混合 Webview）中，表单页面的 UI 布局与输入交互向来是线上 Bug 的高发区。开发者经常会遇到两类极其顽固且在多端表现各异的体验问题： 1. 软键盘弹起时输入框“半遮面” ：键盘升起后，页面虽有推顶，但输入框只露出一半，下半部及下边框被键盘死死遮挡； 2. 多列表单横向挤压变形 ：在双列或多列等分栅格中，右侧输入框的长 placeholder 占位符越界撑爆父容器，导致相邻的左侧输入框被挤压甚至无法点击。 本文针对 微信小程序（Android / iOS / 鸿蒙 HarmonyOS NEXT） 、 移动端 H5（iOS Safari / Android Chrome / 鸿蒙 ArkWeb） 以及 uni-app 跨端 App 进行底层原理解析，并提供完整的全平台兼容适配代码与实战自检清单。 --- 📊 一、全平台兼容性与底层机制矩阵 不同操作系统与运行时环境处理软键盘与表单渲染的底层机制差异极大，了解这些机制是写出高健壮性代码的前提： | 平台 / 操作系统 | 键盘弹起核心机制 | cursor-spacing 属性支持度 | adjust-position 属性支持度 | Flex min-width: 0 CSS 规范支持度 | 核心失效 / 踩坑场景 | | :--- | :--- | :--- | :--- | :--- | :--- | | 微信小程序 iOS | 微信原生渲染层推顶 | 🟢 完美支持 单位 px | 🟢 完美支持 | 🟢 100% 完美支持 | 页面套用了固定高度 height: 100% 或 overflow: hidden 导致推顶被阻断 | | 微信小程序 Android | 微信原生渲染层推顶 | 🟢 完美支持 单位 px | 🟢 完美支持 | 🟢 100% 完美支持 | 默认 24px 间距过小，高尺寸输入框下半截被键盘遮挡 | | 微信小程序 HarmonyOS NEXT | 遵循微信官方跨平台基础库 | 🟢 完美支持 单位 px | 🟢 完美支持 | 🟢 100% 完美支持 | 行为与 iOS/Android 微信基础库一致 | | 移动端 H5 iOS Safari / Webview | WebKit 视口自动滚动 Scroll | ⚪ 无效（标准 HTML 无此属性） | ⚪ 无效（标准 HTML 无此属性） | 🟢 100% 完美支持 | 键盘收起后页面偶尔不回弹出现“大灰底”；绝对定位吸底按钮被顶乱 | | 移动端 H5 Android Chrome | Webview Resize / Pan | ⚪ 无效 | ⚪ 无效 | 🟢 100% 完美支持 | 键盘弹起导致 window.innerHeight 缩小，影响绝对定位容器 | | 移动端 H5 HarmonyOS 浏览器/ArkWeb | ArkWeb 视口联动调整 | ⚪ 无效 | ⚪ 无效 | 🟢 100% 完美支持 | 遵循现代 Chromium/W3C 规范 | | uni-app 跨端 App iOS / Android / 鸿蒙 | 原生窗口模式 softinputMode | 🟢 小程序/App 模式均支持 | 🟢 小程序/App 模式均支持 | 🟢 100% 完美支持 | 复杂嵌套滚动视图未留足底部安全距离 | > !NOTE > - 小程序专属属性 ： adjust-position 和 cursor-spacing 属于微信/支付宝等小程序规范扩展，在原生 HTML/H5 中会被浏览器当成未知属性忽略。 > - CSS3 标准规范 ：Flex 容器子项的 min-width: 0 属于 W3C 现代标准规范，在所有现代移动浏览器、小程序、Webview 及各操作系统中均 100% 表现一致 。 --- 🕳️ 二、坑位一：键盘抬起遮挡输入框 1. 现象描述 用户点击页面下半部分的输入框时，软键盘弹起，页面产生上移，但 输入框仅露出上方文字，下半部边框甚至光标底端被键盘压住 。在长表单或高度较大的输入框（如高度 50px 以上或多行 textarea ）中尤为明显。 2. 根因剖析 - 小程序底层逻辑 ： <input> 与 <textarea> 属于原生组件层。微信默认提供的 cursor-spacing=\"24\" 仅能保证光标点距离键盘 24px。如果输入框本身设计有较大的内边距（padding）或边框，光标露出来了，但输入框底部仍深陷键盘下方； - H5 端底层逻辑 ：H5 没有小程序的 cursor-spacing 机制，浏览器仅依据默认对齐算法尝试把焦点元素推入可视视口。一旦外层套了 position: absolute 、 overflow: hidden 或使用了局部滚动容器，浏览器自动滚动就会彻底失效。 --- 3. 针对不同场景的解决方案 方案 A：微信小程序 / uni-app 小程序端专属参数调优（最简高效） 针对微信小程序（iOS / Android / 鸿蒙 NEXT），显式声明 :adjust-position=\"true\" ，并将 cursor-spacing 调大至 80~100 ： html <!-- 单行输入框 Vue 3 / uni-app 语法 --> <input v-model=\"formData.name\" class=\"custom-input\" type=\"text\" placeholder=\"请输入联系人姓名\" placeholder-class=\"placeholder-gray\" :adjust-position=\"true\" :cursor-spacing=\"100\" /> <!-- 多行文本域 --> <textarea v-model=\"formData.remark\" class=\"custom-textarea\" placeholder=\"请输入详细备注说明\" placeholder-class=\"placeholder-gray\" :adjust-position=\"true\" :cursor-spacing=\"100\" /> > !TIP > - 长表单页面 ：统一建议设置 :cursor-spacing=\"100\" （单位 px），保证输入框与操作提示完全露出； > - 弹窗/Modal 表单 ：短表单建议保持 24~40 ，防止弹窗整体被推移出屏幕可见范围顶部。 --- 方案 B：移动端 H5 专用平滑居中滚动与收起回弹方案 在纯 H5 环境下（iOS Safari、Android Chrome、鸿蒙浏览器），通过 Vue 组合式 Hook 实现聚焦居中滚动与失焦回弹： typescript // useH5InputScroll.ts - 移动端 H5 输入框聚焦与回弹解决方案 import { onMounted, onUnmounted } from 'vue'; export function useH5InputScroll { / 输入框聚焦：平滑将元素滚动至屏幕中央 / const handleFocus = e: FocusEvent => { const target = e.target as HTMLElement; if !target return; // 延时 300ms 等待 iOS / Android 键盘弹起动画完成 setTimeout => { if typeof target.scrollIntoView === 'function' { target.scrollIntoView { behavior: 'smooth', block: 'center', // 滚动到屏幕正中间，彻底避开键盘遮挡 inline: 'nearest' } ; } }, 300 ; }; / 输入框失焦：解决 iOS Safari 键盘收起后页面留白卡住不回弹的 Bug / const handleBlur = => { // 仅在 iOS 环境下需要手动触发微小滚动回弹 const isIOS = /iPad|iPhone|iPod/.test navigator.userAgent ; if isIOS { setTimeout => { const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0; window.scrollTo { top: Math.max currentScrollY - 1, 0 , behavior: 'smooth' } ; }, 100 ; } }; return { handleFocus, handleBlur }; } 在模板中直接使用： html <template> <input type=\"text\" class=\"h5-input\" placeholder=\"请输入手机号\" @focus=\"handleFocus\" @blur=\"handleBlur\" /> </template> <script setup lang=\"ts\"> import { useH5InputScroll } from './useH5InputScroll'; const { handleFocus, handleBlur } = useH5InputScroll ; </script> --- 方案 C：跨端通用终极方案（动态底部安全 Padding 垫高） 对于使用 <scroll-view> 或局部滚动容器的复杂页面，通过监听键盘高度，在滚动容器底部 动态垫出等于键盘高度的空白区 ： html <template> <view class=\"page-wrapper\"> <!-- 主滚动容器：动态绑定 padding-bottom --> <scroll-view scroll-y class=\"form-scroll-view\" :style=\"{ paddingBottom: keyboardPadding + 'px' }\" > <view class=\"form-container\"> <!-- 你的各类表单项 --> <view class=\"form-item\" v-for=\"i in 10\" :key=\"i\"> <text class=\"label\">字段 {{ i }}：</text> <input class=\"input\" placeholder=\"点击输入内容\" /> </view> </view> </scroll-view> <!-- 底部固定操作栏 --> <view class=\"bottom-bar\" :style=\"{ transform: translateY -${keyboardHeight}px }\"> <button class=\"submit-btn\">立即提交</button> </view> </view> </template> <script setup> import { ref, computed, onMounted, onUnmounted } from 'vue'; const keyboardHeight = ref 0 ; // 计算动态 Padding：键盘高度 + 底部安全区 const keyboardPadding = computed => { return keyboardHeight.value > 0 ? keyboardHeight.value + 20 : 0; } ; const onKeyboardHeightChange = res => { keyboardHeight.value = res.height || 0; }; onMounted => { // ifdef MP-WEIXIN || APP-PLUS if typeof uni !== 'undefined' && uni.onKeyboardHeightChange { uni.onKeyboardHeightChange onKeyboardHeightChange ; } // endif // ifdef H5 // H5 端通过现代 VisualViewport API 精确监听 if window.visualViewport { const handleResize = => { const offset = window.innerHeight - window.visualViewport.height; keyboardHeight.value = offset > 100 ? offset : 0; }; window.visualViewport.addEventListener 'resize', handleResize ; } // endif } ; onUnmounted => { // ifdef MP-WEIXIN || APP-PLUS if typeof uni !== 'undefined' && uni.offKeyboardHeightChange { uni.offKeyboardHeightChange onKeyboardHeightChange ; } // endif } ; </script> <style scoped> .page-wrapper { position: relative; width: 100vw; height: 100vh; display: flex; flex-direction: column; } .form-scroll-view { flex: 1; box-sizing: border-box; transition: padding-bottom 0.25s ease-out; } .bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; padding-bottom: env safe-area-inset-bottom ; background: ffffff; transition: transform 0.25s ease-out; box-shadow: 0 -2rpx 10rpx rgba 0, 0, 0, 0.05 ; } </style> --- 🕳️ 三、坑位二：Flex 布局中 placeholder 溢出遮挡相邻元素 1. 现象描述 在窄屏设备上采用双列栅格等分布局（例如并排展示“预付定金”与“尾款金额”）： - 当输入框右对齐且占位符较长（如 placeholder=\"请输入预付款金额\" ）时； - 右侧输入框会 强行向左横向撑大 ，突破自身划分的 50% 宽度，直接覆盖在左侧输入框上方； - 导致左侧输入框被压住无法点击，界面错位。 mermaid flowchart TB subgraph Bug \"❌ 默认未修复状态：min-width: auto 导致撑破覆盖\" direction LR L1 \"【左列】 flex: 1<br/>被右侧强行挤压<br/>❌ 无法正常点击 / 文字被盖\" --- R1 \"【右列】 flex: 1 但 min-width: auto<br/>因长占位符『请输入预计尾款金额』拒绝收缩<br/>💥 宽度严重超标，向左越界覆盖\" end subgraph Fix \"✅ 标准修复状态：min-width: 0 优雅弹性均分\" direction LR L2 \"【左列】 flex: 1; min-width: 0<br/>稳定平分 50% 宽度<br/>✔️ 正常聚焦点击\" --- R2 \"【右列】 flex: 1; min-width: 0<br/>overflow: hidden; text-overflow: ellipsis<br/>✔️ 超长占位符优雅省略，稳定 50%\" end Bug -.->|\"加入 min-width: 0 与 overflow: hidden\"| Fix 2. 根因剖析 这是 CSS Flexbox 规范中极易被忽略的 min-width: auto 机制 ： 1. W3C 规范 ：Flex 容器内子项的 min-width 默认值不是 0 ，而是 auto ； 2. 拒绝收缩 ：子项的最小宽度由其内部的内容固有尺寸（content size）决定。如果子项里的 input placeholder 长度超过了 flex 分配的宽度， min-width: auto 会强制保持内容完整性， 拒绝响应 flex: 1 的收缩指令 ； 3. 溢出覆盖 ：输入框强行撑开，打破了栅格比例，越界遮挡左侧同级兄弟元素。 --- 3. 全平台完美兼容解决方案 只需要两步核心 CSS 配置： 1. 解除子项限制 ：为 flex 子项容器显式加上 min-width: 0 ； 2. 输入控件裁剪 ：为 input 自身设置 min-width: 0 与 overflow: hidden 。 css / 双列行容器 / .form-row-group { display: flex; align-items: center; gap: 16rpx; width: 100%; } / 栅格列容器：核心是 min-width: 0 / .form-row-group .form-col { flex: 1; min-width: 0; / 核心：解除默认的 min-width: auto，允许列弹性收缩 / display: flex; align-items: center; } / 输入框本身：必须同时配置 min-width: 0 与 overflow: hidden / .input-control { flex: 1; min-width: 0; / 核心：允许 input 自身收缩到父容器分配宽度以内 / width: 100%; font-size: 28rpx; color: 333333; text-align: right; overflow: hidden; / 核心：截断超出宽度的长占位符文本 / text-overflow: ellipsis; white-space: nowrap; } html <view class=\"form-row-group\"> <!-- 左侧列 --> <view class=\"form-col\"> <text class=\"label\">定金：</text> <input class=\"input-control\" placeholder=\"请输入金额\" /> </view> <!-- 右侧列：长 placeholder 不会再撑破容器 --> <view class=\"form-col\"> <text class=\"label\">尾款：</text> <input class=\"input-control\" placeholder=\"请输入预计尾款金额\" /> </view> </view> > !IMPORTANT > 兼容性结论 ：该 CSS 方案基于 W3C Flexbox 现代标准规范，在 微信小程序、H5、iOS Safari、Android Chrome、HarmonyOS ArkWeb、uni-app App 均 100% 完美支持，且零平台副作用。 --- 📋 四、移动端表单开发自检速查清单 Checklist 在上线微信小程序或移动跨端表单页面前，建议使用以下清单逐项自检： 1. 属性与参数自检 - 微信小程序中的 <input> 与 <textarea> 是否显式配置了 :adjust-position=\"true\" ？ - 表单中下部字段或高度较大的输入框是否设置了 :cursor-spacing=\"100\" （单位 px）？ - 居中弹窗（Modal）中的输入框是否将 cursor-spacing 调小（24~40px）以防推顶越界？ 2. CSS 布局与防挤压自检 - 所有包含 input / textarea / text 的 Flex 子项是否均显式声明了 min-width: 0 ？ - 多列输入框是否增加了 overflow: hidden 与 text-overflow: ellipsis 防长占位符撑爆？ - 页面外层是否避免了不当的 position: fixed 或非全屏 overflow: hidden ？ 3. 多端与 H5 专属自检 - 纯 H5 页面是否在 @focus 中绑定了 scrollIntoView { block: 'center' } ？ - 纯 H5 页面是否在 @blur 中加入了针对 iOS Safari 的滚动复位（防空白卡死）处理？ - 复杂局部滚动页是否采用了 keyboardHeight 动态垫高 paddingBottom ？ - 底部固定按钮栏是否适配了底部安全区 padding-bottom: env safe-area-inset-bottom ？ 4. 真机测试覆盖自检 - iOS 真机测试 ：系统键盘与第三方输入法（搜狗/百度）弹起时是否平滑回弹、不挡框； - Android / 鸿蒙真机测试 ：不同屏幕比例下多列长 placeholder 是否正确裁剪不遮挡邻居。 --- 🎯 五、总结 移动端跨端表单体验的健壮性取决于对底层渲染机制的深刻理解： 1. 键盘遮挡 ：微信小程序优先使用 :adjust-position=\"true\" :cursor-spacing=\"100\" ；H5 环境使用 scrollIntoView { block: 'center' } ；复杂容器使用动态 Padding 垫高； 2. 横向挤压 ：在任何 Flex 布局中，凡是使用了 flex: 1 且内部装有输入框或不可控长文本， 无条件为其加上 min-width: 0 与 overflow: hidden 。",
    "sections": [
      {
        "title": "📊 一、全平台兼容性与底层机制矩阵",
        "anchor": "#一-全平台兼容性与底层机制矩阵",
        "id": "一-全平台兼容性与底层机制矩阵"
      },
      {
        "title": "🕳️ 二、坑位一：键盘抬起遮挡输入框",
        "anchor": "#二-坑位一-键盘抬起遮挡输入框",
        "id": "二-坑位一-键盘抬起遮挡输入框"
      },
      {
        "title": "1. 现象描述",
        "anchor": "#1-现象描述",
        "id": "1-现象描述"
      },
      {
        "title": "2. 根因剖析",
        "anchor": "#2-根因剖析",
        "id": "2-根因剖析"
      },
      {
        "title": "3. 针对不同场景的解决方案",
        "anchor": "#3-针对不同场景的解决方案",
        "id": "3-针对不同场景的解决方案"
      },
      {
        "title": "方案 A：微信小程序 / uni-app 小程序端专属参数调优（最简高效）",
        "anchor": "#方案-a-微信小程序-uni-app-小程序端专属参数调优-最简高效",
        "id": "方案-a-微信小程序-uni-app-小程序端专属参数调优-最简高效"
      },
      {
        "title": "方案 B：移动端 H5 专用平滑居中滚动与收起回弹方案",
        "anchor": "#方案-b-移动端-h5-专用平滑居中滚动与收起回弹方案",
        "id": "方案-b-移动端-h5-专用平滑居中滚动与收起回弹方案"
      },
      {
        "title": "方案 C：跨端通用终极方案（动态底部安全 Padding 垫高）",
        "anchor": "#方案-c-跨端通用终极方案-动态底部安全-padding-垫高",
        "id": "方案-c-跨端通用终极方案-动态底部安全-padding-垫高"
      },
      {
        "title": "🕳️ 三、坑位二：Flex 布局中 placeholder 溢出遮挡相邻元素",
        "anchor": "#三-坑位二-flex-布局中-placeholder-溢出遮挡相邻元素",
        "id": "三-坑位二-flex-布局中-placeholder-溢出遮挡相邻元素"
      },
      {
        "title": "1. 现象描述",
        "anchor": "#1-现象描述",
        "id": "1-现象描述"
      },
      {
        "title": "2. 根因剖析",
        "anchor": "#2-根因剖析",
        "id": "2-根因剖析"
      },
      {
        "title": "3. 全平台完美兼容解决方案",
        "anchor": "#3-全平台完美兼容解决方案",
        "id": "3-全平台完美兼容解决方案"
      },
      {
        "title": "📋 四、移动端表单开发自检速查清单 (Checklist)",
        "anchor": "#四-移动端表单开发自检速查清单-checklist",
        "id": "四-移动端表单开发自检速查清单-checklist"
      },
      {
        "title": "1. 属性与参数自检",
        "anchor": "#1-属性与参数自检",
        "id": "1-属性与参数自检"
      },
      {
        "title": "2. CSS 布局与防挤压自检",
        "anchor": "#2-css-布局与防挤压自检",
        "id": "2-css-布局与防挤压自检"
      },
      {
        "title": "3. 多端与 H5 专属自检",
        "anchor": "#3-多端与-h5-专属自检",
        "id": "3-多端与-h5-专属自检"
      },
      {
        "title": "4. 真机测试覆盖自检",
        "anchor": "#4-真机测试覆盖自检",
        "id": "4-真机测试覆盖自检"
      },
      {
        "title": "🎯 五、总结",
        "anchor": "#五-总结",
        "id": "五-总结"
      }
    ]
  },
  {
    "id": "nginx-rewrite-vars-f411",
    "type": "post",
    "title": "Nginx 路径重写进阶：告别正则变量冲突，掌握命名捕获与内置变量极致写法",
    "url": "posts/nginx-rewrite-vars-f411.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2026-08-29",
    "tags": [
      "Linux 与服务端",
      "Nginx",
      "反向代理",
      "路径重写",
      "PCRE",
      "性能优化",
      "避坑指南"
    ],
    "summary": "深入剖析 Nginx 中 location 与 rewrite 嵌套时 $1 位置变量被无情覆盖的经典根因，提供基于 PCRE 命名捕获 (?<name>) 与全局内置变量 $uri 的两种高级生产级重写写法及性能对比。",
    "content": "Nginx 路径重写进阶：告别正则变量冲突，掌握命名捕获与内置变量极致写法 在 Nginx 配置中，为静态资源（如 js 、 css 、 png ）配置长效浏览器缓存，并将它们在后台透明重定向到特定的缓存存储目录，是非常经典的反代与动静分离场景。 然而，很多开发者在编写正则表达式时，习惯使用系统默认的位置变量 $1 、 $2 。这往往会埋下一个极其隐蔽的致命陷阱： 当外层 location 与内层 rewrite 同时使用了正则表达式时，内层的正则捕获会直接覆盖外层的 $1 ，导致重定向逻辑错乱或频繁出现 404 。 本文将通过静态资源缓存重写的经典案例，深入剖析变量覆盖的底层根因，并分享两种高级、安全且极度优雅的生产级 Nginx 配置方案。 --- 🧭 一、核心问题：位置变量 $1 的覆盖与污染 在排查 Bug 之前，我们先理清位置捕获变量 $1 在 Nginx 执行上下文中的流转机制： mermaid flowchart TB Req \"用户请求: /assets/js/main.js\" subgraph BugCase \"❌ 传统位置变量覆盖陷阱\" L1 \"location ~ \\. js|css $ 匹配成功<br/>📌 $1 赋值为 'js'\" R1 \"rewrite ^ . $ /cache/$1 break<br/>💥 触发新正则，$1 被强制覆盖为 '/assets/js/main.js'\" Err \"最终拼接结果失控或丢失扩展名，引发 404\" L1 --> R1 --> Err end subgraph FixCase \"✅ 现代化命名捕获与内置变量\" L2 \"location ~ \\. ?<ext>js|css $<br/>🏷️ 独立命名变量 $ext = 'js' 永不被冲刷 \" R2 \"rewrite ^ /cache$uri break<br/>⚡ 零正则计算，直接引用全局内置变量 $uri\" Ok \"路径精准拼接，CPU 开销最低，100% 健壮\" L2 --> R2 --> Ok end Req --> BugCase Req --> FixCase --- 🎯 二、典型业务场景需求 假设我们有以下常见的生产配置需求： 1. 后缀拦截 ：拦截所有以 .js 或 .css 结尾的静态文件请求； 2. 长效缓存 ：设置 expires 30d; （30 天浏览器客户端强缓存）； 3. 静默重定向 ：在后台透明重写到服务器本地的 /wp-content/cache/staticfile/ 静态缓存目录，且不改变浏览器地址栏 URL。 --- 💡 三、写法一：PCRE 正则命名捕获（安全自解释） 利用 PCRE（Perl Compatible Regular Expressions）的 命名捕获（Named Capture） 特性，我们可以直接给正则匹配到的分组成果“显式贴上命名标签”，彻底避免 $1 被后续逻辑无情冲刷： nginx location ~ \\. ?<ext>js|css $ { 开启客户端强缓存 30 天 expires 30d; add_header Cache-Control \"public, no-transform\"; 将完整路径 . 显式命名为 fullpath，生成独立变量 $fullpath rewrite ^ ?<fullpath>. $ /wp-content/cache/staticfile$fullpath break; } 逐行原理解析： 1. ?<ext>js|css ：相比传统的 js|css ，加上 ?<ext> 后，Nginx 会在内存中自动生成一个名为 $ext 的专属变量，其值为 js 或 css 。它拥有独立的命名空间，绝对不会被后续的任何正则覆盖； 2. ^ ?<fullpath>. $ ：在 rewrite 指令中同样使用命名捕获，将用户请求的完整路径存入 $fullpath 变量； 3. break 标志位 ：完成内部路径重写后，立即终止当前阶段的 rewrite 规则，直接去磁盘寻找对应文件并返回，不再参与后续其他 location 的重新匹配。 > !TIP > 适用场景 ：代码“自解释”能力极强。团队接手维护时，无需反复数括号推测 $1 、 $2 代表什么， $ext 和 $fullpath 的业务意图一目了然。 --- ⚡ 四、写法二：内置变量 $uri（极致优雅、性能最高） 虽然“命名捕获”非常清晰，但针对“获取当前请求的完整 URI 路径”这一需求，Nginx 原生提供了性能更高的全局内置变量： $uri 。 既然 $uri 本身就代表了当前的完整规范化请求路径（如 /assets/js/main.js ），我们完全可以省去 rewrite 中的正则匹配与字符串捕获开销： nginx ✅ 专家级推荐：极致优雅且性能最高的写法 location ~ \\. ?<ext>js|css $ { 开启客户端强缓存 30 天 expires 30d; add_header Cache-Control \"public, no-transform\"; rewrite 正则缩减为单个 ^，直接拼接全局变量 $uri rewrite ^ /wp-content/cache/staticfile$uri break; } 逐行原理解析： 1. location 块保留命名捕获 ：保留 ?<ext>... 是良好习惯，方便后续如果需要在响应头输出 add_header X-Asset-Type $ext; 时随取随用； 2. rewrite ^ ：这里的正则表达式被精简到了极致——只有一个 ^ （匹配任意请求的起点）。 完全没有捕获括号，省去了正则回溯与内存分配的 CPU 开销 ； 3. $uri ：直接读取 Nginx 内核在解析请求行时就已初始化的内置变量 $uri ，实现纳秒级的高效无缝拼接。 --- 📊 五、三种写法深度对比矩阵 | 对比维度 | 传统写法 $1 / $2 | 进阶写法一 命名捕获 ?<name> | 进阶写法二 内置变量 $uri | | :--- | :--- | :--- | :--- | | 可读性与自解释 | 🔴 极差（容易数错分组） | 🟢 极佳（显式语义化变量名） | 🟢 极佳（极简直观） | | 抗覆盖安全性 | 🔴 极易被嵌套 rewrite 污染 | 🟢 100% 隔离安全 | 🟢 100% 隔离安全 | | CPU 正则开销 | 🟡 两次正则捕获开销 | 🟡 两次正则命名捕获开销 | 🟢 最低（仅一次后缀正则，重写 0 计算） | | 维护成本 | 🔴 易踩 404 隐蔽 Bug | 🟢 低 | 🟢 极低 | | 综合推荐指数 | ❌ 强烈弃用 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ 首选 | --- ❓ 六、常见疑问：需要安装第三方模块吗？ 很多开发者在看到 ?<name>... 这类语法时，常常会有疑虑： “我的 Nginx 支持这种写法吗？需要额外编译 Lua 模块或第三方扩展吗？” 答案是：100% 原生支持，零额外依赖！ 1. PCRE 命名捕获支持 ：Nginx 底层正则引擎基于 PCRE。早在 Nginx 0.8.25（2009 年发布） 版本起，官方就已原生打通了命名捕获与 Nginx 变量系统的无缝绑定； 2. $uri 与 rewrite ：分别内置于 ngx_http_core_module （核心模块）与 ngx_http_rewrite_module （重写模块），是 Nginx 默认编译的核心基石。 无论是通过 apt / yum 、宝塔面板、1Panel、Docker 容器还是官方源码编译安装的 Nginx，均可直接使用。 --- 📋 七、生产环境重载自检 Checklist 在更新线上 Nginx 配置时，请严格遵守以下自检流程： - 语法自检 ：执行 nginx -t ，确认输出 syntax is ok 与 test is successful ； - 重写验证 ：使用 curl -I https://yourdomain.com/assets/js/app.js 检查返回的 HTTP/2 200 状态码与 Cache-Control 标头； - 平滑重载 ：执行 nginx -s reload ，实现毫秒级无损热生效。 --- 🎯 八、总结 在编写现代 Nginx 配置时，请牢记两条黄金法则： 1. 远离未知风险 ：坚决摒弃脆弱的 $1 / $2 位置变量，复杂匹配优先选用 ?<name>... 命名捕获 ； 2. 性能与简洁至上 ：能用 Nginx 原生全局变量（如 $uri 、 $host 、 $request_uri ）解决的场景， 优先使用内置变量直接拼接 。",
    "sections": [
      {
        "title": "🧭 一、核心问题：位置变量 $1 的覆盖与污染",
        "anchor": "#一-核心问题-位置变量-1-的覆盖与污染",
        "id": "一-核心问题-位置变量-1-的覆盖与污染"
      },
      {
        "title": "🎯 二、典型业务场景需求",
        "anchor": "#二-典型业务场景需求",
        "id": "二-典型业务场景需求"
      },
      {
        "title": "💡 三、写法一：PCRE 正则命名捕获（安全自解释）",
        "anchor": "#三-写法一-pcre-正则命名捕获-安全自解释",
        "id": "三-写法一-pcre-正则命名捕获-安全自解释"
      },
      {
        "title": "逐行原理解析：",
        "anchor": "#逐行原理解析",
        "id": "逐行原理解析"
      },
      {
        "title": "⚡ 四、写法二：内置变量 $uri（极致优雅、性能最高）",
        "anchor": "#四-写法二-内置变量-uri-极致优雅-性能最高",
        "id": "四-写法二-内置变量-uri-极致优雅-性能最高"
      },
      {
        "title": "逐行原理解析：",
        "anchor": "#逐行原理解析",
        "id": "逐行原理解析"
      },
      {
        "title": "📊 五、三种写法深度对比矩阵",
        "anchor": "#五-三种写法深度对比矩阵",
        "id": "五-三种写法深度对比矩阵"
      },
      {
        "title": "❓ 六、常见疑问：需要安装第三方模块吗？",
        "anchor": "#六-常见疑问-需要安装第三方模块吗",
        "id": "六-常见疑问-需要安装第三方模块吗"
      },
      {
        "title": "📋 七、生产环境重载自检 Checklist",
        "anchor": "#七-生产环境重载自检-checklist",
        "id": "七-生产环境重载自检-checklist"
      },
      {
        "title": "🎯 八、总结",
        "anchor": "#八-总结",
        "id": "八-总结"
      }
    ]
  },
  {
    "id": "nginx-wx-qrcode-7fef",
    "type": "post",
    "title": "Nginx 极简动态配置指南：一套规则承载 N 个微信小程序普通二维码与 H5 智能兜底",
    "url": "posts/nginx-wx-qrcode-7fef.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2026-08-29",
    "tags": [
      "Linux 与服务端",
      "Nginx",
      "反向代理",
      "微信小程序",
      "网络运维",
      "避坑指南"
    ],
    "summary": "深入解析微信小程序「普通链接二维码」底层工作机制，提供基于 Nginx 正则与 $host 动态变量的零运维重载架构，一套配置通吃成百上千个小程序的域名校验与 H5 智能唤起兜底。",
    "content": "Nginx 极简动态配置指南：一套规则承载 N 个微信小程序普通二维码与 H5 智能兜底 微信小程序的 「扫普通链接二维码打开小程序」 （即业务域名扫码直跳小程序）是线上线下引流、一码多端的核心功能。但在实际业务扩展中，很多运维与前端开发者常常陷入两难困境： - 随着接入业务线变多，拥有成百上千个二级域名或独立小程序； - 每次在微信公众平台配置规则时，都要手动上传微信校验文件（如 NjK8s7Dl.txt ）并修改 Nginx 配置； - 非微信环境（手机系统相机、Safari、Chrome、支付宝）扫码时，页面直接 404，导致潜在用户严重流失。 本文将深入剖析普通二维码跳转的底层机制，并提供一套基于 Nginx 正则与 $host 动态变量的高可用生产架构—— 后续无论新增多少个小程序或子域名，均无需修改 Nginx 配置，无需重启服务即可全自动即时生效 。 --- 🧭 一、底层扫码工作流与架构认知 在编写 Nginx 配置前，首先必须厘清一个核心认知： 当用户使用微信“扫一扫”扫描普通二维码时，请求压根不会打到你的 Nginx 服务器上！ mermaid flowchart TB QR \"用户扫描普通链接二维码<br/>https://sub.example.com/app/path?id=123\" subgraph Client \"扫码客户端环境识别\" WeChat{\"扫描客户端是否为微信？\"} end subgraph NativeJump \"微信本地截获 0 流量打入服务器 \" MatchRule \"微信客户端本地匹配业务规则\" LaunchApp \"直接调起微信小程序对应页面<br/>onLoad options 获取 query 参数\" end subgraph ServerFlow \"非微信环境 真实请求打入 Nginx \" NginxHit \"请求到达 Nginx 服务器\" DynamicHost \"Nginx 解析 $host 与路径\" H5Page \"返回对应子域名的 H5 兜底落地页\" SchemeWake \"H5 页面通过 URL Scheme / 标签唤起微信\" end QR --> WeChat WeChat -- \"是 微信扫一扫 \" --> MatchRule --> LaunchApp WeChat -- \"否 系统相机/浏览器/支付宝 \" --> NginxHit --> DynamicHost --> H5Page --> SchemeWake 从架构流向可以看出， Nginx 在整套体系中只承担两个核心职责 ： 1. 响应微信开放平台审核 ：在配置规则时，承载并精准返回微信域名所有权验证文件（ .txt ）； 2. 非微信环境智能兜底 ：当用户使用系统相机、iOS Safari、Android 浏览器或第三方 App 扫码时，返回对应业务的 H5 引导页，并尝试通过 URL Scheme 唤醒微信。 --- ⚙️ 二、生产级 Nginx 终极动态配置 无论是一级域名分路径匹配，还是 N 个泛子域名（ .example.com ）对应 N 个小程序，下面的配置均可实现 一套配置全量通吃 ： nginx HTTP 80 强制跳转 HTTPS server { listen 80; server_name .example.com example.com; return 301 https://$host$request_uri; } HTTPS 443 核心服务块 server { listen 443 ssl http2; 开启泛域名匹配，兼容所有主域与子域 server_name .example.com example.com; SSL 证书配置（建议使用泛域名通配符证书 .example.com） ssl_certificate /etc/nginx/ssl/example.com.crt; ssl_certificate_key /etc/nginx/ssl/example.com.key; ssl_protocols TLSv1.2 TLSv1.3; ssl_ciphers HIGH:!aNULL:!MD5; ======================================================= 任务 1：微信域名校验文件统一正则拦截（零运维核心） ======================================================= 微信校验文件格式均为：/随机字符串.txt（如 /MP_verify_xxx.txt 或 /NjK8s7Dl.txt） 无论访问哪个子域名或路径下的 .txt，一律重定向至统一物理存储目录读取 location ~ ^/ A-Za-z0-9_- +\\.txt$ { root /data/wechat_verify/; 禁用缓存，确保微信平台验证时实时穿透读取 add_header Cache-Control \"no-cache, no-store, must-revalidate\"; access_log off; } ======================================================= 任务 2：非微信扫码 H5 动态智能兜底 ======================================================= 场景 A：带子路径的扫码业务（如 https://a.example.com/app/） 使用 alias 抹除 URL 中的 /app/ 前缀，动态映射到对应域名的 app_page 目录 location /app/ { alias /data/h5_fallback/$host/app_page/; index index.html; try_files $uri $uri/ /app/index.html; } 场景 B：根目录扫码业务（如 https://b.example.com/） 使用 root 拼接路径，动态根据 $host 映射到对应子域名文件夹 location / { root /data/h5_fallback/$host/; index index.html; try_files $uri $uri/ /index.html; } 静态资源通用缓存优化 location ~ \\. js|css|png|jpg|jpeg|gif|ico|svg|woff2 $ { root /data/h5_fallback/$host/; expires 7d; add_header Cache-Control \"public, no-transform\"; } } --- 📁 三、服务器物理目录规范与“零重启”工作流 配合上述 Nginx 配置，在服务器上建立规范化的目录结构。 后续新增任意小程序，只需往对应文件夹丢文件即可秒级生效，无需执行 nginx -s reload ： text /data/ ├── wechat_verify/ 👈 所有的微信校验 .txt 文件统一扔在这里 │ ├── MP_verify_d6kGzX9a.txt 小程序 A 的校验文件 │ └── NjK8s7Dl.txt 小程序 B 的校验文件 │ └── h5_fallback/ 👈 兜底 H5 落地页的动态大本营 ├── a.example.com/ 自动匹配子域名 a.example.com │ ├── index.html 根目录扫码兜底页 │ └── app_page/ │ └── index.html /app/ 子路径扫码兜底页 │ └── b.example.com/ 自动匹配子域名 b.example.com ├── index.html 根目录扫码兜底页 └── app_page/ └── index.html /app/ 子路径扫码兜底页 💡 零重启新增小程序操作流程： 1. 微信后台下载验证文件 ：在小程序后台配置二维码规则，下载微信提供的 xxx.txt 文件； 2. 丢入校验目录 ： scp xxx.txt user@server:/data/wechat_verify/ ； 3. 丢入 H5 兜底页面 ：在 /data/h5_fallback/ 创建对应的 新域名/ 文件夹并放入 index.html ； 4. 微信后台点击保存 ：微信服务器 GET 请求检测 https://新域名/xxx.txt 瞬间通过验证！ --- 🛠️ 四、高频踩坑点与原理解析 1. root 与 alias 的核心区别与末尾斜杠陷阱 很多开发者在写 /app/ 这类带路径的路由时常遇到 404 错误。必须牢记其替换与拼接逻辑： - root （追加拼接） ： root /data/dir; 会将匹配到的 URI 完整追加在物理路径后。 > 访问 http://a.com/app/index.html ➔ 实际寻找 /data/dir/app/index.html 。 - alias （直接替换） ： alias /data/dir/; 会把 location 中匹配的部分完全替换掉。 > 访问 http://a.com/app/index.html ➔ 实际寻找 /data/dir/index.html 。 - 避坑准则 ： location 使用了斜杠结尾（如 /app/ ）， alias 后面的路径 必须也以斜杠 / 结尾 ，否则 Nginx 会拼接出错误的物理路径。 --- 2. 微信校验文件命中 CDN / Nginx 缓存导致保存失败 在微信公众平台点击“保存并校验”时，经常报错“校验文件内容不匹配”或“404”，原因通常是： - 前序校验失败的 404 响应被中间代理层或 Nginx 强行缓存； - 解决方案 ：在 .txt 的 location 块中显式追加 add_header Cache-Control \"no-cache, no-store, must-revalidate\"; ，确保每次请求均穿透读取磁盘。 --- 3. 扫码 URL 携带业务参数时的传递机制 如果二维码链接带了复杂参数，如 https://a.example.com/app/?shop_id=9527&table=8 ： - 微信内扫码 ：微信客户端会自动截获并完整解析参数，在小程序的 onLoad options 中通过 options.q （URL 编码字符串）直接读取； - 外部浏览器扫码 ：Nginx 的 try_files 与静态代理会自动完整保留 Query String，H5 页面直接使用原生前端 API 读取即可： javascript // H5 兜底页面提取参数 const urlParams = new URLSearchParams window.location.search ; const shopId = urlParams.get 'shop_id' ; const table = urlParams.get 'table' ; --- 4. H5 兜底页无缝唤醒微信小程序 当外部浏览器打开 H5 兜底页时，可通过两种方式唤起目标小程序： 1. 微信 URL Scheme（全端浏览器兼容） ： javascript // 后端调用微信服务端接口生成短链 scheme window.location.href = 'weixin://dl/business/?t=T8xY7zA1b2c'; 2. 微信开放标签 <wx-open-launch-weapp> （微信内 H5 专用） ：在微信内置浏览器打开 H5 时，可直接使用微信开放标签渲染一键跳转按钮。 --- 📋 五、生产上线自检清单 Checklist - 域名解析与证书 ： - 是否配置了解析至服务器的泛域名 .example.com DNS 记录？ - SSL 证书是否为支持所有子域的泛通配符证书？ - Nginx 校验规则 ： - location ~ ^/ A-Za-z0-9_- +\\.txt$ 正则是否放开并在统一目录建立 /data/wechat_verify/ ？ - 是否禁用了 .txt 文件的 HTTP 缓存？ - 物理目录与兜底 ： - 是否在 /data/h5_fallback/ 下按子域名正确建立了文件夹树？ - H5 落地页是否具备向微信 URL Scheme 唤醒跳转的逻辑？ - 真机验证 ： - 微信“扫一扫”测试能否精准命中并打开指定小程序； - 手机自带相机扫描测试能否正常加载对应的 H5 引导页。 --- 🎯 六、总结 通过巧妙利用 Nginx 正则表达式匹配校验文件 与 $host 动态变量映射物理目录 ，我们将复杂繁琐的 N 个小程序扫码配置彻底降维为纯静态的“丢文件”运维操作： 1. 校验文件 ：统一扔进 /data/wechat_verify/ ，秒级通过微信审核； 2. H5 兜底页 ：按域名扔进 /data/h5_fallback/$host/ ，全自动动态路由； 3. 极致解耦 ：从此告别繁琐的 Nginx 配置修改与服务重载！",
    "sections": [
      {
        "title": "🧭 一、底层扫码工作流与架构认知",
        "anchor": "#一-底层扫码工作流与架构认知",
        "id": "一-底层扫码工作流与架构认知"
      },
      {
        "title": "⚙️ 二、生产级 Nginx 终极动态配置",
        "anchor": "#二-生产级-nginx-终极动态配置",
        "id": "二-生产级-nginx-终极动态配置"
      },
      {
        "title": "📁 三、服务器物理目录规范与“零重启”工作流",
        "anchor": "#三-服务器物理目录规范与-零重启-工作流",
        "id": "三-服务器物理目录规范与-零重启-工作流"
      },
      {
        "title": "💡 零重启新增小程序操作流程：",
        "anchor": "#零重启新增小程序操作流程",
        "id": "零重启新增小程序操作流程"
      },
      {
        "title": "🛠️ 四、高频踩坑点与原理解析",
        "anchor": "#四-高频踩坑点与原理解析",
        "id": "四-高频踩坑点与原理解析"
      },
      {
        "title": "1. `root` 与 `alias` 的核心区别与末尾斜杠陷阱",
        "anchor": "#1-root-与-alias-的核心区别与末尾斜杠陷阱",
        "id": "1-root-与-alias-的核心区别与末尾斜杠陷阱"
      },
      {
        "title": "2. 微信校验文件命中 CDN / Nginx 缓存导致保存失败",
        "anchor": "#2-微信校验文件命中-cdn-nginx-缓存导致保存失败",
        "id": "2-微信校验文件命中-cdn-nginx-缓存导致保存失败"
      },
      {
        "title": "3. 扫码 URL 携带业务参数时的传递机制",
        "anchor": "#3-扫码-url-携带业务参数时的传递机制",
        "id": "3-扫码-url-携带业务参数时的传递机制"
      },
      {
        "title": "4. H5 兜底页无缝唤醒微信小程序",
        "anchor": "#4-h5-兜底页无缝唤醒微信小程序",
        "id": "4-h5-兜底页无缝唤醒微信小程序"
      },
      {
        "title": "📋 五、生产上线自检清单 (Checklist)",
        "anchor": "#五-生产上线自检清单-checklist",
        "id": "五-生产上线自检清单-checklist"
      },
      {
        "title": "🎯 六、总结",
        "anchor": "#六-总结",
        "id": "六-总结"
      }
    ]
  },
  {
    "id": "redis-65f8",
    "type": "post",
    "title": "Redis 核心操作：数据清空与内存淘汰策略详解",
    "url": "posts/redis-65f8.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2026-08-29",
    "tags": [
      "Redis",
      "缓存",
      "内存淘汰",
      "运维",
      "Linux",
      "性能优化"
    ],
    "summary": "深入解析 Redis 核心清空命令 FLUSHDB/FLUSHALL 的同步与异步 ASYNC 机制，以及 8 种内存淘汰策略（LRU、LFU、TTL、noeviction）的工作原理与生产环境选型建议。",
    "content": "Redis 核心操作：数据清空与内存淘汰策略详解 在日常使用 Redis 的过程中，我们经常会面临两个问题：一是如何快速、安全地清理脏数据；二是当 Redis 内存满了之后，它会如何处理新写入的数据。本文将详细解答这两个问题。 --- 一、 Redis 数据库清空命令 Redis 提供了两个核心的清空命令，分别作用于不同的范围： FLUSHDB ：清空当前选中的数据库（默认是 DB 0）中的所有键值对。 FLUSHALL ：清空 Redis 实例中所有数据库（默认 16 个）中的所有键值对。 1. 同步与异步清空 ASYNC 在 Redis 4.0 之前，清空操作是同步的。如果数据库中包含了数百万个 Key，执行 FLUSHALL 会导致 Redis 主线程长时间阻塞，期间无法响应任何其他客户端请求。 为了解决这个问题，Redis 4.0 引入了 ASYNC 异步选项： bash 异步清空所有数据库数据 redis-cli -h 127.0.0.1 -p 6379 FLUSHALL ASYNC 异步清空当前数据库数据 redis-cli -h 127.0.0.1 -p 6379 FLUSHDB ASYNC 原理解析 ：加入 ASYNC 后，清空操作会被交由后台的新线程执行，Redis 主线程可以继续处理其他命令，极大降低了对业务的影响。 > ⚠️ 生产环境避坑指南 ： > FLUSHALL 和 FLUSHDB 属于极其危险的操作。在生产环境中，强烈建议在 redis.conf 中通过 rename-command FLUSHALL \"\" 和 rename-command FLUSHDB \"\" 将其禁用，防止误操作导致数据灾难。 --- 二、 Redis 内存淘汰策略 maxmemory-policy 当 Redis 的内存使用量达到了配置的上限（由 redis.conf 中的 maxmemory 参数决定）时，如果继续向 Redis 中写入数据，Redis 就会触发内存淘汰机制。 Redis 4.0 之后，提供了 8 种 不同的淘汰策略。为了方便记忆，我们可以将其分为三大类： 1. 不淘汰策略 noeviction （默认策略）：当内存不足以容纳新写入数据时，新写入操作会报错。Redis 保证绝不主动删除任何数据。适用于将 Redis 作为纯持久化数据库使用的场景。 2. 在“所有键”中进行淘汰 allkeys 这类策略会在 Redis 的整个键空间中寻找要淘汰的 Key，无论这些 Key 是否设置了过期时间。 allkeys-lru ：尝试回收最长时间未使用的键（LRU，Least Recently Used），使得新添加的数据有空间存放。这是 最常用的策略 ，适用于绝大多数缓存场景。 allkeys-lfu ：尝试回收使用频率最少的键（LFU，Least Frequently Used）。 Redis 4.0+ allkeys-random ：在所有的键中，随机回收部分键。 3. 在“设置了过期时间的键”中进行淘汰 volatile 这类策略只会针对那些使用了 EXPIRE 设定期限的 Key 进行淘汰。如果没有这类 Key 可以淘汰，行为将退化为 noeviction 。 volatile-lru ：在设置了过期时间的键空间中，回收最长时间未使用的键。 volatile-lfu ：在设置了过期时间的键空间中，回收使用频率最少的键。 Redis 4.0+ volatile-random ：在设置了过期时间的键空间中，随机回收部分键。 volatile-ttl ：在设置了过期时间的键空间中，优先回收剩余存活时间（TTL）较短的键，即马上要过期的键。 --- 三、 总结与配置建议 如何查看当前策略 ：在命令行输入 CONFIG GET maxmemory-policy 。 如何修改策略 ：可以通过 CONFIG SET maxmemory-policy allkeys-lru 动态修改，或直接修改 redis.conf 并重启。 选型建议 ： 如果你只是将 Redis 用作 纯缓存 ，推荐使用 allkeys-lru 或 allkeys-lfu ； 如果你同时把 Redis 当作 数据库和缓存混合使用 ，推荐使用 volatile-lru ，确保未设置过期的核心业务数据不被意外删除。",
    "sections": [
      {
        "title": "一、 Redis 数据库清空命令",
        "anchor": "#一-redis-数据库清空命令",
        "id": "一-redis-数据库清空命令"
      },
      {
        "title": "1. 同步与异步清空 (ASYNC)",
        "anchor": "#1-同步与异步清空-async",
        "id": "1-同步与异步清空-async"
      },
      {
        "title": "二、 Redis 内存淘汰策略 (maxmemory-policy)",
        "anchor": "#二-redis-内存淘汰策略-maxmemory-policy",
        "id": "二-redis-内存淘汰策略-maxmemory-policy"
      },
      {
        "title": "1. 不淘汰策略",
        "anchor": "#1-不淘汰策略",
        "id": "1-不淘汰策略"
      },
      {
        "title": "2. 在“所有键”中进行淘汰 (allkeys)",
        "anchor": "#2-在-所有键-中进行淘汰-allkeys",
        "id": "2-在-所有键-中进行淘汰-allkeys"
      },
      {
        "title": "3. 在“设置了过期时间的键”中进行淘汰 (volatile)",
        "anchor": "#3-在-设置了过期时间的键-中进行淘汰-volatile",
        "id": "3-在-设置了过期时间的键-中进行淘汰-volatile"
      },
      {
        "title": "三、 总结与配置建议",
        "anchor": "#三-总结与配置建议",
        "id": "三-总结与配置建议"
      }
    ]
  },
  {
    "id": "aliyun-b0c5",
    "type": "post",
    "title": "彻底卸载服务器阿里云盾（安骑士）与全盘清理实战",
    "url": "posts/aliyun-b0c5.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2026-08-28",
    "tags": [
      "Linux",
      "运维",
      "阿里云",
      "安骑士",
      "系统清理",
      "Shell"
    ],
    "summary": "详细记录云服务器卸载阿里云盾（安骑士）官方脚本流程、服务强制停止与全盘深度清理命令实战指南。",
    "content": "彻底卸载服务器阿里云盾（安骑士）与全盘清理实战 在购买或使用一些云服务器时，系统中往往会预装厂商的安全服务（如阿里云盾、安骑士等）。如果你希望拥有一个纯净的系统，或者在非阿里云主机上误装了相关组件，可以通过以下步骤进行彻底卸载和清理。 > ⚠️ 危险操作预警 ：本文包含全局查找并强制删除（ rm -rf ）的命令。在正式环境执行前，请务必确认你明确知道这些命令的含义，并强烈建议提前做好系统快照或数据备份！ 一、 官方推荐卸载方式（首选） 最安全的卸载方式是使用官方提供的卸载脚本。请使用 root 权限登录服务器并执行对应命令： 1. 阿里云 ECS 服务器 bash wget \"http://update2.aegis.aliyun.com/download/uninstall.sh\" && chmod +x uninstall.sh && ./uninstall.sh 2. 非阿里云服务器 bash wget \"http://update.aegis.aliyun.com/download/uninstall.sh\" && chmod +x uninstall.sh && ./uninstall.sh --- 二、 强制停止服务与深度清理残留 如果脚本卸载不干净，或者你需要手动暴力清理，可以按照以下步骤执行。 1. 停止阿里云助手服务 首先需要停止正在运行的守护进程，否则文件可能无法删除或会自启动： bash systemctl stop aliyun.service 2. 全盘删除阿里云相关文件 利用 find 命令从根目录 / 开始深度查找，并忽略大小写（ -iname ）。 > 💡 避坑提示 ：原命令 find / -iname aliyun 中的通配符最好加上引号，写成 \"aliyun \" 。如果不加引号，当当前目录下恰好有匹配的文件时，Shell 会提前将其展开，导致 find 语法报错。 修正后的执行命令： bash find / -iname \"aliyun \" | xargs rm -rf --- 三、 扩展应用：全盘清理特定类型文件 find + xargs rm -rf 是一个非常强大的组合。比如你想清理系统中所有的 .php 文件，可以使用以下命令。 > 💡 避坑提示 ：同理， .php 必须加上引号，防止 Shell 提前解析。 修正后的执行命令： bash find / -name \" .php\" | xargs rm -rf 🛠️ 命令原理解析 find / ：从系统的根目录开始向下遍历所有子目录。 -name \" .php\" ：精确匹配以 .php 结尾的文件（区分大小写）。 | （管道符） ：将左边命令的输出结果，传递给右边的命令。 xargs ：将接收到的文件路径列表，转换为 rm -rf 命令的参数并执行。",
    "sections": [
      {
        "title": "一、 官方推荐卸载方式（首选）",
        "anchor": "#一-官方推荐卸载方式-首选",
        "id": "一-官方推荐卸载方式-首选"
      },
      {
        "title": "1. 阿里云 ECS 服务器",
        "anchor": "#1-阿里云-ecs-服务器",
        "id": "1-阿里云-ecs-服务器"
      },
      {
        "title": "2. 非阿里云服务器",
        "anchor": "#2-非阿里云服务器",
        "id": "2-非阿里云服务器"
      },
      {
        "title": "二、 强制停止服务与深度清理残留",
        "anchor": "#二-强制停止服务与深度清理残留",
        "id": "二-强制停止服务与深度清理残留"
      },
      {
        "title": "1. 停止阿里云助手服务",
        "anchor": "#1-停止阿里云助手服务",
        "id": "1-停止阿里云助手服务"
      },
      {
        "title": "2. 全盘删除阿里云相关文件",
        "anchor": "#2-全盘删除阿里云相关文件",
        "id": "2-全盘删除阿里云相关文件"
      },
      {
        "title": "三、 扩展应用：全盘清理特定类型文件",
        "anchor": "#三-扩展应用-全盘清理特定类型文件",
        "id": "三-扩展应用-全盘清理特定类型文件"
      },
      {
        "title": "🛠️ 命令原理解析",
        "anchor": "#命令原理解析",
        "id": "命令原理解析"
      }
    ]
  },
  {
    "id": "textarea-9e34",
    "type": "post",
    "title": "前端踩坑记录：如何正确获取 textarea 的光标位置？",
    "url": "posts/textarea-9e34.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-08-28",
    "tags": [
      "前端开发",
      "JavaScript",
      "DOM",
      "Textarea",
      "光标定位"
    ],
    "summary": "深度复盘与 Code Review：解析 textarea 标签赋值与事件监听误区，分享基于现代标准 API 的光标位置获取最佳实践。",
    "content": "前端踩坑记录：如何正确获取 <textarea> 的光标位置？ 在前端开发中，我们经常需要处理用户在输入框中的光标位置，比如实现“在光标处插入表情”、“@某人”或者“格式化特定文本”等功能。 最近在做项目时，回顾了一段用于获取 <textarea> 焦点位置的 JavaScript 代码。虽然基本功能能跑通，但里面暗藏了不少新手容易踩的坑。今天就来做一次深度的 Code Review，并分享优化后的最佳实践。 ❌ 那些年我们踩过的坑 在处理 <textarea> 时，常犯的几个错误： 1. <textarea> 标签赋值的经典误区 ： 习惯了给 <input> 加 value 属性，很容易顺手写出 <textarea value=\"测试文本\"></textarea> 。但实际上， <textarea> 是闭合标签，初始文本必须放在开闭标签之间： <textarea>测试文本</textarea> 。 2. 事件监听不够全面 ： 很多时候我们只记得监听 onclick （鼠标点击）和 oninput （输入内容），却漏掉了 键盘方向键（↑ ↓ ← →） 移动光标的场景。如果没有 onkeyup ，用户用键盘移动光标时，位置信息就不会更新。 3. 现代语法与上古 IE 代码的“缝合” ： 有些网上的代码片段不仅带着 IE8 时代的 document.selection API，还混用了 ES6 的 let 。在现代浏览器环境下，直接使用 selectionStart 才是正解，祖传的兼容代码该断舍离就得断舍离。 ✨ 优化后的最佳实践代码 针对以上痛点，这里给出一份干净、严谨的最佳实践代码： html <!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>获取光标位置最佳实践</title> </head> <body> <!-- 修正了默认值的写法，并增加了 onkeyup 监听键盘方向键移动光标 --> <textarea name=\"\" id=\"txt\" cols=\"30\" rows=\"10\" onclick=\"cursorMove \" onkeyup=\"cursorMove \" oninput=\"Vchange \">测试文本</textarea> <script> // 统一处理光标移动的事件（点击、键盘导航） function cursorMove { console.log '光标移动或点击------------', getPosition 'txt' ; } // 处理内容输入的事件 function Vchange { console.log '用户输入------------', getPosition 'txt' ; } // 获取 input 或 textarea 焦点位置的核心函数 function getPosition id { let oElement = document.getElementById id ; let cursorPos = 0; // 现代浏览器标准写法优先，判断更加严谨 if typeof oElement.selectionStart === 'number' { cursorPos = oElement.selectionStart; } else if document.selection { // 兼容旧版 IE 如果项目不需要兼容 IE8，这部分可以完全删除 let selectRange = document.selection.createRange ; selectRange.moveStart 'character', -oElement.value.length ; cursorPos = selectRange.text.length; } return cursorPos; } </script> </body> </html> 💡 总结 处理 DOM 元素状态时，细节决定成败： - 赋值要注意标签的固有属性和结构。 - 交互事件要考虑全面（鼠标 + 键盘）。 - 借用代码时，务必结合当前的业务场景和兼容性要求进行裁剪。 希望这篇简短的记录能帮你避开光标处理的坑！",
    "sections": [
      {
        "title": "❌ 那些年我们踩过的坑",
        "anchor": "#那些年我们踩过的坑",
        "id": "那些年我们踩过的坑"
      },
      {
        "title": "✨ 优化后的最佳实践代码",
        "anchor": "#优化后的最佳实践代码",
        "id": "优化后的最佳实践代码"
      },
      {
        "title": "💡 总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "wx-img-refresh-ffc2",
    "type": "post",
    "title": "微信小程序踩坑记录：如何完美解决图片强制刷新（彻底告别本地缓存）",
    "url": "posts/wx-img-refresh-ffc2.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-08-23",
    "tags": [
      "前端开发",
      "微信小程序",
      "缓存优化",
      "性能优化"
    ],
    "summary": "深度剖析微信小程序图片本地强缓存与渲染层复用机制，系统总结 URL 时间戳、HTTP 头控制、Base64 编码、wx:if 渲染层重建、云开发临时链接及 FileSystemManager 本地沙盒接管等 8 种全场景强制刷新实战方案。",
    "content": "微信小程序踩坑记录：如何完美解决图片强制刷新（彻底告别本地缓存） 在微信小程序开发中，我们经常会遇到这样一个令人头疼的问题： 明明服务器上的图片已经更新了，但小程序里显示的依然是旧图片 。 这背后的“罪魁祸首”是微信客户端的底层缓存机制——为了提升加载速度、节省用户流量，微信会极其激进地把相同 URL 的图片缓存在本地。只要 URL 不变，无论你怎么刷新页面，它都会优先读取本地的旧图。 为了解决这个问题，本文总结了 8 种强制刷新图片的方法，涵盖了从常规业务到极限边缘场景的各种解决方案，建议收藏备用！ --- 一、核心方法（解决 95% 的日常场景） 1. URL 追加时间戳或随机数（⭐ 前端最常用） 这是最简单、最粗暴但也最有效的纯前端解决方案。既然微信是认 URL 的，那我们就让每一次请求的 URL 看起来都是“新”的。 通过在原图片链接后加上动态的查询参数（如时间戳 ?t= ），可以彻底绕过微信的本地缓存。 javascript // 原图片地址 let imageUrl = \"https://example.com/avatar.png\"; // 追加时间戳（推荐，保证绝对唯一） let refreshUrl = ${imageUrl}?t=${Date.now } ; // 追加随机数（备选方案） let refreshUrlRandom = ${imageUrl}?r=${Math.random } ; // 更新到视图 this.setData { currentImage: refreshUrl } ; > 💡 适用场景 ：用户频繁更换头像、商品主图动态替换、生成动态分享海报等。 --- 2. 更改服务器端图片文件名（⭐ 架构最规范） 如果你能控制源头，最好的做法其实是 不要覆盖原文件 ，而是直接在服务器或 OSS（对象存储）上上传一张新图片，并赋予新的文件名。 - 旧版本 ： banner_v1.png - 新版本 ： banner_v2.png > 💡 适用场景 ：首页 Banner、UI 静态图标、活动海报等。这符合静态资源版本管理的最佳实践。 --- 3. 配置 HTTP 响应头控制缓存（需后端配合） 如果你拥有服务器（如 Nginx）或 OSS 的配置权限，可以通过 HTTP 响应头，直接给客户端下达指令：“这张图片绝对不能缓存”。 在服务器配置中添加以下 Header： http Cache-Control: no-cache, no-store, must-revalidate Pragma: no-cache Expires: 0 > ⚠️ 注意 ：这种方法会导致每次加载该图片都会消耗网络流量和服务器带宽，拖慢加载速度。仅建议在极少数必须保证“绝对实时同步”的图片上使用。 --- 4. 转为 Base64 格式渲染 Base64 字符串是直接写在代码或数据流里的，本质上它是一段文本，不再发起独立的 HTTP 网络请求。只要字符串变了，图片就会立刻强制更新，完全不存在网络缓存问题。 > 💡 适用场景 ：体积非常小（KB 级别）的验证码图片，或由 Canvas 动态生成并直接展示的小图。 --- 二、进阶与特殊场景（解决剩下的 5% 疑难杂症） 5. 强制销毁并重建 <image> 组件（解决渲染层死锁） 有时候你会发现，URL 明明已经加了时间戳变了，但页面上的图片就是“卡住”不刷新。这大概率是因为小程序的 WebView 渲染层复用组件 导致的。 遇到这种情况，可以通过 wx:if 先把组件从页面树中彻底移除，然后再重新挂载，强制触发图片重新加载。 javascript // 先隐藏组件 this.setData { showImage: false }, => { // 等待渲染完成后，立刻设为 true，并赋予新链接 wx.nextTick => { this.setData { showImage: true, imageUrl: \"https://example.com/img.png?t=\" + Date.now } ; } ; } ; --- 6. 微信云开发（CloudBase）缓存突破法 如果你使用的是微信云开发的云存储（ cloud://... ），当你在云端覆盖上传了同名文件后，直接用 Cloud ID 渲染，微信客户端大概率会死死缓存住旧图片， 而且加时间戳对 Cloud ID 是无效的！ 解决方案 ：使用 wx.cloud.getTempFileURL 将 Cloud ID 换成真实的 HTTPS 临时链接，再对这个 HTTPS 链接加时间戳。 javascript wx.cloud.getTempFileURL { fileList: 'cloud://your-env-id.xxx/avatar.png' , success: res => { let tempUrl = res.fileList 0 .tempFileURL; // 对真实的 https 链接加时间戳 this.setData { imageUrl: ${tempUrl}?t=${Date.now } } ; } } ; --- 7. FileSystemManager 手动接管缓存 如果你的业务不想浪费用户流量（比如几 MB 大小的超高清壁纸），又必须精确控制图片的更新，你可以彻底放弃 <image> 的网络请求，由代码接管。 实现思路 ： 1. 用 wx.downloadFile 下载图片到本地临时路径； 2. 用 wx.getFileSystemManager .saveFile 保存到本地沙盒，并将这个 本地路径 提供给 <image> 渲染； 3. 需要更新时，调用 FileSystemManager.removeSavedFile 删掉旧文件，重新触发步骤 1。 > 💡 适用场景 ：壁纸类、离线阅读类、大型游戏资源包等流量极其敏感的应用。 --- 8. wx.request 获取 ArrayBuffer 绕过机制 通过 HTTP 请求直接获取图片的二进制数据，完全跳过微信客户端针对 <image> 标签的缓存拦截层。 实现思路 ： 将 wx.request 的 responseType 设置为 arraybuffer 。拿到数据后，利用 wx.arrayBufferToBase64 转为 Base64 赋值给前端显示。这种方式不仅能无视 <image> 缓存，还能在请求头里自由设置自定义校验。 --- 三、方案选型与决策建议 | 需求场景 | 推荐方案 | 优缺点对比 | | :--- | :--- | :--- | | 头像更新、状态图替换 | 方法 1：URL 拼时间戳 ?t=xxx | 最方便，成本最低，前端单方面即可搞定 | | 整体 UI 更新、Banner 替换 | 方法 2：上传新版本并更改文件名 | 最规范，有利于 CDN 分发和版本追溯 | | 云开发资源同名覆盖 | 方法 6：换取 HTTPS 临时链接 + 时间戳 | 专治云开发 Cloud ID 的顽固缓存死锁 | | 无论怎么改 URL 画面都不动 | 方法 5： wx:if 重建组件 | 解决渲染层复用机制导致的假死问题 | 遇到图片不更新的坑，对照上面的方案对号入座，即可快速精准解决！",
    "sections": [
      {
        "title": "一、核心方法（解决 95% 的日常场景）",
        "anchor": "#一-核心方法-解决-95-的日常场景",
        "id": "一-核心方法-解决-95-的日常场景"
      },
      {
        "title": "1. URL 追加时间戳或随机数（⭐ 前端最常用）",
        "anchor": "#1-url-追加时间戳或随机数-前端最常用",
        "id": "1-url-追加时间戳或随机数-前端最常用"
      },
      {
        "title": "2. 更改服务器端图片文件名（⭐ 架构最规范）",
        "anchor": "#2-更改服务器端图片文件名-架构最规范",
        "id": "2-更改服务器端图片文件名-架构最规范"
      },
      {
        "title": "3. 配置 HTTP 响应头控制缓存（需后端配合）",
        "anchor": "#3-配置-http-响应头控制缓存-需后端配合",
        "id": "3-配置-http-响应头控制缓存-需后端配合"
      },
      {
        "title": "4. 转为 Base64 格式渲染",
        "anchor": "#4-转为-base64-格式渲染",
        "id": "4-转为-base64-格式渲染"
      },
      {
        "title": "二、进阶与特殊场景（解决剩下的 5% 疑难杂症）",
        "anchor": "#二-进阶与特殊场景-解决剩下的-5-疑难杂症",
        "id": "二-进阶与特殊场景-解决剩下的-5-疑难杂症"
      },
      {
        "title": "5. 强制销毁并重建 `<image>` 组件（解决渲染层死锁）",
        "anchor": "#5-强制销毁并重建-image-组件-解决渲染层死锁",
        "id": "5-强制销毁并重建-image-组件-解决渲染层死锁"
      },
      {
        "title": "6. 微信云开发（CloudBase）缓存突破法",
        "anchor": "#6-微信云开发-cloudbase-缓存突破法",
        "id": "6-微信云开发-cloudbase-缓存突破法"
      },
      {
        "title": "7. FileSystemManager 手动接管缓存",
        "anchor": "#7-filesystemmanager-手动接管缓存",
        "id": "7-filesystemmanager-手动接管缓存"
      },
      {
        "title": "8. `wx.request` 获取 ArrayBuffer 绕过机制",
        "anchor": "#8-wx-request-获取-arraybuffer-绕过机制",
        "id": "8-wx-request-获取-arraybuffer-绕过机制"
      },
      {
        "title": "三、方案选型与决策建议",
        "anchor": "#三-方案选型与决策建议",
        "id": "三-方案选型与决策建议"
      }
    ]
  },
  {
    "id": "claude-perms-08be",
    "type": "post",
    "title": "Claude Code 开启 Bypass 免确认权限配置指南",
    "url": "posts/claude-perms-08be.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-08-10",
    "tags": [
      "效率工具",
      "Claude",
      "AI工具",
      "终端工具",
      "开发提效"
    ],
    "summary": "详解 Claude Code CLI 工具的配置文件位置与 bypassPermissions 权限模式，跳过危险操作与命令执行的频繁确认提示，实现高效全自动化 Coding。",
    "content": "Claude Code 开启 Bypass 免确认权限配置指南 > Claude Code 是 Anthropic 官方推出的终端 AI 编程助手。在日常执行多步骤重构、运行测试或批量读写文件时，频繁的安全确认弹窗会打断心流。本文介绍如何配置 bypassPermissions 模式以实现全自动化执行。 --- 一、配置文件路径说明 Claude Code 的全局用户配置文件通常存放在用户主目录下： - macOS / Linux ： ~/.claude.json 或 ~/.claude/config.json - Windows ： C:\\Users\\<你的用户名>\\.claude.json --- 二、核心配置代码 在配置文件中找到或添加 permissions 相关配置段，设置为 bypassPermissions 模式： json { \"permissions\": { \"defaultMode\": \"bypassPermissions\" }, \"skipDangerousModePermissionPrompt\": true } --- 三、配置项核心参数解析 | 配置键名 | 取值类型 | 功能说明 | | :--- | :--- | :--- | | defaultMode | string | 权限策略。设置为 \"bypassPermissions\" 时，文件读写与普通命令将不再每次弹窗要求确认。 | | skipDangerousModePermissionPrompt | boolean | 是否跳过危险命令/全权限模式的安全警告确认，设为 true 可实现全自动静默运行。 | --- 四、安全使用建议 ⚠️ 1. 工作区隔离 ：建议在已纳入 Git 版本控制的独立项目目录中使用该模式，以便随时通过 git status / git diff 审阅或一键撤回更改。 2. 敏感环境防护 ：在包含生产密钥、云凭据或重要系统环境的机器上，建议保持默认确认模式。",
    "sections": [
      {
        "title": "一、配置文件路径说明",
        "anchor": "#一-配置文件路径说明",
        "id": "一-配置文件路径说明"
      },
      {
        "title": "二、核心配置代码",
        "anchor": "#二-核心配置代码",
        "id": "二-核心配置代码"
      },
      {
        "title": "三、配置项核心参数解析",
        "anchor": "#三-配置项核心参数解析",
        "id": "三-配置项核心参数解析"
      },
      {
        "title": "四、安全使用建议 ⚠️",
        "anchor": "#四-安全使用建议",
        "id": "四-安全使用建议"
      }
    ]
  },
  {
    "id": "git-cheatsheet-c495",
    "type": "post",
    "title": "Git 常用高频命令与分支协同工作流速查清单",
    "url": "posts/git-cheatsheet-c495.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-08-05",
    "tags": [
      "效率工具",
      "Git",
      "版本控制",
      "工作流",
      "开发提效"
    ],
    "summary": "系统整理日常开发中最常用的 Git 核心操作：SSH 密钥生成、全局身份配置、分支管理、暂存区操作、回退撤销与冲突解决速查。",
    "content": "Git 常用高频命令与分支协同工作流速查清单 > Git 是现代软件工程不可或缺的分布式版本控制系统。本文精选日常敏捷开发中最常用、最容易遗忘的核心命令清单。 --- 一、初始配置与 SSH 密钥生成 1. 配置全局用户名与邮箱 bash git config --global user.name \"你的名字\" git config --global user.email \"your_email@example.com\" 2. 生成 SSH 密钥并添加到 GitHub / GitLab bash ssh-keygen -t ed25519 -C \"your_email@example.com\" 或传统 RSA 格式： ssh-keygen -t rsa -b 4096 -C \"your_email@example.com\" 查看并复制生成的公钥内容（粘贴至 GitHub Settings -> SSH Keys ）： - Linux / macOS ： cat ~/.ssh/id_ed25519.pub 或 cat ~/.ssh/id_rsa.pub - Windows ： type %USERPROFILE%\\.ssh\\id_rsa.pub --- 二、基础操作与提交工作流 | 操作场景 | 推荐命令 | 说明 | | :--- | :--- | :--- | | 初始化本地仓库 | git init | 在当前目录下创建 .git 版本库 | | 克隆远程仓库 | git clone <仓库URL> | 完整下载远程代码库 | | 查看工作区状态 | git status | 查看文件修改、暂存与未跟踪状态 | | 添加所有更改至暂存区 | git add . | 暂存所有新建和被修改文件 | | 提交并附带信息 | git commit -m \"feat: 提交说明\" | 提交暂存区内容到版本库 | | 推送到远程默认分支 | git push origin main | 推送本地提交到远程仓库 | | 拉取远程最新代码 | git pull origin main | 获取远程更新并自动合并 | --- 三、分支管理与协作流程 bash 1. 查看本地与远程所有分支 git branch -a 2. 创建并切换到新特性分支 git checkout -b feature/login 或新版命令： git switch -c feature/login 3. 切换回主分支 git checkout main 或新版命令： git switch main 4. 合并指定分支到当前分支 git merge feature/login 5. 删除已合并的本地分支 git branch -d feature/login --- 四、暂存与撤销操作（救急锦囊） 1. 临时保存未完成的工作（Stash） bash 暂存当前未提交的工作区修改 git stash 查看暂存列表 git stash list 恢复最近一次暂存并从 stash 列表中删除 git stash pop 2. 撤销修改与版本回退 bash 丢弃工作区中某个文件的未暂存修改 git checkout -- <文件名> 或新版：git restore <文件名> 撤销最近一次 commit，但保留工作区修改（软回退，最常用） git reset --soft HEAD~1 彻底回退到某个历史 commit（危险：工作区未保存代码会丢失） git reset --hard <commit-id>",
    "sections": [
      {
        "title": "一、初始配置与 SSH 密钥生成",
        "anchor": "#一-初始配置与-ssh-密钥生成",
        "id": "一-初始配置与-ssh-密钥生成"
      },
      {
        "title": "1. 配置全局用户名与邮箱",
        "anchor": "#1-配置全局用户名与邮箱",
        "id": "1-配置全局用户名与邮箱"
      },
      {
        "title": "2. 生成 SSH 密钥并添加到 GitHub / GitLab",
        "anchor": "#2-生成-ssh-密钥并添加到-github-gitlab",
        "id": "2-生成-ssh-密钥并添加到-github-gitlab"
      },
      {
        "title": "二、基础操作与提交工作流",
        "anchor": "#二-基础操作与提交工作流",
        "id": "二-基础操作与提交工作流"
      },
      {
        "title": "三、分支管理与协作流程",
        "anchor": "#三-分支管理与协作流程",
        "id": "三-分支管理与协作流程"
      },
      {
        "title": "四、暂存与撤销操作（救急锦囊）",
        "anchor": "#四-暂存与撤销操作-救急锦囊",
        "id": "四-暂存与撤销操作-救急锦囊"
      },
      {
        "title": "1. 临时保存未完成的工作（Stash）",
        "anchor": "#1-临时保存未完成的工作-stash",
        "id": "1-临时保存未完成的工作-stash"
      },
      {
        "title": "2. 撤销修改与版本回退",
        "anchor": "#2-撤销修改与版本回退",
        "id": "2-撤销修改与版本回退"
      }
    ]
  },
  {
    "id": "svn-cheatsheet-1d69",
    "type": "post",
    "title": "SVN (Subversion) 常用版本控制命令速查与批量清理指南",
    "url": "posts/svn-cheatsheet-1d69.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-07-30",
    "tags": [
      "效率工具",
      "SVN",
      "版本控制",
      "命令行技巧"
    ],
    "summary": "整理 SVN 核心操作命令速查表，重点讲解在 macOS/Linux 终端下一键批量添加未跟踪文件 (?) 与批量删除丢失文件 (!) 的 Shell 管道组合技巧。",
    "content": "SVN 常用版本控制命令速查与批量清理指南 > SVN Apache Subversion 是经典集中式版本控制系统。在日常使用终端管理 SVN 仓库时，经常需要处理本地文件批量增删的同步问题。本文精选高频实用命令与批量处理技巧。 --- 一、日常核心命令速查表 | 操作场景 | 推荐命令 | 简要说明 | | :--- | :--- | :--- | | 检出仓库 Checkout | svn checkout <URL> 目录名 | 首次下载远程仓库到本地（可缩写为 svn co ） | | 更新代码 Update | svn update | 将远程最新提交同步到当前工作区（可缩写为 svn up ） | | 查看修改状态 Status | svn status | 查看当前工作区状态（可缩写为 svn st ） | | 提交修改 Commit | svn commit -m \"提交说明\" | 提交已修改内容至远程版本库（可缩写为 svn ci ） | | 添加新文件 Add | svn add <文件名/目录> | 将新建文件纳入版本控制 | | 还原修改 Revert | svn revert <文件名> | 撤销本地未提交的修改 | | 查看日志 Log | svn log -l 10 | 查看最近 10 条提交历史记录 | --- 二、终端高效技巧：批量处理增删文件（重点） 在日常重构或通过外部工具（如 Finder / VSCode）批量操作了大量文件后， svn status 会出现大量 ? （未跟踪）或 ! （本地已丢失）状态。使用以下单行 Shell 管道命令可一键批量处理： 1. 批量删除所有丢失的文件（状态为 ! ） 如果你在本地物理删除了很多文件，需要同步从 SVN 版本控制中标记删除： bash svn status | grep '^!' | sed 's/^! //' | xargs svn delete 2. 批量添加所有新创建的文件（状态为 ? ） 如果你在本地新建了许多文件，需要一次性全部纳入 SVN 追踪： bash svn status | grep '^?' | sed 's/^? //' | xargs svn add --- 三、解决版本冲突 Conflict Resolution 当执行 svn update 产生代码冲突时，冲突文件会标记为 C ： 1. 查看冲突状态 ： svn status 2. 选择解决方案 ： - 保留我的版本（覆盖远程）： svn resolve --accept mine-full <文件名> - 保留远程版本（放弃本地）： svn resolve --accept theirs-full <文件名> 3. 标记冲突已解决 ： svn resolved <文件名> 4. 提交代码 ： svn commit -m \"fix: 解决合并冲突\"",
    "sections": [
      {
        "title": "一、日常核心命令速查表",
        "anchor": "#一-日常核心命令速查表",
        "id": "一-日常核心命令速查表"
      },
      {
        "title": "二、终端高效技巧：批量处理增删文件（重点）",
        "anchor": "#二-终端高效技巧-批量处理增删文件-重点",
        "id": "二-终端高效技巧-批量处理增删文件-重点"
      },
      {
        "title": "1. 批量删除所有丢失的文件（状态为 `!`）",
        "anchor": "#1-批量删除所有丢失的文件-状态为",
        "id": "1-批量删除所有丢失的文件-状态为"
      },
      {
        "title": "2. 批量添加所有新创建的文件（状态为 `?`）",
        "anchor": "#2-批量添加所有新创建的文件-状态为",
        "id": "2-批量添加所有新创建的文件-状态为"
      },
      {
        "title": "三、解决版本冲突 (Conflict Resolution)",
        "anchor": "#三-解决版本冲突-conflict-resolution",
        "id": "三-解决版本冲突-conflict-resolution"
      }
    ]
  },
  {
    "id": "docker-mirror-5e12",
    "type": "post",
    "title": "Linux 生产环境 Docker 官方一键安装脚本与国内镜像加速配置",
    "url": "posts/docker-mirror-5e12.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-07-20",
    "tags": [
      "Linux",
      "Docker",
      "运维",
      "服务器"
    ],
    "summary": "整理 Ubuntu/Debian/CentOS 下 Docker CE 与 Docker Compose 官方标准安装流程及最新稳定镜像源配置。",
    "content": "安装 Docker（Linux）官方脚本 sh curl -fsSL https://get.docker.com -o get-docker.sh sudo sh get-docker.sh Docker 常用命令汇总 让我们开始探索 Docker 的三大核心要素： 镜像（Image） 、 容器（Container） 和 数据卷（Volume） 。 一、🚀 镜像 Image 操作：构建与获取基石 镜像是容器运行的基础，它包含了运行应用程序所需的所有文件、库和配置。 1. 获取和管理镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker pull | 下载 远程镜像（如 Docker Hub） | docker pull nginx:latest | | docker images | 列出 本地所有镜像 | docker images -a 显示所有镜像，包括中间层 | | docker search | 搜索 Docker Hub 上的镜像 | docker search redis | | docker rmi | 删除 本地的一个或多个镜像 | docker rmi myimage:tag 删除前需停止依赖的容器 | 2. 构建和分享镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker build | 使用 Dockerfile 构建 新镜像 | docker build -t myapp:v1.0 . -t 命名标签, . 为上下文路径 | | docker push | 推送 镜像到远程仓库 | docker push username/repo:tag | | docker history | 查看 镜像的构建历史和层信息 | docker history myapp:v1.0 | --- 二、📦 容器 Container 操作：运行与交互环境 容器是镜像的运行时实例。它是轻量级、可移植且相互隔离的。 1. 容器的生命周期管理 这是日常操作中最频繁使用的一组命令。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker run | 创建并启动 容器（最重要） | docker run -d --name web -p 8080:80 nginx | | | | -d : 后台运行 | | | | --name : 命名容器 | | | | -p : 端口映射 宿主机端口:容器端口 | | docker ps | 列出 运行中的容器 | docker ps -a 列出所有容器，包括已停止的 | | docker start / stop / restart | 启停/重启 容器 | docker stop web | | docker rm | 删除 一个已停止的容器 | docker rm web | | docker kill | 强制停止 容器（立即发送 SIGKILL） | docker kill web | 2. 容器的交互与调试 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker logs | 查看 容器的标准输出日志 | docker logs -f web -f 持续跟踪日志 | | docker exec | 在运行中的容器内 执行命令 | docker exec -it web /bin/bash 进入容器的 shell 环境 | | docker attach | 连接 到容器的主进程 | 慎用！退出可能会导致容器停止。 | | docker inspect | 查看 容器的详细配置和状态 | docker inspect web | | docker cp | 复制 文件/目录到容器或从容器复制 | docker cp /host/file.txt web:/app/ | --- 三、💾 数据与网络：持久化与互联 在生产环境中，数据卷和网络是确保数据持久性和服务间通信的关键。 1. 数据卷 Volume 管理 数据卷用于将数据存储在宿主机的文件系统中，独立于容器的生命周期，实现数据持久化。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker run -v | 运行时 挂载 数据卷或目录 | docker run -v mydata:/app/data ... 挂载命名卷 | | docker volume create | 创建 命名数据卷 | docker volume create mydata | | docker volume ls | 列出 所有数据卷 | | | docker volume rm | 删除 数据卷 | docker volume rm mydata | 2. 网络 Network 管理 Docker 默认提供了 bridge 等网络模式，但创建自定义网络能更好地实现容器间的隔离和命名解析。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker network create | 创建 自定义网络 | docker network create my-bridge | | docker network ls | 列出 所有网络 | | | docker network connect | 将容器 连接 到指定网络 | docker network connect my-bridge web | --- 四、🧹 维护与清理：保持环境整洁 Docker 用久了会堆积大量的停止容器、未使用的网络和悬空镜像，占用磁盘空间。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker system df | 查看 Docker 磁盘空间使用情况 | | | docker system prune | 一键清理 停止的容器、未使用的网络和悬空镜像 | docker system prune -a | | | | -a 会删除所有未被任何容器使用的镜像 |",
    "sections": [
      {
        "title": "安装 Docker（Linux）官方脚本 ##",
        "anchor": "#安装-docker-linux-官方脚本",
        "id": "安装-docker-linux-官方脚本"
      },
      {
        "title": "Docker 常用命令汇总",
        "anchor": "#docker-常用命令汇总",
        "id": "docker-常用命令汇总"
      },
      {
        "title": "一、🚀 镜像 (Image) 操作：构建与获取基石",
        "anchor": "#一-镜像-image-操作-构建与获取基石",
        "id": "一-镜像-image-操作-构建与获取基石"
      },
      {
        "title": "1. 获取和管理镜像",
        "anchor": "#1-获取和管理镜像",
        "id": "1-获取和管理镜像"
      },
      {
        "title": "2. 构建和分享镜像",
        "anchor": "#2-构建和分享镜像",
        "id": "2-构建和分享镜像"
      },
      {
        "title": "二、📦 容器 (Container) 操作：运行与交互环境",
        "anchor": "#二-容器-container-操作-运行与交互环境",
        "id": "二-容器-container-操作-运行与交互环境"
      },
      {
        "title": "1. 容器的生命周期管理",
        "anchor": "#1-容器的生命周期管理",
        "id": "1-容器的生命周期管理"
      },
      {
        "title": "2. 容器的交互与调试",
        "anchor": "#2-容器的交互与调试",
        "id": "2-容器的交互与调试"
      },
      {
        "title": "三、💾 数据与网络：持久化与互联",
        "anchor": "#三-数据与网络-持久化与互联",
        "id": "三-数据与网络-持久化与互联"
      },
      {
        "title": "1. 数据卷 (Volume) 管理",
        "anchor": "#1-数据卷-volume-管理",
        "id": "1-数据卷-volume-管理"
      },
      {
        "title": "2. 网络 (Network) 管理",
        "anchor": "#2-网络-network-管理",
        "id": "2-网络-network-管理"
      },
      {
        "title": "四、🧹 维护与清理：保持环境整洁",
        "anchor": "#四-维护与清理-保持环境整洁",
        "id": "四-维护与清理-保持环境整洁"
      }
    ]
  },
  {
    "id": "img-compress-tools-4c4a",
    "type": "post",
    "title": "高质量无损图片压缩工具与批量处理方案横向评测",
    "url": "posts/img-compress-tools-4c4a.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-07-15",
    "tags": [
      "效率工具",
      "图片压缩",
      "Web优化"
    ],
    "summary": "横向对比 TinyPNG、Caesium、Squoosh 等多款主流压缩工具，如何在保持视觉高保真的同时将体积缩减 70%。",
    "content": "图片压缩工具（在线压缩） 在线压缩工具推荐 1. TinyPNG - 最受欢迎的在线压缩工具 官网 https://tinypng.com 特点： - ✅ 支持 PNG、JPEG、WebP 格式 - ✅ 智能压缩算法，质量损失小 - ✅ 免费版单次可上传 20 张图片，单张最大 5MB - ✅ 支持批量压缩和下载 - ✅ 提供 API 接口供开发者使用 压缩原理： 使用有损压缩算法，通过减少图片中的颜色数量和优化像素数据来减小文件大小。 适用场景： 网页图片、社交媒体图片、电商产品图 --- 2. JPEGmini - 专业级 JPEG 压缩 官网 https://jpegmini.com 特点： - ✅ 专注于 JPEG 格式压缩 - ✅ 保持高质量的同时实现高压缩率 - ✅ 支持 4K/8K 高清图片 - ✅ 提供桌面版和在线版 - ✅ 适合专业摄影师和设计师 压缩原理： 利用人眼视觉特性，在不影响主观质量的前提下去除冗余数据。 适用场景： 摄影作品、高清图片、专业设计 --- 3. Compressor.io - 多种压缩模式 官网 https://compressor.io 特点： - ✅ 支持 PNG、JPEG、GIF、SVG 格式 - ✅ 提供有损和无损两种压缩模式 - ✅ 实时预览压缩前后对比 - ✅ 显示压缩比例和文件大小 - ✅ 支持拖拽上传 压缩原理： 结合多种压缩算法，根据图片类型自动选择最优方案。 适用场景： 需要精确控制压缩质量的场景 --- 4. Kraken.io - 开发者友好 官网 https://kraken.io 特点： - ✅ 支持多种图片格式 - ✅ 提供强大的 API 接口 - ✅ 支持 WebP 和 AVIF 格式转换 - ✅ 批量压缩功能 - ✅ CDN 集成支持 压缩原理： 结合 Google 的 Guetzli 和 Zopfli 算法，实现高质量压缩。 适用场景： 开发者、网站优化、批量处理 --- 5. Squoosh - Google 开源工具 官网 https://squoosh.app 特点： - ✅ Google 开源项目 - ✅ 完全基于浏览器，数据不上传服务器 - ✅ 实时调整压缩参数 - ✅ 支持多种格式转换 - ✅ 显示详细的压缩信息 压缩原理： 使用 WebAssembly 技术在浏览器端进行压缩，保护用户隐私。 适用场景： 注重隐私安全的用户、需要精确调整参数的场景 --- 本地压缩工具 1. ImageOptim（Mac） 官网 https://imageoptim.com 特点： - ✅ 免费开源 - ✅ 支持拖放操作 - ✅ 自动选择最优压缩算法 - ✅ 支持 PNG、JPEG、GIF、WebP - ✅ 保持原始文件结构 2. RIOT（Windows） 官网 https://riot-optimizer.com 特点： - ✅ 免费软件 - ✅ 支持批量处理 - ✅ 实时预览压缩效果 - ✅ 支持 PNG、JPEG、WebP - ✅ 提供多种压缩级别 3. GIMP（跨平台） 官网 https://www.gimp.org 特点： - ✅ 免费开源图像编辑软件 - ✅ 强大的图片处理功能 - ✅ 支持多种格式导出 - ✅ 可自定义压缩参数 - ✅ 适合高级用户 --- 压缩技巧和最佳实践 1. 选择合适的图片格式 | 格式 | 特点 | 适用场景 | |------|------|----------| | JPEG | 有损压缩，支持数百万颜色 | 照片、复杂图像 | | PNG | 无损压缩，支持透明 | 图标、Logo、简单图形 | | WebP | Google 开发，压缩率更高 | 现代浏览器网页 | | AVIF | 新一代格式，压缩率最高 | 追求极致压缩率 | 2. 压缩参数设置建议 - 网页图片 ：质量 60-80%，平衡大小和质量 - 缩略图 ：质量 50-70%，优先减小体积 - 高清展示图 ：质量 80-90%，保证视觉效果 - Logo/图标 ：使用 PNG 或 SVG，保持清晰度 3. 批量压缩流程 1. 收集需要压缩的图片 2. 选择合适的压缩工具 3. 设置压缩参数 4. 预览压缩效果 5. 批量压缩并下载 6. 替换原始图片 7. 测试页面加载效果 4. 自动化压缩脚本 bash 使用 Node.js 批量压缩图片 npm install imagemin imagemin-mozjpeg imagemin-pngquant const imagemin = require 'imagemin' ; const imageminMozjpeg = require 'imagemin-mozjpeg' ; const imageminPngquant = require 'imagemin-pngquant' ; async => { const files = await imagemin 'src/images/ .{jpg,png}' , { destination: 'dist/images', plugins: imageminMozjpeg { quality: 80 } , imageminPngquant { quality: 0.6, 0.8 } } ; console.log '压缩完成:', files ; } ; --- 压缩效果对比 | 工具 | 原始大小 | 压缩后大小 | 压缩率 | |------|---------|-----------|--------| | TinyPNG | 100KB | 35KB | 65% | | Compressor.io | 100KB | 38KB | 62% | | Kraken.io | 100KB | 32KB | 68% | | Squoosh | 100KB | 36KB | 64% | --- 选择建议 | 需求 | 推荐工具 | |------|----------| | 快速压缩 | TinyPNG | | 隐私安全 | Squoosh | | 批量处理 | Kraken.io | | 专业设计 | JPEGmini | | 开发者 | Kraken.io API | | 免费本地 | ImageOptim/RIOT | --- 注意事项 1. 备份原始图片 ：压缩前最好备份原始文件 2. 测试压缩效果 ：不同图片压缩效果不同，需测试 3. 注意版权 ：确保有权利压缩和使用图片 4. 格式兼容性 ：考虑目标平台的格式支持 5. 压缩级别 ：不要过度压缩，影响视觉效果 --- > 选择合适的压缩工具可以显著减小图片体积，提升网页加载速度，改善用户体验！",
    "sections": [
      {
        "title": "在线压缩工具推荐",
        "anchor": "#在线压缩工具推荐",
        "id": "在线压缩工具推荐"
      },
      {
        "title": "1. TinyPNG - 最受欢迎的在线压缩工具",
        "anchor": "#1-tinypng-最受欢迎的在线压缩工具",
        "id": "1-tinypng-最受欢迎的在线压缩工具"
      },
      {
        "title": "2. JPEGmini - 专业级 JPEG 压缩",
        "anchor": "#2-jpegmini-专业级-jpeg-压缩",
        "id": "2-jpegmini-专业级-jpeg-压缩"
      },
      {
        "title": "3. Compressor.io - 多种压缩模式",
        "anchor": "#3-compressor-io-多种压缩模式",
        "id": "3-compressor-io-多种压缩模式"
      },
      {
        "title": "4. Kraken.io - 开发者友好",
        "anchor": "#4-kraken-io-开发者友好",
        "id": "4-kraken-io-开发者友好"
      },
      {
        "title": "5. Squoosh - Google 开源工具",
        "anchor": "#5-squoosh-google-开源工具",
        "id": "5-squoosh-google-开源工具"
      },
      {
        "title": "本地压缩工具",
        "anchor": "#本地压缩工具",
        "id": "本地压缩工具"
      },
      {
        "title": "1. ImageOptim（Mac）",
        "anchor": "#1-imageoptim-mac",
        "id": "1-imageoptim-mac"
      },
      {
        "title": "2. RIOT（Windows）",
        "anchor": "#2-riot-windows",
        "id": "2-riot-windows"
      },
      {
        "title": "3. GIMP（跨平台）",
        "anchor": "#3-gimp-跨平台",
        "id": "3-gimp-跨平台"
      },
      {
        "title": "压缩技巧和最佳实践",
        "anchor": "#压缩技巧和最佳实践",
        "id": "压缩技巧和最佳实践"
      },
      {
        "title": "1. 选择合适的图片格式",
        "anchor": "#1-选择合适的图片格式",
        "id": "1-选择合适的图片格式"
      },
      {
        "title": "2. 压缩参数设置建议",
        "anchor": "#2-压缩参数设置建议",
        "id": "2-压缩参数设置建议"
      },
      {
        "title": "3. 批量压缩流程",
        "anchor": "#3-批量压缩流程",
        "id": "3-批量压缩流程"
      },
      {
        "title": "4. 自动化压缩脚本",
        "anchor": "#4-自动化压缩脚本",
        "id": "4-自动化压缩脚本"
      },
      {
        "title": "压缩效果对比",
        "anchor": "#压缩效果对比",
        "id": "压缩效果对比"
      },
      {
        "title": "选择建议",
        "anchor": "#选择建议",
        "id": "选择建议"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      }
    ]
  },
  {
    "id": "rustdesk-docker-6a97",
    "type": "post",
    "title": "使用 Docker Compose 快速搭建 RustDesk 自建远程桌面中继服务器（hbbs/hbbr）",
    "url": "posts/rustdesk-docker-6a97.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-07-12",
    "tags": [
      "Linux",
      "Docker",
      "RustDesk",
      "远程控制",
      "运维实战"
    ],
    "summary": "基于 Docker Compose 完整部署开源远程桌面 RustDesk 的 ID 注册服务器与中继服务，详解 21115-21119 端口映射、防火墙放行与客户端 Key 密钥联调。",
    "content": "使用 Docker Compose 快速搭建 RustDesk 自建远程桌面中继服务器 > RustDesk 是一款优秀的开源远程桌面控制软件，支持全平台互通。通过自建 hbbs （ID 注册/打洞）与 hbbr （数据中继）服务器，可以彻底摆脱官方公共服务器的带宽限制与延迟波动，实现端到端高速低延迟直连。 --- 一、核心架构与网络端口规划 RustDesk 服务端主要由两个核心组件构成： 1. hbbs RustDesk ID/Rendezvous Server ：负责客户端 ID 分配、心跳注册以及 P2P 穿透打洞； 2. hbbr RustDesk Relay Server ：当双方网络无法实现 P2P 直连时，提供全加密流量转发中继。 🌐 必须放行的防火墙端口列表 | 端口号 | 协议 | 对应服务 | 核心用途说明 | | :--- | :--- | :--- | :--- | | 21115 | TCP | hbbs | NAT 类型探测与打洞测试 | | 21116 | TCP + UDP | hbbs | 核心注册端口 （UDP 用于心跳/注册；TCP 用于打洞与连接） | | 21117 | TCP | hbbr | 核心中继端口 （提供流量转发中继服务） | | 21118 | TCP | hbbs | Web 网页端客户端支持（选开） | | 21119 | TCP | hbbr | Web 网页端中继支持（选开） | > ⚠️ 注意 ：请务必在服务器安全组（如阿里云/腾讯云/华为云）以及系统防火墙（UFW/Firewalld）中放行以上端口，尤其是 21116 必须同时放行 TCP 和 UDP ！ --- 二、服务端 Docker Compose 部署步骤 第一步：安装 Docker 环境 确保云主机已安装 Docker 与 Docker Compose 插件： - 官方参考： Docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步：创建部署目录与编排配置 在服务器中创建专门的工作目录（如 /opt/rustdesk ）： bash mkdir -p /opt/rustdesk && cd /opt/rustdesk 创建 docker-compose.yml 配置文件： yaml services: 1. hbbs: ID注册与穿透打洞服务器 hbbs: container_name: rustdesk-hbbs image: rustdesk/rustdesk-server:latest command: hbbs volumes: - ./data:/root 持久化挂载：存储生成的公私钥对与系统配置 ports: - \"21115:21115/tcp\" - \"21116:21116/tcp\" - \"21116:21116/udp\" - \"21118:21118/tcp\" depends_on: - hbbr restart: unless-stopped 2. hbbr: 流量中继服务器 hbbr: container_name: rustdesk-hbbr image: rustdesk/rustdesk-server:latest command: hbbr volumes: - ./data:/root 与 hbbs 共享相同的密钥数据卷 ports: - \"21117:21117/tcp\" - \"21119:21119/tcp\" restart: unless-stopped 第三步：拉取镜像并后台启动服务 bash docker compose up -d 启动完成后，执行 docker compose ps 查看容器状态，确保两个容器均为 Up 状态。 --- 三、获取客户端通信加密 Key 密钥 服务首次成功启动后， hbbs 会在 ./data 目录下自动生成一对非对称加密公私钥（用于防止中继服务器被他人未授权蹭用）： 执行以下命令查看你的专属公钥： bash cat ./data/id_ed25519.pub > 📋 输出的字符串即为你的 Key 密钥 （类似一串 Base64 编码文本），复制并妥善保存。 --- 四、RustDesk 客户端连接配置指南 在控制端和被控端（Windows / macOS / Linux / Android / iOS）电脑或手机上下载并打开 RustDesk 客户端： 1. 进入客户端 「设置」 -> 「网络」 -> 「ID/中继服务器」 ； 2. 填入自建服务器参数： - ID 服务器 ： 你的服务器公网IP 或 域名 （无需填端口，客户端默认 21116） - 中继服务器 ： 你的服务器公网IP 或 域名 （无需填端口，客户端默认 21117） - API 服务器 ： （留空即可） - Key 密钥 ：填写上一步从 id_ed25519.pub 中复制的内容 3. 点击 「确定」 保存。 --- 五、连接验证与就绪状态 返回 RustDesk 客户端主界面，查看底部状态栏： - 若显示 🟢 「就绪 Ready 」 ，说明已成功连接自建服务器； - 此时双方主机即可直接输入对方的 9 位数字 ID 和密码，享受自建低延迟高速远程桌面体验！",
    "sections": [
      {
        "title": "一、核心架构与网络端口规划",
        "anchor": "#一-核心架构与网络端口规划",
        "id": "一-核心架构与网络端口规划"
      },
      {
        "title": "🌐 必须放行的防火墙端口列表",
        "anchor": "#必须放行的防火墙端口列表",
        "id": "必须放行的防火墙端口列表"
      },
      {
        "title": "二、服务端 Docker Compose 部署步骤",
        "anchor": "#二-服务端-docker-compose-部署步骤",
        "id": "二-服务端-docker-compose-部署步骤"
      },
      {
        "title": "第一步：安装 Docker 环境",
        "anchor": "#第一步-安装-docker-环境",
        "id": "第一步-安装-docker-环境"
      },
      {
        "title": "第二步：创建部署目录与编排配置",
        "anchor": "#第二步-创建部署目录与编排配置",
        "id": "第二步-创建部署目录与编排配置"
      },
      {
        "title": "第三步：拉取镜像并后台启动服务",
        "anchor": "#第三步-拉取镜像并后台启动服务",
        "id": "第三步-拉取镜像并后台启动服务"
      },
      {
        "title": "三、获取客户端通信加密 Key 密钥",
        "anchor": "#三-获取客户端通信加密-key-密钥",
        "id": "三-获取客户端通信加密-key-密钥"
      },
      {
        "title": "四、RustDesk 客户端连接配置指南",
        "anchor": "#四-rustdesk-客户端连接配置指南",
        "id": "四-rustdesk-客户端连接配置指南"
      },
      {
        "title": "五、连接验证与就绪状态",
        "anchor": "#五-连接验证与就绪状态",
        "id": "五-连接验证与就绪状态"
      }
    ]
  },
  {
    "id": "ps-batch-compress-0ecc",
    "type": "post",
    "title": "Photoshop 批量图片压缩 ExtendScript (JSX) 自动化脚本（支持保留子目录结构）",
    "url": "posts/ps-batch-compress-0ecc.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-07-05",
    "tags": [
      "效率工具",
      "Photoshop",
      "JavaScript",
      "自动化",
      "图片压缩"
    ],
    "summary": "Photoshop ExtendScript (JSX) 批量图片压缩脚本最新优化版。支持 JPG/PNG/GIF/JFIF 递归批量处理与自动保留多层子目录结构，内置防覆盖机制与稳健异常处理。",
    "content": "Photoshop 批量图片压缩脚本 ExtendScript JSX 这是一个专为 Adobe Photoshop 编写的 ExtendScript JSX 自动化脚本，可以帮助你一键递归批量压缩指定文件夹内的所有图片，并完整保留原始子目录结构。 --- 一、✨ 核心功能亮点 - 多格式支持 ：全面支持批量扫描并处理 .jpg , .jpeg , .jfif , .png , .gif 格式图片。 - 智能保留目录结构 ：支持递归深度读取所有子文件夹中的图片，并在输出时 自动还原原有的子目录结构 ，杜绝文件混杂和同名文件相互覆盖。 - 自定义压缩质量 ：运行后弹出交互输入框自由设定压缩质量（1-100），灵活控制输出体积（主要对 JPG/JFIF 格式生效，PNG 与 GIF 采用自适应 Web 优化算法）。 - 源文件安全隔离 ：所有压缩成果将自动存储在源文件夹同级的独立目录（默认带有 _compressed 后缀）， 绝对不修改或覆盖任何原始素材 。 - 稳健异常防护 ：每个文件独立捕获处理异常，单张损坏图片自动跳过并记录日志，绝不中断整批任务。 --- 二、🚀 使用方法与运行步骤 1. 保存脚本文件 ：新建文本文件，将下方提供的完整源码粘贴进去，重命名保存为 BatchCompress.jsx 。 2. 在 Photoshop 中运行 ：打开 Photoshop，在顶部菜单栏依次点击： 文件 File → 脚本 Scripts → 浏览... Browse... 。 3. 加载脚本 ：在文件选择窗口中，找到并选中刚才保存的 BatchCompress.jsx 。 4. 按弹窗提示操作 ： - 选择源文件夹 ：在对话框中选取需要批量压缩的图片目录； - 输入压缩质量 ：根据需求输入 1-100 的质量数值（默认为 80 ，数值越小体积越小）； - 自动化处理 ：脚本将自动在后台进行多线程等效批处理，并在完成后弹出汇总弹窗。 --- 三、💻 完整代码 最新优化版 > 此优化版本彻底解决了旧版在部分 Photoshop 版本中由于 ExtendScript 严格模式导致的 API 兼容性报错，并重构了文件安全关闭机制与子目录镜像重建算法。 javascript / Photoshop 批量图片压缩脚本 ExtendScript JSX 支持格式：JPG、PNG、GIF、JFIF 优化版：修复兼容性问题，支持递归保留原有子文件夹结构 / // ==================== 配置参数 ==================== var CONFIG = { DEFAULT_QUALITY: 80, // 默认压缩质量 1-100 OUTPUT_SUFFIX: \"_compressed\", // 输出文件夹后缀 SUPPORTED_FORMATS: \".jpg\", \".jpeg\", \".jfif\", \".png\", \".gif\" }; // ==================== 主程序 ==================== function main { try { // 1. 选择源文件夹 var sourceFolder = Folder.selectDialog \"请选择要压缩的图片文件夹\" ; if !sourceFolder || !sourceFolder.exists { alert \"未选择有效文件夹，脚本已退出\" ; return; } // 2. 获取压缩质量 var quality = prompt \"请输入压缩质量 1-100，数值越大质量越好。注:仅对JPG生效 \", CONFIG.DEFAULT_QUALITY ; quality = parseInt quality ; if isNaN quality || quality < 1 || quality > 100 { alert \"无效的质量值，使用默认值: \" + CONFIG.DEFAULT_QUALITY ; quality = CONFIG.DEFAULT_QUALITY; } // 3. 创建输出文件夹 var outputFolder = new Folder sourceFolder.fsName + CONFIG.OUTPUT_SUFFIX ; if !outputFolder.exists { outputFolder.create ; } // 4. 获取所有图片文件 var files = getImageFiles sourceFolder ; if files.length === 0 { alert \"未找到支持的图片文件\" ; return; } // 5. 批量处理 var successCount = 0; var failCount = 0; for var i = 0; i < files.length; i++ { var file = files i ; try { // 显示进度 var progress = Math.round i + 1 / files.length 100 ; $.writeln \"处理中: \" + progress + \"% - \" + file.name ; // 压缩并保存 compressImage file, sourceFolder, outputFolder, quality ; successCount++; } catch e { $.writeln \"处理失败: \" + file.name + \" - \" + e.message ; failCount++; } } // 6. 显示结果 var resultMsg = \"批量压缩完成！\\n\\n\" + \"成功: \" + successCount + \" 张\\n\" + \"失败: \" + failCount + \" 张\\n\" + \"输出目录: \" + outputFolder.fsName; alert resultMsg ; $.writeln resultMsg ; } catch error { alert \"脚本执行出错: \" + error.message ; $.writeln \"错误: \" + error.message ; } } // ==================== 工具函数 ==================== / 判断扩展名是否在支持列表中 / function isExtensionSupported ext { for var i = 0; i < CONFIG.SUPPORTED_FORMATS.length; i++ { if CONFIG.SUPPORTED_FORMATS i === ext { return true; } } return false; } / 获取文件夹中所有支持的图片文件（递归） @param {Folder} folder - 文件夹对象 @returns {File } - 图片文件数组 / function getImageFiles folder { var files = ; var allFiles = folder.getFiles ; for var i = 0; i < allFiles.length; i++ { var item = allFiles i ; if item instanceof Folder { // 递归处理子文件夹 files = files.concat getImageFiles item ; } else if item instanceof File { // 检查是否为支持的格式 var nameStr = item.name.toLowerCase ; var extIndex = nameStr.lastIndexOf \".\" ; if extIndex !== -1 { var ext = nameStr.substring extIndex ; if isExtensionSupported ext { files.push item ; } } } } return files; } / 压缩单张图片并保留子目录结构 @param {File} inputFile - 输入文件 @param {Folder} sourceFolder - 原始根文件夹 用于计算相对路径 @param {Folder} outputFolder - 输出根文件夹 @param {number} quality - 压缩质量 1-100 / function compressImage inputFile, sourceFolder, outputFolder, quality { // 1. 打开图片 var doc = app.open inputFile ; if !doc { throw new Error \"无法打开文件\" ; } try { // 2. 构建输出路径，保留原有的子目录结构 var relativePath = inputFile.path.replace sourceFolder.fsName, \"\" ; var targetFolderPath = outputFolder.fsName + relativePath; var targetFolder = new Folder targetFolderPath ; // 如果子目录不存在，则创建 if !targetFolder.exists { targetFolder.create ; } var outputPath = targetFolderPath + \"/\" + inputFile.name; // 3. 根据格式设置导出选项 var exportOptions = getExportOptions inputFile, quality ; // 4. 导出图片 doc.exportDocument new File outputPath , ExportType.SAVEFORWEB, exportOptions ; } finally { // 5. 确保安全关闭当前文档（避免内存泄漏） if doc { doc.close SaveOptions.DONOTSAVECHANGES ; } } } / 获取 SaveForWeb 导出选项 @param {File} file - 文件对象 @param {number} quality - 压缩质量 @returns {ExportOptionsSaveForWeb} / function getExportOptions file, quality { var ext = file.name.toLowerCase ; var options = new ExportOptionsSaveForWeb ; if ext.match /\\.jpg$/ || ext.match /\\.jpeg$/ || ext.match /\\.jfif$/ { // JPG 格式 options.format = SaveDocumentType.JPEG; options.quality = quality; options.optimized = true; options.progressive = false; } else if ext.match /\\.png$/ { // PNG 格式 options.format = SaveDocumentType.PNG; options.PNG8 = false; // 使用 24位真彩色 PNG options.transparency = true; options.interlaced = false; } else if ext.match /\\.gif$/ { // GIF 格式 options.format = SaveDocumentType.COMPUSERVEGIF; options.transparency = true; options.includeProfile = false; options.lossy = 0; options.colors = 256; options.colorReduction = ColorReductionType.SELECTIVE; options.ditherAmount = 0; options.dither = Dither.NOISE; options.palette = Palette.LOCALADAPTIVE; } return options; } // ==================== 启动脚本 ==================== main ; --- 四、⚙️ 核心参数与质量选型参考 1. 配置参数说明 | 参数项 | 说明 | 默认值 | 作用范围 | | :--- | :--- | :--- | :--- | | DEFAULT_QUALITY | 默认压缩质量数值 | 80 | 作用于 JPEG/JFIF 导出质量 | | OUTPUT_SUFFIX | 输出目录后缀标识 | _compressed | 在源目录同级自动新建 | | SUPPORTED_FORMATS | 支持处理的文件扩展名列表 | JPG, PNG, GIF, JFIF | 自动过滤无关格式文件 | 2. 压缩质量参考推荐 | 质量区间 | 视觉效果 | 推荐场景 | 体积降幅预估 | | :--- | :--- | :--- | :--- | | 90 ~ 100 | 几乎无损，肉眼无法分辨差异 | 印刷前预览、高保真设计交付 | 体积缩减约 20% ~ 40% | | 75 ~ 85 | 画质极高，边缘清晰度完美 | 网页展示、电商详情页、技术博客（推荐） | 体积缩减约 60% ~ 75% | | 50 ~ 70 | 略有噪点，微距可见压缩伪影 | 移动端预览缩略图、长列表瀑布流 | 体积缩减约 75% ~ 85% | | 1 ~ 49 | 压缩感明显 | 极限低带宽占位骨架图 | 体积缩减约 85% 以上 | --- 五、📁 镜像输出目录树结构示例 脚本执行后将自动递归镜像原有目录树，如下所示： text 源图片文件夹/ ├── header-banner.jpg ├── logo.png ├── icons/ │ ├── icon-home.png │ └── icon-user.png └── product/ ├── item1.jpg └── item2.jpg 源图片文件夹_compressed/ ← 自动创建的输出目录 ├── header-banner.jpg ├── logo.png ├── icons/ ← 自动还原的子目录 │ ├── icon-home.png │ └── icon-user.png └── product/ ← 自动还原的子目录 ├── item1.jpg └── item2.jpg --- 六、🛡️ 常见问题与排错指南 | 现象 | 可能原因 | 对应解决办法 | | :--- | :--- | :--- | | 菜单中找不到脚本选项 | 脚本文件未命名为 .jsx 格式 | 确保文件扩展名为标准的 .jsx 而非 .txt | | 提示\"无权限创建目录\" | 输出路径所在分区有写入权限限制 | 以管理员身份运行 Photoshop 或更换工作目录 | | 大批量处理时内存上涨 | 打开过多超大尺寸图片 | 脚本内置 doc.close 自动回收，极超大图建议分批执行 |",
    "sections": [
      {
        "title": "一、✨ 核心功能亮点",
        "anchor": "#一-核心功能亮点",
        "id": "一-核心功能亮点"
      },
      {
        "title": "二、🚀 使用方法与运行步骤",
        "anchor": "#二-使用方法与运行步骤",
        "id": "二-使用方法与运行步骤"
      },
      {
        "title": "三、💻 完整代码 (最新优化版)",
        "anchor": "#三-完整代码-最新优化版",
        "id": "三-完整代码-最新优化版"
      },
      {
        "title": "四、⚙️ 核心参数与质量选型参考",
        "anchor": "#四-核心参数与质量选型参考",
        "id": "四-核心参数与质量选型参考"
      },
      {
        "title": "1. 配置参数说明",
        "anchor": "#1-配置参数说明",
        "id": "1-配置参数说明"
      },
      {
        "title": "2. 压缩质量参考推荐",
        "anchor": "#2-压缩质量参考推荐",
        "id": "2-压缩质量参考推荐"
      },
      {
        "title": "五、📁 镜像输出目录树结构示例",
        "anchor": "#五-镜像输出目录树结构示例",
        "id": "五-镜像输出目录树结构示例"
      },
      {
        "title": "六、🛡️ 常见问题与排错指南",
        "anchor": "#六-常见问题与排错指南",
        "id": "六-常见问题与排错指南"
      }
    ]
  },
  {
    "id": "kodbox-docker-d549",
    "type": "post",
    "title": "Kodbox 可道云私有网盘部署实战指南（Docker 与源码双方案）",
    "url": "posts/kodbox-docker-d549.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-07-02",
    "tags": [
      "Linux",
      "Docker",
      "网盘存储",
      "Kodbox",
      "运维实战"
    ],
    "summary": "全面整理 Kodbox 可道云私有云存储部署方案：包含 Docker Compose 极简持久化搭建与常规 LNMP 裸机源码快速安装。",
    "content": "Kodbox 可道云私有网盘部署实战指南（Docker 与源码双方案） > Kodbox（可道云） 是一款界面类似 Windows 桌面交互、体验极佳的私有云存储与在线协作文档管理系统。本文整理两种最常用的实战部署方案，供不同环境灵活选择。 --- 方案对比与选型建议 | 部署方案 | 适用场景 | 核心依赖 | 维护成本 | | :--- | :--- | :--- | :--- | | 方案一：Docker Compose（推荐） | 追求快速上线、环境隔离、数据迁移方便 | Docker & Docker Compose | ⭐ 极低（一键拉起，数据集中挂载） | | 方案二：裸机源码安装 | 已有宝塔面板或 LNMP / LAMP 传统主机环境 | Nginx/Apache + PHP 7.4+ + SQLite/MySQL | ⭐⭐ 中等（需自行配置 Web 服务器与目录权限） | --- 方案一：Docker Compose 一键部署（推荐 · SQLite版） 本方案使用 Kodbox 官方镜像，内置 SQLite 轻量数据库，无需额外拉起 MySQL 容器，极省内存与 CPU 资源。 第一步：环境准备 确保服务器已安装 Docker 与 Docker Compose： - 官方指引： Docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步：编写配置文件 在目标目录（如 /opt/kodbox ）下创建 docker-compose.yml 文件： yaml services: app: image: kodcloud/kodbox:latest container_name: kodbox-app ports: - 443:80 左侧 443 为宿主机访问端口，可按需改为 8080 或 80 volumes: 持久化挂载：Kodbox 的所有系统配置、SQLite数据库 ./site/data/kodbox.sqlite 与用户网盘文件均保存在此 - \"./site:/var/www/html\" restart: always > 💡 提示 ：若宿主机 443 端口已被占用，可将端口映射修改为 8080:80 或 8888:80 ，后续通过 http://服务器IP:8080 访问。 第三步：拉取镜像并后台启动 在 docker-compose.yml 同级目录下执行： bash docker compose up -d 第四步：初始化配置 浏览器访问 http://服务器IP:映射端口 ，按向导设定超级管理员账号与密码即可完成初始化。 --- 方案二：常规非 Docker 源码部署（LNMP 环境） 适合在传统物理机、云服务器或已有 Web 环境（如宝塔、Nginx、Apache）中直接搭建。 第一步：下载可道云官方源码 进入你的 Web 站点根目录（如 /www/wwwroot/kodbox ），执行下载： bash wget https://github.com/kalcaddle/kodbox/archive/refs/heads/main.zip 第二步：解压源码包 bash unzip main.zip 第三步：配置目录读写权限 Kodbox 运行需要对根目录及子目录拥有写权限，执行递归赋权： bash chmod -Rf 777 ./ 第四步：访问向导完成安装 1. 在浏览器中打开绑定的域名或 IP； 2. 按照可道云网页安装向导进行环境自检（确保 PHP 扩展如 curl 、 mbstring 、 gd 、 sqlite3/mysqli 就绪）； 3. 选择数据库类型（小型个人使用建议直接勾选 SQLite ，免去配置 MySQL 用户名密码）； 4. 设置管理员账号与密码，点击「确定」立即进入私有云桌面。 --- 常见问题排查与运维贴士 1. 端口冲突问题 ：若启动失败，使用 netstat -tlpn | grep 443 检查端口是否被 Nginx 或 Apache 占用。 2. 数据备份方案 ： - Docker 版 ：只需定时备份宿主机的 ./site 文件夹，即可全量备份所有网盘文件与数据库。 - 源码版 ：备份站点目录及数据库即可。",
    "sections": [
      {
        "title": "方案对比与选型建议",
        "anchor": "#方案对比与选型建议",
        "id": "方案对比与选型建议"
      },
      {
        "title": "方案一：Docker Compose 一键部署（推荐 · SQLite版）",
        "anchor": "#方案一-docker-compose-一键部署-推荐-sqlite版",
        "id": "方案一-docker-compose-一键部署-推荐-sqlite版"
      },
      {
        "title": "第一步：环境准备",
        "anchor": "#第一步-环境准备",
        "id": "第一步-环境准备"
      },
      {
        "title": "第二步：编写配置文件",
        "anchor": "#第二步-编写配置文件",
        "id": "第二步-编写配置文件"
      },
      {
        "title": "第三步：拉取镜像并后台启动",
        "anchor": "#第三步-拉取镜像并后台启动",
        "id": "第三步-拉取镜像并后台启动"
      },
      {
        "title": "第四步：初始化配置",
        "anchor": "#第四步-初始化配置",
        "id": "第四步-初始化配置"
      },
      {
        "title": "方案二：常规非 Docker 源码部署（LNMP 环境）",
        "anchor": "#方案二-常规非-docker-源码部署-lnmp-环境",
        "id": "方案二-常规非-docker-源码部署-lnmp-环境"
      },
      {
        "title": "第一步：下载可道云官方源码",
        "anchor": "#第一步-下载可道云官方源码",
        "id": "第一步-下载可道云官方源码"
      },
      {
        "title": "第二步：解压源码包",
        "anchor": "#第二步-解压源码包",
        "id": "第二步-解压源码包"
      },
      {
        "title": "第三步：配置目录读写权限",
        "anchor": "#第三步-配置目录读写权限",
        "id": "第三步-配置目录读写权限"
      },
      {
        "title": "第四步：访问向导完成安装",
        "anchor": "#第四步-访问向导完成安装",
        "id": "第四步-访问向导完成安装"
      },
      {
        "title": "常见问题排查与运维贴士",
        "anchor": "#常见问题排查与运维贴士",
        "id": "常见问题排查与运维贴士"
      }
    ]
  },
  {
    "id": "bat-rename-b2ae",
    "type": "post",
    "title": "Windows 批量修改文件名与文件夹名自动化批处理 (BAT) 脚本实战（优化版）",
    "url": "posts/bat-rename-b2ae.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2026-06-28",
    "tags": [
      "效率工具",
      "Windows",
      "批处理",
      "自动化",
      "文件管理"
    ],
    "summary": "深度优化版 Windows BAT 批处理脚本，支持递归批量替换文件与文件夹名（含空格）。内置重名跳过保护、动态延迟扩展防破坏特殊字符，利用 sort /r 倒序遍历彻底解决子目录重命名死循环。",
    "content": "批量修改文件名与文件夹名工具 BAT 脚本优化版 这是一个简单轻量且性能强悍的 Windows 批处理 BAT 自动化脚本，用于一键批量替换当前文件夹及其所有子文件夹下的文件和文件夹名称。 --- 一、✨ 核心功能亮点 - 批量深度替换 ：一键递归替换当前目录及所有子目录下文件和文件夹名称中的指定字符串（支持替换空格）。 - 安全防误触机制 ：如果替换后的文件名已经存在，或者文件处于被占用、只读或无权限状态，脚本会自动跳过并打印原因，防止误操作或数据损坏。 - 极速底层过滤 ：利用 dir /s /b \" %str1% \" 原生命令在内核层直接过滤匹配文件，面对上万个文件的庞大工程也能瞬间完成处理，彻底告别逐个比对的卡顿。 - 特殊字符防破坏 ：在循环体内部精细动态开关延迟变量扩展（ setlocal enabledelayedexpansion ），完美兼容包含感叹号（ ! ）和点号（ . ）等特殊字符的原始文件及文件夹名。 - 子目录倒序防死锁 ：重命名文件夹时采用 sort /r 倒序遍历算法，优先从最深层子目录自底向上重命名，彻底解决旧版由于父目录改名导致子路径失效的死锁与无限循环 Bug。 --- 二、🚀 使用方法与运行步骤 1. 获取脚本 ： - 方式一：点击下方下载链接直接获取预置的 RenameTool.bat 文件； - 方式二：新建文本文件，将下方提供的完整代码复制进去，另存为 RenameTool.bat 。 2. 放置与运行 ：将 RenameTool.bat 放置到你需要批量重命名的 最外层主文件夹 根目录下，双击运行。 3. 按交互提示操作 ： - 输入 需要被替换的旧字符 （支持空格），按回车确认； - 输入 想要替换成的新字符 （若想直接删除特定字符，不输入任何内容直接按回车即可）； - 观察终端实时处理日志，等待脚本统计成功与跳过数量即可完成！ --- 三、💻 完整代码 最新优化版 bat @echo off chcp 65001 >nul title 批量修改文件名工具 echo ======================================== echo 批量修改文件名工具 性能优化版 echo ======================================== echo. echo 注意事项： echo 1. 建议先备份重要文件 echo 2. 脚本会递归处理子目录 echo 3. 文件名冲突时会跳过 echo. set /p str1= 请输入要替换的字符串（可替换空格）： if \"%str1%\"==\"\" echo 错误：替换字符串不能为空！ pause exit /b set /p str2= 请输入替换后的字符串（去除则直接回车）： echo. echo 正在替换文件名…… set file_count=0 set skip_count=0 :: 性能优化：直接让 dir 过滤包含 str1 的文件 for /f \"delims=\" %%a in 'dir /a-d /s /b \" %str1% \" 2^>nul' do if \"%%~nxa\" neq \"%~nx0\" :: 解决含有 ! 的文件名被破坏的问题，在循环内动态开关延迟扩展 set \"full_path=%%~dpa\" set \"old_name=%%~na\" set \"ext=%%~xa\" setlocal enabledelayedexpansion set \"new_name=!old_name:%str1%=%str2%!\" if not exist \"!full_path!!new_name!!ext!\" ren \"%%a\" \"!new_name!!ext!\" 2>nul if !errorlevel! equ 0 echo 已重命名: \"!old_name!!ext!\" -^> \"!new_name!!ext!\" :: 跨 endlocal 传递变量需特殊技巧，这里直接退回外层环境累加 endlocal set /a file_count+=1 else echo 跳过: \"!old_name!!ext!\" 权限不足 endlocal set /a skip_count+=1 else echo 跳过: \"!old_name!!ext!\" 文件名已存在 endlocal set /a skip_count+=1 echo 文件名替换完成！共处理 %file_count% 个文件，跳过 %skip_count% 个文件 echo. echo 正在替换文件夹名…… set folder_count=0 set folder_skip=0 :: 性能与逻辑优化：利用 sort /r 倒序排列，优先处理最深层的子文件夹，彻底告别死循环 for /f \"delims=\" %%i in 'dir /ad /s /b \" %str1% \" 2^>nul ^| sort /r' do set \"full_path=%%~dpi\" set \"old_folder=%%~nxi\" setlocal enabledelayedexpansion set \"new_folder=!old_folder:%str1%=%str2%!\" if not exist \"!full_path!!new_folder!\" ren \"%%i\" \"!new_folder!\" 2>nul if !errorlevel! equ 0 echo 已重命名文件夹: \"!old_folder!\" -^> \"!new_folder!\" endlocal set /a folder_count+=1 else echo 跳过文件夹: \"!old_folder!\" 权限不足 endlocal set /a folder_skip+=1 else echo 跳过文件夹: \"!old_folder!\" 文件夹名已存在 endlocal set /a folder_skip+=1 echo 文件夹名替换完成！共处理 %folder_count% 个文件夹，跳过 %folder_skip% 个文件夹 echo. echo ======================================== echo 处理完成！ echo 文件: %file_count% 个成功，%skip_count% 个跳过 echo 文件夹: %folder_count% 个成功，%folder_skip% 个跳过 echo ======================================== echo. pause --- 四、🔍 核心技术原理解析 1. 为什么要在循环内动态开关延迟扩展？ 在标准 CMD 环境中，如果全局开启 setlocal enabledelayedexpansion ，当遍历到的原始文件名中含有感叹号（如 Notice!.txt ）时，CMD 解释器会将 ! 当作变量定界符吞噬，导致文件名被意外篡改损坏。 解决方案 ：在外层使用普通变量接收 %%~na ，仅在需要进行变量字符串替换（ !old_name:%str1%=%str2%! ）的瞬间开启延迟扩展，替换完成后立即 endlocal 还原环境。 2. 为什么重命名文件夹必须加 sort /r 倒序？ 如果在自顶向下遍历时重命名了父目录（例如将 A/B/C 中的 A 改名为 A_new ），原本已经读取到的子路径 A/B/C 在磁盘上就会瞬间失效变为死路径，后续处理子目录必定报错或陷入死循环。 解决方案 ：管道配合 sort /r ，让路径深度最深的叶子文件夹（如 A/B/C ）优先被处理，最后处理顶层根目录 A ，从而实现 100% 稳健的目录树迁移。 --- 五、📥 脚本下载与免跳转预览 - 💾 脚本源文件下载 ： RenameTool.bat ../assets/files/RenameTool.bat - 📁 在线高亮与管理中心 ： 前往资源文件库 files.html ../files.html 查看全部 Shell / BAT 脚本附件。 --- 六、🛡️ 注意事项与数据安全建议 1. 首次使用建议备份 ：批量重命名属于磁盘物理写入操作，建议先对少量文件进行测试确认，或提前备份重要资料； 2. 排除自身保护 ：脚本内建 if \"%%~nxa\" neq \"%~nx0\" 安全防护，执行时绝不会误伤自身 RenameTool.bat 文件； 3. 编码规范 ：脚本开头已指定 chcp 65001 （UTF-8 编码），若在极少数精简版 Windows 系统终端出现中文乱码，可将文件另存为 ANSI GBK 编码格式。",
    "sections": [
      {
        "title": "一、✨ 核心功能亮点",
        "anchor": "#一-核心功能亮点",
        "id": "一-核心功能亮点"
      },
      {
        "title": "二、🚀 使用方法与运行步骤",
        "anchor": "#二-使用方法与运行步骤",
        "id": "二-使用方法与运行步骤"
      },
      {
        "title": "三、💻 完整代码 (最新优化版)",
        "anchor": "#三-完整代码-最新优化版",
        "id": "三-完整代码-最新优化版"
      },
      {
        "title": "四、🔍 核心技术原理解析",
        "anchor": "#四-核心技术原理解析",
        "id": "四-核心技术原理解析"
      },
      {
        "title": "1. 为什么要在循环内动态开关延迟扩展？",
        "anchor": "#1-为什么要在循环内动态开关延迟扩展",
        "id": "1-为什么要在循环内动态开关延迟扩展"
      },
      {
        "title": "2. 为什么重命名文件夹必须加 `sort /r` 倒序？",
        "anchor": "#2-为什么重命名文件夹必须加-sort-r-倒序",
        "id": "2-为什么重命名文件夹必须加-sort-r-倒序"
      },
      {
        "title": "五、📥 脚本下载与免跳转预览",
        "anchor": "#五-脚本下载与免跳转预览",
        "id": "五-脚本下载与免跳转预览"
      },
      {
        "title": "六、🛡️ 注意事项与数据安全建议",
        "anchor": "#六-注意事项与数据安全建议",
        "id": "六-注意事项与数据安全建议"
      }
    ]
  },
  {
    "id": "nginx-emby-proxy-b140",
    "type": "post",
    "title": "Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版）",
    "url": "posts/nginx-emby-proxy-b140.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2026-06-25",
    "tags": [
      "Linux",
      "Nginx",
      "Emby",
      "流媒体",
      "Cloudflare",
      "反向代理"
    ],
    "summary": "专为 Cloudflare CDN + 全站反向代理架构设计，支持 Emby 流媒体大文件分片、WebSocket 实时长连接与 SNI 强校验。",
    "content": "Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版） 📌 一、配置概述 本配置专为 Cloudflare CDN + 全站反向代理 架构设计，通过引入动态域名变量、SNI 强校验、HTTPS 协议识别以及重定向安全锁，实现了对目标源站（如 Emby 等流媒体服务）的高效、稳定全站映射。同时针对大文件传输和长连接做了深度优化。 --- 📄 二、完整配置代码 你可以直接点击代码块右上角复制最终优化后的完整配置： nginx 动态解析与 DNS 超时控制 resolver 8.8.8.8 1.1.1.1 valid=300s; resolver_timeout 5s; location / { 1. 转发目标域名变量（全站代理的目标源站，如需更换在此修改） set $target_domain \"www.target.com\"; proxy_pass https://$target_domain; proxy_set_header Host $target_domain; proxy_ssl_server_name on; proxy_ssl_name $target_domain; 2. 协议识别（防止后端误判为 HTTP） proxy_set_header X-Forwarded-Proto $scheme; 3. 全站代理安全锁（自动修正源站的绝对路径与重定向，防止用户跳去源站） proxy_redirect https://$target_domain/ /; 4. WebSocket 支持（保障全站的实时双向通信） proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $http_connection; 5. 大文件传输与长连接优化（防断开、支持高清视频流畅拖动进度条） proxy_buffering off; proxy_cache off; chunked_transfer_encoding on; proxy_connect_timeout 300; proxy_send_timeout 86400; proxy_read_timeout 86400; proxy_set_header Range $http_range; proxy_set_header If-Range $http_if_range; proxy_request_buffering off; } --- 🔍 三、核心优化指令详解 | 配置指令 / 机制 | 作用说明 | 解决的痛点问题 | | :--- | :--- | :--- | | resolver ... valid=300s; | 指定上游 DNS 解析器与缓存周期 | 解决动态源站 IP 变动后 Nginx 无法解析导致 502 的问题 | | proxy_ssl_server_name on; | 开启上游 HTTPS SNI 扩展支持 | 解决反代 Cloudflare 等 CDN 源站时由于缺少 SNI 握手失败报错 | | proxy_redirect https://$target_domain/ /; | 自动改写源站 301/302 重定向头部 | 防止客户端登录或跳转时被重定向暴露原源站域名 | | proxy_set_header Upgrade ... | 开启 HTTP/1.1 WebSocket 双向升级 | 确保 Emby 播放进度同步、即时控制与长轮询不掉线 | | proxy_buffering off; | 关闭响应缓冲区，采用流式直接传输 | 解决视频拖动进度条卡顿、初始加载缓冲时间过长问题 | | proxy_read_timeout 86400; | 延长上游连接读取超时至 24 小时 | 防止播放超长 4K 电影或挂起播放器时被 Nginx 提前切断连接 | --- 🛠️ 四、部署与生效检查 bash 1. 检查 Nginx 配置文件语法是否正确 nginx -t 2. 平滑重载 Nginx 进程 nginx -s reload",
    "sections": [
      {
        "title": "📌 一、配置概述",
        "anchor": "#一-配置概述",
        "id": "一-配置概述"
      },
      {
        "title": "📄 二、完整配置代码",
        "anchor": "#二-完整配置代码",
        "id": "二-完整配置代码"
      },
      {
        "title": "🔍 三、核心优化指令详解",
        "anchor": "#三-核心优化指令详解",
        "id": "三-核心优化指令详解"
      },
      {
        "title": "🛠️ 四、部署与生效检查",
        "anchor": "#四-部署与生效检查",
        "id": "四-部署与生效检查"
      }
    ]
  },
  {
    "id": "ffmpeg-stream-5244",
    "type": "post",
    "title": "FFmpeg 常用音视频推流、转码与循环直播命令速查指南",
    "url": "posts/ffmpeg-stream-5244.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-06-18",
    "tags": [
      "Linux",
      "FFmpeg",
      "音视频",
      "流媒体",
      "推流"
    ],
    "summary": "整理基于 FFmpeg 的 RTMP/FLV 本地视频循环推流命令、硬件加速转码、多码率推流与后台无人值守推流脚本。",
    "content": "FFmpeg 常用音视频推流、转码与循环直播命令速查指南 > FFmpeg 是音视频处理领域的事实标准工具。通过 FFmpeg 可以实现将本地 MP4/MKV 视频文件、网络 RTSP 摄像头流或麦克风音频，实时编码封装推送到 RTMP/FLV 直播流媒体服务器（如 YouTube、Bilibili、斗鱼、Nginx-RTMP 等）。 --- 一、基础 RTMP 视频推流核心命令 将本地视频文件原画质推送到 RTMP 节点： bash ffmpeg -re -i \"input.mp4\" -c:v copy -c:a aac -b:a 192k -strict -2 -f flv \"rtmp://a.rtmp.youtube.com/live2/你的直播码\" ⚙️ 关键参数解析 | 参数 | 含义说明 | 推荐取值 | | :--- | :--- | :--- | | -re | 实时帧率读取 （Read at native frame rate）。必须加在 -i 之前，模拟实时采集速度，防止过快发送导致缓冲区溢出。 | 必须开启 | | -i \"input.mp4\" | 指定输入媒体源文件路径或网络 RTSP URL。 | 文件绝对/相对路径 | | -c:v copy | 视频流直接复制，不重新编码，极省 CPU。 | 若编码兼容推荐 copy | | -c:a aac | 将音频流转换为 RTMP 标准 AAC 编码。 | aac | | -b:a 192k | 设定音频码率为 192 kbps，保障音质。 | 128k ~ 320k | | -f flv | 封装格式设定为 FLV（RTMP 协议标准封装格式）。 | flv | --- 二、进阶实战：7x24小时无人值守循环推流 将文件夹内的视频无限循环直播推流（可配合 screen 或 nohup 后台常驻）： bash nohup ffmpeg -re -stream_loop -1 -i \"video.mp4\" -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3500k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 128k -ar 44100 -f flv \"rtmp://live-push.example.com/live/streamkey\" > /var/log/ffmpeg_live.log 2>&1 & > 💡 参数补充 ： > - -stream_loop -1 ：开启无限循环播放输入源； > - -preset veryfast ：H.264 快速编码预设，大幅降低 CPU 负载； > - -g 50 ：设置关键帧间隔（GOP），通常设为帧率的 2 倍（2秒一个关键帧），提升观众秒开率。 --- 三、常用进阶推流场景速查 1. 重新编码并压制为标准 1080P / 30fps bash ffmpeg -re -i \"input.mkv\" -c:v libx264 -s 1920x1080 -r 30 -c:a aac -f flv \"rtmp://your-rtmp-server/live/stream\" 2. 静态图片 + 背景音乐推流为音乐电台直播 bash ffmpeg -re -loop 1 -i \"cover.jpg\" -i \"audio.mp3\" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -f flv \"rtmp://your-rtmp-server/live/stream\" --- 四、后台运行与进程管理 - 查看当前推流进程 ： ps -ef | grep ffmpeg - 实时查看推流日志 ： tail -f /var/log/ffmpeg_live.log - 停止推流 ： pkill -f ffmpeg 或 kill -9 <PID>",
    "sections": [
      {
        "title": "一、基础 RTMP 视频推流核心命令",
        "anchor": "#一-基础-rtmp-视频推流核心命令",
        "id": "一-基础-rtmp-视频推流核心命令"
      },
      {
        "title": "⚙️ 关键参数解析",
        "anchor": "#关键参数解析",
        "id": "关键参数解析"
      },
      {
        "title": "二、进阶实战：7x24小时无人值守循环推流",
        "anchor": "#二-进阶实战-7x24小时无人值守循环推流",
        "id": "二-进阶实战-7x24小时无人值守循环推流"
      },
      {
        "title": "三、常用进阶推流场景速查",
        "anchor": "#三-常用进阶推流场景速查",
        "id": "三-常用进阶推流场景速查"
      },
      {
        "title": "1. 重新编码并压制为标准 1080P / 30fps",
        "anchor": "#1-重新编码并压制为标准-1080p-30fps",
        "id": "1-重新编码并压制为标准-1080p-30fps"
      },
      {
        "title": "2. 静态图片 + 背景音乐推流为音乐电台直播",
        "anchor": "#2-静态图片-背景音乐推流为音乐电台直播",
        "id": "2-静态图片-背景音乐推流为音乐电台直播"
      },
      {
        "title": "四、后台运行与进程管理",
        "anchor": "#四-后台运行与进程管理",
        "id": "四-后台运行与进程管理"
      }
    ]
  },
  {
    "id": "vue3-file-upload-5890",
    "type": "post",
    "title": "Vue3 + Element Plus 文件上传组件封装：支持回显、批量与手动控制",
    "url": "posts/vue3-file-upload-5890.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-06-15",
    "tags": [
      "前端开发",
      "Vue",
      "Element Plus",
      "组件封装"
    ],
    "summary": "在实际业务中深入封装 el-upload，实现文件列表回显、多文件批量上传、类型大小校验与手动提交控制。",
    "content": "🚀 Element Plus 进阶文件上传组件：实现文件回显、批量和手动控制 在实际业务开发中，我们经常需要一个组件来处理文件上传、展示已上传文件（回显/编辑模式）以及手动触发上传。Element Plus 的 el-upload 默认功能往往不够灵活。 本文将详细解析并教你如何使用一个功能增强的自定义文件上传组件。 --- 一、组件源代码 FileUploader.vue FileUploader.vue 代码地址 ../assets/files/FileUpload.vue 父组件调用示范 Vue 3 Composition API 在父组件中使用此组件，实现编辑和新增模式的切换。 javascript <template> <el-card header=\"文件上传示例\"> <el-form :model=\"formData\" label-width=\"120px\"> <el-form-item label=\"附件列表\"> <FileUploader ref=\"uploaderRef\" v-model:attachment-ids=\"formData.attachmentIds\" :initial-files=\"formData.initialFiles\" :limit=\"3\" :max-size_m-b=\"50\" upload-url-path=\"/your/custom/upload/path\" @change=\"handleFileChange\" /> </el-form-item> <el-form-item label=\"操作\"> <el-button type=\"primary\" @click=\"handleSubmit\"> 提交表单 </el-button> <el-button @click=\"handleReset\"> 重置上传 </el-button> <el-button @click=\"toggleEditMode\"> 模拟切换新增模式 </el-button> </el-form-item> </el-form> <el-divider /> <p> 当前附件 ID 列表 用于提交 : <el-tag v-for=\"id in formData.attachmentIds\" :key=\"id\" style=\"margin-right: 5px;\">{{ id }}</el-tag> <span v-if=\"formData.attachmentIds.length === 0\">无</span> </p> </el-card> </template> <script setup> import { reactive, ref } from \"vue\"; import { ElMessage, ElCard, ElForm, ElFormItem, ElButton, ElDivider, ElTag } from \"element-plus\"; import FileUploader from \"./FileUploader.vue\"; // 确保导入路径正确 const uploaderRef = ref null ; // 模拟后端返回的初始文件数据（用于编辑模式回显） const mockInitialFiles = { id: \"f001\", fileName: \"项目需求文档.docx\" }, { id: \"f002\", fileName: \"设计图.pdf\" }, ; const formData = reactive { // 绑定：初始值应包含回显文件的 ID attachmentIds: \"f001\", \"f002\" , // 传入：回显文件列表 initialFiles: mockInitialFiles, title: \"表单标题\", } ; const handleFileChange = fileList => { console.log \"文件列表更新了，当前文件总数:\", fileList.length ; }; const handleSubmit = => { const finalIds = formData.attachmentIds; if finalIds.length === 0 { ElMessage.warning \"请选择并上传文件后再提交！\" ; return; } const payload = { title: formData.title, attachments: finalIds }; console.log \"最终提交的数据:\", payload ; ElMessage.success 表单提交成功，附件ID: ${finalIds.join \", \" } ; }; const handleReset = => { // 1. 调用组件暴露的方法清空内部状态 uploaderRef.value.clearFiles ; // 2. 清空回显数据，确保下次打开是全新状态 formData.initialFiles = ; ElMessage.info \"文件列表已重置。\" ; }; const toggleEditMode = => { // 通过清空 initialFiles，组件内部的 watch 会清空回显文件 formData.initialFiles = ; ElMessage.info \"已清空初始文件列表，现在是新增模式。\" ; }; </script>",
    "sections": [
      {
        "title": "一、组件源代码 (`FileUploader.vue`)",
        "anchor": "#一-组件源代码-fileuploader-vue",
        "id": "一-组件源代码-fileuploader-vue"
      },
      {
        "title": "父组件调用示范 (Vue 3 Composition API)",
        "anchor": "#父组件调用示范-vue-3-composition-api",
        "id": "父组件调用示范-vue-3-composition-api"
      }
    ]
  },
  {
    "id": "acme-ssl-issue-1dd8",
    "type": "post",
    "title": "Linux 使用 acme.sh 自动化申请 Let's Encrypt 免费 SSL 证书与续期脚本",
    "url": "posts/acme-ssl-issue-1dd8.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-06-10",
    "tags": [
      "Linux",
      "SSL",
      "HTTPS",
      "网络安全"
    ],
    "summary": "基于 acme.sh 脚本一键签发通配符泛域名 SSL 证书，配置 Nginx 自动加载与 crontab 定期续签。",
    "content": "ssl 一键生成证书脚本： 第一步：安装脚本 sh wget -O - https://get.acme.sh | sh -s email=vx91586x@qq.com 第二步：生成证书80端口验证方式（保证80未被占用） sh ~/.acme.sh/acme.sh --issue -d www.baidu.com --standalone 第三步：将证书移动，指定的文件中（nginx中） sh ~/.acme.sh/acme.sh --installcert -d www.baidu.com --key-file /root/ssl/private.key --fullchain-file /root/ssl/cert.crt 第二种生成方式：（http验证）后面的目录要是网站的根目录，同样需要把移动到指定的文件夹目录 sh ~/.acme.sh/acme.sh --issue -d mydomain.com -d www.mydomain.com --webroot /home/wwwroot/mydomain.com/",
    "sections": [
      {
        "title": "ssl 一键生成证书脚本：",
        "anchor": "#ssl-一键生成证书脚本",
        "id": "ssl-一键生成证书脚本"
      },
      {
        "title": "第一步：安装脚本",
        "anchor": "#第一步-安装脚本",
        "id": "第一步-安装脚本"
      },
      {
        "title": "第二步：生成证书80端口验证方式（保证80未被占用）",
        "anchor": "#第二步-生成证书80端口验证方式-保证80未被占用",
        "id": "第二步-生成证书80端口验证方式-保证80未被占用"
      },
      {
        "title": "第三步：将证书移动，指定的文件中（nginx中）",
        "anchor": "#第三步-将证书移动-指定的文件中-nginx中",
        "id": "第三步-将证书移动-指定的文件中-nginx中"
      },
      {
        "title": "第二种生成方式：（http验证）后面的目录要是网站的根目录，同样需要把移动到指定的文件夹目录",
        "anchor": "#第二种生成方式-http验证-后面的目录要是网站的根目录-同样需要把移动到指定的文件夹目录",
        "id": "第二种生成方式-http验证-后面的目录要是网站的根目录-同样需要把移动到指定的文件夹目录"
      }
    ]
  },
  {
    "id": "vue3-query-form-53a0",
    "type": "post",
    "title": "Vue3 通用查询表单组件封装：JSON Schema 驱动与响应式联动",
    "url": "posts/vue3-query-form-53a0.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-06-08",
    "tags": [
      "前端开发",
      "Vue",
      "组件封装",
      "表单设计"
    ],
    "summary": "基于 Vue 3 Composition API 与 Element Plus 打造轻量配置化查询表单组件，大幅提升后台开发效率。",
    "content": "一、组件源代码 FileUploader.vue QueryForm.vue 代码地址 ../assets/files/QueryForm.vue 父组件调用示范代码 javascript <template> <div class=\"page-container\"> <h2>查询表单示例</h2> <QueryForm v-model=\"queryParams\" :formConfig=\"FORM_CONFIG\" :dicts=\"MOCK_DICTS\" :queryDebounce=\"200\" componentSize=\"default\" @query=\"handleQuery\" @reset=\"handleReset\" > <template customSearch=\"{ prop }\"> <el-input v-model=\"queryParams prop \" placeholder=\"插槽输入\" style=\"width: 200px;\" clearable /> </template> </QueryForm> <div class=\"result-display\"> <h3>当前查询参数 QueryParams </h3> <pre>{{ JSON.stringify queryParams, null, 2 }}</pre> </div> </div> </template> <script setup> import { ref, reactive } from 'vue'; // 假设 QueryForm.vue 已经被正确导入 import QueryForm from './QueryForm.vue'; import { ElMessage } from 'element-plus'; // 仅用于演示消息提示 // --- 1. 定义数据源 --- const MOCK_DICTS = { statusList: { label: '待处理', value: 0 }, { label: '已完成', value: 1 }, { label: '已取消', value: 2 }, , channelList: { label: 'PC 端', value: 'PC' }, { label: '移动端', value: 'Mobile' }, , }; const FORM_CONFIG = { prop: 'keyword', label: '关键字', type: 'input', placeholder: '请输入订单号/用户ID' }, { prop: 'status', label: '订单状态', type: 'select', dictKey: 'statusList' }, { prop: 'channel', label: '渠道', type: 'radio', dictKey: 'channelList' }, { prop: 'createDate', label: '创建时间', type: 'dateRange', dateProps: 'createTimeStart', 'createTimeEnd' , autoCompleteTime: true, }, { prop: 'customSearch', label: '自定义', type: 'slot' }, ; // --- 2. 状态管理 --- const queryParams = ref { // 初始化一些默认值是可选的 keyword: '', status: 1, // 默认选中 '已完成' channel: 'PC', } ; // --- 3. 事件处理 --- / 处理 QueryForm 触发的查询事件 @param {Object} params - 最终的查询参数对象 / const handleQuery = params => { console.log '--- 执行查询请求 ---' ; console.log '最终参数:', params ; ElMessage.success '查询已触发，请查看控制台日志' ; // 实际项目中：调用 API 接口获取数据 // fetchTableData params ; }; / 处理 QueryForm 触发的重置事件 @param {Object} params - 重置后的查询参数对象 通常为空 / const handleReset = params => { console.log '--- 执行重置 ---' ; console.log '重置后的参数:', params ; ElMessage.info '查询表单已重置' ; }; // --- 4. 导出变量 --- // 将这些常量导出，供 template 使用 </script> <style scoped> .page-container { padding: 20px; } .result-display { margin-top: 30px; padding: 15px; background-color: f7f7f7; border-radius: 4px; } </style>",
    "sections": [
      {
        "title": "一、组件源代码 (`FileUploader.vue`)",
        "anchor": "#一-组件源代码-fileuploader-vue",
        "id": "一-组件源代码-fileuploader-vue"
      },
      {
        "title": "父组件调用示范代码",
        "anchor": "#父组件调用示范代码",
        "id": "父组件调用示范代码"
      }
    ]
  },
  {
    "id": "vue-plugins-ecosystem-7e33",
    "type": "post",
    "title": "Vue 3 生产级高频插件与生态工具库精选清单",
    "url": "posts/vue-plugins-ecosystem-7e33.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-05-28",
    "tags": [
      "前端开发",
      "Vue",
      "Vite",
      "开发提效",
      "前端工程化"
    ],
    "summary": "系统精选 Vue 3 + Vite 现代化项目工程化高频插件：自动路由生成、按需自动导入、持久化状态管理、虚拟列表滚动、Gzip 压缩与 XSS 安全防御。",
    "content": "Vue 3 生产级高频插件与生态工具库精选清单 > 在基于 Vue 3 + Vite 的企业级前端开发中，合理选用成熟的生态插件可以极大提升研发效率、缩短页面首屏加载耗时并保障应用安全。本文梳理生产环境高频必备库与配置清单。 --- 一、开发提效与工程化工具 1. 自动路由生成器： unplugin-vue-router 根据 src/pages 目录结构自动生成全类型安全（TypeScript）的 Vue Router 路由表，告别手写繁琐的 routes 数组。 bash npm i -D unplugin-vue-router 2. 核心 API 自动按需导入： unplugin-auto-import 自动按需引入 ref 、 reactive 、 computed 、 useRouter 、 useStore 等，无需在每个 SFC 头部手动 import ： bash npm i -D unplugin-auto-import javascript // vite.config.js 示例 import AutoImport from 'unplugin-auto-import/vite'; export default defineConfig { plugins: AutoImport { imports: 'vue', 'vue-router', 'pinia' , dts: 'src/auto-imports.d.ts' } } ; --- 二、首屏加载与性能优化类 | 插件名称 | 核心应用场景 | 快速安装 | | :--- | :--- | :--- | | vite-plugin-compression | 编译时自动生成 Gzip / Brotli 压缩包，显著减小部署体积。 | npm i -D vite-plugin-compression | | pinia-plugin-persistedstate | 为 Pinia 全局状态提供 LocalStorage / SessionStorage 自动持久化。 | npm i pinia-plugin-persistedstate | | vue-virtual-scroller | 针对超长列表（1000+ 数据项）开启虚拟滚动，仅渲染可视区 DOM。 | npm i vue-virtual-scroller | --- 三、Web 安全与防护类 1. 富文本 XSS 过滤防护： dompurify 在渲染用户输入的 HTML（ v-html ）时，有效清洗恶意脚本与注入代码： bash npm i dompurify @types/dompurify javascript import DOMPurify from 'dompurify'; const safeHtml = DOMPurify.sanitize userContent ; 2. 专用 XSS 白名单过滤库： xss 支持根据自定义标签白名单过滤输入字符串： bash npm i xss",
    "sections": [
      {
        "title": "一、开发提效与工程化工具",
        "anchor": "#一-开发提效与工程化工具",
        "id": "一-开发提效与工程化工具"
      },
      {
        "title": "1. 自动路由生成器：`unplugin-vue-router`",
        "anchor": "#1-自动路由生成器-unplugin-vue-router",
        "id": "1-自动路由生成器-unplugin-vue-router"
      },
      {
        "title": "2. 核心 API 自动按需导入：`unplugin-auto-import`",
        "anchor": "#2-核心-api-自动按需导入-unplugin-auto-import",
        "id": "2-核心-api-自动按需导入-unplugin-auto-import"
      },
      {
        "title": "二、首屏加载与性能优化类",
        "anchor": "#二-首屏加载与性能优化类",
        "id": "二-首屏加载与性能优化类"
      },
      {
        "title": "三、Web 安全与防护类",
        "anchor": "#三-web-安全与防护类",
        "id": "三-web-安全与防护类"
      },
      {
        "title": "1. 富文本 XSS 过滤防护：`dompurify`",
        "anchor": "#1-富文本-xss-过滤防护-dompurify",
        "id": "1-富文本-xss-过滤防护-dompurify"
      },
      {
        "title": "2. 专用 XSS 白名单过滤库：`xss`",
        "anchor": "#2-专用-xss-白名单过滤库-xss",
        "id": "2-专用-xss-白名单过滤库-xss"
      }
    ]
  },
  {
    "id": "siege-benchmark-44e0",
    "type": "post",
    "title": "开源 HTTP 压力测试工具 Siege 从安装到生产实战指南",
    "url": "posts/siege-benchmark-44e0.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-05-25",
    "tags": [
      "Linux",
      "压力测试",
      "性能优化",
      "Siege"
    ],
    "summary": "详解轻量级 HTTP 负载压测工具 Siege：并发连接模拟、吞吐量 QPS 评估、响应延迟分析与测试报告解读。",
    "content": "开源压力测试工具（siege） 当前环境（CentOS 7+） 安装步骤 第一步：更新系统 bash sudo yum -y update 第二步：安装依赖包 bash sudo yum install -y gcc make openssl-devel 第三步：下载 siege 软件包 bash wget http://download.joedog.org/siege/siege-latest.tar.gz 注意 ：如果上述链接失效，可以使用以下备用下载方式： bash 从 GitHub 下载最新版本 wget https://github.com/JoeDog/siege/releases/latest/download/siege-latest.tar.gz 第四步：解压软件包 bash tar zxvf siege-latest.tar.gz 第五步：删除安装包（可选） bash rm -f siege-latest.tar.gz 第六步：进入解压后的目录 bash 进入解压后的目录（注意：版本号可能不同，请根据实际情况调整） cd siege- / 说明 ：使用 siege- / 通配符可以自动匹配版本号，避免硬编码版本号的问题。 第七步：编译安装 bash ./configure && make 第八步：安装到系统 bash sudo make install 第九步：创建配置文件 bash 复制配置文件到用户目录 cp doc/siegerc ~/.siegerc 注意 ：如果 doc/siegerc 不存在，可以手动创建配置文件： bash 创建配置文件 touch ~/.siegerc 第十步：验证安装 bash siege -V 预期输出 ： SIEGE 4.1.3 Copyright C 2025 by Jeffrey Fulmer, et al. ... 使用示例 基本压力测试 bash 10个客户端并发，每个客户端发起10个请求 siege -c 10 -r 10 --log=./siege.log https://www.baidu.com 常用参数说明 | 参数 | 说明 | 示例 | |------|------|------| | -c | 并发用户数 | -c 10 10个并发用户 | | -r | 重复次数 | -r 10 每个用户重复10次 | | -t | 持续时间 | -t 30S 持续30秒 | | -d | 延迟时间 | -d 1 每个请求延迟1秒 | | -i | 互联网模式（随机访问） | -i | | -b | 基准测试模式（无延迟） | -b | | --log | 日志文件路径 | --log=./siege.log | 更多使用示例 bash 持续30秒的压力测试 siege -c 20 -t 30S https://www.example.com 从URL文件读取测试目标 siege -c 10 -r 5 -f urls.txt 基准测试模式（无延迟，最大压力） siege -c 50 -r 100 -b https://www.example.com 常见问题 1. 编译错误 如果出现 openssl 相关错误，请确保已安装 openssl-devel ： bash sudo yum install -y openssl-devel 2. 权限问题 如果安装时遇到权限问题，确保使用 sudo ： bash sudo make install 3. 配置文件不存在 如果 ~/.siegerc 不存在，可以手动创建： bash mkdir -p ~/.siege touch ~/.siegerc 卸载方法 bash 进入源码目录 cd siege- / 执行卸载 sudo make uninstall 删除配置文件 rm -rf ~/.siegerc 参考资源 - 官方网站：https://www.joedog.org/siege-home/ - GitHub 仓库：https://github.com/JoeDog/siege - 官方文档：https://www.joedog.org/siege-manual/",
    "sections": [
      {
        "title": "安装步骤",
        "anchor": "#安装步骤",
        "id": "安装步骤"
      },
      {
        "title": "第一步：更新系统",
        "anchor": "#第一步-更新系统",
        "id": "第一步-更新系统"
      },
      {
        "title": "第二步：安装依赖包",
        "anchor": "#第二步-安装依赖包",
        "id": "第二步-安装依赖包"
      },
      {
        "title": "第三步：下载 siege 软件包",
        "anchor": "#第三步-下载-siege-软件包",
        "id": "第三步-下载-siege-软件包"
      },
      {
        "title": "第四步：解压软件包",
        "anchor": "#第四步-解压软件包",
        "id": "第四步-解压软件包"
      },
      {
        "title": "第五步：删除安装包（可选）",
        "anchor": "#第五步-删除安装包-可选",
        "id": "第五步-删除安装包-可选"
      },
      {
        "title": "第六步：进入解压后的目录",
        "anchor": "#第六步-进入解压后的目录",
        "id": "第六步-进入解压后的目录"
      },
      {
        "title": "第七步：编译安装",
        "anchor": "#第七步-编译安装",
        "id": "第七步-编译安装"
      },
      {
        "title": "第八步：安装到系统",
        "anchor": "#第八步-安装到系统",
        "id": "第八步-安装到系统"
      },
      {
        "title": "第九步：创建配置文件",
        "anchor": "#第九步-创建配置文件",
        "id": "第九步-创建配置文件"
      },
      {
        "title": "第十步：验证安装",
        "anchor": "#第十步-验证安装",
        "id": "第十步-验证安装"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "基本压力测试",
        "anchor": "#基本压力测试",
        "id": "基本压力测试"
      },
      {
        "title": "常用参数说明",
        "anchor": "#常用参数说明",
        "id": "常用参数说明"
      },
      {
        "title": "更多使用示例",
        "anchor": "#更多使用示例",
        "id": "更多使用示例"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "1. 编译错误",
        "anchor": "#1-编译错误",
        "id": "1-编译错误"
      },
      {
        "title": "2. 权限问题",
        "anchor": "#2-权限问题",
        "id": "2-权限问题"
      },
      {
        "title": "3. 配置文件不存在",
        "anchor": "#3-配置文件不存在",
        "id": "3-配置文件不存在"
      },
      {
        "title": "卸载方法",
        "anchor": "#卸载方法",
        "id": "卸载方法"
      },
      {
        "title": "参考资源",
        "anchor": "#参考资源",
        "id": "参考资源"
      }
    ]
  },
  {
    "id": "ruoyi-nav-fix-3171",
    "type": "post",
    "title": "若依管理系统导航报错 reading 'nextSibling' 根因分析与解决方案",
    "url": "posts/ruoyi-nav-fix-3171.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-05-20",
    "tags": [
      "前端开发",
      "Vue",
      "Bug排查",
      "若依"
    ],
    "summary": "剖析 Vue-Router 与 Element-UI 侧边栏菜单在动态路由加载时 nextSibling 为空的偶发报错原因与补丁方案。",
    "content": "若依vue3 报错 reading 'nextSibling' RuoYi点击菜单出现空白页面，无报错 前端使用若依框架 vue3版本 ，在开发过程中有时会出现切换菜单或者tab，页面空白的情况，刷新页面后又恢复正常。出现这种情况一般是在页面停留了几分钟再操作或者短时间多次跳转，偶尔也会莫名奇妙的出现， 修改路径 html src/layout/components/AppMain.vue 原本代码 html <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> 修改后的代码 html <transition name=\"fade-transform\" mode=\"out-in\"> <div :key=\"route.path\"> <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> </div> </transition>",
    "sections": [
      {
        "title": "若依vue3 报错 reading 'nextSibling'",
        "anchor": "#若依vue3-报错-reading-nextsibling",
        "id": "若依vue3-报错-reading-nextsibling"
      },
      {
        "title": "RuoYi点击菜单出现空白页面，无报错",
        "anchor": "#ruoyi点击菜单出现空白页面-无报错",
        "id": "ruoyi点击菜单出现空白页面-无报错"
      },
      {
        "title": "修改路径",
        "anchor": "#修改路径",
        "id": "修改路径"
      },
      {
        "title": "原本代码",
        "anchor": "#原本代码",
        "id": "原本代码"
      },
      {
        "title": "修改后的代码",
        "anchor": "#修改后的代码",
        "id": "修改后的代码"
      }
    ]
  },
  {
    "id": "xray-core-script-c8e6",
    "type": "post",
    "title": "Xray-Core Linux 一键部署与自动化服务管理脚本",
    "url": "posts/xray-core-script-c8e6.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-05-15",
    "tags": [
      "Linux",
      "网络工具",
      "脚本自动化"
    ],
    "summary": "Linux 生产环境一键拉取并安装最新 Xray 核心，配置 Systemd 守护进程与日志轮转。",
    "content": "Xray 一键安装脚本使用说明 本文档提供了运行托管在 GitHub 上的 xray.sh 脚本的通用安装命令，并说明了具体的使用方法及相关注意事项。 1. 安装命令 您可以根据服务器的环境（是否预装了 curl 或 wget ），选择以下任意一种方式进行安装： 方法一：使用 curl （推荐，最快捷） 此命令会直接读取网络文件并执行，不会在服务器本地留下脚本文件。 bash bash < curl -Ls https://vmrey.github.io/assets/files/xray.sh 方法二：使用 wget 如果您的服务器没有安装 curl ，可以使用 wget 达到相同的效果。 bash wget -O- https://vmrey.github.io/assets/files/xray.sh | bash 方法三：分步执行（适合需要先检查代码的用户） 将脚本下载到本地，赋予执行权限后再手动运行。 bash 1. 下载脚本 curl -O https://vmrey.github.io/assets/files/xray.sh 2. 赋予脚本执行权限 chmod +x xray.sh 3. 运行脚本 ./xray.sh --- 2. 怎么用？（使用步骤） 1. 连接服务器 ：使用 SSH 客户端（如 Termius, Xshell, PuTTY 或 macOS/Linux 自带的终端）连接到您的 Linux 服务器（VPS）。 2. 复制命令 ：复制上述“安装命令”中的任意一条。 3. 执行安装 ：在服务器终端内粘贴该命令并按回车键运行。 4. 跟随提示操作 ：脚本运行后，通常会弹出交互式菜单或按步骤提示您输入/确认相关配置（如选择安装的协议、端口号、伪装域名等）。请仔细阅读终端打印的提示，输入对应数字或按回车确认。 5. 保存节点信息 ：安装完成后，脚本一般会在终端底部输出最终的客户端连接信息（如 VLESS/VMess 分享链接、配置 JSON 或二维码），请务必妥善复制并保存这些信息，用于配置您的本地客户端。 ---",
    "sections": [
      {
        "title": "1. 安装命令",
        "anchor": "#1-安装命令",
        "id": "1-安装命令"
      },
      {
        "title": "方法一：使用 `curl`（推荐，最快捷）",
        "anchor": "#方法一-使用-curl-推荐-最快捷",
        "id": "方法一-使用-curl-推荐-最快捷"
      },
      {
        "title": "方法二：使用 `wget`",
        "anchor": "#方法二-使用-wget",
        "id": "方法二-使用-wget"
      },
      {
        "title": "方法三：分步执行（适合需要先检查代码的用户）",
        "anchor": "#方法三-分步执行-适合需要先检查代码的用户",
        "id": "方法三-分步执行-适合需要先检查代码的用户"
      },
      {
        "title": "2. 怎么用？（使用步骤）",
        "anchor": "#2-怎么用-使用步骤",
        "id": "2-怎么用-使用步骤"
      }
    ]
  },
  {
    "id": "js-debounce-throttle-1d40",
    "type": "post",
    "title": "JavaScript 防抖与节流深度剖析：从原理实现到业务场景落地",
    "url": "posts/js-debounce-throttle-1d40.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-05-12",
    "tags": [
      "前端开发",
      "JavaScript",
      "性能优化",
      "工具函数"
    ],
    "summary": "深入剖析 Debounce 与 Throttle 运行机理，手写支持 immediate 首次立即执行与取消功能的完整实现。",
    "content": "前端开发之防抖和节流函数 概念说明 防抖（Debounce） 定义 ：一个需要频繁触发的函数，在规定时间内，只能让最后一次生效，前面的不生效。 原理 ：每次触发时都清除上一次的定时器，重新计时，直到停止触发一段时间后才执行。 适用场景 ： - 搜索框输入联想 - 窗口resize事件 - 表单验证 - 按钮点击防重复提交 节流（Throttle） 定义 ：一个函数执行一次后，只有大于设定的执行周期后才会执行第二次。 原理 ：在指定时间间隔内，无论触发多少次，只执行一次。 适用场景 ： - 滚动事件监听 - 鼠标移动事件 - 按钮连续点击 - 游戏中的按键事件 防抖函数实现 ES5 写法 javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Function} - 防抖处理后的函数 / function debounce fn, delay { var timer = null; return function { // 清理上一次延时器 clearTimeout timer ; // 保存this和参数 var that = this; var args = arguments; // 重新设置新的延时器 timer = setTimeout function { fn.apply that, args ; }, delay ; }; } ES6 写法（推荐） javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @param {boolean} immediate - 是否立即执行 @returns {Function} - 防抖处理后的函数 / function debounce fn, delay = 300, immediate = false { let timer = null; return function ...args { // 清除上一次定时器 clearTimeout timer ; if immediate { // 立即执行模式 if !timer { fn.apply this, args ; } timer = setTimeout => { timer = null; }, delay ; } else { // 延迟执行模式 timer = setTimeout => { fn.apply this, args ; }, delay ; } }; } 带取消功能的防抖函数 javascript / 可取消的防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Object} - 包含debounce函数和cancel方法 / function createDebounce fn, delay = 300 { let timer = null; const debounced = function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; // 取消防抖 debounced.cancel = function { clearTimeout timer ; timer = null; }; return debounced; } 节流函数实现 ES5 写法 javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 设定的时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay { var startTime = 0; return function { // 记录当前函数触发时间 var endTime = Date.now ; if endTime - startTime > delay { // 保存this和参数 var that = this; var args = arguments; fn.apply that, args ; // 同步时间 startTime = endTime; } }; } ES6 写法（推荐） javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } 定时器版本节流 javascript / 定时器版本节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttleTimer fn, delay = 300 { let timer = null; return function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; } 带取消功能的节流函数 javascript / 可取消的节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Object} - 包含throttle函数和cancel方法 / function createThrottle fn, delay = 300 { let timer = null; const throttled = function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; // 取消节流 throttled.cancel = function { clearTimeout timer ; timer = null; }; return throttled; } 实际应用示例 1. 搜索框输入防抖 javascript // 搜索框输入联想 const searchInput = document.getElementById 'search-input' ; const debouncedSearch = debounce function keyword { console.log '搜索：', keyword ; // 实际项目中这里会调用API }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; 2. 按钮点击防抖 javascript // 防止表单重复提交 const submitBtn = document.getElementById 'submit-btn' ; const debouncedSubmit = debounce function { console.log '表单提交' ; // 实际提交逻辑 }, 1000 ; submitBtn.addEventListener 'click', debouncedSubmit ; 3. 窗口resize节流 javascript // 窗口大小改变时重新计算布局 const throttledResize = throttle function { console.log '窗口大小改变' ; // 重新计算布局逻辑 }, 200 ; window.addEventListener 'resize', throttledResize ; 4. 滚动事件节流 javascript // 滚动加载更多 const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const windowHeight = window.innerHeight; const documentHeight = document.documentElement.scrollHeight; if scrollTop + windowHeight >= documentHeight - 100 { console.log '加载更多数据' ; // 加载更多数据的逻辑 } }, 300 ; window.addEventListener 'scroll', throttledScroll ; 5. 鼠标移动节流 javascript // 鼠标位置追踪 const throttledMouseMove = throttle function e { console.log '鼠标位置：', e.clientX, e.clientY ; // 鼠标位置处理逻辑 }, 100 ; document.addEventListener 'mousemove', throttledMouseMove ; 防抖 vs 节流对比 | 特性 | 防抖 | 节流 | |------|------|------| | 执行时机 | 停止触发后执行 | 固定时间间隔执行 | | 触发频率 | 只执行最后一次 | 定期执行 | | 首次触发 | 可配置立即执行 | 立即执行 | | 典型场景 | 搜索框、表单提交 | 滚动、鼠标移动 | | 性能影响 | 减少不必要的执行 | 控制执行频率 | 完整示例页面 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>防抖和节流示例</title> <style> body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; } .section { margin-bottom: 30px; padding: 20px; border: 1px solid ddd; border-radius: 5px; } input { padding: 8px; margin: 10px 0; width: 300px; } button { padding: 10px 20px; margin: 10px 0; cursor: pointer; } .log { background: f5f5f5; padding: 10px; margin-top: 10px; max-height: 200px; overflow-y: auto; font-family: monospace; } </style> </head> <body> <h1>防抖和节流函数示例</h1> <!-- 防抖示例 --> <div class=\"section\"> <h2>防抖示例 - 搜索框</h2> <input type=\"text\" id=\"search-input\" placeholder=\"输入搜索内容...\"> <div class=\"log\" id=\"search-log\"></div> </div> <!-- 节流示例 --> <div class=\"section\"> <h2>节流示例 - 按钮点击</h2> <button id=\"throttle-btn\">点击我（节流）</button> <div class=\"log\" id=\"throttle-log\"></div> </div> <!-- 滚动节流示例 --> <div class=\"section\"> <h2>滚动节流示例</h2> <p>向下滚动查看效果...</p> <div style=\"height: 2000px; background: linear-gradient to bottom, f0f0f0, e0e0e0 ;\"></div> <div class=\"log\" id=\"scroll-log\"></div> </div> <script> // 防抖函数 function debounce fn, delay = 300 { let timer = null; return function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; } // 节流函数 function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } // 搜索框防抖 const searchInput = document.getElementById 'search-input' ; const searchLog = document.getElementById 'search-log' ; const debouncedSearch = debounce function keyword { const time = new Date .toLocaleTimeString ; searchLog.innerHTML += <div> ${time} 搜索：${keyword}</div> ; searchLog.scrollTop = searchLog.scrollHeight; }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; // 按钮节流 const throttleBtn = document.getElementById 'throttle-btn' ; const throttleLog = document.getElementById 'throttle-log' ; const throttledClick = throttle function { const time = new Date .toLocaleTimeString ; throttleLog.innerHTML += <div> ${time} 按钮被点击</div> ; throttleLog.scrollTop = throttleLog.scrollHeight; }, 1000 ; throttleBtn.addEventListener 'click', throttledClick ; // 滚动节流 const scrollLog = document.getElementById 'scroll-log' ; const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const time = new Date .toLocaleTimeString ; scrollLog.innerHTML += <div> ${time} 滚动位置：${scrollTop}px</div> ; scrollLog.scrollTop = scrollLog.scrollHeight; }, 300 ; window.addEventListener 'scroll', throttledScroll ; </script> </body> </html> 性能优化建议 1. 合理设置延迟时间 ： - 防抖：通常300-500ms - 节流：通常100-300ms 2. 选择合适的函数 ： - 需要最终结果用防抖 - 需要持续反馈用节流 3. 内存管理 ： - 及时取消不需要的防抖/节流 - 在组件销毁时清理定时器 4. 参数传递 ： - 正确处理 this 指向 - 传递完整的参数列表 常见问题 Q1: 防抖和节流有什么区别？ A: 防抖是停止触发后执行，节流是固定时间间隔执行。 Q2: 如何选择使用防抖还是节流？ A: 需要最终结果（如搜索）用防抖，需要持续反馈（如滚动）用节流。 Q3: 如何取消防抖/节流？ A: 使用带取消功能的版本，调用 cancel 方法。 Q4: 防抖/节流会影响性能吗？ A: 不会，反而能提升性能，减少不必要的函数调用。 总结 防抖和节流是前端性能优化的重要手段： - ✅ 防抖 ：适合搜索框、表单提交等场景 - ✅ 节流 ：适合滚动、鼠标移动等场景 - ✅ 性能优化 ：减少不必要的函数调用 - ✅ 用户体验 ：避免卡顿和重复操作 正确使用防抖和节流可以显著提升应用的性能和用户体验！",
    "sections": [
      {
        "title": "概念说明",
        "anchor": "#概念说明",
        "id": "概念说明"
      },
      {
        "title": "防抖（Debounce）",
        "anchor": "#防抖-debounce",
        "id": "防抖-debounce"
      },
      {
        "title": "节流（Throttle）",
        "anchor": "#节流-throttle",
        "id": "节流-throttle"
      },
      {
        "title": "防抖函数实现",
        "anchor": "#防抖函数实现",
        "id": "防抖函数实现"
      },
      {
        "title": "ES5 写法",
        "anchor": "#es5-写法",
        "id": "es5-写法"
      },
      {
        "title": "ES6 写法（推荐）",
        "anchor": "#es6-写法-推荐",
        "id": "es6-写法-推荐"
      },
      {
        "title": "带取消功能的防抖函数",
        "anchor": "#带取消功能的防抖函数",
        "id": "带取消功能的防抖函数"
      },
      {
        "title": "节流函数实现",
        "anchor": "#节流函数实现",
        "id": "节流函数实现"
      },
      {
        "title": "ES5 写法",
        "anchor": "#es5-写法",
        "id": "es5-写法"
      },
      {
        "title": "ES6 写法（推荐）",
        "anchor": "#es6-写法-推荐",
        "id": "es6-写法-推荐"
      },
      {
        "title": "定时器版本节流",
        "anchor": "#定时器版本节流",
        "id": "定时器版本节流"
      },
      {
        "title": "带取消功能的节流函数",
        "anchor": "#带取消功能的节流函数",
        "id": "带取消功能的节流函数"
      },
      {
        "title": "实际应用示例",
        "anchor": "#实际应用示例",
        "id": "实际应用示例"
      },
      {
        "title": "1. 搜索框输入防抖",
        "anchor": "#1-搜索框输入防抖",
        "id": "1-搜索框输入防抖"
      },
      {
        "title": "2. 按钮点击防抖",
        "anchor": "#2-按钮点击防抖",
        "id": "2-按钮点击防抖"
      },
      {
        "title": "3. 窗口resize节流",
        "anchor": "#3-窗口resize节流",
        "id": "3-窗口resize节流"
      },
      {
        "title": "4. 滚动事件节流",
        "anchor": "#4-滚动事件节流",
        "id": "4-滚动事件节流"
      },
      {
        "title": "5. 鼠标移动节流",
        "anchor": "#5-鼠标移动节流",
        "id": "5-鼠标移动节流"
      },
      {
        "title": "防抖 vs 节流对比",
        "anchor": "#防抖-vs-节流对比",
        "id": "防抖-vs-节流对比"
      },
      {
        "title": "完整示例页面",
        "anchor": "#完整示例页面",
        "id": "完整示例页面"
      },
      {
        "title": "性能优化建议",
        "anchor": "#性能优化建议",
        "id": "性能优化建议"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "xray-dns-routing-b411",
    "type": "post",
    "title": "Xray DNS 分流防污染优化与国内外路由分流规则配置",
    "url": "posts/xray-dns-routing-b411.html",
    "externalUrl": "",
    "category": "Linux与服务端",
    "date": "2026-05-08",
    "tags": [
      "Linux",
      "网络协议",
      "DNS",
      "路由优化",
      "Xray"
    ],
    "summary": "详解 Xray 核心 DNS 分流配置与防污染机制，基于 Geosite 域名列表实现境外加密 DNS 解析与境内直连智能分流。",
    "content": "Xray DNS 分流防污染优化与国内外路由分流规则配置 > 在使用 Xray 时，DNS 污染往往会导致特定域名无法解析或解析到虚假 IP。通过配置内置的 dns 模块与 routing 路由协同，可以实现境外域名走远程安全 DNS、境内域名走本地 ISP 直连的高性能智能分流方案。 --- 一、DNS 防污染核心配置段 在 config.json 顶级节点中添加或替换 dns 配置： json { \"dns\": { \"servers\": { \"address\": \"8.8.8.8\", \"port\": 53, \"domains\": \"geosite:google\", \"geosite:youtube\", \"geosite:netflix\", \"geosite:disney\", \"geosite:hulu\", \"geosite:primevideo\", \"geosite:openai\", \"geosite:anthropic\", \"geosite:github\", \"geosite:telegram\", \"geosite:twitter\", \"geosite:facebook\", \"geosite:instagram\", \"geosite:geolocation-!cn\" }, { \"address\": \"223.5.5.5\", \"port\": 53, \"domains\": \"geosite:cn\" , \"expectIPs\": \"geoip:cn\" }, \"localhost\" , \"clientIp\": \"1.1.1.1\", \"queryStrategy\": \"UseIP\" } } --- 二、配置核心参数解析 | 参数项 | 说明 | 作用 | | :--- | :--- | :--- | | geosite:geolocation-!cn | 预置非中国大陆域名列表 | 命中这些域名的查询请求全部强制使用 8.8.8.8 安全解析，杜绝 DNS 污染。 | | geosite:cn | 预置中国大陆域名列表 | 国内域名直接走阿里 DNS（ 223.5.5.5 ），确保国内网站毫秒级秒开且 CDN 节点最优。 | | expectIPs | 预期返回 IP 范围 | 若国内 DNS 返回了非国内 IP，则丢弃并转由 fallback 处理，防止劫持。 | | queryStrategy | DNS 查询偏好策略 | 可选 UseIP / UseIPv4 / UseIPv6 ，避免双栈网络下因 IPv6 不稳定导致的缓慢。 | --- 三、配套路由规则（Routing Rules） 配合 DNS 分流，在 routing.rules 中添加出站标签绑定： json { \"routing\": { \"domainStrategy\": \"IPIfNonMatch\", \"rules\": { \"type\": \"field\", \"inboundTag\": \"dns-in\" , \"outboundTag\": \"direct\" }, { \"type\": \"field\", \"outboundTag\": \"direct\", \"domain\": \"geosite:cn\" }, { \"type\": \"field\", \"outboundTag\": \"proxy\", \"domain\": \"geosite:geolocation-!cn\" } } }",
    "sections": [
      {
        "title": "一、DNS 防污染核心配置段",
        "anchor": "#一-dns-防污染核心配置段",
        "id": "一-dns-防污染核心配置段"
      },
      {
        "title": "二、配置核心参数解析",
        "anchor": "#二-配置核心参数解析",
        "id": "二-配置核心参数解析"
      },
      {
        "title": "三、配套路由规则（Routing Rules）",
        "anchor": "#三-配套路由规则-routing-rules",
        "id": "三-配套路由规则-routing-rules"
      }
    ]
  },
  {
    "id": "js-tree-recursion-209b",
    "type": "post",
    "title": "常用树结构递归工具函数合集：树平铺、节点查找与层级过滤",
    "url": "posts/js-tree-recursion-209b.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-05-02",
    "tags": [
      "前端开发",
      "JavaScript",
      "数据结构",
      "算法工具"
    ],
    "summary": "实战整理针对级联选择器与目录树的高频递归操作函数：扁平化转换、树深度查找、剪枝过滤与路径追踪。",
    "content": "递归工具函数合集 1. 对象值检索器 - deepSearchValue 功能说明 ：递归遍历对象或数组的所有层级，检查是否存在指定的目标值 参数说明 ： - targetValue 必传 ：需要检索的目标值，支持基本类型（字符串、数字、布尔值等） - source 必传 ：待检索的数据源，可以是对象或数组 - 返回值： boolean - 找到返回 true ，未找到返回 false 技术要点 ： - 使用严格相等 === 进行比较，避免类型转换导致的误判 - 支持无限层级嵌套的对象和数组 - 一旦找到匹配值立即返回，优化性能 javascript / 递归检索对象/数组中是否包含指定值 @param { } targetValue - 要查找的目标值（基本类型） @param {Object|Array} source - 待检索的对象或数组 @returns {boolean} - 是否找到目标值 / function deepSearchValue targetValue, source { // 基本类型直接比较 if source === targetValue { return true; } // 数组处理 if Array.isArray source { for let item of source { if deepSearchValue targetValue, item { return true; } } return false; } // 对象处理（排除 null） if source !== null && typeof source === 'object' { for let key in source { if deepSearchValue targetValue, source key { return true; } } return false; } return false; } // 调用示例 const testData = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\", Hair: \"blue\" }, id: 5, sex: \"男\", age: 61 } }; console.log deepSearchValue 'T恤', testData ; // true console.log deepSearchValue '裤子', testData ; // false console.log deepSearchValue 5, testData ; // true --- 2. 数组扁平化 - flattenArray 功能说明 ：将多维数组递归展开为一维数组 参数说明 ： - array 必传 ：需要扁平化的多维数组 - 返回值： Array - 扁平化后的一维数组 技术要点 ： - 支持任意深度的嵌套数组 - 保留原始数组中的对象引用 - 使用 Array.isArray 准确判断数组类型 javascript / 递归扁平化多维数组 @param {Array} array - 需要扁平化的数组 @returns {Array} - 扁平化后的一维数组 / function flattenArray array { let result = ; for let item of array { if Array.isArray item { // 递归处理子数组 result = result.concat flattenArray item ; } else { result.push item ; } } return result; } // 调用示例 const nestedArray = 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859 , 85, 6 , 96, 56 ; console.log flattenArray nestedArray ; // 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859, 85, 6, 96, 56 --- 3. 对象扁平化 - flattenObject 功能说明 ：将嵌套对象递归展开为单层对象 参数说明 ： - obj 必传 ：需要扁平化的嵌套对象 - prefix 可选 ：键名前缀，用于保持层级关系 - 返回值： Object - 扁平化后的单层对象 技术要点 ： - 使用点号连接嵌套键名（如 user.name ） - 遇到数组时保持原样，不展开 - 注意 ：相同路径的键会被后续值覆盖 javascript / 递归扁平化嵌套对象 @param {Object} obj - 需要扁平化的对象 @param {string} prefix='' - 键名前缀（内部使用） @returns {Object} - 扁平化后的对象 / function flattenObject obj, prefix = '' { let result = {}; for let key in obj { // 跳过原型链属性 if !obj.hasOwnProperty key continue; const newKey = prefix ? ${prefix}.${key} : key; if typeof obj key === 'object' && obj key !== null && !Array.isArray obj key { // 递归处理嵌套对象 Object.assign result, flattenObject obj key , newKey ; } else { result newKey = obj key ; } } return result; } // 调用示例 const nestedObject = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\" }, id: 5, tags: \"admin\", \"vip\" } }; console.log flattenObject nestedObject ; // { // \"user.name\": \"zhanshan\", // \"user.goods.clothes\": \"T恤\", // \"user.goods.color\": \"red\", // \"user.id\": 5, // \"user.tags\": \"admin\", \"vip\" // }",
    "sections": [
      {
        "title": "1. 对象值检索器 - deepSearchValue",
        "anchor": "#1-对象值检索器-deepsearchvalue",
        "id": "1-对象值检索器-deepsearchvalue"
      },
      {
        "title": "2. 数组扁平化 - flattenArray",
        "anchor": "#2-数组扁平化-flattenarray",
        "id": "2-数组扁平化-flattenarray"
      },
      {
        "title": "3. 对象扁平化 - flattenObject",
        "anchor": "#3-对象扁平化-flattenobject",
        "id": "3-对象扁平化-flattenobject"
      }
    ]
  },
  {
    "id": "mini-js-template-ee56",
    "type": "post",
    "title": "实现一个最优雅的微型 JavaScript 模板引擎：30 行代码解析核心原理",
    "url": "posts/mini-js-template-ee56.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-04-22",
    "tags": [
      "前端开发",
      "JavaScript",
      "底层原理",
      "模板引擎"
    ],
    "summary": "通过正则表达式与 new Function / eval 构建轻量高效的字符串模板渲染引擎，解析 Mustache/EJS 核心思想。",
    "content": "前端之最优雅的模板引擎实现 模板引擎实现原理 模板引擎的核心原理是将模板字符串中的占位符替换为实际数据值。一个优雅的模板引擎应该具备以下特性： - 简洁的语法 ：易于书写和理解 - 强大的功能 ：支持变量、循环、条件等 - 安全性 ：防止XSS攻击 - 性能优化 ：编译缓存机制 基础版本：简单变量替换 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎基础实现</title> </head> <body> <div id=\"app\"></div> <script> // 模板数据 var tempData = { \"name\": \"张三\", \"age\": 28, \"sex\": \"男\" }; // 模板字符串（修正了原代码中的变量错误） var templateStr = <h1>我是{{name}}，性别：{{sex}}，年龄：{{age}}</h1> ; / 简单模板渲染函数 @param {string} templateStr - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render templateStr, data { return templateStr.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { // 处理数据不存在的情况 return data key !== undefined ? data key : ''; } ; } // 渲染模板 document.getElementById 'app' .innerHTML = render templateStr, tempData ; </script> </body> </html> 进阶版本：支持循环和条件 javascript / 进阶模板引擎 支持：变量替换、条件判断、循环遍历 / function advancedRender template, data { // 1. 处理条件判断 {{if condition}}...{{/if}} template = template.replace /\\{\\{if\\s+ \\w+ \\}\\} . ? \\{\\{\\/if\\}\\}/g, function match, condition, content { return data condition ? content : ''; } ; // 2. 处理循环 {{for item in list}}...{{/for}} template = template.replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\} . ? \\{\\{\\/for\\}\\}/g, function match, itemName, listName, content { var list = data listName || ; return list.map function item { return content.replace /\\{\\{\\s \\w+ \\s \\}\\}/g, function m, key { return item key !== undefined ? item key : ''; } ; } .join '' ; } ; // 3. 处理变量替换 {{variable}} template = template.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { return data key !== undefined ? data key : ''; } ; return template; } // 使用示例 var data = { title: '用户列表', users: { name: '张三', age: 28, active: true }, { name: '李四', age: 32, active: false }, { name: '王五', age: 24, active: true } , showTitle: true }; var template = <div> {{if showTitle}} <h1>{{title}}</h1> {{/if}} <ul> {{for user in users}} <li>{{user.name}} - {{user.age}}岁</li> {{/for}} </ul> </div> ; console.log advancedRender template, data ; 完整版本：带缓存和安全过滤 javascript / 完整模板引擎实现 特性：编译缓存、XSS过滤、错误处理 / var TemplateEngine = function { // 编译缓存 var cache = {}; / XSS安全过滤 @param {string} str - 需要过滤的字符串 @returns {string} - 过滤后的字符串 / function escapeHtml str { if typeof str !== 'string' return str; return str .replace /&/g, '&amp;' .replace /</g, '&lt;' .replace />/g, '&gt;' .replace /\"/g, '&quot;' .replace /'/g, '& 039;' ; } / 编译模板 @param {string} template - 模板字符串 @returns {Function} - 编译后的渲染函数 / function compile template { // 检查缓存 if cache template { return cache template ; } // 模板转译为JavaScript代码 var code = var result = ; result.push \"${template .replace /\"/g, '\\\\\"' .replace /\\{\\{= \\w+ \\}\\}/g, '\",escapeHtml data \"$1\" ,\"' // 安全输出 .replace /\\{\\{ \\w+ \\}\\}/g, '\",data \"$1\" ,\"' // 普通输出 .replace /\\{\\{if\\s+ \\w+ \\}\\}/g, '\" ;if data \"$1\" {result.push \"' .replace /\\{\\{\\/if\\}\\}/g, '\" ;}result.push \"' .replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\}/g, '\" ;for var i=0;i<data \"$2\" .length;i++ {var $1=data \"$2\" i ;result.push \"' .replace /\\{\\{\\/for\\}\\}/g, '\" ;}result.push \"' }\" ; return result.join \"\" ; ; // 创建渲染函数 var render = new Function 'data', 'escapeHtml', code ; // 缓存编译结果 cache template = render; return render; } / 渲染模板 @param {string} template - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render template, data { try { var compiled = compile template ; return compiled data, escapeHtml ; } catch error { console.error '模板渲染错误:', error ; return '模板渲染失败'; } } / 清除缓存 / function clearCache { cache = {}; } return { render: render, compile: compile, clearCache: clearCache }; } ; // 使用示例 var template = <div class=\"user-card\"> <h2>{{=name}}</h2> <p>年龄：{{age}}</p> {{if active}} <span class=\"status active\">在线</span> {{/if}} <ul> {{for item in hobbies}} <li>{{=item}}</li> {{/for}} </ul> </div> ; var data = { name: '<script>alert \"XSS攻击\" </script>', // 恶意代码 age: 28, active: true, hobbies: '编程', '阅读', '运动' }; // 渲染结果会自动过滤XSS console.log TemplateEngine.render template, data ; 模板引擎语法参考 | 语法 | 说明 | 示例 | |------|------|------| | {{variable}} | 普通变量输出 | {{name}} | | {{=variable}} | 安全输出（XSS过滤） | {{=content}} | | {{if condition}}...{{/if}} | 条件判断 | {{if active}}在线{{/if}} | | {{for item in list}}...{{/for}} | 循环遍历 | {{for user in users}}{{user.name}}{{/for}} | 性能优化策略 1. 编译缓存 javascript // 使用WeakMap缓存编译结果 var compileCache = new WeakMap ; function compileWithCache template { if compileCache.has template { return compileCache.get template ; } var compiled = compile template ; compileCache.set template, compiled ; return compiled; } 2. 批量渲染 javascript // 批量渲染多个模板 function renderBatch templates, data { return templates.map function tpl { return TemplateEngine.render tpl, data ; } ; } 3. 虚拟DOM集成 javascript // 与虚拟DOM结合 function renderToVDOM template, data { var html = TemplateEngine.render template, data ; return createElement 'div', { innerHTML: html } .firstChild; } 实际应用示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎实战</title> <style> .user-list { list-style: none; padding: 0; } .user-item { padding: 10px; border-bottom: 1px solid eee; } .active { color: green; } .inactive { color: gray; } </style> </head> <body> <div id=\"app\"></div> <script> // 模板字符串 var template = <h1>{{title}}</h1> <p>{{description}}</p> <ul class=\"user-list\"> {{for user in users}} <li class=\"user-item\"> <strong>{{=user.name}}</strong> <span class=\"{{user.active ? 'active' : 'inactive'}}\"> {{user.active ? '在线' : '离线'}} </span> </li> {{/for}} </ul> {{if users.length === 0}} <p>暂无用户数据</p> {{/if}} ; // 数据 var data = { title: '用户管理系统', description: '展示系统中的所有用户', users: { name: '张三', active: true }, { name: '李四', active: false }, { name: '王五', active: true } }; // 渲染 document.getElementById 'app' .innerHTML = TemplateEngine.render template, data ; </script> </body> </html> 与主流模板引擎对比 | 特性 | 本实现 | Handlebars | Mustache | EJS | |------|--------|------------|----------|-----| | 变量替换 | ✅ | ✅ | ✅ | ✅ | | 条件判断 | ✅ | ✅ | ❌ | ✅ | | 循环遍历 | ✅ | ✅ | ✅ | ✅ | | XSS过滤 | ✅ | ✅ | ❌ | ❌ | | 编译缓存 | ✅ | ✅ | ✅ | ✅ | | 自定义helper | ❌ | ✅ | ❌ | ✅ | | 体积大小 | 小 | 中 | 小 | 中 | 总结 一个优雅的模板引擎应该具备以下特点： - ✅ 简洁的API ：易于使用和学习 - ✅ 安全可靠 ：自动XSS过滤 - ✅ 高性能 ：编译缓存机制 - ✅ 功能完善 ：支持变量、循环、条件 - ✅ 错误处理 ：友好的错误提示 本实现提供了一个轻量级但功能完善的模板引擎，适合在不需要引入大型库的场景中使用。",
    "sections": [
      {
        "title": "模板引擎实现原理",
        "anchor": "#模板引擎实现原理",
        "id": "模板引擎实现原理"
      },
      {
        "title": "基础版本：简单变量替换",
        "anchor": "#基础版本-简单变量替换",
        "id": "基础版本-简单变量替换"
      },
      {
        "title": "进阶版本：支持循环和条件",
        "anchor": "#进阶版本-支持循环和条件",
        "id": "进阶版本-支持循环和条件"
      },
      {
        "title": "完整版本：带缓存和安全过滤",
        "anchor": "#完整版本-带缓存和安全过滤",
        "id": "完整版本-带缓存和安全过滤"
      },
      {
        "title": "模板引擎语法参考",
        "anchor": "#模板引擎语法参考",
        "id": "模板引擎语法参考"
      },
      {
        "title": "性能优化策略",
        "anchor": "#性能优化策略",
        "id": "性能优化策略"
      },
      {
        "title": "1. 编译缓存",
        "anchor": "#1-编译缓存",
        "id": "1-编译缓存"
      },
      {
        "title": "2. 批量渲染",
        "anchor": "#2-批量渲染",
        "id": "2-批量渲染"
      },
      {
        "title": "3. 虚拟DOM集成",
        "anchor": "#3-虚拟dom集成",
        "id": "3-虚拟dom集成"
      },
      {
        "title": "实际应用示例",
        "anchor": "#实际应用示例",
        "id": "实际应用示例"
      },
      {
        "title": "与主流模板引擎对比",
        "anchor": "#与主流模板引擎对比",
        "id": "与主流模板引擎对比"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "mobile-verify-635b",
    "type": "post",
    "title": "前端输入框严格限制只能输入中国手机号码的最佳实践",
    "url": "posts/mobile-verify-635b.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-04-15",
    "tags": [
      "前端开发",
      "JavaScript",
      "正则表达式",
      "表单校验"
    ],
    "summary": "结合 input 事件过滤、粘贴拦截与最新 11 位号段正则，打造极致体验的手机号输入框校验。",
    "content": "前端限制用户只能输入手机号码（中国手机号码） 中国手机号码规则 | 规则 | 说明 | |------|------| | 长度 | 11位数字 | | 开头 | 必须以 1 开头 | | 第二位 | 3-9 （不能是0或1） | | 常见号段 | 13x、14x、15x、16x、17x、18x、19x | 纯 JavaScript 实现 方法1：输入实时过滤 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>手机号码输入限制</title> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; } </style> </head> <body> <input type=\"tel\" id=\"phone-input\" placeholder=\"请输入手机号码\" class=\"input-box\" maxlength=\"11\" > <script> const phoneInput = document.getElementById 'phone-input' ; phoneInput.addEventListener 'input', function e { let value = this.value; // 1. 只保留数字 value = value.replace / ^\\d /g, '' ; // 2. 确保以1开头 if value.length > 0 && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 3. 第二位必须是3-9 if value.length >= 2 { const secondDigit = value 1 ; if !/ 3-9 /.test secondDigit { value = value 0 + value.substring 2 ; } } // 4. 限制长度为11位 if value.length > 11 { value = value.substring 0, 11 ; } this.value = value; } ; </script> </body> </html> 方法2：正则表达式验证 javascript / 验证中国手机号码 @param {string} phone - 手机号码 @returns {boolean} - 是否为有效手机号码 / function validatePhone phone { // 移除所有空格和横线 phone = phone.replace / \\s- /g, '' ; // 正则表达式：1开头，第二位3-9，后面9位数字 const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test phone ; } // 验证示例 console.log validatePhone '13812345678' ; // true console.log validatePhone '138 1234 5678' ; // true console.log validatePhone '138-1234-5678' ; // true console.log validatePhone '12812345678' ; // false 第二位不是3-9 console.log validatePhone '1381234567' ; // false 不足11位 console.log validatePhone '138123456789' ; // false 超过11位 Vue 版本 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>Vue 手机号码输入限制</title> <script src=\"https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js\"></script> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; outline: none; } .input-box:focus { border-color: 409eff; } .valid { border-color: 67c23a; } .invalid { border-color: f56c6c; } </style> </head> <body> <div id=\"app\"> <input v-model=\"phone\" placeholder=\"请输入手机号码\" class=\"input-box\" :class=\"{ valid: isValid, invalid: phone && !isValid }\" @input=\"handleInput\" > <div v-if=\"phone\" class=\"validation-message\"> <span v-if=\"isValid\" style=\"color: 67c23a;\">✓ 格式正确</span> <span v-else style=\"color: f56c6c;\">✗ 请输入有效的手机号码</span> </div> </div> <script> new Vue { el: ' app', data: { phone: '' }, computed: { isValid { const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test this.phone ; } }, methods: { handleInput { let value = this.phone; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 this.phone = value.substring 0, 11 ; } } } ; </script> </body> </html> React 版本 jsx import { useState, useEffect } from 'react'; function PhoneInput { const phone, setPhone = useState '' ; const isValid = /^1 3-9 \\d{9}$/.test phone ; const handleInput = e => { let value = e.target.value; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 setPhone value.substring 0, 11 ; }; return <div> <input type=\"tel\" value={phone} onChange={handleInput} placeholder=\"请输入手机号码\" style={{ width: '300px', padding: '12px', fontSize: '16px', border: 1px solid ${isValid ? ' 67c23a' : phone ? ' f56c6c' : ' ddd'} , borderRadius: '4px', outline: 'none' }} /> {phone && <div style={{ marginTop: '8px', color: isValid ? ' 67c23a' : ' f56c6c' }}> {isValid ? '✓ 格式正确' : '✗ 请输入有效的手机号码'} </div> } </div> ; } export default PhoneInput; 常用工具函数 1. 手机号码格式化 javascript / 格式化手机号码（添加空格分隔） @param {string} phone - 手机号码 @returns {string} - 格式化后的号码 / function formatPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length <= 3 return phone; if phone.length <= 7 return phone.substring 0, 3 + ' ' + phone.substring 3 ; return phone.substring 0, 3 + ' ' + phone.substring 3, 7 + ' ' + phone.substring 7 ; } console.log formatPhone '13812345678' ; // \"138 1234 5678\" 2. 手机号码脱敏 javascript / 手机号码脱敏（中间4位用 代替） @param {string} phone - 手机号码 @returns {string} - 脱敏后的号码 / function maskPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length >= 11 { return phone.substring 0, 3 + ' ' + phone.substring 7 ; } return phone; } console.log maskPhone '13812345678' ; // \"138 5678\" 3. 完整验证工具 javascript / 手机号码验证工具 / const PhoneValidator = { // 验证手机号码 validate phone { const cleanPhone = phone.replace / \\s- /g, '' ; return /^1 3-9 \\d{9}$/.test cleanPhone ; }, // 获取号码类型 getType phone { const cleanPhone = phone.replace / \\s- /g, '' ; if !this.validate cleanPhone return '无效号码'; const prefix = cleanPhone.substring 0, 3 ; const types = { '130': '联通', '131': '联通', '132': '联通', '145': '联通', '146': '联通', '155': '联通', '156': '联通', '166': '联通', '175': '联通', '176': '联通', '185': '联通', '186': '联通', '133': '电信', '149': '电信', '153': '电信', '173': '电信', '177': '电信', '180': '电信', '181': '电信', '189': '电信', '199': '电信', '134': '移动', '135': '移动', '136': '移动', '137': '移动', '138': '移动', '139': '移动', '147': '移动', '150': '移动', '151': '移动', '152': '移动', '157': '移动', '158': '移动', '159': '移动', '178': '移动', '182': '移动', '183': '移动', '184': '移动', '187': '移动', '188': '移动', '198': '移动' }; return types prefix || '未知运营商'; }, // 格式化号码 format phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length <= 3 return cleanPhone; if cleanPhone.length <= 7 return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3 ; return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3, 7 + ' ' + cleanPhone.substring 7 ; }, // 脱敏号码 mask phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length >= 11 { return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 7 ; } return cleanPhone; } }; // 使用示例 console.log PhoneValidator.validate '13812345678' ; // true console.log PhoneValidator.getType '13812345678' ; // \"移动\" console.log PhoneValidator.format '13812345678' ; // \"138 1234 5678\" console.log PhoneValidator.mask '13812345678' ; // \"138 5678\" 常见问题 Q1: 为什么要限制第二位必须是3-9？ A: 根据中国工信部的规定，手机号码的第二位代表号段类型： - 13x ：传统号段 - 14x ：物联网/数据卡 - 15x ：传统号段 - 16x ：新号段 - 17x ：数据卡/虚拟运营商 - 18x ：3G/4G号段 - 19x ：5G号段 10 和 11 开头的号码不是普通手机号码。 Q2: 是否需要考虑国际区号？ A: 如果需要支持国际号码，可以修改正则表达式： javascript // 支持带+86或86前缀的号码 const phoneRegex = /^ ?:\\+?86 ?1 3-9 \\d{9}$/; Q3: 为什么不直接使用 input 的 type=\"tel\"？ A: type=\"tel\" 主要是在移动端唤起数字键盘，本身不包含验证逻辑，仍需要 JavaScript 进行验证。 Q4: 如何防止用户粘贴无效内容？ A: 添加粘贴事件处理： javascript phoneInput.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; const cleanText = text.replace / ^\\d /g, '' ; document.execCommand 'insertText', false, cleanText.substring 0, 11 ; } ; 总结 手机号码验证需要注意以下几点： - ✅ 实时过滤 ：只允许输入数字 - ✅ 格式验证 ：确保符合中国手机号规则 - ✅ 用户反馈 ：及时显示验证结果 - ✅ 格式化显示 ：提高可读性 - ✅ 脱敏处理 ：保护用户隐私 合理的手机号码验证可以提升用户体验，减少错误输入！",
    "sections": [
      {
        "title": "中国手机号码规则",
        "anchor": "#中国手机号码规则",
        "id": "中国手机号码规则"
      },
      {
        "title": "纯 JavaScript 实现",
        "anchor": "#纯-javascript-实现",
        "id": "纯-javascript-实现"
      },
      {
        "title": "方法1：输入实时过滤",
        "anchor": "#方法1-输入实时过滤",
        "id": "方法1-输入实时过滤"
      },
      {
        "title": "方法2：正则表达式验证",
        "anchor": "#方法2-正则表达式验证",
        "id": "方法2-正则表达式验证"
      },
      {
        "title": "Vue 版本",
        "anchor": "#vue-版本",
        "id": "vue-版本"
      },
      {
        "title": "React 版本",
        "anchor": "#react-版本",
        "id": "react-版本"
      },
      {
        "title": "常用工具函数",
        "anchor": "#常用工具函数",
        "id": "常用工具函数"
      },
      {
        "title": "1. 手机号码格式化",
        "anchor": "#1-手机号码格式化",
        "id": "1-手机号码格式化"
      },
      {
        "title": "2. 手机号码脱敏",
        "anchor": "#2-手机号码脱敏",
        "id": "2-手机号码脱敏"
      },
      {
        "title": "3. 完整验证工具",
        "anchor": "#3-完整验证工具",
        "id": "3-完整验证工具"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "Q1: 为什么要限制第二位必须是3-9？",
        "anchor": "#q1-为什么要限制第二位必须是3-9",
        "id": "q1-为什么要限制第二位必须是3-9"
      },
      {
        "title": "Q2: 是否需要考虑国际区号？",
        "anchor": "#q2-是否需要考虑国际区号",
        "id": "q2-是否需要考虑国际区号"
      },
      {
        "title": "Q3: 为什么不直接使用 input 的 type=\"tel\"？",
        "anchor": "#q3-为什么不直接使用-input-的-type-tel",
        "id": "q3-为什么不直接使用-input-的-type-tel"
      },
      {
        "title": "Q4: 如何防止用户粘贴无效内容？",
        "anchor": "#q4-如何防止用户粘贴无效内容",
        "id": "q4-如何防止用户粘贴无效内容"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "textarea-auto-height-8ea2",
    "type": "post",
    "title": "使用 contenteditable 与 div 完美模拟 Textarea 高度自适应效果",
    "url": "posts/textarea-auto-height-8ea2.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-04-08",
    "tags": [
      "前端开发",
      "CSS",
      "DOM操作",
      "富文本"
    ],
    "summary": "解决传统 textarea 滚动条闪烁与高度伸缩卡顿问题，通过 contenteditable 与 CSS 构建丝滑自适应输入框。",
    "content": "模拟 textarea 效果高度自适应 核心原理 使用 contenteditable 属性将普通元素设置为可编辑状态，配合 CSS 实现高度自适应效果。 contenteditable 属性说明 html <!-- contenteditable 属性指定元素内容是否可编辑 --> <div contenteditable=\"true\">可编辑的 div</div> <div contenteditable=\"false\">不可编辑的 div</div> <div>继承父元素的编辑状态</div> 注意 ：当元素中没有设置 contenteditable 属性时，元素将从父元素继承编辑状态。 完整实现示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模拟 textarea 高度自适应</title> <style> { margin: 0; padding: 0; box-sizing: border-box; } body { padding: 50px; font-family: Arial, sans-serif; } / 模拟 textarea 的容器样式 / .simulation-textarea { width: 500px; min-height: 20px; max-height: 300px; margin: 20px auto; padding: 10px; border: 1px solid a0b3d6; border-radius: 5px; font-size: 12px; line-height: 24px; outline: none; word-wrap: break-word; overflow-x: hidden; overflow-y: auto; border-color: rgba 82, 168, 236, 0.8 ; transition: border-color 0.3s; } / 聚焦时的边框效果 / .simulation-textarea:focus { border-color: 66afe9; box-shadow: 0 0 8px rgba 102, 175, 233, 0.6 ; } / 空状态提示 / .simulation-textarea:empty:before { content: attr data-placeholder ; color: 999; } / 自定义滚动条样式 / .simulation-textarea::-webkit-scrollbar { width: 5px; height: 5px; } .simulation-textarea::-webkit-scrollbar-track { background: rgb 239, 239, 239 ; border-radius: 2px; } .simulation-textarea::-webkit-scrollbar-thumb { border-radius: 5px; background: bfbfbf; } .simulation-textarea::-webkit-scrollbar-thumb:hover { background: 999; } / Firefox 滚动条样式 / .simulation-textarea { scrollbar-width: thin; scrollbar-color: bfbfbf rgb 239, 239, 239 ; } </style> </head> <body> <h2>模拟 textarea 高度自适应</h2> <!-- 基础版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容...\"></div> <!-- 带焦点事件监听的版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容（带焦点事件）...\" tabindex=\"0\" onfocus=\"handleFocus \" onblur=\"handleBlur \"> </div> <script> // 焦点获取事件 function handleFocus { console.log '元素获得焦点' ; // 可以在这里添加聚焦时的逻辑 } // 焦点失去事件 function handleBlur { console.log '元素失去焦点' ; // 可以在这里添加失焦时的逻辑 } // 获取和设置内容的示例 const editableDiv = document.querySelector '.simulation-textarea' ; // 获取内容 function getContent { return editableDiv.innerHTML; // 获取 HTML 格式内容 // return editableDiv.innerText; // 获取纯文本内容 } // 设置内容 function setContent htmlContent { editableDiv.innerHTML = htmlContent; } // 清空内容 function clearContent { editableDiv.innerHTML = ''; } </script> </body> </html> 高级功能扩展 1. 字符数限制 javascript // 添加字符数限制 const editableDiv = document.querySelector '.simulation-textarea' ; const maxLength = 500; editableDiv.addEventListener 'input', function e { const currentLength = this.innerText.length; if currentLength > maxLength { // 截断超出部分 const text = this.innerText.substring 0, maxLength ; this.innerHTML = text; console.log 已达到最大字符数限制：${maxLength} ; } } ; 2. 内容变化监听 javascript // 监听内容变化 const editableDiv = document.querySelector '.simulation-textarea' ; editableDiv.addEventListener 'input', function e { console.log '内容发生变化：', this.innerText ; // 可以在这里添加自动保存等功能 } ; editableDiv.addEventListener 'paste', function e { // 处理粘贴事件 e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; document.execCommand 'insertText', false, text ; } ; 3. 防止粘贴 HTML 标签 javascript // 只允许粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 注意事项 1. 安全性考虑 javascript // 防止 XSS 攻击的简单示例 function sanitizeHTML str { const temp = document.createElement 'div' ; temp.textContent = str; return temp.innerHTML; } // 在设置内容时使用 function setContentSafe htmlContent { editableDiv.innerHTML = sanitizeHTML htmlContent ; } 2. 浏览器兼容性 - contenteditable 属性在所有现代浏览器中都支持 - IE9+ 完全支持 - 移动端浏览器支持良好 3. 常见问题 问题1：内容为空时高度塌陷 css / 解决方案：设置最小高度 / .simulation-textarea { min-height: 20px; } 问题2：粘贴内容格式混乱 javascript // 解决方案：只粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 问题3：无法获取焦点 html <!-- 解决方案：添加 tabindex 属性 --> <div contenteditable=\"true\" tabindex=\"0\"></div> 与原生 textarea 的对比 | 特性 | contenteditable div | 原生 textarea | |------|-------------------|--------------| | 高度自适应 | ✅ 自动适应 | ❌ 需要手动调整 | | 富文本支持 | ✅ 支持 HTML | ❌ 只支持纯文本 | | 自定义样式 | ✅ 完全自定义 | ⚠️ 有限制 | | 表单提交 | ❌ 需要手动处理 | ✅ 自动提交 | | 性能 | ⚠️ 稍差 | ✅ 更好 | | 兼容性 | ✅ 良好 | ✅ 完美 | 实际应用场景 1. 评论输入框 ：需要高度自适应的评论区域 2. 富文本编辑器 ：需要支持 HTML 内容的编辑器 3. 即时通讯 ：聊天输入框 4. 表单备注 ：需要自适应高度的备注输入 总结 使用 contenteditable 属性模拟 textarea 是实现高度自适应的有效方案，具有以下优势： - ✅ 自动适应内容高度 - ✅ 支持富文本内容 - ✅ 完全自定义样式 - ✅ 良好的浏览器兼容性 但需要注意安全性和表单处理等细节问题。",
    "sections": [
      {
        "title": "核心原理",
        "anchor": "#核心原理",
        "id": "核心原理"
      },
      {
        "title": "contenteditable 属性说明",
        "anchor": "#contenteditable-属性说明",
        "id": "contenteditable-属性说明"
      },
      {
        "title": "完整实现示例",
        "anchor": "#完整实现示例",
        "id": "完整实现示例"
      },
      {
        "title": "高级功能扩展",
        "anchor": "#高级功能扩展",
        "id": "高级功能扩展"
      },
      {
        "title": "1. 字符数限制",
        "anchor": "#1-字符数限制",
        "id": "1-字符数限制"
      },
      {
        "title": "2. 内容变化监听",
        "anchor": "#2-内容变化监听",
        "id": "2-内容变化监听"
      },
      {
        "title": "3. 防止粘贴 HTML 标签",
        "anchor": "#3-防止粘贴-html-标签",
        "id": "3-防止粘贴-html-标签"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 安全性考虑",
        "anchor": "#1-安全性考虑",
        "id": "1-安全性考虑"
      },
      {
        "title": "2. 浏览器兼容性",
        "anchor": "#2-浏览器兼容性",
        "id": "2-浏览器兼容性"
      },
      {
        "title": "3. 常见问题",
        "anchor": "#3-常见问题",
        "id": "3-常见问题"
      },
      {
        "title": "与原生 textarea 的对比",
        "anchor": "#与原生-textarea-的对比",
        "id": "与原生-textarea-的对比"
      },
      {
        "title": "实际应用场景",
        "anchor": "#实际应用场景",
        "id": "实际应用场景"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "wx-async-promise-806e",
    "type": "post",
    "title": "微信小程序将异步 API 封装为 Promise 同步调用（async/await）实战",
    "url": "posts/wx-async-promise-806e.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-03-25",
    "tags": [
      "前端开发",
      "微信小程序",
      "JavaScript",
      "Promise"
    ],
    "summary": "利用 Promisify 模式批量将 wx.request、wx.showModal 等回调式 API 转为标准的 async/await 同步写法。",
    "content": "微信小程序将异步 API 改成同步处理方法 在微信小程序开发中，异步 API 是常态，但有时我们需要同步的代码风格来处理业务逻辑。本文介绍几种常用的异步转同步方案。 方案一：Promise 封装 + async/await（推荐） javascript Page { data: { userInfo: null, token: '' }, onLoad { this.initUserInfo ; }, / 统一封装 wx.request 为 Promise @param {Object} options - 请求配置 @returns {Promise} / request options { return new Promise resolve, reject => { wx.request { ...options, success: res => { // 统一处理业务错误 if res.data && res.data.code !== 0 { reject new Error res.data.message || '请求失败' ; } else { resolve res.data ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; }, / 封装 wx.login 为 Promise @returns {Promise<string>} - 返回 code / login { return new Promise resolve, reject => { wx.login { success: res => { if res.code { resolve res.code ; } else { reject new Error '登录失败' ; } }, fail: err => { reject new Error err.errMsg || '登录失败' ; } } ; } ; }, / 同步风格的用户信息初始化 / async initUserInfo { try { // 1. 获取账号信息 const accountInfo = wx.getAccountInfoSync ; const appId = accountInfo.miniProgram.appId; // 2. 登录获取 code const code = await this.login ; console.log '获取 code 成功:', code ; // 3. 登录请求 const loginResult = await this.request { url: 'https://api.example.com/login', method: 'POST', data: { js_code: code, appid: appId } } ; console.log '登录成功:', loginResult ; // 4. 获取用户信息 const userInfoResult = await this.request { url: 'https://api.example.com/user/info', method: 'POST', data: { openId: loginResult.openId, sessionKey: loginResult.sessionKey } } ; console.log '获取用户信息成功:', userInfoResult ; // 5. 更新页面数据 this.setData { userInfo: userInfoResult, token: loginResult.token } ; } catch error { console.error '初始化用户信息失败:', error.message ; // 可以在这里添加错误处理，如显示错误提示 wx.showToast { title: '登录失败', icon: 'none' } ; } } } ; --- ✨ 进阶方案：统一 API 管理 创建统一的 API 管理文件 javascript // utils/api.js class ApiService { constructor { this.baseUrl = 'https://api.example.com'; this.token = ''; } / 设置 token / setToken token { this.token = token; } / 请求拦截器 / async request options { // 添加公共参数 const headers = { 'Content-Type': 'application/json', ... this.token && { 'Authorization': Bearer ${this.token} } }; return new Promise resolve, reject => { wx.request { url: this.baseUrl + options.url, method: options.method || 'GET', data: options.data || {}, headers, success: res => { if res.statusCode === 200 { if res.data.code === 0 { resolve res.data.data ; } else if res.data.code === 401 { // token 失效，重新登录 reject new Error '登录已过期，请重新登录' ; } else { reject new Error res.data.message || '请求失败' ; } } else { reject new Error HTTP 错误: ${res.statusCode} ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; } / 登录接口 / async login code, appId { return await this.request { url: '/login', method: 'POST', data: { js_code: code, appid: appId } } ; } / 获取用户信息 / async getUserInfo openId { return await this.request { url: '/user/info', method: 'POST', data: { openId } } ; } / 获取商品列表 / async getGoodsList params { return await this.request { url: '/goods/list', method: 'GET', data: params } ; } } // 导出单例 export default new ApiService ; 在页面中使用 javascript // pages/index/index.js import api from '../../utils/api.js'; Page { data: { goods: }, async onLoad { await this.init ; }, async init { try { // 1. 登录 const code = await this.getLoginCode ; const loginResult = await api.login code, 'your-app-id' ; // 2. 设置 token api.setToken loginResult.token ; // 3. 获取数据 const goods = await api.getGoodsList { page: 1, size: 10 } ; // 4. 更新视图 this.setData { goods } ; } catch error { console.error '初始化失败:', error.message ; wx.showToast { title: '加载失败', icon: 'none' } ; } }, getLoginCode { return new Promise resolve, reject => { wx.login { success: res => resolve res.code , fail: err => reject err } ; } ; } } ; --- 🛠️ 常用异步 API Promise 封装 javascript // utils/promise.js const promisify = fn => { return ...args => { return new Promise resolve, reject => { fn { ...args 0 , success: resolve, fail: reject } ; } ; }; }; // 封装常用 API export const login = promisify wx.login ; export const getUserInfo = promisify wx.getUserInfo ; export const request = promisify wx.request ; export const showToast = promisify wx.showToast ; export const showLoading = promisify wx.showLoading ; export const hideLoading = promisify wx.hideLoading ; export const navigateTo = promisify wx.navigateTo ; export const switchTab = promisify wx.switchTab ; 使用示例 javascript import { login, request, showLoading, hideLoading } from '../../utils/promise.js'; async function fetchData { try { await showLoading { title: '加载中...' } ; const { code } = await login ; const result = await request { url: 'https://api.example.com/data', method: 'POST', data: { code } } ; await hideLoading ; return result; } catch error { await hideLoading ; throw error; } } --- 📊 方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | 基础 Promise 封装 | 简单直观 | 代码重复 | 小型项目、快速开发 | | 统一 API 管理 | 易于维护、统一处理 | 需要额外配置 | 中大型项目 | | promisify 工具函数 | 通用、简洁 | 缺少个性化处理 | 需要频繁封装多个 API | --- ⚠️ 注意事项 1. 错误处理必须要有 javascript // 错误做法 ❌ async function badExample { const data = await api.request ; // 如果失败会直接抛出异常 console.log data ; } // 正确做法 ✅ async function goodExample { try { const data = await api.request ; console.log data ; } catch error { console.error '请求失败:', error ; // 显示错误提示 wx.showToast { title: '请求失败', icon: 'none' } ; } } 2. await 必须在 async 函数中使用 javascript // 错误 ❌ Page { onLoad { await this.fetchData ; // 错误：onLoad 不是 async 函数 } } ; // 正确 ✅ Page { async onLoad { await this.fetchData ; }, async fetchData { // ... } } ; 3. 不要滥用同步写法 javascript // 不推荐 ❌ - 串行请求，性能差 async function badRequest { const a = await api.get '/a' ; const b = await api.get '/b' ; const c = await api.get '/c' ; } // 推荐 ✅ - 并行请求，性能更好 async function goodRequest { const a, b, c = await Promise.all api.get '/a' , api.get '/b' , api.get '/c' ; } 4. 小程序兼容性 | 特性 | 支持版本 | 说明 | |------|---------|------| | async/await | 基础库 2.10.2+ | 需要在开发者工具中开启 ES6 转 ES5 | | Promise.all | 基础库 1.5.0+ | 支持 | | Promise.race | 基础库 1.5.0+ | 支持 | --- 📝 总结 异步转同步的核心是 Promise + async/await ： 1. 封装 ：将 wx API 封装为 Promise 2. 调用 ：使用 async/await 实现同步风格 3. 处理 ：使用 try-catch 捕获错误 4. 优化 ：合理使用 Promise.all 提升性能 这种方式既保持了异步的性能优势，又拥有同步代码的可读性。",
    "sections": [
      {
        "title": "方案一：Promise 封装 + async/await（推荐）",
        "anchor": "#方案一-promise-封装-async-await-推荐",
        "id": "方案一-promise-封装-async-await-推荐"
      },
      {
        "title": "✨ 进阶方案：统一 API 管理",
        "anchor": "#进阶方案-统一-api-管理",
        "id": "进阶方案-统一-api-管理"
      },
      {
        "title": "创建统一的 API 管理文件",
        "anchor": "#创建统一的-api-管理文件",
        "id": "创建统一的-api-管理文件"
      },
      {
        "title": "在页面中使用",
        "anchor": "#在页面中使用",
        "id": "在页面中使用"
      },
      {
        "title": "🛠️ 常用异步 API Promise 封装",
        "anchor": "#常用异步-api-promise-封装",
        "id": "常用异步-api-promise-封装"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "📊 方案对比",
        "anchor": "#方案对比",
        "id": "方案对比"
      },
      {
        "title": "⚠️ 注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 错误处理必须要有",
        "anchor": "#1-错误处理必须要有",
        "id": "1-错误处理必须要有"
      },
      {
        "title": "2. await 必须在 async 函数中使用",
        "anchor": "#2-await-必须在-async-函数中使用",
        "id": "2-await-必须在-async-函数中使用"
      },
      {
        "title": "3. 不要滥用同步写法",
        "anchor": "#3-不要滥用同步写法",
        "id": "3-不要滥用同步写法"
      },
      {
        "title": "4. 小程序兼容性",
        "anchor": "#4-小程序兼容性",
        "id": "4-小程序兼容性"
      },
      {
        "title": "📝 总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "wx-property-watch-0b0e",
    "type": "post",
    "title": "微信小程序自定义组件监听 properties 属性变化的优雅实现",
    "url": "posts/wx-property-watch-0b0e.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2026-03-18",
    "tags": [
      "前端开发",
      "微信小程序",
      "组件通信",
      "响应式"
    ],
    "summary": "详解小程序 Component 中的 observer 监听机制，以及在 Page 页面中通过 Object.defineProperty 实现 Watch 监听。",
    "content": "微信小程序监听属性变化方法 在 Vue.js 中可以使用 watch 监听属性变化，在微信小程序中也有多种方式实现类似功能。本文介绍几种常用的监听方案。 方案一：使用 Object.defineProperty（基础版） 原理说明 通过 Object.defineProperty 拦截对象属性的 set 方法，当属性值变化时自动触发回调函数。 实现代码 第一步：在 app.js 中定义监听器 javascript // app.js App { / 监听对象属性变化 @param {Object} obj - 要监听的对象 @param {Object} watchMap - 监听配置 { key: callback } / watch obj, watchMap { for const key in watchMap { this.observe obj, key, obj key , watchMap key ; } }, / 观察单个属性 @param {Object} data - 对象 @param {string} key - 属性名 @param {any} val - 初始值 @param {Function} fn - 回调函数 / observe data, key, val, fn { Object.defineProperty data, key, { configurable: true, enumerable: true, get { return val; }, set newVal { // 深度比较，避免相同值触发回调 if JSON.stringify newVal === JSON.stringify val { return; } const oldVal = val; val = newVal; fn && fn newVal, oldVal ; } } ; } } ; 第二步：在页面中使用 javascript // pages/index/index.js Page { data: { userInfo: { name: '张三', age: 28 }, counter: 0 }, onLoad { // 监听 userInfo.name 属性 getApp .watch this.data.userInfo, { name: newVal, oldVal => { console.log 姓名从 ${oldVal} 变为 ${newVal} ; // 可以在这里执行响应逻辑 } } ; // 监听 counter 属性 getApp .watch this.data, { counter: newVal, oldVal => { console.log 计数器从 ${oldVal} 变为 ${newVal} ; } } ; }, // 修改属性的方法 changeName { // 注意：直接修改属性会触发监听 this.data.userInfo.name = '李四'; // 如果使用 setData，需要注意数据同步 this.setData { 'userInfo.name': '李四' } ; }, increment { this.data.counter++; this.setData { counter: this.data.counter } ; } } ; --- 方案二：使用 setData 包装器（推荐） 原理说明 通过包装 setData 方法，在数据更新前后触发回调函数。这种方式更符合小程序的设计规范。 实现代码 在 app.js 中定义增强方法 javascript // app.js App { / 增强 Page 构造器，添加 watch 能力 @param {Object} options - Page 配置对象 / enhancePage options { const { watch = {}, ...rest } = options; // 保存原始的 setData const originalSetData = rest.setData; rest.setData = function data, callback { // 执行原始 setData originalSetData && originalSetData.call this, data, callback ; // 检查是否有需要监听的属性变化 for const key in watch { // 检查 data 中是否包含监听的属性 if data.hasOwnProperty key { // 获取旧值 const oldVal = this.data key ; const newVal = data key ; // 如果值发生变化，触发回调 if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; return Page rest ; } } ; 在页面中使用 javascript // pages/index/index.js getApp .enhancePage { data: { count: 0, message: 'Hello' }, // 监听配置 watch: { count newVal, oldVal { console.log count 变化: ${oldVal} -> ${newVal} ; // 可以在这里执行副作用 this.updateTitle ; }, message newVal, oldVal { console.log message 变化: ${oldVal} -> ${newVal} ; } }, onLoad { // 初始化 this.setData { count: 1 } ; }, updateTitle { wx.setNavigationBarTitle { title: 计数: ${this.data.count} } ; }, handleClick { this.setData { count: this.data.count + 1 } ; } } ; --- 方案三：使用 Behavior 混入（组件化方案） 原理说明 利用小程序的 Behavior 机制，将监听能力封装为可复用的模块。 实现代码 创建 watch Behavior javascript // behaviors/watch.js module.exports = Behavior { lifetimes: { attached { // 获取组件配置的 watch 对象 const watch = this.$watch || {}; // 包装 setData const originalSetData = this.setData.bind this ; this.setData = data, callback => { // 记录旧值 const oldData = {}; for const key in data { if watch key { oldData key = this.data key ; } } // 执行原始 setData originalSetData data, callback ; // 触发监听回调 for const key in watch { if data.hasOwnProperty key { const newVal = data key ; const oldVal = oldData key ; if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; } } } ; 在组件中使用 javascript // components/custom-component/custom-component.js const watchBehavior = require '../../behaviors/watch.js' ; Component { behaviors: watchBehavior , data: { value: '', isValid: false }, // 监听配置 $watch: { value newVal, oldVal { console.log value 变化: ${oldVal} -> ${newVal} ; this.validateValue newVal ; } }, methods: { validateValue value { const isValid = value.length >= 6; this.setData { isValid } ; }, handleInput e { this.setData { value: e.detail.value } ; } } } ; --- 方案四：使用 computed 计算属性（简洁版） 原理说明 虽然小程序没有原生 computed，但可以通过 setData 时手动更新计算属性。 实现代码 javascript // pages/index/index.js Page { data: { firstName: '张', lastName: '三', fullName: '张三' // 计算属性 }, onLoad { // 初始化计算属性 this.updateFullName ; }, // 计算属性更新方法 updateFullName { const { firstName, lastName } = this.data; const fullName = ${firstName}${lastName} ; if fullName !== this.data.fullName { this.setData { fullName } ; // 可以在这里添加监听逻辑 this.onFullNameChange fullName ; } }, // 监听回调 onFullNameChange newVal { console.log 全名变为: ${newVal} ; }, // 修改属性时同步更新计算属性 setFirstName name { this.setData { firstName: name } ; this.updateFullName ; }, setLastName name { this.setData { lastName: name } ; this.updateFullName ; } } ; --- 各方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | Object.defineProperty | 原生API，轻量 | 不支持 setData 自动同步 | 简单数据监听 | | setData 包装器 | 符合小程序规范 | 需要修改 Page 构造 | 页面级监听 | | Behavior 混入 | 可复用，组件化 | 稍复杂 | 组件通用能力 | | computed 模拟 | 简单直观 | 需要手动维护 | 计算属性场景 | --- 使用建议 1. 页面级监听 推荐使用 方案二（setData 包装器） ，符合小程序设计规范，代码清晰。 2. 组件级监听 推荐使用 方案三（Behavior 混入） ，便于复用和维护。 3. 简单场景 使用 方案四（computed 模拟） ，代码最简单直观。 --- 注意事项 1. 性能考虑 - 避免在监听回调中频繁调用 setData ，可能导致循环更新 - 对于复杂对象，考虑使用浅比较代替 JSON.stringify 2. 数据同步 - 使用 Object.defineProperty 时，直接修改属性会触发监听，但不会触发小程序的响应式更新 - 建议始终使用 setData 更新数据 3. 生命周期 - Behavior 的 attached 生命周期在页面/组件挂载后执行 - 确保在 attached 之后使用增强的 setData 4. 深度监听 本文实现的是单层监听，如果需要监听嵌套对象的变化，可以扩展为深度监听： javascript // 深度监听示例 function deepWatch obj, watchMap, parentKey = '' { for const key in obj { const fullKey = parentKey ? ${parentKey}.${key} : key; if typeof obj key === 'object' && obj key !== null { deepWatch obj key , watchMap, fullKey ; } if watchMap fullKey { // 对每个属性设置监听 observe obj, key, obj key , watchMap fullKey ; } } } --- 总结 微信小程序中监听属性变化的核心思路： - ✅ 使用 Object.defineProperty 拦截属性 - ✅ 包装 setData 实现响应式监听 - ✅ 使用 Behavior 实现组件化复用 - ✅ 模拟 computed 实现计算属性 根据项目复杂度选择合适的方案，推荐优先使用 setData 包装器 或 Behavior 混入 方案。",
    "sections": [
      {
        "title": "方案一：使用 Object.defineProperty（基础版）",
        "anchor": "#方案一-使用-object-defineproperty-基础版",
        "id": "方案一-使用-object-defineproperty-基础版"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案二：使用 setData 包装器（推荐）",
        "anchor": "#方案二-使用-setdata-包装器-推荐",
        "id": "方案二-使用-setdata-包装器-推荐"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案三：使用 Behavior 混入（组件化方案）",
        "anchor": "#方案三-使用-behavior-混入-组件化方案",
        "id": "方案三-使用-behavior-混入-组件化方案"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案四：使用 computed 计算属性（简洁版）",
        "anchor": "#方案四-使用-computed-计算属性-简洁版",
        "id": "方案四-使用-computed-计算属性-简洁版"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "各方案对比",
        "anchor": "#各方案对比",
        "id": "各方案对比"
      },
      {
        "title": "使用建议",
        "anchor": "#使用建议",
        "id": "使用建议"
      },
      {
        "title": "1. 页面级监听",
        "anchor": "#1-页面级监听",
        "id": "1-页面级监听"
      },
      {
        "title": "2. 组件级监听",
        "anchor": "#2-组件级监听",
        "id": "2-组件级监听"
      },
      {
        "title": "3. 简单场景",
        "anchor": "#3-简单场景",
        "id": "3-简单场景"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 性能考虑",
        "anchor": "#1-性能考虑",
        "id": "1-性能考虑"
      },
      {
        "title": "2. 数据同步",
        "anchor": "#2-数据同步",
        "id": "2-数据同步"
      },
      {
        "title": "3. 生命周期",
        "anchor": "#3-生命周期",
        "id": "3-生命周期"
      },
      {
        "title": "4. 深度监听",
        "anchor": "#4-深度监听",
        "id": "4-深度监听"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "vscode-regex-replace-df0f",
    "type": "post",
    "title": "VSCode 前端开发高频实用正则表达式查找与批量替换清单",
    "url": "posts/vscode-regex-replace-df0f.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2022-03-20",
    "tags": [
      "VSCode",
      "正则表达式",
      "Vue",
      "前端技巧"
    ],
    "summary": "精选 VSCode 全局重构高频正则：快速批量将 v-model 改为 v-model.trim、清理行尾空格及修正多余空行。",
    "content": "VSCode 前端开发高频实用正则表达式查找与批量替换清单 一、快捷操作指南 在 VSCode 中按下快捷键 Ctrl + Shift + F （全局搜索）或 Ctrl + Shift + H （全局替换），点击 . 开启正则表达式支持。 --- 二、高频常用正则匹配清单 1. 将所有 v-model 批量替换为 v-model.trim - 查找正则 （匹配带或不带空格的 v-model= ）： code v-model \\s+ ?= - 替换为 ： code v-model.trim= --- 2. 删除代码中所有的 console.log 调试输出 - 查找正则 （匹配整行 console.log）： code console\\.log\\ . \\ |; $ - 替换为 ： （留空） --- 3. 清除所有代码行尾的多余空格与 Tab - 查找正则 ： code \\t +$ - 替换为 ： （留空） --- 4. 压缩多个连续空行为单个空行 - 查找正则 ： code ^\\s \\r?\\n {2,} - 替换为 ： code \\n",
    "sections": [
      {
        "title": "一、快捷操作指南",
        "anchor": "#一-快捷操作指南",
        "id": "一-快捷操作指南"
      },
      {
        "title": "二、高频常用正则匹配清单",
        "anchor": "#二-高频常用正则匹配清单",
        "id": "二-高频常用正则匹配清单"
      },
      {
        "title": "1. 将所有 `v-model` 批量替换为 `v-model.trim`",
        "anchor": "#1-将所有-v-model-批量替换为-v-model-trim",
        "id": "1-将所有-v-model-批量替换为-v-model-trim"
      },
      {
        "title": "2. 删除代码中所有的 `console.log` 调试输出",
        "anchor": "#2-删除代码中所有的-console-log-调试输出",
        "id": "2-删除代码中所有的-console-log-调试输出"
      },
      {
        "title": "3. 清除所有代码行尾的多余空格与 Tab",
        "anchor": "#3-清除所有代码行尾的多余空格与-tab",
        "id": "3-清除所有代码行尾的多余空格与-tab"
      },
      {
        "title": "4. 压缩多个连续空行为单个空行",
        "anchor": "#4-压缩多个连续空行为单个空行",
        "id": "4-压缩多个连续空行为单个空行"
      }
    ]
  },
  {
    "id": "mask-sensitive-data-8698",
    "type": "post",
    "title": "JavaScript 身份证、手机号与敏感证件信息脱敏掩码处理",
    "url": "posts/mask-sensitive-data-8698.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2022-03-01",
    "tags": [
      "JavaScript",
      "数据脱敏",
      "信息安全",
      "工具函数"
    ],
    "summary": "前端数据展示安全规范：封装可自定义前置与后置保留位数的通用信息脱敏函数，将敏感数字快速替换为星号。",
    "content": "JavaScript 身份证、手机号与敏感证件信息脱敏掩码处理 一、业务安全规范 在前端界面展示用户身份证号（18位）、手机号（11位）或银行卡号时，严禁直接明文全量展示，必须对中间核心位进行星号（ ）掩码脱敏。 --- 二、通用脱敏处理函数 javascript / 字符串关键信息脱敏隐藏 @param {String} str 原始字符串（如手机号、身份证） @param {Number} frontLen 前面保留明文位数 @param {Number} endLen 后面保留明文位数 @returns {String} 脱敏后的字符串 / function maskSensitiveInfo str, frontLen = 3, endLen = 4 { if !str return ''; const text = String str ; const totalLen = text.length; if frontLen + endLen >= totalLen { return text; } const maskLen = totalLen - frontLen - endLen; const stars = ' '.repeat maskLen ; return text.substring 0, frontLen + stars + text.substring totalLen - endLen ; } // 常见脱敏调用示例： // 1. 手机号脱敏 前3后4: 138 8888 console.log maskSensitiveInfo '13812348888', 3, 4 ; // 2. 18位身份证脱敏 前6后4: 370602 1234 console.log maskSensitiveInfo '370602199801011234', 6, 4 ; // 3. 姓名脱敏 前1后0: 张 console.log maskSensitiveInfo '张三', 1, 0 ;",
    "sections": [
      {
        "title": "一、业务安全规范",
        "anchor": "#一-业务安全规范",
        "id": "一-业务安全规范"
      },
      {
        "title": "二、通用脱敏处理函数",
        "anchor": "#二-通用脱敏处理函数",
        "id": "二-通用脱敏处理函数"
      }
    ]
  },
  {
    "id": "calc-exact-age-de3e",
    "type": "post",
    "title": "JavaScript 根据出生年月日精准计算周岁年龄函数",
    "url": "posts/calc-exact-age-de3e.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2022-02-15",
    "tags": [
      "JavaScript",
      "年龄计算",
      "Date日期",
      "算法"
    ],
    "summary": "严谨处理跨年、同月同日及生日未过情况，通过年月日时间差精准计算用户的实际周岁年龄并进行格式校验。",
    "content": "JavaScript 根据出生年月日精准计算周岁年龄函数 一、实现思路 1. 解析传入的 YYYY-MM-DD 或 YYYY/MM/DD 日期字符串； 2. 计算当前年份与出生年份的差值； 3. 比对当前月份与生日月份（或同月下的日差），若今年生日未到，则周岁需要减 1。 --- 二、完整实现代码 javascript / 根据出生日期精准计算周岁年龄 @param {String} birthDate 出生日期 如 '1998-05-20' @returns {Number|String} 周岁年龄或错误提示 / function getExactAge birthDate { if !birthDate return '出生日期为空'; const parts = String birthDate .split / -/ / ; if parts.length < 3 return '日期格式不正确'; const birthYear = parseInt parts 0 , 10 ; const birthMonth = parseInt parts 1 , 10 ; const birthDay = parseInt parts 2 , 10 ; const now = new Date ; const currentYear = now.getFullYear ; const currentMonth = now.getMonth + 1; const currentDay = now.getDate ; let age = currentYear - birthYear; if age < 0 return '出生日期不能晚于今天'; // 生日月还未到，或生日月已到但生日还没过 if currentMonth < birthMonth || currentMonth === birthMonth && currentDay < birthDay { age--; } return age < 0 ? 0 : age; } // 调用示例 console.log getExactAge '1998-02-12' ; // 正确返回周岁 console.log getExactAge '2000/10/01' ; // 支持斜杠分隔",
    "sections": [
      {
        "title": "一、实现思路",
        "anchor": "#一-实现思路",
        "id": "一-实现思路"
      },
      {
        "title": "二、完整实现代码",
        "anchor": "#二-完整实现代码",
        "id": "二-完整实现代码"
      }
    ]
  },
  {
    "id": "calc-month-range-bd66",
    "type": "post",
    "title": "JavaScript 获取指定年份与月份的起始日期和结束日期",
    "url": "posts/calc-month-range-bd66.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2022-01-10",
    "tags": [
      "JavaScript",
      "Date日期",
      "前端工具函数",
      "时间处理"
    ],
    "summary": "利用 JavaScript Date 构造函数的第 0 天特性巧妙获取当月最后一天，高效返回准确的 YYYY-MM-01 与 YYYY-MM-DD。",
    "content": "JavaScript 获取指定年份与月份的起始日期和结束日期 一、核心原理 在 JavaScript 的 new Date year, month, 0 中，第三个参数传入 0 会自动获取到上一个月的最后一天。因此传入目标月份后，直接调用 getDate 即可精确获取当月的总天数（自动处理 28/29/30/31 天及闰年）。 --- 二、实现代码 javascript / 获取指定年月的首日与末日 @param {Number|String} year 年份 如 2022 @param {Number|String} month 月份 1-12 @returns {Object} 包含 startDate 与 endDate 的对象 / function getMonthStartEndDate year, month { const y = Number year ; const m = Number month ; // 巧妙获取该月总天数 const totalDays = new Date y, m, 0 .getDate ; const formatMonth = String m .padStart 2, '0' ; return { startDate: ${y}-${formatMonth}-01 , endDate: ${y}-${formatMonth}-${String totalDays .padStart 2, '0' } }; } // 调用示例 console.log getMonthStartEndDate 2022, 1 ; // 输出: { startDate: '2022-01-01', endDate: '2022-01-31' } console.log getMonthStartEndDate 2024, 2 ; // 闰年2月 // 输出: { startDate: '2024-02-01', endDate: '2024-02-29' }",
    "sections": [
      {
        "title": "一、核心原理",
        "anchor": "#一-核心原理",
        "id": "一-核心原理"
      },
      {
        "title": "二、实现代码",
        "anchor": "#二-实现代码",
        "id": "二-实现代码"
      }
    ]
  },
  {
    "id": "js-string-ellipsis-d4cf",
    "type": "post",
    "title": "JavaScript 字符串指定长度截断并自动追加省略号",
    "url": "posts/js-string-ellipsis-d4cf.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2022-01-05",
    "tags": [
      "JavaScript",
      "文本截断",
      "省略号",
      "前端工具函数"
    ],
    "summary": "纯 JavaScript 实现可自定义最大字符长度的文本截断函数，超出部分智能替换为 ... 省略号，支持严格边界保护。",
    "content": "JavaScript 字符串指定长度截断并自动追加省略号 一、实现代码 javascript / 字符串超出指定长度后自动追加省略号 @param {String} text 输入文本 @param {Number} maxLen 最大允许展示长度 -1 为不截断 @returns {String} 处理后的字符串 / function truncateWithEllipsis text, maxLen = 20 { if !text return ''; const str = String text ; const limit = Number maxLen ; if limit >= 0 && str.length > limit { return str.substring 0, limit + '...'; } return str; } // 调用示例 console.log truncateWithEllipsis '这是一篇关于Vue3组件设计的深度技术文章', 10 ; // 输出: '这是一篇关于Vue3...' console.log truncateWithEllipsis '短文本', 10 ; // 输出: '短文本'",
    "sections": [
      {
        "title": "一、实现代码",
        "anchor": "#一-实现代码",
        "id": "一-实现代码"
      }
    ]
  },
  {
    "id": "shell-github-release-8d73",
    "type": "post",
    "title": "Shell 脚本自动获取 GitHub 开源项目最新 Releases 版本号",
    "url": "posts/shell-github-release-8d73.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-12-01",
    "tags": [
      "Linux",
      "Shell",
      "GitHub",
      "自动化",
      "版本获取"
    ],
    "summary": "编写通用 Bash 脚本，自动通过正则解析 GitHub Releases 或通用开源软件下载页面的最新 Release Tag 版本号。",
    "content": "Shell 脚本自动获取 GitHub 开源项目最新 Releases 版本号 一、业务场景 在编写 Linux 自动化一键安装脚本（如自动安装最新版 Xray、frp 或 FFmpeg）时，需要动态抓取上游官方发布的最新版本号，避免每次版本更新都需要手动修改脚本硬编码。 --- 二、Shell 抓取脚本实现代码 bash !/usr/bin/env bash 获取 GitHub 仓库或指定软件的最新发布版本号 getLatestVersion { local targetUrl=\"$1\" local softwareName=\"$2\" if \"$targetUrl\" =~ \"github.com\" ; then 从 GitHub Releases 页面解析 tag wget --timeout=10 -qO- \"$targetUrl\" | grep -Po ' ?<=/tag/ vV ? 0-9 +\\. + 0-9 +' | head -n 1 else 从常规静态镜像列表解析 wget --timeout=10 -qO- \"$targetUrl\" | grep -Po \" ?<=${softwareName}. vV ? 0-9 +\\. + 0-9 +\" | tail -n 1 fi } 示例 1：获取 GitHub 仓库最新 tag 以 Xray 为例 LATEST_XRAY=$ getLatestVersion \"https://github.com/XTLS/Xray-core/releases\" echo \"Xray 最新版本为: $LATEST_XRAY\" 示例 2：获取 FFmpeg 官方镜像最新版本 LATEST_FFMPEG=$ getLatestVersion \"https://www.ffmpeg.org/releases/\" \"ffmpeg\" echo \"FFmpeg 最新版本为: $LATEST_FFMPEG\"",
    "sections": [
      {
        "title": "一、业务场景",
        "anchor": "#一-业务场景",
        "id": "一-业务场景"
      },
      {
        "title": "二、Shell 抓取脚本实现代码",
        "anchor": "#二-shell-抓取脚本实现代码",
        "id": "二-shell-抓取脚本实现代码"
      }
    ]
  },
  {
    "id": "shell-color-echo-31e2",
    "type": "post",
    "title": "Shell 脚本中输出红/绿/黄多色格式化终端文本函数",
    "url": "posts/shell-color-echo-31e2.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-11-15",
    "tags": [
      "Linux",
      "Shell",
      "Bash",
      "ANSI转义",
      "运维脚本"
    ],
    "summary": "封装基于 ANSI 转义码的通用 Shell 终端彩色文本打印函数，用于高亮显示部署脚本的成功、警告与错误日志。",
    "content": "Shell 脚本中输出红/绿/黄多色格式化终端文本函数 一、ANSI 终端颜色代码原理 Linux 终端通过 \\033 3Xm 转义码定义文字前景色： - \\033 31m ：红色（常用于错误提示） - \\033 32m ：绿色（常用于成功提示） - \\033 33m ：黄色（常用于警告提示） - \\033 0m ：重置所有颜色样式 --- 二、通用 Shell 彩色输出函数 bash !/usr/bin/env bash 终端彩色文字打印函数 echoColor { local text=\"$1\" local color=\"${2:-green}\" case \"$color\" in red|1 echo -e \"\\033 31m ERROR ${text}\\033 0m\" ;; green|2 echo -e \"\\033 32m SUCCESS ${text}\\033 0m\" ;; yellow|3 echo -e \"\\033 33m WARNING ${text}\\033 0m\" ;; blue|4 echo -e \"\\033 34m INFO ${text}\\033 0m\" ;; echo -e \"${text}\" ;; esac } 调用示例 echoColor \"数据库连接失败！\" \"red\" echoColor \"服务自动化部署已圆满完成！\" \"green\" echoColor \"磁盘可用空间低于 15%，请及时清理\" \"yellow\"",
    "sections": [
      {
        "title": "一、ANSI 终端颜色代码原理",
        "anchor": "#一-ansi-终端颜色代码原理",
        "id": "一-ansi-终端颜色代码原理"
      },
      {
        "title": "二、通用 Shell 彩色输出函数",
        "anchor": "#二-通用-shell-彩色输出函数",
        "id": "二-通用-shell-彩色输出函数"
      }
    ]
  },
  {
    "id": "wp-super-cache-nginx-c033",
    "type": "post",
    "title": "WordPress WP Super Cache 插件高并发 Nginx 静态伪静态规则",
    "url": "posts/wp-super-cache-nginx-c033.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-11-05",
    "tags": [
      "WordPress",
      "Nginx",
      "WP Super Cache",
      "动静分离",
      "缓存"
    ],
    "summary": "配置 Nginx 直接绕过 PHP-FPM 直读 WP Super Cache 生成的静态 HTML 缓存文件，实现高并发极速响应。",
    "content": "WordPress WP Super Cache 插件高并发 Nginx 静态伪静态规则 一、加速原理 常规 WordPress 请求需要经过 PHP-FPM 解释执行并多次查询 MySQL。WP Super Cache 开启 Expert 静态模式后，Nginx 可以直接在磁盘检查预生成的 .html 文件并直接发送给浏览器，吞吐量提升十倍以上。 --- 二、Nginx 完整配置代码 nginx WP Super Cache 核心 Nginx 匹配规则 set $cache_uri $request_uri; 针对 POST 请求、登录用户及带查询参数的请求绕过静态缓存 if $request_method = POST { set $cache_uri 'null cache'; } if $query_string != \"\" { set $cache_uri 'null cache'; } if $http_cookie ~ \"comment_author|wordpress_ a-f0-9 +|wp-postpass|wordpress_logged_in\" { set $cache_uri 'null cache'; } location / { try_files /wp-content/cache/supercache/$http_host/$cache_uri/index-https.html /wp-content/cache/supercache/$http_host/$cache_uri/index.html $uri $uri/ /index.php?$args; }",
    "sections": [
      {
        "title": "一、加速原理",
        "anchor": "#一-加速原理",
        "id": "一-加速原理"
      },
      {
        "title": "二、Nginx 完整配置代码",
        "anchor": "#二-nginx-完整配置代码",
        "id": "二-nginx-完整配置代码"
      }
    ]
  },
  {
    "id": "wp-reset-password-f1c8",
    "type": "post",
    "title": "WordPress 忘记管理员密码时的应急重置与修复方法",
    "url": "posts/wp-reset-password-f1c8.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-10-20",
    "tags": [
      "WordPress",
      "PHP",
      "MySQL",
      "密码重置",
      "运维"
    ],
    "summary": "梳理 WordPress 管理员密码丢失后的两种快速重置手段：MySQL 数据库 MD5 哈希直接更新与临时 functions.php 代码注入。",
    "content": "WordPress 忘记管理员密码时的应急重置与修复方法 一、方法一：MySQL 数据库一键更新（推荐） 通过 phpMyAdmin 或终端进入 MySQL，执行 SQL 语句直接将管理员密码重置（WordPress 密码基于 MD5 加盐算法）： sql -- 将用户名为 admin 的密码强制重置为 123456 UPDATE wp_users SET user_pass = MD5 '123456' WHERE user_login = 'admin'; --- 二、方法二：在主题 functions.php 中注入临时重置代码 如果无法直接连接数据库，可通过 FTP 或 SSH 编辑当前主题的 functions.php ，在顶部追加以下代码： php <?php // 临时重置用户 ID 为 1 的管理员密码为 new_password_123 wp_set_password 'new_password_123', 1 ; ?> > 重要提示 ：成功登录后台后，请 务必立即将 functions.php 中的上述代码删除 ，否则每次刷新页面都会重新重置密码。",
    "sections": [
      {
        "title": "一、方法一：MySQL 数据库一键更新（推荐）",
        "anchor": "#一-方法一-mysql-数据库一键更新-推荐",
        "id": "一-方法一-mysql-数据库一键更新-推荐"
      },
      {
        "title": "二、方法二：在主题 functions.php 中注入临时重置代码",
        "anchor": "#二-方法二-在主题-functions-php-中注入临时重置代码",
        "id": "二-方法二-在主题-functions-php-中注入临时重置代码"
      }
    ]
  },
  {
    "id": "vue-reset-data-46af",
    "type": "post",
    "title": "Vue 优雅一键重置组件 data 到初始状态的技巧",
    "url": "posts/vue-reset-data-46af.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-10-10",
    "tags": [
      "Vue",
      "组件状态",
      "重置表单",
      "this.$options"
    ],
    "summary": "告别繁琐的逐字段手动赋值，利用 this.$options.data() 结合 Object.assign 实现一行代码优雅重置 Vue 组件所有响应式数据。",
    "content": "Vue 优雅一键重置组件 data 到初始状态的技巧 一、业务场景与痛点 在关闭弹窗或提交表单后，常常需要将组件内的 form 或全部 data 恢复到初始空值状态。如果字段很多，逐一写 this.form.a = ''; this.form.b = ''; 极其繁琐且易遗漏。 --- 二、一行代码优雅重置 在 Vue 实例中， this.$options.data 可以获取到该组件在定义阶段最原始的未被修改的数据函数： javascript // 1. 重置组件内的全部 data 数据 Object.assign this.$data, this.$options.data.call this ; // 2. 仅重置特定表单对象 如 this.formData this.formData = this.$options.data.call this .formData; --- 三、Vue 组件完整使用示例 html <script> export default { data { return { searchQuery: '', filterStatus: 1, userForm: { username: '', phone: '', address: '' } }; }, methods: { // 弹窗关闭或点击重置按钮时调用 handleResetForm { // 一键将 userForm 恢复为初始空值 this.userForm = this.$options.data.call this .userForm; console.log '表单已完全重置为初始状态' ; } } }; </script>",
    "sections": [
      {
        "title": "一、业务场景与痛点",
        "anchor": "#一-业务场景与痛点",
        "id": "一-业务场景与痛点"
      },
      {
        "title": "二、一行代码优雅重置",
        "anchor": "#二-一行代码优雅重置",
        "id": "二-一行代码优雅重置"
      },
      {
        "title": "三、Vue 组件完整使用示例",
        "anchor": "#三-vue-组件完整使用示例",
        "id": "三-vue-组件完整使用示例"
      }
    ]
  },
  {
    "id": "nginx-hotlink-guard-c2f7",
    "type": "post",
    "title": "Nginx 媒体与静态资源防盗链配置实战（Valid Referers）",
    "url": "posts/nginx-hotlink-guard-c2f7.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-09-15",
    "tags": [
      "Nginx",
      "防盗链",
      "安全防护",
      "Valid Referers",
      "流量节省"
    ],
    "summary": "防止外部恶意网站盗用本站图片、视频与下载附件消耗服务器流量，利用 Nginx valid_referers 指令配置域名防盗链拦截。",
    "content": "Nginx 媒体与静态资源防盗链配置实战（Valid Referers） 一、防盗链机制 当浏览器加载网页中的图片或资源时，会在 HTTP 请求头附带 Referer （来源网址）。通过校验 Referer 是否为白名单域名，即可精准拦截非授权网站的非法外链引用。 --- 二、Nginx 防盗链配置代码 nginx location ~ \\. jpg|jpeg|png|gif|webp|mp4|flv|zip|rar|tar|gz $ { expires 30d; access_log off; 配置白名单域名 none: 允许空 Referer 直接访问; blocked: 允许被防火墙伪装的请求 valid_referers none blocked .vmrey.com vmrey.github.io; 如果是非白名单来源，直接返回 403 拒绝或重定向至提示图 if $invalid_referer { return 403; 或者重写展示警告防盗链图片: rewrite ^/ https://vmrey.github.io/assets/images/forbidden.png break; } }",
    "sections": [
      {
        "title": "一、防盗链机制",
        "anchor": "#一-防盗链机制",
        "id": "一-防盗链机制"
      },
      {
        "title": "二、Nginx 防盗链配置代码",
        "anchor": "#二-nginx-防盗链配置代码",
        "id": "二-nginx-防盗链配置代码"
      }
    ]
  },
  {
    "id": "nginx-cache-expires-16e0",
    "type": "post",
    "title": "Nginx 静态资源长效缓存与 Expires 性能优化配置",
    "url": "posts/nginx-cache-expires-16e0.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-09-05",
    "tags": [
      "Nginx",
      "浏览器缓存",
      "Expires",
      "性能优化",
      "前端加速"
    ],
    "summary": "通过 Nginx 对 JS、CSS、图片、字体等静态资源配置 Cache-Control 与 Expires 头部，大幅降低服务器带宽与首屏加载耗时。",
    "content": "Nginx 静态资源长效缓存与 Expires 性能优化配置 一、配置原理 利用 HTTP 1.1 的 Cache-Control: max-age 与 HTTP 1.0 的 Expires 响应头，通知浏览器在有效期内直接从本地 Disk Cache / Memory Cache 读取静态资源，无需向服务器发起重复请求。 --- 二、Nginx 核心配置代码 nginx 匹配常见静态资源文件扩展名 location ~ \\. jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2|ttf|eot $ { 设置静态缓存时间为 30 天 expires 30d; 开启静态资源强缓存策略 add_header Cache-Control \"public, no-transform\"; 关闭静态资源的访问日志与 404 错误日志，减轻磁盘 I/O access_log off; log_not_found off; }",
    "sections": [
      {
        "title": "一、配置原理",
        "anchor": "#一-配置原理",
        "id": "一-配置原理"
      },
      {
        "title": "二、Nginx 核心配置代码",
        "anchor": "#二-nginx-核心配置代码",
        "id": "二-nginx-核心配置代码"
      }
    ]
  },
  {
    "id": "firewalld-cheat-e029",
    "type": "post",
    "title": "CentOS 7 / RHEL Firewalld 防火墙常用命令与端口放行速查",
    "url": "posts/firewalld-cheat-e029.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-08-25",
    "tags": [
      "Linux",
      "Firewalld",
      "防火墙",
      "安全防护",
      "端口管理"
    ],
    "summary": "整理 Firewalld 核心操作指令：服务启停、开放/关闭指定 TCP/UDP 端口、查看放行清单及配置永久生效重载。",
    "content": "CentOS 7 / RHEL Firewalld 防火墙常用命令与端口放行速查 一、Firewalld 基础服务管理 bash 启动防火墙 systemctl start firewalld 查看防火墙运行状态 systemctl status firewalld 或使用专用指令 firewall-cmd --state 设置开机自启 systemctl enable firewalld 关闭防火墙 systemctl stop firewalld 禁用开机自启 systemctl disable firewalld --- 二、端口放行与管理指令 > 注意 ：必须带有 --permanent 参数才能将规则持久化写入配置文件，否则服务器重启后失效。 bash 1. 开放指定端口 以 80 和 443 为例 firewall-cmd --zone=public --add-port=80/tcp --permanent firewall-cmd --zone=public --add-port=443/tcp --permanent 2. 开放连续端口范围 以 8000 到 9000 为例 firewall-cmd --zone=public --add-port=8000-9000/tcp --permanent 3. 移除/关闭已放行的端口 firewall-cmd --zone=public --remove-port=8080/tcp --permanent 4. 重新加载配置 使修改的规则立即生效，必执行！ firewall-cmd --reload --- 三、规则与放行状态查询 bash 查询指定端口是否已开放 返回 yes 或 no firewall-cmd --zone=public --query-port=80/tcp 查看当前区域开放的所有端口与服务列表 firewall-cmd --zone=public --list-all",
    "sections": [
      {
        "title": "一、Firewalld 基础服务管理",
        "anchor": "#一-firewalld-基础服务管理",
        "id": "一-firewalld-基础服务管理"
      },
      {
        "title": "二、端口放行与管理指令",
        "anchor": "#二-端口放行与管理指令",
        "id": "二-端口放行与管理指令"
      },
      {
        "title": "三、规则与放行状态查询",
        "anchor": "#三-规则与放行状态查询",
        "id": "三-规则与放行状态查询"
      }
    ]
  },
  {
    "id": "centos-disable-ipv6-099b",
    "type": "post",
    "title": "CentOS 7 永久禁用 IPv6 网络协议的两种方法",
    "url": "posts/centos-disable-ipv6-099b.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-08-10",
    "tags": [
      "Linux",
      "CentOS",
      "IPv6",
      "网络配置",
      "Sysctl"
    ],
    "summary": "在仅需 IPv4 的服务器环境中，通过修改 sysctl 内核参数及网卡配置文件，彻底永久禁用 IPv6 避免网络请求异常超时。",
    "content": "CentOS 7 永久禁用 IPv6 网络协议的两种方法 一、为什么需要禁用 IPv6？ 在某些纯 IPv4 网络或特定的代理/容器环境中，系统默认启用的 IPv6 协议栈可能会导致 DNS 优先解析 AAAA 记录，从而引发 curl 、 wget 或上游连接偶发性超时等待。 --- 二、方法一：修改 sysctl 内核参数（推荐） 通过在系统内核配置中追加禁用规则： bash 编辑 sysctl 配置文件 cat <<EOF >> /etc/sysctl.conf net.ipv6.conf.all.disable_ipv6 = 1 net.ipv6.conf.default.disable_ipv6 = 1 net.ipv6.conf.lo.disable_ipv6 = 1 EOF 立即刷新使配置生效 sysctl -p --- 三、方法二：修改网卡配置 编辑对应网卡配置文件（例如 /etc/sysconfig/network-scripts/ifcfg-eth0 ）： bash 将 IPV6INIT 修改为 no IPV6INIT=\"no\" 重启网络服务即可： bash systemctl restart network",
    "sections": [
      {
        "title": "一、为什么需要禁用 IPv6？",
        "anchor": "#一-为什么需要禁用-ipv6",
        "id": "一-为什么需要禁用-ipv6"
      },
      {
        "title": "二、方法一：修改 sysctl 内核参数（推荐）",
        "anchor": "#二-方法一-修改-sysctl-内核参数-推荐",
        "id": "二-方法一-修改-sysctl-内核参数-推荐"
      },
      {
        "title": "三、方法二：修改网卡配置",
        "anchor": "#三-方法二-修改网卡配置",
        "id": "三-方法二-修改网卡配置"
      }
    ]
  },
  {
    "id": "frp-desktop-6af7",
    "type": "post",
    "title": "轻量级高性能内网穿透：frp 远程桌面 RDP 搭建与系统服务配置",
    "url": "posts/frp-desktop-6af7.html",
    "externalUrl": "",
    "category": "Linux 与服务端",
    "date": "2021-05-18",
    "tags": [
      "Linux",
      "frp",
      "远程桌面",
      "内网穿透",
      "RDP"
    ],
    "summary": "基于 VPS 部署 frps 服务端并配置 systemd 守护进程开机自启，搭配 Windows 客户端通过 STCP 安全加密协议实现 3389 远程桌面穿透。",
    "content": "轻量级高性能内网穿透：frp 远程桌面 RDP 搭建与系统服务配置 一、架构原理与优势 利用拥有公网 IP 的 VPS 作为中继服务端（ frps ），在公司/家庭 Windows 电脑运行被控客户端（ frpc ），配合 STCP（Secret TCP）端到端双向安全握手，实现无公网 IP 环境下流畅使用 Windows 原生远程桌面。 --- 二、VPS 服务端部署步骤 CentOS / Debian / Ubuntu bash 1. 下载解压 frp wget https://github.com/fatedier/frp/releases/download/v0.37.1/frp_0.37.1_linux_amd64.tar.gz tar -xzvf frp_0.37.1_linux_amd64.tar.gz mv frp_0.37.1_linux_amd64 /root/frps 2. 配置 frps.ini cat <<EOF > /root/frps/frps.ini common bind_port = 7000 token = your_secure_token_here EOF 3. 配置 systemd 系统开机守护服务 cat <<EOF > /etc/systemd/system/frps.service Unit Description=Frp Server Service After=network.target Service Type=simple ExecStart=/root/frps/frps -c /root/frps/frps.ini Restart=on-failure Install WantedBy=multi-user.target EOF 4. 启动并设置开机自启 systemctl daemon-reload systemctl enable --now frps systemctl status frps --- 三、被控端 Windows 客户端配置 frpc.ini ini common server_addr = 你的VPS公网IP server_port = 7000 token = your_secure_token_here rdp-target type = stcp sk = your_secret_password local_ip = 127.0.0.1 local_port = 3389 use_encryption = true use_compression = true --- 四、访问端 Windows 配置与一键连接 在访问端电脑的 frpc.ini 中配置 visitor 模式： ini common server_addr = 你的VPS公网IP server_port = 7000 token = your_secure_token_here rdp-visitor type = stcp role = visitor server_name = rdp-target sk = your_secret_password bind_addr = 127.0.0.1 bind_port = 33890 use_encryption = true use_compression = true 启动后打开远程桌面连接应用（ mstsc ），输入 127.0.0.1:33890 即可极速直连。",
    "sections": [
      {
        "title": "一、架构原理与优势",
        "anchor": "#一-架构原理与优势",
        "id": "一-架构原理与优势"
      },
      {
        "title": "二、VPS 服务端部署步骤 (CentOS / Debian / Ubuntu)",
        "anchor": "#二-vps-服务端部署步骤-centos-debian-ubuntu",
        "id": "二-vps-服务端部署步骤-centos-debian-ubuntu"
      },
      {
        "title": "三、被控端 Windows 客户端配置 (frpc.ini)",
        "anchor": "#三-被控端-windows-客户端配置-frpc-ini",
        "id": "三-被控端-windows-客户端配置-frpc-ini"
      },
      {
        "title": "四、访问端 Windows 配置与一键连接",
        "anchor": "#四-访问端-windows-配置与一键连接",
        "id": "四-访问端-windows-配置与一键连接"
      }
    ]
  },
  {
    "id": "el-calendar-style-bb16",
    "type": "post",
    "title": "Element UI 中 el-calendar 日历组件禁用与灰色置灰点击处理",
    "url": "posts/el-calendar-style-bb16.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-05-12",
    "tags": [
      "Vue",
      "ElementUI",
      "el-calendar",
      "组件实战"
    ],
    "summary": "针对 Element UI 的 el-calendar 日历组件，利用 slot 插槽与 CSS 禁用非本月或过期日期的点击操作并展示灰色状态。",
    "content": "Element UI 中 el-calendar 日历组件禁用与灰色置灰点击处理 一、实现需求 在订房系统或考勤排班中，使用 Element UI 的 el-calendar 组件时，需要将非本月或不可选日期置灰并禁止用户点击触发事件。 --- 二、完整实现方案 html <template> <el-calendar> <template dateCell=\"{ data }\"> <div :class=\" 'calendar-custom-cell', { 'is-disabled': isDisabledDate data.day } \" @click.stop=\"handleCellClick data.day \" > <p>{{ data.day.split '-' .slice 1 .join '-' }}</p> </div> </template> </el-calendar> </template> <script> export default { methods: { isDisabledDate dayStr { // 禁用今天之前的历史日期 const today = new Date .toISOString .split 'T' 0 ; return dayStr < today; }, handleCellClick dayStr { if this.isDisabledDate dayStr return; console.log '用户选择了有效日期:', dayStr ; } } }; </script> <style scoped> .calendar-custom-cell.is-disabled { color: c0c4cc; pointer-events: none; cursor: not-allowed; background-color: f5f7fa; } </style>",
    "sections": [
      {
        "title": "一、实现需求",
        "anchor": "#一-实现需求",
        "id": "一-实现需求"
      },
      {
        "title": "二、完整实现方案",
        "anchor": "#二-完整实现方案",
        "id": "二-完整实现方案"
      }
    ]
  },
  {
    "id": "vscode-clean-log-8fb9",
    "type": "post",
    "title": "VSCode 中使用正则表达式批量清理 console.log 打印语句",
    "url": "posts/vscode-clean-log-8fb9.html",
    "externalUrl": "",
    "category": "效率工具与软件",
    "date": "2021-05-08",
    "tags": [
      "VSCode",
      "正则表达式",
      "代码清洗",
      "效率工具"
    ],
    "summary": "项目打包上线前，利用 VSCode 强大的正则查找与替换功能，一键安全快速清除所有调试用 console.log 语句。",
    "content": "VSCode 中使用正则表达式批量清理 console.log 打印语句 一、使用场景 在日常前端开发联调中，代码中往往会残留大量用于调试的 console.log 打印。在生产打包前需要统一清理，避免泄露敏感业务数据或影响浏览器性能。 --- 二、单文件批量删除 1. 在 VSCode 当前文件中按下快捷键 Ctrl + H （macOS: Cmd + Option + F ）； 2. 开启搜索框右侧的 正则匹配模式图标 （快捷键 Alt + R ）； 3. 在查找框输入以下正则表达式： regex console\\.log\\ . \\ |; $ 4. 替换框留空，点击 全部替换（Ctrl + Alt + Enter） 即可。 --- 三、全工程文件夹全局批量清理 1. 按下全局查找替换快捷键 Ctrl + Shift + H （macOS: Cmd + Shift + H ）； 2. 查找内容输入： regex console\\. log|info|debug \\ . ?\\ ;? 3. 替换内容留空，点击一键替换即可。",
    "sections": [
      {
        "title": "一、使用场景",
        "anchor": "#一-使用场景",
        "id": "一-使用场景"
      },
      {
        "title": "二、单文件批量删除",
        "anchor": "#二-单文件批量删除",
        "id": "二-单文件批量删除"
      },
      {
        "title": "三、全工程文件夹全局批量清理",
        "anchor": "#三-全工程文件夹全局批量清理",
        "id": "三-全工程文件夹全局批量清理"
      }
    ]
  },
  {
    "id": "js-tree-find-value-d75f",
    "type": "post",
    "title": "JavaScript 递归检索深层对象与数组中是否包含某个值",
    "url": "posts/js-tree-find-value-d75f.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-25",
    "tags": [
      "JavaScript",
      "递归检索",
      "对象遍历",
      "算法"
    ],
    "summary": "编写通用递归搜索函数，跨越任意深度嵌套的 JSON 对象与数组层级，快速判断某个基本类型值是否存在。",
    "content": "JavaScript 递归检索深层对象与数组中是否包含某个值 一、函数设计需求 在处理复杂的多层树形数据时，我们常常需要快速判断一个数值或字符串（如 T恤 、 user_1024 ）是否存在于对象的任意深层属性中。 --- 二、通用递归检索实现代码 javascript / 递归判断对象或数组是否包含指定值 @param { } searchValue 要检索的目标值（基本数据类型） @param {Object|Array} targetObj 待遍历的对象或数组 @returns {Boolean} 是否存在 / function isValueExist searchValue, targetObj { if targetObj === null || targetObj === undefined return false; // 如果当前直接匹配 if targetObj === searchValue return true; if typeof targetObj === 'object' { for const key in targetObj { if Object.prototype.hasOwnProperty.call targetObj, key { if isValueExist searchValue, targetObj key { return true; } } } } return false; } // 调用示例 const complexUser = { user: { name: '张三', goods: { clothes: 'T恤', color: 'red', tags: '热卖', '新品' }, id: 5 } }; console.log isValueExist 'T恤', complexUser ; // true console.log isValueExist '新品', complexUser ; // true console.log isValueExist 'iPhone', complexUser ; // false",
    "sections": [
      {
        "title": "一、函数设计需求",
        "anchor": "#一-函数设计需求",
        "id": "一-函数设计需求"
      },
      {
        "title": "二、通用递归检索实现代码",
        "anchor": "#二-通用递归检索实现代码",
        "id": "二-通用递归检索实现代码"
      }
    ]
  },
  {
    "id": "calc-coords-distance-2f2e",
    "type": "post",
    "title": "JavaScript 根据经纬度计算两地直线距离算法实现",
    "url": "posts/calc-coords-distance-2f2e.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-22",
    "tags": [
      "JavaScript",
      "经纬度",
      "LBS定位",
      "数学公式"
    ],
    "summary": "基于 Haversine 球面大圆距离公式，使用 JavaScript 精确计算两个经纬度坐标点之间的实际千米/公里直线距离。",
    "content": "JavaScript 根据经纬度计算两地直线距离算法实现 一、算法原理：Haversine 半正矢公式 地球近似为一个半径约为 $6378.137\\text{ km}$ 的球体。通过将两点的纬度（Latitude）与经度（Longitude）转换为弧度，即可利用三角函数计算出球面两点之间的最短距离。 --- 二、JavaScript 实现代码 javascript / 根据经纬度计算两点之间的距离 单位: km @param {Number} lat1 第一个点的纬度 -90 ~ 90 @param {Number} lng1 第一个点的经度 -180 ~ 180 @param {Number} lat2 第二个点的纬度 @param {Number} lng2 第二个点的经度 @returns {Number} 距离（保留两位小数，千米） / function getDistanceBetweenCoordinates lat1, lng1, lat2, lng2 { const EARTH_RADIUS = 6378.137; // 地球半径 km const radLat1 = lat1 Math.PI / 180.0; const radLat2 = lat2 Math.PI / 180.0; const a = radLat1 - radLat2; const b = lng1 Math.PI / 180.0 - lng2 Math.PI / 180.0 ; let distance = 2 Math.asin Math.sqrt Math.pow Math.sin a / 2 , 2 + Math.cos radLat1 Math.cos radLat2 Math.pow Math.sin b / 2 , 2 ; distance = distance EARTH_RADIUS; return Number distance.toFixed 2 ; } // 调用示例：计算烟台两地标距离 const dist = getDistanceBetweenCoordinates 37.48205260, 121.44577861, 37.48330837, 121.44820869 ; console.log 两地距离约为: ${dist} km ;",
    "sections": [
      {
        "title": "一、算法原理：Haversine 半正矢公式",
        "anchor": "#一-算法原理-haversine-半正矢公式",
        "id": "一-算法原理-haversine-半正矢公式"
      },
      {
        "title": "二、JavaScript 实现代码",
        "anchor": "#二-javascript-实现代码",
        "id": "二-javascript-实现代码"
      }
    ]
  },
  {
    "id": "vue-email-filter-eb21",
    "type": "post",
    "title": "Vue 中 input 输入框实时校验与过滤邮箱格式输入",
    "url": "posts/vue-email-filter-eb21.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-20",
    "tags": [
      "Vue",
      "表单校验",
      "邮箱验证",
      "输入拦截"
    ],
    "summary": "针对登录与注册表单，实现 Vue 输入框实时拦截非法特殊符号，保证仅能输入符合规范的 Email 邮箱字符。",
    "content": "Vue 中 input 输入框实时校验与过滤邮箱格式输入 一、实现思路 1. 移除非法字符（仅保留字母、数字、 @ 、 . 与 _ ）； 2. 限制 @ 符号全局唯一出现； 3. 限制 @ 之后不能直接紧随 . ； 4. 限制顶级域名后缀长度（通常为 2~4 位字符）。 --- 二、Vue 核心实现代码 html <template> <div class=\"email-input-wrapper\"> <input v-model=\"email\" placeholder=\"请输入您的邮箱地址\" class=\"email-input\" @input=\"handleEmailInput\" /> </div> </template> <script> export default { data { return { email: '' }; }, methods: { handleEmailInput { let val = this.email.replace / ^\\d\\w@._- /g, '' ; if val.indexOf '@' !== -1 { const parts = val.split '@' ; // 只允许一个 @ 符号 if parts.length > 2 { val = parts 0 + '@' + parts.slice 1 .join '' ; } // 防止 @. 紧挨 val = val.replace /@\\./g, '@' ; } this.email = val; } } }; </script>",
    "sections": [
      {
        "title": "一、实现思路",
        "anchor": "#一-实现思路",
        "id": "一-实现思路"
      },
      {
        "title": "二、Vue 核心实现代码",
        "anchor": "#二-vue-核心实现代码",
        "id": "二-vue-核心实现代码"
      }
    ]
  },
  {
    "id": "js-search-ranking-87fa",
    "type": "post",
    "title": "JavaScript 字符串即时搜索与智能匹配排序算法",
    "url": "posts/js-search-ranking-87fa.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-18",
    "tags": [
      "JavaScript",
      "搜索匹配",
      "字符串算法",
      "排序"
    ],
    "summary": "模拟百度搜索关键词智能匹配，基于字符匹配位置、命中度与插入排序对搜索结果列表进行动态权重排序。",
    "content": "JavaScript 字符串即时搜索与智能匹配排序算法 一、实现原理 当用户输入搜索关键词时，根据以下权重进行动态排序： 1. 完全匹配 / 前缀匹配 ：优先级最高； 2. 包含匹配 ：根据字符在目标串中的出现索引位置升序排列； 3. 模糊命中 ：过滤无相关项。 --- 二、核心搜索与排序算法 javascript / 模拟百度搜索结果权重匹配排序 @param {String} keyword 搜索关键词 @param {Array<String>} dataList 待检索的数据列表 @returns {Array<String>} 按匹配度排序后的搜索结果 / function searchAndRank keyword, dataList = { if !keyword || !keyword.trim return dataList; const kw = keyword.trim .toLowerCase ; // 1. 过滤并计算命中权重 const matched = ; for const item of dataList { const text = String item .toLowerCase ; const index = text.indexOf kw ; if index !== -1 { matched.push { raw: item, score: index // 越靠前 index 越小，匹配度越高 } ; } } // 2. 插入排序进行权重排列 for let i = 1; i < matched.length; i++ { let current = matched i ; let j = i - 1; while j >= 0 && matched j .score > current.score { matched j + 1 = matched j ; j--; } matched j + 1 = current; } return matched.map m => m.raw ; } // 调用示例 const searchDatabase = 'JavaScript 权威指南', 'Vue3 源码与组件设计', 'JavaScript 异步编程', '现代 JavaScript 教程', 'Linux Nginx 运维实战' ; console.log searchAndRank 'JavaScript', searchDatabase ; // 优先返回以 JavaScript 开头的条目，再返回中间包含的条目",
    "sections": [
      {
        "title": "一、实现原理",
        "anchor": "#一-实现原理",
        "id": "一-实现原理"
      },
      {
        "title": "二、核心搜索与排序算法",
        "anchor": "#二-核心搜索与排序算法",
        "id": "二-核心搜索与排序算法"
      }
    ]
  },
  {
    "id": "vue-currency-filter-0ab5",
    "type": "post",
    "title": "Vue 中限制 input 输入框仅允许输入浮点数或金额格式",
    "url": "posts/vue-currency-filter-0ab5.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-15",
    "tags": [
      "Vue",
      "表单验证",
      "金额输入",
      "正则过滤"
    ],
    "summary": "在 Vue 表单中通过 watch 监听与精确正则，限制用户输入金额时仅能输入数字与最多两位小数，杜绝非法字符。",
    "content": "Vue 中限制 input 输入框仅允许输入浮点数或金额格式 一、实现思路 使用 Vue 的 watch 机制或 @input 事件监听，在用户键盘输入时实时通过正则表达式校验。如果输入了非法字符或超过两位小数，自动回退到上一次的合法值。 --- 二、Vue 完整实现代码 html <template> <div class=\"money-input-container\"> <input v-model=\"inputMoney\" placeholder=\"请输入金额 最多两位小数 \" class=\"custom-input\" /> </div> </template> <script> export default { data { return { inputMoney: '' }; }, watch: { inputMoney newVal, oldVal { if !newVal return; // 允许最多5位整数、最多2位小数的金额格式 const reg = /^ \\d{0,5} \\. \\d{0,2} ?$/; if !reg.test newVal { this.inputMoney = oldVal; } } } }; </script>",
    "sections": [
      {
        "title": "一、实现思路",
        "anchor": "#一-实现思路",
        "id": "一-实现思路"
      },
      {
        "title": "二、Vue 完整实现代码",
        "anchor": "#二-vue-完整实现代码",
        "id": "二-vue-完整实现代码"
      }
    ]
  },
  {
    "id": "js-flatten-json-4eca",
    "type": "post",
    "title": "JavaScript 递归扁平化深层嵌套数组与 JSON 结构实战",
    "url": "posts/js-flatten-json-4eca.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-12",
    "tags": [
      "JavaScript",
      "扁平化",
      "递归",
      "数据处理"
    ],
    "summary": "掌握多维数组扁平化为一维数组，以及将多层嵌套树形 JSON 数据结构展平成单层键值映射的通用算法。",
    "content": "JavaScript 递归扁平化深层嵌套数组与 JSON 结构实战 一、多维数组扁平化为一维数组 javascript / 递归将多维数组扁平化为一维数组 @param {Array} arr 多维嵌套数组 @returns {Array} 展平后的一维数组 / function flattenArray arr { let result = ; for let i = 0; i < arr.length; i++ { if Array.isArray arr i { result = result.concat flattenArray arr i ; } else { result.push arr i ; } } return result; } // 现代浏览器原生方案 ES2019 const nestedArr = 1, 2, 3, 4, 5 , 6 ; console.log nestedArr.flat Infinity ; // 1, 2, 3, 4, 5, 6 --- 二、多层嵌套 JSON 扁平化展开 javascript / 递归将多层 JSON 展平成单层键值对 @param {Object} jsonObj 嵌套 JSON 对象 @param {String} prefix 键名前缀 @param {Object} result 结果容器 / function flattenJson jsonObj, prefix = '', result = {} { for const key in jsonObj { if Object.prototype.hasOwnProperty.call jsonObj, key { const fullKey = prefix ? ${prefix}.${key} : key; if typeof jsonObj key === 'object' && jsonObj key !== null && !Array.isArray jsonObj key { flattenJson jsonObj key , fullKey, result ; } else { result fullKey = jsonObj key ; } } } return result; } // 调用示例 const userProfile = { user: { name: '张三', detail: { email: 'zhangsan@example.com', city: '北京' } }, status: 'active' }; console.log flattenJson userProfile ; // 输出: { 'user.name': '张三', 'user.detail.email': '...', 'user.detail.city': '北京', status: 'active' }",
    "sections": [
      {
        "title": "一、多维数组扁平化为一维数组",
        "anchor": "#一-多维数组扁平化为一维数组",
        "id": "一-多维数组扁平化为一维数组"
      },
      {
        "title": "二、多层嵌套 JSON 扁平化展开",
        "anchor": "#二-多层嵌套-json-扁平化展开",
        "id": "二-多层嵌套-json-扁平化展开"
      }
    ]
  },
  {
    "id": "el-tree-index-240e",
    "type": "post",
    "title": "Element UI 中 el-tree 树形结构生成唯一索引与父级回溯",
    "url": "posts/el-tree-index-240e.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-10",
    "tags": [
      "Vue",
      "ElementUI",
      "el-tree",
      "递归算法"
    ],
    "summary": "通过递归遍历为 Element UI 的 el-tree 节点动态生成带层级深度的唯一全局索引，并支持通过子索引快速回溯父级链条。",
    "content": "Element UI 中 el-tree 树形结构生成唯一索引与父级回溯 一、业务场景与需求 在开发 Element UI 复杂的 el-tree 树形菜单或权限配置时，常常需要： 1. 依据节点层级深度动态生成全局唯一的索引路径（如 0-1-2 ）； 2. 用户选中某一子节点时，能够快速逆向回溯提取其所有上级父节点链条。 --- 二、递归生成唯一索引算法 javascript / 递归为树形数据生成带有层级路径的唯一索引 如 0, 0-0, 0-1-0 @param {Array} treeData 树形节点数组 @param {String} parentIndex 父级索引前缀 / function generateTreeUniqueIndex treeData, parentIndex = '' { return treeData.map node, index => { const currentIndex = parentIndex === '' ? ${index} : ${parentIndex}-${index} ; const newNode = { ...node, uniqueIndex: currentIndex }; if node.children && Array.isArray node.children && node.children.length > 0 { newNode.children = generateTreeUniqueIndex node.children, currentIndex ; } return newNode; } ; } --- 三、根据索引值回溯父级节点链 javascript / 通过子节点的 uniqueIndex 回溯其所属的所有上层索引列表 @param {String} uniqueIndex 节点索引（如 '0-1-2'） @returns {Array} 父级索引数组（如 '0', '0-1', '0-1-2' ） / function backtrackParentIndexes uniqueIndex { const parts = uniqueIndex.split '-' ; const parentIndexes = ; let current = ''; for let i = 0; i < parts.length; i++ { current = i === 0 ? parts i : ${current}-${parts i } ; parentIndexes.push current ; } return parentIndexes; } // 调用示例 console.log backtrackParentIndexes '0-1-2' ; // 输出: '0', '0-1', '0-1-2'",
    "sections": [
      {
        "title": "一、业务场景与需求",
        "anchor": "#一-业务场景与需求",
        "id": "一-业务场景与需求"
      },
      {
        "title": "二、递归生成唯一索引算法",
        "anchor": "#二-递归生成唯一索引算法",
        "id": "二-递归生成唯一索引算法"
      },
      {
        "title": "三、根据索引值回溯父级节点链",
        "anchor": "#三-根据索引值回溯父级节点链",
        "id": "三-根据索引值回溯父级节点链"
      }
    ]
  },
  {
    "id": "js-rename-json-keys-eba7",
    "type": "post",
    "title": "JavaScript 递归批量重命名 JSON 对象中的键名 (Key)",
    "url": "posts/js-rename-json-keys-eba7.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-04-05",
    "tags": [
      "JavaScript",
      "JSON处理",
      "递归算法",
      "数据清洗"
    ],
    "summary": "支持单键或多键批量映射替换，递归深度遍历树形 JSON 数据结构，自动将后端下发的驼峰或下划线字段重命名。",
    "content": "JavaScript 递归批量重命名 JSON 对象中的键名 Key 一、业务痛点 在前后端接口数据对接中，后端经常返回下划线命名字段（如 group_id 、 pid ），或者需要将多层嵌套树形菜单的 child 统一重命名为组件所需要的 children 。 --- 二、递归替换 Key 核心函数 javascript / 递归替换 JSON 对象中的 Key 键名 @param {String|Array} oldKey 旧的 key 或旧 key 数组 @param {String|Array} newKey 新的 key 或新 key 数组 @param {Object|Array} targetObj 待处理的目标对象 @returns {Object|Array} 处理后的数据对象 / function replaceJsonKey oldKey, newKey, targetObj { if !targetObj || typeof targetObj !== 'object' { return targetObj; } if Array.isArray targetObj { return targetObj.map item => replaceJsonKey oldKey, newKey, item ; } const result = {}; const isArrayMap = Array.isArray oldKey && Array.isArray newKey ; for const key in targetObj { if Object.prototype.hasOwnProperty.call targetObj, key { let currentKey = key; if isArrayMap { const matchIndex = oldKey.indexOf key ; if matchIndex !== -1 && newKey matchIndex { currentKey = newKey matchIndex ; } } else if typeof oldKey === 'string' && key === oldKey { currentKey = newKey; } // 递归处理子属性 result currentKey = replaceJsonKey oldKey, newKey, targetObj key ; } } return result; } // 调用示例 const mockData = { id: 1, group_id: 101, pid: 0, name: '研发部', child: { id: 2, group_id: 101, pid: 1, name: '前端组' } } ; // 单键替换 console.log replaceJsonKey 'pid', 'parentId', mockData ; // 多键批量映射替换 console.log replaceJsonKey 'group_id', 'child' , 'groupId', 'children' , mockData ;",
    "sections": [
      {
        "title": "一、业务痛点",
        "anchor": "#一-业务痛点",
        "id": "一-业务痛点"
      },
      {
        "title": "二、递归替换 Key 核心函数",
        "anchor": "#二-递归替换-key-核心函数",
        "id": "二-递归替换-key-核心函数"
      }
    ]
  },
  {
    "id": "textarea-cursor-pos-9496",
    "type": "post",
    "title": "JavaScript 获取与控制 input 及 textarea 文本框光标位置",
    "url": "posts/textarea-cursor-pos-9496.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-28",
    "tags": [
      "JavaScript",
      "DOM操作",
      "光标位置",
      "文本框"
    ],
    "summary": "兼容现代标准浏览器与传统 IE 环境，获取 input / textarea 中光标的精确字符位置，并在指定位置插入文本。",
    "content": "JavaScript 获取与控制 input 及 textarea 文本框光标位置 一、获取光标所在索引位置 javascript / 获取输入框或文本域的光标位置 @param {HTMLElement|String} el 目标 DOM 元素或 ID @returns {Number} 光标所在索引值 / function getCursorPosition el { const oElement = typeof el === 'string' ? document.getElementById el : el; if !oElement return 0; let cursorPos = 0; if document.selection { // 兼容 IE 传统模式 const selectRange = document.selection.createRange ; selectRange.moveStart 'character', -oElement.value.length ; cursorPos = selectRange.text.length; } else if oElement.selectionStart !== undefined { // 标准浏览器 Chrome / Firefox / Safari / Edge cursorPos = oElement.selectionStart; } return cursorPos; } --- 二、在光标当前位置插入特定文本 javascript / 在输入框光标所在处插入文本并重置光标 @param {HTMLInputElement} inputEl @param {String} textToInsert / function insertTextAtCursor inputEl, textToInsert { const startPos = inputEl.selectionStart || 0; const endPos = inputEl.selectionEnd || 0; const value = inputEl.value; inputEl.value = value.substring 0, startPos + textToInsert + value.substring endPos ; // 重新聚焦并将光标移动至插入内容末尾 inputEl.focus ; inputEl.selectionStart = inputEl.selectionEnd = startPos + textToInsert.length; }",
    "sections": [
      {
        "title": "一、获取光标所在索引位置",
        "anchor": "#一-获取光标所在索引位置",
        "id": "一-获取光标所在索引位置"
      },
      {
        "title": "二、在光标当前位置插入特定文本",
        "anchor": "#二-在光标当前位置插入特定文本",
        "id": "二-在光标当前位置插入特定文本"
      }
    ]
  },
  {
    "id": "js-dedup-1e34",
    "type": "post",
    "title": "JavaScript 数组与字符串去重深度实战（支持嵌套对象去重）",
    "url": "posts/js-dedup-1e34.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-25",
    "tags": [
      "JavaScript",
      "去重",
      "Set",
      "算法"
    ],
    "summary": "总结 JavaScript 中数组去重、字符串字符去重，以及支持包含嵌套 JSON 对象的深度去重完整解决方案。",
    "content": "JavaScript 数组与字符串去重深度实战（支持嵌套对象去重） 一、基础数组与字符串极简去重 Set 对于基础数据类型的数组与字符串，ES6 的 Set 是最高效的去重方式： javascript // 1. 普通数组去重 const arr = 1, 2, 2, 3, 4, 4, 5 ; const uniqueArr = ...new Set arr ; console.log uniqueArr ; // 1, 2, 3, 4, 5 // 2. 字符串字符去重 const str = 'abbcccdddde'; const uniqueStr = ...new Set str .join '' ; console.log uniqueStr ; // 'abcde' --- 二、支持复杂 JSON 对象的全功能深度去重函数 javascript / 健壮的数组去重函数（支持内部包含 JSON 对象的深度比对） @param {Array|String|Number} target 需要去重的数据 @returns {Array|String} / function removeDuplicates target { if typeof target === 'string' || typeof target === 'number' { const chars = String target .split '' ; return ...new Set chars .join '' ; } if !Array.isArray target return target; const result = ; const stringCache = new Set ; for const item of target { // 将对象转为序列化字符串进行精准特征比对 const key = typeof item === 'object' && item !== null ? JSON.stringify item : item; if !stringCache.has key { stringCache.add key ; result.push item ; } } return result; } // 调用示例 const mixedList = 1, 5, 5, 6, { name: '张三', age: 18 }, { name: '李四', age: 20 }, { name: '张三', age: 18 } // 重复对象 ; console.log removeDuplicates mixedList ; // 输出: 1, 5, 6, { name: '张三', age: 18 }, { name: '李四', age: 20 }",
    "sections": [
      {
        "title": "一、基础数组与字符串极简去重 (Set)",
        "anchor": "#一-基础数组与字符串极简去重-set",
        "id": "一-基础数组与字符串极简去重-set"
      },
      {
        "title": "二、支持复杂 JSON 对象的全功能深度去重函数",
        "anchor": "#二-支持复杂-json-对象的全功能深度去重函数",
        "id": "二-支持复杂-json-对象的全功能深度去重函数"
      }
    ]
  },
  {
    "id": "js-select-sort-267c",
    "type": "post",
    "title": "JavaScript 数组与对象数组自定义排序算法实战",
    "url": "posts/js-select-sort-267c.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-20",
    "tags": [
      "JavaScript",
      "选择排序",
      "数组排序",
      "算法"
    ],
    "summary": "实现通用选择排序算法，支持对普通数值数组及包含特定 key 键的对象数组进行正序与逆序灵活排列。",
    "content": "JavaScript 数组与对象数组自定义排序算法实战 一、通用数组选择排序算法 javascript / 基础数组选择排序 @param {Array} arr 待排序数组 @param {Number} order 1 为从小到大，-1 为从大到小 @returns {Array} 排序后的全新副本 / function selectionSort arr = , order = 1 { const result = ...arr ; const len = result.length; for let i = 0; i < len - 1; i++ { for let j = i + 1; j < len; j++ { if order === 1 && result i > result j { result i , result j = result j , result i ; } else if order === -1 && result i < result j { result i , result j = result j , result i ; } } } return result; } // 调用示例 const numbers = 1, 8, 96, 666, 2, 3, 5, 68, 567 ; console.log '从小到大:', selectionSort numbers, 1 ; console.log '从大到小:', selectionSort numbers, -1 ; --- 二、对象数组根据 Key 键动态排序 javascript / 对象数组根据属性 key 排序 @param {Array} arrObj 对象数组 @param {Number} order 1 为从小到大，-1 为从大到小 @param {String} key 参与比较的对象属性字段 / function sortObjByKey arrObj = , order = 1, key { const result = JSON.parse JSON.stringify arrObj ; const len = result.length; for let i = 0; i < len - 1; i++ { for let j = i + 1; j < len; j++ { if order === 1 && result i key > result j key { result i , result j = result j , result i ; } else if order === -1 && result i key < result j key { result i , result j = result j , result i ; } } } return result; } // 调用示例 const userList = { id: 265, name: '张三' }, { id: 0, name: '李四' }, { id: 2, name: '王五' }, { id: 999, name: '赵六' } ; console.log '按 id 正序:', sortObjByKey userList, 1, 'id' ; console.log '按 id 倒序:', sortObjByKey userList, -1, 'id' ;",
    "sections": [
      {
        "title": "一、通用数组选择排序算法",
        "anchor": "#一-通用数组选择排序算法",
        "id": "一-通用数组选择排序算法"
      },
      {
        "title": "二、对象数组根据 Key 键动态排序",
        "anchor": "#二-对象数组根据-key-键动态排序",
        "id": "二-对象数组根据-key-键动态排序"
      }
    ]
  },
  {
    "id": "css-center-8da2",
    "type": "post",
    "title": "CSS 元素水平垂直居中的常用核心方案总结",
    "url": "posts/css-center-8da2.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-15",
    "tags": [
      "CSS",
      "前端排版",
      "居中对齐",
      "Flexbox"
    ],
    "summary": "系统总结 Flexbox 弹性盒、绝对定位搭配 transform 偏移以及行内块级元素在内的核心 CSS 垂直水平居中技巧。",
    "content": "CSS 元素水平垂直居中的常用核心方案总结 一、Flexbox 弹性盒居中（现代前端推荐） 使用弹性盒布局是最简单、兼容性良好且最推荐的水平垂直居中方式： css .parent { display: flex; justify-content: center; / 水平居中 / align-items: center; / 垂直居中 / } --- 二、绝对定位配合 transform 负位移 适用于父级具有相对定位，子元素宽度或高度未知/动态的场景： css .parent { position: relative; } .child { position: absolute; top: 50%; left: 50%; transform: translate -50%, -50% ; } --- 三、绝对定位搭配 margin: auto 适用于子元素具有固定宽度和高度的场景： css .parent { position: relative; } .child { position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; width: 200px; height: 200px; }",
    "sections": [
      {
        "title": "一、Flexbox 弹性盒居中（现代前端推荐）",
        "anchor": "#一-flexbox-弹性盒居中-现代前端推荐",
        "id": "一-flexbox-弹性盒居中-现代前端推荐"
      },
      {
        "title": "二、绝对定位配合 transform 负位移",
        "anchor": "#二-绝对定位配合-transform-负位移",
        "id": "二-绝对定位配合-transform-负位移"
      },
      {
        "title": "三、绝对定位搭配 margin: auto",
        "anchor": "#三-绝对定位搭配-margin-auto",
        "id": "三-绝对定位搭配-margin-auto"
      }
    ]
  },
  {
    "id": "unicode-crypto-str-16d8",
    "type": "post",
    "title": "基于 Unicode 编码的原生 JavaScript 字符串加解密方法",
    "url": "posts/unicode-crypto-str-16d8.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-05",
    "tags": [
      "JavaScript",
      "加密解密",
      "Unicode",
      "安全"
    ],
    "summary": "利用 charCodeAt 与 fromCharCode 算法实现跨语言通用的轻量级字符串加密与解密函数。",
    "content": "基于 Unicode 编码的原生 JavaScript 字符串加解密方法 一、原理与设计思路 基于原生 JavaScript 的 charCodeAt 与 fromCharCode ，将字符串中每个字符转化为 Unicode 数值并应用异或位移变换，解密时再按原算法反向还原。 核心优势 ：零第三方库依赖，算法跨平台跨语言通用，执行效率极高。 --- 二、加解密完整实现代码 javascript / 字符串轻量可逆加密 @param {String} str 待加密原文 @param {Number} salt 混淆盐值 默认为 13 @returns {String} 加密后的密文 / function encryptString str, salt = 13 { if !str return ''; let encrypted = ''; for let i = 0; i < str.length; i++ { const code = str.charCodeAt i ^ salt; encrypted += code.toString 16 .padStart 4, '0' ; } return encrypted; } / 密文解密还原 @param {String} cipher 密文 @param {Number} salt 混淆盐值 @returns {String} 解密后的明文 / function decryptString cipher, salt = 13 { if !cipher return ''; let decrypted = ''; for let i = 0; i < cipher.length; i += 4 { const hex = cipher.substr i, 4 ; const code = parseInt hex, 16 ^ salt; decrypted += String.fromCharCode code ; } return decrypted; } // 测试示例 const originalText = \"Hello vmrey.github.io! 密码123456\"; const cipher = encryptString originalText ; console.log '加密后:', cipher ; const plain = decryptString cipher ; console.log '解密后:', plain ; console.log '还原匹配成功:', originalText === plain ;",
    "sections": [
      {
        "title": "一、原理与设计思路",
        "anchor": "#一-原理与设计思路",
        "id": "一-原理与设计思路"
      },
      {
        "title": "二、加解密完整实现代码",
        "anchor": "#二-加解密完整实现代码",
        "id": "二-加解密完整实现代码"
      }
    ]
  },
  {
    "id": "settimeout-interval-ee29",
    "type": "post",
    "title": "深入浅出：使用 setTimeout 精准模拟 setInterval 及其核心优势",
    "url": "posts/settimeout-interval-ee29.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-03-01",
    "tags": [
      "JavaScript",
      "定时器",
      "事件循环",
      "性能优化"
    ],
    "summary": "为什么生产环境不推荐原生 setInterval？分析事件堆叠排队机制，使用递归 setTimeout 实现精确无阻塞的周期执行。",
    "content": "深入浅出：使用 setTimeout 精准模拟 setInterval 及其核心优势 一、为什么原生 setInterval 存在缺陷？ 在复杂的前端任务或网络请求场景中，使用原生 setInterval 会遇到以下痛点： 1. 执行时间堆叠 ：如果回调函数的执行耗时超过了设定的间隔时间，多个定时器回调会紧挨着执行，产生卡顿； 2. 误差累计 ：浏览器主线程阻塞时，可能会跳过部分周期的执行。 --- 二、使用递归 setTimeout 优雅实现 使用链式/递归 setTimeout 能够保证前一次异步任务完全执行完毕后，再精确等待指定毫秒数开启下一次执行： javascript / 基于 setTimeout 实现的精准定时轮询器 @param {Function} callback 待执行回调函数 @param {Number} interval 轮询间隔毫秒数 @returns {Object} 包含 cancel 方法的定时器控制器 / function mySetInterval callback, interval { let timerId = null; let isCancelled = false; function loop { if isCancelled return; timerId = setTimeout => { callback ; loop ; }, interval ; } loop ; return { clear { isCancelled = true; clearTimeout timerId ; } }; } // 调用示例 const poller = mySetInterval => { console.log '周期执行:', new Date .toLocaleTimeString ; }, 1000 ; // 5秒后停止轮询 setTimeout => { poller.clear ; console.log '定时器已安全销毁' ; }, 5000 ;",
    "sections": [
      {
        "title": "一、为什么原生 setInterval 存在缺陷？",
        "anchor": "#一-为什么原生-setinterval-存在缺陷",
        "id": "一-为什么原生-setinterval-存在缺陷"
      },
      {
        "title": "二、使用递归 setTimeout 优雅实现",
        "anchor": "#二-使用递归-settimeout-优雅实现",
        "id": "二-使用递归-settimeout-优雅实现"
      }
    ]
  },
  {
    "id": "js-swap-variables-3796",
    "type": "post",
    "title": "JavaScript 中交换两个变量值的五种经典实现方法",
    "url": "posts/js-swap-variables-3796.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-02-20",
    "tags": [
      "JavaScript",
      "ES6",
      "解构赋值",
      "基础算法"
    ],
    "summary": "盘点 JavaScript 中对调两个变量的 5 种方式：临时变量法、ES6 解构赋值、算术加减法、异或运算与数组索引互换。",
    "content": "JavaScript 中交换两个变量值的五种经典实现方法 一、ES6 解构赋值（现代推荐） ES6 提供了优雅的数组解构语法，一行代码即可完成两个变量的值对调，且无需开辟显式临时变量： javascript let a = 1; let b = 2; a, b = b, a ; console.log a, b ; // 输出: 2, 1 --- 二、经典临时中间变量法 最稳健直观、兼容所有浏览器环境的标准实现： javascript var a = 1; var b = 2; var temp = a; a = b; b = temp; console.log a, b ; // 输出: 2, 1 --- 三、数值加减运算法（仅限数值类型） 无需借助临时变量，通过数学求和与求差完成互换（需注意大数溢出风险）： javascript var a = 10; var b = 20; a = a + b; // a = 30 b = a - b; // b = 10 a = a - b; // a = 20 console.log a, b ; // 输出: 20, 10 --- 四、位异或运算法 XOR 仅限整数 利用二进制异或性质进行原地无额外空间交换： javascript var a = 5; // 二进制 0101 var b = 9; // 二进制 1001 a = a ^ b; b = a ^ b; a = a ^ b; console.log a, b ; // 输出: 9, 5",
    "sections": [
      {
        "title": "一、ES6 解构赋值（现代推荐）",
        "anchor": "#一-es6-解构赋值-现代推荐",
        "id": "一-es6-解构赋值-现代推荐"
      },
      {
        "title": "二、经典临时中间变量法",
        "anchor": "#二-经典临时中间变量法",
        "id": "二-经典临时中间变量法"
      },
      {
        "title": "三、数值加减运算法（仅限数值类型）",
        "anchor": "#三-数值加减运算法-仅限数值类型",
        "id": "三-数值加减运算法-仅限数值类型"
      },
      {
        "title": "四、位异或运算法 (XOR 仅限整数)",
        "anchor": "#四-位异或运算法-xor-仅限整数",
        "id": "四-位异或运算法-xor-仅限整数"
      }
    ]
  },
  {
    "id": "json-deep-clone-423f",
    "type": "post",
    "title": "JavaScript 引用类型对象深拷贝与 JSON 序列化技巧",
    "url": "posts/json-deep-clone-423f.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-02-15",
    "tags": [
      "JavaScript",
      "深拷贝",
      "JSON",
      "引用类型"
    ],
    "summary": "深入分析 JavaScript 中引用类型的浅拷贝与深拷贝，探讨 JSON.parse(JSON.stringify()) 序列化方案与递归深克隆的边界处理。",
    "content": "JavaScript 引用类型对象深拷贝与 JSON 序列化技巧 一、引用类型的引用传递问题 在 JavaScript 中，对象和数组均属于引用数据类型。如果直接使用赋值符 const copy = obj ，修改新对象的同时会直接污染原对象。 --- 二、基于 JSON 序列化的极简深拷贝 对于纯数据（没有函数、 undefined 、Symbol 或循环引用）的对象，JSON 序列化是最轻量的深克隆方式： javascript const original = { id: 1, user: { name: 'admin', roles: 'editor', 'viewer' } }; // 极简深克隆 const cloned = JSON.parse JSON.stringify original ; cloned.user.name = 'super_admin'; console.log original.user.name ; // 输出: 'admin' 原对象未被污染 console.log cloned.user.name ; // 输出: 'super_admin' --- 三、通用深度递归克隆函数 支持数组、嵌套对象、日期等完整类型的递归拷贝： javascript / 健壮的深度克隆函数 @param { } target 目标对象 @returns { } 克隆后的新副本 / function deepClone target { if target === null || typeof target !== 'object' { return target; } if target instanceof Date return new Date target ; if target instanceof RegExp return new RegExp target ; const cloneTarget = Array.isArray target ? : {}; for let key in target { if Object.prototype.hasOwnProperty.call target, key { cloneTarget key = deepClone target key ; } } return cloneTarget; }",
    "sections": [
      {
        "title": "一、引用类型的引用传递问题",
        "anchor": "#一-引用类型的引用传递问题",
        "id": "一-引用类型的引用传递问题"
      },
      {
        "title": "二、基于 JSON 序列化的极简深拷贝",
        "anchor": "#二-基于-json-序列化的极简深拷贝",
        "id": "二-基于-json-序列化的极简深拷贝"
      },
      {
        "title": "三、通用深度递归克隆函数",
        "anchor": "#三-通用深度递归克隆函数",
        "id": "三-通用深度递归克隆函数"
      }
    ]
  },
  {
    "id": "js-get-url-params-aa13",
    "type": "post",
    "title": "JavaScript 获取当前页面 URL 查询参数的高效解析方案",
    "url": "posts/js-get-url-params-aa13.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-01-25",
    "tags": [
      "JavaScript",
      "URL参数",
      "URLSearchParams",
      "浏览器"
    ],
    "summary": "详细解析获取 URL Query 参数的多种方案：现代 URLSearchParams 原生 API、正则表达式提取与字符串分割转换。",
    "content": "JavaScript 获取当前页面 URL 查询参数的高效解析方案 一、现代原生 API：URLSearchParams（强烈推荐） 现代主流浏览器均内置了 URLSearchParams ，无需自行编写复杂正则： javascript // 示例 URL: https://example.com/index.html?name=vmrey&lang=zh-CN const urlParams = new URLSearchParams window.location.search ; // 获取单个参数 const name = urlParams.get 'name' ; // 'vmrey' const lang = urlParams.get 'lang' ; // 'zh-CN' // 转换为完整 JSON 对象 const paramsObj = Object.fromEntries urlParams.entries ; console.log paramsObj ; // { name: 'vmrey', lang: 'zh-CN' } --- 二、经典通用字符串分割解析法（全环境兼容） javascript / 提取 URL 查询参数并转换为键值对象 @param {String} customUrl 可选自定义 URL @returns {Object} 参数键值对 / function getUrlParams customUrl { const url = customUrl || window.location.href; const queryIndex = url.indexOf '?' ; if queryIndex === -1 return {}; const queryString = url.slice queryIndex + 1 ; const pairs = queryString.split '&' ; const result = {}; pairs.forEach pair => { if !pair return; const key, value = pair.split '=' ; result decodeURIComponent key = decodeURIComponent value || '' ; } ; return result; } // 调用示例 console.log getUrlParams 'https://vmrey.github.io/?tag=Vue&page=2' ; // 输出: { tag: 'Vue', page: '2' }",
    "sections": [
      {
        "title": "一、现代原生 API：URLSearchParams（强烈推荐）",
        "anchor": "#一-现代原生-api-urlsearchparams-强烈推荐",
        "id": "一-现代原生-api-urlsearchparams-强烈推荐"
      },
      {
        "title": "二、经典通用字符串分割解析法（全环境兼容）",
        "anchor": "#二-经典通用字符串分割解析法-全环境兼容",
        "id": "二-经典通用字符串分割解析法-全环境兼容"
      }
    ]
  },
  {
    "id": "wx-loading-anim-2498",
    "type": "post",
    "title": "微信小程序自定义高颜值 Loading 加载动画组件",
    "url": "posts/wx-loading-anim-2498.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-01-20",
    "tags": [
      "微信小程序",
      "Loading",
      "CSS3动画",
      "UI设计"
    ],
    "summary": "告别默认 wx.showLoading 灰暗样式，使用纯 CSS3 关键帧动画打造现代多点旋转数据加载组件。",
    "content": "微信小程序自定义高颜值 Loading 加载动画组件 一、效果预览 ! Loading 效果图 ../assets/images/loading.png --- 二、WXML 骨架 html <view class=\"loading-mask\" wx:if=\"{{loading}}\"> <view class=\"loading-spinner\"> <view class=\"dot\" wx:for=\"{{8}}\" wx:key=\"index\" style=\"--i: {{index}}\"></view> </view> <view class=\"loading-text\">{{loadingText || '数据加载中...'}}</view> </view> --- 三、WXSS 纯 CSS3 旋转动画 css .loading-mask { position: fixed; inset: 0; background: rgba 0, 0, 0, 0.75 ; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; } .loading-spinner { position: relative; width: 60rpx; height: 60rpx; margin-bottom: 20rpx; } .loading-spinner .dot { position: absolute; width: 6rpx; height: 6rpx; border-radius: 50%; background: ffffff; animation: pulse 0.8s linear infinite; } @keyframes pulse { 0%, 100% { transform: scale 1 ; opacity: 0.3; } 50% { transform: scale 2.5 ; opacity: 1; } } .loading-text { color: ffffff; font-size: 26rpx; }",
    "sections": [
      {
        "title": "一、效果预览",
        "anchor": "#一-效果预览",
        "id": "一-效果预览"
      },
      {
        "title": "二、WXML 骨架",
        "anchor": "#二-wxml-骨架",
        "id": "二-wxml-骨架"
      },
      {
        "title": "三、WXSS 纯 CSS3 旋转动画",
        "anchor": "#三-wxss-纯-css3-旋转动画",
        "id": "三-wxss-纯-css3-旋转动画"
      }
    ]
  },
  {
    "id": "wx-coupon-modal-b6eb",
    "type": "post",
    "title": "微信小程序新手专属优惠券领取弹框组件封装实战",
    "url": "posts/wx-coupon-modal-b6eb.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-01-15",
    "tags": [
      "微信小程序",
      "组件封装",
      "优惠券弹框",
      "UI组件"
    ],
    "summary": "封装高转化率的微信小程序优惠券弹框组件，支持防页面滚动穿透、动态金额展示与一键领取交互。",
    "content": "微信小程序新手专属优惠券领取弹框组件封装实战 一、组件设计特性 1. 防滚动穿透 ：通过 catchtouchmove=\"preventTouch\" 防止弹框唤起时底层页面意外滑动； 2. 响应式自适应 ：使用 rpx 单位适配不同尺寸移动设备屏幕； 3. 动画进入 ：遮罩层淡入与弹框缩放弹性进入。 --- 二、WXML 模板代码 html <view class=\"coupon-mask\" wx:if=\"{{visible}}\" catchtouchmove=\"preventTouch\"> <view class=\"coupon-dialog\"> <image class=\"coupon-bg\" src=\"../../assets/images/couponbg.png\" mode=\"widthFix\"></image> <view class=\"coupon-body\"> <view class=\"coupon-title\">新人专属红包</view> <view class=\"coupon-amount\"> <text class=\"symbol\">¥</text> <text class=\"num\">{{couponData.amount || 50}}</text> </view> <button class=\"coupon-btn\" bindtap=\"handleReceive\">立即领取</button> </view> <view class=\"close-icon\" bindtap=\"handleClose\">✕</view> </view> </view> --- 三、WXSS 样式核心 css .coupon-mask { position: fixed; inset: 0; background: rgba 0, 0, 0, 0.7 ; z-index: 9999; display: flex; align-items: center; justify-content: center; } .coupon-dialog { width: 580rpx; position: relative; text-align: center; } .coupon-btn { background: linear-gradient 135deg, ff5722, ff9800 ; color: fff; border-radius: 40rpx; font-weight: bold; }",
    "sections": [
      {
        "title": "一、组件设计特性",
        "anchor": "#一-组件设计特性",
        "id": "一-组件设计特性"
      },
      {
        "title": "二、WXML 模板代码",
        "anchor": "#二-wxml-模板代码",
        "id": "二-wxml-模板代码"
      },
      {
        "title": "三、WXSS 样式核心",
        "anchor": "#三-wxss-样式核心",
        "id": "三-wxss-样式核心"
      }
    ]
  },
  {
    "id": "wx-bubble-sort-6378",
    "type": "post",
    "title": "微信小程序中对象数组冒泡排序算法实现与实战",
    "url": "posts/wx-bubble-sort-6378.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2021-01-10",
    "tags": [
      "微信小程序",
      "冒泡排序",
      "数组对象",
      "算法"
    ],
    "summary": "详细解析在微信小程序环境下，对复杂对象数组根据价格、销量或 ID 字段进行冒泡升序与降序排序的稳定实现。",
    "content": "微信小程序中对象数组冒泡排序算法实现与实战 一、算法原理 冒泡排序（Bubble Sort）通过依次比较相邻两个元素的值，如果顺序不符合预期则交换位置。多次循环后，最值元素将如气泡般逐渐“浮”到数列顶端。 --- 二、小程序对象数组排序函数 javascript / 微信小程序对象数组排序 @param {Array} arr 数据数组 @param {Number} sortOrder 1 为升序，-1 为降序 @param {String} key 比较的字段名称 / function bubbleSortObjects arr = , sortOrder = 1, key { const result = JSON.parse JSON.stringify arr ; const len = result.length; for let i = 0; i < len - 1; i++ { for let j = 0; j < len - 1 - i; j++ { const valA = result j key ; const valB = result j + 1 key ; if sortOrder === 1 && valA > valB { result j , result j + 1 = result j + 1 , result j ; } else if sortOrder === -1 && valA < valB { result j , result j + 1 = result j + 1 , result j ; } } } return result; } // 示例：按商品价格从低到高排序 const goodsList = { id: 1, name: '机械键盘', price: 299 }, { id: 2, name: '无线鼠标', price: 99 }, { id: 3, name: '4K显示器', price: 1899 } ; console.log bubbleSortObjects goodsList, 1, 'price' ;",
    "sections": [
      {
        "title": "一、算法原理",
        "anchor": "#一-算法原理",
        "id": "一-算法原理"
      },
      {
        "title": "二、小程序对象数组排序函数",
        "anchor": "#二-小程序对象数组排序函数",
        "id": "二-小程序对象数组排序函数"
      }
    ]
  },
  {
    "id": "wx-canvas-curve-75af",
    "type": "post",
    "title": "微信小程序原生 Canvas 绘制平滑贝塞尔曲线图组件",
    "url": "posts/wx-canvas-curve-75af.html",
    "externalUrl": "",
    "category": "前端开发",
    "date": "2020-12-31",
    "tags": [
      "微信小程序",
      "Canvas",
      "曲线图",
      "数据可视化"
    ],
    "summary": "无需引入重量级图表库，利用微信小程序原生 Canvas 2D 绘制轻量、高帧率且支持动态数据折线/平滑曲线图。",
    "content": "微信小程序原生 Canvas 绘制平滑贝塞尔曲线图组件 一、效果预览 利用原生 Canvas 的 bezierCurveTo 贝塞尔曲线算法，绘制出柔和渐变填充的高性能趋势曲线图： ! 曲线图效果图 ../assets/images/202012312228845.png --- 二、WXML 布局代码 html <view class=\"chart-container\"> <canvas type=\"2d\" id=\"curveCanvas\" class=\"curve-canvas\"></canvas> </view> --- 三、JS 核心平滑曲线绘制算法 javascript Page { onReady { const query = wx.createSelectorQuery ; query.select ' curveCanvas' .fields { node: true, size: true } .exec res => { if !res 0 return; const canvas = res 0 .node; const ctx = canvas.getContext '2d' ; const dpr = wx.getSystemInfoSync .pixelRatio; canvas.width = res 0 .width dpr; canvas.height = res 0 .height dpr; ctx.scale dpr, dpr ; this.drawCurve ctx, res 0 .width, res 0 .height ; } ; }, drawCurve ctx, width, height { const points = { x: 30, y: 120 }, { x: 90, y: 50 }, { x: 150, y: 80 }, { x: 210, y: 30 }, { x: 270, y: 90 } ; ctx.clearRect 0, 0, width, height ; ctx.beginPath ; ctx.moveTo points 0 .x, points 0 .y ; // 计算三阶贝塞尔曲线控制点 for let i = 0; i < points.length - 1; i++ { const xc = points i .x + points i + 1 .x / 2; const yc = points i .y + points i + 1 .y / 2; ctx.quadraticCurveTo points i .x, points i .y, xc, yc ; } ctx.strokeStyle = ' 0284c7'; ctx.lineWidth = 3; ctx.stroke ; } } ;",
    "sections": [
      {
        "title": "一、效果预览",
        "anchor": "#一-效果预览",
        "id": "一-效果预览"
      },
      {
        "title": "二、WXML 布局代码",
        "anchor": "#二-wxml-布局代码",
        "id": "二-wxml-布局代码"
      },
      {
        "title": "三、JS 核心平滑曲线绘制算法",
        "anchor": "#三-js-核心平滑曲线绘制算法",
        "id": "三-js-核心平滑曲线绘制算法"
      }
    ]
  },
  {
    "id": "ai-google-gemini",
    "type": "ai",
    "title": "Google Gemini",
    "url": "ai.html#ai-google-gemini",
    "externalUrl": "https://gemini.google.com/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "Gemini",
      "Google",
      "多模态",
      "超长上下文",
      "LLM"
    ],
    "summary": "Google 旗舰原生多模态大模型，具备百万超长上下文与深度理解 — Google 最强大的多模态大语言模型，支持文本、代码、图像、音频与视频原生理解，拥有业界领先的超长上下文窗口与 Google 生态深度协同。",
    "content": "Google Gemini https://gemini.google.com/ Google 旗舰原生多模态大模型，具备百万超长上下文与深度理解 Google 最强大的多模态大语言模型，支持文本、代码、图像、音频与视频原生理解，拥有业界领先的超长上下文窗口与 Google 生态深度协同。 Gemini Google 多模态 超长上下文 LLM",
    "sections": []
  },
  {
    "id": "ai-chatgpt",
    "type": "ai",
    "title": "ChatGPT",
    "url": "ai.html#ai-chatgpt",
    "externalUrl": "https://chatgpt.com/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "ChatGPT",
      "OpenAI",
      "GPT-4o",
      "深度思考",
      "AI助手"
    ],
    "summary": "OpenAI 全球领先的 AI 智能助手，搭载 GPT-4o 与深度推理模型 — 引领生成式 AI 浪潮的代表作。集成 GPT-4o 实时多模态交互、o1/o3 复杂数学代码深度思考能力、网络搜索与全能高级数据分析。",
    "content": "ChatGPT https://chatgpt.com/ OpenAI 全球领先的 AI 智能助手，搭载 GPT-4o 与深度推理模型 引领生成式 AI 浪潮的代表作。集成 GPT-4o 实时多模态交互、o1/o3 复杂数学代码深度思考能力、网络搜索与全能高级数据分析。 ChatGPT OpenAI GPT-4o 深度思考 AI助手",
    "sections": []
  },
  {
    "id": "ai-claude",
    "type": "ai",
    "title": "Claude",
    "url": "ai.html#ai-claude",
    "externalUrl": "https://claude.ai/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "Claude",
      "Anthropic",
      "编程神器",
      "长文本",
      "Sonnet"
    ],
    "summary": "Anthropic 出品的高智能、强逻辑与卓越编程能力的旗舰 AI — 以超强代码编写、自然文字表达与严谨逻辑推理闻名的顶尖模型（Claude 3.5 Sonnet / Opus），支持 Projects 项目上下文管理与 Artifacts 即时交互。",
    "content": "Claude https://claude.ai/ Anthropic 出品的高智能、强逻辑与卓越编程能力的旗舰 AI 以超强代码编写、自然文字表达与严谨逻辑推理闻名的顶尖模型（Claude 3.5 Sonnet / Opus），支持 Projects 项目上下文管理与 Artifacts 即时交互。 Claude Anthropic 编程神器 长文本 Sonnet",
    "sections": []
  },
  {
    "id": "ai-deepseek-深度求索",
    "type": "ai",
    "title": "DeepSeek (深度求索)",
    "url": "ai.html#ai-deepseek-深度求索",
    "externalUrl": "https://chat.deepseek.com/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "DeepSeek",
      "R1推理",
      "开源模型",
      "代码生成",
      "深度求索"
    ],
    "summary": "国产顶尖开源推理与通用大模型，以惊艳性能与高性价比享誉全球 — 深度求索推出的新一代国产顶尖开源模型，DeepSeek-R1 具备极强思维链深度推理能力，DeepSeek-V3 在多语言、代码与数学上达到世界一流水平。",
    "content": "DeepSeek (深度求索) https://chat.deepseek.com/ 国产顶尖开源推理与通用大模型，以惊艳性能与高性价比享誉全球 深度求索推出的新一代国产顶尖开源模型，DeepSeek-R1 具备极强思维链深度推理能力，DeepSeek-V3 在多语言、代码与数学上达到世界一流水平。 DeepSeek R1推理 开源模型 代码生成 深度求索",
    "sections": []
  },
  {
    "id": "ai-kimi-月之暗面",
    "type": "ai",
    "title": "Kimi (月之暗面)",
    "url": "ai.html#ai-kimi-月之暗面",
    "externalUrl": "https://kimi.moonshot.cn/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "Kimi",
      "月之暗面",
      "联网搜索",
      "长文本",
      "研报分析"
    ],
    "summary": "国内领先的超长文本 AI 搜索与知识助手，支持长文档深度精读 — 月之暗面推出的高智能知识助手，支持百万字长文档、多篇研报与网页即时深度检索，具备强大的联网搜索与精准信息提炼能力。",
    "content": "Kimi (月之暗面) https://kimi.moonshot.cn/ 国内领先的超长文本 AI 搜索与知识助手，支持长文档深度精读 月之暗面推出的高智能知识助手，支持百万字长文档、多篇研报与网页即时深度检索，具备强大的联网搜索与精准信息提炼能力。 Kimi 月之暗面 联网搜索 长文本 研报分析",
    "sections": []
  },
  {
    "id": "ai-grok",
    "type": "ai",
    "title": "Grok",
    "url": "ai.html#ai-grok",
    "externalUrl": "https://grok.com/",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-31",
    "tags": [
      "Grok",
      "xAI",
      "ElonMusk",
      "实时资讯",
      "多模态"
    ],
    "summary": "xAI 出品的幽默智能大模型，深度整合全球实时资讯脉搏 — Elon Musk 创立的 xAI 推出的全新一代智能大模型，具备敏锐的实时事件感知、卓越的视觉图像理解与自然直接的对话风格。",
    "content": "Grok https://grok.com/ xAI 出品的幽默智能大模型，深度整合全球实时资讯脉搏 Elon Musk 创立的 xAI 推出的全新一代智能大模型，具备敏锐的实时事件感知、卓越的视觉图像理解与自然直接的对话风格。 Grok xAI ElonMusk 实时资讯 多模态",
    "sections": []
  },
  {
    "id": "ai-claude-code",
    "type": "ai",
    "title": "Claude Code",
    "url": "ai.html#ai-claude-code",
    "externalUrl": "https://github.com/anthropics/claude-code",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-31",
    "tags": [
      "ClaudeCode",
      "AI编程",
      "Agent",
      "智能体",
      "CLI工具"
    ],
    "summary": "Anthropic 官方终端自主 AI 智能体，直接读写并排查工程代码 — 运行在终端里的新一代智能编程 Agent，能够自主理解大型复杂代码库、执行文件编辑、运行测试用例、排查 Git 差异并一键提交。",
    "content": "Claude Code https://github.com/anthropics/claude-code Anthropic 官方终端自主 AI 智能体，直接读写并排查工程代码 运行在终端里的新一代智能编程 Agent，能够自主理解大型复杂代码库、执行文件编辑、运行测试用例、排查 Git 差异并一键提交。 ClaudeCode AI编程 Agent 智能体 CLI工具",
    "sections": []
  },
  {
    "id": "ai-cursor",
    "type": "ai",
    "title": "Cursor",
    "url": "ai.html#ai-cursor",
    "externalUrl": "https://www.cursor.com/",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-31",
    "tags": [
      "Cursor",
      "VSCode",
      "AI编程",
      "Composer",
      "生产力"
    ],
    "summary": "重新定义生产力的新一代 AI 驱动代码编辑器，全球开发者狂赞 — 基于 VS Code 深度定制的顶尖 AI IDE。内置全局代码库语义索引、多文件智能协同编辑 Composer、行间智能预测 Tab 与一键 Bug 修复。",
    "content": "Cursor https://www.cursor.com/ 重新定义生产力的新一代 AI 驱动代码编辑器，全球开发者狂赞 基于 VS Code 深度定制的顶尖 AI IDE。内置全局代码库语义索引、多文件智能协同编辑 Composer、行间智能预测 Tab 与一键 Bug 修复。 Cursor VSCode AI编程 Composer 生产力",
    "sections": []
  },
  {
    "id": "ai-v0-by-vercel",
    "type": "ai",
    "title": "v0 by Vercel",
    "url": "ai.html#ai-v0-by-vercel",
    "externalUrl": "https://v0.dev/",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-31",
    "tags": [
      "v0",
      "Vercel",
      "React",
      "TailwindCSS",
      "前端生成"
    ],
    "summary": "基于自然语言提示词秒级生成高质量现代化 React / Tailwind UI — Vercel 出品的 UI 生成神器，通过简单对话即刻产出符合现代设计美学的 React 组件代码，支持一键复制代码或无缝部署到 Next.js 项目。",
    "content": "v0 by Vercel https://v0.dev/ 基于自然语言提示词秒级生成高质量现代化 React / Tailwind UI Vercel 出品的 UI 生成神器，通过简单对话即刻产出符合现代设计美学的 React 组件代码，支持一键复制代码或无缝部署到 Next.js 项目。 v0 Vercel React TailwindCSS 前端生成",
    "sections": []
  },
  {
    "id": "ai-bolt-new",
    "type": "ai",
    "title": "Bolt.new",
    "url": "ai.html#ai-bolt-new",
    "externalUrl": "https://bolt.new/",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-31",
    "tags": [
      "Bolt.new",
      "全栈开发",
      "WebContainers",
      "即时部署",
      "Agent"
    ],
    "summary": "在浏览器端全自动生成、安装依赖与即时部署全栈应用的 AI Agent — 基于 WebContainers 技术的端到端全栈开发智能体，用户只需描述需求即可在浏览器内自动搭建框架、编写后端 API、安装 npm 包并实时运行。",
    "content": "Bolt.new https://bolt.new/ 在浏览器端全自动生成、安装依赖与即时部署全栈应用的 AI Agent 基于 WebContainers 技术的端到端全栈开发智能体，用户只需描述需求即可在浏览器内自动搭建框架、编写后端 API、安装 npm 包并实时运行。 Bolt.new 全栈开发 WebContainers 即时部署 Agent",
    "sections": []
  },
  {
    "id": "ai-agnes-ai",
    "type": "ai",
    "title": "Agnes AI",
    "url": "ai.html#ai-agnes-ai",
    "externalUrl": "https://platform.agnes-ai.com/",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-31",
    "tags": [
      "AgnesAI",
      "AI智能体",
      "Agent",
      "工作流",
      "自动化",
      "AI平台"
    ],
    "summary": "新一代自进化智能体与企业级自主工作流编排执行平台 — 专注于复杂任务自动化与端到端工作流编排的高性能 AI Agent 平台，支持多模型智能调度、多智能体协同协作与深度业务场景落地。",
    "content": "Agnes AI https://platform.agnes-ai.com/ 新一代自进化智能体与企业级自主工作流编排执行平台 专注于复杂任务自动化与端到端工作流编排的高性能 AI Agent 平台，支持多模型智能调度、多智能体协同协作与深度业务场景落地。 AgnesAI AI智能体 Agent 工作流 自动化 AI平台",
    "sections": []
  },
  {
    "id": "ai-midjourney",
    "type": "ai",
    "title": "Midjourney",
    "url": "ai.html#ai-midjourney",
    "externalUrl": "https://www.midjourney.com/",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-31",
    "tags": [
      "Midjourney",
      "AI绘画",
      "艺术创作",
      "图像生成",
      "设计"
    ],
    "summary": "全球公认顶尖的 AI 艺术图像生成工具，电影级光影与质感 — 行业首屈一指的文本生成图像平台，以无与伦比的艺术美感、逼真的写实光影、细腻的材质纹理与丰富的风格掌控力闻名于世。",
    "content": "Midjourney https://www.midjourney.com/ 全球公认顶尖的 AI 艺术图像生成工具，电影级光影与质感 行业首屈一指的文本生成图像平台，以无与伦比的艺术美感、逼真的写实光影、细腻的材质纹理与丰富的风格掌控力闻名于世。 Midjourney AI绘画 艺术创作 图像生成 设计",
    "sections": []
  },
  {
    "id": "ai-flux-1-black-forest-labs",
    "type": "ai",
    "title": "FLUX.1 (Black Forest Labs)",
    "url": "ai.html#ai-flux-1-black-forest-labs",
    "externalUrl": "https://blackforestlabs.ai/",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-31",
    "tags": [
      "FLUX.1",
      "开源模型",
      "文字排版",
      "生图利器",
      "BFL"
    ],
    "summary": "原 SD 核心团队创立的顶尖开源生图模型，文字渲染与画质绝佳 — 新一代革命性开源图像生成模型，具备卓越的自然语言提示词遵循度、高精细度复杂人体手部还原以及精准清晰的英文字母直接排版渲染能力。",
    "content": "FLUX.1 (Black Forest Labs) https://blackforestlabs.ai/ 原 SD 核心团队创立的顶尖开源生图模型，文字渲染与画质绝佳 新一代革命性开源图像生成模型，具备卓越的自然语言提示词遵循度、高精细度复杂人体手部还原以及精准清晰的英文字母直接排版渲染能力。 FLUX.1 开源模型 文字排版 生图利器 BFL",
    "sections": []
  },
  {
    "id": "ai-runway-gen-3",
    "type": "ai",
    "title": "Runway Gen-3",
    "url": "ai.html#ai-runway-gen-3",
    "externalUrl": "https://runwayml.com/",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-31",
    "tags": [
      "Runway",
      "Gen-3",
      "AI视频",
      "动态渲染",
      "创意设计"
    ],
    "summary": "电影工业级高保真 AI 视频生成与多模态创意渲染套件 — 领先的视频生成与视觉特效平台，支持文本生视频、图片生视频、精准运镜控制与动态画笔，广泛应用于影视创意、广告与短视频制作。",
    "content": "Runway Gen-3 https://runwayml.com/ 电影工业级高保真 AI 视频生成与多模态创意渲染套件 领先的视频生成与视觉特效平台，支持文本生视频、图片生视频、精准运镜控制与动态画笔，广泛应用于影视创意、广告与短视频制作。 Runway Gen-3 AI视频 动态渲染 创意设计",
    "sections": []
  },
  {
    "id": "ai-openrouter",
    "type": "ai",
    "title": "OpenRouter",
    "url": "ai.html#ai-openrouter",
    "externalUrl": "https://openrouter.ai/",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-31",
    "tags": [
      "OpenRouter",
      "模型网关",
      "API聚合",
      "低成本",
      "开发者"
    ],
    "summary": "全球统一的大模型 API 路由聚合网关，低门槛调用上百款大模型 — 极具性价比的统一大模型接入平台。仅需一个 API Key 即可低延迟调用包括 Claude 3.5、GPT-4o、DeepSeek、Llama 3 等全球所有主流模型。",
    "content": "OpenRouter https://openrouter.ai/ 全球统一的大模型 API 路由聚合网关，低门槛调用上百款大模型 极具性价比的统一大模型接入平台。仅需一个 API Key 即可低延迟调用包括 Claude 3.5、GPT-4o、DeepSeek、Llama 3 等全球所有主流模型。 OpenRouter 模型网关 API聚合 低成本 开发者",
    "sections": []
  },
  {
    "id": "ai-hugging-face",
    "type": "ai",
    "title": "Hugging Face",
    "url": "ai.html#ai-hugging-face",
    "externalUrl": "https://huggingface.co/",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-31",
    "tags": [
      "HuggingFace",
      "开源社区",
      "Transformers",
      "模型下载",
      "Spaces"
    ],
    "summary": "全球最大的开源 AI 模型、数据集与 Web 演示应用社区中心 — AI 领域的 GitHub。聚集了全球最新开源权重（Transformers/Diffusers）、开源数据集与 Spaces 云端演示，是探索与部署开源 AI 的首选地。",
    "content": "Hugging Face https://huggingface.co/ 全球最大的开源 AI 模型、数据集与 Web 演示应用社区中心 AI 领域的 GitHub。聚集了全球最新开源权重（Transformers/Diffusers）、开源数据集与 Spaces 云端演示，是探索与部署开源 AI 的首选地。 HuggingFace 开源社区 Transformers 模型下载 Spaces",
    "sections": []
  },
  {
    "id": "ai-siliconflow-硅基流动",
    "type": "ai",
    "title": "SiliconFlow (硅基流动)",
    "url": "ai.html#ai-siliconflow-硅基流动",
    "externalUrl": "https://siliconflow.cn/",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-31",
    "tags": [
      "SiliconFlow",
      "硅基流动",
      "DeepSeek",
      "极速API",
      "国产云"
    ],
    "summary": "极致性能的国产大模型云服务与推理加速平台，提供稳定 API — 专注大模型高效推理的云服务平台，深度优化开源模型推理并发与吞吐，提供 DeepSeek-R1/V3、FLUX 等顶级模型的低延迟、高可用 API 接入。",
    "content": "SiliconFlow (硅基流动) https://siliconflow.cn/ 极致性能的国产大模型云服务与推理加速平台，提供稳定 API 专注大模型高效推理的云服务平台，深度优化开源模型推理并发与吞吐，提供 DeepSeek-R1/V3、FLUX 等顶级模型的低延迟、高可用 API 接入。 SiliconFlow 硅基流动 DeepSeek 极速API 国产云",
    "sections": []
  },
  {
    "id": "tool-草料二维码",
    "type": "tool",
    "title": "草料二维码",
    "url": "tools.html#tool-草料二维码",
    "externalUrl": "https://cli.im/",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-31",
    "tags": [
      "二维码",
      "QR Code",
      "生成器",
      "常用工具",
      "图片"
    ],
    "summary": "国内领先的专业二维码在线生成、解析与美化设计平台 — 支持文本、网址链接、图片、文件、名片等多种内容一键生成二维码，提供丰富高颜值样式定制、参数微调与高清矢量/位图导出。",
    "content": "草料二维码 https://cli.im/ 国内领先的专业二维码在线生成、解析与美化设计平台 支持文本、网址链接、图片、文件、名片等多种内容一键生成二维码，提供丰富高颜值样式定制、参数微调与高清矢量/位图导出。 二维码 QR Code 生成器 常用工具 图片",
    "sections": []
  },
  {
    "id": "tool-1password-强密码生成器",
    "type": "tool",
    "title": "1Password 强密码生成器",
    "url": "tools.html#tool-1password-强密码生成器",
    "externalUrl": "https://1password.com/zh-cn/password-generator",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-31",
    "tags": [
      "1Password",
      "密码生成器",
      "安全工具",
      "随机密码",
      "信息安全"
    ],
    "summary": "1Password 官方出品的免费高安全度随机强密码与密码短语生成器 — 基于客户端加密安全随机数发生器，支持自定义密码长度、字符集组合（大小写/数字/符号）与易记密码短语生成，远离账号撞库与弱密码风险。",
    "content": "1Password 强密码生成器 https://1password.com/zh-cn/password-generator 1Password 官方出品的免费高安全度随机强密码与密码短语生成器 基于客户端加密安全随机数发生器，支持自定义密码长度、字符集组合（大小写/数字/符号）与易记密码短语生成，远离账号撞库与弱密码风险。 1Password 密码生成器 安全工具 随机密码 信息安全",
    "sections": []
  },
  {
    "id": "tool-轻松传-easychuan",
    "type": "tool",
    "title": "轻松传 (EasyChuan)",
    "url": "tools.html#tool-轻松传-easychuan",
    "externalUrl": "https://easychuan.cn/",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-31",
    "tags": [
      "轻松传",
      "文件传输",
      "快传",
      "剪贴板同步",
      "免安装",
      "局域网"
    ],
    "summary": "极简纯净的免安装跨设备局域网与公网文件快传及文本同步工具 — 无需登录、即开即用的多端文件传输神器。通过浏览器生成提取码或扫码即可实现手机与电脑间极速传输大文件、图片与剪贴板文本，安全不限速。",
    "content": "轻松传 (EasyChuan) https://easychuan.cn/ 极简纯净的免安装跨设备局域网与公网文件快传及文本同步工具 无需登录、即开即用的多端文件传输神器。通过浏览器生成提取码或扫码即可实现手机与电脑间极速传输大文件、图片与剪贴板文本，安全不限速。 轻松传 文件传输 快传 剪贴板同步 免安装 局域网",
    "sections": []
  },
  {
    "id": "tool-smallpdf-pdf-转-word",
    "type": "tool",
    "title": "Smallpdf (PDF 转 Word)",
    "url": "tools.html#tool-smallpdf-pdf-转-word",
    "externalUrl": "https://smallpdf.com/cn/pdf-to-word",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-31",
    "tags": [
      "Smallpdf",
      "PDF转Word",
      "格式转换",
      "文档处理",
      "办公工具",
      "在线转换"
    ],
    "summary": "专业高保真在线 PDF 转 Word (DOCX) 文档与格式转换平台 — 全球知名的免安装在线 PDF 处理套件，支持将 PDF 文件极速无损转换为可自由编辑的 Word (DOCX) 文档，高精度保留原始排版与版面元素。",
    "content": "Smallpdf (PDF 转 Word) https://smallpdf.com/cn/pdf-to-word 专业高保真在线 PDF 转 Word (DOCX) 文档与格式转换平台 全球知名的免安装在线 PDF 处理套件，支持将 PDF 文件极速无损转换为可自由编辑的 Word (DOCX) 文档，高精度保留原始排版与版面元素。 Smallpdf PDF转Word 格式转换 文档处理 办公工具 在线转换",
    "sections": []
  },
  {
    "id": "tool-mobaxterm",
    "type": "tool",
    "title": "MobaXterm",
    "url": "tools.html#tool-mobaxterm",
    "externalUrl": "https://mobaxterm.mobatek.net/",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-31",
    "tags": [
      "MobaXterm",
      "SSH",
      "X11",
      "RDP",
      "VNC",
      "终端箱",
      "远程连接"
    ],
    "summary": "Windows 平台最全能的远程计算工具箱与一体化终端管理器 — 集成 SSH、X11、RDP、VNC、FTP/SFTP 等全协议支持，内建丰富的 Unix 工具集与图形化多标签终端界面，远程运维终极解决方案。",
    "content": "MobaXterm https://mobaxterm.mobatek.net/ Windows 平台最全能的远程计算工具箱与一体化终端管理器 集成 SSH、X11、RDP、VNC、FTP/SFTP 等全协议支持，内建丰富的 Unix 工具集与图形化多标签终端界面，远程运维终极解决方案。 MobaXterm SSH X11 RDP VNC 终端箱 远程连接",
    "sections": []
  },
  {
    "id": "tool-finalshell",
    "type": "tool",
    "title": "FinalShell",
    "url": "tools.html#tool-finalshell",
    "externalUrl": "http://www.hostbuf.com/",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-31",
    "tags": [
      "FinalShell",
      "SSH",
      "终端工具",
      "SFTP",
      "Linux运维",
      "服务器管理"
    ],
    "summary": "一体化多平台国产良心 SSH 终端与服务器实时监控管理软件 — 深度整合 SSH 客户端与服务器硬件状态实时监测（CPU/内存/网络/进程），支持可视化 SFTP 文件管理与命令智能自动补全。",
    "content": "FinalShell http://www.hostbuf.com/ 一体化多平台国产良心 SSH 终端与服务器实时监控管理软件 深度整合 SSH 客户端与服务器硬件状态实时监测（CPU/内存/网络/进程），支持可视化 SFTP 文件管理与命令智能自动补全。 FinalShell SSH 终端工具 SFTP Linux运维 服务器管理",
    "sections": []
  },
  {
    "id": "tool-aapanel-宝塔国际版",
    "type": "tool",
    "title": "aaPanel (宝塔国际版)",
    "url": "tools.html#tool-aapanel-宝塔国际版",
    "externalUrl": "https://www.aapanel.com/new/download.html",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-31",
    "tags": [
      "aaPanel",
      "宝塔面板",
      "服务器运维",
      "Linux面板",
      "LAMP",
      "LNMP",
      "建站工具"
    ],
    "summary": "简单强大且纯净免绑定的 Linux / Windows 服务器可视化运维管理面板 — 宝塔面板官方面向全球开发者的国际版本，提供 LNMP / LAMP 运行环境一键部署、网站管理、数据库、FTP、文件管理器与 SSL 证书自动续期。",
    "content": "aaPanel (宝塔国际版) https://www.aapanel.com/new/download.html 简单强大且纯净免绑定的 Linux / Windows 服务器可视化运维管理面板 宝塔面板官方面向全球开发者的国际版本，提供 LNMP / LAMP 运行环境一键部署、网站管理、数据库、FTP、文件管理器与 SSL 证书自动续期。 aaPanel 宝塔面板 服务器运维 Linux面板 LAMP LNMP 建站工具",
    "sections": []
  },
  {
    "id": "tool-mqttx",
    "type": "tool",
    "title": "MQTTX",
    "url": "tools.html#tool-mqttx",
    "externalUrl": "https://mqttx.app/zh/downloads",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-31",
    "tags": [
      "MQTTX",
      "MQTT",
      "客户端",
      "物联网",
      "IoT调试",
      "跨平台",
      "EMQ"
    ],
    "summary": "全功能跨平台开源 MQTT 5.0 桌面客户端与物联网通信调试利器 — 由 EMQ 官方出品的现代化开源 MQTT 客户端与测试工具箱，提供桌面 GUI、CLI 命令行与 Web 网页版，原生支持 MQTT 5.0、Payload 格式化、脚本模拟与连接压力测试。",
    "content": "MQTTX https://mqttx.app/zh/downloads 全功能跨平台开源 MQTT 5.0 桌面客户端与物联网通信调试利器 由 EMQ 官方出品的现代化开源 MQTT 客户端与测试工具箱，提供桌面 GUI、CLI 命令行与 Web 网页版，原生支持 MQTT 5.0、Payload 格式化、脚本模拟与连接压力测试。 MQTTX MQTT 客户端 物联网 IoT调试 跨平台 EMQ",
    "sections": []
  },
  {
    "id": "tool-draw-io",
    "type": "tool",
    "title": "draw.io",
    "url": "tools.html#tool-draw-io",
    "externalUrl": "https://app.diagrams.net/",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-31",
    "tags": [
      "架构图",
      "流程图",
      "UML",
      "拓扑图",
      "免费开源"
    ],
    "summary": "完全免费开源的专业在线流程图、架构图与 UML 绘制利器 — 极其强大的在线绘图工具，支持绘制系统架构图、流程图、时序图、网络拓扑图与思维导图，支持导出矢量 SVG、PNG、PDF 及直接存储至 GitHub / 本地。",
    "content": "draw.io https://app.diagrams.net/ 完全免费开源的专业在线流程图、架构图与 UML 绘制利器 极其强大的在线绘图工具，支持绘制系统架构图、流程图、时序图、网络拓扑图与思维导图，支持导出矢量 SVG、PNG、PDF 及直接存储至 GitHub / 本地。 架构图 流程图 UML 拓扑图 免费开源",
    "sections": []
  },
  {
    "id": "tool-pdmaner-元数建模",
    "type": "tool",
    "title": "PDManer (元数建模)",
    "url": "tools.html#tool-pdmaner-元数建模",
    "externalUrl": "https://www.pdmaas.cn/Download",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-31",
    "tags": [
      "PDManer",
      "数据库建模",
      "ER图",
      "DDL生成",
      "架构设计",
      "MySQL"
    ],
    "summary": "跨平台专业国产开源数据库 ER 建模与数据资产设计开发平台 — 支持 MySQL、PostgreSQL、Oracle、达梦等多数据库方言，提供概念模型到物理模型全流程可视化设计、DDL 脚本一键生成与版本逆向工程。",
    "content": "PDManer (元数建模) https://www.pdmaas.cn/Download 跨平台专业国产开源数据库 ER 建模与数据资产设计开发平台 支持 MySQL、PostgreSQL、Oracle、达梦等多数据库方言，提供概念模型到物理模型全流程可视化设计、DDL 脚本一键生成与版本逆向工程。 PDManer 数据库建模 ER图 DDL生成 架构设计 MySQL",
    "sections": []
  },
  {
    "id": "tool-dbeaver",
    "type": "tool",
    "title": "DBeaver",
    "url": "tools.html#tool-dbeaver",
    "externalUrl": "https://dbeaver.io/download/",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-31",
    "tags": [
      "DBeaver",
      "数据库管理",
      "SQL编辑器",
      "MySQL",
      "PostgreSQL",
      "开源客户端"
    ],
    "summary": "全球领先的免费开源通用全平台多数据库连接管理客户端 — 功能极其强悍的通用数据库工具与 SQL 编辑器，支持 MySQL、PostgreSQL、SQLite、Oracle、Redis 等上百种数据库连接与数据可视化操作。",
    "content": "DBeaver https://dbeaver.io/download/ 全球领先的免费开源通用全平台多数据库连接管理客户端 功能极其强悍的通用数据库工具与 SQL 编辑器，支持 MySQL、PostgreSQL、SQLite、Oracle、Redis 等上百种数据库连接与数据可视化操作。 DBeaver 数据库管理 SQL编辑器 MySQL PostgreSQL 开源客户端",
    "sections": []
  },
  {
    "id": "tool-geek-uninstaller",
    "type": "tool",
    "title": "Geek Uninstaller",
    "url": "tools.html#tool-geek-uninstaller",
    "externalUrl": "https://geekuninstaller.com/",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-31",
    "tags": [
      "Geek",
      "软件卸载",
      "Windows",
      "注册表清理",
      "系统工具"
    ],
    "summary": "Windows 平台极简高效的绿色单文件软件卸载与深度清理工具 — 单文件免安装的 Windows 卸载神器，支持强力删除流氓与顽固残留软件、深度扫描清理注册表键值与关联垃圾文件。",
    "content": "Geek Uninstaller https://geekuninstaller.com/ Windows 平台极简高效的绿色单文件软件卸载与深度清理工具 单文件免安装的 Windows 卸载神器，支持强力删除流氓与顽固残留软件、深度扫描清理注册表键值与关联垃圾文件。 Geek 软件卸载 Windows 注册表清理 系统工具",
    "sections": []
  },
  {
    "id": "tool-kms-在线激活服务-kms-cx",
    "type": "tool",
    "title": "KMS 在线激活服务 (KMS.cx)",
    "url": "tools.html#tool-kms-在线激活服务-kms-cx",
    "externalUrl": "https://kms.cx/",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-31",
    "tags": [
      "KMS",
      "Windows激活",
      "Office激活",
      "GVLK",
      "系统工具",
      "命令行"
    ],
    "summary": "极简高速的公共 KMS 在线激活服务与 Windows / Office 一键脚本指南 — 提供全天候高可用的正规企业 KMS 批量授权在线激活服务器地址、GVLK 密钥速查表以及纯原生无后门的命令行一键激活配置教程。",
    "content": "KMS 在线激活服务 (KMS.cx) https://kms.cx/ 极简高速的公共 KMS 在线激活服务与 Windows / Office 一键脚本指南 提供全天候高可用的正规企业 KMS 批量授权在线激活服务器地址、GVLK 密钥速查表以及纯原生无后门的命令行一键激活配置教程。 KMS Windows激活 Office激活 GVLK 系统工具 命令行",
    "sections": []
  },
  {
    "id": "tool-flyenv",
    "type": "tool",
    "title": "FlyEnv",
    "url": "tools.html#tool-flyenv",
    "externalUrl": "https://flyenv.com/download.html",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-31",
    "tags": [
      "FlyEnv",
      "开发环境",
      "PHP",
      "NodeJS",
      "MySQL",
      "Redis",
      "本地调试"
    ],
    "summary": "全能现代化本地多语言开发环境与服务集成管理工具 — 支持 PHP、Node.js、Python、Go、Java、MySQL、Redis、Nginx 等环境的一键安装与多版本极速切换，跨平台本地开发必备神器。",
    "content": "FlyEnv https://flyenv.com/download.html 全能现代化本地多语言开发环境与服务集成管理工具 支持 PHP、Node.js、Python、Go、Java、MySQL、Redis、Nginx 等环境的一键安装与多版本极速切换，跨平台本地开发必备神器。 FlyEnv 开发环境 PHP NodeJS MySQL Redis 本地调试",
    "sections": []
  },
  {
    "id": "tool-winrar-官方中文网",
    "type": "tool",
    "title": "WinRAR (官方中文网)",
    "url": "tools.html#tool-winrar-官方中文网",
    "externalUrl": "https://www.winrar.com.cn/",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-31",
    "tags": [
      "WinRAR",
      "压缩工具",
      "解压软件",
      "RAR",
      "ZIP",
      "系统工具",
      "装机必备"
    ],
    "summary": "全球流行经典的专业文件压缩与解压缩利器官方中文门户 — Windows 平台家喻户晓的经典文件压缩与解压管理工具，支持 RAR、ZIP、7Z、ISO、TAR 等主流格式，具备高压缩率与加密固实压缩功能。",
    "content": "WinRAR (官方中文网) https://www.winrar.com.cn/ 全球流行经典的专业文件压缩与解压缩利器官方中文门户 Windows 平台家喻户晓的经典文件压缩与解压管理工具，支持 RAR、ZIP、7Z、ISO、TAR 等主流格式，具备高压缩率与加密固实压缩功能。 WinRAR 压缩工具 解压软件 RAR ZIP 系统工具 装机必备",
    "sections": []
  },
  {
    "id": "tool-cloudconvert-svg-to-ico",
    "type": "tool",
    "title": "CloudConvert (SVG to ICO)",
    "url": "tools.html#tool-cloudconvert-svg-to-ico",
    "externalUrl": "https://cloudconvert.com/svg-to-ico",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-31",
    "tags": [
      "SVG",
      "ICO",
      "Favicon",
      "格式转换",
      "网站图标"
    ],
    "summary": "专业高保真在线 SVG 矢量图转 ICO 网站图标 Favicon 转换器 — 支持将 SVG 矢量文件快速批量转换为多尺寸高清 ICO 网站图标，支持自定义图标分辨率（16x16、32x32、48x48 等），免安装即用。",
    "content": "CloudConvert (SVG to ICO) https://cloudconvert.com/svg-to-ico 专业高保真在线 SVG 矢量图转 ICO 网站图标 Favicon 转换器 支持将 SVG 矢量文件快速批量转换为多尺寸高清 ICO 网站图标，支持自定义图标分辨率（16x16、32x32、48x48 等），免安装即用。 SVG ICO Favicon 格式转换 网站图标",
    "sections": []
  },
  {
    "id": "tool-tinify-tinypng-中文网",
    "type": "tool",
    "title": "Tinify (TinyPNG 中文网)",
    "url": "tools.html#tool-tinify-tinypng-中文网",
    "externalUrl": "https://tinify.cn/",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-31",
    "tags": [
      "Tinify",
      "TinyPNG",
      "图片压缩",
      "WebP",
      "PNG",
      "性能优化"
    ],
    "summary": "智能 WebP、PNG 与 JPEG 图像高保真无损压缩与批量处理平台 — 业内最负盛名的智能图像压缩服务，采用先进的量化算法精准减少颜色位数，大幅精简图片体积并保留完美视觉画质，网站提速必备利器。",
    "content": "Tinify (TinyPNG 中文网) https://tinify.cn/ 智能 WebP、PNG 与 JPEG 图像高保真无损压缩与批量处理平台 业内最负盛名的智能图像压缩服务，采用先进的量化算法精准减少颜色位数，大幅精简图片体积并保留完美视觉画质，网站提速必备利器。 Tinify TinyPNG 图片压缩 WebP PNG 性能优化",
    "sections": []
  },
  {
    "id": "tool-hills-lite-emby-jellyfin-客户端",
    "type": "tool",
    "title": "Hills Lite (Emby / Jellyfin 客户端)",
    "url": "tools.html#tool-hills-lite-emby-jellyfin-客户端",
    "externalUrl": "https://apps.microsoft.com/detail/9nxnzfrllwzx?hl=zh-CN&gl=CN",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-31",
    "tags": [
      "HillsLite",
      "Emby",
      "Jellyfin",
      "媒体播放器",
      "Windows",
      "流媒体"
    ],
    "summary": "Windows 平台极简高颜值的 Emby 与 Jellyfin 媒体库第三方播放器 — 微软商店极受好评的轻量级流媒体客户端，原生 Fluent 设计美学，完美连接个人 Emby / Jellyfin 影音服务器，支持高清硬件解码与杜比视界播放。",
    "content": "Hills Lite (Emby / Jellyfin 客户端) https://apps.microsoft.com/detail/9nxnzfrllwzx?hl=zh-CN&gl=CN Windows 平台极简高颜值的 Emby 与 Jellyfin 媒体库第三方播放器 微软商店极受好评的轻量级流媒体客户端，原生 Fluent 设计美学，完美连接个人 Emby / Jellyfin 影音服务器，支持高清硬件解码与杜比视界播放。 HillsLite Emby Jellyfin 媒体播放器 Windows 流媒体",
    "sections": []
  },
  {
    "id": "tool-ffmpeg",
    "type": "tool",
    "title": "FFmpeg",
    "url": "tools.html#tool-ffmpeg",
    "externalUrl": "https://www.ffmpeg.org/",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-31",
    "tags": [
      "FFmpeg",
      "音视频处理",
      "视频转码",
      "流媒体",
      "编解码",
      "多媒体工具"
    ],
    "summary": "全球领先的跨平台音视频录制、格式转换与多媒体流处理终极解决方案 — 业界最负盛名的开源跨平台音视频处理框架与多媒体工具箱，集成极其强悍的编解码库（libavcodec）、转码引擎、流媒体处理与硬件加速能力。",
    "content": "FFmpeg https://www.ffmpeg.org/ 全球领先的跨平台音视频录制、格式转换与多媒体流处理终极解决方案 业界最负盛名的开源跨平台音视频处理框架与多媒体工具箱，集成极其强悍的编解码库（libavcodec）、转码引擎、流媒体处理与硬件加速能力。 FFmpeg 音视频处理 视频转码 流媒体 编解码 多媒体工具",
    "sections": []
  },
  {
    "id": "tool-ippure-ip-纯净度检测",
    "type": "tool",
    "title": "IPPure (IP 纯净度检测)",
    "url": "tools.html#tool-ippure-ip-纯净度检测",
    "externalUrl": "https://ippure.com/",
    "category": "工具导航 · 网络诊断与安全检测",
    "date": "2026-08-31",
    "tags": [
      "IPPure",
      "IP查询",
      "纯净度",
      "代理检测",
      "网络诊断",
      "安全风控"
    ],
    "summary": "专业 IP 纯净度、代理类型识别与网络欺诈风险评分检测工具 — 提供精准的 IP 归属地查询、原生/广播 IP 属性判定、数据中心/家庭宽带类型识别与网络欺诈风险分数评估，出海与网络诊断利器。",
    "content": "IPPure (IP 纯净度检测) https://ippure.com/ 专业 IP 纯净度、代理类型识别与网络欺诈风险评分检测工具 提供精准的 IP 归属地查询、原生/广播 IP 属性判定、数据中心/家庭宽带类型识别与网络欺诈风险分数评估，出海与网络诊断利器。 IPPure IP查询 纯净度 代理检测 网络诊断 安全风控",
    "sections": []
  },
  {
    "id": "tool-cloudflare-优选-ip-节点库-090227-xyz",
    "type": "tool",
    "title": "Cloudflare 优选 IP 节点库 (090227.xyz)",
    "url": "tools.html#tool-cloudflare-优选-ip-节点库-090227-xyz",
    "externalUrl": "https://cf.090227.xyz/",
    "category": "工具导航 · 网络诊断与安全检测",
    "date": "2026-08-31",
    "tags": [
      "Cloudflare",
      "CF优选",
      "IP优选",
      "CDN加速",
      "节点测速",
      "网络工具"
    ],
    "summary": "实时自动化测速更新的 Cloudflare 与 CDN 优选 IP 节点在线平台 — 提供全天候自动化实时测速与多线路优选筛选的 Cloudflare IP、反向代理节点及测速订阅源，助力网络加速与高可用稳定连接。",
    "content": "Cloudflare 优选 IP 节点库 (090227.xyz) https://cf.090227.xyz/ 实时自动化测速更新的 Cloudflare 与 CDN 优选 IP 节点在线平台 提供全天候自动化实时测速与多线路优选筛选的 Cloudflare IP、反向代理节点及测速订阅源，助力网络加速与高可用稳定连接。 Cloudflare CF优选 IP优选 CDN加速 节点测速 网络工具",
    "sections": []
  },
  {
    "id": "tool-vless-节点生成器",
    "type": "page",
    "title": "VLESS 节点生成器",
    "url": "node-vle.html",
    "externalUrl": "",
    "category": "独立工具 · 网络与部署运维",
    "date": "2026-08-31",
    "tags": [
      "VLESS",
      "节点生成器",
      "配置生成",
      "网络工具"
    ],
    "summary": "全协议 VLESS 节点批量生成与智能去重配置工具 — 本站原生内置的纯前端 VLESS 节点配置生成工具，支持 IPv4/IPv6、REALITY、XHTTP、gRPC 与 UUID 快速生成与一键导出。",
    "content": "VLESS 节点生成器 https://vmrey.github.io/node-vle.html 全协议 VLESS 节点批量生成与智能去重配置工具 本站原生内置的纯前端 VLESS 节点配置生成工具，支持 IPv4/IPv6、REALITY、XHTTP、gRPC 与 UUID 快速生成与一键导出。 VLESS 节点生成器 配置生成 网络工具",
    "sections": []
  },
  {
    "id": "github-fnm",
    "type": "github",
    "title": "fnm (Schniz/fnm)",
    "url": "nav.html#github-fnm",
    "externalUrl": "https://github.com/Schniz/fnm",
    "category": "GitHub 导航 · Node.js 版本管理",
    "date": "2026-08-31",
    "tags": [
      "Rust",
      "Node.js",
      "CLI",
      "版本管理",
      "跨平台"
    ],
    "summary": "🚀 基于 Rust 编写的高性能、轻量级跨平台 Node.js 版本管理器 — 极速且原生的 Node.js 版本管理器。原生支持 .node-version 和 .nvmrc 自动环境感知切换，支持 Bash、Zsh、Fish、PowerShell，启动与切换性能极其优异。",
    "content": "fnm Schniz/fnm https://github.com/Schniz/fnm 🚀 基于 Rust 编写的高性能、轻量级跨平台 Node.js 版本管理器 极速且原生的 Node.js 版本管理器。原生支持 .node-version 和 .nvmrc 自动环境感知切换，支持 Bash、Zsh、Fish、PowerShell，启动与切换性能极其优异。 Rust Node.js CLI 版本管理 跨平台",
    "sections": []
  },
  {
    "id": "github-nvm",
    "type": "github",
    "title": "nvm (nvm-sh/nvm)",
    "url": "nav.html#github-nvm",
    "externalUrl": "https://github.com/nvm-sh/nvm",
    "category": "GitHub 导航 · Node.js 版本管理",
    "date": "2026-08-31",
    "tags": [
      "Shell",
      "Bash",
      "Node.js",
      "环境配置",
      "经典工具"
    ],
    "summary": "POSIX 兼容的标准 Node.js 多版本环境管理脚本 — 业界最流行、应用最广泛的 Node.js 版本管理解决方案。通过 Bash 脚本为每个版本独立隔离 node/npm 环境，完美解决多项目 Node 版本依赖冲突。",
    "content": "nvm nvm-sh/nvm https://github.com/nvm-sh/nvm POSIX 兼容的标准 Node.js 多版本环境管理脚本 业界最流行、应用最广泛的 Node.js 版本管理解决方案。通过 Bash 脚本为每个版本独立隔离 node/npm 环境，完美解决多项目 Node 版本依赖冲突。 Shell Bash Node.js 环境配置 经典工具",
    "sections": []
  },
  {
    "id": "github-ventoy",
    "type": "github",
    "title": "Ventoy (ventoy/Ventoy)",
    "url": "nav.html#github-ventoy",
    "externalUrl": "https://github.com/ventoy/Ventoy",
    "category": "GitHub 导航 · 系统与装机利器",
    "date": "2026-08-31",
    "tags": [
      "Ventoy",
      "启动盘",
      "ISO启动",
      "C",
      "系统安装",
      "U盘"
    ],
    "summary": "新一代多系统多合一启动 U 盘制作神器，无需格式化直接启动 ISO — 革命性的多合一启动盘制作工具。安装一次 Ventoy 后，只需将 Windows/Linux 的 ISO/WIM/IMG 镜像文件直接拷贝进 U 盘即可在开机菜单直接引导启动。",
    "content": "Ventoy ventoy/Ventoy https://github.com/ventoy/Ventoy 新一代多系统多合一启动 U 盘制作神器，无需格式化直接启动 ISO 革命性的多合一启动盘制作工具。安装一次 Ventoy 后，只需将 Windows/Linux 的 ISO/WIM/IMG 镜像文件直接拷贝进 U 盘即可在开机菜单直接引导启动。 Ventoy 启动盘 ISO启动 C 系统安装 U盘",
    "sections": []
  },
  {
    "id": "github-lky-officetools",
    "type": "github",
    "title": "LKY_OfficeTools (OdysseusYuan/LKY_OfficeTools)",
    "url": "nav.html#github-lky-officetools",
    "externalUrl": "https://github.com/OdysseusYuan/LKY_OfficeTools",
    "category": "GitHub 导航 · 系统与装机利器",
    "date": "2026-08-31",
    "tags": [
      "Office",
      "LKY",
      "办公工具",
      "装机必备",
      "一键安装",
      "Windows"
    ],
    "summary": "一键全自动快速下载、安装与配置正版 Office 部署神器 — 极简实用的 Microsoft Office 一键快速下载安装与配置工具，支持自由选择组件版本、自定义安装路径、自动部署多语言包与系统环境初始化。",
    "content": "LKY_OfficeTools OdysseusYuan/LKY_OfficeTools https://github.com/OdysseusYuan/LKY_OfficeTools 一键全自动快速下载、安装与配置正版 Office 部署神器 极简实用的 Microsoft Office 一键快速下载安装与配置工具，支持自由选择组件版本、自定义安装路径、自动部署多语言包与系统环境初始化。 Office LKY 办公工具 装机必备 一键安装 Windows",
    "sections": []
  },
  {
    "id": "github-fail2ban",
    "type": "github",
    "title": "Fail2Ban (fail2ban/fail2ban)",
    "url": "nav.html#github-fail2ban",
    "externalUrl": "https://github.com/fail2ban/fail2ban",
    "category": "GitHub 导航 · 服务器安全与防护",
    "date": "2026-08-31",
    "tags": [
      "Fail2Ban",
      "Linux安全",
      "防爆破",
      "Python",
      "SSH防护",
      "防火墙"
    ],
    "summary": "Linux 服务器日志驱动的自动化恶意 IP 封禁与防暴力破解系统 — 通过持续分析 SSH、Nginx、Postfix 等系统服务日志，精准识别非法尝试与暴力破解攻击，并自动调用 iptables / firewalld 实时封禁攻击者 IP。",
    "content": "Fail2Ban fail2ban/fail2ban https://github.com/fail2ban/fail2ban Linux 服务器日志驱动的自动化恶意 IP 封禁与防暴力破解系统 通过持续分析 SSH、Nginx、Postfix 等系统服务日志，精准识别非法尝试与暴力破解攻击，并自动调用 iptables / firewalld 实时封禁攻击者 IP。 Fail2Ban Linux安全 防爆破 Python SSH防护 防火墙",
    "sections": []
  },
  {
    "id": "github-acme-sh",
    "type": "github",
    "title": "acme.sh (acmesh-official/acme.sh)",
    "url": "nav.html#github-acme-sh",
    "externalUrl": "https://github.com/acmesh-official/acme.sh",
    "category": "GitHub 导航 · 服务器安全与防护",
    "date": "2026-08-31",
    "tags": [
      "acme.sh",
      "SSL证书",
      "HTTPS",
      "Let's Encrypt",
      "Shell",
      "自动化运维"
    ],
    "summary": "纯 Shell 编写的自动化免费 SSL/TLS 证书申请与一键续期脚本 — 最流行、最轻量的 ACME 协议客户端。纯 Shell 编写且零第三方依赖，支持 Let's Encrypt / ZeroSSL 免费证书自动申请、DNS 自动化鉴权验证与 Web 服务器静默热重载。",
    "content": "acme.sh acmesh-official/acme.sh https://github.com/acmesh-official/acme.sh 纯 Shell 编写的自动化免费 SSL/TLS 证书申请与一键续期脚本 最流行、最轻量的 ACME 协议客户端。纯 Shell 编写且零第三方依赖，支持 Let's Encrypt / ZeroSSL 免费证书自动申请、DNS 自动化鉴权验证与 Web 服务器静默热重载。 acme.sh SSL证书 HTTPS Let's Encrypt Shell 自动化运维",
    "sections": []
  },
  {
    "id": "github-lit",
    "type": "github",
    "title": "Lit (lit/lit)",
    "url": "nav.html#github-lit",
    "externalUrl": "https://lit.dev/",
    "category": "GitHub 导航 · 前端开发与 Web Components",
    "date": "2026-08-31",
    "tags": [
      "Lit",
      "WebComponents",
      "Google",
      "TypeScript",
      "前端开发",
      "UI组件",
      "响应式"
    ],
    "summary": "Google 出品的轻量、极速现代 Web Components 开发框架与响应式渲染库 — 基于原生 Web Components 标准构建下一代轻量 Web 应用与高复用 UI 组件。具备极速渲染引擎、极致轻巧体积（~5KB gzip）、声明式模板语法与原生跨框架无缝互通能力。",
    "content": "Lit lit/lit https://lit.dev/ Google 出品的轻量、极速现代 Web Components 开发框架与响应式渲染库 基于原生 Web Components 标准构建下一代轻量 Web 应用与高复用 UI 组件。具备极速渲染引擎、极致轻巧体积（~5KB gzip）、声明式模板语法与原生跨框架无缝互通能力。 Lit WebComponents Google TypeScript 前端开发 UI组件 响应式",
    "sections": []
  },
  {
    "id": "github-fingerprintjs",
    "type": "github",
    "title": "FingerprintJS (fingerprintjs/fingerprintjs)",
    "url": "nav.html#github-fingerprintjs",
    "externalUrl": "https://github.com/fingerprintjs/fingerprintjs",
    "category": "GitHub 导航 · 前端安全与设备识别",
    "date": "2026-08-31",
    "tags": [
      "Fingerprint",
      "设备指纹",
      "TypeScript",
      "安全风控",
      "浏览器特征",
      "前端库"
    ],
    "summary": "最流行的浏览器端高精度设备指纹识别与无 Cookie 访客识别库 — 无需 Cookie 或本地存储，通过分析 Canvas、WebGL、音频上下文、系统字体与硬件特征生成高稳定性设备指纹，广泛用于业务反欺诈与安全风控。",
    "content": "FingerprintJS fingerprintjs/fingerprintjs https://github.com/fingerprintjs/fingerprintjs 最流行的浏览器端高精度设备指纹识别与无 Cookie 访客识别库 无需 Cookie 或本地存储，通过分析 Canvas、WebGL、音频上下文、系统字体与硬件特征生成高稳定性设备指纹，广泛用于业务反欺诈与安全风控。 Fingerprint 设备指纹 TypeScript 安全风控 浏览器特征 前端库",
    "sections": []
  },
  {
    "id": "github-cloudflarespeedtest",
    "type": "github",
    "title": "CloudflareSpeedTest (XIU2/CloudflareSpeedTest)",
    "url": "nav.html#github-cloudflarespeedtest",
    "externalUrl": "https://github.com/XIU2/CloudflareSpeedTest",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "CloudflareSpeedTest",
      "Cloudflare",
      "CDN",
      "测速",
      "IP优选",
      "Go",
      "网络优化"
    ],
    "summary": "🌩 针对 Cloudflare CDN 的多线程高速测速与优选 IP 筛选工具 — 国内最火爆的 Cloudflare CDN 优选测速利器。支持并发测试 Cloudflare 所有公开/自定义 IP 的延迟和下载速度，自动筛选出延迟最低、速度最快的最优 IP。",
    "content": "CloudflareSpeedTest XIU2/CloudflareSpeedTest https://github.com/XIU2/CloudflareSpeedTest 🌩 针对 Cloudflare CDN 的多线程高速测速与优选 IP 筛选工具 国内最火爆的 Cloudflare CDN 优选测速利器。支持并发测试 Cloudflare 所有公开/自定义 IP 的延迟和下载速度，自动筛选出延迟最低、速度最快的最优 IP。 CloudflareSpeedTest Cloudflare CDN 测速 IP优选 Go 网络优化",
    "sections": []
  },
  {
    "id": "github-frp",
    "type": "github",
    "title": "frp (fatedier/frp)",
    "url": "nav.html#github-frp",
    "externalUrl": "https://github.com/fatedier/frp",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "frp",
      "内网穿透",
      "反向代理",
      "Go",
      "远程访问",
      "NAT穿透"
    ],
    "summary": "⚡ 高性能反向代理与内网穿透利器，轻松将内网服务暴露至公网 — 业界应用最广泛的开源高性能反向代理与内网穿透应用。支持 TCP、UDP、HTTP、HTTPS、STCP 等多种协议，支持链路加密与多路复用，远程运维与私有云部署必备。",
    "content": "frp fatedier/frp https://github.com/fatedier/frp ⚡ 高性能反向代理与内网穿透利器，轻松将内网服务暴露至公网 业界应用最广泛的开源高性能反向代理与内网穿透应用。支持 TCP、UDP、HTTP、HTTPS、STCP 等多种协议，支持链路加密与多路复用，远程运维与私有云部署必备。 frp 内网穿透 反向代理 Go 远程访问 NAT穿透",
    "sections": []
  },
  {
    "id": "github-v2rayng",
    "type": "github",
    "title": "v2rayNG (2dust/v2rayNG)",
    "url": "nav.html#github-v2rayng",
    "externalUrl": "https://github.com/2dust/v2rayNG",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "v2rayNG",
      "Android",
      "代理工具",
      "V2Ray",
      "Xray",
      "Shadowsocks",
      "Kotlin"
    ],
    "summary": "Android 平台主流且强大的多协议通用网络代理客户端 — 基于 V2Ray / Xray 核心开发的 Android 客户端，全面支持 VMess、VLESS、Shadowsocks、Trojan、Socks5 等主流网络协议与分流规则配置。",
    "content": "v2rayNG 2dust/v2rayNG https://github.com/2dust/v2rayNG Android 平台主流且强大的多协议通用网络代理客户端 基于 V2Ray / Xray 核心开发的 Android 客户端，全面支持 VMess、VLESS、Shadowsocks、Trojan、Socks5 等主流网络协议与分流规则配置。 v2rayNG Android 代理工具 V2Ray Xray Shadowsocks Kotlin",
    "sections": []
  },
  {
    "id": "github-v2rayn",
    "type": "github",
    "title": "v2rayN (2dust/v2rayN)",
    "url": "nav.html#github-v2rayn",
    "externalUrl": "https://github.com/2dust/v2rayN",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "v2rayN",
      "Windows",
      "代理工具",
      "V2Ray",
      "Xray",
      "sing-box",
      "C#"
    ],
    "summary": "Windows 平台主流且强大的多协议通用网络代理 GUI 客户端 — 基于 V2Ray / Xray / sing-box 核心开发的 Windows 桌面图形客户端，全面支持 VMess、VLESS、Shadowsocks、Trojan、Hysteria2 等主流协议与路由分流规则配置。",
    "content": "v2rayN 2dust/v2rayN https://github.com/2dust/v2rayN Windows 平台主流且强大的多协议通用网络代理 GUI 客户端 基于 V2Ray / Xray / sing-box 核心开发的 Windows 桌面图形客户端，全面支持 VMess、VLESS、Shadowsocks、Trojan、Hysteria2 等主流协议与路由分流规则配置。 v2rayN Windows 代理工具 V2Ray Xray sing-box C#",
    "sections": []
  },
  {
    "id": "github-edgetunnel",
    "type": "github",
    "title": "edgetunnel (cmliu/edgetunnel)",
    "url": "nav.html#github-edgetunnel",
    "externalUrl": "https://github.com/cmliu/edgetunnel",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "edgetunnel",
      "Cloudflare",
      "Workers",
      "Pages",
      "VLESS",
      "代理工具",
      "JavaScript"
    ],
    "summary": "基于 Cloudflare Pages 与 Workers 的轻量级边缘网络隧道工具 — 基于 Cloudflare 边缘计算无服务器架构的轻量级网络代理与边缘隧道项目，支持一键部署 VLESS 协议节点及自定义优选域名订阅。",
    "content": "edgetunnel cmliu/edgetunnel https://github.com/cmliu/edgetunnel 基于 Cloudflare Pages 与 Workers 的轻量级边缘网络隧道工具 基于 Cloudflare 边缘计算无服务器架构的轻量级网络代理与边缘隧道项目，支持一键部署 VLESS 协议节点及自定义优选域名订阅。 edgetunnel Cloudflare Workers Pages VLESS 代理工具 JavaScript",
    "sections": []
  },
  {
    "id": "github-multi-easygost",
    "type": "github",
    "title": "Multi-EasyGost (KANIKIG/Multi-EasyGost)",
    "url": "nav.html#github-multi-easygost",
    "externalUrl": "https://github.com/KANIKIG/Multi-EasyGost",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-31",
    "tags": [
      "Gost",
      "端口转发",
      "流量中转",
      "隧道",
      "网络加速",
      "Shell",
      "Linux"
    ],
    "summary": "⚡ 简单易用的 Gost 多功能端口转发与中转一键脚本 — 基于 GOST 核心的多功能流量中转与端口转发一键管理脚本，支持 TCP/UDP/TLS/WS 隧道转发、多节点中转链路管理与 systemd 服务守护。",
    "content": "Multi-EasyGost KANIKIG/Multi-EasyGost https://github.com/KANIKIG/Multi-EasyGost ⚡ 简单易用的 Gost 多功能端口转发与中转一键脚本 基于 GOST 核心的多功能流量中转与端口转发一键管理脚本，支持 TCP/UDP/TLS/WS 隧道转发、多节点中转链路管理与 systemd 服务守护。 Gost 端口转发 流量中转 隧道 网络加速 Shell Linux",
    "sections": []
  },
  {
    "id": "github-emqx",
    "type": "github",
    "title": "EMQX (emqx/emqx)",
    "url": "nav.html#github-emqx",
    "externalUrl": "https://github.com/emqx/emqx",
    "category": "GitHub 导航 · 物联网与消息中间件",
    "date": "2026-08-31",
    "tags": [
      "EMQX",
      "MQTT",
      "物联网",
      "IoT",
      "Erlang",
      "消息中间件",
      "车联网",
      "高并发"
    ],
    "summary": "全球最具扩展性的开源分布式 MQTT 消息服务器与物联网消息中间件 — 基于 Erlang/OTP 构建的高性能分布式 MQTT Broker，单集群支持 1 亿并发 MQTT 连接与毫秒级低延迟吞吐，广泛应用于物联网、车联网与工业互联网。",
    "content": "EMQX emqx/emqx https://github.com/emqx/emqx 全球最具扩展性的开源分布式 MQTT 消息服务器与物联网消息中间件 基于 Erlang/OTP 构建的高性能分布式 MQTT Broker，单集群支持 1 亿并发 MQTT 连接与毫秒级低延迟吞吐，广泛应用于物联网、车联网与工业互联网。 EMQX MQTT 物联网 IoT Erlang 消息中间件 车联网 高并发",
    "sections": []
  },
  {
    "id": "file-fileupload-vue",
    "type": "file",
    "title": "FileUpload.vue",
    "url": "files.html#file-fileupload-vue",
    "externalUrl": "",
    "category": "资源文件 · 前端组件",
    "date": "2026-08-31",
    "tags": [
      "vue",
      "前端组件"
    ],
    "summary": "Vue3 + Element Plus 文件上传组件源码（支持回显、批量与手动控制提交） (12.7 KB, undefined 行)",
    "content": "FileUpload.vue Vue3 + Element Plus 文件上传组件源码（支持回显、批量与手动控制提交） 前端组件 vue",
    "sections": []
  },
  {
    "id": "file-queryform-vue",
    "type": "file",
    "title": "QueryForm.vue",
    "url": "files.html#file-queryform-vue",
    "externalUrl": "",
    "category": "资源文件 · 前端组件",
    "date": "2026-08-31",
    "tags": [
      "vue",
      "前端组件"
    ],
    "summary": "Vue3 + Element Plus 查询表单通用封装组件源码（响应式布局与重置联动） (10.3 KB, undefined 行)",
    "content": "QueryForm.vue Vue3 + Element Plus 查询表单通用封装组件源码（响应式布局与重置联动） 前端组件 vue",
    "sections": []
  },
  {
    "id": "file-ciphertool-ts",
    "type": "file",
    "title": "cipherTool.ts",
    "url": "files.html#file-ciphertool-ts",
    "externalUrl": "",
    "category": "资源文件 · 代码库",
    "date": "2026-08-31",
    "tags": [
      "ts",
      "代码库"
    ],
    "summary": "TypeScript 轻量可逆加密与混淆工具库源码（支持自定义口令、中文/Emoji、URL安全） (6.3 KB, undefined 行)",
    "content": "cipherTool.ts TypeScript 轻量可逆加密与混淆工具库源码（支持自定义口令、中文/Emoji、URL安全） 代码库 ts",
    "sections": []
  },
  {
    "id": "file-tools-js",
    "type": "file",
    "title": "tools.js",
    "url": "files.html#file-tools-js",
    "externalUrl": "",
    "category": "资源文件 · 代码库",
    "date": "2026-08-31",
    "tags": [
      "js",
      "代码库"
    ],
    "summary": "JavaScript 常用实用函数库合集（防抖节流、树递归、深拷贝、数据类型判断） (24.7 KB, undefined 行)",
    "content": "tools.js JavaScript 常用实用函数库合集（防抖节流、树递归、深拷贝、数据类型判断） 代码库 js",
    "sections": []
  },
  {
    "id": "file-frps-sh",
    "type": "file",
    "title": "frps.sh",
    "url": "files.html#file-frps-sh",
    "externalUrl": "",
    "category": "资源文件 · Shell 脚本",
    "date": "2026-08-31",
    "tags": [
      "sh",
      "Shell 脚本"
    ],
    "summary": "FRP 内网穿透服务端 Linux 一键自动化安装、配置与 Systemd 管理脚本 (29.1 KB, undefined 行)",
    "content": "frps.sh FRP 内网穿透服务端 Linux 一键自动化安装、配置与 Systemd 管理脚本 Shell 脚本 sh",
    "sections": []
  },
  {
    "id": "file-xray-sh",
    "type": "file",
    "title": "xray.sh",
    "url": "files.html#file-xray-sh",
    "externalUrl": "",
    "category": "资源文件 · Shell 脚本",
    "date": "2026-08-31",
    "tags": [
      "sh",
      "Shell 脚本"
    ],
    "summary": "Xray Core 核心网络代理服务一键安装与证书部署脚本 (23.1 KB, undefined 行)",
    "content": "xray.sh Xray Core 核心网络代理服务一键安装与证书部署脚本 Shell 脚本 sh",
    "sections": []
  },
  {
    "id": "file-renametool-bat",
    "type": "file",
    "title": "RenameTool.bat",
    "url": "files.html#file-renametool-bat",
    "externalUrl": "",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-31",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows 批量修改文件名与文件夹名自动化批处理工具（支持递归与特殊字符防破坏） (3.1 KB, undefined 行)",
    "content": "RenameTool.bat Windows 批量修改文件名与文件夹名自动化批处理工具（支持递归与特殊字符防破坏） Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-cmd-proxy-bat",
    "type": "file",
    "title": "cmd_proxy.bat",
    "url": "files.html#file-cmd-proxy-bat",
    "externalUrl": "",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-31",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows CMD 终端一键设置与清除 HTTP/SOCKS5 代理环境变量脚本 (823 B, undefined 行)",
    "content": "cmd_proxy.bat Windows CMD 终端一键设置与清除 HTTP/SOCKS5 代理环境变量脚本 Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-cmd-proxy-agy-bat",
    "type": "file",
    "title": "cmd_proxy_agy.bat",
    "url": "files.html#file-cmd-proxy-agy-bat",
    "externalUrl": "",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-31",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows CMD 终端一键配置代理并自动开启 Antigravity (AGY) 免权限全自动运行脚本 (858 B, undefined 行)",
    "content": "cmd_proxy_agy.bat Windows CMD 终端一键配置代理并自动开启 Antigravity (AGY) 免权限全自动运行脚本 Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-windows-activation-bat",
    "type": "file",
    "title": "windows_activation.bat",
    "url": "files.html#file-windows-activation-bat",
    "externalUrl": "",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-31",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows 系统一键 KMS 激活与密钥配置批处理脚本 (217 B, undefined 行)",
    "content": "windows_activation.bat Windows 系统一键 KMS 激活与密钥配置批处理脚本 Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-imghandle-jpg-zip",
    "type": "file",
    "title": "ImgHandle_jpg.zip",
    "url": "files.html#file-imghandle-jpg-zip",
    "externalUrl": "",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-31",
    "tags": [
      "zip",
      "压缩资源包"
    ],
    "summary": "Photoshop 批量压缩 JPG 图片 ExtendScript 脚本与动作资源包 (1.7 KB, undefined 行)",
    "content": "ImgHandle_jpg.zip Photoshop 批量压缩 JPG 图片 ExtendScript 脚本与动作资源包 压缩资源包 zip",
    "sections": []
  },
  {
    "id": "file-curvecharts-rar",
    "type": "file",
    "title": "curveCharts.rar",
    "url": "files.html#file-curvecharts-rar",
    "externalUrl": "",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-31",
    "tags": [
      "rar",
      "压缩资源包"
    ],
    "summary": "平滑贝塞尔曲线与数据可视化图表组件资源包 (6.9 KB, undefined 行)",
    "content": "curveCharts.rar 平滑贝塞尔曲线与数据可视化图表组件资源包 压缩资源包 rar",
    "sections": []
  },
  {
    "id": "file-优惠券弹框组件-zip",
    "type": "file",
    "title": "优惠券弹框组件.zip",
    "url": "files.html#file-优惠券弹框组件-zip",
    "externalUrl": "",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-31",
    "tags": [
      "zip",
      "压缩资源包"
    ],
    "summary": "Vue 前端业务优惠券领取与展示弹框交互组件完整工程包 (30.4 KB, undefined 行)",
    "content": "优惠券弹框组件.zip Vue 前端业务优惠券领取与展示弹框交互组件完整工程包 压缩资源包 zip",
    "sections": []
  }
];
