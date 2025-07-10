import { ref } from "vue";

export function useTwoHook() {
    const list = [
        {

            equipmentId: 4,
            equipment: {},
            value: 0,
            thresholds: [],
            type: "设备档案",
            showPopover: false,
        },
        {

            equipmentId: 13,
            equipment: {},
            value: 0,
            thresholds: [],
            type: "设备档案",
            showPopover: false,
        },
        {
            value: 0,
            thresholds: [],
            equipmentId: 14,
            type: "设备档案",
            environmentId: 0,
            environment: {},
            showPopover: false,
        },
        {

            value: 0,
            thresholds: [],
            equipmentId: 15,
            type: "设备档案",
            environmentId: 0,
            environment: {},
            showPopover: false,
        },

    ]

    return {
        list
    }
}