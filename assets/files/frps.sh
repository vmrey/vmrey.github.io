#!/bin/bash
# Description: frps 一键安装脚本
# Author: vmrey.github.io
# Date: 2025-12-02 
# 版权/优化信息已修改为 vmrey.github.io
# --------------------------------------------------------------------------------

# 设置 PATH 环境变量
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# 设置程序信息
program_name="frps"
version="1.0.9-final" 
str_program_dir="/usr/local/${program_name}"
program_init="/etc/init.d/${program_name}"
program_service="/etc/systemd/system/${program_name}.service"
program_config_file="frps.toml"
ver_file="/tmp/.frp_ver.sh"

# 假设这些文件托管在 GitHub 上
FRPS_SERVICE="https://raw.githubusercontent.com/mvscode/frps-onekey/master/frps.service" 
FRPS_INIT="https://raw.githubusercontent.com/mvscode/frps-onekey/master/frps.init"

# 设置颜色变量
fun_set_text_color(){
    COLOR_RED='\E[1;31m'
    COLOR_GREEN='\E[1;32m'
    COLOR_YELOW='\E[1;33m'
    COLOR_BLUE='\E[1;34m'
    COLOR_PINK='\E[1;35m'
    COLOR_PINKBACK_WHITEFONT='\033[45;37m'
    COLOR_GREEN_LIGHTNING='\033[32m \033[05m'
    COLOR_END='\E[0m'
}

# 打印 frps 欢迎信息和程序信息
fun_frps(){
    local clear_flag=""
    clear_flag=$1
    if [[ ${clear_flag} == "clear" ]]; then
        clear
    fi
    echo ""
    echo "+------------------------------------------------------------+"
    echo "|    frps for Linux Server, Author Clang, Mender MvsCode     |" 
    echo "|      A tool to auto-compile & install frps on Linux        |"
    echo "+------------------------------------------------------------+"
    echo ""
}

# 检查用户是否为 root
rootness(){
    if [[ $EUID -ne 0 ]]; then
        fun_frps
        echo "错误: 本脚本必须以 root 用户身份运行!" 1>&2
        exit 1
    fi
}

# 获取单字符输入
get_char(){
    SAVEDSTTY=`stty -g`
    stty -echo
    stty cbreak
    dd if=/dev/tty bs=1 count=1 2> /dev/null
    stty -raw
    stty echo
    stty $SAVEDSTTY
}

# 检查操作系统
checkos(){
    if [[ -f /etc/redhat-release ]]; then
        OS="CentOS"
    elif [[ -f /etc/debian_version ]]; then
        OS="Debian"
    elif [[ -f /etc/issue ]]; then
        OS="Debian"
    else
        echo "不支持的操作系统。请使用受支持的 Linux 发行版重试!"
        exit 1
    fi
    
    # 检查是否支持 Systemd
    if [ -d /run/systemd/system ]; then
        HAS_SYSTEMD="true"
    else
        HAS_SYSTEMD="false"
    fi
}

# 获取操作系统版本
getversion(){
    if [[ -s /etc/redhat-release ]]; then
        grep -oE "[0-9.]+" /etc/redhat-release
    else
        grep -oE "[0-9.]+" /etc/issue
    fi
}

# 检查操作系统版本
check_os_version(){
    local_version=$(getversion)
    if [[ "${local_version}" == "" ]]; then
        echo "无法检测操作系统版本!"
        exit 1
    fi
}

# 检查系统位数和架构，增加 ARM64 支持
check_os_bit(){
    case "$(uname -m)" in
        x86_64)
            ARCHS="amd64"
            ;;
        i386|i686)
            ARCHS="386"
            ;;
        armv7l)
            ARCHS="arm"
            ;;
        aarch64)
            ARCHS="arm64"
            ;;
        *)
            echo "错误: 不支持的系统架构! 请联系作者增加支持。"
            exit 1
            ;;
    esac
    echo "识别到的系统架构: ${ARCHS}"
}

# 禁用 SELinux
disable_selinux(){
    if [ -s /etc/selinux/config ] && grep 'SELINUX=enforcing' /etc/selinux/config; then
        sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
        setenforce 0
    fi
}

