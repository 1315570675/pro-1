<template>
    <div class="main">
        <div class="g-header">
            <div class="head-info">
                <img :src="info.appLogo" alt="">
                <p>{{info.appName}}</p>
            </div>
            <div style="width: 100%; overflow: hidden;margin-top: .5rem;">
                <div class="head-money">
                    <p>可贷额度</p>
                    <p>{{info.loanAmount>=10000?info.loanAmount/10000+'万':info.loanAmount}}-{{info.leastAmount>=10000?info.leastAmount/10000+'万':info.leastAmount+'元'}}</p>
                </div>
                <div class="head-opt">
                    <div class="opt-btn" @click="goMoney">立即提现</div>
                </div>

            </div>
            
        </div>
        <!-- <div class="g-show">
            <div class="show-item" @click="goTixian(3)">
                <div class="item-logo item-logo-1"></div>
                <p>快速下款</p>
            </div>
            <div class="show-item" @click="goTixian(4)">
                <div class="item-logo item-logo-2"></div>
                <p>超低利息</p>
            </div>
            <div class="show-item" @click="goTixian(5)">
                <div class="item-logo item-logo-3"></div>
                <p>大额分期</p>
            </div>
            <div class="show-item" @click="goTixian(6)">
                <div class="item-logo item-logo-4"></div>
                <p>精品推荐</p>
            </div>
        </div> -->
        <div class="g-goods">
            <div class="good-title">
                <h1>优选贷款</h1>
                <span @click="goMore">查看更多</span>
            </div>
            <div class="good-list" v-if="getAList.length>0">
                <div class="good-item" v-for="(item,i) in getAList" @click="goPage(item)" v-if="i<5">
                    <div class="item-left">
                        <div class="item-title">
                            <img :src="item.appLogo" alt="">
                            <h2>{{item.appName}}</h2>
                            <span v-for="(label,ind) in item.appLabel">{{label}}</span>
                        </div>
                        <div class="item-info">
                            <div class="item-info-left">
                                <p>{{item.loanAmount>=10000?item.loanAmount/10000+'万':item.loanAmount}}-{{item.leastAmount>=10000?item.leastAmount/10000+'万':item.leastAmount+'元'}}</p>
                                <p>额度范围（元）</p>
                            </div>
                            <div class="item-info-right">
                                <p>日利率：{{item.loanInterestRate}}%</p>
                                <p>贷款期限：{{item.lowTerm}}-{{item.highTerm}}月</p>
                            </div>
                        </div>
                    </div>
                    <div class="item-btn" @click.stop="goPage(item)">立即提现</div>
                </div>
            </div>
        </div>
        <div class="g-proxy" @click="showInput">代理通道</div>
    </div>
