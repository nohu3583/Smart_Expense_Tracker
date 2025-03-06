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
exports.addExpense = addExpense;
exports.getExpenses = getExpenses;
exports.getExpensesByCategory = getExpensesByCategory;
exports.getExpensesByDate = getExpensesByDate;
exports.getExpensesByAmount = getExpensesByAmount;
exports.deleteExpense = deleteExpense;
exports.updateExpense = updateExpense;
const database_1 = require("./database");
const COLLECTION_NAME = "Expense";
// Add a new expense
function addExpense(expense) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        const result = yield db.collection(COLLECTION_NAME).insertOne(expense);
        console.log("✅ Expense Added:", result.insertedId);
    });
}
// Get expenses for an account
function getExpenses(accountOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        return db.collection(COLLECTION_NAME).find({ accountOwner }).toArray();
    });
}
function getExpensesByCategory(accountOwner, category) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        return db.collection(COLLECTION_NAME).find({ accountOwner, category }).toArray();
    });
}
function getExpensesByDate(accountOwner, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        return db.collection(COLLECTION_NAME).find({ accountOwner, date }).toArray();
    });
}
function getExpensesByAmount(accountOwner, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        return db.collection(COLLECTION_NAME).find({ accountOwner, amount }).toArray();
    });
}
function deleteExpense(accountOwner, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        yield db.collection(COLLECTION_NAME).deleteOne({ accountOwner, description });
        console.log("Expense Deleted");
    });
}
function updateExpense(accountOwner, description, amount, category, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.connectDB)();
        if (!db)
            return;
        yield db.collection(COLLECTION_NAME).updateOne({ accountOwner, description }, { $set: { amount, category, date } });
        console.log("Expense Updated");
    });
}
