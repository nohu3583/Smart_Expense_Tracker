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
exports.createAccount = createAccount;
exports.getAccount = getAccount;
exports.updateBalance = updateBalance;
exports.deleteAccount = deleteAccount;
exports.amount_of_accounts = amount_of_accounts;
exports.find_active_account = find_active_account;
exports.getAllUsernames = getAllUsernames;
exports.switch_logged_in_status = switch_logged_in_status;
exports.updates_specific_field = updates_specific_field;
var database_js_1 = require("./database.js");
var COLLECTION_NAME = "Account";
/**
* Creates a new account in the mongodb account database.
* @param {Account} account - The account that should be created in database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates the database with the new account
*/
function createAccount(account) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).insertOne(account)];
                case 2:
                    result = _a.sent();
                    console.log("Account Created:", result.insertedId);
                    return [2 /*return*/];
            }
        });
    });
}
/**
* Returns a account based on the username given, if connection failed it returns undefined and if the username is not found null.

* @param {string} username - The username that should be found in the database.
* @precondition - no preconditions
* @returns {Promise<Account | undefined | null>} Returns a promise that resolves when the function completes, if found returns the entire account, if not found returns null
* and if the connection fails it returns undefined.
*/
function getAccount(username) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [2 /*return*/, db.collection(COLLECTION_NAME).findOne({ username: username })];
            }
        });
    });
}
/**
* Updates the account balance after a expense has been registered.
* @example
* Balance for user example_user goes from 9000 to 8500
* updateBalance(example_user, 500);
* @param {string} username - The username that should be found in the database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, if found returns the entire account, if not found returns null
* and if the connection fails it returns undefined.
*/
function updateBalance(username, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).updateOne({ username: username }, { $inc: { balance: amount } })];
                case 2:
                    _a.sent();
                    console.log("Balance Updated");
                    return [2 /*return*/];
            }
        });
    });
}
/**
* Deletes an account based on given username.
* @param {string} username - The username for account that should be deleted from the database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, if found deletes account, otherwise
* if the connection fails it returns undefined.
*/
function deleteAccount(username) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).deleteOne({ username: username })];
                case 2:
                    _a.sent();
                    console.log("Account Deleted");
                    return [2 /*return*/];
            }
        });
    });
}
/**
* Function to return the amount of account created
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<number>} Returns a promise that resolves when the function completes, returns the number of accounts created.
**/
function amount_of_accounts() {
    return __awaiter(this, void 0, void 0, function () {
        var db, accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).find().toArray()];
                case 2:
                    accounts = _a.sent();
                    return [2 /*return*/, accounts.length];
            }
        });
    });
}
/**
* Return the acitve account, based loggedin parameter.
* @example
* user1
* find_active_account()
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves when the function completes, returns the string of username.
**/
function find_active_account() {
    return __awaiter(this, void 0, void 0, function () {
        var db, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/, ""];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).findOne({ loggedIn: true }, { projection: { username: 1, _id: 0 } })];
                case 2:
                    account = _a.sent();
                    return [2 /*return*/, account ? account.username : ""];
            }
        });
    });
}
/**
* Returns the array of all users that have been created.
* @example
* [user1, user2, user3]
* getAllUsernames();
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<string[]>} Returns a promise that resolves when the function completes, returns array of the users created.
**/
function getAllUsernames() {
    return __awaiter(this, void 0, void 0, function () {
        var db, accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, db.collection(COLLECTION_NAME)
                            .find({}, { projection: { username: 1, _id: 0 } }) // Only fetch `username`
                            .toArray()];
                case 2:
                    accounts = _a.sent();
                    return [2 /*return*/, accounts.map(function (account) { return account.username; })];
            }
        });
    });
}
/**
* Updates a specific feild based on what the user wants to change.
* @param {string} fieldName - The name of the field that the user wants to check.
* @param {string} account - The account that should be changed.
* @param {number | string} value - The new value that should be changed to.
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves when the function completes, updates the database on a specific field based on
* what the user wants.
**/
function updates_specific_field(fieldName, account, value) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _b.sent();
                    if (!db)
                        return [2 /*return*/];
                    if (!fieldName) {
                        console.log("Invalid field selection.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).updateOne({ username: account }, { $set: (_a = {}, _a[fieldName] = value, _a) })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function switch_logged_in_status(username) {
    return __awaiter(this, void 0, void 0, function () {
        var db, account, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, database_js_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    if (!db)
                        return [2 /*return*/];
                    return [4 /*yield*/, getAccount(username)];
                case 2:
                    account = _a.sent();
                    status = account === null || account === void 0 ? void 0 : account.loggedIn;
                    if (status === true) {
                        status = false;
                    }
                    else {
                        status = true;
                    }
                    return [4 /*yield*/, db.collection(COLLECTION_NAME).updateOne({ username: username }, { $set: { loggedIn: status } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
