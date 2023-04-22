<template>
  <div class="login">
    <div class="loginTop">欢迎登录</div>
    <div class="loginContent">
      <input type="text" name="phone" class="phone" v-model="phone" placeholder="请输入手机号码"/>
      <input type="password" name="passworld" class="passworld" v-model="password" placeholder="请输入密码"/>
      <button class="btn" @click="Login">登录</button>
    </div>
  </div>
</template>
<script>
import { showFailToast } from 'vant';
import 'vant/es/toast/style';

export default{
    data(){
        return{
            phone:'',
            password:'',
        }
    },
    methods:{
        Login:async function(){
            // dispatch 用于异步操作修改state, commit 用于同步操作来修改state
            let res = this.$store.dispatch('getLogin',{phone:this.phone,password:this.password})
            console.log("查看登录请求信息---",res);
            if(res.code === 200){
              // 如果返回的code等于2000,则说明登录成功,跳转到个人中心
              this.$store.commit('updateIsLogin',true)
              this.$router.push('/infoUser')
            }else if(res.code === -462){
              showFailToast('需要移动端安全验证!');
            }else if(res.code === 400){
              showFailToast('网络拥挤!请过段时间再试!');
            }else{
              showFailToast('手机号码或密码输入错误!');
              this.password = ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 13.34rem;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(248, 97, 97);
  .loginTop {
    margin-top: 1rem;
    font-size: 1rem;
    color: #fff;
  }
  .loginContent {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 2rem;
    .phone,
    .passworld {
      width: 5rem;
      height: 1rem;
      border: 0.02rem solid #999;
    }
    .btn {
      width: 2rem;
      height: 0.6rem;
    }
  }
}
</style>
