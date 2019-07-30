<template>
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
</template>
<script>
export default {
    data(){
        return {
            getAList: []
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
                    sceneId: 2
                }
            }).then(res=>{
               if(res.data.retCode == '0000'){
                    window.open(item.appSignupLink,"_blank");
               }
            })
        },
    }
}
</script>

<style  lang="scss" scoped>

.good-list{
    width: 100%;
    overflow: hidden;
}
.good-item{
    width: 6.9rem;
    margin: 0 auto;
    overflow: hidden;
    border-bottom: 1px solid #cdcdcd;
    margin-top: .4rem;
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

.item-btn{
    width: 1.76rem;
    height: .6rem;
    text-align: center;
    line-height: .6rem;
    background: url('./../../static/img/anniu2@2x.png') no-repeat;
    background-size: 1.76rem .6rem;
    float: right;
    font-size: .28rem;
    margin-top: .45rem;
    color: #fff;
}
</style>

