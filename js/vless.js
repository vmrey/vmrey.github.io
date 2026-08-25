/**
 * VLESS 节点生成器客户端核心交互脚本 (VLESS Generator Client Engine)
 */

function getVal(id) { 
    const el = document.getElementById(id);
    return el ? el.value.trim() : ''; 
}

function setVal(id, val) { 
    const el = document.getElementById(id);
    if (el) { el.value = val; } 
}

// 随机生成标准 RFC4122 v4 UUID
function generateUUID() {
    let uuid;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        uuid = crypto.randomUUID();
    } else {
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    setVal('uuid', uuid);

    const uuidInput = document.getElementById('uuid');
    if (uuidInput) {
        uuidInput.focus();
        uuidInput.style.transition = 'background-color 0.25s';
        uuidInput.style.backgroundColor = 'var(--primary-soft)';
        setTimeout(() => { uuidInput.style.backgroundColor = ''; }, 350);
    }
}

// 复制 UUID
async function copyUUID() {
    const uuid = getVal('uuid');
    const btn = document.getElementById('copyUuidBtn');
    if (!uuid) {
        alert("当前还没有 UUID，请先点击「随机生成」或导入节点！");
        return;
    }
    let copied = false;
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(uuid);
            copied = true;
        } else {
            throw new Error("Fallback");
        }
    } catch (err) {
        const uuidInput = document.getElementById('uuid');
        if (uuidInput) {
            const readonlyState = uuidInput.readOnly;
            uuidInput.readOnly = false;
            uuidInput.focus();
            uuidInput.select();
            uuidInput.setSelectionRange(0, 999999);
            try {
                copied = document.execCommand('copy');
            } catch (e) {}
            uuidInput.readOnly = readonlyState;
        }
    }
    if (copied && btn) {
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>已复制</span>';
        btn.classList.add('primary');
        setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.classList.remove('primary');
        }, 1500);
    } else if (!copied) {
        alert("复制失败，请手动长按或选中 UUID 复制！");
    }
}

// 监听 Security 变更，控制 REALITY 参数区显示/隐藏
function syncSecurityUI() {
    const sec = getVal('security');
    const realitySec = document.getElementById('realitySection');
    if (realitySec) {
        realitySec.style.display = (sec === 'reality') ? 'grid' : 'none';
    }
}

// 动态调整输入框高度并执行防抖实时解析
let importDebounceTimer = null;
function handleImportInput(el) {
    if (el) {
        el.style.height = 'auto';
        el.style.height = Math.max(el.scrollHeight + 2, 70) + 'px';
    }
    clearTimeout(importDebounceTimer);
    importDebounceTimer = setTimeout(() => {
        parseUrl(true);
    }, 250);
}

// 清空导入框
function clearImportUrl() {
    const el = document.getElementById('importUrl');
    if (el) {
        el.value = '';
        el.style.height = 'auto';
    }
    const statusEl = document.getElementById('parseStatus');
    if (statusEl) {
        statusEl.innerHTML = '💡 粘贴 vless:// 链接将实时动态解析';
        statusEl.style.color = 'var(--text-muted)';
    }
}

// 安全 Base64 解码辅助
function decodeBase64Safe(str) {
    try {
        if (typeof window !== 'undefined' && typeof window.atob !== 'undefined') {
            return decodeURIComponent(escape(window.atob(str)));
        } else if (typeof Buffer !== 'undefined') {
            return Buffer.from(str, 'base64').toString('utf-8');
        }
    } catch (e) {}
    return '';
}

