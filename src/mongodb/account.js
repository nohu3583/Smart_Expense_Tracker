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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = createAccount;
exports.getAccount = getAccount;
exports.updateBalance = updateBalance;
exports.deleteAccount = deleteAccount;
exports.getAccountBalance = getAccountBalance;
exports.getAccountCurrency = getAccountCurrency;
const database_1 = require("./database");
const COLLECTION_NAME = "Account";
// Create a new account
function createAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        const result = yield db.collection(COLLECTION_NAME).insertOne(account);
        console.log("Account Created:", result.insertedId);
    });
}
// Get account by username
function getAccount(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        return db.collection(COLLECTION_NAME).findOne({ username });
    });
}
// Update account balance
function updateBalance(username, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        yield db.collection(COLLECTION_NAME).updateOne({ username }, { $inc: { balance: amount } });
        console.log("Balance Updated");
    });
}
// Delete account by username
function deleteAccount(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        yield db.collection(COLLECTION_NAME).deleteOne({ username });
        console.log("✅ Account Deleted");
    });
}
// Get account balance by username
function getAccountBalance(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return null;
        const account = yield db.collection(COLLECTION_NAME).findOne({ username }, { projection: { balance: 1, _id: 0 } });
        return account ? account.balance : null;
    });
}
// Get account currency by username
function getAccountCurrency(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return "";
        const account = yield db.collection(COLLECTION_NAME).findOne({ username }, { projection: { currency: 1, _id: 0 } });
        return account ? account.currency : "";
    });
}
