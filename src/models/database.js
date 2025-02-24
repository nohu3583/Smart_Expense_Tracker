"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
var Database = /** @class */ (function () {
    function Database() {
        this.users = [];
        this.accounts = [];
        this.expenses = [];
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
    Database.prototype.addExpense = function (expense) {
        this.expenses.push(expense);
    };
    Database.prototype.filterExpensesByCategory = function (category) {
        return this.expenses.filter(function (expense) { return expense.category === category; });
    };
    Database.prototype.filterExpensesByDate = function (date) {
        return this.expenses.filter(function (expense) { return expense.date === date; });
    };
    Database.prototype.filterExpensesByAmount = function (amount) {
        return this.expenses.filter(function (expense) { return expense.amount === amount; });
    };
    Database.prototype.getExpenses = function () {
        return this.expenses;
    };
    Database.prototype.get_currency_from_account = function (account_number) {
        var account_correct = this.accounts.find(function (acc) { return acc.account_number === account_number; });
        return account_correct ? account_correct.get_account_currency() : "";
    };
    Database.prototype.get_active_account = function () {
        var active_account = this.users.find(function (user) { return user.logged_in === true; });
        return active_account ? active_account.get_account_number() : "";
    };
    return Database;
}());
exports.Database = Database;
