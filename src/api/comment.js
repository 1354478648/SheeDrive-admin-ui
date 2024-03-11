import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 评论列表查询
export const commentListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/comment/list${queryString}`);
}

// 管理员删除
export const commentDeleteService = (id) => {
    return request.delete(`/comment/delete?id=${id}`);
}