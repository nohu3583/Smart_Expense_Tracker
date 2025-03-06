"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(account_number, balance, currency, bank_name) {
        this.account_number = account_number;
        this.balance = balance;
        this.currency = currency;
        this.bank_name = bank_name;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount, account) {
        if (this.balance > amount) {
            this.balance -= amount;
        }
        if (this.balance < amount) {
            console.log(`Insufficient balance in ${this.account_number}`);
            return;
        }
        console.log(`Balance left in ${this.account_number} is ${this.balance}`);
    }
    get_account_currency() {
        return this.currency;
    }
    get_account_number() {
        return this.account_number;
    }
}
exports.Account = Account;
