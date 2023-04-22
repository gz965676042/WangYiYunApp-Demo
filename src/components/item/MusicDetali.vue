<template>
    <div class="mask"></div>
    <img :src="musicList.al.picUrl" alt="" class="bgimg" />
    <div class="detailTop">
        <div class="detailTopLeft">
            <svg class="icon liebiao" aria-hidden="true" @click="backHome">
                <use xlink:href="#icon-zuojiantou"></use>
            </svg>
            <div class="leftMarquee">
                <Vue3Marquee style="color: #fff;">{{ musicList.name }}</Vue3Marquee>
                <span v-for="(item,i) in musicList.ar" :key="item">{{ item.name }}</span>
                <svg class="icon liebiao" aria-hidden="true">
                    <use xlink:href="#icon-youjiantou1"></use>
                </svg>
            </div>
        </div>
        <div class="detailTopRight">
            <svg class="icon liebiao" aria-hidden="true">
                <use xlink:href="#icon-fenxiang"></use>
            </svg>
        </div>
    </div>
    <div class="detailContent" v-show="!isLyricShow">
        <img src="@/assets/needle-ab.png" alt="" class="img_needle" :class="{img_needle_active:!isbtnShow}"/>
        <img src="@/assets/cd.png" alt="" class="img_cd" />
        <img :src="musicList.al.picUrl" alt="" class="img_ar" @click="isLyricShow = !isLyricShow" :class="{img_ar_active:!isbtnShow,img_ar_paused:isbtnShow}"/>
    </div>
    <div class="musicLyric" ref="musicLyric" v-show="isLyricShow" @click="isLyricShow = !isLyricShow">
        <p v-for="item in lyric" :key="item" :class="{active:currentTime * 1000 >= item.time && currentTime * 1000 < item.pre,}">
            {{ item.lrc }}
        </p>    
    </div>
    <div class="detailFooter">
        <div class="footerTop">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-aixin"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-iconfontzhizuobiaozhun023146"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yinlechangpian"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-iconfontzhizuobiaozhun023110"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-liebiao-"></use>
            </svg>
        </div>
        <div class="footerContent">
            <!-- 双向绑定来解决进度条跟随当前播放时间的问题 -->
            <input type="range" class="range" min="0" :max="duration" v-model="currentTime" step="0.05">
        </div>
        <div class="footer">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xunhuan"></use>
            </svg>
            <svg class="icon" aria-hidden="true" @click="goPlay(-1)">
                <use xlink:href="#icon-shangyishoushangyige"></use>
            </svg>
            <svg class="iconbofang" aria-hidden="true" @click="play" v-if="isbtnShow">
                <use xlink:href="#icon-bofang1"></use>
            </svg>
            <svg class="iconbofang" aria-hidden="true" @click="play" v-else>
                <use xlink:href="#icon-zanting"></use>
            </svg>
            <svg class="icon" aria-hidden="true" @click="goPlay(1)">
                <use xlink:href="#icon-xiayigexiayishou"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zu"></use>
            </svg>
        </div>
    </div>
</template>
<script>
import { Vue3Marquee } from "vue3-marquee";
import "vue3-marquee/dist/style.css";
import { mapMutations, mapState } from "vuex";

