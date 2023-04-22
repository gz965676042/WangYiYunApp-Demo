import { getPhoneLogin } from '@/request/api/home'
import { getMusicLyric } from '@/request/api/item'
import { createStore } from 'vuex'

export default createStore({
  state: {
    playList:[{
      //  播放列表默认值 
      al:{
        id: 6491,
        name: "U87",
        pic: 109951166497586940,
        picUrl: "https://p1.music.126.net/xuFy0k8O_xKuAqbbjC24Ig==/109951166497586944.jpg",
        pic_str: "109951166497586944",
      },
      ar:{
        0:{
          name: "陈奕迅",
        },
      },
      id: 66282,
      name: "浮夸",
    }],
    playListIndex:0,  // 默认下标为0
    isbtnShow:true, // 暂停按钮的显示
    detailShow:false, // 歌曲详情页的显示
    lyricList:{}, // 歌词
    currentTime:0,  // 当前时间
    duration:0, // 歌曲时长

    isLogin:false,  // 登录布尔值
    isFooterMusic:true, // 是否显示底部组件 
  },
  getters: {
  },
  mutations: {
    updateIsbtnShow:function(state,value){
      state.isbtnShow = value
    },
    updatePlayList:function(state,value){
      state.playList = value
      console.log("检查播放列表是否更新---", state.playList)
    },
    updatePlayListIndex:function(state,value){
      state.playListIndex = value
    },
    updateDetailShow:function(state){
      state.detailShow = !state.detailShow
    },
    updateLyricList:function(state,value){
      state.lyricList = value
    },
    updateCurrentTime:function(state,value){
      state.currentTime = value
      // console.log("检查歌曲播放时间---",state.currentTime)
    },
    updateDuration:function(state,value){
      state.duration = value
    },
    pushPlayList:function(state,value){
      state.playList.push(value)
    },
    updateIsLogin:function(state,value){
      state.isLogin = true
    },
  },
  actions: {  // 异步请求
    getLyric:async function(context,value){
      let res = await getMusicLyric(value)
      // console.log("检查歌词获取是否正常---", res)
      context.commit("updateLyricList", res.data.lrc)
    },
    getLogin:async function(context,value){
      let res = await getPhoneLogin(value)
      console.log("查看当前登录信息---",res);
    }
  },
  modules: {
  }
})
