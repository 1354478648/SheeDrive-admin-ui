import request from '@/utils/request'

export const dealerLoginService = (loginData) => {
    return request.post('/dealer/login', loginData);
}