export default{
    data(){
        return{
            isLyricShow:false
        }
    },
    computed:{
        ...mapState(["lyricList","currentTime","playListIndex","playList","duration"]),    // 解构数据
        lyric:function(){   // 歌词切割处理 正则表达式
            let arr;
            if(this.lyricList.lyric){
                arr = this.lyricList.lyric.split(/[(\r\n)\r\n]+/).map((item,i)=>{
                    let min = item.slice(1,3);   // slice 包头不包尾
                    let sec = item.slice(4,6);
                    let mill = item.slice(7,10);
                    let lrc = item.slice(11,item.length)
                    let time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 +  parseInt(mill);    // 转变以毫秒为单位,歌词时间以毫秒单位判定位置
                    // 处理毫秒出现两位的情况   当有非数字的字符转换数字时,其结果就会是NaN
                    if(isNaN(Number(mill))){
                        mill = item.slice(7,9);
                        lrc = item.slice(10,item.length)
                        time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
                    }
                    // console.log("查看歌词切割结果---分:",min,"秒:",sec,"毫秒:",Number(mill),"歌词:",lrc)
                    // 以对象形式返回出去,将各个处理结果当作对象的属性
                    return {min,sec,mill,lrc,time}
                })
                arr.forEach((item,i) => {
                    // 给每句歌词增加下一句歌词时间属性
                    if(i === arr.length-1 || isNaN(arr[i+1].time)){ // 判断当前歌词是否是最后一句
                        item.pre = 100000    // 如果item没有pre这个属性,则自动添加并赋值,若有则覆盖赋值
                    }else{
                        item.pre = arr[i + 1].time
                    }
                })
            }
            console.log("检查arr歌词数组---",arr)
            return arr
        }
    },
    mounted(){
        // console.log("确认播放页接受歌曲信息---", this.musicList)
        // console.log("检查获取到的歌词---", this.lyricList.lyric)
        this.addDuration()
    },
    props:['musicList','play','isbtnShow','addDuration'],
    methods:{
        backHome:function(){
            this.updateDetailShow()
            this.isLyricShow = false
        },
        goPlay:function(num){
            let index = this.playListIndex + num
            if(index < 0){
                index = this.playList.length - 1
            }else if(index == this.playList.length){
                index = 0
            }
            this.updatePlayListIndex(index)
        },
        ...mapMutations(['updateDetailShow','updatePlayListIndex'])   // 解构方法
    },
    watch:{
        currentTime:function(newValue){
            let p = document.querySelector("p.active")
            // console.log("检查 p.active",[p])    // [] 查看引用信息
            if(p){
                if(p.offsetTop > 300){
                // 如果突出样式的显示位置在 330 那么scrollTop的滚动距离就是 330-300=30
                this.$refs.musicLyric.scrollTop = p.offsetTop - 300
                }
            }
            if(newValue == this.duration){
                if(this.playListIndex === this.playListIndex - 1){
                    this.updatePlayListIndex(0)
                    this.play()
                }else{
                    this.updatePlayListIndex(this.playListIndex + 1)
                }
            }
            // console.log("检查歌词部分的引用信息",[this.$refs.musicLyric])
        }
    },
    components:{
        Vue3Marquee
    }
}
</script>
<style lang="less" scoped>
.mask {
    width: 100%;
    height: 100%;
    background-color: #131313;
    opacity: 0.5;
    position: absolute;
    z-index: -1;
}
.bgimg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  filter: blur(70px);
}
.detailTop {
  width: 100%;
  height: 1rem;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  align-items: center;
  fill: #fff;
  .detailTopLeft {
    display: flex;
    align-items: center;
    .leftMarquee {
      width: 3rem;
      height: 100%;
      margin-left: 0.4rem;
      span {
        color: #ddd;
      }
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        fill: #999;
      }
    }
  }
}
.detailContent {
    width: 100;
    height: 9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .img_needle {
        width: 2rem;
        height: 3rem;
        position: absolute;
        left: 46%;
        transform-origin: 0 0;  // 原点
        transform: rotate(-13deg);  // 旋转-10度
        transition: all 2s;
    }
    .img_needle_active {
        width: 2rem;
        height: 3rem;
        position: absolute;
        left: 46%;
        transform-origin: 0 0;  // 原点
        transform: rotate(0deg);  // 旋转-10度
        transition: all 2s;
    }
    .img_cd {
        width: 5rem;
        height: 5rem;
        position: absolute;
        bottom: 2.3rem;
        z-index: -1;
    }
    .img_ar {
        width: 3.3rem;
        height: 3.3rem;
        border-radius: 50%;
        position: absolute;
        bottom: 3.14rem;
        animation: rotate_ar 30s linear infinite;   // 设定动画 (名字 时间 速度 循环)
    }
    .img_ar_active {
        animation-play-state: running;
    }
    .img_ar_paused {
        animation-play-state: paused;
    }
    @keyframes rotate_ar {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
}
.musicLyric {
    width: 90%;
    height: 11rem;
    margin: 0 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: .2rem;
    overflow: scroll;
    // border: 1px solid black;
    p {
        color: #c0baba;
        margin-bottom: .4rem;
    }
    .active {
        color: white;
        font-size: .5rem;
    }

}
.detailFooter {
    width: 100%;
    height: 3rem;
    position: absolute;
    bottom: .2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .footerTop {
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon {
        width: .6rem;
        height: .6rem;
        fill: rgb(245, 234, 234);
        }
    }
    .range {
        width: 100%;
        height: .1rem;
    }
    .footer {
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon{
        width: .6rem;
        height: .6rem;
        fill: rgb(245, 234, 234);
        }
        .iconbofang {
            width: 1rem;
            height: 1rem;
            fill: rgb(245, 234, 234);
        }
    }
    
}
</style>