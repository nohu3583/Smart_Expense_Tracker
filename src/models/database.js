"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
var Database = /** @class */ (function () {
    function Database() {
        this.users = [];
        this.accounts = [];
    } // Singleton pattern
    Database.getInstance = function () {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    };
    Database.prototype.addUser = function (user) {
        this.users.push(user);
    };
    Database.prototype.findUser = function (username) {
        return this.users.find(function (user) { return user.username === username; });
    };
    Database.prototype.addAccount = function (account) {
        this.accounts.push(account);
    };
    Database.prototype.getAccounts = function () {
        return this.accounts;
    };
    return Database;
}());
exports.Database = Database;
