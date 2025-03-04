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
var account_1 = require("../mongodb/account");
var expense_1 = require("../mongodb/expense");
var database_1 = require("../mongodb/database");
var functions_1 = require("../app/functions");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(function (resolve) { return rl.question(query, resolve); });
}
function registerUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, existingAccount, account;
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
                    return [4 /*yield*/, (0, account_1.getAccount)(username)];
                case 3:
                    existingAccount = _a.sent();
                    if (existingAccount) {
                        console.log("Username already exists!");
                        return [2 /*return*/];
                    }
                    account = {
                        accountOwner: username,
                        balance: 0,
                        currency: 'USD',
                        username: username,
                        password: password,
                        loggedIn: false
                    };
                    return [4 /*yield*/, (0, account_1.createAccount)(account)];
                case 4:
                    _a.sent();
                    console.log("User ".concat(username, " registered successfully!"));
                    return [4 /*yield*/, createAccount(username)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, account;
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
                    return [4 /*yield*/, (0, account_1.getAccount)(username)];
                case 3:
                    account = _a.sent();
                    if (account && account.password === password) {
                        console.log("Login successful! Welcome, ".concat(username));
                        return [2 /*return*/, username];
                    }
                    else {
                        console.log("Invalid username or password.");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function logoutUser(username) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Logout successful!");
            return [2 /*return*/];
        });
    });
}
function createAccount(username) {
    return __awaiter(this, void 0, void 0, function () {
        var accountNumber, currency, balanceInput, balance, bankName, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Create Bank Account");
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
                    _a.label = 4;
                case 4:
                    if (!isNaN(balance)) return [3 /*break*/, 6];
                    console.log("Invalid balance amount. Please enter a number.");
                    return [4 /*yield*/, askQuestion("Enter initial balance: ")];
                case 5:
                    balanceInput = _a.sent();
                    return [3 /*break*/, 4];
                case 6: return [4 /*yield*/, askQuestion("Enter bank name: ")];
                case 7:
                    bankName = _a.sent();
                    account = {
                        accountOwner: username,
                        balance: balance,
                        currency: currency,
                        username: username,
                        password: '', // Password is not needed here
                        loggedIn: false
                    };
                    return [4 /*yield*/, (0, account_1.createAccount)(account)];
                case 8:
                    _a.sent();
                    console.log("Account created for ".concat(username, " with ").concat(balance, " ").concat(currency, " at ").concat(bankName));
                    return [2 /*return*/];
            }
        });
    });
}
function addExpense(username) {
    return __awaiter(this, void 0, void 0, function () {
        var description, amount_input, amount, currency, date_input, date, category, accountCurrency, currency_api_data, exchangeRate, expense, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Add expense");
                    return [4 /*yield*/, askQuestion("Describe your purchase: ")];
                case 1:
                    description = _a.sent();
                    return [4 /*yield*/, askQuestion("How much was it? ")];
                case 2:
                    amount_input = _a.sent();
                    amount = parseFloat(amount_input);
                    return [4 /*yield*/, askQuestion("In what currency? ")];
                case 3:
                    currency = _a.sent();
                    return [4 /*yield*/, askQuestion("When was the purchase made?(format: YYYY-MM-DD) ")];
                case 4:
                    date_input = _a.sent();
                    date = new Date(Date.parse(date_input));
                    return [4 /*yield*/, askQuestion("What category does this fall under? \n" + functions_1.expense_categories + ":  ")];
                case 5:
                    category = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!(1 > parseFloat(category) || parseFloat(category) > 7)) return [3 /*break*/, 8];
                    return [4 /*yield*/, askQuestion("Invalid category. Please enter a number between 1-7.")];
                case 7:
                    category = _a.sent();
                    return [3 /*break*/, 6];
                case 8:
                    if (isNaN(amount)) {
                        console.log("Invalid amount. Please enter a number.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, account_1.getAccountCurrency)(username)];
                case 9:
                    accountCurrency = _a.sent();
                    if (!(currency !== accountCurrency)) return [3 /*break*/, 11];
                    return [4 /*yield*/, fetch("https://api.exchangeratesapi.io/latest?base=".concat(currency))];
                case 10:
                    currency_api_data = _a.sent();
                    exchangeRate = 1;
                    amount = amount * exchangeRate;
                    currency = accountCurrency;
                    _a.label = 11;
                case 11:
                    expense = {
                        amount: amount,
                        category: category,
                        date: date,
                        accountOwner: username,
                        description: description
                    };
                    return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, account_1.updateBalance)(username, -amount)];
                case 13:
                    _a.sent();
                    console.log("Expense added for ".concat(amount, " ").concat(currency, " on ").concat(date, " in ").concat(category));
                    return [4 /*yield*/, askQuestion("Do you want to add another expense? (yes/no) ")];
                case 14:
                    answer = _a.sent();
                    if (!(answer.toLowerCase() === "yes")) return [3 /*break*/, 17];
                    return [4 /*yield*/, wait(200)];
                case 15:
                    _a.sent();
                    console.clear();
                    return [4 /*yield*/, addExpense(username)];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17: return [2 /*return*/];
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
        var choice, _a, username, userChoice, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 21];
                    console.log("\n Smart Expense Tracker");
                    console.log("1. Register");
                    console.log("2. Login");
                    console.log("3. Add Expense");
                    console.log("4. Logout");
                    console.log("5. Exit");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 3:
                    choice = _c.sent();
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 4];
                        case "2": return [3 /*break*/, 6];
                        case "3": return [3 /*break*/, 15];
                        case "4": return [3 /*break*/, 16];
                        case "5": return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 18];
                case 4: return [4 /*yield*/, registerUser()];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 19];
                case 6: return [4 /*yield*/, loginUser()];
                case 7:
                    username = _c.sent();
                    if (!username) return [3 /*break*/, 14];
                    // User is logged in, show additional options
                    console.log("1. Add Expense");
                    console.log("2. Logout");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 8:
                    userChoice = _c.sent();
                    _b = userChoice;
                    switch (_b) {
                        case "1": return [3 /*break*/, 9];
                        case "2": return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, addExpense(username)];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, logoutUser(username)];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 13:
                    console.log("Invalid option. Try again.");
                    _c.label = 14;
                case 14: return [3 /*break*/, 19];
                case 15:
                    console.log("Please login first.");
                    return [3 /*break*/, 19];
                case 16:
                    console.log("No user is logged in.");
                    return [3 /*break*/, 19];
                case 17:
                    console.log("Goodbye!");
                    rl.close();
                    return [2 /*return*/];
                case 18:
                    console.log("Invalid option. Try again.");
                    _c.label = 19;
                case 19: return [4 /*yield*/, wait(2000)];
                case 20:
                    _c.sent();
                    console.clear();
                    return [3 /*break*/, 2];
                case 21: return [2 /*return*/];
            }
        });
    });
}
main();
