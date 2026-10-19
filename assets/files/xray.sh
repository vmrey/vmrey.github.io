#!/usr/bin/env bash

# --- 强制 Root 权限与错误终止 ---
if [[ $EUID -ne 0 ]]; then
    echo "错误：此脚本必须以 root 权限运行"
    exit 1
fi

# --- 全局常量定义 ---
FINGERPRINTS=("chrome" "firefox" "safari" "edge")

# --- 颜色与基础输出辅助函数 ---
echo_text_color() {
    local text="$1"
    local color="$2"
    local color_code="31" # 默认红色
    
    case "$color" in
        "green")  color_code="32" ;;
        "yellow") color_code="33" ;;
        "red")    color_code="31" ;;
    esac
    echo -e "\033[${color_code}m${text}\033[0m"
}

pause_menu() {
    read -r -p "${1:-按回车键返回菜单...}"
}

# --- 通用包管理器安装封装 ---
pkg_install() {
    local pkgs=("$@")
    [[ ${#pkgs[@]} -eq 0 ]] && return 0

    if command -v apt-get &> /dev/null; then
        apt-get update -y && apt-get install -y "${pkgs[@]}"
    elif command -v dnf &> /dev/null; then
        dnf install -y epel-release || true
        dnf install -y "${pkgs[@]}"
    elif command -v yum &> /dev/null; then
        yum clean all
        yum install -y epel-release || true
        yum install -y "${pkgs[@]}"
    elif command -v zypper &> /dev/null; then
        zypper refresh && zypper --non-interactive install -y "${pkgs[@]}"
    elif command -v apk &> /dev/null; then
        apk update && apk add --no-cache "${pkgs[@]}"
    elif command -v pacman &> /dev/null; then
        pacman -Sy --noconfirm "${pkgs[@]}"
    fi
}

# --- 依赖全自动安装模块 ---
install_dependencies() {
    local cmds=("curl" "jq" "sed" "awk" "openssl" "crontab" "unzip")
    local missing_pkgs=()
    local cmd pkg
    
    for cmd in "${cmds[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            pkg="$cmd"
            [[ "$cmd" == "awk" ]] && pkg="gawk"
            
            # 针对 crontab 匹配正确的包名
            if [[ "$cmd" == "crontab" ]]; then
                if command -v apt-get &> /dev/null; then 
                    pkg="cron"
                elif command -v apk &> /dev/null; then
                    pkg="busybox"
                else 
                    pkg="cronie"
                fi
            fi
            missing_pkgs+=("$pkg")
        fi
    done

    # 批量安装缺失组件，避免重复调用包管理器 update
    if [[ ${#missing_pkgs[@]} -gt 0 ]]; then
        echo_text_color "========================================" "yellow"
        echo_text_color " 正在安装缺失组件: ${missing_pkgs[*]} ..." "yellow"
        echo_text_color "========================================" "yellow"
        pkg_install "${missing_pkgs[@]}"
        echo_text_color "依赖安装尝试结束。" "green"
        echo ""
    fi

    # 独立处理 jq
    if ! command -v jq &>/dev/null; then
        echo_text_color "系统源中未找到 jq，正在直接拉取官方静态编译版..." "yellow"
        local jq_arch
        case "$(uname -m)" in
            x86_64|amd64)   jq_arch="jq-linux-amd64" ;;
            aarch64|arm64)  jq_arch="jq-linux-arm64" ;;
            armv7l|armhf)   jq_arch="jq-linux-armhf" ;;
            i386|i686)      jq_arch="jq-linux-i386" ;;
            riscv64)        jq_arch="jq-linux-riscv64" ;;
            s390x)          jq_arch="jq-linux-s390x" ;;
            *)              jq_arch="jq-linux-amd64" ;;
        esac
        curl -L -o /usr/bin/jq "https://github.com/jqlang/jq/releases/latest/download/${jq_arch}"
        chmod +x /usr/bin/jq
    fi

    # 最终复检
    for cmd in curl jq openssl crontab unzip; do
        if ! command -v "$cmd" &> /dev/null; then
            echo_text_color "严重错误：致命基础组件 $cmd 缺失！" "red"
            exit 1
        fi
    done
}

