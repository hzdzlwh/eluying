/*
* @Author: lxj
* @Date:   2017-07-19 11:03:31
* @Last Modified by:   lxj
* @Last Modified time: 2017-07-19 11:04:16
* @email: 783384903@qq.com
*/
var VueContextMenu = require('./index.vue')

VueContextMenu.install = function install(Vue) {
  var component = Vue.component('context-menu', VueContextMenu)
  return component
}

window.VueContextMenu = VueContextMenu

module.exports = module.exports.default = VueContextMenu