# 预安装所需软件包，确保安装 curl
pre_install_packs(){
    local wget_flag=$(which wget | wc -l)
    local curl_flag=$(which curl | wc -l)
    local killall_flag=$(which killall | wc -l)
    local netstat_flag=$(which netstat | wc -l)
    
    if [[ ${wget_flag} -gt 1 ]] || [[ ${curl_flag} -gt 1 ]] || [[ ${killall_flag} -gt 1 ]] || [[ ${netstat_flag} -gt 6 ]];then
        echo -e "${COLOR_GREEN} 正在安装支持软件包 (wget, curl, psmisc, net-tools)...${COLOR_END}"
        if [ "${OS}" == 'CentOS' ]; then
            yum install -y wget curl psmisc net-tools
        else
            apt-get -y update && apt-get -y install wget curl psmisc net-tools
        fi
    fi
}

# --- 新增随机长度生成函数 ---
# 随机长度生成器 [min, max]
get_random_length() {
    local min=$1
    local max=$2
    # 计算范围
    local range=$(( max - min + 1 ))
    if [ $range -le 0 ]; then
        echo $min
        return
    fi
    # 使用 $RANDOM 产生范围内的随机数
    echo $(( min + RANDOM % range ))
}

# 随机字符串生成
fun_randstr(){
    local len=$1
    # 从 /dev/urandom 中读取随机字节并转换为字母数字
    echo $(head /dev/urandom | tr -dc A-Za-z0-9 | head -c ${len})
}

# 选择 frps 下载源 (Gitee/Github)
fun_getServer(){
    def_server_url="github"
    echo ""
    echo -e "请选择 ${COLOR_PINK}${program_name} 下载${COLOR_END} 源:"
    echo -e "[1].gitee"
    echo -e "[2].github (默认)"
    read -e -p "请输入您的选择 (1, 2 或 exit. 默认 [${def_server_url}]): " set_server_url
    [ -z "${set_server_url}" ] && set_server_url="${def_server_url}"
    
    export gitee_download_url="https://gitee.com/mvscode/frps-onekey/releases/download"
    export github_download_url="https://github.com/fatedier/frp/releases/download"
    export gitee_latest_version_api="https://gitee.com/api/v5/repos/mvscode/frps-onekey/releases/latest"
    export github_latest_version_api="https://api.github.com/repos/fatedier/frp/releases/latest"

    case "${set_server_url}" in
        1|[Ga][Ii][Tt][Ee][Ee])
            program_download_url=${gitee_download_url};
            choice=1
            ;;
        2|[Gg][Ii][Tt][Hh][Uu][Bb])
            program_download_url=${github_download_url};
            choice=2
            ;;
        [eE][xX][iI][tT])
            exit 1
            ;;
        *)
            program_download_url=${github_download_url}
            choice=2
            ;;
    esac
    echo    "-----------------------------------"
    echo -e "       您的选择: ${COLOR_YELOW}${set_server_url}${COLOR_END}    "
    echo    "-----------------------------------"
}

# 获取 frps 的最新版本号
fun_getVer(){
    echo -e "正在加载 ${program_name} 网络最新版本，请稍候..."
    
    LATEST_RELEASE=""
    case $choice in
        1)  LATEST_RELEASE=$(curl -s ${gitee_latest_version_api} | grep -oP '"tag_name":"\Kv[^"]+' | cut -c2-);;
        2)  LATEST_RELEASE=$(curl -s ${github_latest_version_api} | grep '"tag_name":' | cut -d '"' -f 4 | cut -c 2-);;
    esac
    
    if [[ ! -z "$LATEST_RELEASE" ]]; then
        FRPS_VER="$LATEST_RELEASE"
        echo "FRPS 版本已设置为: $FRPS_VER"
    else
        FRPS_VER="0.51.3" # 默认版本
        echo "获取最新版本失败，使用默认版本: $FRPS_VER"
    fi
    
    program_latest_filename="frp_${FRPS_VER}_linux_${ARCHS}.tar.gz"
    program_latest_file_url="${program_download_url}/v${FRPS_VER}/${program_latest_filename}"
    
    if [ -z "${program_latest_filename}" ]; then
        echo -e "${COLOR_RED}加载网络版本失败!!!${COLOR_END}"
    else
        echo -e "${program_name} 最新发布文件: ${COLOR_GREEN}${program_latest_filename}${COLOR_END}"
    fi
}

