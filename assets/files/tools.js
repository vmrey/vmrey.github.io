/**
 * @fileoverview 前端常用工具函数集合 (Common Frontend Utilities)
 * 包含日期、字符串、数组、加解密、字典处理、Vue 兼容性操作及深度检索。
 */

// =====================================
// === 辅助函数 (Internal Helpers) ===
// =====================================

/**
 * @private
 * 对数字进行前置补零，使其始终保持两位数。
 * @param {number} num - 要补零的数字（如 1, 9, 10）。
 * @returns {string} 补零后的字符串（如 "01", "09", "10"）。
 */
function zeroPadding(num) {
  num = num.toString();
  return num.length === 1 ? '0' + num : num;
}

/**
 * @private
 * 安全地将输入值转换为字符串。
 * 优化：对简单类型（string, number, boolean）提供快速路径，避免不必要的 JSON.stringify/replace 调用。
 * @param {*} value - 任何类型的值。
 * @returns {string} 转换后的字符串。
 */
function safeStringify(value) {
  if (value === undefined || value === null) {
    return "";
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // 对于对象、数组、Date等，使用 JSON.stringify
  const str = JSON.stringify(value);
  
  // 移除简单字符串值被 stringify 带来的引号
  if (str.length >= 2 && str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1);
  }
  return str;
}


// =====================================
// === 日期与时间 (Date & Time) ===
// =====================================

/**
 * 通过出生日期计算年龄。
 * @param {string} birthDateStr - 出生日期字符串，格式必须为 'YYYY-MM-DD'。
 * @param {string|null} [endDateStr=null] - 计算截止日期字符串，格式为 'YYYY-MM-DD'，默认为当前日期。
 * @returns {number} 计算出的年龄，如果日期格式不正确或出生日期晚于截止日期，则返回 0。
 * @example
 * // 假设今天是 2025-11-19
 * // 使用: calculateAge('2000-12-25')
 * // 返回: 24
 * @example
 * // 使用: calculateAge('2000-01-01', '2025-11-19')
 * // 返回: 25
 */
export function calculateAge(birthDateStr, endDateStr = null) {
  if (typeof birthDateStr !== "string" || !/^(\d{4}-\d{2}-\d{2})/.test(birthDateStr)) {
    return 0;
  }

  let finalEndDateStr = endDateStr;
  if (typeof endDateStr !== "string" || !/^(\d{4}-\d{2}-\d{2})/.test(endDateStr)) {
    const now = new Date();
    finalEndDateStr = `${now.getFullYear()}-${zeroPadding(now.getMonth() + 1)}-${zeroPadding(now.getDate())}`;
  }

  try {
    const birthParts = birthDateStr.split(' ')[0].split('-');
    const endParts = finalEndDateStr.split(' ')[0].split('-');

    const birthYear = parseInt(birthParts[0], 10);
    const birthMonthDay = parseInt(birthParts[1] + birthParts[2], 10); // MMdd
    const endYear = parseInt(endParts[0], 10);
    const endMonthDay = parseInt(endParts[1] + endParts[2], 10);     // MMdd

    let age = endYear - birthYear;

    if (age < 0 || (age === 0 && birthMonthDay > endMonthDay)) {
        return 0;
    }

    if (birthMonthDay > endMonthDay) {
      age -= 1;
    }

    return age;
  } catch (error) {
    console.error("calculateAge error:", error);
    return 0;
  }
}

/**
 * 通过时间戳转换为格式化日期字符串。
 * @param {number|string} timestamp - 时间戳 (支持10位秒级或13位毫秒级)。
 * @param {function(Object): string} [formatter=null] - 可选的格式化函数，接收包含 Y, M, D, h, m, s 属性的对象。
 * @returns {string} 默认格式 'YYYY-MM-DD hh:mm:ss' 或自定义格式化结果。
 * @example
 * // 使用: timestampToFormattedDate(1700344800000)
 * // 返回: "2023-11-19 10:00:00" (取决于时区)
 * @example
 * // 使用: timestampToFormattedDate(1700344800000, (v) => `${v.Y}年${v.M}月${v.D}日`)
 * // 返回: "2023年11月19日"
 */
