<template>
    <el-dialog v-model="visible" width="80%">
        <OfficePreview :file-url="fileUrl" />
    </el-dialog>
</template>

<script lang="ts" setup>
import OfficePreview from "../officereview.vue";
const visible = ref(false)
const fileUrl = ref("");
function open(url: string) {
    visible.value = true
    fileUrl.value = url
}
function close() {
    visible.value = false
}
defineExpose({
    open,
    close
})
</script>

<style scoped></style>