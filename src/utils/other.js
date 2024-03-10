// 敏感信息的遮挡
export function maskStr(str, visibleChars) {
    var startLength = Math.ceil((str.length - visibleChars) / 2);
    var masked = str.slice(0, startLength);
    for (var i = 0; i < visibleChars; i++) {
        masked += "*";
    }
    masked += str.slice(startLength + visibleChars);
    return masked;
}

// 权限控制
export function checkRole(info) {
    if (info.hasOwnProperty("describeInfo")) {
        return 1 // 经销商
    } else {
        return 0 // 管理员
    }
}

// 时间格式化
export function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始计数，需要加1，并且补零
    const day = date.getDate().toString().padStart(2, '0'); // 补零
    const hours = '00';
    const minutes = '00';
    const seconds = '00';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
