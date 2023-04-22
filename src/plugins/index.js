// 插件管理
import { Swipe, SwipeItem, Button, Popup, Toast } from 'vant';
// 放入数组中
let plugins=[
    Swipe, SwipeItem, Button, Popup, Toast
] 
export default function getVant(app){
    plugins.forEach((item)=>{
        return app.use(item)
    })
}