#订单来了主站!

## 模块

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
        // do something
    });
http.post(url, data, config)
    .then(res => {
        // do something
    });
```