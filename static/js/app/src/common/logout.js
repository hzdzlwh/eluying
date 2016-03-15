var AJAXService = require("AJAXService");
var logout = {
    logout: function() {
        $.get(AJAXService.getUrl("logoutUrl"));
        localStorage.clear();
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString(); 
			}
		}
		location.href = "/login.html";
    }
};
module.exports = logout;