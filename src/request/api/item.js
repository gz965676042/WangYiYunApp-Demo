// 歌单详情页获取数据
import service from "..";

// 获取歌单信息
export function getMusicItemList(data){
    return service({
        method:"GET",
        url:`/playlist/detail?id=${data}`
    })
}
// 获取歌单所有歌曲
export function getItemList(data,value){
    return service({
        method:"GET",
        url:`/playlist/track/all?id=${data}&limit=${value}&offset=0`
    })
} 
// 获取歌曲歌词
export function getMusicLyric(data){
    return service({
        method:"GET",
        url:`/lyric?id=${data}`
    })
} 