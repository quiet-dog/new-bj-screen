import http from "../../utils/http";
import { alarmEventsListRes } from "../incident";

//获取阈值设置列表
export interface thresholdListRes {
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function thresholdList(params: thresholdListRes) {
  return http.get("/manage/threshold", { params });
}

export function exportAlarmEvents(params: alarmEventsListRes) {
  return http.get(
    "/manage/event/excelDeviceName",
    { params, responseType: "blob" },

  );
}

export function thresholdDataList(params: thresholdListRes) {
  return http.get("/manage/equipment-data", { params });
}
