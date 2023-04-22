// axios请求管理
import axios from "axios";

let service = axios.create({
    baseURL:"http://localhost:3000/",
    timeout:3000,
    withCredentials: true,   // 是否允许请求携带Cookie
})
export default service