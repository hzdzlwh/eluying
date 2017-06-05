/**
 * Created by lingchenxuan on 2017/2/21.
 */
require('core-js');
require('promise.prototype.finally').shim();

import LeftMenu from '../common/leftMenu';
import TopMenu from '../common/topMenu';
import Header from '../common/header';
import auth from '../common/auth';
import util from '../common/util';
import modal from '../common/modal';
import Raven from 'raven-js';

export default function (option) {
    const defaultOption = {
        header: true, // 顶部导航栏
        leftMenu: true, // 网络设置左侧菜单
        topMenu: false, // 业务设置顶部菜单
        id: undefined, // 模块id
        noAuthUrl: undefined,
        mainContainer: true,
        centerModals: true,
        clearModal: false
    };
    // 错误检测
    if (process.env.NODE_ENV === 'production') {
        Raven
            .config('https://f0d4f573999d49fea1d02f5ed205ba26@sentry.io/148237', {
                ignoreUrls: [/dingdandao\.com:\d+/]
            })
            .install();
        Raven.setUserContext({
            uid: localStorage.getItem('uid'),
            userName: localStorage.getItem('userName'),
            campName: localStorage.getItem('campName'),
            campId: localStorage.getItem('campId')
        });
        Raven.setTagsContext({
            userName: localStorage.getItem('userName'),
            campName: localStorage.getItem('campName')
        });
    }

    option = { ...defaultOption, ...option};

    option.id && auth.checkAuth(option.id, option.noAuthUrl);

    $(function() {
        util.mainContainer();
        option.header && Header.render();
        option.leftMenu && LeftMenu.render();
        option.topMenu && TopMenu.render(option.topMenu);
        modal.modalInit();
        // option.centerModals && modal.centerModals();
        const events = {
            "resize window": util.mainContainer,
            // "show.bs.modal body .modal": modal.centerModals,
        };

        if (option.clearModal) {
            events["click body .btn-cancel"] = function(){var that = this; modal.clearModal(that);}
        }

        util.bindDomAction(events);
    })


}