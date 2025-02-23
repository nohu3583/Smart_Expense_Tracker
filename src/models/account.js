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
        console.log("Deposited ".concat(amount, " to ").concat(this.account_number));
    };
    Account.prototype.withdraw = function (amount) {
        if (this.balance < amount) {
            console.log("Insufficient balance in ".concat(this.account_number));
            return false;
        }
        this.balance -= amount;
        console.log("Withdrawn ".concat(amount, " from ").concat(this.account_number));
        return true;
    };
    return Account;
}());
exports.Account = Account;
