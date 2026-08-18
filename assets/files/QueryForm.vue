<template>
  <el-form
    :model="currentQueryParams"
    ref="queryRef"
    :inline="true"
    class="query-form-container"
    @submit.prevent
    v-bind="formProps || {}"
    :size="componentSize"
  >
    <el-form-item
      v-for="item in formConfig"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      v-bind="item.formItemProps || {}"
    >
      <template v-if="item.type === 'input'">
        <el-input
          v-model="currentQueryParams[item.prop]"
          :placeholder="item.placeholder || '请输入内容'"
          clearable
          :style="{ width: item.width || calculatedDefaultWidth }"
          @keyup.enter="handleQuery"
          @blur="trimAndSet(item.prop)"
          v-bind="item.inputProps || {}"
        />
      </template>

      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="currentQueryParams[item.prop]"
          :placeholder="item.placeholder || '请选择内容'"
          clearable
          :style="{ width: item.width || calculatedDefaultWidth }"
          @change="handleQuery"
          v-bind="item.inputProps || {}"
        >
          <el-option
            v-for="dict in dicts[item.dictKey] || []"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
            v-bind="dict.optionProps || {}"
          />
        </el-select>
      </template>

      <template v-else-if="item.type === 'radio'">
        <el-radio-group
          v-model="currentQueryParams[item.prop]"
          @change="handleQuery"
          v-bind="item.inputProps || {}"
        >
          <el-radio
            v-for="dict in dicts[item.dictKey] || []"
            :key="dict.value"
            :label="dict.value"
            v-bind="dict.radioProps || {}"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </template>

      <template v-else-if="item.type === 'checkbox'">
        <el-checkbox-group
          v-model="currentQueryParams[item.prop]"
          @change="handleQuery"
          v-bind="item.inputProps || {}"
        >
          <el-checkbox
            v-for="dict in dicts[item.dictKey] || []"
            :key="dict.value"
            :label="dict.value"
            v-bind="dict.checkboxProps || {}"
          >
            {{ dict.label }}
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-else-if="item.type === 'dateRange'">
        <el-date-picker
          :style="{ width: item.width || calculatedDefaultWidth }"
          v-model="dateRangeValue"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateRangeChange(item)"
          v-bind="item.inputProps || {}"
        ></el-date-picker>
      </template>

      <template v-else-if="item.type === 'slot'">
        <slot :name="item.prop" :query="currentQueryParams" :prop="item.prop">
          <span style="color: #999"
            >请提供名为 "{{ item.prop }}" 的插槽内容</span
          >
        </slot>
      </template>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        icon="Search"
        @click="handleQuery"
        :size="componentSize"
        >搜索</el-button
      >
      <el-button icon="Refresh" @click="resetQuery" :size="componentSize"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";

// 内部常量：默认宽度
const DEFAULT_WIDTH = "220px";
const DEFAULT_DEBOUNCE_MS = 300;

