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
exports.rl = void 0;
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
exports.oncallCheckExpenseLimit = oncallCheckExpenseLimit;
var readline = require("readline");
var account_1 = require("../mongodb/account");
var expense_1 = require("../mongodb/expense");
var crypto = require("crypto");
var fs = require("fs");
var csv_parser_1 = require("csv-parser");
var sync_1 = require("csv-stringify/sync");
//helper functions
/**
 * Helper function to ask the user to choose a valid expense category.
 * @param {string} prompt - The prompt to display to the user when asking for category selection.
 * @returns {Promise<string>} - The selected category name (e.g., "Food", "Housing", etc.).
 */
function askCategorySelection(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var category, categoryChoices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categoryChoices = Object.entries(expense_categories)
                        .map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return "".concat(key, ". ").concat(value);
                    })
                        .join("\n");
                    _a.label = 1;
                case 1: return [4 /*yield*/, askQuestion("".concat(prompt, "\n").concat(categoryChoices, "\nEnter choice (only number): "))];
                case 2:
                    category = _a.sent();
                    // Validate the category
                    if (!expense_categories[category]) {
                        console.log("Invalid category. Please enter a number between 1-7.");
                    }
                    _a.label = 3;
                case 3:
                    if (!expense_categories[category]) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, expense_categories[category]]; // Return the valid category name
            }
        });
    });
}
/**
 * Helper function to ask the user for a valid date.
 * Ensures the date entered is in a correct format.
 * @param {string} prompt - The prompt to display to the user when asking for the date.
 * @returns {Promise<Date>} - The valid parsed date.
 */
