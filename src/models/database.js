"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    constructor() {
        this.users = [];
        this.accounts = [];
        this.expenses = [];
    } // Singleton pattern
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    addUser(user) {
        this.users.push(user);
    }
    findUser(username) {
        return this.users.find(user => user.username === username);
    }
    find_account_id(accountid) {
        return this.users.find(user => user.account_id === accountid);
    }
    get_users() {
        return this.users;
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    getAccounts() {
        return this.accounts;
    }
    addExpense(expense) {
        this.expenses.push(expense);
    }
    filterExpensesByCategory(category) {
        return this.expenses.filter(expense => expense.category === category);
    }
    filterExpensesByDate(date) {
        return this.expenses.filter(expense => expense.date === date);
    }
    filterExpensesByAmount(amount) {
        return this.expenses.filter(expense => expense.amount === amount);
    }
    getExpenses() {
        return this.expenses;
    }
    get_currency_from_account(account_number) {
        const account_correct = this.accounts.find(acc => acc.account_number === account_number);
        return account_correct ? account_correct.get_account_currency() : "";
    }
    get_active_account() {
        const active_account = this.users.find(user => user.logged_in === true);
        return active_account ? active_account.get_account_number() : "";
    }
    account_withdraw_after_expense(account_number, expense) {
        const account_correct = this.accounts.find(acc => acc.account_number === account_number);
        account_correct === null || account_correct === void 0 ? void 0 : account_correct.withdraw(expense, account_correct.get_account_number());
    }
    display_user_names() {
        return this.users.map(user => user.username);
    }
    find_account_status(username) {
        const account = this.findUser(username);
        return account ? account.logged_in : "";
    }
}
exports.Database = Database;