export function timestampToFormattedDate(timestamp, formatter = null) {
  let ts = Number(timestamp);
  if ((ts + '').length === 10) {
    ts = ts * 1000;
  }

  const date = new Date(ts);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const dateParts = {
    Y: date.getFullYear().toString(),
    M: zeroPadding(date.getMonth() + 1),
    D: zeroPadding(date.getDate()),
    h: zeroPadding(date.getHours()),
    m: zeroPadding(date.getMinutes()),
    s: zeroPadding(date.getSeconds()),
  };
  
  if (typeof formatter === 'function') {
    return formatter(dateParts);
  }
  
  return `${dateParts.Y}-${dateParts.M}-${dateParts.D} ${dateParts.h}:${dateParts.m}:${dateParts.s}`;
}

/**
 * 通过日期获取当前周的所有日期列表（从周一到周日）。
 * @param {string|null} [dateStr=null] - 任意日期字符串，默认为当前日期。
 * @param {string} [separator='-'] - 日期分隔符。
 * @returns {string[]} 包含一周日期的数组，格式为 'YYYY[tag]MM[tag]DD'。
 * @example
 * // 使用: getWeekDateList('2025-11-19') // 假设 11-19 是周二
 * // 返回: ["2025-11-18", "2025-11-19", ..., "2025-11-24"] (从周一开始)
 */
export function getWeekDateList(dateStr = null, separator = '-') {
  const weekList = [];
  let date = dateStr ? new Date(dateStr) : new Date();

  date.setHours(0, 0, 0, 0);

  // 0=周日, 1=周一... 6=周六
  const day = date.getDay();
  // 计算本周一与今天的差值：周日(0)差6天，周一(1)差0天，周二(2)差1天...
  const diff = day === 0 ? 6 : day - 1; 

  // 设置到本周一
  date.setDate(date.getDate() - diff); 

  for (let i = 0; i < 7; i++) {
    const Y = date.getFullYear();
    const M = zeroPadding(date.getMonth() + 1);
    const D = zeroPadding(date.getDate());
    
    weekList.push(Y + separator + M + separator + D);
    
    // 移到下一天
    date.setDate(date.getDate() + 1);
  }
  return weekList;
}

// =====================================
// === 字符串与脱敏 (String & Privacy) ===
// =====================================

/**
 * 字符串超出指定长度后显示省略号。
 * @param {string} text - 输入文本。
 * @param {number} maxLength - 最大显示长度（字符数）。
 * @param {string} [ellipsisTag='...'] - 省略号标记。
 * @returns {string} 处理后的字符串。
 * @example
 * // 使用: stringEllipsis('前端工具函数集合', 4)
 * // 返回: "前端工具..."
 */
export function stringEllipsis(text, maxLength, ellipsisTag = '...') {
  const txt = safeStringify(text);
  const num = Number(maxLength);
  
  if (txt.length > num && num >= 0) {
    return txt.slice(0, num) + ellipsisTag;
  }
  return txt;
}

/**
 * 身份信息脱敏处理。
 * @param {string|number} dataStr - 要脱敏的字符串（如手机号、身份证号）。
 * @param {number} frontLen - 前面保留的字符数。
 * @param {number} endLen - 后面保留的字符数。
 * @param {string} [maskTag='*'] - 掩盖字符。
 * @returns {string} 脱敏后的字符串。
 * @example
 * // 使用: maskSensitiveData('13012345678', 3, 4)
 * // 返回: "130****5678"
 */
export function maskSensitiveData(dataStr, frontLen, endLen, maskTag = '*') {
  const str = safeStringify(dataStr);
  const fLen = Number(frontLen) || 0;
  const eLen = Number(endLen) || 0;
  const totalKeepLen = fLen + eLen;

  if (str.length <= totalKeepLen) {
    return str;
  }
  
  const maskLen = str.length - totalKeepLen;
  const mask = maskTag.repeat(maskLen);
  
  const start = str.substring(0, fLen);
  const end = str.substring(str.length - eLen);
  
  return start + mask + end;
}

// =====================================
// === 数组与对象 (Array & Object) ===
// =====================================