function askValidDate(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var date, isValid, dateStr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isValid = false;
                    _a.label = 1;
                case 1: return [4 /*yield*/, askQuestion(prompt)];
                case 2:
                    dateStr = _a.sent();
                    date = new Date(dateStr);
                    if (isNaN(date.getTime())) {
                        console.log("Invalid date format. Please try again.");
                    }
                    else {
                        isValid = true;
                    }
                    _a.label = 3;
                case 3:
                    if (!isValid) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, date];
            }
        });
    });
}
// Defining the readline interface
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**
* Asks the user a question and returns the answer as a promise.
* @example
* // askquestion("Enter a number: ");
* // returns Promise<string>
* @param {string} query - question to ask the user
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves to the user's answer
*/
function askQuestion(query) {
    return new Promise(function (resolve) { return exports.rl.question(query, resolve); });
}
/**
* Registers a new user by asking for a username and password.
* If the username already exists, the function will return without creating a new account.
* If the username does not exist, the function will ask for an account number, balance, and currency.
* The function will then create a new account and return.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates the database with the new account
*/
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
/**
* Function to log in a user by asking for a username and password.
* If the user is already logged in, the function will return without logging in the user.
* If the user does not exist, the function will return without logging in the user.
* If the password is incorrect, the function will return without logging in the user.
* If the user is successfully logged in, the function will update the database and return.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates loggedIn status in the database.
*/
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
/**
* Function to log out a user.
* If no user is logged in, the function will return without logging out the user.
* If the user is successfully logged out, the function will update the database and sets loggedIn status to false.
* @returns {Promise<void>} Returns a promise that resolves when the function completes, no return.
*/
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
// Defining the expense categories
var expense_categories = {
    "1": "Food",
    "2": "Housing",
    "3": "Transportation",
    "4": "Health and wellness",
    "5": "Shopping",
    "6": "Entertainment",
    "7": "Other"
};
/**
* Adds a new expense to the database.
* If no user is logged in, the function will return without adding the expense.
* The user can choose to add an expense manually or import from a CSV file.
* If manual, the function will ask for amount, date, category, and description.
* The function will then add the expense to the database and update the account balance.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, no return.
*/
function addExpense() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, question, inputfile, amount, date, categoryName, description, expense, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (active_account === "") {
                        console.log("No user is logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, askQuestion("Do you want to add manually or import from CSV? (manual/csv): ")];
                case 2:
                    question = _a.sent();
                    if (!(question === "csv")) return [3 /*break*/, 5];
                    return [4 /*yield*/, askQuestion("Enter the name of the CSV file: ")];
                case 3:
                    inputfile = _a.sent();
                    return [4 /*yield*/, csvparser(inputfile)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 6:
                    amount = _a.sent();
                    return [4 /*yield*/, askValidDate("Enter Valid date")];
                case 7:
                    date = _a.sent();
                    return [4 /*yield*/, askCategorySelection("What category do you want to change this purchase to be in?")];
                case 8:
                    categoryName = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter description: ")];
                case 9:
                    description = _a.sent();
                    expense = {
                        amount: parseInt(amount),
                        category: categoryName,
                        date: date,
                        username: active_account,
                        description: description
                    };
                    return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
                case 10:
                    _a.sent();
                    console.log("Expense added successfully!");
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 11:
                    account = _a.sent();
                    if (!account) return [3 /*break*/, 13];
                    account.balance -= parseInt(amount);
                    return [4 /*yield*/, (0, account_1.updateBalance)(account.accountOwner, account.balance)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
/**
* Function that creates a delay for a specified number of milliseconds.
* @param {number} ms - number of milliseconds to wait
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function wait(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
/**
* Function to change or delete an expense.
* If no user is logged in, the function will return without changing or deleting the expense.
* The user can choose to change or delete an expense.
* If changing, the function will ask for the description and date of the expense to change, then ask for the new details.
* The function will then update the expense in the database.
* If deleting, the function will ask for the date and description of the expense to delete.
* The function will then delete the expense from the database.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function change_or_delete_expense() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, choice, _a, description, date, amount, categoryName, new_description, new_date, updated_expense, date2, description2;
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
                    return [4 /*yield*/, askValidDate("Enter date for the purchase you want to change")];
                case 5:
                    date = _b.sent();
                    console.log("Expense found, please enter the new details for the expense.");
                    return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 6:
                    amount = _b.sent();
                    return [4 /*yield*/, askCategorySelection("What category do you want to change this purchase to be in?")];
                case 7:
                    categoryName = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter new description: ")];
                case 8:
                    new_description = _b.sent();
                    return [4 /*yield*/, askValidDate("Enter new date")];
                case 9:
                    new_date = _b.sent();
                    updated_expense = {
                        amount: parseInt(amount),
                        category: categoryName,
                        date: date,
                        username: active_account,
                        description: new_description
                    };
                    return [4 /*yield*/, (0, expense_1.updateExpense)(active_account, new_date, description, updated_expense)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 11: return [4 /*yield*/, askValidDate("Enter date for the expense you want to delete")];
                case 12:
                    date2 = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter description for the expense you want to delete: ")];
                case 13:
                    description2 = _b.sent();
                    return [4 /*yield*/, (0, expense_1.deleteExpense)(active_account, date2, description2)];
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
/**
* Function to get expenses for a user.
* If no user is logged in, the function will return without getting the expenses.
* The user can choose to get all expenses, expenses by category, date, amount, or description.
* The function will then display the expenses based on the user's choice.
* The user can also export the expenses to a CSV file.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function getExpensesForUser() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, active_account, _a, expenses, categoryName, expenses_category, date, expenses_date, amount, expenses_amount, description, expenses_description;
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
                case 5: return [4 /*yield*/, askCategorySelection("What category do you want to change this purchase to be in?")];
                case 6:
                    categoryName = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByCategory)(active_account, categoryName)];
                case 7:
                    expenses_category = _b.sent();
                    console.log(expenses_category);
                    return [3 /*break*/, 20];
                case 8: return [4 /*yield*/, askValidDate("For which date do you want to see your expenses")];
                case 9:
                    date = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByDate)(active_account, date)];
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
/**
* Function for account options.
* If no user is logged in, the function will return without displaying the account options.
* The user can choose to get account information, change account information, or delete the account.
* The function will then display the account information, change the account information, or delete the account based on the user's choice.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
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
                    (0, expense_1.updateallaccountowner)(account.accountOwner, value);
                    return [3 /*break*/, 21];
                case 10:
                    if (!(typeof value === 'string' || isNaN(value))) return [3 /*break*/, 12];
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
/**
* Simple function that uses askquestion to wait for an input to continue.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function awaitUserInput() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            askQuestion("Press enter to continue: ");
            return [2 /*return*/];
        });
    });
}
/**
* Function that takes a csv file as input, the file is expenses that we want to add to expense database.
* If there are problems in the file nothing will happen. But if there are no problems the expense database and also the account balace will be updated.
* @param {string} inputfile - The file path to the file that should be added
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
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
                            fs.createReadStream(inputfile)
                                .pipe((0, csv_parser_1.default)())
                                .on("data", function (row) {
                                if (row.username !== active_account) {
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
                                    username: active_account,
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
/**
* Exports all the expenses for the active user to a csv file.
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function exportExpenseCsvFile() {
    return __awaiter(this, void 0, void 0, function () {
        var active_account, expenses, filename, writableStream, columns, csvContent;
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
                    writableStream = fs.createWriteStream(filename);
                    columns = ["amount", "category", "date", "accountOwner", "description"];
                    csvContent = (0, sync_1.stringify)(expenses, { header: true, columns: columns });
                    writableStream.write(csvContent);
                    writableStream.end();
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
/**
* A function to check if the user nears the limit set for their account, notifies based on much has been spent.
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function oncallCheckExpenseLimit() {
    return __awaiter(this, void 0, void 0, function () {
        var activeAccountUsername, activeAccount, accountLimit, totalSpent, percentUsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    activeAccountUsername = _a.sent();
                    if (!activeAccountUsername)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, account_1.getAccount)(activeAccountUsername)];
                case 2:
                    activeAccount = _a.sent();
                    accountLimit = activeAccount === null || activeAccount === void 0 ? void 0 : activeAccount.limit_account;
                    return [4 /*yield*/, (0, expense_1.get_total_expense_account)(activeAccountUsername)];
                case 3:
                    totalSpent = _a.sent();
                    if (!accountLimit || !totalSpent)
                        return [2 /*return*/];
                    percentUsed = totalSpent / accountLimit;
                    if (percentUsed >= 1) {
                        console.log("Alert: The account limit has been EXCEEDED! Currently at ".concat(percentUsed * 100, "% of the max."));
                    }
                    else if (percentUsed >= 0.75) {
                        console.log("Warning: The limit is almost reached (".concat((percentUsed * 100).toFixed(2), "% used)."));
                    }
                    else if (percentUsed >= 0.5) {
                        console.log("\u2139Notice: More than 50% of the limit has been used (".concat((percentUsed * 100).toFixed(2), "%)."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