# 显示下载进度
show_progress() {
    local pid=$!
    local delay=0.75
    local spin="⣾⣽⣻⢿⡿⣟⣯⣷"
    local i=0
    while kill -0 $pid 2>/dev/null; do
        local char=${spin:$i%8:1}
        printf "\r正在下载... %s" "$char"
        sleep $delay
        i=$((i+1))
    done
    printf "\r下载已完成      "
}

# 下载并解压 frps 二进制文件
fun_download_file(){
    if [ ! -s ${str_program_dir}/${program_name} ]; then
        rm -fr ${program_latest_filename} frp_${FRPS_VER}_linux_${ARCHS}
	echo -e "正在下载 ${program_name}..."
	echo ""
        curl -L --progress-bar "${program_latest_file_url}" -o "${program_latest_filename}" 2>&1 | show_progress
	echo ""		
	
	if [ $? -ne 0 ]; then
        echo -e " ${COLOR_RED}下载失败${COLOR_END}"
	exit 1
    fi
	
    if [ ! -s ${program_latest_filename} ]; then
      echo -e " ${COLOR_RED}下载文件为空或未找到${COLOR_END}"
      exit 1
    fi		
      echo -e "正在解压 ${program_name}..."
      echo ""
	  
      tar xzf ${program_latest_filename}
      mv frp_${FRPS_VER}_linux_${ARCHS}/frps ${str_program_dir}/${program_name}
      rm -fr ${program_latest_filename} frp_${FRPS_VER}_linux_${ARCHS}
    fi
	
    chown root:root -R ${str_program_dir}
    if [ -s ${str_program_dir}/${program_name} ]; then
        [ ! -x ${str_program_dir}/${program_name} ] && chmod 755 ${str_program_dir}/${program_name}
    else
      echo -e " ${COLOR_RED}失败${COLOR_END}"
      exit 1
    fi
}

# 检查端口是否被占用
fun_check_port(){
    local port_flag=""
    local strCheckPort=""
    port_flag="$1"
    strCheckPort="$2"
    
    if [[ "${strCheckPort}" =~ ^[0-9]+$ ]] && [ ${strCheckPort} -ge 1 ] && [ ${strCheckPort} -le 65535 ]; then
        checkServerPort=`netstat -ntulp | grep "\b:${strCheckPort}\b"`
        if [ -n "${checkServerPort}" ]; then
            echo ""
            echo -e "${COLOR_RED}错误:${COLOR_END} 端口 ${COLOR_GREEN}${strCheckPort}${COLOR_END} 已被 ${COLOR_PINK}占用${COLOR_END}, 相关占用信息如下:"
            netstat -ntulp | grep "\b:${strCheckPort}\b"
            fun_input_${port_flag}_port
        else
            input_port="${strCheckPort}"
        fi
    else
        echo "输入错误! 请输入正确的端口号 (1-65535)."
        fun_input_${port_flag}_port
    fi
}

# 检查输入数字是否在最大值范围内
fun_check_number(){
    local num_flag=""
    local strMaxNum=""
    local strCheckNum=""
    num_flag="$1"
    strMaxNum="$2"
    strCheckNum="$3"
    
    if [[ "${strCheckNum}" =~ ^[0-9]+$ ]] && [ ${strCheckNum} -ge 1 ] && [ ${strCheckNum} -le ${strMaxNum} ]; then
        input_number="${strCheckNum}"
    else
        echo "输入错误! 请输入正确的数字范围 (1-${strMaxNum})."
        fun_input_${num_flag}
    fi
}

# --- 用户交互配置函数 ---

fun_input_bind_port(){
    def_server_port="5443"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}绑定端口 (bindPort)${COLOR_END} [1-65535]"
    read -e -p "(默认端口: ${def_server_port}):" serverport
    [ -z "${serverport}" ] && serverport="${def_server_port}"
    fun_check_port "bind" "${serverport}"
    set_bind_port="${input_port}"
}
fun_input_dashboard_port(){
    def_dashboard_port="6443"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}仪表盘端口 (webServer.port)${COLOR_END} [1-65535]"
    read -e -p "(默认端口: ${def_dashboard_port}):" input_dashboard_port
    [ -z "${input_dashboard_port}" ] && input_dashboard_port="${def_dashboard_port}"
    fun_check_port "dashboard" "${input_dashboard_port}"
    set_dashboard_port="${input_port}"
}
fun_input_vhost_http_port(){
    def_vhost_http_port="80"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}HTTP 虚拟主机端口 (vhostHTTPPort)${COLOR_END} [1-65535]"
    read -e -p "(默认端口: ${def_vhost_http_port}):" input_vhost_http_port
    [ -z "${input_vhost_http_port}" ] && input_vhost_http_port="${def_vhost_http_port}"
    fun_check_port "vhost_http" "${input_vhost_http_port}"
    set_vhost_http_port="${input_port}"
}
fun_input_vhost_https_port(){
    def_vhost_https_port="443"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}HTTPS 虚拟主机端口 (vhostHTTPSPort)${COLOR_END} [1-65535]"
    read -e -p "(默认端口: ${def_vhost_https_port}):" input_vhost_https_port
    [ -z "${input_vhost_https_port}" ] && input_vhost_https_port="${def_vhost_https_port}"
    fun_check_port "vhost_https" "${input_vhost_https_port}"
    set_vhost_https_port="${input_port}"
}

