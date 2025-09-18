<script lang="ts" setup>
import { JSEncrypt } from "jsencrypt";
import Bg from "../../assets/my.png"
import * as CryptoJS from "crypto-js";
import Motion from "./utils/motion";
import TypeIt from "./ReTypeit";

const router = useRouter();

// RSA 公钥 对应的私钥放在后端项目的application-basic.yml文件下
const publicKey =
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCh6HkK+rCM37FAzCHVythTc6pxvr551K07CRhdX/NjCddHAuQMOd/57R5fiIwgVNEfCsD1cIyS6A8IWj4DtJLR2t29JehPpqiFSJ4hNtDcLNxNJiYRcCQvyMQeyQIPE5Ljc35c72YwDtQAsIJChsauyLrc+E6HC3gn1JDm18HNXwIDAQAB";

// 加密
function rsaEncrypt(txt): string {
    const encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(publicKey);
    // 对数据进行加密
    const encryptedValue = encryptor.encrypt(txt);

    // Check if the encrypted value is a boolean
    if (typeof encryptedValue === "boolean") {
        throw new Error("Encryption failed: Encrypted value returned a boolean");
    }

    return encryptedValue;
}


const form = ref({
    username: "",
    password: "",
})
const login = () => {
    axios.post("/api/login", {
        username: form.value.username,
        password: rsaEncrypt(form.value.password)
    }).then(res => {
        console.log("======", res)
        if (res.status === 200 && res.data.code === 0) {
            sessionStorage.setItem("token", res.data.data.token)
            router.push("/home")
        } else {
            ElMessage.error(res.data.msg)
        }
    })
}

function onkeypress({ code }: KeyboardEvent) {
    if (code === "Enter") {
        login();
    }
}
onMounted(() => {
    window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
    window.document.removeEventListener("keypress", onkeypress);
});

</script>
<template>
    <div class="main">
        <img :src="Bg" alt="bg" class="bg">
        <el-card class="card" title="登陆">


            <h2>你好！</h2>

            <Motion>
                <h2 class="outline-none">
                    <TypeIt :cursor="false" :speed="150" :values="['高风险安全风险车间<br/>智能化和实时动态监管平台']" />
                </h2>
            </Motion>
            <el-form>
                <el-form-item>
                    <el-input size="large" v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item>
                    <el-input @enter="" size="large" show-password v-model="form.password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<style scoped>
.main {
    width: 100vw;
    height: 100vh;
}

.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background-size: 100% 100%;
}

.card {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 400px;
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
