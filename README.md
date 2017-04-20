#订单来了主站!

## 模块
使用es6模块
###导出
```js
export foo;
export default foo;
```
###导入
```js
import { foo } from './foo';
import foo from './foo';
````

## ajax
```js
import http from 'http';
http.get(url, data, config)
    .then(res => {
        // do something 不需判断code是否为1
    })
    .catch(res => {
        // do something 捕获code不为1的情况
    });
http.post(url, data, config)
    .then(res => {
        // do something
    });
```
```js
config: {
    notify: Boolean // 是否alert后端错误信息，默认为true
}
````
source: common\http.js

注意：

1.为了将this指向当前环境，使用箭头函数。

2.错误信息处理使用catch,不是必须。

3.数组作为参数时，需要先将数组序列化。