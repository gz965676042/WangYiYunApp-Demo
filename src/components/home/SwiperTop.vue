<template>
    <div id="swiperTop">
        <van-swipe :autoplay="3000" lazy-render>
            <van-swipe-item v-for="image in state.images" :key="image">
                <img :src="image.pic" />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<!-- vue3写法 -->
<script>
import axios from 'axios'
import {getBanner} from '@/request/api/home.js'
import { reactive , onMounted } from 'vue'

export default {
    setup() {
        // reactive 响应式对象,动态地接收更新数据
        const state = reactive({  
            images:[
                'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
                'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
            ]
        
        });
        // 生命周期 mounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码
        // 抓取后台服务器数据
        onMounted(async ()=>{
            // axios.get('http://localhost:3000/banner?type=2').then((res)=>{
            //     console.log(res);
            //     state.images = res.data.banners
            // })
            // 当 async 函数执行到 await 的时候，会暂停整个async函数的执行进程并出让其控制权，只有当其等待的基于Promise 的异步操作被兑现或被拒绝之后才会恢复进程
            let res = await getBanner();        
            console.log(res);
            state.images = res.data.banners;
        })
        return { state };
    },
  };
</script>
<style lang="less" scoped>
#swiperTop{
    // 在上面手动添加一个id
    .van-swipe{
        width: 100%;
        height: 3rem;
        .van-swipe-item{
            padding: 0 0.2rem;
            img{
                width: 100%;
                height: 100%;
                border-radius: 0.2rem;
            }
        }
        .van-swipe__indicator--active{
            background-color: rgb(219, 130, 130);
        }
    }
}

</style>