</template>
<script>
import {MessageBox,Toast} from 'mint-ui'
export default {
    data(){
        return {
            inviteCode: '',
            sceneId: null,
            getAList: [],
            isShow: false,
            info: 0
        }
    },
    created(){
        this.$http({
            method: 'GET',
            url: '/open/app/info/list',
            params: {
                inviteCode: this.inviteCode,
                sceneId: 2
            }
        }).then(res => {
            let data = res.data.retData;
            data.forEach(e => {
               e.appLabel = e.appLabel.split('，')
               this.getAList.push(e)
            });
        });
        this.$http({
            method: 'GET',
            url: '/open/app/info/list',
            params: {
                inviteCode: this.inviteCode,
                sceneId: 1
            }
        }).then(res => {
            this.info = res.data.retData[0];
        })
    },
    components:{MessageBox,Toast},
    methods:{
        goPage(item){
            this.$http({
                method: 'POST',
                url: '/open/flow/out/save',
                data:{
                    appCode: item.appCode,
                    inviteCode: this.inviteCode,
                    username: item.username,
                    sceneId: 2
                }
            }).then(res=>{
               if(res.data.retCode == '0000'){
                    window.location.href = item.appSignupLink
               }
            })
        },
        goTixian(i){
            this.isShow = false;
            this.$http({
                method: 'GET',
                url: '/open/app/info/list',
                params: {
                    inviteCode: this.inviteCode,
                    sceneId: i
                }
            }).then(res => {
                if(res.data.retCode == '00000002'){
                    Toast('邀请码错误');
                    this.inviteCode = ''
                    return
                }
                if(res.data.retData.length==0){
                    Toast('暂无数据');
                    return ;
                }
                if(i == 7){
                    this.$router.push({path: '/list',query:{sceneId: 7}});
                    return
                }
                let data = res.data.retData[0];
                if(res.data.retCode == '0000' && data){
                    this.$http({
                        method: 'POST',
                        url: '/open/flow/out/save',
                        data:{
                            appCode: data.appCode,
                            inviteCode: this.inviteCode,
                            username: data.username,
                            sceneId: i
                        }
                    }).then(res=>{
                        if(res.data.retCode == '0000' && res.data.retData.length>0){
                            window.location.href = data.appSignupLink
                        }else{
                            // Toast('');
                        }
                    })
                }
            });
        },
        showInput(){
            // this.isShow = true
            MessageBox.prompt('请输入邀请码').then((val,aciton)=>{
                this.inviteCode = val.value;
                this.goTixian(7);
            }).catch((action)=>{
                
            })
        },
        goMore(){
            this.$router.push({path:'/list',query:{sceneId: 2}})
        },
        goMoney(){
            location.href = this.info.appSignupLink
            // window.open(this.info.appSignupLink,"_blank");
        }
    }
}
</script>

<style lang="scss" scoped>

.dialog{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.3);
    .dial-con{
        width: 4rem;
        min-height: 2rem;
        background-color: #fff;
        border-radius: .07rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        input{
            border: 1px solid #5877f6;
            width: 80%;
            height: .6rem;
            text-indent: 1em;
            display: block;
            margin: .4rem auto;
            font-size: .32rem;
        }
        .dial-title{
            width: 100%;
            border-bottom: 1px solid #ececec;
            height: .6rem;
            line-height: .6rem;
            text-indent: 1em;
        }
        .btn{
            width: 50%;
            height: .72rem;
            text-align: center;
            line-height: .72rem;
            color: #fff;
            background-color: #5877f6;
            border-radius: .03rem;
            font-size: .28rem;
            margin: 0 auto .3rem;
        }
    }
}
:-ms-input-placeholder{
    color: #5877f6;
    opacity: .5;
}
::placeholder{
    color: #5877f6;
    opacity: .5;
}
:-moz-placeholder{
    color: #5877f6;
    opacity: .5;
}
::-webkit-input-placeholder{
    color: #5877f6;
    opacity: .5;
}
.main{
    width: 100%;
    overflow: hidden;
}
.g-header{
    width: 6.9rem;
    height: 2.8rem;
    box-sizing: border-box;
    margin: .4rem auto;
    background: url('./../../static/img/bk1@2x.png') no-repeat;
    background-size: 6.9rem;
    overflow: hidden;
    h1{
        font-size: .4rem;
        color: #fff;
        font-weight: 500;
        margin-top: .28rem;
        text-indent: .5rem;
    }
    p{
        font-size: .26rem;
        color: #fff;
        margin-top: .1rem;
        text-indent: .5rem;
    }
    .head-opt{
       float: right;
        margin-top: .2rem;
        margin-right: .5rem;
        .opt-btn{
            width: 1.76rem;
            height: .56rem;
            line-height: .56rem;
            text-align: center;
            color: #FFB118;
            float: left;
            margin-left: .54rem;
            font-size: .28rem;
            background-color: #fff;
            border-radius: .28rem;
            margin-top: .2rem
        }
    }
    .head-info{
        width: 100%;
        overflow: hidden;
        margin-top: .36rem;
        img{
            width: .4rem;
            height: .4rem;
            margin-left: .5rem;
            float: left;
        }
        p{
            color: #fff;
            font-size: .28rem;
            float: left;
            text-indent: 0;
            margin-left: .12rem;
            line-height: .36rem;
            margin-top: 0;
            border-left: 1px solid #fff;
            text-indent: .1rem;
            margin-top: .02rem;
        }
    }
}

