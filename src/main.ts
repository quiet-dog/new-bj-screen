import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "element-plus/dist/index.css";
import "./assets/font/font.scss";
// import { createPinia } from "pinia";
import { store } from "./store/index";
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import {
    IconifyIconOffline,
    IconifyIconOnline,
    FontIcon
} from "./components/ReIcon";

// import "./assets/scss/index.scss";
// import DataV, { setClassNamePrefix } from '@dataview/datav-vue3';

// const pinia = createPinia();

createApp(App)
    .use(ElementPlus, { locale: zhCn })
    .component("IconifyIconOffline", IconifyIconOffline)
    .component("IconifyIconOnline", IconifyIconOnline)
    .component("FontIcon", FontIcon)
    .use(store).use(router).mount("#app");

