import { http } from "@/utils/http"

export const getThreshold = () => {
  return http.request<ResponseData<void>>("get", "/manage/threshold", {
    params: {
      pageNum: 1,
      pageSize: 1000
    }
  })
}