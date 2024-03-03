import request from '@/utils/request'

// 获取验证码
export const SmsSendCode = (params) => {
    return request.post('/sms/send', params);
}