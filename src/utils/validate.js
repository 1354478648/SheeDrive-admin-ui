// 校验手机号码
export const checkPhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('手机号码格式错误'))
    }else {
        callback()
    }
}

// 校验身份证号
export const checkIdNumber = (rule, value, callback) => {
    if (!(/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}[\dX]$/.test(value))) {
        callback(new Error('身份证号码格式错误'))
    }else {
        callback()
    }
}