# 输入认证令牌 (auth.token)，默认 32-66 位随机值 (已修改)
fun_input_token(){
    local rand_len=$(get_random_length 32 66)
    def_token=`fun_randstr ${rand_len}` 
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}连接令牌 (auth.token)${COLOR_END}"
    read -e -p "(默认: ${def_token} (${rand_len}位随机)): " input_token
    [ -z "${input_token}" ] && input_token="${def_token}"
    set_token="${input_token}"
}
fun_input_subdomain_host(){
    def_subdomain_host=${defIP}
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}子域名宿主 (subDomainHost)${COLOR_END}"
    read -e -p "(默认: ${def_subdomain_host}):" input_subdomain_host
    [ -z "${input_subdomain_host}" ] && input_subdomain_host="${def_subdomain_host}"
    set_subdomain_host="${input_subdomain_host}"
}
fun_input_kcp_bind_port(){
    def_kcp_bind_port="${set_bind_port}"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}KCP 绑定端口 (kcpBindPort)${COLOR_END} [1-65535]"
    read -e -p "(默认 KCP 绑定端口: ${def_kcp_bind_port}):" input_kcp_bind_port
    [ -z "${input_kcp_bind_port}" ] && input_kcp_bind_port="${def_kcp_bind_port}"
    fun_check_port "input_kcp_bind_port" "${input_kcp_bind_port}"
    set_kcp_bind_port="${input_port}"
}
fun_input_quic_bind_port(){
    def_quic_bind_port="${set_vhost_https_port}"
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}QUIC 绑定端口 (quicBindPort)${COLOR_END} [1-65535]"
    read -e -p "(默认 QUIC 绑定端口: ${def_quic_bind_port}):" input_quic_bind_port
    [ -z "${input_quic_bind_port}" ] && input_quic_bind_port="${def_quic_bind_port}"
    fun_check_port "input_quic_bind_port" "${input_quic_bind_port}"
    set_quic_bind_port="${input_port}"
}
fun_input_log_max_days(){
    def_max_days="15" 
    def_log_max_days="3"
    echo ""
    echo -e "请输入 ${program_name} ${COLOR_GREEN}日志最大保留天数 (log.maxDays)${COLOR_END} [1-${def_max_days}]"
    read -e -p "(默认: ${def_log_max_days} 天):" input_log_max_days
    [ -z "${input_log_max_days}" ] && input_log_max_days="${def_log_max_days}"
    fun_check_number "log_max_days" "${def_max_days}" "${input_log_max_days}"
    set_log_max_days="${input_number}"
}
fun_input_max_pool_count(){
    def_max_pool="50"
    def_max_pool_count="5"
    echo ""
    echo -e "请输入 ${program_name} ${COLOR_GREEN}最大连接池数量 (transport.maxPoolCount)${COLOR_END} [1-${def_max_pool}]"
    read -e -p "(默认: ${def_max_pool_count}):" input_max_pool_count
    [ -z "${input_max_pool_count}" ] && input_max_pool_count="${def_max_pool_count}"
    fun_check_number "max_pool_count" "${def_max_pool}" "${input_max_pool_count}"
    set_max_pool_count="${input_number}"
}

