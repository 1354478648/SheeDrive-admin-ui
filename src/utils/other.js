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