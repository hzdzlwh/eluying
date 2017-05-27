/**
 * Created by lingchenxuan on 17-4-17.
 */
import { ORDER_TYPE } from '../../../ordersManage/constant';
export function getOrderId(order) {
    let orderId;
    // type字段代表订单真实type orderType在子订单里为-1
    if (order.type === ORDER_TYPE.ENTERTAINMENT) {
        orderId = order.enterOrderId;
    }

    if (order.type === ORDER_TYPE.COMBINATION) {
        orderId = order.orderId;
    }

    if (order.type === ORDER_TYPE.ACCOMMODATION) {
        orderId = order.roomOrderId;
    }

    if (order.type === ORDER_TYPE.RETAIL) {
        orderId = order.goodsOrderId;
    }

    if (order.type === ORDER_TYPE.CATERING) {
        orderId = order.caterOrderId;
    }

    return orderId;
}
