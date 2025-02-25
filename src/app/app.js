"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var database_1 = require("../models/database");
var user_1 = require("../models/user");
var account_1 = require("../models/account");
var expense_1 = require("../models/expense");
var functions_1 = require("./functions");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var db = database_1.Database.getInstance();
function askQuestion(query) {
    return new Promise(function (resolve) { return rl.question(query, resolve); });
}
function registerUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, status, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Register New User");
                    return [4 /*yield*/, askQuestion("Enter username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter password: ")];
                case 2:
                    password = _a.sent();
                    if (db.findUser(username)) {
                        console.log("Username already exists!");
                        return [2 /*return*/];
                    }
                    status = false;
                    console.log("User ".concat(username, " registered successfully!"));
                    user = new user_1.User(username, password, "", status);
                    db.addUser(user);
                    user.change_account_status(user.logged_in);
                    return [4 /*yield*/, createAccount(user)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, user, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("User Login");
                    return [4 /*yield*/, askQuestion("Enter username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter password: ")];
                case 2:
                    password = _a.sent();
                    user = db.findUser(username);
                    status = db.find_account_status(username);
                    if (status) {
                        console.log("User is alredy logged in");
                        return [2 /*return*/, null];
                    }
                    else {
                        if (user && user.authenticate(password)) {
                            user.change_account_status(user.logged_in);
                            console.log("Login successful! Welcome, ".concat(username));
                            return [2 /*return*/, user];
                        }
                        else {
                            console.log(" Invalid username or password.");
                            return [2 /*return*/, null];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function logoutUser() {
    return __awaiter(this, void 0, void 0, function () {
        var user_id, user;
        return __generator(this, function (_a) {
            user_id = db.get_active_account();
            user = db.find_account_id(user_id);
            if (user) {
                user.change_account_status(user.logged_in);
                console.log("Logout successful!");
                return [2 /*return*/];
            }
            else {
                console.log("No user logged in");
                return [2 /*return*/];
            }
            return [2 /*return*/];
        });
    });
}
function createAccount(user) {
    return __awaiter(this, void 0, void 0, function () {
        var accountNumber, currency, balanceInput, balance, bankName, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(" Create Bank Account");
                    return [4 /*yield*/, askQuestion("Enter account number: ")];
                case 1:
                    accountNumber = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter currency (e.g., USD, EUR): ")];
                case 2:
                    currency = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter initial balance: ")];
                case 3:
                    balanceInput = _a.sent();
                    balance = parseFloat(balanceInput);
                    return [4 /*yield*/, askQuestion("Enter bank name: ")];
                case 4:
                    bankName = _a.sent();
                    if (isNaN(balance)) {
                        console.log("Invalid balance amount. Please enter a number.");
                        return [2 /*return*/];
                    }
                    account = new account_1.Account(accountNumber, balance, currency, bankName);
                    db.addAccount(account);
                    user.input_account_number(accountNumber);
                    console.log("Account created for ".concat(user.username, " with ").concat(balance, " ").concat(currency, " at ").concat(bankName));
                    return [2 /*return*/];
            }
        });
    });
}
function addExpense() {
    return __awaiter(this, void 0, void 0, function () {
        var account_id, description, amount_input, amount, currency, date_input, date, category, currency_api_data, exchangeRate, expense, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!db.get_active_account()) return [3 /*break*/, 1];
                    console.log("No user logged in. Please login first.");
                    return [2 /*return*/];
                case 1:
                    account_id = db.get_active_account();
                    console.log("Add expense");
                    return [4 /*yield*/, askQuestion("Describe your purchase: ")];
                case 2:
                    description = _a.sent();
                    return [4 /*yield*/, askQuestion("How much was it? ")];
                case 3:
                    amount_input = _a.sent();
                    amount = parseFloat(amount_input);
                    return [4 /*yield*/, askQuestion("In what currency? ")];
                case 4:
                    currency = _a.sent();
                    return [4 /*yield*/, askQuestion("When was the purchase made?(format: ÅÅÅÅ-MM-DD) ")];
                case 5:
                    date_input = _a.sent();
                    date = new Date(Date.parse(date_input));
                    return [4 /*yield*/, askQuestion("What category does this fall under? \n" + functions_1.expense_categories)];
                case 6:
                    category = _a.sent();
                    if (0 > parseFloat(category) && parseFloat(category) > 7) {
                        console.log("Invalid category. Please enter a number between 1-7.");
                        return [2 /*return*/];
                    }
                    if (isNaN(amount)) {
                        console.log("Invalid amount. Please enter a number.");
                        return [2 /*return*/];
                    }
                    if (!(currency !== db.get_currency_from_account(account_id))) return [3 /*break*/, 8];
                    return [4 /*yield*/, fetch("https://api.exchangeratesapi.io/latest?base=".concat(currency))];
                case 7:
                    currency_api_data = _a.sent();
                    exchangeRate = 1;
                    amount = amount * exchangeRate;
                    currency = db.get_currency_from_account(account_id);
                    _a.label = 8;
                case 8:
                    expense = new expense_1.Expense(description, amount, date, category, currency, account_id);
                    db.addExpense(expense);
                    console.log("Expense added for ".concat(amount, " ").concat(currency, " on ").concat(date, " in ").concat(category));
                    db.account_withdraw_after_expense(account_id, amount);
                    return [4 /*yield*/, askQuestion("Do you want to add another expense? (yes/no) ")];
                case 9:
                    answer = _a.sent();
                    if (answer.toLowerCase() === "yes") {
                        addExpense();
                    }
                    else {
                        main();
                    }
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
function wait(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a, choice, _b, user, usernames;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!true) return [3 /*break*/, 22];
                    if (!(db.get_users().length === 0)) return [3 /*break*/, 7];
                    console.log("\n Smart Expense Tracker");
                    console.log("1. Register");
                    console.log("2. Exit");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 1:
                    choice = _c.sent();
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 2];
                        case "2": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, registerUser()];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4:
                    console.log("Goodbye!");
                    rl.close();
                    return [2 /*return*/];
                case 5:
                    console.log("Invalid option. Try again.");
                    _c.label = 6;
                case 6: return [3 /*break*/, 20];
                case 7:
                    console.log("\n Smart Expense Tracker");
                    console.log("1. Register");
                    console.log("2. Login");
                    console.log("3. Display Users");
                    console.log("4. Add Expense");
                    console.log("5. Logout");
                    console.log("6. Exit");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 8:
                    choice = _c.sent();
                    _b = choice;
                    switch (_b) {
                        case "1": return [3 /*break*/, 9];
                        case "2": return [3 /*break*/, 11];
                        case "3": return [3 /*break*/, 13];
                        case "4": return [3 /*break*/, 14];
                        case "5": return [3 /*break*/, 16];
                        case "6": return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 19];
                case 9: return [4 /*yield*/, registerUser()];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 20];
                case 11: return [4 /*yield*/, loginUser()];
                case 12:
                    user = _c.sent();
                    return [3 /*break*/, 20];
                case 13:
                    usernames = db.display_user_names();
                    console.log("Created user are: ".concat(usernames));
                    return [3 /*break*/, 20];
                case 14: return [4 /*yield*/, addExpense()];
                case 15:
                    _c.sent();
                    return [3 /*break*/, 20];
                case 16: return [4 /*yield*/, logoutUser()];
                case 17:
                    _c.sent();
                    rl.close();
                    _c.label = 18;
                case 18:
                    console.log("Goodbye!");
                    rl.close();
                    return [2 /*return*/];
                case 19:
                    console.log("Invalid option. Try again.");
                    _c.label = 20;
                case 20: return [4 /*yield*/, wait(2000)];
                case 21:
                    _c.sent();
                    console.clear();
                    return [3 /*break*/, 0];
                case 22: return [2 /*return*/];
            }
        });
    });
}
main();
