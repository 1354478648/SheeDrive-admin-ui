import request from '@/utils/request'

export const addressAddService = (params) => {
    return request.post(`/address/user/add`, params);
}