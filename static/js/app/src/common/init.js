/**
 * Created by lingchenxuan on 2017/2/21.
 */
import LeftMenu from '../common/leftMenu';
import TopMenu from '../common/topMenu';
import Header from '../common/header';
import auth from '../common/auth';
import util from '../common/util';
import modal from '../common/modal';

export default function (option) {
    const defaultOption = {
        header: true, // 顶部导航栏
        leftMenu: true, // 网络设置左侧菜单
        topMenu: false, // 业务设置顶部菜单
        id: undefined, // 模块id
        noAuthUrl: undefined,
        mainContainer: true,
        centerModals: true
    };
    option = { ...defaultOption, ...option};

    option.id && auth.checkAuth(option.id, option.noAuthUrl);

    $(function() {
        util.mainContainer();
        option.header && Header.render();
        option.leftMenu && LeftMenu.render();
        option.topMenu && TopMenu.render();
        modal.modalInit();
        option.centerModals && modal.centerModals();
        const events = {
            "resize window": util.mainContainer,
            "show.bs.modal body .modal": modal.centerModals,
            "click body .btn-cancel": function(){var that = this; modal.clearModal(that);}
        };

        util.bindDomAction(events);
    })


}