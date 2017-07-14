import Vue from 'vue';
import 'bootstrap';
import init from '../../common/init';
var header = require("header");
var auth = require('../../common/auth');

init({
    id: auth.BUSINESS_ID,
});