/**
 * 数组分类函数，根据指定的键或函数将数组元素分组到对象中。
 * @param {Array<Object>} array - 要分组的数组。
 * @param {string|function(Object): string} getKey - 用于获取分组键的属性名（字符串）或回调函数。
 * @returns {Object<string, Array<Object>>} 分组后的对象。
 * @example
 * // 示例数组：const users = [{ name: 'A', age: 20 }, { name: 'B', age: 30 }, { name: 'C', age: 20 }]
 * // 使用: groupArrayBy(users, 'age')
 * // 返回: { '20': [ {name: 'A', age: 20}, {name: 'C', age: 20} ], '30': [ {name: 'B', age: 30} ] }
 */
export function groupArrayBy(array, getKey) {
  if (!Array.isArray(array)) return {};

  let keyResolver;
  if (typeof getKey === 'string') {
    const propKey = getKey; 
    keyResolver = (item) => item[propKey];
  } else if (typeof getKey === 'function') {
    keyResolver = getKey;
  } else {
    return {}; 
  }

  return array.reduce((acc, item) => {
    const key = keyResolver(item);
    if (!Object.prototype.hasOwnProperty.call(acc, key)) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}


/**
 * 深度复制 JSON 对象或数组。
 * @param {Object|Array} obj - 要复制的源对象或数组。
 * @returns {Object|Array} 深度复制后的新对象或数组。
 * @description **注意：** 优先使用 JSON 方法，不支持拷贝函数、Date、RegExp、Set、Map等特殊对象或循环引用。
 * @example
 * // 使用: deepClone({ a: 1, b: { c: 2 } })
 * // 返回: { a: 1, b: { c: 2 } } (一个全新的对象)
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  try {
      return JSON.parse(JSON.stringify(obj));
  } catch (e) {
      console.warn("Deep copy failed using JSON method, falling back to recursive copy.", e);
      const result = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = deepClone(obj[key]);
        }
      }
      return result;
  }
}

/**
 * 数组去重函数。
 * @param {Array<any>} array - 要去重的数组。
 * @param {function(any, any): boolean} equalityFn - 比较函数，接收 (currentItem, existingItem)，返回 true 表示两个元素重复。
 * @returns {Array<any>} 去重后的新数组。
 * @description 复杂度为 O(N^2)，适用于小到中等规模的数组或需要自定义对象比较的场景。
 * @example
 * // 示例数组：const data = [{ id: 1, v: 'A' }, { id: 2, v: 'B' }, { id: 1, v: 'C' }]
 * // 使用: uniqueArray(data, (a, b) => a.id === b.id)
 * // 返回: [{ id: 1, v: 'A' }, { id: 2, v: 'B' }]
 */
export function uniqueArray(array, equalityFn) {
  if (!Array.isArray(array)) return [];

  const newArray = [];
  
  for (const currentItem of array) {
    // findIndex 查找复杂度为 O(N)，总复杂度 O(N^2)
    const isDuplicate = newArray.findIndex(existingItem => equalityFn(currentItem, existingItem)) > -1;
    
    if (!isDuplicate) {
      newArray.push(currentItem);
    }
  }
  return newArray;
}

/**
 * 递归检索数组或对象中是否深度包含某个值。
 * @param {any} data - 要检索的数组或对象（或其他数据）。
 * @param {any} targetValue - 要查找的目标值。
 * @param {WeakSet} [visited=new WeakSet()] - 用于追踪已访问的对象，防止循环引用导致栈溢出。
 * @returns {boolean} 如果找到目标值，返回 true，否则返回 false。
 * @description 使用 WeakSet 防止循环引用，并采用短路机制优化性能。
 * @example
 * // 示例对象：const obj = { a: 1, b: [2, { c: 3, d: [4] }] }
 * // 使用: deepIncludes(obj, 3)
 * // 返回: true
 * @example
 * // 使用: deepIncludes(obj, 5)
 * // 返回: false
 */
export function deepIncludes(data, targetValue, visited = new WeakSet()) {
  // 1. 基本类型和 null 检查 (快速路径)
  if (data === targetValue) {
    return true;
  }
  
  // 2. 检查数据是否为对象或数组
  const isObject = typeof data === 'object' && data !== null;

  if (!isObject) {
    return false;
  }
  
  // 3. 循环引用检查 (健壮性关键)
  if (visited.has(data)) {
    return false;
  }
  visited.add(data); // 标记为已访问

  // 4. 遍历并递归查找
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      
      if (value === targetValue) {
        return true;
      }
      
      // 递归调用
      if (typeof value === 'object' && value !== null) {
        if (deepIncludes(value, targetValue, visited)) {
          return true;
        }
      }
    }
  }

  // 5. 遍历完成仍未找到
  return false;
}

