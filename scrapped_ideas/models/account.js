"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var Account = /** @class */ (function () {
    function Account(account_number, balance, currency, bank_name) {
        this.account_number = account_number;
        this.balance = balance;
        this.currency = currency;
        this.bank_name = bank_name;
    }
    Account.prototype.deposit = function (amount) {
        this.balance += amount;
    };
    Account.prototype.withdraw = function (amount, account) {
        if (this.balance > amount) {
            this.balance -= amount;
        }
        if (this.balance < amount) {
            console.log("Insufficient balance in ".concat(this.account_number));
            return;
        }
        console.log("Balance left in ".concat(this.account_number, " is ").concat(this.balance));
    };
    Account.prototype.get_account_currency = function () {
        return this.currency;
    };
    Account.prototype.get_account_number = function () {
        return this.account_number;
    };
    return Account;
}());
exports.Account = Account;
