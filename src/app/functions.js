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
exports.fetchExchangeRate = fetchExchangeRate;
var readline = require("readline");
var account_1 = require("../mongodb/account");
var expense_1 = require("../mongodb/expense");
var crypto = require("crypto");
var fs = require("fs");
var csv = require("csv-parser");
var csv_writer_1 = require("csv-writer");
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
        var date, isValid, dateStr, normalizedDateStr, _a, year, month, day, adjustedMonth;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isValid = false;
                    _b.label = 1;
                case 1: return [4 /*yield*/, askQuestion(prompt)];
                case 2:
                    dateStr = _b.sent();
                    normalizedDateStr = dateStr.replace(/\//g, '-');
                    _a = normalizedDateStr.split('-').map(Number), year = _a[0], month = _a[1], day = _a[2];
                    adjustedMonth = month - 1;
                    date = new Date(year, adjustedMonth, day);
                    if (isNaN(date.getTime())) {
                        console.log("Invalid date format. Please try again (expected format: YYYY/MM/DD).");
                    }
                    else {
                        isValid = true;
                    }
                    _b.label = 3;
                case 3:
                    if (!isValid) return [3 /*break*/, 1];
                    _b.label = 4;
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
* @precondition - no precondition
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
        var username, password, hashed_password, account_number, balance, currency, question, account_limit, account;
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
                    return [4 /*yield*/, askQuestion("Do you want to add limit on your account(yes/no)")];
                case 8:
                    question = _a.sent();
                    account_limit = undefined;
                    if (!(question === "yes")) return [3 /*break*/, 10];
                    return [4 /*yield*/, askQuestion("What limit on spending should this account have per 30 days(optional)")];
                case 9:
                    account_limit = _a.sent();
                    _a.label = 10;
                case 10:
                    account = {
                        accountOwner: account_number,
                        balance: parseInt(balance),
                        currency: currency,
                        username: username,
                        password: hashed_password,
                        loggedIn: false,
                        limit_account: account_limit ? parseFloat(account_limit) : undefined
                    };
                    console.log("Account created successfully!");
                    return [4 /*yield*/, (0, account_1.createAccount)(account)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [2 /*return*/];
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
var currencyCodes = [
    "AFA", "ALL", "DZD", "AOA", "ARS", "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYR", "BEF", "BZD", "BMD", "BTN", "BTC", "BOB", "BAM", "BWP", "BRL", "GBP", "BND", "BGN", "BIF", "KHR", "CAD", "CVE", "KYD", "XOF", "XAF", "XPF", "CLP", "CLF", "CNY", "COP", "KMF", "CDF", "CRC", "HRK", "CUC", "CZK", "DKK", "DJF", "DOP", "XCD", "EGP", "ERN", "EEK", "ETB", "EUR", "FKP", "FJD", "GMD", "GEL", "DEM", "GHS", "GIP", "GRD", "GTQ", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "INR", "IDR", "IRR", "IQD", "ILS", "ITL", "JMD", "JPY", "JOD", "KZT", "KES", "KWD", "KGS", "LAK", "LVL", "LBP", "LSL", "LRD", "LYD", "LTC", "LTL", "MOP", "MKD", "MGA", "MWK", "MYR", "MVR", "MRO", "MUR", "MXN", "MDL", "MNT", "MAD", "MZM", "MMK", "NAD", "NPR", "ANG", "TWD", "NZD", "NIO", "NGN", "KPW", "NOK", "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "RON", "RUB", "RWF", "SVC", "WST", "STD", "SAR", "RSD", "SCR", "SLL", "SGD", "SKK", "SBD", "SOS", "ZAR", "KRW", "SSP", "XDR", "LKR", "SHP", "SDG", "SRD", "SZL", "SEK", "CHF", "SYP", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT", "UGX", "UAH", "AED", "UYU", "USD", "UZS", "VUV", "VEF", "VND", "YER", "ZMK", "ZWL"
];
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
        var active_account, question, inputfile, amount, date, categoryName, description, currency, converted_amount, account, exchangerate, error_1, expense, amount_change;
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
                    if (!(question === "csv")) return [3 /*break*/, 6];
                    return [4 /*yield*/, askQuestion("Enter the file of path of your csv file: ")];
                case 3:
                    inputfile = _a.sent();
                    return [4 /*yield*/, csvparser(inputfile)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, oncallCheckExpenseLimit()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6: return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 7:
                    amount = _a.sent();
                    return [4 /*yield*/, askValidDate("Enter Valid date, Format is YYYY/MM/DD :")];
                case 8:
                    date = _a.sent();
                    return [4 /*yield*/, askCategorySelection("What category do you want to change this purchase to be in?")];
                case 9:
                    categoryName = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter description: ")];
                case 10:
                    description = _a.sent();
                    return [4 /*yield*/, askQuestion("Enter the currency for this purchase")];
                case 11:
                    currency = (_a.sent()).toUpperCase();
                    _a.label = 12;
                case 12:
                    if (!!currencyCodes.includes(currency)) return [3 /*break*/, 14];
                    console.log("Not a supported currency, please write a real currency(3 letters)");
                    return [4 /*yield*/, askQuestion("Enter the currency for this purchase")];
                case 13:
                    currency = (_a.sent()).toUpperCase();
                    return [3 /*break*/, 12];
                case 14:
                    converted_amount = parseFloat(amount);
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 15:
                    account = _a.sent();
                    exchangerate = undefined;
                    if (!(account.currency !== currency)) return [3 /*break*/, 19];
                    _a.label = 16;
                case 16:
                    _a.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, fetchExchangeRate(currency, account.currency)];
                case 17:
                    exchangerate = _a.sent();
                    converted_amount = parseFloat(amount) * exchangerate;
                    return [3 /*break*/, 19];
                case 18:
                    error_1 = _a.sent();
                    console.log("Could not convert the currency, therefor expense not added");
                    return [3 /*break*/, 19];
                case 19:
                    expense = {
                        amount: converted_amount,
                        currency: currency,
                        category: categoryName,
                        date: date,
                        username: active_account,
                        description: description,
                        exchangerate: exchangerate
                    };
                    return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
                case 20:
                    _a.sent();
                    console.log("Expense added successfully!");
                    if (!account) return [3 /*break*/, 23];
                    amount_change = converted_amount * -1;
                    return [4 /*yield*/, (0, account_1.updateBalance)(active_account, amount_change)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, oncallCheckExpenseLimit()];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23: return [2 /*return*/];
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
        var active_account, choice, _a, description, date, amount, categoryName, new_description, new_currency, new_date, updated_expense, date2, description2;
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
                        case "2": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 16];
                case 3: return [4 /*yield*/, askQuestion("Enter description for the expense you want to change: ")];
                case 4:
                    description = _b.sent();
                    return [4 /*yield*/, askValidDate("Enter date for the purchase you want to change. Format is YYYY/MM/DD")];
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
                    return [4 /*yield*/, askQuestion("What currency was this purchase made in")];
                case 9:
                    new_currency = _b.sent();
                    return [4 /*yield*/, askValidDate("Enter new date, Format is YYYY/MM/DD")];
                case 10:
                    new_date = _b.sent();
                    updated_expense = {
                        amount: parseInt(amount),
                        currency: new_currency,
                        category: categoryName,
                        date: date,
                        username: active_account,
                        description: new_description
                    };
                    return [4 /*yield*/, (0, expense_1.updateExpense)(active_account, new_date, description, updated_expense)];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 17];
                case 12: return [4 /*yield*/, askValidDate("Enter date for the expense you want to delete, Format is YYYY/MM/DD")];
                case 13:
                    date2 = _b.sent();
                    return [4 /*yield*/, askQuestion("Enter description for the expense you want to delete: ")];
                case 14:
                    description2 = _b.sent();
                    return [4 /*yield*/, (0, expense_1.deleteExpense)(active_account, date2, description2)];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 17];
                case 16:
                    console.log("Invalid option. Try again.");
                    _b.label = 17;
                case 17: return [2 /*return*/];
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
        var choice, active_account, _a, expenses, awaits, categoryName, expenses_category, date, expenses_date, amount, expenses_amount, description, expenses_description;
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
                        case "2": return [3 /*break*/, 6];
                        case "3": return [3 /*break*/, 9];
                        case "4": return [3 /*break*/, 12];
                        case "5": return [3 /*break*/, 15];
                        case "6": return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 20];
                case 3: return [4 /*yield*/, (0, expense_1.getExpenses)(active_account)];
                case 4:
                    expenses = _b.sent();
                    console.log(expenses);
                    return [4 /*yield*/, askQuestion("press any button to continue")];
                case 5:
                    awaits = _b.sent();
                    return [3 /*break*/, 21];
                case 6: return [4 /*yield*/, askCategorySelection("What category do you want to change this purchase to be in?")];
                case 7:
                    categoryName = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByCategory)(active_account, categoryName)];
                case 8:
                    expenses_category = _b.sent();
                    console.log(expenses_category);
                    return [3 /*break*/, 21];
                case 9: return [4 /*yield*/, askValidDate("For which date do you want to see your expenses, Format is YYYY/MM/DD")];
                case 10:
                    date = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByDate)(active_account, date)];
                case 11:
                    expenses_date = _b.sent();
                    console.log(expenses_date);
                    return [3 /*break*/, 21];
                case 12: return [4 /*yield*/, askQuestion("Enter amount: ")];
                case 13:
                    amount = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByAmount)(active_account, parseInt(amount))];
                case 14:
                    expenses_amount = _b.sent();
                    console.log(expenses_amount);
                    return [3 /*break*/, 21];
                case 15: return [4 /*yield*/, askQuestion("Enter description: ")];
                case 16:
                    description = _b.sent();
                    return [4 /*yield*/, (0, expense_1.getExpensesByDescription)(active_account, description)];
                case 17:
                    expenses_description = _b.sent();
                    console.log(expenses_description);
                    return [3 /*break*/, 21];
                case 18: return [4 /*yield*/, exportExpenseCsvFile()];
                case 19:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 20:
                    console.log("Invalid option. Try again.");
                    _b.label = 21;
                case 21: return [2 /*return*/];
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
                        case "3": return [3 /*break*/, 31];
                    }
                    return [3 /*break*/, 36];
                case 4:
                    console.log(account);
                    return [3 /*break*/, 37];
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
                        case "3": return [3 /*break*/, 15];
                        case "4": return [3 /*break*/, 18];
                        case "5": return [3 /*break*/, 21];
                        case "6": return [3 /*break*/, 23];
                    }
                    return [3 /*break*/, 27];
                case 8: return [4 /*yield*/, askQuestion("Enter new account number: ")];
                case 9:
                    value = _c.sent();
                    return [3 /*break*/, 28];
                case 10: return [4 /*yield*/, askQuestion("Enter new balance: ")];
                case 11:
                    value = _c.sent();
                    _c.label = 12;
                case 12:
                    if (!(isNaN(parseInt(value)) || parseInt(value) < 0)) return [3 /*break*/, 14];
                    console.log("Balance must be a positive number");
                    return [4 /*yield*/, askQuestion("Enter new balance: ")];
                case 13:
                    value = _c.sent();
                    return [3 /*break*/, 12];
                case 14: return [3 /*break*/, 28];
                case 15:
                    if (!(value.length !== 3)) return [3 /*break*/, 17];
                    return [4 /*yield*/, askQuestion("Enter new currency: ")];
                case 16:
                    value = (_c.sent()).toUpperCase();
                    if (value.length !== 3) {
                        console.log("Currency must be 3 characters long. Try again.");
                    }
                    return [3 /*break*/, 15];
                case 17: return [3 /*break*/, 28];
                case 18: return [4 /*yield*/, askQuestion("Enter new username: ")];
                case 19:
                    value = _c.sent();
                    return [4 /*yield*/, (0, expense_1.updateallusername)(account_to_be_changed.username, value)];
                case 20:
                    _c.sent();
                    return [3 /*break*/, 28];
                case 21: return [4 /*yield*/, askQuestion("Enter new password: ")];
                case 22:
                    value = _c.sent();
                    value = crypto.createHash('sha256').update(value).digest("hex");
                    return [3 /*break*/, 28];
                case 23: return [4 /*yield*/, askQuestion("Enter new limit for spending: ")];
                case 24:
                    value = _c.sent();
                    _c.label = 25;
                case 25:
                    if (!(isNaN(parseInt(value)) || parseInt(value) < 0)) return [3 /*break*/, 27];
                    console.log("The new account limit must be a positive number");
                    return [4 /*yield*/, askQuestion("Enter new balance: ")];
                case 26:
                    value = _c.sent();
                    return [3 /*break*/, 25];
                case 27:
                    console.log("Invalid option. Try again.");
                    return [2 /*return*/];
                case 28:
                    fieldNames = {
                        "1": "accountOwner",
                        "2": "balance",
                        "3": "currency",
                        "4": "username",
                        "5": "password",
                        "6": "limit_account"
                    };
                    if (!fieldNames[change_to]) return [3 /*break*/, 30];
                    return [4 /*yield*/, (0, account_1.updates_specific_field)(fieldNames[change_to], active_account, value)];
                case 29:
                    _c.sent();
                    console.log("Account updated successfully!");
                    _c.label = 30;
                case 30: return [3 /*break*/, 37];
                case 31: return [4 /*yield*/, askQuestion("Are you sure you want to delete your account? (yes/no): ")];
                case 32:
                    confirm_1 = _c.sent();
                    if (!(confirm_1.toLowerCase() === "yes")) return [3 /*break*/, 35];
                    return [4 /*yield*/, (0, account_1.deleteAccount)(active_account)];
                case 33:
                    _c.sent();
                    console.log("Account deleted successfully!");
                    return [4 /*yield*/, (0, expense_1.deleteallexpense)(active_account)];
                case 34:
                    _c.sent();
                    _c.label = 35;
                case 35: return [3 /*break*/, 37];
                case 36:
                    console.log("Invalid option. Try again.");
                    _c.label = 37;
                case 37: return [2 /*return*/];
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
            askQuestion("Press any button to continue: ");
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
        var active_account, results, account;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (!active_account) {
                        console.log("No user logged in!");
                        return [2 /*return*/];
                    }
                    results = [];
                    return [4 /*yield*/, (0, account_1.getAccount)(active_account)];
                case 2:
                    account = _a.sent();
                    if (!account) {
                        console.log("Account not found!");
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            fs.createReadStream(inputfile)
                                .pipe(csv())
                                .on('data', function (data) { return results.push(data); })
                                .on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                                var totalConvertedAmount, _loop_1, _i, results_1, row, change, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 9, , 10]);
                                            totalConvertedAmount = 0;
                                            _loop_1 = function (row) {
                                                var _b, year, month, day, adjustedMonth, date, categoryKey, currency, convertedAmount, exchangeRate, error_3, expense;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            // Validate CSV format
                                                            if (!row.Amount || !row.Date || !row.Category || !row.Description || !row.Currency) {
                                                                console.log("Skipping invalid row: ".concat(JSON.stringify(row)));
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            _b = row.Date.split('/').map(Number), year = _b[0], month = _b[1], day = _b[2];
                                                            adjustedMonth = month - 1;
                                                            date = new Date(year, adjustedMonth, day);
                                                            if (isNaN(date.getTime())) {
                                                                console.log("Skipping row with invalid date: ".concat(row.Date));
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            categoryKey = Object.keys(expense_categories).find(function (key) { return expense_categories[key] === row.Category; });
                                                            if (!categoryKey) {
                                                                console.log("Skipping row with invalid category: ".concat(row.Category));
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            currency = row.Currency.toUpperCase();
                                                            if (!currencyCodes.includes(currency)) {
                                                                console.log("Skipping row with invalid currency: ".concat(row.Currency));
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            convertedAmount = parseFloat(row.Amount);
                                                            if (!(currency !== account.currency)) return [3 /*break*/, 4];
                                                            _c.label = 1;
                                                        case 1:
                                                            _c.trys.push([1, 3, , 4]);
                                                            return [4 /*yield*/, fetchExchangeRate(currency, account.currency)];
                                                        case 2:
                                                            exchangeRate = _c.sent();
                                                            convertedAmount *= exchangeRate;
                                                            return [3 /*break*/, 4];
                                                        case 3:
                                                            error_3 = _c.sent();
                                                            console.log("Skipping row due to currency conversion error: ".concat(row.Amount));
                                                            return [2 /*return*/, "continue"];
                                                        case 4:
                                                            totalConvertedAmount += convertedAmount;
                                                            expense = {
                                                                amount: parseFloat(row.Amount),
                                                                currency: currency,
                                                                date: date,
                                                                category: row.Category,
                                                                description: row.Description,
                                                                username: active_account,
                                                                exchangerate: convertedAmount / parseFloat(row.Amount),
                                                            };
                                                            return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
                                                        case 5:
                                                            _c.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, results_1 = results;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < results_1.length)) return [3 /*break*/, 4];
                                            row = results_1[_i];
                                            return [5 /*yield**/, _loop_1(row)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            if (!(account.balance >= totalConvertedAmount)) return [3 /*break*/, 6];
                                            change = totalConvertedAmount * -1;
                                            return [4 /*yield*/, (0, account_1.updateBalance)(account.accountOwner, change)];
                                        case 5:
                                            _a.sent();
                                            console.log("Account balance updated");
                                            return [3 /*break*/, 7];
                                        case 6:
                                            console.log("Insufficient balance for expenses");
                                            _a.label = 7;
                                        case 7:
                                            console.log("Successfully imported ".concat(results.length, " expenses"));
                                            return [4 /*yield*/, oncallCheckExpenseLimit()];
                                        case 8:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 10];
                                        case 9:
                                            error_2 = _a.sent();
                                            reject(error_2);
                                            return [3 /*break*/, 10];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .on('error', function (error) { return reject(error); });
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
        var active_account, expenses, filename, csvWriter, records;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 1:
                    active_account = _a.sent();
                    if (!active_account) {
                        console.log("No user logged in!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, expense_1.getExpenses)(active_account)];
                case 2:
                    expenses = _a.sent();
                    filename = "".concat(active_account, "_expenses_").concat(new Date().toISOString().slice(0, 10), ".csv");
                    csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                        path: filename,
                        header: [
                            { id: 'amount', title: 'Amount' },
                            { id: 'category', title: 'Category' },
                            { id: 'date', title: 'Date' },
                            { id: 'description', title: 'Description' }
                        ]
                    });
                    records = expenses.map(function (expense) { return ({
                        amount: expense.amount,
                        category: expense.category,
                        date: expense.date.toISOString().split('T')[0],
                        description: expense.description
                    }); });
                    return [4 /*yield*/, csvWriter.writeRecords(records)];
                case 3:
                    _a.sent();
                    console.log("Exported ".concat(expenses.length, " expenses to ").concat(filename));
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
/**
* A function to get excange rates for currency pairs, will be used for exhanges not made in the accounts base currency
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
function fetchExchangeRate(fromCurrency, toCurrency) {
    return __awaiter(this, void 0, void 0, function () {
        var API_KEY, url, answer, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    API_KEY = "e456750106a89fb5147294e2";
                    url = "https://v6.exchangerate-api.com/v6/".concat(API_KEY, "/pair/").concat(fromCurrency, "/").concat(toCurrency);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    answer = _a.sent();
                    return [4 /*yield*/, answer.json()];
                case 3:
                    data = _a.sent();
                    if (data.result === "success") {
                        return [2 /*return*/, data.conversion_rate];
                    }
                    else {
                        throw new Error("Failed to fetch exchange rate");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Error fetching exchange rate:", error_4);
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
