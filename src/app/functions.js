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
exports.rl = exports.expense_categories = void 0;
exports.askQuestion = askQuestion;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.addExpense = addExpense;
exports.wait = wait;
exports.change_or_delete_expense = change_or_delete_expense;
exports.getExpensesForUser = getExpensesForUser;
exports.account_options = account_options;
exports.awaitUserInput = awaitUserInput;
exports.csvparser = csvparser;
exports.exportExpenseCsvFile = exportExpenseCsvFile;
var readline = require("readline");
var account_1 = require("../mongodb/account");
var expense_1 = require("../mongodb/expense");
var crypto = require("crypto");
var fs_1 = require("fs");
var csv_parser_1 = require("csv-parser");
var csv_stringify_1 = require("csv-stringify");
exports.expense_categories = ["1. Food", " 2. Housing", " 3. Transportation", " 4. Health and wellness", " 5. Shopping", " 6. Entertainment", " 7. Other"];
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(function (resolve) { return exports.rl.question(query, resolve); });
}
function registerUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, hashed_password, account_number, balance, currency, account;
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
                    hashed_password = crypto.createHash('sha256').update(password).digest("hex");
                    return [4 /*yield*/, (0, account_1.getAccount)(username)];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    console.log("Username already exists!");
                    return [2 /*return*/];
                case 4:
                    console.log("User registered successfully, but no account has been registered yet.");
                    return [4 /*yield*/, askQuestion("Enter account number: ")];
                case 5:
                    account_number = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter balance: ")];
                case 6:
                    balance = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter currency: ")];
                case 7:
                    currency = _a.sent();
                    account = {
                        accountOwner: account_number,
                        balance: parseInt(balance),
                        currency: currency,
                        username: username,
                        password: hashed_password,
                        loggedIn: false
                    };
                    console.log("Account created successfully!");
                    return [4 /*yield*/, (0, account_1.createAccount)(account)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, account, password, hashed_password, active_account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, askQuestion("Enter username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, (0, account_1.getAccount)(username)];
                case 2:
                    account = _a.sent();
                    if ((account === null || account === void 0 ? void 0 : account.loggedIn) === true) {
                        console.log("User already logged in!");
                        return [2 /*return*/];
                    }
                    if (account === null) {
                        console.log("User does not exist!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, askQuestion("Enter password: ")];
                case 3:
                    password = _a.sent();
                    hashed_password = crypto.createHash('sha256').update(password).digest("hex");
                    if ((account === null || account === void 0 ? void 0 : account.password) !== hashed_password) {
                        console.log("Incorrect password!");
                        return [2 /*return*/];
                    }
                    console.log("User logged in successfully!");
                    return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 4:
                    active_account = _a.sent();
                    if (!(active_account !== "")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, account_1.switch_logged_in_status)(active_account)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, (0, account_1.switch_logged_in_status)(username)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logoutUser() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 2:
                    account = _a.sent();
                    return [4 /*yield*/, (0, account_1.switch_logged_in_status)(active_account)];
                case 3:
                    _a.sent();
                    console.log("User logged out successfully!");
                    return [2 /*return*/];
            }
        });
    });
}
function addExpense() {
    return __awaiter(this, void 0, void 0, function () {
        var question, inputfile, active_account, amount, date, date_parsed, date_1, category, description, expense, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, askQuestion("Do you want to add manually or import from CSV? (manual/csv): ")];
                case 1:
                    question = _a.sent();
                    if (!(question === "csv")) return [3 /*break*/, 4];
                    return [4 /*yield*/, askQuestion("Enter the name of the CSV file: ")];
                case 2:
                    inputfile = _a.sent();
                    return [4 /*yield*/, csvparser(inputfile)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 5:
                    active_account = _a.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 6:
                    amount = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter date: ")];
                case 7:
                    date = _a.sent();
                    date_parsed = new Date(date);
                    _a.label = 8;
                case 8:
                    if (!isNaN(date_parsed.getTime())) return [3 /*break*/, 10];
                    console.log("Invalid date format. Try again.");
                    return [4 /*yield*/, askQuestion("Enter date: ")];
                case 9:
                    date_1 = _a.sent();
                    date_parsed = new Date(date_1);
                    return [3 /*break*/, 8];
                case 10: return [4 /*yield*/, askQuestion("What category does this fall under? \n" + exports.expense_categories + ":  ")];
                case 11:
                    category = _a.sent();
                    _a.label = 12;
                case 12:
                    if (!(1 > parseFloat(category) || parseFloat(category) > 7)) return [3 /*break*/, 14];
                    return [4 /*yield*/, askQuestion("Invalid category. Please enter a number between 1-7.")];
                case 13:
                    category = _a.sent();
                    return [3 /*break*/, 12];
                case 14: return [4 /*yield*/, askQuestion("Enter description: ")];
                case 15:
                    description = _a.sent();
                    expense = {
                        amount: parseInt(amount),
                        category: category,
                        date: date_parsed,
                        accountOwner: active_account,
                        description: description
                    };
                    return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
                case 16:
                    _a.sent();
                    console.log("Expense added successfully!");
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 17:
                    account = _a.sent();
                    if (!account) return [3 /*break*/, 19];
                    account.balance -= parseInt(amount);
                    return [4 /*yield*/, (0, account_1.updateBalance)(account.accountOwner, account.balance)];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19: return [2 /*return*/];
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
function change_or_delete_expense() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, choice, _a, description, date, parsed_date, amount, category, new_description, new_date, new_date_parsed, updated_expense, date2, parsed_date2, description2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Menu for changing or deleting expenses");
                    console.log("1. Change expense");
                    console.log("2. Delete expense");
                    return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _b.sent();
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 2:
                    choice = _b.sent();
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 3];
                        case "2": return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 15];
                case 3: return [4 /*yield*/, askQuestion("Enter description for the expense you want to change: ")];
                case 4:
                    description = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter date for the expense you want to change: ")];
                case 5:
                    date = _b.sent();
                    parsed_date = new Date(date);
                    console.log("Expense found, please enter the new details for the expense.");
                    return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 6:
                    amount = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter category: ")];
                case 7:
                    category = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter new description: ")];
                case 8:
                    new_description = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter date: ")];
                case 9:
                    new_date = _b.sent();
                    new_date_parsed = new Date(new_date);
                    updated_expense = {
                        amount: parseInt(amount),
                        category: category,
                        date: new_date_parsed,
                        accountOwner: active_account,
                        description: new_description
                    };
                    return [4 /*yield*/, (0, expense_1.updateExpense)(active_account, parsed_date, description, updated_expense)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 11: return [4 /*yield*/, askQuestion("Enter date for the expense you want to delete: ")];
                case 12:
                    date2 = _b.sent();
                    parsed_date2 = new Date(date2);
                    return [4 /*yield*/, askQuestion("Enter description for the expense you want to delete: ")];
                case 13:
                    description2 = _b.sent();
                    return [4 /*yield*/, (0, expense_1.deleteExpense)(active_account, parsed_date2, description2)];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    console.log("Invalid option. Try again.");
                    _b.label = 16;
                case 16: return [2 /*return*/];
            }
        });
    });
}
function getExpensesForUser() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, active_account, _a, expenses, category, expenses_category, date, parsed_date, expenses_date, amount, expenses_amount, description, expenses_description;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Menu for choosing expenses");
                    console.log("1. Get all expenses");
                    console.log("2. Get expenses by category");
                    console.log("3. Get expenses by date");
                    console.log("4. Get expenses by amount");
                    console.log("5. Get expenses by description");
                    console.log("6. Export expenses to CSV file");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 1:
                    choice = _b.sent();
                    return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 2:
                    active_account = _b.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 3];
                        case "2": return [3 /*break*/, 5];
                        case "3": return [3 /*break*/, 8];
                        case "4": return [3 /*break*/, 11];
                        case "5": return [3 /*break*/, 14];
                        case "6": return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 19];
                case 3: return [4 /*yield*/, (0, expense_1.getExpenses)(active_account)];
                case 4:
                    expenses = _b.sent();
                    console.log(expenses);
                    return [3 /*break*/, 20];
                case 5: return [4 /*yield*/, askQuestion("Enter category: ")];
                case 6:
                    category = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByCategory)(active_account, category)];
                case 7:
                    expenses_category = _b.sent();
                    console.log(expenses_category);
                    return [3 /*break*/, 20];
                case 8: return [4 /*yield*/, askQuestion("Enter date: ")];
                case 9:
                    date = _b.sent();
                    parsed_date = new Date(date);
                    return [4 /*yield*/, (0, expense_1.getExpensesByDate)(active_account, parsed_date)];
                case 10:
                    expenses_date = _b.sent();
                    console.log(expenses_date);
                    return [3 /*break*/, 20];
                case 11: return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 12:
                    amount = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByAmount)(active_account, parseInt(amount))];
                case 13:
                    expenses_amount = _b.sent();
                    console.log(expenses_amount);
                    return [3 /*break*/, 20];
                case 14: return [4 /*yield*/, askQuestion("Enter description: ")];
                case 15:
                    description = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByDescription)(active_account, description)];
                case 16:
                    expenses_description = _b.sent();
                    console.log(expenses_description);
                    return [3 /*break*/, 20];
                case 17: return [4 /*yield*/, exportExpenseCsvFile()];
                case 18:
                    _b.sent();
                    return [3 /*break*/, 20];
                case 19:
                    console.log("Invalid option. Try again.");
                    _b.label = 20;
                case 20: return [2 /*return*/];
            }
        });
    });
}
function account_options() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, active_account, account, _a, options, change_to, account_to_be_changed, value, _b, fieldNames, confirm_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Menu for account options");
                    console.log("1. Get account information");
                    console.log("2. Change account information");
                    console.log("3. Delete account");
                    return [4 /*yield*/, askQuestion("Choose an option: ")];
                case 1:
                    choice = _c.sent();
                    return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 2:
                    active_account = _c.sent();
                    if (!active_account) {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 3:
                    account = _c.sent();
                    if (!account) {
                        console.log("Error: Account not found.");
                        return [2 /*return*/];
                    }
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 4];
                        case "2": return [3 /*break*/, 5];
                        case "3": return [3 /*break*/, 24];
                    }
                    return [3 /*break*/, 29];
                case 4:
                    console.log(account);
                    return [3 /*break*/, 30];
                case 5:
                    options = ["1. Account Number", "2. Balance", "3. Currency", "4. Username", "5. Password"];
                    return [4 /*yield*/, askQuestion("What in your account do you want to change? \n" + options.join("\n") + "\nEnter choice: ")];
                case 6:
                    change_to = _c.sent();
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 7:
                    account_to_be_changed = _c.sent();
                    if (!account_to_be_changed) {
                        console.log("Error: Account not found.");
                        return [2 /*return*/];
                    }
                    value = "temp";
                    _b = change_to;
                    switch (_b) {
                        case "1": return [3 /*break*/, 8];
                        case "2": return [3 /*break*/, 10];
                        case "3": return [3 /*break*/, 13];
                        case "4": return [3 /*break*/, 16];
                        case "5": return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 20];
                case 8: return [4 /*yield*/, askQuestion("Enter new account number: ")];
                case 9:
                    value = _c.sent();
                    return [3 /*break*/, 21];
                case 10:
                    if (!isNaN(value)) return [3 /*break*/, 12];
                    return [4 /*yield*/, askQuestion("Enter new balance: ")];
                case 11:
                    value = _c.sent();
                    value = parseFloat(value);
                    if (isNaN(value)) {
                        console.log("Balance must be a number. Try again.");
                    }
                    return [3 /*break*/, 10];
                case 12: return [3 /*break*/, 21];
                case 13:
                    if (!(value.length !== 3)) return [3 /*break*/, 15];
                    return [4 /*yield*/, askQuestion("Enter new currency: ")];
                case 14:
                    value = (_c.sent()).toUpperCase();
                    if (value.length !== 3) {
                        console.log("Currency must be 3 characters long. Try again.");
                    }
                    return [3 /*break*/, 13];
                case 15: return [3 /*break*/, 21];
                case 16: return [4 /*yield*/, askQuestion("Enter new username: ")];
                case 17:
                    value = _c.sent();
                    return [3 /*break*/, 21];
                case 18: return [4 /*yield*/, askQuestion("Enter new password: ")];
                case 19:
                    value = _c.sent();
                    value = crypto.createHash('sha256').update(value).digest("hex");
                    return [3 /*break*/, 21];
                case 20:
                    console.log("Invalid option. Try again.");
                    return [2 /*return*/];
                case 21:
                    fieldNames = {
                        "1": "accountOwner",
                        "2": "balance",
                        "3": "currency",
                        "4": "username",
                        "5": "password",
                    };
                    if (!fieldNames[change_to]) return [3 /*break*/, 23];
                    return [4 /*yield*/, (0, account_1.updates_specific_field)(fieldNames[change_to], active_account, value)];
                case 22:
                    _c.sent();
                    console.log("Account updated successfully!");
                    _c.label = 23;
                case 23: return [3 /*break*/, 30];
                case 24: return [4 /*yield*/, askQuestion("Are you sure you want to delete your account? (yes/no): ")];
                case 25:
                    confirm_1 = _c.sent();
                    if (!(confirm_1.toLowerCase() === "yes")) return [3 /*break*/, 28];
                    return [4 /*yield*/, (0, account_1.deleteAccount)(active_account)];
                case 26:
                    _c.sent();
                    console.log("Account deleted successfully!");
                    return [4 /*yield*/, (0, expense_1.deleteallexpense)(active_account)];
                case 27:
                    _c.sent();
                    _c.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    console.log("Invalid option. Try again.");
                    _c.label = 30;
                case 30: return [2 /*return*/];
            }
        });
    });
}
function awaitUserInput() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            askQuestion("Press enter to continue: ");
            return [2 /*return*/];
        });
    });
}
function csvparser(inputfile) {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, active_account_info, account_balance, total_expense;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 2:
                    active_account_info = _a.sent();
                    account_balance = active_account_info.balance;
                    total_expense = 0;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var expenses = [];
                            fs_1.default.createReadStream(inputfile)
                                .pipe((0, csv_parser_1.default)())
                                .on("data", function (row) {
                                if (row.accountOwner !== active_account) {
                                    console.log("Error: Account number does not match the active account. Skipping row.");
                                    return;
                                }
                                var amount = parseFloat(row.amount);
                                if (isNaN(amount) || amount <= 0) {
                                    console.log("Error: Amount must be a number. Skipping row.");
                                    return;
                                }
                                total_expense += amount;
                                expenses.push({
                                    amount: amount,
                                    category: row.category,
                                    date: new Date(row.date),
                                    accountOwner: active_account,
                                    description: row.description,
                                });
                            })
                                .on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                                var i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (total_expense > account_balance) {
                                                console.log("Import failed. Total expenses exceed available balance in account");
                                                return [2 /*return*/];
                                            }
                                            if (!(expenses.length > 0)) return [3 /*break*/, 5];
                                            i = 0;
                                            _a.label = 1;
                                        case 1:
                                            if (!(i < expenses.length)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, (0, expense_1.addExpense)(expenses[i])];
                                        case 2:
                                            _a.sent();
                                            console.log("Expense added successfully!");
                                            _a.label = 3;
                                        case 3:
                                            i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [3 /*break*/, 6];
                                        case 5:
                                            console.log("No valid expenses found in the file.");
                                            _a.label = 6;
                                        case 6:
                                            resolve();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .on("error", function (error) {
                                console.log("Error: ", error.message);
                                reject(error);
                            });
                        })];
            }
        });
    });
}
function exportExpenseCsvFile() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, expenses, filename, writableStream, columns, stringifier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, expense_1.getExpenses)(active_account)];
                case 2:
                    expenses = _a.sent();
                    if (!expenses || expenses.length === 0) {
                        console.log("No expenses found for the active account.");
                        return [2 /*return*/];
                    }
                    filename = "expenses_".concat(active_account, ".csv");
                    writableStream = fs_1.default.createWriteStream(filename);
                    columns = ["amount", "category", "date", "accountOwner", "description"];
                    stringifier = (0, csv_stringify_1.stringify)({ header: true, columns: columns });
                    // Pipe CSV data into the writable stream
                    stringifier.pipe(writableStream);
                    // Add each expense row
                    expenses.forEach(function (expense) {
                        stringifier.write({
                            amount: expense.amount,
                            category: expense.category,
                            date: expense.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                            accountOwner: expense.accountOwner,
                            description: expense.description,
                        });
                    });
                    // End the stream
                    stringifier.end();
                    writableStream.on("finish", function () {
                        console.log("Expenses successfully exported to ".concat(filename));
                    });
                    writableStream.on("error", function (error) {
                        console.error("Error writing to CSV file:", error);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