# 输入仪表盘用户名，默认 5-18 位随机值 (已修改)
fun_input_dashboard_user(){
    local rand_len=$(get_random_length 5 18)
    def_dashboard_user=`fun_randstr ${rand_len}`
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}仪表盘用户名 (webServer.user)${COLOR_END}"
    read -e -p "(默认: ${def_dashboard_user} (${rand_len}位随机)): " input_dashboard_user
    [ -z "${input_dashboard_user}" ] && input_dashboard_user="${def_dashboard_user}"
    set_dashboard_user="${input_dashboard_user}"
}

# 输入仪表盘密码，默认 9-32 位随机值 (已修改)
fun_input_dashboard_pwd(){
    local rand_len=$(get_random_length 9 32)
    def_dashboard_pwd=`fun_randstr ${rand_len}`
    echo ""
    echo -n -e "请输入 ${program_name} ${COLOR_GREEN}仪表盘密码 (webServer.password)${COLOR_END}"
    read -e -p "(默认: ${def_dashboard_pwd} (${rand_len}位随机)): " input_dashboard_pwd
    [ -z "${input_dashboard_pwd}" ] && input_dashboard_pwd="${def_dashboard_pwd}"
    set_dashboard_pwd="${input_dashboard_pwd}"
}


# 生成并打印 frpc 客户端配置信息 (已优化，确保变量稳定输出)
fun_print_frpc_config() {
    # 确保核心变量在输出时是可用的，即使没有公网IP也用提示符
    local SERVER_IP="${defIP:-您的公网IP地址}"
    local BIND_PORT="${set_bind_port:-5443}"
    local AUTH_TOKEN="${set_token:-随机生成的Token}"
    local VHOST_HTTP_PORT="${set_vhost_http_port:-80}"
    local VHOST_HTTPS_PORT="${set_vhost_https_port:-443}"
    local SUBDOMAIN_HOST="${set_subdomain_host:-您的域名或公网IP}"
    local KCP_PORT="${set_kcp_bind_port:-5443}"

    echo ""
    echo "==================== 💻 frpc 客户端配置示例 (frpc.toml) ===================="
    echo -e "${COLOR_YELOW}请将以下内容复制到您的客户端设备 (frpc.toml)，并根据您的实际需求修改 'localIP' 和 'localPort'。${COLOR_END}"
    echo "---"

    cat << EOF
# frpc.toml
serverAddr = "${SERVER_IP}"
serverPort = ${BIND_PORT}

# 认证令牌，必须和服务端一致
[auth]
token = "${AUTH_TOKEN}"

# --------------------------------------------------------------------------------
# 示例 1: HTTP/HTTPS 域名访问 (Web 服务)
# 通过 frps 的 VHost 端口 (${VHOST_HTTP_PORT}/${VHOST_HTTPS_PORT}) 统一转发
# 访问地址格式: http://web1.${SUBDOMAIN_HOST} 或 http://custom.domain.com
# --------------------------------------------------------------------------------
[[proxies]]
name = "web_service_http_domain"
type = "http"
localIP = "127.0.0.1" 
localPort = 8080      # 客户端本地 Web 服务端口

# 推荐使用子域名访问，基于服务端设置的 subDomainHost
subdomain = "web1" 
# 或者使用自定义域名（需要在您的 DNS 服务商处解析）
# customDomains = ["custom.domain.com"] 


# --------------------------------------------------------------------------------
# 示例 2: TCP 端口转发 (IP:端口 形式访问)
# 用于转发 SSH, RDP, 或 IP 形式访问的 Web 服务（例如：http://${SERVER_IP}:60022）
# --------------------------------------------------------------------------------
[[proxies]]
name = "tcp_service_ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22          # 客户端本地服务端口 (例如 SSH 22)
remotePort = 60022      # frps 开放的公网访问端口 (建议客户端自行定义)


# --------------------------------------------------------------------------------
# 示例 3: KCP/QUIC 加速转发 (如果服务端已启用 KCP 端口 ${KCP_PORT})
# 专用于网络不稳定的场景，需将 type 改为 kcp 或 quic
# --------------------------------------------------------------------------------
[[proxies]]
name = "udp_service_game_kcp"
type = "kcp"
localIP = "127.0.0.1"
localPort = 7777        # 客户端本地 UDP 端口
remotePort = 7777       # frps 开放的公网 UDP 端口
EOF
    echo "---"
    echo -e "${COLOR_GREEN}注意:${COLOR_END}"
    echo "* 示例 1: 使用子域名 web1.${SUBDOMAIN_HOST} 访问，通过 frps 的 HTTP 端口 ${VHOST_HTTP_PORT}。"
    if [ "${set_transport_protocol}" == "启用" ]; then
        echo "* 示例 3: 使用 KCP 协议，连接端口为 ${KCP_PORT} (UDP)，请确保该 UDP 端口已开放。"
    fi
    echo "========================================================================"
}


