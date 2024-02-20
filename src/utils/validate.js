// 校验手机号码
export const checkPhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('手机号码格式错误'))
    }else {
        callback()
    }
}