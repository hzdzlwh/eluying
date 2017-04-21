require('cookie');
import Raven from 'raven-js';
import modal from './modal';
import ENDPOINT from './ENDPOINT';
import axios from 'axios';
import qs from 'qs';
const md5 = require('md5');

const spin = new modal.Spin();
const host = process.env.NODE_ENV === 'production' ? '/ws' : (process.env.serverUrl + '/ws');
axios.defaults.baseURL = host;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.response.use(function(response) {
    spin.removePending();
    return response;
}, function(error) {
    spin.removePending();
    Raven.captureMessage('ajax请求失败', {
        extra: {
            error
        }
    });
    return Promise.reject(error);
});

const http = {
    getUrl(path) {
        return host + (ENDPOINT[path] || path);
    },
    request(method, path, data, config) {
        const defaultConfig = {
            notify: true // 错误提示
        };
        config = Object.assign(defaultConfig, config);
        if (!data) {
            data = {};
        }

        if (path !== 'loginUrl') {
            data = this.getDataWithToken(data);
        }

        if (method === 'get') {
            config.params = data;
        }

        if (method === 'post') {
            config.data = qs.stringify(data);
        }

        spin.addPending();

        const url = this.getUrl(path);
        return axios.request({
            method: method,
            url: url,
            ...config
        })
            .then(res => {
                if (res.data.code !== 1) {
                    if (config.notify && res.data.code !== 5) {
                        modal.alert(res.data.msg);
                    } else if (res.data.code === 5) {
                        window.localStorage.clear();
                        modal.alert('账号在别处登录。');
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 3000);
                    }

                    Raven.captureMessage('ajax请求错误', {
                        extra: {
                            data: data,
                            res: res,
                            url: url
                        }
                    });

                    Raven.captureBreadcrumb({
                        message: 'ajax上下文',
                        category: 'ajax',
                        data: {
                            data: data,
                            res: res,
                            url: url
                        }
                    });

                    return Promise.reject(res.data);
                }

                return res.data;
            });
    },
    ajaxWithToken: function(method, path, data, callback, errorCallback, asy, baseUrl) {
        if (!data) {
            data = {};
        }

        if (path !== 'loginUrl') {
            data = this.getDataWithToken(data);
        }

        spin.addPending();

        const url = baseUrl ? baseUrl + path : http.getUrl(path);
        return $.ajax({
            type: method,
            url: url,
            async: asy,
            data: data,
            dataFilter: function(res) {
                const result = JSON.parse(res);
                if (result.code !== 1) {
                    Raven.captureMessage('ajax error', {
                        extra: {
                            data: data,
                            res: result,
                            url: url
                        }
                    });
                }

                if (result.code === 5) {
                    window.localStorage.clear();
                    modal.alert('账号在别处登录。');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 3000);
                }

                Raven.captureBreadcrumb({
                    message: 'related ajax',
                    category: 'ajax',
                    data: {
                        data: data,
                        res: result,
                        url: url
                    }
                });
                return res;
            },
            success: callback,
            error: function(e) {
                Raven.captureMessage('ajax fail', {
                    extra: {
                        data: data,
                        e: e,
                        url: url
                    }
                });

                errorCallback && errorCallback(e);
            }
        })
        .always(() => {
            spin.removePending();
        });
    },
    get(path, data, config) {
        return this.request('get', path, data, config);
    },
    post(path, data, config) {
        return this.request('post', path, data, config);
    },
    getDataWithToken: function(data) {
        data.timestamp = (new Date()).valueOf();
        data.campId = data.campId || localStorage.getItem('campId');
        data.uid = localStorage.getItem('uid');
        data.terminal = 1;
        data.version = data.version || 18;
        data.kick = true;
        const array = [];
        for (const key in data) {
            array.push(data[key]);
        }

        array.push(localStorage.getItem('token'));
        array.sort();
        const str = array.join('');
        data.sign = md5(str);
        return data;
    },
    paramsToString: function(params) {
        const paramsArray = [];
        for (const name in params) {
            if (params.hasOwnProperty(name)) {
                let str = '';
                if (params[name] !== null && params[name] !== undefined) {
                    str = JSON.stringify(params[name]);
                }
                if (str.substring(0, 1) === '\"' && str.substring(str.length - 1) === '\"') {
                    str = str.substring(1, str.length - 1);
                }

                paramsArray.push(`${name}=${str}`);
            }
        }

        return paramsArray.join('&');
    }
};
module.exports = http;
export default http;