.head-money{
    float: left;
    p{
        &:nth-last-of-type(1){
            font-size: .4rem;
            margin-top: .18rem;
        }
    }
}


.g-show{
    width: 6.9rem;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .show-item{
        flex: 1;
        width: 1.04rem;
        text-align: center;
        .item-logo{
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            // background-color: #5877f6;
            margin: 0 auto;
        }
        .item-logo-1{
            background: url('./../../static/img/logo_20190729133851.png') no-repeat;
            background-size: .8rem;
        }
        .item-logo-2{
            background: url('./../../static/img/logo_20190729133818.png') no-repeat;
             background-size: .8rem;
        }
        .item-logo-3{
            background: url('./../../static/img/logo_20190729133902.png') no-repeat;
             background-size: .8rem;
        }
         .item-logo-4{
            background: url('./../../static/img/logo_20190729133910.png') no-repeat;
            background-size: .8rem;
        }
        p{
            margin-top: .2rem;
            font-size: .28rem;
        }
        
    }
}

.g-goods{
    width: 100%;
    overflow: hidden;
    margin-top: .6rem;
    margin-bottom: .92rem;
    .good-title{
        width: 6.9rem;
        margin: 0 auto;
        overflow: hidden;
        // border-bottom: 1px solid #E8E8E8;
        // padding-bottom: .24rem;
        h1{
            float: left;
            font-size: .32rem;
            color: #333;
            // line-height: .32rem;
        }
        span{
            float: right;
            width: 1.4rem;
            height: .32rem;
            background: url('./../../static/img/right.png') no-repeat right center;
            background-size: .32rem;
            color: #cdcdcd;
            line-height: .32rem;
            font-size: .24rem;
        }
    }
    .good-list{
        width: 100%;
        overflow: hidden;
    }
    .good-item{
        width: 6.9rem;
        margin: 0 auto;
        overflow: hidden;
        border-bottom: 1px solid #E8E8E8;
        margin-top: .4rem;
       
        .item-left{
            float: left;
            width: 4.88rem;
        }
        .item-right{
            float: left;
            width: 1.94rem;
        }
    }
    .item-title{
        width: 100%;
        overflow: hidden;
        img{
            width: .46rem;
            float: left;
        }
        h2{
            float: left;
            line-height: .46rem;
            margin-left: .16rem;
            font-size: .36rem;
            font-weight: 500;
            color: #4E5055;
        }
        span{
            float: left;
            line-height: .46rem;
            margin-left: .16rem;
            font-size: .24rem;
            color: #FFA300;
            background:rgba(255,196,91,0.09);
            padding: 0 .05rem;
        }
    }
    .item-info{
        width: 100%;
        overflow: hidden;
        font-size: .24rem;
        line-height: .4rem;
        margin-top: .3rem;
        color: #A8A9AB;
        .item-info-left{
            float: left;
            margin: .1rem .3rem .1rem 0;
            p{
                &:nth-of-type(1){
                    font-size: .4rem;
                    color: #FE4949;
                    font-size: .4rem;
                    margin-bottom: .1rem;
                }
            }
        }
        .item-info-right{
            float: left;
            margin: .1rem 0;
             p{
                &:nth-of-type(1){
                    
                    margin-bottom: .1rem;
                }
            }
        }
    }
}

.item-btn{
    width: 1.76rem;
    height: .6rem;
    text-align: center;
    line-height: .6rem;
    // padding: .16rem 0;
    background: url('./../../static/img/anniu2@2x.png') no-repeat center top;
    background-size: 1.76rem .6rem;
    float: right;
    font-size: .28rem;
    margin-top: .45rem;
    color: #fff;
    // background-color: red
}
.g-proxy{
    width: 7.5rem;
    height: .92rem;
    background: url('./../../static/img/RectangleCopy@2x.png') no-repeat;
    background-size: 7.5rem;
    color: #fff;
    font-size: .36rem;
    text-align: center;
    line-height: .92rem;
   position: fixed;
   bottom: 0;
   left: 0;
}
</style>