// =====================================
// === 数据加解密 (Simple Encoding) ===
// =====================================

/**
 * 简单数据加密方法（基于字符编码的偏移）。
 * @param {any} data - 要加密的 JSON 可序列化数据。
 * @param {number} salt - 盐值（偏移量）。
 * @returns {string} 加密后的 JSON 字符串。
 * @example
 * // 使用: encodeData({ key: 'value' }, 5)
 * // 返回: "[123, 34, 108, 106, 120, 39, 118, 97, 108, 117, 101, 39, 58, 125]" (大致结果)
 */
export function encodeData(data, salt) {
  const strData = JSON.stringify(data);
  const encodedChars = [];
  
  for (const char of strData) {
    encodedChars.push(char.charCodeAt(0) + salt);
  }
  
  return JSON.stringify(encodedChars);
}

/**
 * 简单数据解密方法（基于字符编码的偏移）。
 * @param {string} encodedStr - 加密后的 JSON 字符串（由 encodeData 生成）。
 * @param {number} salt - 盐值（偏移量，通常是加密时的负值）。
 * @returns {any} 解密后的原始数据。
 * @throws {Error} 如果数据解密或解析失败。
 * @example
 * // 假设 encodedStr 是上例的返回值
 * // 使用: decodeData(encodedStr, -5)
 * // 返回: { key: 'value' }
 */
export function decodeData(encodedStr, salt) {
  try {
    const encodedArr = JSON.parse(encodedStr);
    
    if (!Array.isArray(encodedArr)) {
        throw new Error("Invalid encoded format.");
    }

    let decodedString = "";
    for (const code of encodedArr) {
      decodedString += String.fromCharCode(Number(code) + salt);
    }

    return JSON.parse(decodedString);
  } catch (error) {
    console.error("decodeData error:", error);
    throw new Error("Data decryption or parsing failed: " + error.message);
  }
}

// =====================================
// === 浏览器与 DOM (Browser & DOM) ===
// =====================================

/**
 * 前端获取 URL 地址中的查询参数。
 * @returns {Object<string, string>} 包含所有查询参数的对象。
 * @description 优先使用 URLSearchParams API，健壮高效。
 * @example
 * // 假设 URL 是 http://example.com/?name=张三&age=20
 * // 使用: getUrlQueryParams()
 * // 返回: { name: '张三', age: '20' }
 */
export function getUrlQueryParams() {
  const params = {};
  
  try {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    searchParams.forEach((value, key) => {
        params[key] = value;
    });
    
  } catch (e) {
    // Fallback for older browsers
    const queryString = window.location.href.split('?')[1] || "";
    
    if (queryString) {
        queryString.split("&").forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
    }
  }
  return params;
}

/**
 * 设置页面会话缓存 (sessionStorage)。
 * @param {string} key - 缓存的键名。
 * @param {any} value - 要存储的值。
 * @returns {boolean} 始终返回 true。
 * @description 如果缓存中已存在对象且新值也是对象，则进行浅合并。
 * @example
 * // 使用: setSessionCache('user', { name: '张三', age: 20 })
 */
export function setSessionCache(key, value) {
  const cacheKey = safeStringify(key);
  let result = {};

  try {
    const existing = sessionStorage.getItem(cacheKey);
    result = existing ? JSON.parse(existing) : '';
  } catch (error) {
    result = '';
  }
  
  let finalValue = value;

  if (value && result && typeof value === "object" && typeof result === 'object' && !Array.isArray(value) && !Array.isArray(result)) {
    finalValue = { ...result, ...value };
  } else if (!value) {
    finalValue = '';
  }

  sessionStorage.setItem(cacheKey, JSON.stringify(finalValue));
  return true;
}

/**
 * 获取页面会话缓存 (sessionStorage)。
 * @param {string} key - 缓存的键名。
 * @returns {any} 缓存的值，如果不存在或解析失败，返回空字符串 ''。
 * @example
 * // 使用: getSessionCache('user')
 * // 返回: { name: '张三', age: 20 }
 */