const props = defineProps({
  /** 查询参数对象，使用 v-model 绑定。默认 {} */
  modelValue: { type: Object, default: () => ({}) },
  /** 表单项配置数组。默认 [] */
  formConfig: { type: Array, default: () => [] },
  /** 字典数据对象。默认 {} */
  dicts: { type: Object, default: () => ({}) },
  /** 绑定到 el-form 上的额外属性（如 size, label-width 等） */
  formProps: { type: Object, default: () => ({}) },
  /** 统一设置所有表单项的默认宽度 */
  defaultWidth: { type: String, default: DEFAULT_WIDTH },
  /** 查询防抖延迟时间 (毫秒)。设置为 0 时禁用防抖 */
  queryDebounce: {
    type: Number,
    default: DEFAULT_DEBOUNCE_MS,
  },
  /** **[修改点 1]** 统一控制组件内所有 Element Plus 控件的尺寸 */
  componentSize: {
    type: String,
    default: "default", // Element Plus 默认尺寸
    validator: (value) => ["large", "default", "small"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "query", "reset"]);

const queryRef = ref(null);

const calculatedDefaultWidth = computed(
  () => props.defaultWidth || DEFAULT_WIDTH
);

const currentQueryParams = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const dateRangeValue = ref([]);

// **用于去除输入框两端空格并更新模型**
const trimAndSet = (prop) => {
  const value = currentQueryParams.value[prop];
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (trimmedValue !== value) {
      currentQueryParams.value[prop] = trimmedValue;
    }
  }
};

// ======================================================
// **查询防抖逻辑与定时器清除**
// ======================================================

/**
 * 核心查询执行函数 (未防抖)
 */
const executeQuery = () => {
  emit("query", currentQueryParams.value);
};

// 使用 ref 来存储 debounce 实例，实例包含 run (执行) 和 cancel (清除)
const debouncedHandleQueryRef = ref({
  run: executeQuery, // 默认指向立即执行
  cancel: () => {},
});

/**
 * 简单的防抖工具，返回一个 run 方法和一个 cancel 方法
 */
const debounce = (func, delay) => {
  let timeoutId = null;

  const run = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  const cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return { run, cancel };
};

/**
 * 暴露给模板和外部调用的查询函数
 */
const handleQuery = (...args) => {
  // 调用当前 debouncedHandleQueryRef 实例的 run 方法
  if (debouncedHandleQueryRef.value.run) {
    debouncedHandleQueryRef.value.run(...args);
  }
};

// **智能判断：监听 queryDebounce prop 的变化，重新生成防抖函数或禁用防抖**
watch(
  () => props.queryDebounce,
  (newDelay) => {
    // 1. 清除旧的定时器
    debouncedHandleQueryRef.value.cancel();

    // 2. 规范化延迟时间
    const delay =
      typeof newDelay === "number" && newDelay >= 0
        ? newDelay
        : DEFAULT_DEBOUNCE_MS;

    // 3. 智能判断：如果 delay 为 0，则禁用防抖
    if (delay === 0) {
      // 如果延迟为 0，直接使用原始函数 (立即执行)，并将 cancel 设为空操作
      debouncedHandleQueryRef.value = {
        run: executeQuery,
        cancel: () => {},
      };
    } else {
      // 否则，使用正常的防抖函数
      debouncedHandleQueryRef.value = debounce(executeQuery, delay);
    }
  },
  { immediate: true }
);

// 在组件卸载前，清除定时器，确保组件资源释放干净
onBeforeUnmount(() => {
  if (debouncedHandleQueryRef.value.cancel) {
    debouncedHandleQueryRef.value.cancel();
  }
});
// ======================================================
// **查询防抖逻辑 结束**
// ======================================================

/**
 * 格式化日期：将 YYYY-MM-DD 字符串补全时间
 */
const formatTime = (dateString, isEnd) => {
  if (!dateString) return undefined;
  if (isEnd) {
    return dateString + " 23:59:59";
  } else {
    return dateString + " 00:00:00";
  }
};

/**
 * 处理日期范围选择变化，根据配置补全时间
 */
const handleDateRangeChange = (item) => {
  const { dateProps, autoCompleteTime } = item;
  const [startDateProp, endDateProp] = dateProps || [];

  if (dateRangeValue.value && dateRangeValue.value.length === 2) {
    let startDate = dateRangeValue.value[0];
    let endDate = dateRangeValue.value[1];

    if (autoCompleteTime) {
      startDate = formatTime(startDate, false);
      endDate = formatTime(endDate, true);
    }

    currentQueryParams.value[startDateProp] = startDate;
    currentQueryParams.value[endDateProp] = endDate;
  } else {
    currentQueryParams.value[startDateProp] = undefined;
    currentQueryParams.value[endDateProp] = undefined;
  }

  handleQuery();
};

/**
 * 触发重置事件
 */
function resetQuery() {
  dateRangeValue.value = [];

  if (queryRef.value) {
    queryRef.value.resetFields();
  }

  const newParams = { ...props.modelValue };
  const fieldsToClear = new Set();

  props.formConfig.forEach((item) => {
    if (item.prop) {
      fieldsToClear.add(item.prop);
    }

    if (item.type === "dateRange" && item.dateProps) {
      item.dateProps.forEach((dateProp) => fieldsToClear.add(dateProp));
    }
  });

  fieldsToClear.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(newParams, key)) {
      newParams[key] = undefined;
    }
  });

  emit("update:modelValue", newParams);
  emit("reset", newParams);

  // 统一调用防抖后的 handleQuery
  handleQuery();
}

// 首次加载和 modelValue/formConfig 变化时，初始化 dateRangeValue
watch(
  () => [props.modelValue, props.formConfig],
  ([newVal, newConfig]) => {
    if (newConfig && newConfig.length > 0) {
      const dateRangeItem = newConfig.find((item) => item.type === "dateRange");

      if (dateRangeItem && dateRangeItem.dateProps) {
        const [startDateProp, endDateProp] = dateRangeItem.dateProps;

        const startDate = newVal[startDateProp];
        const endDate = newVal[endDateProp];

        const displayStartDate =
          startDate && startDate.length >= 10
            ? startDate.substring(0, 10)
            : undefined;
        const displayEndDate =
          endDate && endDate.length >= 10
            ? endDate.substring(0, 10)
            : undefined;

        if (displayStartDate && displayEndDate) {
          dateRangeValue.value = [displayStartDate, displayEndDate];
        } else if (!displayStartDate && !displayEndDate) {
          dateRangeValue.value = [];
        }
      }
    }
  },
  { immediate: true, deep: true }
);

defineExpose({
  handleQuery,
  resetQuery,
  formRef: queryRef,
});
</script>
