/*
 * @Description: 音乐状态模块
 */

export default {
  namespaced: true,
  state: {
    playList: [
      /*
      {
        artist: 'DJ Snake', // 音频艺术家

        cover:
          'http://p1.music.126.net/6xZYIOppwZT5MpOgrkcfBw==/109951165777599963.jpg', // 音频封面

        id: '1824769938', // 音频 id

        lrc:
          "[00:00.000] 作词 : DJ Snake/Selena Gomez/Kat Dahlia/Marty Maro/K Sotomayor/Kris Floyd\n[00:01.000] 作曲 : DJ Snake/Selena Gomez/Kat Dahlia/Marty Maro/K Sotomayor/Kris Floyd\n[00:07.961] Nadie tiene que decírmelo\n[00:12.312] Hablas con otro que no soy yo\n[00:16.522] Y te confieso queriéndolo\n[00:21.003] Baby, me dan ganas de tenerte (De tenerte)\n[00:25.196] Just a little crush\n[00:29.037] Got me over here thinkin' that somebody else cares, somebody else cares\n[00:34.500] I know we got trust\n[00:37.479] But you be gettin' me thinkin' that somebody else cares, somebody else care\n[00:41.888] Tú quiere' a mis celos\n[00:46.409] All this time and we still got that selfish love\n[00:50.950] You like making me jealous (I like making you jealous)\n[00:54.983] Es un juego que queda entre tú y yo, tú yo, tú y yo\n[01:01.957] Yeah, yeah\n[01:06.707] You know that we got trust\n[01:10.668] Yeah\n[01:16.511] Yeah\n[01:17.219] Cómo me miran es obvio\n[01:21.354] Te marca a tu teritorio\n[01:25.507] Este secreto entre lo' dos\n[01:29.876] Sé que te dan ganas de tenerme\n[01:34.574] I get just a little rush\n[01:37.757] When you're over there thinkin' that somebody else cares, somebody else care (Ooh, ooh)\n[01:43.533] You know we got trust\n[01:46.733] But then again you thinkin' that somebody else cares, somebody else care\n[01:51.336] Me gustaba de celos\n[01:55.310] All this time and we still got that selfish love\n[01:59.660] I like making me jealous (I like making you jealous)\n[02:04.024] Es un juego que queda entre tú y yo, tú yo, tú y yo\n[02:11.183] Yeah, yeah\n[02:16.212] You know that we got trust\n[02:20.123] Yeah\n[02:24.310] Yeah\n[02:25.942] DJ Snake\n[02:26.700] Eh\n[02:31.225] Selena Gomez\n", // lrc 歌词

        name: 'Selfish Love', // 音频名称

        url:
          'http://m701.music.126.net/20210309142805/3e7fa797a4d3d5347680438748fcaeaf/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/7739377962/cfc3/b9c9/e6f7/006bb6b809978a749511087ae44bb6ec.mp3', // 音频播放地址
      },
      */
    ],
    // playList结构

    currentTime: 0, // 音频播放时间
    currentIndex: 0, //当前歌曲下标值
  },
  getters: {
    // 获取音乐列表状态
    getPlayList(state) {
      return state.playList
    },
    // 获取音乐列表歌曲总数量
    getNum(state) {
      let totalNum = 0
      for (let i = 0; i < state.playList.length; i++) {
        const temp = state.playList[i]
        totalNum += temp.num
      }
      return totalNum
    },
  },
  // 修改state方法,用法类似组件的methods
  mutations: {
    // 设置音乐列表状态
    setPlayList(state, data) {
      state.playList = data
    },
    // 添加音乐1
    unshiftPlayList(state, payload) {
      state.playList.unshift(payload)
    },
    // 添加音乐2
    pushPlayList(state, payload) {
      state.playList.push(payload)
    },
    // 删除音乐
    deletePlayList(state, id) {
      for (let i = 0; i < state.playList.length; i++) {
        const temp = state.playList[i]
        if (temp.id == id) {
          state.playList.splice(i, 1)
        }
      }
    },
    // 更新列表
    upLoadPlayList(state) {
      state.playList = state.playList.splice(0, -1)
    },
    // 修改currentTime
    changeCurrentTime(state, time) {
      state.currentTime = time
    },
  },
  actions: {
    setPlayList({ commit }, data) {
      commit('setPlayList', data)
    },
    unshiftPlayList({ commit }, data) {
      commit('unshiftPlayList', data)
    },
    pushPlayList({ commit }, data) {
      commit('pushPlayList', data)
    },
    deletePlayList({ commit }, data) {
      commit('deletePlayList', data)
    },
    upLoadPlayList({ commit }, data) {
      commit('upLoadPlayList', data)
    },
    changeCurrentTime({ commit }, data) {
      commit('changeCurrentTime', data)
    },
  },
}
