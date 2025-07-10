import http from "../../utils/http";

export function getstatistics(params: { dayType: string }) {
  return http.get("/manage/event/getWeekStatistics", { params });
}

export function getStaticEventHistory(params: { dayType: string }) {
  return http.get("/manage/event/eventHistory", { params });
}

//今日报警数量
export function geteventTotal() {
  return http.get("/manage/event/eventTotal");
}

export function getEventAtatistics(params: { type: string }) {
  return http.get("/manage/emergencyEvent/getStock", { params });
}

