"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
var Expense = /** @class */ (function () {
    function Expense(description, amount, date, category, currency, account_id) {
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.currency = currency;
        this.account_id = account_id;
    }
    Expense.prototype.input_account_number = function (account_number) {
        this.account_id = account_number;
    };
    return Expense;
}());
exports.Expense = Expense;
