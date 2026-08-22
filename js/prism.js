/**
 * 轻量级高效语法高亮引擎 (支持 JavaScript, TypeScript, Python, HTML, CSS, Bash, Rust, JSON, SQL 等)
 * 纯原生零外部依赖，支持离线与本地运行
 */
(function() {
  const Prism = {
    languages: {},
    highlight: function(text, grammar) {
      const tokens = this.tokenize(text, grammar);
      return this.stringify(tokens);
    },
    tokenize: function(text, grammar) {
      let strarr = [text];
      for (let token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) continue;
        let patterns = grammar[token];
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        for (let j = 0; j < patterns.length; ++j) {
          let pattern = patterns[j];
          let regex = pattern.pattern || pattern;
          let inside = pattern.inside;
          
          for (let i = 0; i < strarr.length; i++) {
            let str = strarr[i];
            if (typeof str !== 'string') continue;
            
            regex.lastIndex = 0;
            let match = regex.exec(str);
            if (match) {
              let from = match.index;
              let matchStr = match[0];
              let before = str.slice(0, from);
              let after = str.slice(from + matchStr.length);
              let content = inside ? Prism.tokenize(matchStr, inside) : matchStr;
              let tokenObj = { type: token, content: content };
              
              let newArr = [];
              if (before) newArr.push(before);
              newArr.push(tokenObj);
              if (after) newArr.push(after);
              
              strarr.splice(i, 1, ...newArr);
              i += newArr.length - 1;
            }
          }
        }
      }
      return strarr;
    },
    stringify: function(o) {
      if (typeof o === 'string') {
        return o.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      if (Array.isArray(o)) {
        return o.map(Prism.stringify).join('');
      }
      let content = Prism.stringify(o.content);
      return `<span class="token ${o.type}">${content}</span>`;
    },
    highlightElement: function(codeBlock) {
      if (!codeBlock) return;
      let lang = 'javascript';
      const classes = (codeBlock.className || '').split(' ');
      for (let cls of classes) {
        if (cls.startsWith('language-') || cls.startsWith('lang-')) {
          lang = cls.replace(/^(language-|lang-)/, '').toLowerCase();
          break;
        }
      }

      const grammar = Prism.languages[lang] || Prism.languages.javascript;
      const rawCode = codeBlock.textContent;
      codeBlock.innerHTML = Prism.highlight(rawCode, grammar);
    },
    highlightAll: function() {
      document.querySelectorAll('pre code').forEach(codeBlock => {
        Prism.highlightElement(codeBlock);
        const rawCode = codeBlock.textContent;

        // 如果父级 pre 尚未包装 code-block-wrapper，自动包装并添加语言标签与复制按钮
        const pre = codeBlock.parentElement;
        if (pre && pre.tagName === 'PRE' && !pre.parentElement.classList.contains('code-block-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'code-block-wrapper';
          
          const header = document.createElement('div');
          header.className = 'code-block-header';
          header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="code-dots">
                <span class="code-dot red"></span>
                <span class="code-dot yellow"></span>
                <span class="code-dot green"></span>
              </div>
              <span class="code-lang-tag">${lang}</span>
            </div>
            <button class="copy-code-btn" type="button">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>复制</span>
            </button>
          `;

          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(header);
          wrapper.appendChild(pre);

          const copyBtn = header.querySelector('.copy-code-btn');
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(rawCode).then(() => {
              copyBtn.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span style="color: #22c55e; font-weight: 600;">已复制!</span>
              `;
              setTimeout(() => {
                copyBtn.innerHTML = `
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  <span>复制</span>
                `;
              }, 2000);
            });
          });
        }
      });
    }
  };

  // JavaScript / TypeScript 语法规则
  Prism.languages.javascript = {
    'comment': [/\/\*[\s\S]*?\*\//, /\/\/.*/],
    'string': [/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, /`(?:\\[\s\S]|[^\\`])*`/],
    'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    'boolean': /\b(?:true|false)\b/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    'function': /[a-z0-9_$]+(?=\()/i,
    'operator': /--|\+\+|&&|\|\||=>|<=|>=|==|!=|\*\*|[+\-*\/%&|^!=<>?~]/,
    'punctuation': /[{}[\];(),.:]/
  };
  Prism.languages.js = Prism.languages.javascript;
  Prism.languages.typescript = Prism.languages.javascript;
  Prism.languages.ts = Prism.languages.javascript;

  // Python 语法规则
  Prism.languages.python = {
    'comment': [/#.*/, /"""[\s\S]*?"""/, /'''[\s\S]*?'''/],
    'string': [/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/],
    'keyword': /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    'boolean': /\b(?:True|False|None)\b/,
    'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    'function': /(?:def\s+)[a-zA-Z_]\w*/i,
    'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    'punctuation': /[{}[\];(),.:]/
  };
  Prism.languages.py = Prism.languages.python;

  // HTML / XML 语法规则
  Prism.languages.html = {
    'comment': /<!--[\s\S]*?-->/,
    'tag': {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?!\s*[^\s>\/=])))+)?\s*\/?>/,
      inside: {
        'tag': { pattern: /^<\/?[^\s>\/]+/, inside: { 'punctuation': /^<\/?/, 'namespace': /^[^\s>\/:]+:/ } },
        'attr-value': { pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/, inside: { 'punctuation': /^=|^['"]|['"]$/ } },
        'punctuation': /\/?>/,
        'attr-name': { pattern: /[^\s>\/]+/ }
      }
    },
    'punctuation': /&[a-z0-9]+;|<|>|\/|&/i
  };
  Prism.languages.xml = Prism.languages.html;

  // CSS 语法规则
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//,
    'property': /(?:^|[{};])[ \t]*[a-zA-Z\-]+(?=\s*:)/,
    'keyword': /@(?:media|keyframes|import|charset|supports|page)/,
    'number': /#[\da-f]{3,8}|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:%|[a-z]+)?/i,
    'string': [/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/],
    'punctuation': /[{}[\];(),:]/
  };

  // Rust 语法规则
  Prism.languages.rust = {
    'comment': [/\/\*[\s\S]*?\*\//, /\/\/.*/],
    'string': [/b?"(?:\\[\s\S]|[^\\"])*"/, /b?r(#*)"[\s\S]*?"\1/],
    'keyword': /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|unsafe|use|where|while)\b/,
    'boolean': /\b(?:true|false)\b/,
    'number': /\b0x[\da-fA-F]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ui](?:8|16|32|64|128|size)|f(?:32|64))?\b/,
    'function': /[a-z0-9_$]+(?=\()/i,
    'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<(?:<=?|<)?|>(?:>=?|>)?/,
    'punctuation': /[{}[\];(),.:]/
  };

  // Bash / Shell 语法规则
  Prism.languages.bash = {
    'comment': /#.*/,
    'string': [/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, /`(?:\\[\s\S]|[^\\`])*`/],
    'keyword': /\b(?:if|then|else|elif|fi|for|while|in|do|done|case|esac|function|select|return|exit|export|source|alias|cd|mkdir|npm|git|npx|curl)\b/,
    'variable': /\$(?:[a-zA-Z0-9_?#*@$!-]+|\{[^}]+\})/,
    'operator': /&&|\|\||;;|>>|>|<|\|/,
    'punctuation': /[{}[\];(),]/
  };
  Prism.languages.sh = Prism.languages.bash;
  Prism.languages.shell = Prism.languages.bash;

  // JSON 语法规则
  Prism.languages.json = {
    'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    'string': /"(?:\\.|[^\\"\r\n])*"/,
    'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    'boolean': /\b(?:true|false|null)\b/,
    'punctuation': /[{}[\];,:]/
  };

  window.Prism = Prism;

  document.addEventListener('DOMContentLoaded', () => {
    Prism.highlightAll();
  });
})();
