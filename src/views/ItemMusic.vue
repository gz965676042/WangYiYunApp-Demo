<template>
    <div>
        <ItemMusicTop :playlist="state.playlist"/>
        <ItemMusicList :itemList="state.itemList" :subscribedCount="state.playlist.subscribedCount"/>
    </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { getMusicItemList, getItemList } from '@/request/api/item'
import ItemMusicTop from '@/components/item/ItemMusicTop.vue'
import ItemMusicList from '@/components/item/ItemMusicList.vue'

export default{
    setup(){
        const state = reactive({
            playlist:{}, // 歌单页的详情数据
            itemList:{}, // 歌单歌曲
            trackCount:{},  // 歌单歌曲数目
        });
        onMounted(async ()=>{
            let id = useRoute().query.id;
            console.log("获取歌单id---", id);
            // 获取歌单详情 
            let res = await getMusicItemList(id);
            console.log("获取歌单详情---", res);
            state.playlist = res.data.playlist;
            let trackCount = res.data.playlist.trackCount;
            console.log("获取歌单歌曲数目---", trackCount);
            // 获取歌单歌曲 
            let result = await getItemList(id,trackCount);
            console.log("SONG---", result);
            state.itemList = result.data.songs;
            // 防止页面刷新,数据丢失,将数据保存到sessionStorage
            sessionStorage.setItem("itemDetail",JSON.stringify(state));
        });
        return { state };
    },
    components:{
        ItemMusicTop, ItemMusicList
    }
}
</script>