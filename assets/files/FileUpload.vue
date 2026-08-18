<template>
  <div>
    <el-row :gutter="10" style="width: 100%; margin-bottom: 10px">
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          :limit="props.limit"
          :accept="props.accept"
          :show-file-list="false"
          :on-exceed="handleExceed"
          :on-change="handleFileChange"
          :auto-upload="false"
          multiple
        >
          <el-button
            :disabled="uploadedFiles.length >= props.limit || isUploading"
          >
            选择文件
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <el-button
          type="success"
          :disabled="!hasPendingFiles || isUploading"
          @click="uploadPendingFiles"
          :loading="isUploading"
        >
          {{ isUploading ? "上传中..." : "上传选定文件" }}
        </el-button>
      </el-col>
    </el-row>

    <div v-if="uploadedFiles.length" class="file-list-container">
      <div v-for="file in uploadedFiles" :key="file.uid" class="file-item">
        <el-icon><document /></el-icon>

        <span class="file-name" :title="file.name">
          {{ file.name }}
        </span>

        <span
          v-if="file.status === FILE_STATUS.SUCCESS"
          class="file-status success-tag"
        >
          <span class="status-content"> 已上传 </span>
        </span>
        <span
          v-else-if="file.status === FILE_STATUS.READY"
          class="file-status pending-tag"
        >
          待上传
        </span>
        <span
          v-else-if="file.status === FILE_STATUS.UPLOADING"
          class="file-status uploading-tag"
        >
          上传中...
        </span>
        <span
          v-else-if="file.status === FILE_STATUS.FAIL"
          class="file-status fail-tag"
        >
          失败
        </span>

        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          @click="handleRemoveFile(file)"
          :loading="file.isDeleting"
          :disabled="isUploading"
        />
      </div>
    </div>

    <div v-else class="el-upload__tip">当前没有已选择或已上传的文件。</div>

    <div class="el-upload__tip file-info-tip">
      支持文件类型: {{ props.accept }}，单个文件大小不超过
      {{ props.maxSize_MB }}MB。
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance } from "vue";
import { getToken } from "@/utils/auth";
import { Document, Delete } from "@element-plus/icons-vue";
import axios from "axios";

const { proxy } = getCurrentInstance();

// --- 内部常量配置 (抽离状态值) ---
const FILE_STATUS = {
  READY: "ready",
  UPLOADING: "uploading",
  SUCCESS: "success",
  FAIL: "fail",
};

// --- Props & Emits (保留配置项) ---
const props = defineProps({
  // 提交给父组件的附件ID列表
  attachmentIds: {
    type: Array,
    default: () => [],
  },
  // 🌟 核心：父组件传入的初始文件列表（用于回显/编辑）
  initialFiles: {
    type: Array,
    default: () => [],
  },
  limit: { type: Number, default: 5 },
  accept: { type: String, default: ".pdf,.doc,.docx,.xls,.xlsx" },
  maxSize_MB: { type: Number, default: 100 },
  uploadUrlPath: {
    type: String,
    default: "/attachment/upload",
  },
  fileFieldName: {
    type: String,
    default: "file",
  },
  fileIdKey: {
    type: String,
    default: "fileId",
  },
});

const emit = defineEmits(["update:attachmentIds", "change"]);

// --- 状态管理 ---
const uploadRef = ref(null);
const isUploading = ref(false);
const uploadedFiles = ref([]); // 统一管理所有文件（已上传和待上传）

// --- 动态上传配置 ---
const BASE_API = import.meta.env.VITE_APP_BASE_API;
const UPLOAD_URL = computed(() => BASE_API + props.uploadUrlPath);

// 计算属性：是否有文件待上传
const hasPendingFiles = computed(() => {
  return uploadedFiles.value.some((f) => f.status === FILE_STATUS.READY);
});

// 计算属性：获取已成功上传的文件ID列表
const currentAttachmentIds = computed(() => {
  return uploadedFiles.value
    .filter((f) => f.status === FILE_STATUS.SUCCESS && f.fileId)
    .map((f) => f.fileId);
});