export function getSessionCache(key) {
  const cacheKey = safeStringify(key);
  let result = '';
  
  try {
    const cachedItem = sessionStorage.getItem(cacheKey);
    result = cachedItem ? JSON.parse(cachedItem) : '';
  } catch (error) {
    result = '';
  }
  return result;
}

/**
 * base64 图片数据转 File 对象的方法。
 * @param {string} base64Data - base64 格式的图片数据 (如 "data:image/png;base64,iVBORw...")。
 * @param {string} fileName - 生成的 File 对象的文件名（不含后缀）。
 * @returns {File} 生成的 File 文件对象。
 * @throws {Error} 如果 Base64 格式无效。
 * @example
 * // 使用: base64ToImageFile('data:image/png;base64,...', 'avatar')
 */
export function base64ToImageFile(base64Data, fileName) {
  const parts = base64Data.split(',');
  if (parts.length !== 2) {
    throw new Error('Invalid base64 format.');
  }
  
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const suffix = mimeType.split('/')[1] || 'png';

  const bstr = window.atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  const file = new File([u8arr], `${fileName}.${suffix}`, {
    type: mimeType
  });
  
  return file;
}

/**
 * Vue 2.x 组件初始化 data 值的方法。（Vue 2 专用）
 * @param {Object} that - Vue 组件实例 (this)。
 * @param {string} [key=''] - 可选，只初始化 data 中的特定属性键。
 * @returns {void}
 * @description **注意：** 此方法依赖 Vue 2.x 的 `$options.data()` 和 `$data` 结构，Vue 3 不适用。
 * @example
 * // (在 Vue 2 组件 methods 中使用): vueResetData(this) // 重置所有 data
 * // (在 Vue 2 组件 methods 中使用): vueResetData(this, 'formData') // 只重置 formData
 */
export function vueResetData(that, key = '') {
  const defaultData = that.$options.data.call(that); 
  
  if (typeof key === 'string' && key) {
    that[key] = defaultData[key];
  } else {
    Object.assign(that.$data, defaultData);
  }
}

/**
 * 通过 Blob 格式进行文件下载。
 * @param {Blob} blob - 要下载文件的 Blob 对象。
 * @param {string} fileName - 下载文件的名称（包含后缀，如 'report.pdf'）。
 * @returns {void}
 * @example
 * // 假设 blob 是从后端获取的 Blob 对象
 * // 使用: downloadBlob(blob, 'export_data.xlsx')
 */
export function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * 通过 URL 地址进行文件下载。
 * @param {string} url - 文件的 URL 地址。
 * @param {string} fileName - 下载文件的名称（包含后缀）。
 * @returns {void}
 * @description 适用于同源文件下载或服务器已设置 CORS/Content-Disposition。
 * @example
 * // 使用: downloadUrl('/api/download/report?id=123', 'annual_report.pdf')
 */
export function downloadUrl(url, fileName) {
  const a = document.createElement('a');
  
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
}

/**
 * 表单校验提示封装。
 * @param {Array<Object>} validationRules - 校验规则数组，每项包含校验函数和提示信息。
 * @param {string} [checkFnKey='fun'] - 校验函数属性的键名。
 * @param {string} [hintMsgKey='hint'] - 提示信息属性的键名。
 * @returns {string} 第一个校验失败的提示信息，如果没有失败则返回空字符串 ''。
 * @description 采用短路判断，一旦有规则失败（函数返回 true），立即返回提示。
 * @example
 * // 示例规则：const rules = [{ fun: () => !data.name, hint: "用户名不能为空！" }]
 * // 使用: checkValidation(rules)
 * // 返回: "用户名不能为空！" (如果 data.name 为空)
 */
export function checkValidation(validationRules, checkFnKey = 'fun', hintMsgKey = "hint") {
  if (Array.isArray(validationRules)) {
    for (const rule of validationRules) {
      if (typeof rule[checkFnKey] === 'function') {
        if (rule[checkFnKey]()) {
          return rule[hintMsgKey] || '校验失败';
        }
      }
    }
  }
  return '';
}

