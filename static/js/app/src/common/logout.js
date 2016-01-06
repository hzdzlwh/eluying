var AJAXService = require("AJAXService");
var logout = {
    logout: function(){
        $.get(AJAXService.getUrl("logoutUrl"));
        localStorage.clear();
        location.href = "/login.html";
    }
};
module.exports = logout;