/**
 * ** 文件上传 API 调用  **
 */
const uploadApi = async (file) => {
  if (!file) {
    throw new Error("文件对象无效，无法开始上传。");
  }
  const formData = new FormData();
  formData.append(props.fileFieldName, file);

  try {
    const response = await axios.post(UPLOAD_URL.value, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorMsg =
        error.response.data?.msg || `上传失败 (HTTP 状态码: ${status})`;
      throw new Error(errorMsg);
    } else {
      const finalError = error.message || "网络连接失败，请检查网络。";
      throw new Error(finalError);
    }
  }
};

/**
 * **MOCK: 模拟文件删除 API 调用 (保持不变)**
 */
const mockDeleteApi = (fileId) => {
  return new Promise((resolve) => {
    // 实际应用中：调用后端删除接口
    // proxy.$http.delete(`/attachment/delete/${fileId}`).then(resolve).catch(reject);
    setTimeout(resolve, 200); // 模拟网络延迟
  });
};

// ----------------------------------------------------------------------
// --- 文件管理逻辑 --------------------------------------------------
// ----------------------------------------------------------------------

/**
 * 文件选择事件，将文件添加到待上传列表
 */
const handleFileChange = (uploadFile) => {
  if (uploadFile.status === "ready") {
    // 1. 检查文件大小
    const isLtSize = uploadFile.raw.size / 1024 / 1024 < props.maxSize_MB;
    if (!isLtSize) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.maxSize_MB}MB!`);
      uploadRef.value.handleRemove(uploadFile);
      return;
    }

    // 2. 将文件添加到统一管理的列表中
    uploadedFiles.value.push({
      name: uploadFile.name,
      uid: uploadFile.uid,
      status: FILE_STATUS.READY,
      fileId: null,
      raw: uploadFile.raw,
      isDeleting: false,
    });

    // 3. 清空 el-upload 的内部列表
    uploadRef.value.clearFiles();
  }
  emit("change", uploadedFiles.value);
};

/**
 * 遍历并上传所有 status 为 'ready' 的文件
 */
const uploadPendingFiles = async () => {
  isUploading.value = true;
  let successCount = 0;
  let failCount = 0;

  const filesToUpload = uploadedFiles.value.filter(
    (f) => f.status === FILE_STATUS.READY && f.raw
  );

  for (const fileItem of filesToUpload) {
    fileItem.status = FILE_STATUS.UPLOADING;

    try {
      const responseData = await uploadApi(fileItem.raw);
      const fileId = responseData[props.fileIdKey];

      if (responseData.code === 200 && fileId) {
        fileItem.fileId = fileId;
        fileItem.status = FILE_STATUS.SUCCESS;
        successCount++;
      } else {
        throw new Error(responseData.msg || "上传失败，服务器响应异常");
      }
    } catch (error) {
      fileItem.status = FILE_STATUS.FAIL;
      failCount++;
      proxy.$modal.msgError(
        `文件 **${fileItem.name}** 上传失败: ${error.message || "未知错误"}`
      );
    }
  }

  isUploading.value = false;

  // 清除所有上传失败的文件
  uploadedFiles.value = uploadedFiles.value.filter(
    (f) => f.status !== FILE_STATUS.FAIL
  );
  emit("update:attachmentIds", currentAttachmentIds.value);
  emit("change", uploadedFiles.value);

  // 批量提示
  if (successCount > 0 && failCount === 0) {
    proxy.$modal.msgSuccess(`所有文件上传批次完成，成功 ${successCount} 个。`);
  } else if (successCount > 0 && failCount > 0) {
    proxy.$modal.msgWarning(
      `文件上传批次完成，成功 ${successCount} 个，失败 ${failCount} 个，失败文件已移除。`
    );
  } else if (successCount === 0 && failCount > 0) {
    proxy.$modal.msgError(
      `文件上传批次全部失败，共 ${failCount} 个文件已移除。`
    );
  }
};

/**
 * 文件数量超出限制时的回调
 */
const handleExceed = () => {
  proxy.$modal.msgWarning(
    `文件数量超出限制，最多只能上传 ${props.limit} 个文件！`
  );
};

/**
 * 移除文件 (支持删除服务器文件)
 */
const handleRemoveFile = async (file) => {
  const confirmMsg = file.fileId
    ? `确认删除文件 **${file.name}** 吗? 此操作将同时删除服务器上的文件。`
    : `确认移除待上传的文件 **${file.name}** 吗?`;

  await proxy.$modal.confirm(confirmMsg).catch(() => {
    throw new Error("User cancelled operation");
  });

  file.isDeleting = true;

  try {
    if (file.fileId) {
      await mockDeleteApi(file.fileId);
      proxy.$modal.msgSuccess(`文件 **${file.name}** 已从服务器删除。`);
    } else {
      proxy.$modal.msgSuccess(`待上传文件 **${file.name}** 已移除。`);
    }

    uploadedFiles.value = uploadedFiles.value.filter((f) => f.uid !== file.uid);

    emit("update:attachmentIds", currentAttachmentIds.value);
    emit("change", uploadedFiles.value);
  } catch (error) {
    const errorMessage =
      error.message === "User cancelled operation"
        ? "用户已取消删除操作"
        : error.message || "请检查网络或服务";

    proxy.$modal.msgError(`删除文件失败: ${errorMessage}`);
  } finally {
    file.isDeleting = false;
  }
};

// --- 暴露清除方法给父组件调用 ---
const clearFiles = () => {
  uploadedFiles.value = [];
  emit("update:attachmentIds", []);
  emit("change", []);
};

// ----------------------------------------------------------------------
// --- 生命周期与监听器 (回显核心优化) --------------------------------
// ----------------------------------------------------------------------
watch(
  () => props.initialFiles,
  (newFiles) => {
    if (!newFiles || newFiles.length === 0) {
      // 如果父组件明确清空了 initialFiles，则只移除本地已上传的文件，保留待上传文件
      uploadedFiles.value = uploadedFiles.value.filter(
        (f) => f.status === FILE_STATUS.READY
      );
    } else {
      // 1. 构建新的已上传文件列表 (回显文件)
      const newUploaded = newFiles.map((item) => ({
        // 确保字段兼容性：使用 fileId/id 作为唯一标识和提交ID
        name: item.fileName || item.name || "未知文件",
        uid: item.id || Date.now() + Math.random(), // 使用 ID 作为唯一 UID
        status: FILE_STATUS.SUCCESS,
        fileId: item.id, // 确保 fileId 绑定了后端返回的 ID
        raw: null,
        isDeleting: false,
      }));

      // 2. 提取当前列表中用户新选的“待上传”文件
      const pendingFiles = uploadedFiles.value.filter(
        (f) => f.status === FILE_STATUS.READY
      );

      // 3. 合并：新的已上传文件 + 用户的待上传文件
      uploadedFiles.value = [...newUploaded, ...pendingFiles];
    }

    // 触发 ID 列表和 change 事件更新
    emit("update:attachmentIds", currentAttachmentIds.value);
    emit("change", uploadedFiles.value);
  },
  { immediate: true, deep: true }
);

// 将方法暴露给父组件
defineExpose({
  clearFiles,
  uploadedFiles,
  currentAttachmentIds,
});
</script>

<style scoped>
.file-list-container {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
  width: 100%;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-size: 14px;
}

.file-item:last-child {
  border-bottom: none;
}

.el-icon,
.el-button {
  flex-shrink: 0;
}
.el-icon {
  margin-right: 8px;
}
.el-button {
  margin-left: auto;
}
.file-name {
  min-width: 0;
  margin-right: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  flex-grow: 1;
  color: var(--el-text-color-regular);
}

.file-status {
  flex-shrink: 0;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.status-content {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.success-tag {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}
.pending-tag {
  color: var(--el-color-warning);
  background-color: var(--el-color-warning-light-9);
}
.uploading-tag {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
.fail-tag {
  color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}
.file-info-tip {
  margin-top: 5px;
}
</style>
