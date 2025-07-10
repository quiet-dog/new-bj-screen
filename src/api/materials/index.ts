import http from "../../utils/http";

//获取领用记录列表
export interface receiveListRes {
  materialName: string;
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function receiveList(params: receiveListRes) {
  return http.get("/manage/receive", { params });
}

//获取物料档案列表
export interface materialFilesListRes {
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function materialFilesList(params: materialFilesListRes) {
  return http.get("/manage/materials", { params });
}
//获取物料档案信息
export function materialFilesInfo(materialsId: number) {
  return http.get(`/manage/materials/${materialsId}`);
}

//获取物料库存统计
export interface getstatisticsRes {
  materialsId: number | null;
  dayType: string;
}
export function getstatistics(params: getstatisticsRes) {
  const { materialsId } = params;
  return http.get(`/manage/materials/stock/${materialsId}`, { params });
}

//获取领用统计
export interface receivestatisticsRes {
  materialsId: number | null;
  materialsName: string;
  startTime: string;
  endTime: string;
}
export function receivestatistics(params: receivestatisticsRes) {
  return http.get("/manage/receive/stock/", { params });
}

//用量类型分析
export function typeStatistics() {
  return http.get("/manage/receive/allType");
}

//类型分析
export function dosagetypeStatistics(params: { name: string }) {
  return http.get("/manage/receive/allTypeByName", { params });
}

export function allByReceiveExplain() {
  return http.get("/manage/receive/allByReceiveExplain");
}


export function materialFilesTypes() {
  return http.get("/manage/materials/types");
}
