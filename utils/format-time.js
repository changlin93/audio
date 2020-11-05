/**
 * @param date时间戳
 * 返回格式 YY-MM-DD hh-mm-ss
 */
const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

/**
 * @param data秒数
 * 返回格式 hh-mm-ss
 */
const formatTime1 = (data, connect = ':') => {
    const hour = parseInt(data / 3600);
    const minute = parseInt(data / 60)
    const second = parseInt(data % 60);
    return hour ? [hour, minute, second].map(formatNumber).join(connect) : [minute, second].map(formatNumber).join(connect);
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime,
    formatTime1
}