# 安装前的准备和用户交互配置
pre_install_frps(){
    fun_frps "clear"
    echo -e "正在检查您的服务器设置，请稍候..."
	echo ""
    disable_selinux
    
    # --- 修复后的进程检查逻辑 (使用 ps aux) ---
    if ps aux | grep -w "${program_name}" | grep -v 'grep' >/dev/null; then
        echo -e "${COLOR_RED}检测到 ${program_name} 进程正在运行! ${COLOR_END}"
        echo -e "${COLOR_YELOW}继续安装将覆盖现有配置并停止服务。${COLOR_END}"
        read -e -p "是否继续? (y/n 默认: n):" is_continue
        if [[ "${is_continue}" == 'y' ]]; then
            echo -e "您选择了继续安装..."
        else
            exit 1
        fi
    fi
    # ----------------------------
    
    clear
    fun_frps
    fun_getServer
    fun_getVer
    echo -e ""
    echo -e "正在加载您的服务器 IP，请稍候..."
    defIP=$(curl -s https://api.ipify.org)
    echo -e "您的服务器公网 IP:${COLOR_GREEN}${defIP}${COLOR_END}"
    echo -e ""
    echo -e "————————————————————————————————————————————"
    echo -e "     ${COLOR_RED}请设置您的服务器配置:${COLOR_END}"
    echo -e "————————————————————————————————————————————"

    # 1. 端口配置
    fun_input_bind_port
    fun_input_dashboard_port
    fun_input_vhost_http_port
    fun_input_vhost_https_port
    
    # *** 仪表盘/Token 随机值输入 ***
    fun_input_dashboard_user
    fun_input_dashboard_pwd
    fun_input_token # 放在这里，确保随机数生成在用户输入之前
    
    fun_input_subdomain_host
    
    # 2. 性能与日志配置
    
    # 日志级别选择
    echo -e "请选择 ${COLOR_GREEN}日志级别 (log.level)${COLOR_END}"
    echo    "1: info (默认)"
    echo    "2: warn"
    echo    "3: error"
    echo    "4: debug"
    echo    "5: trace"
    echo    "-------------------------"
    read -e -p "请输入您的选择 (1, 2, 3, 4, 5 或 exit. 默认 [1]): " str_log_level
    case "${str_log_level}" in
        1) str_log_level="info";;
        2) str_log_level="warn";;
        3) str_log_level="error";;
        4) str_log_level="debug";;
        5) str_log_level="trace";;
        [eE][xX][iI][tT]) exit 1;;
        *) str_log_level="info";;
    esac
    echo -e "日志级别: ${COLOR_YELOW}${str_log_level}${COLOR_END}"
    echo -e ""
    
    fun_input_log_max_days
    echo -e ""
    
    # 日志文件选择
    echo -e "请选择是否输出到 ${COLOR_GREEN}日志文件 (log.to)${COLOR_END}"
    echo    "1: 启用 (默认: ./frps.log)"
    echo    "2: 禁用 (log.to = \"console\")"
    echo "-------------------------"
    read -e -p "请输入您的选择 (1, 2 或 exit. 默认 [1]): " str_log_file
    case "${str_log_file}" in
        1) str_log_file_flag="./frps.log";;
        2) str_log_file_flag="console";;
        [eE][xX][iI][tT]) exit 1;;
        *) str_log_file_flag="./frps.log";;
    esac
    echo -e "日志文件: ${COLOR_YELOW}${str_log_file_flag}${COLOR_END}"
    echo -e ""
    
    # TCP 多路复用选择
    echo -e "请选择是否启用 ${COLOR_GREEN}TCP 多路复用 (transport.tcpMux)${COLOR_END}"
    echo    "1: 启用 (默认: true)"
    echo    "2: 禁用 (false)"
    echo "-------------------------"         
    read -e -p "请输入您的选择 (1, 2 或 exit. 默认 [1]): " str_tcp_mux
    case "${str_tcp_mux}" in
        1) set_tcp_mux="true";;
        2) set_tcp_mux="false";;
        [eE][xX][iI][tT]) exit 1;;
        *) set_tcp_mux="true";;
    esac
    echo -e "TCP 多路复用: ${COLOR_YELOW}${set_tcp_mux}${COLOR_END}"
    echo -e ""
    
    fun_input_max_pool_count
    echo -e ""

    # KCP/QUIC 协议支持选择
    echo -e "请选择是否支持 ${COLOR_GREEN}KCP/QUIC 传输协议${COLOR_END}"
    echo    "1: 启用 (默认)"
    echo    "2: 禁用"
    echo "-------------------------"  
    read -e -p "请输入您的选择 (1, 2 或 exit. 默认 [1]): " str_transport_protocol
    case "${str_transport_protocol}" in
        1) set_transport_protocol="启用";;
        2) set_transport_protocol="禁用";;
        [eE][xX][iI][tT]) exit 1;;
        *) set_transport_protocol="启用";;
    esac
    echo -e "传输协议支持: ${COLOR_YELOW}${set_transport_protocol}${COLOR_END}"
    echo -e ""

    if [ "${set_transport_protocol}" == "启用" ]; then
        fun_input_kcp_bind_port
        echo -e ""
        fun_input_quic_bind_port
        echo -e ""
    else
        set_kcp_bind_port=""
        set_quic_bind_port=""
    fi
    
    # 最终确认信息
    echo "============== 请确认您的输入配置 =============="
    echo -e "服务器公网 IP    : ${COLOR_GREEN}${defIP}${COLOR_END}"
    echo -e "绑定端口 (bind)    : ${COLOR_GREEN}${set_bind_port}${COLOR_END}"
    echo -e "vhost http 端口    : ${COLOR_GREEN}${set_vhost_http_port}${COLOR_END}"
    echo -e "vhost https 端口   : ${COLOR_GREEN}${set_vhost_https_port}${COLOR_END}"
    echo -e "仪表盘端口         : ${COLOR_GREEN}${set_dashboard_port}${COLOR_END}"
    echo -e "仪表盘用户名       : ${COLOR_GREEN}${set_dashboard_user}${COLOR_END} (${#set_dashboard_user}位)"
    echo -e "仪表盘密码         : ${COLOR_GREEN}${set_dashboard_pwd}${COLOR_END} (${#set_dashboard_pwd}位)"
    echo -e "连接令牌 (token)   : ${COLOR_GREEN}${set_token}${COLOR_END} (${#set_token}位)"
    echo -e "子域名宿主         : ${COLOR_GREEN}${set_subdomain_host}${COLOR_END}"
    echo -e "TCP 多路复用       : ${COLOR_GREEN}${set_tcp_mux}${COLOR_END}"
    echo -e "最大连接池数量     : ${COLOR_GREEN}${set_max_pool_count}${COLOR_END}"
    echo -e "日志级别           : ${COLOR_GREEN}${str_log_level}${COLOR_END}"
    echo -e "日志最大天数       : ${COLOR_GREEN}${set_log_max_days}${COLOR_END}"
    echo -e "日志文件           : ${COLOR_GREEN}${str_log_file_flag}${COLOR_END}"
    echo -e "传输协议支持       : ${COLOR_GREEN}${set_transport_protocol}${COLOR_END}"
    if [ "${set_transport_protocol}" == "启用" ]; then
        echo -e "KCP 绑定端口       : ${COLOR_GREEN}${set_kcp_bind_port}${COLOR_END}"
        echo -e "QUIC 绑定端口      : ${COLOR_GREEN}${set_quic_bind_port}${COLOR_END}"
    fi
    echo "=============================================="
    echo ""
    echo "按任意键开始安装...或按 Ctrl+c 取消"

    char=`get_char`
    install_program_server_frps
}

