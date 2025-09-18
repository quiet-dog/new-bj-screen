<template>
  <!-- <component
    v-if="!isMediaFile && isSupported"
    :is="previewComponent"
    :src="src"
    :source="src"
    :style="{ height: '100vh' }"
    @rendered="renderedHandler"
    @error="errorHandler"
  /> -->
  <iframe :src="src" height="800px" width="100%" />
  <!-- <div
    v-else-if="isMediaFile"
    :style="{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }"
  >
    <img
      v-if="isImage"
      :src="src"
      style="max-width: 100%; max-height: 100%; object-fit: contain"
    />
    <video
      v-if="isVideo"
      :src="src"
      controls
      style="max-width: 100%; max-height: 100%"
    />
  </div>
  <div
    v-else
    :style="{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }"
  >
    <i class="el-icon-warning" style="font-size: 48px; color: #e6a23c" />
    <p style="margin-top: 16px">不支持该文件类型的预览</p>
  </div> -->
</template>

<script>
// import VueOfficeDocx from "@vue-office/docx";
// import VueOfficeExcel from "@vue-office/excel";
// import VuePdfEmbed from "vue-pdf-embed";
// import VueOfficePptx from "@vue-office/pptx";
// import "@vue-office/docx/lib/index.css";
// import "@vue-office/excel/lib/index.css";
// import "@vue-office/pdf/lib/index.css";
import axios from "axios";

export default {
  components: {
    // VueOfficeDocx,
    // VueOfficeExcel,
    // VuePdfEmbed,
    // VueOfficePptx
  },
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    isImage() {
      if (!this.fileUrl) return false;
      const ext = this.fileUrl.split(".").pop().toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
    },
    isVideo() {
      if (!this.fileUrl) return false;
      const ext = this.fileUrl.split(".").pop().toLowerCase();
      return ["mp4", "webm", "ogg"].includes(ext);
    },
    isMediaFile() {
      return this.isImage || this.isVideo;
    },
    previewComponent() {
      if (!this.fileUrl) {
        return null;
      }
      const ext = this.fileUrl.split(".").pop().toLowerCase();
      switch (ext) {
        case "docx":
          return "vue-office-docx";
        case "xlsx":
          return "vue-office-excel";
        case "pdf":
          return "vue-pdf-embed";
        case "pptx":
          return "vue-office-pptx";
        default:
          return "vue-office-docx";
      }
    },
    isSupported() {
      if (!this.fileUrl) return false;
      const ext = this.fileUrl.split(".").pop().toLowerCase();
      return ["docx", "xlsx", "pdf", "pptx"].includes(ext);
    }
  },
  data() {
    return {
      src: ""
    };
  },
  watch: {
    fileUrl: {
      immediate: true,
      handler(newUrl) {
        // var encodedUrl = encodeURIComponent(`http://${location.hostname}:9000/biology` + newUrl);
        // var encodedUrl = encodeURIComponent(`${location.origin}/minioapi/biology` + newUrl);
        // var encodedUrl = encodeURIComponent(`http://${location.hostname}:9000/biology`+newUrl);
        var encodedUrl = encodeURIComponent(`${location.origin}/minioapi/biology` + newUrl);
        console.error("fileUrl", newUrl);
        //var encodedUrl = encodeURIComponent(`http://192.168.0.11:9000/biology` + newUrl);
        // 然后使用 btoa 对编码后的 URL 进行 Base64 编码
        var base64Url = btoa(encodedUrl);
        // this.src = location.origin + "/kkfile/onlinePreview?url=" + encodeURIComponent(base64Url);
        // this.src = "http://"+location.hostname+":8012" + "/onlinePreview?url=" + encodeURIComponent(base64Url);
        this.src = location.origin + "/kkfile/onlinePreview?url=" + encodeURIComponent(base64Url);
        console.error("src", this.src);
      }
    }
  },
  methods: {
    loadFile() {
      // this.fileUrl
      // axios
      //   .get(`${location.origin}/minioapi/biology/${this.fileUrl}`, {
      //     params: {
      //       fileName: this.fileUrl
      //     },
      //     headers: {
      //       Authorization: `Bearer ${getToken().token}`,
      //       Accept: "*/*"
      //     },
      //     responseType: "arraybuffer",
      //     transformResponse: [
      //       data => {
      //         return new Blob([data], {
      //           type: this.fileUrl.endsWith(".pdf")
      //             ? "application/pdf"
      //             : "application/octet-stream"
      //         });
      //       }
      //     ]
      //   })
      //   .then(response => {
      //     this.src = window.URL.createObjectURL(response.data);
      //   })
      //   .catch(error => {
      //     console.error("文件预览加载失败:", error);
      //     this.errorHandler();
      //   });
    },
    renderedHandler() {
      console.log("渲染完成");
    },
    errorHandler() {
      console.log("渲染失败");
    }
  }
};
</script>
