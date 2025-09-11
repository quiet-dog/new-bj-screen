<script lang='ts' setup>
import OfficePreview from "../officereview.vue";
const { files } = defineProps<{
    files: string[];
}>();

function getFile(path:string){
    // 文件名是  /upload/20250624110622_【前端工程师_洛阳】贾统林 4年_2aef8d360514437b965d44243085b449.doc
    // 按 _切割
    const parts = path.split('_');
    let fileName = ""
    parts.forEach((part, index) => {
        if(index > 1 && index <parts.length -1){
            fileName += part
        }
    });
    return fileName;
}

const previewVisibleUrl = ref<string>("");
const previewVisible = ref(false);
function clickFile(file: string) {
    previewVisibleUrl.value = file;
    previewVisible.value = true;
}

function closed(){
    previewVisibleUrl.value = "";
}
</script>

<template>
    <span>
        <el-link size="small" style="font-size: 12px;" type="primary" :underline="'always'" v-for="file in files" @click="clickFile(file)">
            {{ getFile(file) }}
        </el-link>

    <el-dialog v-model="previewVisible" @closed="closed">
         <OfficePreview :file-url="previewVisibleUrl" />
    </el-dialog>
    </span>

</template>

<style scoped></style>
