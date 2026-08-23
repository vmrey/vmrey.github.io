/**
 * vmrey.github.io 全局全文检索索引数据库
 * 由 build.js 自动生成构建 (全量收录文章、AI导航、工具、GitHub与附件)
 */
window.SEARCH_DATABASE = window.BLOG_SEARCH_INDEX = [
  {
    "id": "wx-img-refresh-ffc2",
    "type": "post",
    "title": "微信小程序踩坑记录：如何完美解决图片强制刷新（彻底告别本地缓存）",
    "url": "posts/wx-img-refresh-ffc2.html",
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
    "title": "Photoshop 批量压缩与图片重命名 ExtendScript (JSX) 脚本源码",
    "url": "posts/ps-batch-compress-0ecc.html",
    "category": "效率工具与软件",
    "date": "2026-07-05",
    "tags": [
      "效率工具",
      "Photoshop",
      "JavaScript",
      "自动化"
    ],
    "summary": "使用 Adobe ExtendScript 编写 PS 自动化脚本，一键递归处理整个文件夹中的图片并按质量比导出。",
    "content": "PS 批量压缩图片脚本 此脚本可以批量压缩图片，支持 JPG、PNG、GIF 格式，压缩质量可自定义。 📝 脚本功能 | 功能 | 说明 | |------|------| | 批量处理 | 自动扫描指定文件夹及其子文件夹 | | 格式支持 | JPG、PNG、GIF、JFIF | | 质量控制 | 可自定义压缩质量（1-100） | | 智能输出 | 自动在原文件夹创建压缩后目录 | | 错误处理 | 自动跳过损坏或无法打开的文件 | 🚀 使用方法 方法一：快速使用（推荐） 1. 创建脚本文件 ：在桌面新建 ImgCompress.jsx 文件 2. 复制源码 ：将下方源码复制进去 3. 运行脚本 ： - 打开 Photoshop - 菜单： 文件 → 脚本 → 浏览 → 选择 ImgCompress.jsx 4. 选择文件夹 ：在弹出的对话框中选择要压缩的图片文件夹 5. 设置参数 ：在弹出的对话框中设置压缩质量 方法二：传统方式（需手动配置路径） javascript // 手动配置方式（不推荐，建议使用方法一） var config = { inputFolder: \"E:/images\", // 输入文件夹 outputFolder: \"E:/images_compressed\", // 输出文件夹 quality: 80, // 压缩质量 1-100 overwriteOriginal: false // 是否覆盖原文件 }; --- 📄 完整源码 javascript / Photoshop 批量图片压缩脚本 支持格式：JPG、PNG、GIF、JFIF 作者：优化版 / // ==================== 配置参数 ==================== var CONFIG = { DEFAULT_QUALITY: 80, // 默认压缩质量 1-100 OUTPUT_SUFFIX: \"_compressed\", // 输出文件夹后缀 SUPPORTED_FORMATS: \".jpg\", \".jpeg\", \".jfif\", \".png\", \".gif\" }; // ==================== 主程序 ==================== function main { try { // 1. 选择源文件夹 var sourceFolder = Folder.selectDialog \"请选择要压缩的图片文件夹\" ; if !sourceFolder || !sourceFolder.exists { alert \"未选择有效文件夹，脚本已退出\" ; return; } // 2. 获取压缩质量 var quality = prompt \"请输入压缩质量 1-100，数值越大质量越好 \", CONFIG.DEFAULT_QUALITY ; quality = parseInt quality ; if isNaN quality || quality < 1 || quality > 100 { alert \"无效的质量值，使用默认值: \" + CONFIG.DEFAULT_QUALITY ; quality = CONFIG.DEFAULT_QUALITY; } // 3. 创建输出文件夹 var outputFolder = new Folder sourceFolder.fsName + CONFIG.OUTPUT_SUFFIX ; if !outputFolder.exists { outputFolder.create ; } // 4. 获取所有图片文件 var files = getImageFiles sourceFolder ; if files.length === 0 { alert \"未找到支持的图片文件\" ; return; } // 5. 批量处理 var successCount = 0; var failCount = 0; for var i = 0; i < files.length; i++ { var file = files i ; try { // 显示进度 var progress = Math.round i + 1 / files.length 100 ; $.writeln \"处理中: \" + progress + \"% - \" + file.name ; // 压缩并保存 compressImage file, outputFolder, quality ; successCount++; } catch e { $.writeln \"处理失败: \" + file.name + \" - \" + e.message ; failCount++; } } // 6. 显示结果 var resultMsg = \"批量压缩完成！\\n\\n\" + \"成功: \" + successCount + \" 张\\n\" + \"失败: \" + failCount + \" 张\\n\" + \"输出目录: \" + outputFolder.fsName; alert resultMsg ; $.writeln resultMsg ; } catch error { alert \"脚本执行出错: \" + error.message ; $.writeln \"错误: \" + error.message ; } } // ==================== 工具函数 ==================== / 获取文件夹中所有支持的图片文件（递归） @param {Folder} folder - 文件夹对象 @returns {File } - 图片文件数组 / function getImageFiles folder { var files = ; var allFiles = folder.getFiles ; for var i = 0; i < allFiles.length; i++ { var item = allFiles i ; if item instanceof Folder { // 递归处理子文件夹 files = files.concat getImageFiles item ; } else if item instanceof File { // 检查是否为支持的格式 var ext = item.name.toLowerCase .substring item.name.lastIndexOf \".\" ; if CONFIG.SUPPORTED_FORMATS.indexOf ext !== -1 { files.push item ; } } } return files; } / 压缩单张图片 @param {File} inputFile - 输入文件 @param {Folder} outputFolder - 输出文件夹 @param {number} quality - 压缩质量 1-100 / function compressImage inputFile, outputFolder, quality { // 1. 打开图片 var doc = app.open inputFile ; if !doc { throw new Error \"无法打开文件\" ; } try { // 2. 构建输出路径 var outputPath = outputFolder.fsName + \"/\" + inputFile.name; // 3. 根据格式设置导出选项 var exportOptions = getExportOptions inputFile, quality ; // 4. 导出图片 doc.exportDocument new File outputPath , ExportType.SAVEFORWEB, exportOptions ; } finally { // 5. 关闭文档（不保存原文件） if app.activeDocument { app.activeDocument.close SaveOptions.DONOTSAVECHANGES ; } } } / 获取导出选项 @param {File} file - 文件对象 @param {number} quality - 压缩质量 @returns {ExportOptionsSaveForWeb} / function getExportOptions file, quality { var ext = file.name.toLowerCase ; var options = new ExportOptionsSaveForWeb ; if ext.match /\\.jpg$/ || ext.match /\\.jpeg$/ || ext.match /\\.jfif$/ { // JPG 格式 options.format = SaveDocumentType.JPEG; options.quality = quality; options.optimized = true; options.progressive = false; } else if ext.match /\\.png$/ { // PNG 格式 options.format = SaveDocumentType.PNG; options.PNG8 = false; // 使用 PNG-24 options.transparency = true; options.interlaced = false; } else if ext.match /\\.gif$/ { // GIF 格式 options.format = SaveDocumentType.COMPUSERVEGIF; options.transparency = true; options.includeProfile = false; options.lossy = 0; options.colors = 256; options.colorReduction = ColorReductionType.SELECTIVE; options.ditherAmount = 0; options.dither = Dither.NOISE; options.palette = Palette.LOCALADAPTIVE; } return options; } // ==================== 启动脚本 ==================== main ; --- ⚙️ 参数说明 | 参数 | 说明 | 默认值 | |------|------|--------| | DEFAULT_QUALITY | 默认压缩质量 | 80 | | OUTPUT_SUFFIX | 输出文件夹后缀 | _compressed | | SUPPORTED_FORMATS | 支持的图片格式 | JPG、PNG、GIF、JFIF | 📊 压缩质量参考 | 质量值 | 适用场景 | |--------|----------| | 90-100 | 高清图片、设计稿 | | 70-89 | 网页图片、社交媒体 | | 50-69 | 缩略图、预览图 | | 1-49 | 极低质量占位图 | 🛡️ 注意事项 1. 备份重要文件 - 建议在运行脚本前备份原始图片，以防意外！ 2. Photoshop 版本要求 - 支持 Photoshop CS6 及以上版本 - 需启用 JavaScript 脚本支持 3. 常见问题 | 问题 | 原因 | 解决方案 | |------|------|----------| | 脚本无法运行 | 未启用脚本支持 | 编辑 → 首选项 → 增效工具 → 勾选\"允许脚本连接到网络\" | | 图片无法打开 | 文件损坏或格式不支持 | 检查文件完整性，确保是支持的格式 | | 输出为空 | 没有找到图片文件 | 确认文件夹中有 JPG/PNG/GIF 文件 | | 内存不足 | 一次性处理过多大图片 | 分批处理，或增加 Photoshop 内存分配 | 📁 输出结构 原文件夹/ ├── photo1.jpg ├── photo2.png ├── subfolder/ │ └── photo3.gif └── 原文件夹_compressed/ ← 自动创建 ├── photo1.jpg ├── photo2.png └── subfolder/ └── photo3.gif",
    "sections": [
      {
        "title": "📝 脚本功能",
        "anchor": "#脚本功能",
        "id": "脚本功能"
      },
      {
        "title": "🚀 使用方法",
        "anchor": "#使用方法",
        "id": "使用方法"
      },
      {
        "title": "方法一：快速使用（推荐）",
        "anchor": "#方法一-快速使用-推荐",
        "id": "方法一-快速使用-推荐"
      },
      {
        "title": "方法二：传统方式（需手动配置路径）",
        "anchor": "#方法二-传统方式-需手动配置路径",
        "id": "方法二-传统方式-需手动配置路径"
      },
      {
        "title": "📄 完整源码",
        "anchor": "#完整源码",
        "id": "完整源码"
      },
      {
        "title": "⚙️ 参数说明",
        "anchor": "#参数说明",
        "id": "参数说明"
      },
      {
        "title": "📊 压缩质量参考",
        "anchor": "#压缩质量参考",
        "id": "压缩质量参考"
      },
      {
        "title": "🛡️ 注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 备份重要文件",
        "anchor": "#1-备份重要文件",
        "id": "1-备份重要文件"
      },
      {
        "title": "2. Photoshop 版本要求",
        "anchor": "#2-photoshop-版本要求",
        "id": "2-photoshop-版本要求"
      },
      {
        "title": "3. 常见问题",
        "anchor": "#3-常见问题",
        "id": "3-常见问题"
      },
      {
        "title": "📁 输出结构",
        "anchor": "#输出结构",
        "id": "输出结构"
      }
    ]
  },
  {
    "id": "kodbox-docker-d549",
    "type": "post",
    "title": "Kodbox 可道云私有网盘部署实战指南（Docker 与源码双方案）",
    "url": "posts/kodbox-docker-d549.html",
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
    "title": "Windows 批量修改文件名与字符替换批处理 (.bat) 脚本",
    "url": "posts/bat-rename-b2ae.html",
    "category": "效率工具与软件",
    "date": "2026-06-28",
    "tags": [
      "效率工具",
      "Windows",
      "批处理",
      "自动化"
    ],
    "summary": "无需安装第三方软件，利用原生 Bat 批处理脚本一键完成指定文件夹下海量文件的前缀添加与文本替换。",
    "content": "批量修改文件名方法 功能说明 这是一个Windows批处理脚本，用于批量修改文件名和文件夹名，主要功能包括： 1. 批量替换文件名 ：替换指定文件名中的字符串 2. 批量删除字符 ：删除文件名中的指定字符（汉字、字母、数字等） 3. 支持文件夹重命名 ：同时处理文件和文件夹 4. 递归处理 ：自动处理子目录中的文件 脚本源码 batch @echo off chcp 65001 >nul setlocal enabledelayedexpansion title 批量修改文件名工具 echo ======================================== echo 批量修改文件名工具 echo ======================================== echo. echo 此批处理可批量替换当前文件夹下所有文件 文件夹 名。 echo. echo 注意事项： echo 1. 建议先备份重要文件 echo 2. 脚本会递归处理子目录 echo 3. 文件名冲突时会跳过 echo. set /p str1= 请输入要替换的文件 文件夹 名字符串（可替换空格）： if \"%str1%\"==\"\" echo 错误：替换字符串不能为空！ pause exit /b set /p str2= 请输入替换后的文件 文件夹 名字符串（去除则直接回车）： echo. echo 正在替换文件名…… set file_count=0 set skip_count=0 for /f \"delims=\" %%a in 'dir /a-d /s /b 2^>nul' do if \"%%~nxa\" neq \"%~nx0\" set \"f=%%~na\" set \"new_name=!f:%str1%=%str2%!\" if \"!new_name!\" neq \"%%~na\" if not exist \"%%~dpa!new_name!%%~xa\" ren \"%%a\" \"!new_name!%%~xa\" 2>nul if !errorlevel! equ 0 echo 已重命名: \"%%~nxa\" -^> \"!new_name!%%~xa\" set /a file_count+=1 else echo 跳过: \"%%~nxa\" 权限不足 set /a skip_count+=1 else echo 跳过: \"%%~nxa\" 文件名已存在 set /a skip_count+=1 echo 文件名替换完成！共处理 !file_count! 个文件，跳过 !skip_count! 个文件 echo. echo 正在替换文件夹名…… set folder_count=0 set folder_skip=0 :folder_loop set n=0 for /f \"delims=\" %%i in 'dir /ad /s /b 2^>nul ^|find \"%str1%\"' do set \"t=%%~ni\" set \"new_folder=!t:%str1%=%str2%!\" if \"!new_folder!\" neq \"%%~ni\" if not exist \"%%~dpi!new_folder!\" ren \"%%i\" \"!new_folder!\" 2>nul if !errorlevel! equ 0 echo 已重命名文件夹: \"%%~ni\" -^> \"!new_folder!\" set /a folder_count+=1 set /a n+=1 else echo 跳过文件夹: \"%%~ni\" 权限不足 set /a folder_skip+=1 else echo 跳过文件夹: \"%%~ni\" 文件夹名已存在 set /a folder_skip+=1 if \"!n!\" neq \"0\" goto folder_loop echo 文件夹名替换完成！共处理 !folder_count! 个文件夹，跳过 !folder_skip! 个文件夹 echo. echo ======================================== echo 处理完成！ echo 文件: !file_count! 个成功，!skip_count! 个跳过 echo 文件夹: !folder_count! 个成功，!folder_skip! 个跳过 echo ======================================== echo. pause 使用方法 第一步：创建脚本文件 1. 新建一个文本文件（文件名可自定义，如 rename_files.bat ） 2. 将上述脚本内容复制到文件中 3. 保存文件 第二步：修改文件后缀名 将文件后缀名从 .txt 改为 .bat Windows 10/11 启用文件扩展名显示： 1. 按 Win + E 打开文件资源管理器 2. 点击顶部菜单栏的\"查看\"选项卡 3. 勾选\"文件扩展名\"复选框 4. 现在可以修改文件后缀名了 第三步：使用脚本 1. 将脚本文件放入需要修改文件名的目录中 2. 双击运行脚本文件 3. 按照提示输入： - 要替换的字符串 ：输入原文件名中需要替换的内容 - 替换后的字符串 ：输入新的内容（直接回车表示删除） 第四步：查看结果 脚本会显示每个文件的修改结果和统计信息。 使用示例 示例1：批量替换文件名中的文字 要替换的字符串: photo 替换后的字符串: picture 效果： - photo_001.jpg → picture_001.jpg - my_photo.png → my_picture.png 示例2：批量删除文件名中的字符 要替换的字符串: copy 替换后的字符串: 直接回车 效果： - copy_document.txt → _document.txt - file_copy_2.doc → file__2.doc 示例3：批量添加前缀 要替换的字符串: 文件名开头 替换后的字符串: 2024_ 效果： - document.txt → 2024_document.txt - image.jpg → 2024_image.jpg 注意事项 ⚠️ 重要提醒 1. 备份重要文件 ：在使用脚本前，建议先备份重要文件 2. 测试环境 ：先在测试文件夹中试用，确认效果后再在正式文件中使用 3. 文件名冲突 ：如果目标文件名已存在，脚本会跳过该文件 4. 权限问题 ：某些系统文件或受保护的文件可能无法修改 5. 编码问题 ：脚本已设置UTF-8编码，支持中文文件名 🔧 常见问题 问题1：脚本运行后没有反应 - 解决：确保脚本文件放在正确的目录中 - 检查是否有足够的权限修改文件 问题2：某些文件没有被修改 - 原因：可能是文件名冲突或权限不足 - 解决：检查文件是否被其他程序占用 问题3：中文显示乱码 - 原因：系统编码设置问题 - 解决：脚本已包含 chcp 65001 命令，如仍有问题请检查系统编码设置 问题4：无法修改系统文件 - 原因：权限不足 - 解决：以管理员身份运行脚本 高级用法 1. 只处理文件，不处理文件夹 修改脚本，注释掉文件夹处理部分： batch REM 注释掉文件夹处理部分 REM :folder_loop REM ... 2. 只处理特定类型的文件 修改文件处理部分，添加文件类型过滤： batch for /f \"delims=\" %%a in 'dir /a-d /s /b .txt .doc .docx 2^>nul' do ... 3. 添加日期时间前缀 batch for /f \"tokens=1-3 delims=/ \" %%a in 'date /t' do set mydate=%%c%%a%%b set /p str1= 请输入要替换的字符串： set /p str2= 请输入替换后的字符串： set \"prefix=%mydate%_\" 替代方案 PowerShell 脚本（推荐） powershell PowerShell 批量重命名脚本 $oldName = Read-Host \"请输入要替换的字符串\" $newName = Read-Host \"请输入替换后的字符串\" Get-ChildItem -Recurse | ForEach-Object { if $_.Name -like \" $oldName \" { $newFileName = $_.Name -replace regex ::Escape $oldName , $newName if $_.Name -ne $newFileName -and -not Test-Path Join-Path $_.DirectoryName $newFileName { Rename-Item -Path $_.FullName -NewName $newFileName Write-Host \"已重命名: $ $_.Name -> $newFileName\" } } } Python 脚本 python import os import sys def batch_rename directory, old_str, new_str : count = 0 for root, dirs, files in os.walk directory : for filename in files: if old_str in filename: new_filename = filename.replace old_str, new_str old_path = os.path.join root, filename new_path = os.path.join root, new_filename if not os.path.exists new_path : os.rename old_path, new_path print f\"已重命名: {filename} -> {new_filename}\" count += 1 print f\"共处理 {count} 个文件\" if __name__ == \"__main__\": directory = input \"请输入目录路径（当前目录请直接回车）: \" or \".\" old_str = input \"请输入要替换的字符串: \" new_str = input \"请输入替换后的字符串（删除请直接回车）: \" batch_rename directory, old_str, new_str 下载脚本 脚本下载地址 ../assets/files/fileNameReplaScrip.bat 总结 这个批量修改文件名工具具有以下特点： - ✅ 操作简单，适合小白用户 - ✅ 支持文件和文件夹批量重命名 - ✅ 递归处理子目录 - ✅ 支持中文字符 - ✅ 提供详细的处理反馈 - ⚠️ 建议先备份重要文件 - ⚠️ 注意文件名冲突处理 使用前请仔细阅读注意事项，确保数据安全！",
    "sections": [
      {
        "title": "功能说明",
        "anchor": "#功能说明",
        "id": "功能说明"
      },
      {
        "title": "脚本源码",
        "anchor": "#脚本源码",
        "id": "脚本源码"
      },
      {
        "title": "使用方法",
        "anchor": "#使用方法",
        "id": "使用方法"
      },
      {
        "title": "第一步：创建脚本文件",
        "anchor": "#第一步-创建脚本文件",
        "id": "第一步-创建脚本文件"
      },
      {
        "title": "第二步：修改文件后缀名",
        "anchor": "#第二步-修改文件后缀名",
        "id": "第二步-修改文件后缀名"
      },
      {
        "title": "第三步：使用脚本",
        "anchor": "#第三步-使用脚本",
        "id": "第三步-使用脚本"
      },
      {
        "title": "第四步：查看结果",
        "anchor": "#第四步-查看结果",
        "id": "第四步-查看结果"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "示例1：批量替换文件名中的文字",
        "anchor": "#示例1-批量替换文件名中的文字",
        "id": "示例1-批量替换文件名中的文字"
      },
      {
        "title": "示例2：批量删除文件名中的字符",
        "anchor": "#示例2-批量删除文件名中的字符",
        "id": "示例2-批量删除文件名中的字符"
      },
      {
        "title": "示例3：批量添加前缀",
        "anchor": "#示例3-批量添加前缀",
        "id": "示例3-批量添加前缀"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "⚠️ 重要提醒",
        "anchor": "#重要提醒",
        "id": "重要提醒"
      },
      {
        "title": "🔧 常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "高级用法",
        "anchor": "#高级用法",
        "id": "高级用法"
      },
      {
        "title": "1. 只处理文件，不处理文件夹",
        "anchor": "#1-只处理文件-不处理文件夹",
        "id": "1-只处理文件-不处理文件夹"
      },
      {
        "title": "2. 只处理特定类型的文件",
        "anchor": "#2-只处理特定类型的文件",
        "id": "2-只处理特定类型的文件"
      },
      {
        "title": "3. 添加日期时间前缀",
        "anchor": "#3-添加日期时间前缀",
        "id": "3-添加日期时间前缀"
      },
      {
        "title": "替代方案",
        "anchor": "#替代方案",
        "id": "替代方案"
      },
      {
        "title": "PowerShell 脚本（推荐）",
        "anchor": "#powershell-脚本-推荐",
        "id": "powershell-脚本-推荐"
      },
      {
        "title": "Python 脚本",
        "anchor": "#python-脚本",
        "id": "python-脚本"
      },
      {
        "title": "下载脚本",
        "anchor": "#下载脚本",
        "id": "下载脚本"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "nginx-emby-proxy-b140",
    "type": "post",
    "title": "Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版）",
    "url": "posts/nginx-emby-proxy-b140.html",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · 前沿大模型与对话平台",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 智能体与自主编程",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 图像与多模态创作",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-23",
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
    "url": "ai.html",
    "category": "AI 导航 · AI 聚合平台与 API 服务",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 实用生成与办公工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 终端与远程运维工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 架构设计与思维导图",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 系统优化与效率工具",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 图像与多媒体处理",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 网络诊断与安全检测",
    "date": "2026-08-23",
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
    "url": "tools.html",
    "category": "工具导航 · 网络诊断与安全检测",
    "date": "2026-08-23",
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
    "id": "github-fnm",
    "type": "github",
    "title": "fnm (Schniz/fnm)",
    "url": "nav.html",
    "category": "GitHub 导航 · Node.js 版本管理",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · Node.js 版本管理",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 系统与装机利器",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 系统与装机利器",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 服务器安全与防护",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 服务器安全与防护",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 前端开发与 Web Components",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 前端安全与设备识别",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-23",
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
    "url": "nav.html",
    "category": "GitHub 导航 · 网络加速与穿透工具",
    "date": "2026-08-23",
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
    "id": "github-emqx",
    "type": "github",
    "title": "EMQX (emqx/emqx)",
    "url": "nav.html",
    "category": "GitHub 导航 · 物联网与消息中间件",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · 前端组件",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · 前端组件",
    "date": "2026-08-23",
    "tags": [
      "vue",
      "前端组件"
    ],
    "summary": "Vue3 + Element Plus 查询表单通用封装组件源码（响应式布局与重置联动） (10.3 KB, undefined 行)",
    "content": "QueryForm.vue Vue3 + Element Plus 查询表单通用封装组件源码（响应式布局与重置联动） 前端组件 vue",
    "sections": []
  },
  {
    "id": "file-tools-js",
    "type": "file",
    "title": "tools.js",
    "url": "files.html",
    "category": "资源文件 · 代码库",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · Shell 脚本",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · Shell 脚本",
    "date": "2026-08-23",
    "tags": [
      "sh",
      "Shell 脚本"
    ],
    "summary": "Xray Core 核心网络代理服务一键安装与证书部署脚本 (23.1 KB, undefined 行)",
    "content": "xray.sh Xray Core 核心网络代理服务一键安装与证书部署脚本 Shell 脚本 sh",
    "sections": []
  },
  {
    "id": "file-cmd-proxy-bat",
    "type": "file",
    "title": "cmd_proxy.bat",
    "url": "files.html",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-23",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows CMD 终端一键配置代理并自动开启 Antigravity (AGY) 免权限全自动运行脚本 (858 B, undefined 行)",
    "content": "cmd_proxy_agy.bat Windows CMD 终端一键配置代理并自动开启 Antigravity (AGY) 免权限全自动运行脚本 Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-filenamereplascrip-bat",
    "type": "file",
    "title": "fileNameReplaScrip.bat",
    "url": "files.html",
    "category": "资源文件 · Windows 批处理",
    "date": "2026-08-23",
    "tags": [
      "bat",
      "Windows 批处理"
    ],
    "summary": "Windows 批量替换与修改文件名自动化 BAT 批处理脚本 (879 B, undefined 行)",
    "content": "fileNameReplaScrip.bat Windows 批量替换与修改文件名自动化 BAT 批处理脚本 Windows 批处理 bat",
    "sections": []
  },
  {
    "id": "file-imghandle-jpg-zip",
    "type": "file",
    "title": "ImgHandle_jpg.zip",
    "url": "files.html",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-23",
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
    "url": "files.html",
    "category": "资源文件 · 压缩资源包",
    "date": "2026-08-23",
    "tags": [
      "zip",
      "压缩资源包"
    ],
    "summary": "Vue 前端业务优惠券领取与展示弹框交互组件完整工程包 (30.4 KB, undefined 行)",
    "content": "优惠券弹框组件.zip Vue 前端业务优惠券领取与展示弹框交互组件完整工程包 压缩资源包 zip",
    "sections": []
  }
];
