<template>
    <div class="message">
        <div class="message-left">
            <h4>
                <img src="/static/image/message-icon.png">
                <span>消息中心</span>
            </h4>
            <ul>
                <li>
                    <span @click="toggleView('orderMessage')">订单消息</span>
                </li>
                <li>
                    <span @click="toggleView('systemMessage')">系统消息</span>
                </li>
            </ul>
        </div>
        <div class="message-right">
            <message-list :visibleType="viewType"></message-list>
            <counter></counter>
        </div>
    </div>
</template>

<script>
import messageList from './components/messageList';
import counter from '../common/components/counter';
export default{
    data() {
        return {
            viewType: ''
        };
    },
    created() {
        this.connectWebSocket();
    },
    components: {
        counter
    },
    methods: {
        toggleView(type) {
            this.viewType = type;
        },
        connectWebSocket() {
            const wsServer = 'wss://beta.dingdandao.com/ws/mainsite';
            this.webSocket = new WebSocket(wsServer);
            this.webSocket.onopen = this.wSonOpen;
            this.webSocket.onmessage = this.wSonMessage;
            this.webSocket.onclose = this.wSonClose;
            this.onerror = this.wSonError;
        },
        wSonOpen() {
            console.log('open');
            this.webSocket.send({ 'uid': 124 });
        },
        wSonMessage() {
            console.log('message');
        },
        wSonClose() {
            console.log('close');
        },
        wSonError() {
            console.log('error');
        },
        wSonSend() {
            this.webSocket.send();
        }
    }
};
</script>

<style lang="scss" scoped>
    .message{
        top: 68px;
        width: 1000px;
        margin: auto;
        position: relative;
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        .message-left{
            width: 171px;
            height: 164px;
            background: #fafafa;
            box-shadow: 0 0 4px 4px rgba(0,0,0,0.1);
            border-radius: 2px;
            color: #666666;
            > h4{
                height: 66px;
                line-height: 66px;
                text-align: center;
                padding: 0 7px;
                border-bottom: 1px solid #e6e6e6;
                margin: 0 7px;
                span{
                    font-size: 16px;
                }
            }
            > ul{
                li{
                    height: 49px;
                    line-height: 49px;
                    text-align: center;
                }
            }
        }
        .message-right{
            width: 805px;
            height: 629px;
            background: #fafafa;
            box-shadow: 0 0 4px 4px rgba(0,0,0,0.1);
            border-radius: 2px;
        }
    }
</style>
