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
exports.addExpense = addExpense;
exports.getExpenses = getExpenses;
exports.getExpensesByCategory = getExpensesByCategory;
exports.getExpensesByDate = getExpensesByDate;
exports.getExpensesByAmount = getExpensesByAmount;
exports.deleteExpense = deleteExpense;
exports.updateExpense = updateExpense;
exports.getExpensesByDescription = getExpensesByDescription;
exports.updateallaccountowner = updateallaccountowner;
exports.deleteallexpense = deleteallexpense;
exports.get_total_expense_account = get_total_expense_account;
var database_1 = require("./database");
var COLLECTION_NAME = "Expense";
/**
* Adds a new expense based on user input.
* @param {Expense} expense - The expense that should be added to the expense database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes.
*/
function addExpense(expense) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).insertOne(expense)];
                case 2:
                    result = _a.sent();
                    console.log("Expense Added:", result.insertedId);
                    return [2 /*return*/];
            }
        });
    });
}
/**
* Get one or many expense records based on the given
* @param {string} username - The expense should be added to the expense database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes.
*/
function getExpenses(username) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).find({ username: username }).toArray()];
            }
        });
    });
}
function getExpensesByCategory(username, category) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).find({ username: username, category: category }).toArray()];
            }
        });
    });
}
function getExpensesByDate(accountOwner, date) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).find({ accountOwner: accountOwner, date: date }).toArray()];
            }
        });
    });
}
function getExpensesByAmount(accountOwner, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).find({ accountOwner: accountOwner, amount: amount }).toArray()];
            }
        });
    });
}
function getExpensesByDescription(accountOwner, description) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).find({ accountOwner: accountOwner, description: description }).toArray()];
            }
        });
    });
}
function deleteExpense(accountOwner, date, description) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).deleteOne({ accountOwner: accountOwner, description: description })];
                case 2:
                    result = _a.sent();
                    if (result.deletedCount === 0) {
                        console.log("Expense not found");
                    }
                    else {
                        console.log("Expense Deleted");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updateExpense(account, date, description, new_expense) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).updateOne({ accountOwner: account, date: date, description: description }, { $set: new_expense })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateallaccountowner(old_account, new_account) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).updateMany({ accountOwner: old_account }, { $set: { accountOwner: new_account } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteallexpense(account) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).deleteMany({ accountOwner: account })];
                case 2:
                    _a.sent();
                    console.log("All Expenses Deleted");
                    return [2 /*return*/];
            }
        });
    });
}
function get_total_expense_account(username) {
    return __awaiter(this, void 0, void 0, function () {
        var db, accounts, sum, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME)
                            .find({ username: username }, { projection: { amount: 1, _id: 0 } })
                            .toArray()];
                case 2:
                    accounts = _a.sent();
                    sum = 0;
                    for (i = 0; i < accounts.length; i++) {
                        sum += accounts[i].amount;
                    }
                    return [2 /*return*/, sum];
            }
        });
    });
}
