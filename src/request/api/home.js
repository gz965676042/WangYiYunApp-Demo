// 获取数据
import service from "..";

// 获取首页轮播图的数据
export function getBanner(){
    return service({
        method:"GET",
        url:"/banner?type=2",
    })
}
// 获取歌单
export function getMusicList(){
    return service({
        method:"GET",
        url:"/personalized?limit=10"
    })
}
// 搜索
export function getSearchMusic(data){
    return service({
        method:"GET",
        url:`/search?keywords=${data}&offset=2&limit=30`
    })
}
// dengl
export function getPhoneLogin(data){
    return service({
        method:"GET",
        url:`/login/cellphone?phone=${data.phone}&password=${data.password}`
    })
}