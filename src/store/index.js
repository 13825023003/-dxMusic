import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//状态管理 ==> 公共数据库, 所有组件都可以访问
export default new Vuex.Store({
    state: {
        // 音频src
        audioSrc: '',
        // 音频播放时间
        currentTime: 0,
        // 歌词
        lyric: '',
        // 音频图片
        pic: '',
        // 歌手名字
        artists: '',
        // 歌曲名
        audioName: ''
    },
    // 修改state方法,用法类似组件的methods
    mutations: {
        // 修改audio
        changeSrc(state, src) {
            state.audioSrc = src
        },
        changeLyric(state, lyric) {
            state.lyric = lyric
        },
        changePic(state, pic) {
            state.pic = pic
        },
        changeArtists(state, artists) {
            state.artists = artists
        },
        changeName(state, name) {
            state.audioName = name
        },
        // 修改currentTime
        changeCurrentTime(state, time) {
            state.currentTime = time
        }
    }
})