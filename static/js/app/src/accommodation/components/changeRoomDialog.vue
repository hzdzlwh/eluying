<template>
    <div>
        <div class="modal fade" id="changeRoomDialog" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="item-modal-header">
                        <h4>换房</h4>
                    </div>
                    <div class="item-modal-body">
                        <p>确定要换房吗？</p>
                        <slot></slot>
                    </div>
                    <div class="item-modal-footer">
                       <button class="dd-btn dd-btn-primary" @click="confirmChangeRoomDialog">确定</button><button class="dd-btn dd-btn-ghost" @click="outerRest">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../../common/http';
    import bus from '../../common/eventBus';
    export default {
        props: {
            clearAllSelectedProps: Function,
            changePriceProps: Boolean
        },
        data() {
            return {
                outerRoom: undefined,
                outerDate: undefined,
                outerUi: undefined,
                outerTargetOrder: undefined,
                outerStartX: undefined,
                outerStartY: undefined,
                outerTargetStartX: undefined,
                outerTargetStartY: undefined
            };
        },
        created() {
            this.bindDragRoom();
        },
        methods: {
            bindDragRoom() {
                const that = this;
                $(document).on('mouseover', '.calendar-glyph.draggable', function() {
                    const $element = $(this);
                    let startX = 0;
                    let startY = 0;
                    $element.data('init_draggable') || $element.data('init_draggable', true).draggable({
                        containment: '.calendar-status-table',
                        cursor: 'move',
                        addClasses: false,
                        zIndex: 1,
                        start: function(e, ui) {
                            if (!ui.helper.is('.draggable')) {
                                return false;
                            }
                            that.clearAllSelectedProps();
                            startX = Number(ui.helper.css('left').replace(/px/, ''));
                            startY = Number(ui.helper.css('top').replace(/px/, ''));
                            that.outerStartX = startX;
                            that.outerStartY = startY;
                        },
                        drag: function() {
                            that.$emit('changeDragState');
                        },
                        stop: function(e, ui) {
                            const box = $('.calendar-status');
                            const width = box.width() + 1;
                            const height = box.height() + 1;
                            const offsetLeft = Math.round(ui.position.left / width);
                            const offsetTop = Math.round(ui.position.top / height);
                            const originalOffsetLeft = Math.round(ui.originalPosition.left / width);
                            const originalOffsetTop = Math.round(ui.originalPosition.top / height);
                            const tr = $('.calendar-status-row').eq(offsetTop);
                            const td = tr.find('td').eq(offsetLeft);
                            const date = td.attr('date');
                            that.outerDate = date;
                            const room = td.attr('room');
                            that.outerRoom = room;
                            that.outerUi = ui;

                            const rest = function() {
                                ui.helper.css({
                                    top: startY + 'px',
                                    left: startX + 'px'
                                });
                                targetOrder && targetOrder.css({
                                    top: targetStartY + 'px',
                                    left: targetStartX + 'px'
                                });
                            };
                            if (offsetLeft === originalOffsetLeft && offsetTop === originalOffsetTop) {
                                rest();
                                return;
                            }
                            var targetOrder;
                            var targetStartX;
                            var targetStartY;
                            // 第一次先检验能否拖拽，可以的话预览，并提示确认框，不行的话重置
                            http.post('/room/dragChangeRoom', {
                                checkRoomOnly: true,
                                roomId: room,
                                startDate: date,
                                roomOrderId: ui.helper.attr('roomOrderId')
                            })
                                .then(res => {
                                    $('.calendar-glyph').each(function(index, el) {
                                        if ($(el).attr('date') === date && $(el).attr('room') === room) {
                                            targetOrder = $(el);
                                            that.outerTargetOrder = targetOrder;
                                        }
                                    });
                                    // 调换房间
                                    if (targetOrder) {
                                        targetStartX = Number(targetOrder.css('left').replace(/px/, ''));
                                        targetStartY = Number(targetOrder.css('top').replace(/px/, ''));
                                        that.outerTargetStartX = targetStartX;
                                        that.outerTargetStartY = targetStartY;
                                        targetOrder.css({
                                            top: startY + 'px',
                                            left: startX + 'px'
                                        });
                                    }
                                    // 修正位置
                                    ui.helper.css({
                                        top: offsetTop * height + 2 + 'px',
                                        left: offsetLeft * width + 2 + 'px'
                                    });
                                    $('#changeRoomDialog').modal('show');
                                    /* modal.confirm({ title: '换房', message: '确定要换房吗？' },
                                        function() {
                                            http.post('/room/dragChangeRoom', {
                                                checkRoomOnly: false,
                                                roomId: room,
                                                startDate: date,
                                                roomOrderId: ui.helper.attr('roomOrderId')
                                            })
                                                .then(res => {
                                                    bus.$emit('refreshView');
                                                })
                                                .catch(rest);
                                        },
                                        rest
                                    ); */
                                    /* $('#changeRoomDialog').modal('show');
                                    $('#changeRoomOk').click(function() {
                                        $('#changeRoomDialog').modal('hide');
                                        http.post('/room/dragChangeRoom', {
                                            checkRoomOnly: false,
                                            roomId: room,
                                            startDate: date,
                                            roomOrderId: ui.helper.attr('roomOrderId'),
                                            updatePrice: that.changePrice
                                        })
                                            .then(res => {
                                                bus.$emit('refreshView');
                                            })
                                            .catch(rest);
                                    });
                                    $('#changeRoomCancel').click(function() {
                                        rest();
                                        $('#changeRoomDialog').modal('hide');
                                    }); */
                                })
                                .catch(rest);
                        }
                    });
                });
            },
            confirmChangeRoomDialog() {
                $('#changeRoomDialog').modal('hide');
                http.post('/room/dragChangeRoom', {
                    checkRoomOnly: false,
                    roomId: this.outerRoom,
                    startDate: this.outerDate,
                    roomOrderId: this.outerUi.helper.attr('roomOrderId'),
                    updatePrice: this.changePriceProps
                })
                    .then(res => {
                        this.$emit('resetChangePrice');
                        bus.$emit('refreshView');
                    })
                    .catch(this.rest);
            },
            outerRest() {
                $('#changeRoomDialog').modal('hide');
                this.outerUi.helper.css({
                    top: this.outerStartY + 'px',
                    left: this.outerStartX + 'px'
                });
                this.outerTargetOrder && this.outerTargetOrder.css({
                    top: this.outerTargetStartY + 'px',
                    left: this.outerTargetStartX + 'px'
                });
                this.$emit('resetChangePrice');
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    #changeRoomDialog{
        .modal-dialog{
            width: 300px;
            .modal-content{
                border-top: 2px solid #178ce6;
                h4{
                    color: #178ce6;
                    font-size: 16px;
                    margin-bottom:23px;
                }
                .item-modal-body{
                    margin-bottom: 20px;
                    p{
                        margin-bottom: 16px;
                    }
                    label{
                        color: #999999;
                    }
                    
                }
                .item-modal-footer{
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
</style>

