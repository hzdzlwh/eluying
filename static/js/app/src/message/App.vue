<template>
    <div class="message">
        <div class="message-left">
            <h4>
                <img src="/static/image/message-icon.png">
                <span>消息中心</span>
            </h4>
            <ul>
                <li>
                    <div :class="{active: viewType === 'orderMessage'}">
                        <img src="/static/image/order-message-icon.png">
                        <span @click="toggleView('orderMessage')">订单消息(<span>6</span>)</span>
                    </div>
                </li>
                <li>
                    <div :class="{active: viewType === 'systemMessage'}">
                        <img src="/static/image/system-message-icon.png">
                        <span @click="toggleView('systemMessage')">系统消息(<span>8</span>)</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="message-right">
            <messageList :visibleType="viewType"></messageList>
        </div>
        <OrderSystem></OrderSystem>
        <button @click="notify">xx</button>
    </div>
</template>

<script>
import messageList from './components/messageList';
import { OrderSystem } from '../common/orderSystem';
export default{
    data() {
        return {
            viewType: 'orderMessage'
        };
    },
    created() {
        this.connectWebSocket();
        this.unAllowNotify();
    },
    components: {
        messageList,
        OrderSystem
    },
    methods: {
        notify() {
            if (Notification.permission === 'granted') {
                this.popNotice();
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                });
            }
        },
        popNotice() {
            if (Notification.permission === 'granted') {
                const notification = new Notification('hi', {
                    body: 'hello'
                });
                notification.onclick = function() {
                    console.log(11);
                };
            }
        },
        unAllowNotify() {
            if (!window.Notification) {
                alert('浏览器不支持消息提醒');
            }
        },
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
                    padding: 8px 0;
                    cursor: pointer;
                    > div{
                        width: 123px;
                        height: 32px;
                        line-height: 32px;
                        margin: auto;
                        text-align: center;
                        &.active{
                            background:#f6f8f9;
                            border:1px solid #dddddd;
                            border-radius:2px;
                        }
                    }
                    span{
                        span{
                            color: #f24949;
                        }
                    }
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
