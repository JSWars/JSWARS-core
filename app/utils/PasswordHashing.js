/**
 * Created by marcx on 17/11/2014.
 */
"use strict";

var config, crypto, cipher;

crypto = require('crypto');
config = require("./../config");

function Password(password) {
	this.password = password;
}

Password.prototype.hash = function () {
	var salt = Password.createSalt(Password.SALTLENGTH);
	var md5 = Password.MD5(this.password + salt);
	return salt + md5;
};

Password.validateHash = function (hash, password) {
	var salt = hash.substr(0, Password.SALTLENGTH);
	var validHash = salt + Password.MD5(password + salt);
	return hash === validHash;
};

Password.createSalt = function (length) {
	var setLen = Password.SALTCHARACTERS.length,
		salt = '';
	for (var i = 0; i < length; i = i + 1) {
		var p = Math.floor(Math.random() * setLen);
		salt += Password.SALTCHARACTERS[p];
	}
	return salt;
};

Password.MD5 = function (password) {
	return crypto.createHash('md5').update(password).digest('hex');
};

Password.SALTLENGTH = 9;

Password.SALTCHARACTERS = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';

module.exports = Password;
