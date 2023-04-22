<template>
    <div class="searchTop">
        <svg class="icon" aria-hidden="true" @click="$router.go(-1)">
            <use xlink:href="#icon-zuojiantou"></use>
        </svg>
        <!-- placeholder 属性添加的提示文字，只有输入内容时文字才会消失
        js 方式添加的提示文字，当光标定位到 input 输入框中时，提示文字就会消失 -->
        <!-- 注意：使用v-model后，表单控件显示的值只依赖所绑定的数据，不再关心初始化时的value值，对于在之间插入的值也会生效。 -->
        <input type="text" placeholder="陈奕迅" v-model="searchKey" @keydown.enter="enterKey">
    </div>
    <div class="searchHistory">
        <span class="searchSpan">历史</span>
        <span v-for="item in keyWordList" :key="item" class="spanKey" @click="addSearch(item)">{{ item }}</span>
        <svg class="icon" aria-hidden="true" @click="delHistory">
                <use xlink:href="#icon-shanchu"></use>
        </svg>
    </div>
    <div class="itemList">
        <div class="item" v-for="(item, i) in searchList" :key="i">
            <div class="itemLeft" @click="updateIndex(item)">
                <span class="leftSpan">{{ i + 1 }}</span>
                <div>
                    <p>{{ item.name }}</p>
                    <span v-for="(item1, index) in item.artists" :key="index">{{ index > 0 ? '/' + item1.name : '' + item1.name }}</span>
                    <span>{{ "--《" + item.album.name + "》" }}</span>
                </div>
            </div>
            <div class="itemRight">
                <svg class="icon bofang" aria-hidden="true" v-if="item.mv != 0">
                    <use xlink:href="#icon-shipin"></use>
                </svg>
                <svg class="icon liebiao" aria-hidden="true">
                    <use xlink:href="#icon-31liebiao"></use>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
import { getSearchMusic } from '@/request/api/home';
import { showToast } from 'vant';

export default{
    data(){
        return{
            searchKey:"",
            keyWordList:[],
            searchList:[],
        }
    },
    mounted(){
        // 解决起始状态下或点击输出后重新渲染页面时,localStorage中没有 'keyWordList' 的问题
        // this.keyWordList = JSON.parse(localStorage.getItem('keyWordList')) ? JSON.parse(localStorage.getItem('keyWordList')) : [];
        this.keyWordList = JSON.parse(localStorage.getItem('keyWordList')) || [];
        // onfocus 聚焦事件  onblur 失焦事件
       
    },
    methods:{
        enterKey:async function(){    
            // console.log("检查此时的searchKey",this.searchKey)
            if(this.searchKey !== ""){
                // push 方法是添加到数组的末尾  unshift 方法是添加到数组的起始
                this.keyWordList.unshift(this.searchKey);
                // 数组去重
                // ... 扩展运算符   Set ES6新方法   仅 new Set(this.keyWordList) 的情况是 Set对象   仅 ...new Set(this.keyWordList) 的情况是 参数序列
                this.keyWordList = [...new Set(this.keyWordList)];
                // 固定长度
                if(this.keyWordList.length > 10){
                    this.keyWordList.splice(this.keyWordList.length - 1)
                }
                // 存入当地存储器
                // console.log("检查当前的搜索历史数组---",this.keyWordList);
                localStorage.setItem("keyWordList",JSON.stringify(this.keyWordList));
                // 搜索请求
                let res = await getSearchMusic(this.searchKey);
                // console.log("检查搜索结果---",res);
                this.searchList = res.data.result.songs;
                console.log("检查搜索列表---",this.searchList);
            }else{
                showToast({
                    message: '搜索内容为空~',
                    position: 'top',
                });
            }
            this.searchKey = "";
        },
        delHistory:function(){
            localStorage.removeItem("keyWordList");
            this.keyWordList = [];
        },
        addSearch:function(item){
            this.searchKey = item
            this.enterKey()
        },
        updateIndex:function(item){
            // 重组数据
            item.al = item.album
            item.al.picUrl = item.album.artist.img1v1Url
            item.ar = item.artists
            item.ar.name = item.artists.name
            // 未进行解构的情况下,可以通过VUEX中的 this.$store.commit() 的方式来进行提交数据
            this.$store.commit("pushPlayList",item)
            this.$store.commit("updatePlayListIndex",this.$store.state.playList.length - 1)
        },
    },
}
</script>
<style lang="less" scoped>
.searchTop {
    width: 100%;
    height: 1rem;
    padding: 0 .2rem;
    display: flex;
    align-items: center;
    input {
        margin-left: .4rem;
        border: none;
        border-bottom: 1px solid #999;
        width: 90%;
        padding: .1rem;
    }
}
.searchHistory {
    width: 100%;
    padding: .2rem;
    position: relative;
    .searchSpan {
        // font-size: .4rem;
        font-weight: 700;
    }
    .spanKey {
        background-color: #dacfcf;
        padding: .1rem .2rem;
        border-radius: 20px;
        margin: .1rem .2rem;
        display: inline-block;
    }
    .icon {
        width: .4rem;
        height: .4rem;
        position: absolute;
        right: .2rem;
    }
}
.itemList {
    width: 100%;
    padding: .2rem;
    .item {
      width: 100%;
      height: 1.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .itemLeft {
        width: 85%;
        height: 100%;
        display: flex;
        align-items: center;
        .leftSpan {
          display: inline-block;
          width: 0.2rem;
          text-align: center;
        }
        div {
          p {
            width: 4.54rem;
            height: .4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 700;
          }
          span{
            font-weight: 400;
            font-size: .24rem;
            color: #999;
          }
          margin-left: 0.3rem;
        }
      }
      .itemRight{
        width: 20%;
        height: 100%;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        position: relative;
        .icon{
          fill: #999;
        }
         .bofang{
            position: absolute;
            left: 0;
          }
         .liebiao{
            position: absolute;
            right: 0;
          }
      }
    }
}
</style>