/**
 * 根据字典值（value）获取对应的标签（label）。
 * @param {Array<Object>} dictionaryData - 字典数据数组，格式为 [{ label: '标签', value: '值' }, ...]
 * @param {string|string[]|number} value - 要查找的字典值。
 * @param {string} [separator=','] - 如果 value 是字符串，用于分隔值的符号。
 * @returns {string} 对应的标签字符串，以传入的分隔符连接。
 * @description **性能优化:** 使用 Map 结构实现 O(1) 查找。
 * @example
 * // 示例字典：const dict = [{ label: '男', value: 1 }, { label: '女', value: 2 }]
 * // 使用: getDictLabelsByValues(dict, '1,2')
 * // 返回: "男,女"
 */
export function getDictLabelsByValues(dictionaryData, value, separator = ',') {
  if (!dictionaryData || dictionaryData.length === 0 || value === undefined || value === null || (Array.isArray(value) && array.length === 0)) {
    return "";
  }

  let targetValues;
  if (Array.isArray(value)) {
    targetValues = value.map(String);
  } else if (typeof value === 'string') {
    targetValues = value.split(separator).filter(v => v !== ''); 
  } else {
    targetValues = [String(value)];
  }
  
  const dictMap = new Map();
  for (const item of dictionaryData) {
    dictMap.set(String(item.value), item.label);
  }
  
  const labels = [];
  
  for (const targetVal of targetValues) {
    const label = dictMap.get(targetVal);
    
    if (label !== undefined) {
      labels.push(label);
    } else {
      labels.push(targetVal);
    }
  }

  return labels.join(separator);
}

/**
 * 表单重置函数（兼容 Vue 2 和 Vue 3）。
 * 依赖于表单组件（如 Element Plus 的 ElForm）暴露的 resetFields() 方法。
 * * @param {Object} componentInstanceOrFormRef - 
 * - **Vue 3:** 传入 `ref()` 关联的表单引用对象（如 `formRef`）。
 * - **Vue 2:** 传入组件实例 `this`。
 * @param {string|null} [refName=null] - 
 * - **Vue 3:** 不需要传。
 * - **Vue 2:** 传入表单组件的字符串 ref 名称（如 `'myForm'`）。
 * @returns {void}
 * @example
 * // Vue 3 (Composition API): resetFormCompatibility(formRef)
 * // Vue 2 (Options API): resetFormCompatibility(this, 'myForm')
 */
export function resetFormCompatibility(componentInstanceOrFormRef, refName = null) {
  let formInstance = null;

  // 1. Vue 3 模式：检查是否有 .value 属性
  if (componentInstanceOrFormRef && componentInstanceOrFormRef.value) {
    formInstance = componentInstanceOrFormRef.value;
  }
  
  // 2. Vue 2 模式：检查是否有 $refs 且 refName 是字符串
  else if (componentInstanceOrFormRef && componentInstanceOrFormRef.$refs && typeof refName === 'string') {
    formInstance = componentInstanceOrFormRef.$refs[refName];
  }

  // 3. 执行重置
  if (formInstance && typeof formInstance.resetFields === 'function') {
    formInstance.resetFields();
    console.log("Form reset successful.");
    return;
  }
  
  // 4. 警告处理
  if (!formInstance) {
    console.warn(
      "Reset Form Failed: Could not find the form instance. " +
      "Ensure you are passing the correct arguments: " +
      "(Vue 3: formRef) or (Vue 2: this, 'refName')."
    );
  } else {
    console.warn("Reset Form Failed: The found component does not expose a 'resetFields' method.");
  }
}

/**
 * 检查给定行（row）的指定键（key）的值是否在允许显示的状态数组中。
 * 用于控制UI元素的可见性。
 *
 * @param {object} row - 要检查的数据行对象。
 * @param {object} object - 配置对象，包含 key (属性名) 和 showValues (允许显示的状态值数组)。
 * @returns {boolean} - 如果 row[key] 的值在 showValues 数组中，则返回 true (应该显示)，否则返回 false。
 */
export function shouldShow(row, object) {
  // 1. 解构配置对象，并提供安全默认值
  const { key, showValues } = object || {};

  // 2. 检查配置：如果未提供有效状态数组，则不应该显示
  if (!Array.isArray(showValues) || showValues.length === 0) {
    return false;
  }

  // 3. 获取并检查状态值：如果行对象或对应属性值不存在，则不应该显示
  const statusValue = row?.[key];
  if (statusValue === undefined || statusValue === null) {
    return false;
  }

  // 4. 核心逻辑：检查状态值是否在允许列表中
  return showValues.includes(statusValue);
}
