"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username, password, account_id, logged_in) {
        this.username = username;
        this.password = password;
        this.account_id = account_id;
        this.logged_in = logged_in;
    }
    User.prototype.authenticate = function (inputPassword) {
        return this.password === inputPassword;
    };
    User.prototype.input_account_number = function (account_number) {
        this.account_id = account_number;
    };
    User.prototype.get_account_number = function () {
        return this.account_id;
    };
    User.prototype.change_account_status = function (status) {
        if (status === true) {
            this.logged_in = false;
        }
        else {
            this.logged_in = true;
        }
    };
    return User;
}());
exports.User = User;
