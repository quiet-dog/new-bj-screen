import http from "../../utils/http";

export const getThreshold = () => {
  return http.get("/manage/threshold", {
    params: {
      pageNum: 1,
      pageSize: 200
    }
  })
}