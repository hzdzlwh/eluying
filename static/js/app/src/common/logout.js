import http from './http';
var logout = {
    logout: function() {
        $.get(http.getUrl("logoutUrl"));
        localStorage.clear();
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie = keys[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; "
			}
		}
		location.href = "/login.html";
    }
};
module.exports = logout;