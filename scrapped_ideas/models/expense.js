"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
class Expense {
    constructor(description, amount, date, category, currency, account_id) {
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.currency = currency;
        this.account_id = account_id;
    }
    input_account_number(account_number) {
        this.account_id = account_number;
    }
}
exports.Expense = Expense;
