import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 评论列表查询
export const commentListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/comment/list${queryString}`);
}

// 评论删除
export const commentDeleteService = (id) => {
    return request.delete(`/comment/delete?id=${id}`);
}

// 经销商平均评分查询
export const dealerGetDealerAvgScoreService = (id) => {
    return request.get(`/comment/get/avg?dealerId=${id}`);
}