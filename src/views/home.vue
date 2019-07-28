<template>
    <div class="main">
        <div class="g-header">
            <div class="head-money">
                <h1>50000</h1>
                <p>最高可借（元）</p>
            </div>
            <div class="head-opt">
                <div class="opt-btn">立即提现</div>
                <div class="opt-btn">低息大额贷</div>
            </div>
        </div>
        <div class="g-show">
            <div class="show-item">
                <div class="item-logo"></div>
                <p>快速下款</p>
            </div>
            <div class="show-item">
                <div class="item-logo"></div>
                <p>超低利息</p>
            </div>
            <div class="show-item">
                <div class="item-logo"></div>
                <p>大额分期</p>
            </div>
            <div class="show-item">
                <div class="item-logo"></div>
                <p>精品推荐</p>
            </div>
        </div>
        <div class="g-goods">
            <div class="good-title">
                <h1>优选贷款</h1>
                <span>查看更多</span>
            </div>
            <div class="good-list" v-if="getAList.length>0">
                <div class="good-item" v-for="(item,i) in getAList" @click="goPage(item)">
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
        <div class="g-proxy">代理通道</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            inviteCode: '',
            sceneId: null,
            getAList: []
        }
    },
    created(){
        this.inviteCode = this.$route.query.inviteCode || 'KD868E';
        this.sceneId = Number(this.$route.query.sceneId) || 2;
        this.$http({
            method: 'GET',
            url: '/open/app/info/list',
            params: {
                inviteCode: this.inviteCode,
                sceneId: this.sceneId
            }
        }).then(res => {
            let data = res.data.retData;
            data.forEach(e => {
               e.appLabel = e.appLabel.split('，')
               this.getAList.push(e)
            });
        })
    },
    methods:{
        goPage(item){
            this.$http({
                method: 'POST',
                url: '/open/flow/out/save',
                data:{
                    appCode: item.appCode,
                    inviteCode: this.inviteCode,
                    username: item.username,
                    sceneId: this.sceneId
                }
            }).then(res=>{
                if(res.data.retCode == '0000'){
                    window.open(item.appSignupLink,"_blank");
               }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main{
    width: 100%;
    overflow: hidden;
}
.g-header{
    width: 6.9rem;
    height: 2.54rem;
    border: 2px solid #5877f6;
    box-sizing: border-box;
    margin: .4rem auto;
    h1{
        font-size: .48rem;
        color: #333;
        font-weight: 500;
        text-align: center;
        margin-top: .35rem;
    }
    p{
        font-size: .26rem;
        color: #333;
        text-align: center;
        margin-top: .1rem;
    }
    .head-opt{
        width: 100%;
        margin-top: .2rem;
        .opt-btn{
            width: 2.3rem;
            height: .56rem;
            line-height: .56rem;
            text-align: center;
            color: #fff;
            background-color: #5877f6;
            float: left;
            margin-left: .54rem;
            box-shadow: 0 4px 7px #bad9f0;
            font-size: .28rem;
            &:nth-last-of-type(1){
                float: right;
                margin-right: .54rem;
            }
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
            background-color: #5877f6;
            margin: 0 auto;
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
    .good-title{
        width: 6.9rem;
        margin: 0 auto;
        overflow: hidden;
        h1{
            float: left;
            font-size: .28rem;
            color: #333;
            line-height: .32rem;
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
        border-bottom: 1px solid #cdcdcd;
        margin-top: .7rem;
        &:nth-last-of-type(1){
            border-bottom: none;
        }
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
            width: .77rem;
            float: left;
        }
        h2{
            float: left;
            line-height: .77rem;
            margin-left: .16rem;
            font-size: .32rem;
            font-weight: 500;
            color: #333;
        }
        span{
            float: left;
            line-height: .77rem;
            margin-left: .16rem;
            font-size: .24rem;
            color: #d5931b;
        }
    }
    .item-info{
        width: 100%;
        overflow: hidden;
        font-size: .28rem;
        line-height: .4rem;
        .item-info-left{
            float: left;
            margin: .1rem .3rem .1rem 0;
        }
        .item-info-right{
            float: left;
             margin: .1rem 0;
        }
    }
}

.item-btn{
    width: 1.94rem;
    height: .72rem;
    text-align: center;
    line-height: .72rem;
    color: #fff;
    background-color: #5877f6;
    float: right;
    border-radius: .03rem;
    font-size: .28rem;
    margin-top: .45rem;
    box-shadow: 0 4px 7px #bad9f0;
}
.g-proxy{
    width: 6.9rem;
    height: .54rem;
    border: 1px solid #cdcdcd;
    border-radius: .03rem;
    color: #333;
    font-size: .28rem;
    text-align: center;
    line-height: .54rem;
    margin: .5rem auto .3rem;
   
}
</style>