# 获取当前 SSH 端口 (多重检测，防止失联)
get_ssh_ports() {
    local ports=()
    local p

    # 1. 优先获取当前活跃的 SSH 连接端口
    if [[ -n "$SSH_CONNECTION" ]]; then
        p=$(echo "$SSH_CONNECTION" | awk '{print $4}')
        [[ -n "$p" ]] && ports+=("$p")
    fi

    # 2. 从 sshd 运行配置检测端口
    if command -v sshd &> /dev/null; then
        local sshd_ports
        sshd_ports=$(sshd -T 2>/dev/null | grep -i '^port ' | awk '{print $2}')
        for p in $sshd_ports; do
            [[ -n "$p" ]] && ports+=("$p")
        done
    fi

    # 3. 从系统套接字监听中检测 sshd 或 dropbear 进程
    local active_ssh
    active_ssh=$(ss -tlnp 2>/dev/null | grep -E 'sshd|dropbear' | awk '{print $4}' | awk -F':' '{print $NF}')
    for p in $active_ssh; do
        [[ -n "$p" ]] && ports+=("$p")
    done

    # 4. 读取 /etc/ssh/sshd_config 配置文件兜底
    if [[ -f /etc/ssh/sshd_config ]]; then
        local config_ports
        config_ports=$(grep -E '^\s*Port\s+[0-9]+' /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}')
        for p in $config_ports; do
            [[ -n "$p" ]] && ports+=("$p")
        done
    fi

    # 去重并清洗非数字
    local unique_ports=""
    if [[ ${#ports[@]} -gt 0 ]]; then
        unique_ports=$(printf "%s\n" "${ports[@]}" | sort -n -u | grep -E '^[0-9]+$')
    fi

    # 若未能检测到任何端口，默认放行 22
    if [[ -z "$unique_ports" ]]; then
        echo "22"
    else
        echo "$unique_ports"
    fi
}

# 安装并放行防火墙 (安全模式：默认仅放行 SSH 端口)
install_and_enable_firewall() {
    local ssh_ports
    local port
    
    ssh_ports=$(get_ssh_ports)
    echo_text_color "安全控制：检测到系统 SSH 端口: $(echo $ssh_ports | tr '\n' ' ')，防火墙默认仅放行 SSH..." "green"

    if command -v apt-get &> /dev/null || command -v pacman &> /dev/null; then
        pkg_install ufw
        command -v systemctl &> /dev/null && systemctl enable --now ufw
        ufw default deny incoming
        ufw default allow outgoing
        for port in $ssh_ports; do 
            ufw allow "$port"/tcp
        done
        ufw --force enable
    elif command -v dnf &> /dev/null || command -v yum &> /dev/null || command -v zypper &> /dev/null; then
        pkg_install firewalld
        systemctl enable --now firewalld
        for port in $ssh_ports; do 
            firewall-cmd --permanent --add-port="$port"/tcp
        done
        firewall-cmd --reload
    else
        echo "错误：未识别的包管理器，跳过防火墙自动化安装。"
        return 1
    fi
    echo "防火墙配置已完成，已启用入站全拒绝策略，并已安全放行 SSH 端口。"
}

# 动态放行单个端口
open_port() {
    local port=$1
    echo_text_color "正在尝试放行端口: $port ..." "yellow"
    
    if command -v ufw &>/dev/null && ufw status | grep -q "active"; then
        ufw allow "$port/tcp" >/dev/null 2>&1
    elif command -v firewall-cmd &>/dev/null && systemctl is-active --quiet firewalld; then
        firewall-cmd --zone=public --add-port="$port/tcp" --permanent >/dev/null 2>&1
        firewall-cmd --reload >/dev/null 2>&1
    elif command -v nft &>/dev/null && systemctl is-active --quiet nftables; then
        nft add rule inet filter input tcp dport "$port" accept >/dev/null 2>&1 || \
        nft add rule ip filter input tcp dport "$port" accept >/dev/null 2>&1
    elif command -v iptables &>/dev/null; then
        iptables -I INPUT -p tcp --dport "$port" -j ACCEPT
    fi
}

# 重启守护进程
restart_xray_service() {
    if command -v systemctl &>/dev/null; then
        systemctl restart xray && systemctl enable xray >/dev/null 2>&1
    elif command -v rc-service &>/dev/null; then
        rc-service xray restart && rc-update add xray default >/dev/null 2>&1
    fi
}

# 字节单位转换
human_bytes() {
    awk -v b="${1:-0}" 'BEGIN {
        split("B KB MB GB TB", u); i=1; v=b
        while (v >= 1024 && i < 5) { v /= 1024; i++ }
        printf "%.2f %s\n", v, u[i]
    }'
}

# 获取公网 IP (双栈兼容，优先 IPv4，支持纯 IPv6 与多源防卡死)
get_public_ip() {
    local ip
    # 1. 优先获取 IPv4 (3 秒超时防网络卡顿)
    ip=$(curl -4 -s --max-time 3 https://api.ipify.org 2>/dev/null || \
         curl -4 -s --max-time 3 https://ipv4.icanhazip.com 2>/dev/null || \
         curl -4 -s --max-time 3 https://ifconfig.me/ip 2>/dev/null)

    # 2. 若获取不到 IPv4 (如纯 IPv6 VPS)，回退获取 IPv6
    if [[ -z "$ip" ]]; then
        ip=$(curl -6 -s --max-time 3 https://api64.ipify.org 2>/dev/null || \
             curl -6 -s --max-time 3 https://ipv6.icanhazip.com 2>/dev/null || \
             curl -s --max-time 3 https://ifconfig.co 2>/dev/null)
    fi

    # 清除多余空白字符
    echo "$ip" | tr -d '[:space:]'
}

# =======================================================
# 核心引擎 1: 安装 Xray 内核
# =======================================================
install_xray_core() {
    echo_text_color "正在安装/更新 Xray 内核..." "yellow"
    bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
}

# =======================================================
# 核心引擎 2: 模板化 Xray 配置文件生成
# =======================================================
generate_xray_config() {
    local proxy_listen=$1
    local proxy_port=$2
    local proxy_protocol=$3
    local proxy_settings=$4
    local proxy_stream_settings=$5

    mkdir -p /usr/local/etc/xray
    cat <<EOF | jq . > /usr/local/etc/xray/config.json
{
  "log": {
    "loglevel": "warning"
  },
  "dns": {
    "servers": [
      "8.8.8.8",
      "8.8.4.4",
      "1.1.1.1",
      "1.0.0.1",
      "208.67.222.222",
      "localhost"
    ]
  },
  "stats": {},
  "api": {
    "tag": "api",
    "services": [
      "StatsService"
    ]
  },
  "policy": {
    "levels": {
      "0": {
        "statsUserUplink": true,
        "statsUserDownlink": true
      }
    },
    "system": {
      "statsInboundUplink": true,
      "statsInboundDownlink": true,
      "statsOutboundUplink": true,
      "statsOutboundDownlink": true
    }
  },
  "inbounds": [
    {
      "tag": "proxy",
      "listen": "${proxy_listen}",
      "port": ${proxy_port},
      "protocol": "${proxy_protocol}",
      "settings": ${proxy_settings},
      "streamSettings": ${proxy_stream_settings},
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls",
          "quic"
        ]
      }
    },
    {
      "listen": "127.0.0.1",
      "port": 10085,
      "protocol": "dokodemo-door",
      "settings": {
        "address": "127.0.0.1"
      },
      "tag": "api"
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "blocked",
      "protocol": "blackhole",
      "settings": {}
    },
    {
      "tag": "api",
      "protocol": "blackhole",
      "settings": {}
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "outboundTag": "blocked",
        "domain": [
          "geosite:category-ads-all"
        ]
      },
      {
        "type": "field",
        "inboundTag": [
          "api"
        ],
        "outboundTag": "api"
      }
    ]
  }
}
EOF
}

# =======================================================
# 核心引擎 3: 公共 Nginx 配置输出 (纯净融合分流版)
# =======================================================
print_nginx_config_guide() {
    local proxy_path=$1
    local proxy_port=$2

    echo_text_color "================ Nginx WS/XHTTP 融合分流配置 ================" "yellow"
    echo_text_color "将以下配置放入你网站的 server 块中：" "green"
    cat <<EOF
    location ${proxy_path} { 
        # 指向你的 Xray 后端端口
        proxy_pass http://127.0.0.1:${proxy_port}; 
        
        # ---------------- 通用反代标准配置 ----------------
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;

        # ---------------- WebSocket 兼容层 ----------------
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        # ---------------- xHTTP 核心优化层 ----------------
        proxy_buffering off;
        proxy_request_buffering off;
        chunked_transfer_encoding on;
        
        # ---------------- 长连接保活层 ----------------
        proxy_connect_timeout 60s;
        proxy_send_timeout 3600s;
        proxy_read_timeout 3600s;
    }
EOF
    echo "=================================================================="
    pause_menu
}

# =======================================================
# 节点配置通用组件
# =======================================================

# 伪装路径输入与生成 (输出去除了前导斜杠的路径)
prompt_xray_path() {
    local path_len=$(( (RANDOM % 11) + 6 ))
    local default_path
    default_path="$(head -c 64 /dev/urandom | tr -dc 'A-Za-z0-9' | head -c "$path_len")"
    [[ -z "$default_path" ]] && default_path="$(openssl rand -hex 4)"
    local xray_path
    read -r -p "请输入伪装路径 (留空则自动生成): " xray_path
    xray_path="${xray_path:-$default_path}"
    echo "${xray_path#/}"
}

# 用户数量输入
prompt_user_num() {
    local user_num
    read -r -p "请输入用户数量: " user_num
    echo "${user_num:-1}"
}

# 批量生成客户端 JSON
generate_clients() {
    local user_num="$1"
    local email_tag="$2"
    local with_sid="${3:-false}"

    for i in $(seq 1 "$user_num"); do 
        local fp=${FINGERPRINTS[$((RANDOM % ${#FINGERPRINTS[@]}))]}
        local uuid
        uuid=$(cat /proc/sys/kernel/random/uuid)
        local email="user${i}_${email_tag}@xray.com"
        if [[ "$with_sid" == "true" ]]; then
            local sid
            sid=$(openssl rand -hex $(( (RANDOM % 4) + 2 )))
            jq -n --arg id "$uuid" --arg fp "$fp" --arg sid "$sid" --arg email "$email" \
                '{ id: $id, level: 0, fingerprint: $fp, sid: $sid, email: $email }'
        else
            jq -n --arg id "$uuid" --arg fp "$fp" --arg email "$email" \
                '{ id: $id, level: 0, fingerprint: $fp, email: $email }'
        fi
    done | jq -s .
}

# 构造 inbounds 中的 settings 结构
generate_proxy_settings() {
    local clients="$1"
    local clean_clients
    clean_clients=$(echo "$clients" | jq -c 'map({id: .id, level: .level, email: .email})')
    jq -n --argjson cls "$clean_clients" '{ "decryption": "none", "clients": $cls }'
}

# =======================================================
# 功能: 部署 VLESS-Reality (不需 Nginx)
# =======================================================
install_vless_reality() {
    clear
    echo_text_color "=== 开始部署 VLESS-Reality + XHTTP ===" "green"
    
    local default_domains=("www.amazon.com" "www.tesla.com" "www.apple.com")
    local xray_domain xray_path xray_port=443 user_num current_ip node_host
    local temp_key private_key public_key
    local clients short_ids proxy_settings proxy_stream_settings

    read -r -p "请输入伪装域名 (默认随机知名域名): " xray_domain
    [[ -z "$xray_domain" ]] && xray_domain="${default_domains[$(( RANDOM % ${#default_domains[@]} ))]}"

    xray_path=$(prompt_xray_path)
    user_num=$(prompt_user_num)

    install_and_enable_firewall
    open_port "$xray_port"
    current_ip=$(get_public_ip)
    [[ -z "$current_ip" ]] && current_ip="YOUR_SERVER_IP"

    # 若为 IPv6 地址，根据 RFC 规范在 URL 节点主机部分添加中括号 [ipv6]
    node_host="$current_ip"
    [[ "$current_ip" == *:* ]] && node_host="[${current_ip}]"

    install_xray_core

    local xray_bin
    xray_bin=$(command -v xray 2>/dev/null || echo "/usr/local/bin/xray")
    temp_key=$("$xray_bin" x25519)
    private_key=$(echo "$temp_key" | grep -i "Private" | awk '{print $NF}')
    public_key=$(echo "$temp_key" | grep -i "Public" | awk '{print $NF}')
    
    if [[ -z "$private_key" || -z "$public_key" ]]; then
        echo_text_color "严重错误：无法生成 Reality 密钥！" "red"
        sleep 3
        return 1
    fi

    clients=$(generate_clients "$user_num" "xhttp" true)
    short_ids=$(echo "$clients" | jq -c '[.[].sid]')
    proxy_settings=$(generate_proxy_settings "$clients")

    proxy_stream_settings=$(jq -n \
        --arg domain "$xray_domain" \
        --arg path "/$xray_path" \
        --arg pk "$private_key" \
        --argjson sids "$short_ids" \
        '{
          "network": "xhttp", "security": "reality",
          "realitySettings": {
            "show": false, "dest": ($domain + ":443"), "serverNames": [$domain],
            "privateKey": $pk, "shortIds": $sids
          },
          "xhttpSettings": { "host": "", "path": $path, "mode": "auto" }
        }')

    generate_xray_config "0.0.0.0" "$xray_port" "vless" "$proxy_settings" "$proxy_stream_settings"
    restart_xray_service

    echo -e "\n"
    echo_text_color "================ 节点列表 (直接复制即可) ================" "green"
    echo "$clients" | jq -c '.[]' | while read -r client; do
        local uuid fp sid
        uuid=$(echo "$client" | jq -r '.id')
        fp=$(echo "$client" | jq -r '.fingerprint')
        sid=$(echo "$client" | jq -r '.sid')
        echo_text_color "vless://${uuid}@${node_host}:${xray_port}?encryption=none&security=reality&sni=${xray_domain}&fp=${fp}&pbk=${public_key}&sid=${sid}&spx=%2F${xray_path}&type=xhttp&path=%2F${xray_path}&mode=auto#XHTTP-${current_ip}" "green"
        echo "" 
    done
    pause_menu
}

# =======================================================
# 功能: 部署 VLESS (XHTTP/WS) + Nginx 反代 通用逻辑
# =======================================================
install_vless_nginx() {
    local mode="$1" # "xhttp" 或 "ws"
    local mode_upper
    mode_upper=$(echo "$mode" | tr '[:lower:]' '[:upper:]')

    clear
    echo_text_color "=== 开始部署 VLESS-${mode_upper} + Nginx 反代 ===" "green"
    
    local raw_domain xray_domain xray_path xray_port user_num
    local clients proxy_settings proxy_stream_settings

    read -r -p "请输入域名 (建议手动键盘输入): " raw_domain
    xray_domain=$(echo "$raw_domain" | tr -cd '[:alnum:].-')
    [[ -z "$xray_domain" ]] && { echo_text_color "域名格式错误" "red"; sleep 2; return 1; }

    xray_path="/$(prompt_xray_path)"
    xray_port=$(shuf -i 10000-65535 -n1)
    user_num=$(prompt_user_num)

    install_and_enable_firewall
    open_port 443
    install_xray_core

    local email_tag="${mode}"
    [[ "$mode" == "xhttp" ]] && email_tag="xhttp_nginx"

    clients=$(generate_clients "$user_num" "$email_tag" false)
    proxy_settings=$(generate_proxy_settings "$clients")
    
    if [[ "$mode" == "xhttp" ]]; then
        proxy_stream_settings=$(jq -n \
            --arg path "$xray_path" \
            --arg host "$xray_domain" \
            '{ 
              "network": "xhttp", 
              "security": "none",
              "xhttpSettings": { "path": $path, "host": $host, "mode": "auto" }
            }')
    else
        proxy_stream_settings=$(jq -n \
            --arg path "$xray_path" \
            --arg host "$xray_domain" \
            '{ "network": "ws", "wsSettings": { "path": $path, "host": $host } }')
    fi
        
    generate_xray_config "127.0.0.1" "$xray_port" "vless" "$proxy_settings" "$proxy_stream_settings"
    restart_xray_service

    echo -e "\n"
    echo_text_color "================ 节点列表 (直接复制即可) ================" "green"
    echo "$clients" | jq -c '.[]' | while read -r client; do
        local uuid fp
        uuid=$(echo "$client" | jq -r '.id')
        fp=$(echo "$client" | jq -r '.fingerprint')
        if [[ "$mode" == "xhttp" ]]; then
            echo_text_color "vless://${uuid}@${xray_domain}:443?type=xhttp&path=${xray_path}&host=${xray_domain}&security=tls&sni=${xray_domain}&fp=${fp}&mode=auto#XHTTP-Nginx-${xray_domain}" "green"
        else
            echo_text_color "vless://${uuid}@${xray_domain}:443?type=ws&path=${xray_path}&host=${xray_domain}&security=tls&sni=${xray_domain}&fp=${fp}#${xray_domain}-${fp}" "green"
        fi
        echo "" 
    done
    
    print_nginx_config_guide "$xray_path" "$xray_port"
}

# 部署入口保持原有函数名，确保菜单与外部调用兼容
install_vless_xhttp_nginx() { 
    install_vless_nginx "xhttp"
}

install_vless_ws_nginx() { 
    install_vless_nginx "ws"
}

# =======================================================
# 功能: 流量统计模块
# =======================================================
xray_traffic() {
    clear
    local api_server="127.0.0.1:10085"
    local xray_bin
    xray_bin=$(command -v xray 2>/dev/null || echo "/usr/local/bin/xray")
    local data

    if [[ ! -x "$xray_bin" ]]; then
        echo_text_color "错误：Xray 未安装。" "red"
        pause_menu "按回车键返回..."
        return 1
    fi

    echo_text_color "正在读取服务器流量数据..." "yellow"
    
    get_api_data() {
        "$xray_bin" api statsquery --server="$api_server" | awk '{
            if (match($1, /"name":/)) {
                f=1; gsub(/^"|",$/, "", $2); gsub(/,$/, "", $2);
                split($2, p, ">>>");
                printf "%s:%s->%s\t", p[1], p[2], p[4];
            } else if (match($1, /"value":/) && f) {
                f=0; gsub(/"/, "", $2); printf "%.0f\n", $2;
            } else if (match($0, /}/) && f) {
                f=0; print 0;
            }
        }'
    }

    print_sum() {
        local sum_data="$1" 
        local prefix="$2"
        local sorted 
        local sum_total
        
        sorted=$(echo "$sum_data" | grep "^${prefix}" | sort -r)
        sum_total=$(echo "$sorted" | awk '
            /->up/   { us += $2 }
            /->down/ { ds += $2 }
            END { printf "SUM->up\t%.0f\nSUM->down\t%.0f\nSUM->TOTAL\t%.0f\n", us, ds, us+ds }
        ')
        
        printf "%s\n%s\n" "$sorted" "$sum_total" | while IFS=$(printf '\t') read -r name bytes; do
            [[ -z "$name" ]] && continue
            printf "%-35s %s\n" "$name" "$(human_bytes "${bytes:-0}")"
        done
    }

    data=$(get_api_data)
    
    if [[ -z "$data" ]]; then
        echo_text_color "无法获取数据。" "red"
    else
        echo -e "\n"
        echo_text_color "=============== Xray 流量统计 ===============" "green"
        echo_text_color "------------ 1. 协议入站 (Inbound) ------------" "yellow"
        print_sum "$data" "inbound"
        echo_text_color "------------ 2. 协议出站 (Outbound) -----------" "yellow"
        print_sum "$data" "outbound"
        echo_text_color "------------ 3. 独立用户明细 (User) -----------" "green"
        print_sum "$data" "user"
        echo_text_color "===============================================" "green"
    fi
    pause_menu
}

# =======================================================
# 功能: 设置自动更新
# =======================================================
setup_auto_update() {
    clear
    echo_text_color "=== 设置 Xray 每月自动更新 ===" "green"
    cat > /opt/update_xray.sh << 'EOF'
#!/bin/bash
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
if command -v systemctl &>/dev/null; then systemctl restart xray; else rc-service xray restart; fi
EOF
    chmod +x /opt/update_xray.sh

    local current_cron
    current_cron=$(crontab -l 2>/dev/null | grep -v "update_xray.sh" || true)
    printf "%s\n0 3 1 * * /opt/update_xray.sh\n" "$current_cron" | sed '/^$/d' | crontab -

    # 启动并激活 cron 守护进程
    if command -v systemctl &>/dev/null; then
        systemctl enable --now cron 2>/dev/null || systemctl enable --now crond 2>/dev/null || true
    elif command -v rc-service &>/dev/null; then
        rc-service crond start 2>/dev/null && rc-update add crond default 2>/dev/null || true
    fi
    
    echo_text_color "配置成功！已设置每月 1 号凌晨 3:00 自动更新。" "green"
    pause_menu
}

# =======================================================
# 主菜单逻辑
# =======================================================
main_menu() {
    local choice
    
    echo_text_color "正在初始化系统依赖环境，请稍候..." "yellow"
    install_dependencies
    
    while true; do
        clear
        echo_text_color "=============================================" "green"
        echo_text_color "        Xray 综合管理脚本 (极致兼容版)" "yellow"
        echo_text_color "=============================================" "green"
        echo "  1. 部署 VLESS-Reality + XHTTP (直连推荐)"
        echo "  2. 部署 VLESS-XHTTP + Nginx 反代 (共存推荐 / 支持 cdn)"
        echo "  3. 部署 VLESS-WS + Nginx 反代 (共存推荐 / 支持 cdn)"
        echo "  4. 查看 Xray 单用户流量统计"
        echo "  5. 设置 Xray 内核每月自动更新"
        echo "  6. 退出脚本"
        echo_text_color "=============================================" "green"
        read -r -p "请输入对应数字 [1-6]: " choice
        
        case "$choice" in
            1) install_vless_reality ;;
            2) install_vless_xhttp_nginx ;;
            3) install_vless_ws_nginx ;;
            4) xray_traffic ;;
            5) setup_auto_update ;;
            6) echo_text_color "退出脚本，再见！" "green"; exit 0 ;;
            *) echo_text_color "输入错误，请重新输入" "red"; sleep 1 ;;
        esac
    done
}

# 启动菜单
main_menu
