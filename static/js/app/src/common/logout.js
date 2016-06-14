var AJAXService = require("AJAXService");
var logout = {
    logout: function() {
        $.get(AJAXService.getUrl2("logoutUrl"));
        localStorage.clear();
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie = keys[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; "
			}
		}
		location.href = "/login2.html";
    }
};
module.exports = logout;