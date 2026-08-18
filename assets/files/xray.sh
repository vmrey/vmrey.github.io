#!/usr/bin/env bash

# --- 强制 Root 权限与错误终止 ---
if [[ $EUID -ne 0 ]]; then
    echo "错误：此脚本必须以 root 权限运行"
    exit 1
fi

# --- 颜色定义函数 ---
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

# --- 依赖全自动安装模块 ---
install_dependencies() {
    local cmds=("curl" "jq" "sed" "awk" "openssl" "crontab" "unzip")
    local cmd
    local pkg
    
    for cmd in "${cmds[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            echo_text_color "========================================" "yellow"
            echo_text_color " 正在安装缺失组件: $cmd ..." "yellow"
            echo_text_color "========================================" "yellow"
            
            pkg="$cmd"
            if [[ "$cmd" == "awk" ]]; then 
                pkg="gawk"
            fi
            
            # 针对 crontab 匹配正确的包名
            if [[ "$cmd" == "crontab" ]]; then
                if command -v apt-get &> /dev/null; then 
                    pkg="cron"
                else 
                    pkg="cronie"
                fi
            fi
            
            # 执行包安装逻辑
            if command -v apt-get &> /dev/null; then
                apt-get update -y && apt-get install -y "$pkg"
            elif command -v dnf &> /dev/null; then
                dnf install -y epel-release || true
                dnf install -y "$pkg"
            elif command -v yum &> /dev/null; then
                yum clean all
                yum install -y epel-release || true
                yum install -y "$pkg"
            elif command -v apk &> /dev/null; then
                [[ "$cmd" == "crontab" ]] && pkg="busybox"
                apk update && apk add --no-cache "$pkg"
            fi
            
            echo_text_color "$cmd 安装尝试结束。" "green"
            echo ""
        fi
    done

    # 独立处理 jq
    if ! command -v jq &>/dev/null; then
        echo_text_color "系统源中未找到 jq，正在直接拉取官方静态编译版..." "yellow"
        local jq_arch="jq-linux64"
        if [[ "$(uname -m)" == "aarch64" ]]; then
            jq_arch="jq-linux-arm64"
        fi
        curl -L -o /usr/bin/jq "https://github.com/jqlang/jq/releases/download/jq-1.7.1/${jq_arch}"
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

# 获取活跃端口
get_active_ports() {
    ss -tln | awk 'NR>1 {print $4}' | awk -F':' '{print $NF}' | grep -v '^10085$' | sort -n -u | grep -v '^$'
}

# 安装并放行防火墙
install_and_enable_firewall() {
    local active_ports
    local pkg_manager
    local port
    
    active_ports=$(get_active_ports)
    echo "检测到当前系统正在监听以下端口: $active_ports"

    if command -v apt-get &> /dev/null; then
        apt-get update -y && apt-get install -y ufw
        ufw default deny incoming
        ufw default allow outgoing
        for port in $active_ports; do 
            ufw allow "$port"/tcp
        done
        ufw --force enable
    elif command -v dnf &> /dev/null || command -v yum &> /dev/null; then
        if command -v dnf &> /dev/null; then
            pkg_manager="dnf"
        else
            pkg_manager="yum"
        fi
        $pkg_manager install -y firewalld
        systemctl enable --now firewalld
        for port in $active_ports; do 
            firewall-cmd --permanent --add-port="$port"/tcp
        done
        firewall-cmd --reload
    elif command -v pacman &> /dev/null; then
        pacman -Sy --noconfirm ufw
        systemctl enable --now ufw
        for port in $active_ports; do 
            ufw allow "$port"/tcp
        done
        ufw --force enable
    else
        echo "错误：未识别的包管理器，跳过防火墙自动化安装。"
        return 1
    fi
    echo "防火墙配置已完成，所有活跃端口已放行。"
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
    read -p "按回车键返回菜单..."
}

# =======================================================
# 功能: 部署 VLESS-Reality (不需 Nginx)
# =======================================================
install_vless_reality() {
    clear
    echo_text_color "=== 开始部署 VLESS-Reality + XHTTP ===" "green"
    
    local default_domains=("www.amazon.com" "www.tesla.com" "www.apple.com")
    local xray_domain
    local path_len
    local xray_path
    local xray_port
    local user_num
    local current_ip
    local temp_key
    local private_key
    local public_key
    local fingerprints
    local clients
    local clean_clients
    local short_ids
    local proxy_settings
    local proxy_stream_settings

    read -p "请输入伪装域名 (默认随机知名域名): " xray_domain
    [[ -z "$xray_domain" ]] && xray_domain="${default_domains[$(( RANDOM % ${#default_domains[@]} ))]}"

    path_len=$(( (RANDOM % 11) + 6 ))
    read -p "请输入伪装路径 (留空则自动生成): " xray_path
    [[ -z "$xray_path" ]] && xray_path="$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c $path_len)"
    xray_path=$(echo "$xray_path" | sed 's/^\///') 

    xray_port=443
    read -p "请输入用户数量: " user_num
    user_num=${user_num:-1}

    open_port $xray_port
    current_ip=$(curl -s https://ipv4.icanhazip.com 2>/dev/null || curl -s https://api.ipify.org 2>/dev/null)

    install_xray_core

    temp_key=$(/usr/local/bin/xray x25519)
    private_key=$(echo "$temp_key" | grep -i "Private" | awk '{print $NF}')
    public_key=$(echo "$temp_key" | grep -i "Public" | awk '{print $NF}')
    
    if [[ -z "$private_key" || -z "$public_key" ]]; then
        echo_text_color "严重错误：无法生成 Reality 密钥！" "red"
        sleep 3
        return 1
    fi

    fingerprints=("chrome" "firefox" "safari" "ios" "android" "edge")
    clients=$(for i in $(seq 1 "$user_num"); do 
        fp=${fingerprints[$((RANDOM % ${#fingerprints[@]}))]}
        uuid=$(cat /proc/sys/kernel/random/uuid)
        sid=$(openssl rand -hex $(( (RANDOM % 4) + 2 )))
        jq -n --arg id "$uuid" --arg fp "$fp" --arg sid "$sid" --arg email "user${i}_xhttp@xray.com" '{ id: $id, level: 0, fingerprint: $fp, sid: $sid, email: $email }'
    done | jq -s .)

    clean_clients=$(echo "$clients" | jq -c 'map({id: .id, level: .level, email: .email})')
    short_ids=$(echo "$clients" | jq -c '[.[].sid]')

    proxy_settings=$(jq -n --argjson cls "$clean_clients" '{ "decryption": "none", "clients": $cls }')
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
        uuid=$(echo "$client" | jq -r '.id')
        fp=$(echo "$client" | jq -r '.fingerprint')
        sid=$(echo "$client" | jq -r '.sid')
        echo_text_color "vless://${uuid}@${current_ip}:${xray_port}?encryption=none&security=reality&sni=${xray_domain}&fp=${fp}&pbk=${public_key}&sid=${sid}&spx=%2F${xray_path}&type=xhttp&path=%2F${xray_path}&mode=auto#XHTTP-${current_ip}" "green"
        echo "" 
    done
    read -p "按回车键返回菜单..."
}

# =======================================================
# 功能: 部署 VLESS-XHTTP + Nginx 反代 
# =======================================================
install_vless_xhttp_nginx() {
    clear
    echo_text_color "=== 开始部署 VLESS-XHTTP + Nginx 反代 ===" "green"
    
    local raw_domain
    local xray_domain
    local path_len
    local xray_path
    local xray_port
    local user_num
    local fingerprints
    local clients
    local clean_clients
    local proxy_settings
    local proxy_stream_settings

    read -p "请输入域名 (建议手动键盘输入): " raw_domain
    xray_domain=$(echo "$raw_domain" | tr -cd '[:alnum:].-')
    [[ -z "$xray_domain" ]] && { echo_text_color "域名格式错误" "red"; sleep 2; return; }

    path_len=$(( (RANDOM % 11) + 6 ))
    read -p "请输入伪装路径 (留空则自动生成): " xray_path
    [[ -z "$xray_path" ]] && xray_path="/$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c $path_len)"
    [[ "$xray_path" != /* ]] && xray_path="/$xray_path"

    xray_port=$(shuf -i 10000-65535 -n1)
    read -p "请输入用户数量: " user_num
    user_num=${user_num:-1}

    open_port 80
    open_port 443
    install_xray_core

    fingerprints=("chrome" "firefox" "safari" "ios" "android" "edge")
    clients=$(for i in $(seq 1 "$user_num"); do 
        fp=${fingerprints[$((RANDOM % ${#fingerprints[@]}))]}
        uuid=$(cat /proc/sys/kernel/random/uuid)
        jq -n --arg id "$uuid" --arg fp "$fp" --arg email "user${i}_xhttp_nginx@xray.com" '{ id: $id, level: 0, fingerprint: $fp, email: $email }'
    done | jq -s .)

    clean_clients=$(echo "$clients" | jq -c 'map({id: .id, level: .level, email: .email})')
    
    proxy_settings=$(jq -n --argjson cls "$clean_clients" '{ "decryption": "none", "clients": $cls }')
    proxy_stream_settings=$(jq -n \
        --arg path "$xray_path" \
        --arg host "$xray_domain" \
        '{ 
          "network": "xhttp", 
          "security": "none",
          "xhttpSettings": { "path": $path, "host": $host, "mode": "auto" }
        }')
        
    generate_xray_config "127.0.0.1" "$xray_port" "vless" "$proxy_settings" "$proxy_stream_settings"
    restart_xray_service

    echo -e "\n"
    echo_text_color "================ 节点列表 (直接复制即可) ================" "green"
    echo "$clients" | jq -c '.[]' | while read -r client; do
        uuid=$(echo "$client" | jq -r '.id')
        fp=$(echo "$client" | jq -r '.fingerprint')
        echo_text_color "vless://${uuid}@${xray_domain}:443?type=xhttp&path=${xray_path}&host=${xray_domain}&security=tls&sni=${xray_domain}&fp=${fp}&mode=auto#XHTTP-Nginx-${xray_domain}" "green"
        echo "" 
    done
    
    print_nginx_config_guide "$xray_path" "$xray_port"
}

# =======================================================
# 功能: 部署 VLESS-WS + Nginx 反代
# =======================================================
install_vless_ws_nginx() {
    clear
    echo_text_color "=== 开始部署 VLESS-WS + Nginx 反代 ===" "green"
    
    local raw_domain
    local xray_domain
    local path_len
    local xray_path
    local xray_port
    local user_num
    local fingerprints
    local clients
    local clean_clients
    local proxy_settings
    local proxy_stream_settings

    read -p "请输入域名 (建议手动键盘输入): " raw_domain
    xray_domain=$(echo "$raw_domain" | tr -cd '[:alnum:].-')
    [[ -z "$xray_domain" ]] && { echo_text_color "域名格式错误" "red"; sleep 2; return; }

    path_len=$(( (RANDOM % 11) + 6 ))
    read -p "请输入伪装路径 (留空则自动生成): " xray_path
    [[ -z "$xray_path" ]] && xray_path="/$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c $path_len)"
    [[ "$xray_path" != /* ]] && xray_path="/$xray_path"

    xray_port=$(shuf -i 10000-65535 -n1)
    read -p "请输入用户数量: " user_num
    user_num=${user_num:-1}

    open_port 80
    open_port 443
    install_xray_core

    fingerprints=("chrome" "firefox" "safari" "ios" "android" "edge")
    clients=$(for i in $(seq 1 "$user_num"); do 
        fp=${fingerprints[$((RANDOM % ${#fingerprints[@]}))]}
        uuid=$(cat /proc/sys/kernel/random/uuid)
        jq -n --arg id "$uuid" --arg fp "$fp" --arg email "user${i}_ws@xray.com" '{ id: $id, level: 0, fingerprint: $fp, email: $email }'
    done | jq -s .)

    clean_clients=$(echo "$clients" | jq -c 'map({id: .id, level: .level, email: .email})')
    
    proxy_settings=$(jq -n --argjson cls "$clean_clients" '{ "decryption": "none", "clients": $cls }')
    proxy_stream_settings=$(jq -n \
        --arg path "$xray_path" \
        --arg host "$xray_domain" \
        '{ "network": "ws", "wsSettings": { "path": $path, "host": $host } }')
        
    generate_xray_config "127.0.0.1" "$xray_port" "vless" "$proxy_settings" "$proxy_stream_settings"
    restart_xray_service

    echo -e "\n"
    echo_text_color "================ 节点列表 (直接复制即可) ================" "green"
    echo "$clients" | jq -c '.[]' | while read -r client; do
        uuid=$(echo "$client" | jq -r '.id')
        fp=$(echo "$client" | jq -r '.fingerprint')
        echo_text_color "vless://${uuid}@${xray_domain}:443?type=ws&path=${xray_path}&host=${xray_domain}&security=tls&sni=${xray_domain}&fp=${fp}#${xray_domain}-${fp}" "green"
        echo "" 
    done

    print_nginx_config_guide "$xray_path" "$xray_port"
}

# =======================================================
# 功能: 流量统计模块
# =======================================================
xray_traffic() {
    clear
    local api_server="127.0.0.1:10085"
    local xray_bin="/usr/local/bin/xray"
    local data

    if [[ ! -x "$xray_bin" ]]; then
        echo_text_color "错误：Xray 未安装。" "red"
        read -p "按回车键返回..."
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
    read -p "按回车键返回菜单..."
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
    (crontab -l 2>/dev/null | grep -v "update_xray.sh") | crontab -
    (crontab -l 2>/dev/null; echo "0 3 1 * * /opt/update_xray.sh") | crontab -
    
    echo_text_color "配置成功！已设置每月 1 号凌晨 3:00 自动更新。" "green"
    read -p "按回车键返回菜单..."
}

# =======================================================
# 主菜单逻辑
# =======================================================
main_menu() {
    local choice
    
    echo_text_color "正在初始化系统环境与防火墙，请稍候..." "yellow"
    install_dependencies
    install_and_enable_firewall
    
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
        read -p "请输入对应数字 [1-6]: " choice
        
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
