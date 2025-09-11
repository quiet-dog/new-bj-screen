import { defineStore } from "pinia";
import { store } from "../";
// import { setType } from "./types";

export const useSettingStore = defineStore({
    id: "pure-setting",
    state: () => ({
        title: "",
        fixedHeader: true,
        hiddenSideBar: false,
    }),
    getters: {
        getTitle(state) {
            return state.title;
        },
        getFixedHeader(state) {
            return state.fixedHeader;
        },
        getHiddenSideBar(state) {
            return state.hiddenSideBar;
        }
    },
    actions: {
        CHANGE_SETTING({ key, value }) {
            if (Reflect.has(this, key)) {
                this[key] = value;
            }
        },
        changeSetting(data) {
            this.CHANGE_SETTING(data);
        }
    }
});

export function useSettingStoreHook() {
    return useSettingStore(store);
}
