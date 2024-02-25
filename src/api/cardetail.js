import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 汽车信息列表查询
export const carDetailListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/cardetail/list${queryString}`);
}

// 汽车信息添加
export const carDetailAddService = (carDetailData) => {
    return request.post("/cardetail/add", carDetailData);
}


// 汽车信息删除
export const carDetailDeleteService = (id) => {
    return request.delete(`/cardetail/delete?id=${id}`);
}

// 汽车信息修改
export const carDetailUpdateService = (cardetailData) => {
    return request.put("/cardetail/update", cardetailData);    
}