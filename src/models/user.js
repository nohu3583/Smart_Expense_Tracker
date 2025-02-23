"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username, password) {
        this.username = username;
        this.password = password;
    }
    User.prototype.authenticate = function (inputPassword) {
        return this.password === inputPassword;
    };
    return User;
}());
exports.User = User;