# 编译和安装 frps 服务端，兼容 Systemd/Init.d
install_program_server_frps(){
    pre_install_packs
    mkdir -p ${str_program_dir}
    fun_download_file

    # 生成配置文件 frps.toml
    cat > ${str_program_dir}/${program_config_file} << EOF
# 绑定端口 (frpc连接端口)
bindPort = ${set_bind_port}

# 认证令牌
[auth]
token = "${set_token}"

# 日志配置
[log]
to = "${str_log_file_flag}"
level = "${str_log_level}"
maxDays = ${set_log_max_days}

# 传输配置
[transport]
tcpMux = ${set_tcp_mux}
maxPoolCount = ${set_max_pool_count}

# HTTP/HTTPS 虚拟主机端口
vhostHTTPPort = ${set_vhost_http_port}
vhostHTTPSPort = ${set_vhost_https_port}
subDomainHost = "${set_subdomain_host}"

# KCP/QUIC 协议支持
EOF
    if [ "${set_transport_protocol}" == "启用" ]; then
        cat >> ${str_program_dir}/${program_config_file} << EOF
kcpBindPort = ${set_kcp_bind_port}
quicBindPort = ${set_quic_bind_port}
EOF
    fi

    # 仪表盘配置
    cat >> ${str_program_dir}/${program_config_file} << EOF

# 仪表盘配置
[webServer]
port = ${set_dashboard_port}
user = "${set_dashboard_user}"
password = "${set_dashboard_pwd}"
EOF

    # 停止旧服务
    if [ "${HAS_SYSTEMD}" == "true" ]; then
        systemctl stop ${program_name} 2>/dev/null
    fi
    ${program_init} stop 2>/dev/null

    # --- 服务管理配置 (优先使用 Systemd) ---
    if [ "${HAS_SYSTEMD}" == "true" ]; then
        echo -e "${COLOR_GREEN} 正在配置 Systemd 服务...${COLOR_END}"
        wget --no-check-certificate -qO ${program_service} "${FRPS_SERVICE}"
        
        # 替换 Systemd 配置文件中的路径变量
        sed -i "s|/usr/bin/frps|${str_program_dir}/${program_name}|g" ${program_service}
        sed -i "s|/etc/frps.toml|${str_program_dir}/${program_config_file}|g" ${program_service}
        
        systemctl daemon-reload
        systemctl enable ${program_name}
        systemctl start ${program_name}
        
        echo -e "${COLOR_GREEN}${program_name} 服务已通过 Systemd 启动。${COLOR_END}"
    else
        echo -e "${COLOR_YELOW} 正在配置 Init.d 服务 (Systemd 未找到)...${COLOR_END}"
        wget --no-check-certificate -qO ${program_init} "${FRPS_INIT}"
        chmod 755 ${program_init}
        
        # 替换 Init.d 配置文件中的路径变量
        sed -i "s|/usr/bin/frps|${str_program_dir}/${program_name}|g" ${program_init}
        sed -i "s|/etc/frps.toml|${str_program_dir}/${program_config_file}|g" ${program_init}
        
        if [[ "${OS}" == 'CentOS' ]]; then
            chkconfig --add ${program_name}
            chkconfig ${program_name} on
        else
            update-rc.d ${program_name} defaults
        fi
        
        ${program_init} start
        echo -e "${COLOR_GREEN}${program_name} 服务已通过 Init.d 启动。${COLOR_END}"
    fi
    # ----------------------------------------------------
    
    echo ""
    echo -e "=========================================================="
    echo -e "${COLOR_GREEN}${program_name} 服务端安装和配置完成!${COLOR_END}"
    echo -e ""
    echo -e "frps 配置文件路径: ${COLOR_GREEN}${str_program_dir}/${program_config_file}${COLOR_END}"
    if [ "${HAS_SYSTEMD}" == "true" ]; then
        echo -e "frps 服务管理: ${COLOR_GREEN}systemctl status ${program_name}${COLOR_END}"
    else
        echo -e "frps 启动脚本路径: ${COLOR_GREEN}${program_init}${COLOR_END}"
    fi
    echo -e ""
    echo -e "${COLOR_RED}重要配置信息:${COLOR_END}"
    echo -e "  - frpc连接端口: ${COLOR_GREEN}${set_bind_port}${COLOR_END}"
    echo -e "  - 连接令牌 (token): ${COLOR_GREEN}${set_token}${COLOR_END} (${#set_token}位)"
    echo -e "  - 仪表盘地址: ${COLOR_GREEN}http://${defIP}:${set_dashboard_port}${COLOR_END}"
    echo -e "  - 仪表盘用户/密码: ${COLOR_GREEN}${set_dashboard_user} / ${set_dashboard_pwd}${COLOR_END}"
    echo -e "=========================================================="
    
    # === 输出客户端配置 (确保此步骤执行) ===
    fun_print_frpc_config
    
    echo ""
}


# 脚本入口
fun_set_text_color
rootness
checkos
check_os_version
check_os_bit
pre_install_frps
