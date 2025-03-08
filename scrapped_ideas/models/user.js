"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(username, password, account_id, logged_in) {
        this.username = username;
        this.password = password;
        this.account_id = account_id;
        this.logged_in = logged_in;
    }
    authenticate(inputPassword) {
        return this.password === inputPassword;
    }
    input_account_number(account_number) {
        this.account_id = account_number;
    }
    get_account_number() {
        return this.account_id;
    }
    get_account_username() {
        return this.username;
    }
    get_account_status() {
        return this.logged_in;
    }
    change_account_status(status) {
        if (status === true) {
            this.logged_in = false;
        }
        else {
            this.logged_in = true;
        }
    }
}
exports.User = User;
