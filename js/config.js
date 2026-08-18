/**
 * ==============================================================================
 * vmrey.github.io 博客全局公共配置文件 (Global Blog Configuration)
 * ==============================================================================
 * 集中配置站点基础信息、起步年份、每页文章显示篇数、默认主题与专栏子菜单结构。
 */
window.BLOG_CONFIG = {
  // 1. 站点基础信息
  siteName: 'vmrey.github.io',
  tagline: '构建工具，写干净的代码',
  author: 'vmrey',
  githubUrl: 'https://github.com/vmrey/vmrey.github.io',

  // 2. 版权与年份信息
  startYear: 2018, // 创办起步年份，将自动与当前年份拼接为 2018-2026 动态区间
  copyrightNotice: '用代码与文字记录探索',

  // 3. 文章列表与分页配置
  pageSize: 8,

  // 4. 外观与主题
  defaultTheme: 'auto', // 默认主题：'auto' (跟随系统，智能随操作系统深浅色切换) | 'dark' (深色) | 'light' (浅色)

  // 5. 专栏与多级子菜单结构 (自动根据文章篇数统计展示，0 篇专栏自动剔除)
  categories: [
    {
      name: '前端开发',
      tag: '前端开发',
      icon: 'code',
      children: [
        { name: 'Vue 与组件', tag: 'Vue' },
        { name: 'JS 与工具函数', tag: 'JavaScript' },
        { name: '微信小程序', tag: '微信小程序' }
      ]
    },
    {
      name: 'Linux 与服务端',
      tag: 'Linux',
      icon: 'server',
      children: [
        { name: 'Docker 与容器', tag: 'Docker' },
        { name: '网络与反代', tag: 'Nginx' },
        { name: '性能与压测', tag: '压力测试' }
      ]
    },
    {
      name: '效率工具与软件',
      tag: '效率工具',
      icon: 'tool',
      children: [
        { name: 'Git 与 SVN', tag: 'Git' },
        { name: '开源软件与脚本', tag: '软件' },
        { name: 'Claude 与 AI', tag: 'Claude' }
      ]
    }
  ]
};
