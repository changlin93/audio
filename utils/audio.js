const audioManager = wx.getBackgroundAudioManager();
const innerAudio = wx.createInnerAudioContext();

// 音频播放错误
const errMsg = data => {
    const { errCode } = ImageData;
    let title;
    switch (errCode) {
        case 10001:
            title = '系统错误';
            break;
        case 10002:
            title = '网络错误';
            break;
        case 10003:
            title = '文件错误';
            break;
        case 10004:
            title = '格式错误';
            break;
        default:
            title = '未知错误'
            break;
    }
    wx.showToast({
        icon: 'none',
        title,
    })
}

export {
    audioManager,
    innerAudio,
    errMsg
}