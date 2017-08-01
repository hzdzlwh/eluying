import Vue from 'vue';
import 'bootstrap';
import init from '../../common/init';
import App from './App';
var header = require("header");
var auth = require('../../common/auth');

init({
    id: auth.BUSINESS_ID,
});

$(function() {
	const virtualContent = new Vue({
		el: "#app",
		...App
	})
})