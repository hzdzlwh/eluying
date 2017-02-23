var leftMenuHtml = require('./leftMenu.html');
var dot = require('dot');
import config from './config';
const leftMenu = {
    showLeftMenu: function () {
        const pathArray = window.location.pathname.split('/');
        const parentPath = pathArray[3];
        const childPath = pathArray[5].split(".")[0];
        const template = dot.template(leftMenuHtml);

        config.map(menu => {
            menu.actived = parentPath === menu.name;
            menu.children.map(child => {
                child.actived = childPath === child.name;
            })
        });

        $('.header').after(template(config));
    }
};
module.exports = leftMenu;