require('bootstrap');
require('validate');
var spinHtml = require('../../../../tpl/spin.html');
function centerModals() {
    $('.modal').each(function() {
        var hasShown = $(this).css('display') === 'block';
        $(this).css('display', 'block');
        var top = ($(this).height() - $(this).find('.modal-dialog').height()) / 2;
        top = top > 0 ? top : 0;
        if (!hasShown) {
            $(this).css('display', 'none');
        }
        $(this).find('.modal-content').css('margin-top', top);
    });
}

function clearModal(that) {
    $(that).parents('.modal').find('.operateItem').addClass('hide');
    $(that).parents('.modal').modal('hide');
    $(that).parents('.modal').find('input').val(''); // 将输入框清空
    $(that).parents('.modal').find('textarea').val('');
    $(that).parents('.modal').find('tbody').html(''); // 将表单清空
    if ($(that).parents('.modal').find('form').length != 0) {
        $(that).parents('.modal').find('form').validate().resetForm();
    }
    $(that).parents('.modal').find('input[type=radio]').prop(false);
    $('coverError').addClass('hide');
    $('detailError').addClass('hide');
}

function modalInit() {
    $('.modal').modal({
        backdrop: 'static',
        show: false,
        keyboard: true
    });
}

function alert(message) {
    if ($('.error-alert-container').length === 0) {
        $('body').prepend('<div class="error-alert-container"></div>');
    }
    $('.error-alert-container').html(
        "<div class='modal fade' role='dialog' id='errorAlert'>" +
        "<div class='modal-dialog modal-w300'>" +
        "<div class='modal-content clearfloat'>" +
        "<div class='modal-header'>" +
        '<p>' + '提示' + '</p>' +
        '</div>' +
        "<div class='modal-body'>" +
        '<p>' + message + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    const errorAlert = $('#errorAlert');
    errorAlert.modal({ backdrop: false });
    errorAlert.modal('show');
    centerModals();
    setTimeout(function() {
        errorAlert.modal('hide');
    }, 2500);
}

// 确认弹出框
function confirm(dialogConfig, confirmCallback, cancelCallback) {
    var title = dialogConfig.title || '提醒';
    var message = dialogConfig.message || '您确定要这么做吗';
    var okText = dialogConfig.okText || '确认';
    var cancelText = dialogConfig.cancelText || '取消';
    var showTitle = typeof (dialogConfig.showTitle) === 'undefined' ? true : dialogConfig.showTitle;
    var hasOk = dialogConfig.hasOk;
    var hasCancel = dialogConfig.hasCancel;
    var header = showTitle ? "<div class='modal-header'>" +
    '<p>' + title + '</p>' +
    '</div>' : '';
    var okButton = hasOk === false ? '' : '<button class="dd-btn dd-btn-primary" id="confirmDialogOk">' + okText + '</button>';
    var cancelButton = hasCancel === false ? '' : '<button class="dd-btn dd-btn-ghost" id="confirmDialogCancel">' + cancelText + '</button>';
    if ($('.confirm-dialog-container').length === 0) {
        $('body').prepend('<div class="confirm-dialog-container"></div>');
    }
    $('.confirm-dialog-container').html(
        "<div class='modal fade' role='dialog' id='confirmDialog'>" +
        "<div class='modal-dialog' style='width: 300px'>" +
        "<div class='modal-content clearfloat'>" +
        header +
        "<div class='modal-body'>" +
        '<p>' + message + '</p>' +
        '</div>' +
        "<div class='footer'>" +
        okButton +
        cancelButton +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    $('#confirmDialog').modal('show');
    centerModals();
    hasOk !== false && $('#confirmDialogOk').on('click', function() {
        $('#confirmDialog').modal('hide');
        // bootstrap 去遮罩要再fade动画完成后执行，时间是300ms
        confirmCallback && setTimeout(confirmCallback, 301);
    });
    hasCancel !== false && $('#confirmDialogCancel').on('click', function() {
        $('#confirmDialog').modal('hide');
        cancelCallback && setTimeout(cancelCallback, 301);
    });
}

class Spin {
    constructor() {
        this.pendingList = [];
        this.el = '#spin';
    }

    show() {
        $('body').prepend(spinHtml);
    }

    addPending() {
        this.pendingList.push(true);
        if (this.pendingList.length === 1) {
            this.show();
        }
    }

    removePending() {
        this.pendingList.shift();
        if (this.pendingList.length === 0) {
            this.hide();
        }
    }

    hide() {
        $(this.el).remove();
    }
}

class Notify {
    constructor() {
        this.createContainer();
        this.defaultOption = {
            duration: 3000,
            type: 'warn'
        };
        this.animationDuration = 240;
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'dd-notifies';
        document.body.appendChild(this.container);
    }

    add(msg, opt) {
        const option = { ...this.defaultOption, ...opt };
        const notify = document.createElement('div');
        const typeClassName = 'dd-notify-' + option.type;
        notify.className = 'dd-notify dd-notify-active ' + typeClassName;
        const msgNode = document.createTextNode(msg);
        notify.appendChild(msgNode);
        this.container.appendChild(notify);
        setTimeout(() => notify.classList.remove('dd-notify-active'), 0);
        setTimeout(() => {
            notify.classList.add('dd-notify-active');
            setTimeout(() => this.container.removeChild(notify), this.animationDuration);
        }, option.duration);
    }
}

let notifyInstance;
function getNotifyInstance() {
    notifyInstance = notifyInstance || new Notify();
    return notifyInstance;
}

const notifyTypes = ['error', 'warn', 'success'];

notifyTypes.map(type => {
    exports[type] = function(msg) {
        const notify = getNotifyInstance();
        notify.add(msg, { type: type });
    };
});

exports.Spin = Spin;
exports.centerModals = centerModals;
exports.clearModal = clearModal;
exports.modalInit = modalInit;
exports.confirm = confirm;
exports.alert = alert;
