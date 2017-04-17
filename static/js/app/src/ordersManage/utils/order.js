/**
 * Created by lingchenxuan on 17-4-17.
 */
import { ORDER_TYPE } from '../constant';
export function getOrderId(order) {
    let orderId;
    if (order.orderType === ORDER_TYPE.ENTERTAINMENT) {
        orderId = order.enterOrderId;
    }

    if (order.orderType === ORDER_TYPE.COMBINATION) {
        orderId = order.orderId;
    }

    if (order.orderType === ORDER_TYPE.ACCOMMODATION) {
        orderId = order.roomOrderId;
    }

    if (order.orderType === ORDER_TYPE.RETAIL) {
        orderId = order.goodsOrderId;
    }

    if (order.orderType === ORDER_TYPE.CATERING) {
        orderId = order.caterOrderId;
    }

    return orderId;
}
