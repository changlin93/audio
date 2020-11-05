// component/audio/index.js
import { formatTime1 } from '../../utils/format-time';
import { audioManager, errMsg } from '../../utils/audio';
const  innerAudio = wx.createInnerAudioContext();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        source: Object,
    },

    /**
     * 组件的初始数据
     */
    data: {
        isPlay: false,
        play: 'https://dushu.zazhipu.com/attachment/iconone/home/playing.png',
        pause: 'https://dushu.zazhipu.com/attachment/iconone/home/pause.png',
        time: [],
    },

    lifetimes: {
        attached() {
            const { source } = this.properties;
            if (source && source.audio) this._getAudioTime();
        },
        detached() { },

        ready() {
            audioManager.onPlay(() => {
                this.setData({ isPlay: true })
            })

            audioManager.onTimeUpdate(() => {
                const current = audioManager.currentTime;
                this.setData({
                    'time[0]': current,
                    'time[2]': formatTime1(current),
                })
            })

            audioManager.onEnded(() => {
                this.setData({ isPlay: true })
            })
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 播放暂停
        handleClickPlayOrPause() {
            const { isPlay } = this.data;
            const { source } = this.properties;
            if (audioManager.src !== source.audio) {
                audioManager.src = source.audio;
                audioManager.title = source.content;
            }
            console.log('播放 & 暂停', source.content, isPlay)
            isPlay ? audioManager.pause() : audioManager.play();
        },

        // 拖拽中
        handleDragChangeing(e) {
            const { value } = e.detail;
            this.setData({
                isDrag: true,
                'time[0]': value,
                'time[2]': formatTime1(value),
            })
        },

        // 拖拽完成
        handleDragChange(e) {
            const { value } = e.detail;
            audioManager.seek(value)
            this.setData({
                isDrag: false,
                'time[0]': value,
                'time[2]': formatTime1(value),
            })
        },

        // 获取音频时长
        _getAudioTime() {
            const { source } = this.properties;

            if (!source.audio) return;
            innerAudio.src = source.audio;

            const timer = setInterval(() => {
                const duration = innerAudio.duration;
                const current = innerAudio.currentTime;
                if (duration) {
                    this.setData({
                        'time[0]': current,
                        'time[1]': duration,
                        'time[2]': formatTime1(current),
                        'time[3]': formatTime1(duration),
                    });
                    clearInterval(timer);
                }
            }, 1000);
        },

        // 监听音频的执行状态
        _monitorSwitch() {
            audioManager.onPlay(() => {
                console.log('执行了onPlay')
                this._recoverStatus();
            })

            audioManager.onPause(() => {
                this._recoverStatus();
            })

            audioManager.onTimeUpdate(() => {
                const { source } = this.properties;
                const { isDrag, isPlay } = this.data;
                this._recoverStatus();
                if (!isDrag) {
                    const current = audioManager.currentTime;
                    this.setData({
                        'time[0]': current,
                        'time[2]': formatTime1(current),
                    });
                }
                console.log('当前播放音频的用户为：', source.userinfo.nickname)
                console.log('当前的播放时间为：', audioManager.currentTime)
            })

            audioManager.onEnded(() => {
                this._recoverStatus();
            })

            audioManager.onError((err) => {
                this.setData({ isPlay: false })
                errMsg(err);
            })
        },

        _recoverStatus() {
            if (audioManager.pause) {
                this.setData({
                    'isPlay': false
                })
                return;
            }
            const { userinfo } = this.properties.source;
            console.log('userinfo:', userinfo)
            this.setData({
                isPlay: audioManager.title == userinfo.nickname
            })
            console.log('audioManager.src == this.properties.source.audio:', audioManager.src == this.properties.source.audio)
        },
    }
})