// 解析单个 VLESS 链接核心参数
function parseSingleVlessLink(cleanUrl) {
    let mainPart = cleanUrl.replace(/^vless:\/\//i, '');
    let queryStr = '';
    let hashPart = '';

    if (mainPart.includes('#')) {
        const hashIdx = mainPart.indexOf('#');
        hashPart = mainPart.slice(hashIdx + 1);
        mainPart = mainPart.slice(0, hashIdx);
    }

    if (mainPart.includes('?')) {
        const queryIdx = mainPart.indexOf('?');
        queryStr = mainPart.slice(queryIdx + 1);
        mainPart = mainPart.slice(0, queryIdx);
    }

    const searchParams = new URLSearchParams(queryStr);
    let uuid = '';
    let host = '';
    let port = '443';
    let encryption = 'none';
    let remark = hashPart ? decodeURIComponent(hashPart) : '';

    if (!remark && searchParams.has('remarks')) {
        remark = decodeURIComponent(searchParams.get('remarks'));
    } else if (!remark && searchParams.has('remark')) {
        remark = decodeURIComponent(searchParams.get('remark'));
    }

    let authAndHost = mainPart;
    if (!authAndHost.includes('@')) {
        const base64Str = authAndHost.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = decodeBase64Safe(base64Str);
        if (decoded && decoded.includes('@')) {
            authAndHost = decoded;
        }
    }

    const match = authAndHost.match(/^(?:([^:]+):)?([^@]+)@(?:\[([a-fA-F0-9:]+)\]|([^:?#]+))(?::(\d+))?$/);
    if (match) {
        const [_, enc, rawUuid, ipv6, domainOrIpv4, rawPort] = match;
        if (enc) encryption = enc;
        uuid = decodeURIComponent(rawUuid || '');
        host = ipv6 || domainOrIpv4 || '';
        if (rawPort) port = rawPort;
    } else {
        const atIdx = authAndHost.lastIndexOf('@');
        if (atIdx !== -1) {
            const userPart = authAndHost.slice(0, atIdx);
            const hostPortPart = authAndHost.slice(atIdx + 1);
            if (userPart.includes(':')) {
                const parts = userPart.split(':');
                encryption = parts[0];
                uuid = parts.slice(1).join(':');
            } else {
                uuid = userPart;
            }
            if (hostPortPart.startsWith('[')) {
                const closeB = hostPortPart.indexOf(']');
                host = hostPortPart.slice(1, closeB);
                const after = hostPortPart.slice(closeB + 1);
                if (after.startsWith(':')) port = after.slice(1);
            } else if (hostPortPart.includes(':')) {
                const [h, p] = hostPortPart.split(':');
                host = h;
                port = p;
            } else {
                host = hostPortPart;
            }
        }
    }

    return {
        uuid,
        nodeAddress: host,
        port,
        encryption: searchParams.get('encryption') || encryption || 'none',
        remark,
        type: searchParams.get('type') || searchParams.get('obfs') || searchParams.get('net') || searchParams.get('network') || 'xhttp',
        security: searchParams.get('security') || ((searchParams.get('tls') === '1' || searchParams.get('tls') === 'true' || searchParams.get('tls') === 'tls') ? 'tls' : (searchParams.has('pbk') ? 'reality' : '')),
        sni: searchParams.get('sni') || searchParams.get('peer') || searchParams.get('serverName') || '',
        host: searchParams.get('host') || searchParams.get('obfsParam') || '',
        path: searchParams.get('path') || searchParams.get('ws-path') || '',
        fp: searchParams.get('fp') || searchParams.get('fingerprint') || '',
        alpn: searchParams.get('alpn') || '',
        insecure: searchParams.get('insecure') || searchParams.get('allowInsecure') || '0',
        mode: searchParams.get('mode') || '',
        serviceName: searchParams.get('serviceName') || '',
        headerType: searchParams.get('headerType') || '',
        seed: searchParams.get('seed') || '',
        flow: searchParams.get('flow') || '',
        pbk: searchParams.get('pbk') || searchParams.get('publicKey') || '',
        sid: searchParams.get('sid') || searchParams.get('shortId') || '',
        spx: searchParams.get('spx') || searchParams.get('spiderX') || ''
    };
}

// 解析导入的 VLESS 链接 (全协议标准与 Base64 订阅包深度解析)
function parseUrl(silent = false) {
    const rawInput = getVal('importUrl');
    const statusEl = document.getElementById('parseStatus');

    if (!rawInput) { 
        if (!silent) alert("请先粘贴完整的 VLESS 链接或 Base64 订阅内容！");
        if (statusEl) {
            statusEl.innerHTML = '💡 粘贴 vless:// 链接或 Base64 订阅将实时动态解析';
            statusEl.style.color = 'var(--text-muted)';
        }
        return; 
    }

    try {
        let processedInput = rawInput.trim();
        let isBase64Sub = false;

        // 1. 自动识别并解码整段 Base64 订阅字符串
        if (!processedInput.includes('://') && /^[A-Za-z0-9+/=_\s-]+$/.test(processedInput)) {
            const decoded = decodeBase64Safe(processedInput.replace(/\s+/g, ''));
            if (decoded && (decoded.includes('vless://') || decoded.includes('://'))) {
                processedInput = decoded;
                isBase64Sub = true;
            }
        }

        // 2. 匹配提取所有 VLESS 链接
        const allVlessLinks = processedInput.match(/vless:\/\/[^\s"'`<>]+/gi);
        if (!allVlessLinks || allVlessLinks.length === 0) {
            const otherProtocol = processedInput.match(/([a-zA-Z0-9_-]+):\/\//);
            const protoName = otherProtocol ? otherProtocol[1] : '';
            if (!silent) alert(`导入提示：未检测到有效 VLESS 协议节点${protoName ? `（检测到 ${protoName} 协议，当前生成器专用于 VLESS 协议）` : ''}！`);
            if (statusEl) {
                statusEl.innerHTML = `⚠️ 未找到有效的 vless:// 链接${protoName ? ` (检测到 ${protoName})` : ''}`;
                statusEl.style.color = '#ef4444';
            }
            return; 
        }

        // 3. 以第 1 个 VLESS 链接提取核心配置参数
        const firstConfig = parseSingleVlessLink(allVlessLinks[0].trim());

        if (firstConfig.uuid) {
            setVal('uuid', firstConfig.uuid);
        }
        setVal('port', firstConfig.port || '443');

        // 4. 严格单节点导入策略：无论输入包含多少个节点，一律仅提取第 1 个节点的连接地址与备注
        if (firstConfig.nodeAddress) {
            const nodeItem = firstConfig.remark ? `${firstConfig.nodeAddress}#${firstConfig.remark}` : firstConfig.nodeAddress;
            setVal('domains', nodeItem);
        } else {
            setVal('domains', '');
        }

        // 5. 参数映射与表单控件回填
        const paramKeys = ['encryption', 'type', 'security', 'sni', 'host', 'path', 'fp', 'alpn', 'insecure', 'mode', 'serviceName', 'headerType', 'seed', 'flow', 'pbk', 'sid', 'spx'];
        paramKeys.forEach(key => {
            const el = document.getElementById(key);
            if (!el) return;

            const val = firstConfig[key];
            if (val !== null && val !== undefined && val !== '') {
                if (el.tagName === 'SELECT') {
                    const exists = Array.from(el.options).some(opt => opt.value === val);
                    if (!exists) {
                        el.add(new Option(val, val, true, true));
                    }
                }
                el.value = val;
            } else {
                if (el.tagName === 'SELECT') {
                    const hasEmptyOption = Array.from(el.options).some(opt => opt.value === '');
                    el.value = hasEmptyOption ? '' : el.options[0].value;
                } else {
                    el.value = '';
                }
            }
        });

        syncSecurityUI();

        const count = allVlessLinks.length;
        if (statusEl) {
            if (count > 1 || isBase64Sub) {
                statusEl.innerHTML = '✅ 已精准提取第 1 个节点参数与地址（其余节点已自动忽略）';
            } else {
                statusEl.innerHTML = '✅ 单节点动态解析成功，参数已实时填充！';
            }
            statusEl.style.color = '#10b981';
        }

        if (!silent) {
            if (count > 1 || isBase64Sub) {
                alert("✅ 单节点解析成功！检测到输入内容包含多个节点，已精准提取并填充第 1 个节点的所有参数与地址。");
            } else {
                alert("✅ 单节点解析成功！所有参数已提取并填入表单。");
            }
        }
    } catch (e) {
        console.error("URL 解析失败:", e);
        if (statusEl) {
            statusEl.innerHTML = '❌ 链接格式解析异常: ' + e.message;
            statusEl.style.color = '#ef4444';
        }
        if (!silent) {
            alert("❌ 解析失败，请检查链接格式。\n错误信息: " + e.message);
        }
    }
}

// 清空目标节点列表
function clearDomains() {
    const textarea = document.getElementById('domains');
    if (textarea) textarea.value = '';
}

// 智能去重并整理目标节点列表
function cleanAndDedupDomains() {
    const textarea = document.getElementById('domains');
    if (!textarea) return;
    
    const rawLines = textarea.value.split('\n');
    const cleaned = rawLines.map(extractHostFromLine).filter(Boolean);
    const unique = [...new Set(cleaned)];
    
    textarea.value = unique.join('\n');

    if (unique.length > 0) {
        alert(`✅ 去重完成！当前共有 ${unique.length} 个有效独立节点。`);
    } else {
        alert("目标节点列表为空。");
    }
}

// 辅助：从单行文本提取合法的主机/IP（完整支持 域名、IPv4、IPv6、自定义端口与备注）
function extractHostFromLine(line) {
    let text = line.trim();
    if (!text || text.startsWith('#') || text.startsWith('//')) return null;
    if (text.startsWith('<') || text.includes('</')) return null;

    // 1. 提取尾部备注
    let remark = '';
    if (text.includes('#')) {
        const hashParts = text.split('#');
        text = hashParts[0].trim();
        remark = hashParts.slice(1).join('#').trim();
    }

    // 2. 去除可能误粘的 URL 协议前缀与尾部斜杠
    text = text.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();

    // 3. 处理 CSV 或 空格/Tab 分隔的测速数据
    if (text.includes(',')) {
        const cols = text.split(',').map(c => c.trim()).filter(Boolean);
        if (cols.length >= 2 && /^\d+$/.test(cols[1])) {
            text = `${cols[0]}:${cols[1]}`;
        } else if (cols.length > 0) {
            text = cols[0];
        }
    } else if (/\s+/.test(text)) {
        const parts = text.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && /^\d+$/.test(parts[1])) {
            text = `${parts[0]}:${parts[1]}`;
        } else if (parts.length > 0) {
            text = parts[0];
        }
    }

    if (!text) return null;

    return remark ? `${text}#${remark}` : text;
}

// 纯客户端本地一键批量生成节点
function generateNodes() {
    const uuid = getVal('uuid');
    if (!uuid) {
        alert("请输入或生成 UUID！");
        document.getElementById('uuid').focus();
        return;
    }

    const genBtn = document.getElementById('genBtn');
    const originalBtnHtml = genBtn ? genBtn.innerHTML : '';

    const domainsText = getVal('domains');
    let finalDomains = [...new Set(
        domainsText.split('\n')
            .map(extractHostFromLine)
            .filter(Boolean)
    )];
    
    if (finalDomains.length === 0) {
        alert("请至少输入一个目标 IP 或域名！");
        document.getElementById('domains').focus();
        return;
    }

    document.getElementById('domains').value = finalDomains.join('\n');

    const port = getVal('port') || '443';
    const security = getVal('security') || 'none';
    const paramKeys = ['encryption', 'type', 'security', 'sni', 'fp', 'alpn', 'insecure', 'path', 'host', 'serviceName', 'mode', 'headerType', 'seed', 'flow', 'pbk', 'sid', 'spx'];
    
    const params = new URLSearchParams();
    paramKeys.forEach(key => {
        const val = getVal(key);
        if (val) {
            if (['pbk', 'sid', 'spx'].includes(key) && security !== 'reality') return; 
            params.append(key, val);
        }
    });

    let queryString = params.toString()
        .replace(/%2F/g, '/')
        .replace(/%2C/g, ',');

    const rawResults = finalDomains.map(item => {
        let fullItem = item;
        let customRemark = '';

        if (fullItem.includes('#')) {
            const parts = fullItem.split('#');
            fullItem = parts[0].trim();
            customRemark = parts.slice(1).join('#').trim();
        }

        let host = fullItem;
        let nodePort = port;

        if (host.startsWith('[')) {
            const endBracket = host.indexOf(']');
            if (endBracket !== -1) {
                const after = host.slice(endBracket + 1);
                if (after.startsWith(':')) {
                    nodePort = after.slice(1) || port;
                }
                host = host.substring(0, endBracket + 1);
            }
        } else if ((host.match(/:/g) || []).length === 1) {
            const [h, p] = host.split(':');
            if (p && /^\d+$/.test(p)) {
                host = h;
                nodePort = p;
            }
        }

        const formattedHost = (host.includes(':') && !host.startsWith('[')) ? `[${host}]` : host;
        const finalRemark = customRemark || item;
        const encodedRemark = encodeURIComponent(finalRemark);

        return `vless://${uuid}@${formattedHost}:${nodePort}?${queryString}#${encodedRemark}`;
    });

    const uniqueResults = [...new Set(rawResults)];
    document.getElementById('result').value = uniqueResults.join('\n');

    const badge = document.getElementById('resultCountBadge');
    if (badge) {
        badge.style.display = 'inline-block';
        badge.innerHTML = `已生成 ${uniqueResults.length} 个独立节点 (已去重)`;
    }
}

async function copyResults() {
    const resultEl = document.getElementById('result');
    const copyBtn = document.getElementById('copyBtn');
    const textToCopy = resultEl ? resultEl.value : '';

    if (!textToCopy) { alert("没有可复制的内容！请先生成节点。"); return; }
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            throw new Error("Clipboard API 不可用");
        }
        showCopySuccess(copyBtn);
    } catch (err) {
        const readonlyState = resultEl.readOnly;
        resultEl.readOnly = false;
        resultEl.focus();
        resultEl.select();
        resultEl.setSelectionRange(0, 999999);
        try {
            document.execCommand('copy');
            showCopySuccess(copyBtn);
        } catch (e) {
            alert("复制失败，请手动全选复制结果文本框！");
        }
        resultEl.readOnly = readonlyState;
    }
}

function showCopySuccess(btn) {
    if (!btn) return;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>已复制全部</span>';
    btn.classList.add('gen-btn-primary');
    btn.classList.remove('gen-btn-secondary');
    setTimeout(() => {
        btn.innerHTML = oldHtml;
        btn.classList.remove('gen-btn-primary');
        btn.classList.add('gen-btn-secondary');
    }, 1800);
}

// 页面加载完成后自动绑定事件
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const secEl = document.getElementById('security');
        if (secEl) {
            secEl.addEventListener('change', syncSecurityUI);
            syncSecurityUI();
        }
    });
}
