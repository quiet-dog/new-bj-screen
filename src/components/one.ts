import { ref } from "vue";

export function useOneHook() {
    const list = [
        {
            equipmentId: 1,
            equipment: {},
            value: 0,
            thresholds: [],
            type: "设备档案",
            showPopover: false,
        },
        {
            value: 0,
            thresholds: [],
            type: "设备档案",
            equipmentId: 2,
            equipment: {},
            showPopover: false,
        },
    ]

    return {
        list
    }
}