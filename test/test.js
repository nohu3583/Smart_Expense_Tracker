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
var expense_1 = require("../src/mongodb/expense");
var account_1 = require("../src/mongodb/account");
test("Test that amount of accounts is 0 initially", function () { return __awaiter(void 0, void 0, void 0, function () {
    var amount_user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.amount_of_accounts)()];
            case 1:
                amount_user = _a.sent();
                expect(amount_user).toStrictEqual(1);
                return [2 /*return*/];
        }
    });
}); });
test("Create account function", function () { return __awaiter(void 0, void 0, void 0, function () {
    var account, created_account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                account = {
                    accountOwner: "123456",
                    balance: 9000,
                    currency: "DKK",
                    username: "PKD",
                    password: "intehashed",
                    loggedIn: false,
                    limit_account: 2000
                };
                return [4 /*yield*/, (0, account_1.createAccount)(account)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, account_1.getAccount)(account.username)];
            case 2:
                created_account = _a.sent();
                expect(created_account.username).toStrictEqual(account.username);
                return [2 /*return*/];
        }
    });
}); });
var create_account;
test("Test that getAllUsernames function works", function () { return __awaiter(void 0, void 0, void 0, function () {
    var usernames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.getAllUsernames)()];
            case 1:
                usernames = _a.sent();
                expect(usernames).toStrictEqual(["bombaclat", "PKD"]); // Only the account created in the previous test
                return [2 /*return*/];
        }
    });
}); });
test("Amount of acounts should now be two instead of 1", function () { return __awaiter(void 0, void 0, void 0, function () {
    var amount_of_user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.amount_of_accounts)()];
            case 1:
                amount_of_user = _a.sent();
                expect(amount_of_user).toStrictEqual(2);
                return [2 /*return*/];
        }
    });
}); });
test("Testing that update balance function works as intented", function () { return __awaiter(void 0, void 0, void 0, function () {
    var new_balance, created_account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.updateBalance)("PKD", -8500)];
            case 1:
                _a.sent();
                new_balance = 500;
                return [4 /*yield*/, (0, account_1.getAccount)("PKD")];
            case 2:
                created_account = _a.sent();
                expect(created_account === null || created_account === void 0 ? void 0 : created_account.balance).toStrictEqual(new_balance);
                return [2 /*return*/];
        }
    });
}); });
test("Find active account returns the active account which right now is my test account", function () { return __awaiter(void 0, void 0, void 0, function () {
    var username;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.find_active_account)()];
            case 1:
                username = _a.sent();
                expect(username).toStrictEqual("bombaclat");
                return [2 /*return*/];
        }
    });
}); });
test("Switch logged in status for PKD account", function () { return __awaiter(void 0, void 0, void 0, function () {
    var active_account_status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.switch_logged_in_status)("PKD")];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, account_1.getAccount)("PKD")];
            case 2:
                active_account_status = _a.sent();
                expect(active_account_status === null || active_account_status === void 0 ? void 0 : active_account_status.loggedIn).toStrictEqual(true);
                return [2 /*return*/];
        }
    });
}); });
test("Update a specific feild on the PKD account (will update currency)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var active_account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.updates_specific_field)("currency", "PKD", "SEK")];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, account_1.getAccount)("PKD")];
            case 2:
                active_account = _a.sent();
                expect(active_account === null || active_account === void 0 ? void 0 : active_account.currency).toStrictEqual("SEK"); //Currency is now updated from DKK to SEK
                return [2 /*return*/];
        }
    });
}); });
test("Delete account should delete the account for PKD", function () { return __awaiter(void 0, void 0, void 0, function () {
    var find_account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_1.deleteAccount)("PKD")];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, account_1.getAccount)("PKD")];
            case 2:
                find_account = _a.sent();
                expect(find_account).toStrictEqual(null);
                return [2 /*return*/];
        }
    });
}); });
//Tester för databas filen
test("There should be no expense logged when starting", function () { return __awaiter(void 0, void 0, void 0, function () {
    var expenses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, expense_1.getExpenses)("bombaclat")];
            case 1:
                expenses = _a.sent();
                expect(expenses).toStrictEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("Testing adding a expense to the database", function () { return __awaiter(void 0, void 0, void 0, function () {
    var expense, new_expense;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expense = {
                    amount: 200,
                    category: "Food",
                    date: new Date(2003, 6, 16),
                    username: "bombaclat",
                    description: "Dyr Kebabtalrik"
                };
                return [4 /*yield*/, (0, expense_1.addExpense)(expense)];
            case 1:
                _a.sent();
                new_expense = (0, expense_1.getExpenses)("PKD");
                console.log(new_expense);
                expect(new_expense).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
