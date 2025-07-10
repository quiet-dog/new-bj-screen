import http from "../../utils/http";

//获取环境档案列表
export interface environmentalFilesListRes {
  pageNum: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: string;
}
export function environmentalFilesList(params: environmentalFilesListRes) {
  return http.get("/manage/environment", { params });
}

export function environmentalDetectionList(params: environmentalFilesListRes) {
  return http.get("/manage/detection", { params });
}

//数据大屏获取环境档案区域的历史报警数量
export function historyStatistics(params: {
  environmentId: number;
  dayType: string;
}) {
  return http.get("/manage/detection/environmentDay", { params });
}

//当前总功耗
export function powerByTypeStatistics(params: {
  des: string;
  dayType: string;
  type: string;
}) {
  return http.get("/manage/detection/powerByType", { params });
}

//数据大屏获取环境档案的历史报警数量
export function envrionmentStatistics(params: {
  description: string;
  dayType: string;
}) {
  return http.get("/manage/event/envrionment", { params });
}

//获取环境监测功率统计
export function powerStatic(params: {
  des: string;
  dayType: string;
  type: string;
}) {
  return http.get("/manage/detection/powerByTypeTotal", { params });
}

//区域环境指标
export function powerByAreaTotalStatic(params: {
  des: string;
  dayType: string;
  type: string;
}) {
  return http.get("/manage/detection/powerByAreaTotal", { params });
}


export function getZuiXinShuJuApi(params: {
  area: string,
  unitName: string
}) {
  return http.get("/manage/detection/getZuiXinShuJu", { params });
}

//区域报警数量统计
export function eventByAreaTotalStatic(params: {
  des: string;
  dayType: string;
  type: string;
}) {
  return http.get("/manage/event/getAreaStatisticsTotal", { params });
}


export const getFiveEnvironment = async () => {
  let list = [];
  const { data } = await http.get("/api/manage/event", {
    params: {
      pageSize: 10,
      pageNum: 1,
      orderDirection: "descending",
    },
  });
  if (data != null) {
    list = data.data.rows;
  }
  return list;
};

export const getFiveEmergencyEvent = async () => {
  let list = [];
  const { data } = await http.get("/api/manage/emergencyEvent", {
    params: {
      pageSize: 5,
      pageNum: 1,
      orderDirection: "descending",
    },
  });
  if (data != null) {
    list = data.data.rows;
  }
  return list;
};

export const getMontEventType = async () => {
  let list = [];
  const { data } = await http.get("/api/manage/event/getWeekStatistics", {
    params: {
      dayType: "year",
    },
  });
  if (data != null) {
    list = data.data;
  }
  return list;
};


export function getAreas() {
  return http.get("/manage/environment/areas",);
}


export function getAllGroup() {
  return http.get("/manage/environment/allGroup",);
}


export function getBuTongApi(data) {
  return http.post("/manage/detection/getBuTong", data);
}


