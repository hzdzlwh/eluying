<template>
    <div class="message-list">
        <h4>{{ visibleType === 'orderMessage'? '订单消息' : '系统消息'}}</h4>
        <div class="list-container">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#read" data-toggle="tab">已读</a>
                </li>
                <li>
                    <a href="#unread" data-toggle="tab">未读</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade in active" id="read">
                    
                </div>
                <div class="tab-pane fade in" id="unread">
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        visibleType: {
            type: String,
            default: 'orderMessage'
        }
    }
};
</script>

<style lang="scss" scoped>
    .message-list{
        padding: 23px;
        .list-container{
            margin-top: 22px;
            .nav{
                border-bottom: 1px solid #e6e6e6;
                li{
                    width: 46px;
                    a{
                        background: #fff;
                        color: #178ce6;
                    }
                    &.active{
                        border: 1px solid #e6e6e6;
                        border-bottom: 1px solid #fff;
                        a{
                            color: #666;
                        }
                    }
                }
            }
        }
    }
</style>
