import http from "../../utils/http";

//获取工艺档案列表
export interface archiveListRes {
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function archiveList(params: archiveListRes) {
  return http.get("/manage/craft-archive", { params });
}

//获取工艺节点列表
export interface nodeListRes {
  nodeName: string;
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
  craftArchiveId: number
}
export function nodeList(params: nodeListRes) {
  return http.get("/manage/craft-node", { params });
}

//获取工艺流程图列表
export interface processListRes {
  craftArchiveId: number | null;
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function processList(params: processListRes) {
  return http.get("/manage/craft-process", { params });
}
