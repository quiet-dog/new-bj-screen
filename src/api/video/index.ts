import { id } from "element-plus/es/locales.mjs";
import http from "../../utils/http";

export interface ChannelListQuery {
    limit: number;
    skip: number;
    sort: string;
    // name: string
    filters: filter[];
}


export interface filter {
    field_name: string;
    opertator: string;
    value: string;
}

export interface ChannelQuery {
    sort?: string;
    name?: string;
    pageNum?: number;
    pageSize?: number;
}

export interface ChannaelListDTO {
    Total: number;
    List: ChannelDTO[];
}
export interface ChannelDTO {
    id: number;
    addtime: number;
    uptime: number;
    channelid: string;
    deviceid: string;
    memo: string;
    name: string;
    manufacturer: string;
    model: string;
    owner: string;
    civilcode: string;
    address: string;
    parental: number;
    safetyway: number;
    registerway: number;
    secrecy: number;
    status: string;
    active: number;
    uri: string;
    vf: string;
    height: number;
    width: number;
    fps: number;
    streamtype: string;
    url: string;
}

export interface StreamDTO {
    id: number;
    addtime: number;
    uptime: number;
    t: number;
    deviceid: string;
    channelid: string;
    streamtype: string;
    status: number;
    callid: string;
    stop: boolean;
    msg: string;
    cseqno: number;
    streamid: string;
    http: string;
    rtmp: string;
    rtsp: string;
    wsflv: string;
    stream: boolean;
}

export const getChannelListApi = (data: ChannelQuery) => {
    let query = {
        limit: data.pageSize,
        skip: Number.isNaN((data.pageNum! - 1) * data.pageSize!) ? 0 : (data.pageNum! - 1) * data.pageSize!,
        sort: data.sort,
    }
    if (data.name != "") {
        query["name"] = data.name
    }
    // return http.request<ResponseData<ChannaelListDTO>>("get", "/manage/wvp/channels", {
    //     params: query
    // });
    return http.get("/manage/wvp/channels", {
        params: query
    })
}

export const getStreamUrlApi = (channelid: string) => {
    // return http.request<ResponseData<StreamDTO>>("get", `/manage/wvp/streams`, {
    //     params: {
    //         id: channelid
    //     }
    // });
    return http.get("/manage/wvp/streams", {
        params: {
            id: channelid
        }
    })
}

export const getPersonnelListApi = () => {
    return http.get("/manage/personnel", {
        params: {
            pageSize: 1,
            pageNum: 1
        }
    });
}